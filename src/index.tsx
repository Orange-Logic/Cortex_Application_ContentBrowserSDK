import './styles.css';

import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';

import { App } from '@/App';
import { AppContextType } from '@/AppContext';
import {
  GlobalConfigContext,
  ImageCardDisplayInfo,
} from '@/GlobalConfigContext';
import { store } from '@/store';
import { resetImportStatus, setSelectedAssetId } from '@/store/assets/assets.slice';
import {
  initAuthInfoFromCache,
  setUseHeaders,
  setUserConfigSiteUrl,
} from '@/store/auth/auth.slice';

import { assetsApi } from './store/assets/assets.api';
import { searchApi } from './store/search/search.api';
import { userApi } from './store/user/user.api';

type OrangeDAMContentBrowser = {
  help: () => void;
  open: (config: {
    /**
     * Callback when asset(s) selected (deprecated)
     * @returns
     */
    onImageSelected: AppContextType['onImageSelected'];
    /**
     * Callback when asset(s) selected
     * @returns
     */
    onAssetSelected: AppContextType['onAssetSelected'];
    /**
     * Callback when we have any error while using content browser
     */
    onError: AppContextType['onError'];
    /**
     * Callback when we close the content browser
     */
    onClose: () => void;
    /**
     * Callback when we need to request a token
     */
    onRequestToken?: () => Promise<string>;
    /**
     * Callback when we make an action on the asset
     */
    onAssetAction?: AppContextType['onAssetAction'];
    /**
     * Callback when the user clicks Connect button
     * Currently, it is used only for Canva integration
     * because Canva blocks the CBSDK from opening new tab
     * without using its predefined method.
     * https://www.canva.dev/docs/apps/design-guidelines/external-links/#only-open-links-with-requestopenexternalurl
     */
    onConnectClicked?: () => void;
    /**
     * Callback when the token is changed
     */
    onTokenChanged?: (token: string) => void;
    /**
     * whether you want to select multiple assets
     */
    multiSelect: boolean;
    /**
     * The containerId to inject to component to
     * If not defined, we will create a new popup inside
     */
    containerId?: string;
    /**
     * User can request for extra field via this config
     */
    extraFields?: string[];
    /**
     * Base url. If specified, we will prefill the site URL in the authentication page
     */
    baseUrl?: string;
    /**
     * Only show IIIF prefix. When enable, instead of return full IIIF image url, we will
     * only return the url before the {region}. IIIF link will have the format like below
     * {scheme}://{server}{/prefix}/{identifier}/{region}/{size}/{rotation}/{quality}.{format}
     *
     * E.g:
     * onlyIIIFPrefix = false
     * => https://local.orangelogic.com/IIIF3/Image/2Y1XC5O9J67/full/max/0.0/default.jpg
     *
     * onlyIIIFPrefix = true
     * => https://local.orangelogic.com/IIIF3/Image/2Y1XC5O9J67
     */
    onlyIIIFPrefix?: boolean;
    /**
     * Whether to display info on the asset card
     * default to true for all field
     */
    displayInfo?: ImageCardDisplayInfo;
    /**
     * The Public Application Name.
     * By default, it will be OrangeDAM.
     */
    publicApplicationName?: string;
    /**
     * The plugin short name.
     * By default, it will be OrangeDAM Content Browser.
     */
    pluginName?: string;
    /**
     * The CTA text for the content browser
     * default to "Insert"
     */
    ctaText?: string;
    /**
     * The persist mode for the content browser which will prevent the browser from closing after selecting asset
     * default to false
     */
    persistMode?: boolean;
    /**
     * The allowed extensions to be selected
     */
    allowedExtensions?: string[];
    /**
     * The allowed folders to be selected
     * If not provided, all folders will be allowed
     */
    allowedFolders?: string[];
    /**
     * The available subtypes for the content browser
     */
    availableDocTypes?: string[];
    /**
     * The supported subtypes for inserting representative image
     */
    availableRepresentativeSubtypes?: string[];
    /**
     * The flag to show collections
     */
    showCollections?: boolean;
    /**
     * The flag to show the favorite folder
     */
    showFavoriteFolder?: boolean;
    /**
     * The flag to show versions
     */
    showVersions?: boolean;
    /**
     * The session id to use for the content browser
     */
    useSession?: string;
    /**
     * The flag to keep the last folder selected between sessions
     */
    lastLocationMode?: boolean;
    /**
     * The flag to turn on/off tracking parameters for links
     */
    allowTracking?: boolean;

    /**
     * The flag to allow the user to select proxy
     */
    allowProxy?: boolean;

    /**
     * The flag to allow the user to select favorites
     */
    allowFavorites?: boolean;

    /**
     * The flag to allow the user to logout
     */
    allowLogout?: boolean;

    /**
     * The flag to toggle between loading external fonts from direct links and from internal CSS file
     */
    loadExternalFonts?: boolean;
  }) => Promise<void>;
  close: () => void;
  previewAsset?: (assetId: string) => void;
  /**
   * Global function which mirrored the behavior of onAssetSelected
   */
  _onAssetSelected?: AppContextType['onAssetSelected'];
  /**
   * Global function which mirrored the behavior of onImageSelected (deprecated)
   */
  _onImageSelected?: AppContextType['onImageSelected'];
  /**
   * Global function which mirrored the behavior of onError
   */
  _onError?: AppContextType['onError'];
  /**
   * Global function which mirrored the behavior of onClose
   */
  _onClose?: () => void;
  /**
   * Global function which mirrored the behavior of onRequestToken
   */
  _onRequestToken?: () => Promise<{
    token: string;
    siteUrl?: string;
  }>;
  /**
   * Global function which mirrored the behavior of onAssetAction
   */
  _onAssetAction?: AppContextType['onAssetAction'];
};

