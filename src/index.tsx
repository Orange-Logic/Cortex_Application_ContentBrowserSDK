import './styles.css';

import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';

import { App } from '@/App';
import { AppContextType } from '@/AppContext';
import { GlobalConfigContext, ImageCardDisplayInfo } from '@/GlobalConfigContext';
import { store } from '@/store';
import { resetImportStatus } from '@/store/assets/assets.slice';
import { initAuthInfoFromCache, setUserConfigSiteUrl } from '@/store/auth/auth.slice';

declare global {
  interface Window {
    CortexAssetPicker: {
      help: () => void,
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
         * Callback when we have any error while using asset picker
         */
        onError: AppContextType['onError'];
        /**
         * Callback when we close the asset picker
         */
        onClose: () => void;
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
         * The plugin name.
         * Should be defined when using GAB as a plugin for 3rd party app.
         */
        pluginName?: string;
        /**
         * The plugin short name.
         * By default, it will be the `pluginName`
         */
        pluginShortName?: string;

        /**
         * Whether to search in drive or not (used for File on demand)
         * default to false
         */
        searchInDrive?: boolean;
        /**
         * The CTA text for the asset picker
         * default to "Insert"
         */
        ctaText?: string;
        /**
         * The persist mode for the asset picker which will prevent the picker from closing after selecting asset
         * default to false
         */
        persistMode?: boolean;
        /**
         * The available subtypes for the asset picker
         */
        availableDocTypes?: string[];
        /**
         * The supported subtypes for inserting representative image
         */
        availableRepresentativeSubtypes?: string[];
        /**
         * The flag to show the collection
         */
        showCollections?: boolean;
        /**
         * The session id to use for the asset picker
         */
        useSession?: string
      }) => void,
      close: () => void,
      /**
       * Global function which mirrored the behavior of onAssetSelected
       */
      _onAssetSelected?: AppContextType['onAssetSelected'],
      /**
       * Global function which mirrored the behavior of onImageSelected (deprecated)
       */
      _onImageSelected?: AppContextType['onImageSelected'],
      /**
       * Global function which mirrored the behavior of onError
       */
      _onError?: AppContextType['onError'],
      /**
       * Global function to close the GAB
       */
      _onClose?: () => void,
    };
  }

  interface URLSearchParams {
    Token?: string;
  }
}

window.CortexAssetPicker = {
  help: () => {
    console.log(`/* Cortex Asset Picker Help */
    window.CortexAssetPicker.open({
      onAssetSelected: (images) => {
        // Do something with image
        console.log(images);
      },
      onError: (errorMessage, error) => {
        // Do something with error
      },
      multiSelect: true, // single or multiple file picker
      containerId: "react-app-root", // container element to attach, leave blank to open popup 
      extraFields: ["coreField.OriginalFileName", "document.CortexPath"], // extra asset fields to get
      baseUrl: "https://qa-latest.orangelogic.com", // default base url to pre-filled;
      onlyIIIFPrefix: true, // default is false will get full IIIF standard file link 
      displayInfo: {
        title: true,
        dimension: true,
        fileSize: true,
        tags: true,
      },
      pluginName: "Generic Asset Browser",
      pluginShortName: "GAB",
      searchInDrive: false,
      ctaText: "Insert",
      persistMode: false,
    });`);
  },
  open: ({ 
    onAssetSelected,
    onImageSelected, 
    onError, 
    onClose,
    availableRepresentativeSubtypes,
    availableDocTypes,
    baseUrl, 
    containerId,
    ctaText,
    displayInfo = {
      title: true,
      dimension: true,
      fileSize: true,
      tags: true,
    },
    extraFields, 
    multiSelect,
    persistMode,
    pluginName,
    pluginShortName,
    showCollections,
    searchInDrive,
    useSession,
  }) => {
    let container = containerId && document.getElementById(containerId);
    if (!containerId) {
      container = document.body;
    } else if (!container) {
      console.error(`Container with id ${containerId} is not found`);
      return;
    }
    let pickerRoot:HTMLDivElement | null = container.querySelector('#cortex-asset-picker-root');
    if (!pickerRoot)  {
      //?? if not found, create a new one
      pickerRoot = document.createElement('div') ;
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

    // Dispatch some event before start render the APP
    if (baseUrl) {
      store.dispatch(setUserConfigSiteUrl(baseUrl));
    }
    store.dispatch(initAuthInfoFromCache());

    const errorHandler         = (typeof onError === 'function' && !!onError) ? onError : console.log;
    const assetSelectedHandler = (typeof onAssetSelected === 'function' && !!onAssetSelected) ? onAssetSelected : console.log;
    const imageSelectedHandler = (typeof onImageSelected === 'function' && !!onImageSelected) ? onImageSelected : console.log;
    const handleClose = () => {
      store.dispatch(resetImportStatus());
      root.unmount();
      // Reset these function when close the GAB
      window.CortexAssetPicker._onAssetSelected = undefined;
      window.CortexAssetPicker._onImageSelected = undefined;
      window.CortexAssetPicker._onError         = undefined;
      window.CortexAssetPicker._onClose         = undefined;

      onClose?.();
    };
    window.CortexAssetPicker._onAssetSelected = assetSelectedHandler;
    window.CortexAssetPicker._onImageSelected = imageSelectedHandler;
    window.CortexAssetPicker._onError         = errorHandler;
    window.CortexAssetPicker._onClose         = handleClose;

    root.render(
      <Provider store={store}>
        <GlobalConfigContext.Provider value={{
          availableDocTypes,
          availableRepresentativeSubtypes,
          ctaText: ctaText ?? 'Insert',
          displayInfo,
          persistMode: !!persistMode,
          pluginInfo: {
            pluginName,
            pluginShortName: pluginShortName ?? pluginName,
          },
          isGABPopedup: !containerId,
          searchInDrive: !!searchInDrive,
          showCollections: !!showCollections,
          useSession,
        }}>
          <App
            containerId={containerId}
            extraFields={extraFields}
            multiSelect={multiSelect}
            onError={errorHandler}
            onAssetSelected={assetSelectedHandler}
            onImageSelected={imageSelectedHandler}
            onClose={handleClose} />
        </GlobalConfigContext.Provider>
      </Provider>,
    );
  },
  close: () => {
    window.CortexAssetPicker._onClose?.();
  },
};
