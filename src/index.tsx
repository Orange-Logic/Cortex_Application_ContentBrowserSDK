import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { App } from './App';
import { AppContextType, ImageCardDisplayInfo } from './AppContext';
import { store } from './store';
import { enableOnlyIIIFPrefix } from './store/assets/assets.slice';
import { initAuthInfoFromCache, setSiteUrl } from './store/auth/auth.slice';
import { setExtraFields } from './store/search/search.slice';
import './styles.css';

declare global {
  interface Window {
    CortexAssetPicker: {
      help: () => void,
      open: (config: {
        /**
         * Callback when asset(s) selected
         * @returns 
         */
        onImageSelected: AppContextType['onImageSelected'];
        /**
         * Callback when we have any error while using asset picker
         */
        onError: AppContextType['onError'];
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
      }) => void,
      /**
       * Global function which mirrored the behavior of onImageSelected
       */
      _onImageSelected?: AppContextType['onImageSelected'],
      /**
       * Global function which mirrored the behavior of onError
       */
      _onError?: AppContextType['onError'],
    };
  }
}

window.CortexAssetPicker = {
  help: () => {
    console.log(`/* Cortex Asset Picker Help */
    window.CortexAssetPicker.open({
      onImageSelected: (images) => {
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
    });`);
  },
  open: ({ 
    onImageSelected, 
    onError, 
    baseUrl, 
    onlyIIIFPrefix,
    multiSelect, 
    containerId, 
    extraFields, 
    displayInfo = {
      title: true,
      dimension: true,
      fileSize: true,
      tags: true,
    },
  }) => {
    let container = containerId && document.getElementById(containerId);
    if (!containerId) {
      container = document.body;
    } else {
      if (!container) {
        console.error(`Container with id ${containerId} is not found`);
        return;
      }
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
      container.appendChild(pickerRoot);
    }
    const root = createRoot(pickerRoot);

    // Dispatch some event before start render the APP
    store.dispatch(initAuthInfoFromCache());
    if (!!baseUrl) {
      store.dispatch(setSiteUrl(baseUrl));
    }
    if (extraFields) {
      store.dispatch(setExtraFields(extraFields));
    }
    if (typeof onlyIIIFPrefix === 'boolean' && onlyIIIFPrefix) {
      store.dispatch(enableOnlyIIIFPrefix());
    }

    const errorHandler         = (typeof onError === 'function' && !!onError) ? onError : console.log;
    const imageSelectedHandler = (typeof onImageSelected === 'function' && !!onImageSelected) ? onImageSelected : console.log;
    const onClose = () => {
      root.unmount();
      // Reset these function when close the GAB
      window.CortexAssetPicker._onImageSelected = undefined;
      window.CortexAssetPicker._onError         = undefined;
    };
    window.CortexAssetPicker._onImageSelected = imageSelectedHandler;
    window.CortexAssetPicker._onError         = errorHandler;

    root.render(
      <Provider store={store}>
          <App
            multiSelect={multiSelect}
            containerId={containerId}
            displayInfo={displayInfo}
            onError={errorHandler}
            onImageSelected={imageSelectedHandler}
            onClose={onClose} />
      </Provider>,
    );
  },
};