declare global {
  interface Window {
    OrangeDAMContentBrowser: OrangeDAMContentBrowser;
  }

  interface URLSearchParams {
    Token?: string;
  }
}

const ContentBrowser: OrangeDAMContentBrowser = {
  help: () => {
    console.log(`/* Orange DAM Content Browser SDK Example */
      window.OrangeDAMContentBrowser.open({
        onAssetSelected: (assets) => {
          // Callback function triggered when assets are selected
          console.log(assets);
          window.open(assets[0]?.imageUrl, '_blank');
        },
        onError: (errorMessage, error) => {
          // Callback function triggered when an error occurs
          console.error(errorMessage, error);
        },
        onClose: () => {
          // Callback function triggered when the browser is closed
          window.alert('Content Browser is closing');
        },
        containerId: "", // ID of the container to attach the browser; opens in a popup if blank
        extraFields: ['coreField.OriginalFileName', 'document.CortexPath'], // Additional fields to retrieve from the assets
        baseUrl: "", // Default base URL to pre-fill in the content browser
        displayInfo: {
          title: true, // Whether to display the asset title
          dimension: true, // Whether to display the asset dimensions
          fileSize: false, // Whether to display the file size
          tags: false, // Whether to display the asset tags
        },
        publicApplicationName: "", // Public name of the DAM to display on the login screen
        pluginName: "OrangeDAM Content Browser", // Name of the plugin to display on the login screen
        ctaText: "Insert", // Text to display on the insert button
        persistMode: true, // Whether the browser remains open after selecting an asset
        availableDocTypes: ['Images*', 'Videos*', 'Audio*', 'Others*'], // An array of available OrangeDAM asset types to filter the assets. The available doc types will be configured in OL Platform. If not provided, all doc types will be available. 
        availableRepresentativeSubtypes: ['Other'], // Array of supported subtypes for representative images
        showCollections: true, // Whether to show collections in the content browser
        lastLocationMode: true, // Whether to open the last selected folder on load
        allowTracking: true, // Whether to enable tracking parameters for asset URLs
      });`);
  },
  open: async ({
    onAssetAction,
    onAssetSelected,
    onImageSelected,
    onError,
    onClose,
    onRequestToken,
    onTokenChanged,
    availableRepresentativeSubtypes,
    allowedExtensions,
    allowedFolders,
    availableDocTypes,
    baseUrl,
    containerId,
    ctaText,
    displayInfo = {
      title: true,
      dimension: true,
      fileSize: false,
      tags: false,
    },
    extraFields,
    lastLocationMode,
    loadExternalFonts,
    multiSelect,
    persistMode,
    publicApplicationName,
    pluginName,
    showCollections,
    showFavoriteFolder,
    showVersions,
    useSession,
    allowTracking,
    allowProxy,
    allowFavorites,
    allowLogout,
    onConnectClicked,
  }) => {
    let container = containerId && document.getElementById(containerId);
    if (!containerId) {
      container = document.body;
    } else if (!container) {
      console.error(`Container with id ${containerId} is not found`);
      return;
    }
    let pickerRoot: HTMLDivElement | null = container.querySelector(
      '#cortex-asset-picker-root',
    );
    if (!pickerRoot) {
      //?? if not found, create a new one
      pickerRoot = document.createElement('div');
      pickerRoot.id = 'cortex-asset-picker-root';
      pickerRoot.style.width = '100%';
      pickerRoot.style.height = '100%';
      pickerRoot.style.display = 'flex';
      pickerRoot.style.alignItems = 'center';
      pickerRoot.style.justifyContent = 'center';
      pickerRoot.style.position = 'relative';
      container.appendChild(pickerRoot);
    }
    const root = createRoot(pickerRoot);

    if (onRequestToken) {
      window.OrangeDAMContentBrowser._onRequestToken = () => {
        return onRequestToken().then((token) => {
          return { token, siteUrl: baseUrl };
        });
      };
    }

    // Dispatch some event before start render the APP
    if (baseUrl) {
      store.dispatch(setUserConfigSiteUrl(baseUrl));
    }

    if (onRequestToken) {
      store.dispatch(setUseHeaders(true));
    }

    store.dispatch(initAuthInfoFromCache());

    const errorHandler =
      typeof onError === 'function' && !!onError ? onError : console.log;
    const assetActionHandler =
      typeof onAssetAction === 'function' && !!onAssetAction
        ? onAssetAction
        : console.log;
    const assetSelectedHandler =
      typeof onAssetSelected === 'function' && !!onAssetSelected
        ? onAssetSelected
        : console.log;
    const imageSelectedHandler =
      typeof onImageSelected === 'function' && !!onImageSelected
        ? onImageSelected
        : console.log;
    const onTokenChangedHandler =
      typeof onTokenChanged === 'function' && !!onTokenChanged
        ? onTokenChanged
        : undefined;
    const handleClose = () => {
      store.dispatch(resetImportStatus());
      store.dispatch(searchApi.util.resetApiState());
      store.dispatch(assetsApi.util.resetApiState());
      store.dispatch(userApi.util.resetApiState());
      root.unmount();
      // Reset these function when close the Content Browser
      window.OrangeDAMContentBrowser._onAssetSelected = undefined;
      window.OrangeDAMContentBrowser._onImageSelected = undefined;
      window.OrangeDAMContentBrowser._onError = undefined;
      window.OrangeDAMContentBrowser._onClose = undefined;

      onClose?.();
    };
    window.OrangeDAMContentBrowser._onAssetAction = assetActionHandler;
    window.OrangeDAMContentBrowser._onAssetSelected = assetSelectedHandler;
    window.OrangeDAMContentBrowser._onImageSelected = imageSelectedHandler;
    window.OrangeDAMContentBrowser._onError = errorHandler;
    window.OrangeDAMContentBrowser._onClose = handleClose;

    root.render(
      <Provider store={store}>
        <GlobalConfigContext.Provider
          value={{
            allowedExtensions,
            allowedFolders,
            availableDocTypes,
            availableRepresentativeSubtypes,
            ctaText: ctaText ?? 'Insert',
            displayInfo,
            lastLocationMode:
              lastLocationMode !== undefined ? !!lastLocationMode : true,
            persistMode: !!persistMode,
            pluginInfo: {
              publicApplicationName: publicApplicationName ?? '',
              pluginName: pluginName ?? 'OrangeDAM Content Browser',
            },
            isContentBrowserPopedup: !containerId,
            showCollections: !!showCollections,
            showFavoriteFolder: !!showFavoriteFolder,
            showVersions: !!showVersions,
            useSession,
            allowLogout: allowLogout !== undefined ? !!allowLogout : true,
            allowTracking: allowTracking !== undefined ? !!allowTracking : true,
            allowProxy: allowProxy !== undefined ? !!allowProxy : true,
            allowFavorites: !!allowFavorites,
          }}
        >
          <App
            containerId={containerId}
            extraFields={extraFields}
            loadExternalFonts={loadExternalFonts}
            multiSelect={multiSelect}
            onError={errorHandler}
            onAssetAction={assetActionHandler}
            onAssetSelected={assetSelectedHandler}
            onImageSelected={imageSelectedHandler}
            onClose={handleClose}
            onConnectClicked={onConnectClicked!}
            onTokenChanged={onTokenChangedHandler}
            
          />
        </GlobalConfigContext.Provider>
      </Provider>,
    );
  },
  close: () => {
    window.OrangeDAMContentBrowser._onClose?.();
  },
  previewAsset: (recordId: string) => {
    store.dispatch(setSelectedAssetId(recordId));
  },
};

window.OrangeDAMContentBrowser = ContentBrowser;

export default ContentBrowser;
