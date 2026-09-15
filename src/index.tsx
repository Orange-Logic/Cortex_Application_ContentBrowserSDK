import './styles.css';

export { default as CxContentBrowser } from './components/content-browser/content-browser';

import { createRef } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';

import { App } from '@/App';
import type { AssetsPickerHandle } from './view/AssetsPicker';
import { AppContextType } from '@/AppContext';
import {
  CtaTextTransform,
  GlobalConfigContext,
  ImageCardDisplayInfo,
} from '@/GlobalConfigContext';
import { store } from '@/store';
import { TableColumn } from '@/types/content-browser';
import {
  initAuthInfoFromCache,
  setUseHeaders,
  setUserConfigSiteUrl,
  setUseSession,
  setSiteSession,
} from '@/store/auth/auth.slice';
import { refreshAccessToken } from '@/utils/api';
import { abortAuthService } from '@/store/auth/auth.service';
import { resolveSiteSessionUrl } from '@/utils/site-session';
import { findFocusContainmentHost } from '@/utils/focus-containment';
import { Folder, GetContentRequest, GetContentResponse, GetFoldersRequest } from './types/search';

/**
 * Listen for 401 events from the design system's shared axios instance.
 * The design system dispatches `cx-unauthorized` whenever any of its requests get a 401;
 * this lets the SDK kick off the same token-refresh flow it uses for its own fetches.
 */
globalThis.addEventListener('cx-unauthorized', refreshAccessToken);

const assetsPickerRef = createRef<AssetsPickerHandle>();

type OrangeDAMContentBrowser = {
  help: () => void;
  open: (config: {
    /**
     * Callback when asset(s) selected (deprecated)
     * @returns
     */
    onImageSelected?: AppContextType['onImageSelected'];
    /**
     * Callback when asset(s) selected
     * @returns
     */
    onAssetSelected?: AppContextType['onAssetSelected'];

    /**
     * Callback when the app auth URL is copied
     * @returns
     */
    onAppAuthUrlCopied?: AppContextType['onAppAuthUrlCopied'];

    /**
     * Callback when we have any error while using content browser
     */
    onError?: AppContextType['onError'];
    /**
     * Callback when we close the content browser
     */
    onClose?: () => void;
    /**
     * Callback when we need to request a token
     */
    onRequestToken?: () => Promise<string>;
    /**
     * Callback when we make an action on the asset
     */
    onAssetAction?: AppContextType['onAssetAction'];
    /**
     * Callback to get pinned state of an asset by record id
     */
    getPinnedState?: AppContextType['getPinnedState'];
    /**
     * Callback when user pins an asset
     */
    onPinAsset?: AppContextType['onPinAsset'];
    /**
     * Callback when user unpins an asset
     */
    onUnpinAsset?: AppContextType['onUnpinAsset'];
    /**
     * Callback when the user clicks Connect button
     * Currently, it is used only for Canva integration
     * because Canva blocks the CBSDK from opening new tab
     * without using its predefined method.
     * https://www.canva.dev/docs/apps/design-guidelines/external-links/#only-open-links-with-requestopenexternalurl
     */
    onConnectClicked?: (url: string) => void;

    /**
     * Custom storage implementation for storing data
     */
    customStorage?: AppContextType['customStorage'];
    /**
     * Callback when the site url is changed
     * this is used to sync CBSDK site url with external integrations
     */
    onSiteUrlChanged?: (siteUrl: string) => void;
    /**
     * Callback when the token is changed
     */
    onTokenChanged?: (token: string) => void;
    /**
     * whether you want to select multiple assets
     */
    multiSelect?: boolean;
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
    /** Reuse the current Cortex site's browser session without requesting credentials. */
    useSiteSession?: boolean;
    /**
     * Only show IIIF prefix. When enable, instead of return full IIIF image url, we will
     * only return the url before the {region}. IIIF link will have the format like below
     * {scheme}://{server}{/prefix}/{identifier}/{region}/{size}/{rotation}/{quality}.{format}
     *
     * E.g:
     * onlyIIIFPrefix = false
     * => https://example.com/PREFIX/Image/RANDOMID/full/max/0.0/default.jpg
     *
     * onlyIIIFPrefix = true
     * => https://example.com/PREFIX/Image/RANDOMID
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
     * The text transform for the CTA text
     * Available values: 'none' | 'uppercase' | 'lowercase' | 'capitalize'
     * Default: 'capitalize'
     */
    ctaTextTransform?: CtaTextTransform;
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
     * Pick-only mode. Skips the available-proxies lookup and the transformation request made when
     * an asset is confirmed; the preview popup shows the asset's LargeSizePreview and confirming
     * emits the asset straight to `onAssetSelected`. Implies `allowProxy: false`.
     *
     * Note: because no GetAssetLink request is made, only the computed `extraFields`
     * (`ScrubUrl`, `AllowATSLink`) can be returned in this mode.
     */
    simplePick?: boolean;

    /**
     * The flag to allow the user to select favorites
     */
    allowFavorites?: boolean;

    /**
     * The flag to allow pin/unpin actions in format dialog
     */
    allowFormatDialogPin?: boolean;

    /**
     * The flag to allow the user to pin the browser
     */
    allowPin?: boolean;

    /**
     * The flag to allow the user to logout
     */
    allowLogout?: boolean;

    /**
     * The flag to toggle between loading external fonts from direct links and from internal CSS file
     */
    loadExternalFonts?: boolean;

    /**
     * The default view to be used when showing assets (default medium)
     * Available values: small, medium, large, table.
     * `table` only applies when `tableColumns` is also provided.
     */
    defaultGridView?: string;

    /**
     * The columns of the table view. Each column carries a `title` (the header text), a `field`
     * (the Cortex field it reads, e.g. "CoreField.Identifier") and optional
     * styling: `width` (a CSS grid track), `align` and `lines`.
     *
     * The table view is offered in the view menu only when this is set, and the fields listed here
     * are requested on every search — so an asset with no thumbnail, such as a text fragment,
     * becomes browsable and selectable by its metadata.
     */
    tableColumns?: TableColumn[];
  }) => Promise<void>;
  close: () => void;
  fetchAssets: (params: GetContentRequest) => Promise<GetContentResponse | undefined> | undefined;
  fetchFolders: (params: GetFoldersRequest) => Promise<{
    items: Folder[];
    totalCount: number;
  } | undefined> | undefined;
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
  /**
   * Global function which mirrored the behavior of customStorage
   */
  _customStorage?: AppContextType['customStorage'];
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
        getPinnedState: (recordId) => {
          // Callback function to get the pinned state of an asset
          return localStorage.getItem(\`pinned:\${recordId}\`) === 'true';
        },
        onPinAsset: async (recordId) => {
          // Callback function triggered when an asset is pinned
          localStorage.setItem(\`pinned:\${recordId}\`, 'true');
        },
        onUnpinAsset: async (recordId) => {
          // Callback function triggered when an asset is unpinned
          localStorage.removeItem(\`pinned:\${recordId}\`);
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
        ctaTextTransform: "capitalize", // Text transform: 'none', 'uppercase', 'lowercase', 'capitalize' (default: 'capitalize')
        persistMode: true, // Whether the browser remains open after selecting an asset
        availableDocTypes: ['Images*', 'Videos*', 'Audio*', 'Others*'], // An array of available OrangeDAM asset types to filter the assets. The available doc types will be configured in OL Platform. If not provided, all doc types will be available. 
        availableRepresentativeSubtypes: ['Other'], // Array of supported subtypes for representative images
        showCollections: true, // Whether to show collections in the content browser
        lastLocationMode: true, // Whether to open the last selected folder on load
        allowTracking: true, // Whether to enable tracking parameters for asset URLs
        allowFormatDialogPin: true, // Whether to show pin/unpin actions in format dialog
        tableColumns: [ // Columns of the table view; omit to offer grid views only
          { title: "Identifier", field: "CoreField.Identifier", width: "160px" },
          { title: "Title", field: "CoreField.TitleWithFallback", width: "minmax(0, 2fr)" },
          { title: "Description", field: "Document.CaptionLong", lines: 2 },
        ],
      });`);
  },
  open: async ({
    onAssetAction,
    getPinnedState,
    onAssetSelected,
    onAppAuthUrlCopied,
    onImageSelected,
    onError,
    onClose,
    onPinAsset,
    onRequestToken,
    onTokenChanged,
    onUnpinAsset,
    onConnectClicked,
    onSiteUrlChanged,
    customStorage,
    allowedExtensions,
    allowedFolders,
    allowFavorites,
    allowFormatDialogPin,
    allowPin,
    allowLogout,
    allowProxy,
    allowTracking,
    simplePick,
    availableDocTypes,
    availableRepresentativeSubtypes,
    baseUrl,
    containerId,
    ctaText,
    ctaTextTransform,
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
    pluginName,
    publicApplicationName,
    showCollections,
    showFavoriteFolder,
    showVersions,
    useSession,
    useSiteSession = false,
    defaultGridView,
    tableColumns,
  }) => {
    const siteSessionUrl = useSiteSession ? resolveSiteSessionUrl(baseUrl) : undefined;
    // !! Always assign this first to make sure that storage functionality works
    const customStorageHandlers =
      typeof customStorage === 'object' && !!customStorage
      && typeof customStorage.delete === 'function' && !!customStorage.delete
      && typeof customStorage.get === 'function' && !!customStorage.get
      && typeof customStorage.set === 'function' && !!customStorage.set
        ? customStorage
        : undefined;
    window.OrangeDAMContentBrowser._customStorage = customStorageHandlers;

    let container = containerId && document.getElementById(containerId);
    if (!containerId) {
      // Popup mode: if the host page has an active modal with a focus trap
      // (e.g. Drupal's jQuery UI Dialog), mount the picker inside it so its
      // inputs stay focusable; otherwise fall back to document.body. See 29KEV1.
      container = findFocusContainmentHost() ?? document.body;
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

    window.OrangeDAMContentBrowser._onRequestToken = undefined;
    if (!useSiteSession && onRequestToken) {
      window.OrangeDAMContentBrowser._onRequestToken = () => {
        return onRequestToken().then((token) => {
          return { token, siteUrl: baseUrl };
        });
      };
    }

    // Dispatch some event before start render the APP
    if (useSiteSession) {
      abortAuthService();
    }
    store.dispatch(setSiteSession(siteSessionUrl));
    if (!useSiteSession && baseUrl) {
      store.dispatch(setUserConfigSiteUrl(baseUrl));
    }

    store.dispatch(setUseHeaders(!useSiteSession && !!onRequestToken));

    // The API layer reads the session from the auth store, so the configured
    // session must be dispatched here — not only from the connect form, which
    // token-authenticated integrations never submit
    if (!useSiteSession && useSession) {
      store.dispatch(setUseSession(useSession));
    }

    if (!useSiteSession) {
      store.dispatch(initAuthInfoFromCache());
    }

    const errorHandler =
      typeof onError === 'function' && !!onError ? onError : console.log;
    const assetActionHandler =
      typeof onAssetAction === 'function' && !!onAssetAction
        ? onAssetAction
        : ()=>{};
    const assetSelectedHandler =
      typeof onAssetSelected === 'function' && !!onAssetSelected
        ? onAssetSelected
        : ()=>{};
    const appAuthUrlCopiedHandler =
      typeof onAppAuthUrlCopied === 'function' && !!onAppAuthUrlCopied
        ? onAppAuthUrlCopied
        : async (url: string)=>{
          await navigator.clipboard.writeText(url);
        };
    const imageSelectedHandler =
      typeof onImageSelected === 'function' && !!onImageSelected
        ? onImageSelected
        : ()=>{};
    const onTokenChangedHandler =
      typeof onTokenChanged === 'function' && !!onTokenChanged
        ? onTokenChanged
        : undefined;
    const getPinnedStateHandler =
      typeof getPinnedState === 'function' && !!getPinnedState
        ? getPinnedState
        : () => false;
    const onPinAssetHandler =
      typeof onPinAsset === 'function' && !!onPinAsset
        ? onPinAsset
        : undefined;
    const onUnpinAssetHandler =
      typeof onUnpinAsset === 'function' && !!onUnpinAsset
        ? onUnpinAsset
        : undefined;

    const handleClose = () => {
      root.unmount();
      // Reset these function when close the Content Browser
      window.OrangeDAMContentBrowser._onAssetSelected = undefined;
      window.OrangeDAMContentBrowser._onImageSelected = undefined;
      window.OrangeDAMContentBrowser._onError = undefined;
      window.OrangeDAMContentBrowser._onClose = undefined;
      window.OrangeDAMContentBrowser._customStorage = undefined;

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
            ctaTextTransform: ctaTextTransform ?? 'capitalize',
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
            showFavoriteFolder: showFavoriteFolder !== false,
            showVersions: !!showVersions,
            useSession: useSiteSession ? undefined : useSession,
            allowPin: !!allowPin,
            allowFormatDialogPin: !!allowFormatDialogPin,
            allowLogout: !useSiteSession && (allowLogout !== undefined ? !!allowLogout : true),
            allowTracking: allowTracking !== undefined ? !!allowTracking : true,
            allowProxy: simplePick ? false : (allowProxy !== undefined ? !!allowProxy : true),
            simplePick: !!simplePick,
            allowFavorites: !!allowFavorites,
            defaultGridView: defaultGridView ?? '',
            tableColumns: tableColumns ?? [],
          }}
        >
          <App
            containerId={containerId}
            extraFields={extraFields}
            loadExternalFonts={loadExternalFonts}
            multiSelect={!!multiSelect}
            onError={errorHandler}
            getPinnedState={getPinnedStateHandler}
            onAssetAction={assetActionHandler}
            onAssetSelected={assetSelectedHandler}
            onAppAuthUrlCopied={appAuthUrlCopiedHandler}
            onImageSelected={imageSelectedHandler}
            onPinAsset={onPinAssetHandler}
            onClose={handleClose}
            onConnectClicked={onConnectClicked}
            onTokenChanged={onTokenChangedHandler}
            onUnpinAsset={onUnpinAssetHandler}
            onSiteUrlChanged={onSiteUrlChanged}
            assetsPickerRef={assetsPickerRef}
          />
        </GlobalConfigContext.Provider>
      </Provider>,
    );
  },
  close: () => {
    window.OrangeDAMContentBrowser._onClose?.();
  },
  fetchAssets: (params: GetContentRequest) => {
    return assetsPickerRef.current?.fetchAssets(params);
  },
  fetchFolders: (params: GetFoldersRequest) => {
    return assetsPickerRef.current?.fetchFolders(params);
  },
  previewAsset: (recordId: string) => {
    return assetsPickerRef.current?.selectAsset(recordId);
  },
};

// Public host integration uses globalThis so the bundle works as a classic <script>
// (where `this` in the UMD wrapper is `window`) and matches nested `window` usage below.
(globalThis as unknown as Window).OrangeDAMContentBrowser = ContentBrowser;

export default ContentBrowser;
