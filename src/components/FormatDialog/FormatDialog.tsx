import _uniqBy from 'lodash-es/uniqBy';
import {
  CSSProperties, FC, useCallback, useEffect, useMemo, useReducer, useRef, useState,
} from 'react';

import { TrackingParameter, Transformation, TransformationAction, Unit } from '@/types/assets';
import { Asset, MediaType, Proxy } from '@/types/search';
import { convertPixelsToAspectRatio } from '@/utils/number';
import { rotateBox } from '@/utils/rotate';
import { CxDialog, CxDrawer, CxRequestCloseEvent, CxSelectEvent } from '@/web-component';

import CropPreviewer, { CropPreviewerHandle } from './CropPreviewer';
import CustomRendition from './CustomRendition';
import { Dialog, Drawer } from './FormatDialog.styled';
import Previewer from './Previewer';
import ProxyMenu from './ProxyMenu';
import TrackingParameters from './TrackingParameters';
import VersionHistory from './VersionHistory';

type Props = {
  allowCustomFormat: boolean;
  allowFavorites: boolean;
  allowProxy: boolean;
  allowTracking: boolean;
  autoExtension: string;
  availableExtensions?: Record<MediaType, { displayName: string; value: string }[]>;
  availableProxies?: Proxy[];
  ctaText?: string;
  extensions: string[];
  isFavorite?: boolean;
  maxHeight?: number;
  open: boolean;
  previewUrl?: string;
  selectedAsset: Asset | null;
  showVersions?: boolean;
  supportedRepresentativeSubtypes?: string[];
  variant?: 'dialog' | 'drawer';
  onClose: () => void;
  onFavorite: () => Promise<boolean>;
  onProxyConfirm: (value: {
    extension: string;
    permanentLink?: string;
    parameters?: TrackingParameter[];
    useRepresentative?: boolean;
    value: string;
  }) => void;
  onFormatConfirm: (value: {
    value: Transformation[];
    parameters?: TrackingParameter[];
    proxiesPreference?: string;
    extension?: string;
  }) => void;
  onUnFavorite: () => Promise<boolean>;
};

type State = {
  previewLoadable: boolean;
  defaultSize: {
    width: number;
    height: number;
  },
  selectedProxy: string;
  selectedFormat: {
    url: string;
    originalUrl: string;
    width: number;
    height: number;
    x: number;
    y: number;
    extension: string;
    rotation: number;
  };
  resizeSize: {
    width: number;
    height: number;
    unit: Unit;
  };
  lastResizeSize: Record<Unit, { width: number; height: number; unit: Unit; }>;
  cropSize: {
    width: number;
    height: number;
    percentageWidth: number;
    percentageHeight: number;
    x: number;
    y: number;
    unit: Unit;
  };
  lastCropSize: Record<Unit, {
    width: number;
    height: number;
    percentageWidth: number;
    percentageHeight: number;
    x: number;
    y: number;
    unit: Unit;
  }>;
  isLoadingFavorites: boolean;
  rotation: number;
  transformations: Transformation[];
  enabledTracking: boolean;
  trackingParameters: TrackingParameter[];
  showCustomRendition: boolean;
  showVersionHistory: boolean;
  useCustomRendition: boolean;
  useRepresentative: boolean;
  activeSetting: string;
  isLoading: boolean;
};

type Action =
  | { type: 'CANCEL_USE_CUSTOM_RENDITION'; payload: { width: number; height: number, url: string, originalUrl: string, extension: string } }
  | { type: 'CONFIRM_USE_CUSTOM_RENDITION' }
  | { type: 'RESET_DATA' }
  | { type: 'SET_ACTIVE_SETTING'; payload: string }
  | { type: 'SET_CROP_SIZE'; payload: Partial<State['cropSize']> }
  | { type: 'SET_DEFAULT_SIZE'; payload: Partial<State['defaultSize']> }
  | { type: 'SET_ENABLED_TRACKING'; payload: boolean }
  | { type: 'SET_LAST_RESIZE_SIZE'; payload: Partial<State['lastResizeSize']> }
  | { type: 'SET_LAST_CROP_SIZE'; payload: Partial<State['lastCropSize']> }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_LOADING_FAVORITES'; payload: boolean }
  | { type: 'SET_PREVIEW_LOADABLE'; payload: boolean }
  | { type: 'SET_RESIZE_SIZE'; payload: Partial<State['resizeSize']> }
  | { type: 'SET_ROTATION'; payload: number }
  | { type: 'SET_SELECTED_FORMAT'; payload: Partial<State['selectedFormat']> }
  | { type: 'SET_SELECTED_PROXY'; payload: string | { proxy: string; useCustomRendition?: boolean } }
  | { type: 'SET_SHOW_CUSTOM_RENDITION'; payload: boolean }
  | { type: 'SET_SHOW_VERSION_HISTORY'; payload: boolean }
  | { type: 'SET_TRACKING_PARAMETERS'; payload: TrackingParameter[] }
  | { type: 'SET_TRANSFORMATIONS'; payload: Transformation }
  | { type: 'SET_USE_REPRESENTATIVE'; payload: boolean };

const initialState: State = {
  previewLoadable: false,
  defaultSize: {
    width: 0,
    height: 0,
  },
  selectedProxy: '',
  selectedFormat: {
    url: '',
    originalUrl: '',
    width: 0,
    height: 0,
    x: 0,
    y: 0,
    extension: '',
    rotation: 0,
  },
  resizeSize: {
    width: 0,
    height: 0,
    unit: Unit.Pixel,
  },
  lastResizeSize: {
    [Unit.AspectRatio]: {
      width: 0,
      height: 0,
      unit: Unit.AspectRatio,
    },
    [Unit.Pixel]: {
      width: 0,
      height: 0,
      unit: Unit.Pixel,
    },
  },
  cropSize: {
    width: 0,
    height: 0,
    percentageWidth: 0,
    percentageHeight: 0,
    x: 0,
    y: 0,
    unit: Unit.Pixel,
  },
  lastCropSize: {
    [Unit.AspectRatio]: {
      width: 0,
      height: 0,
      percentageWidth: 0,
      percentageHeight: 0,
      x: 0,
      y: 0,
      unit: Unit.AspectRatio,
    },
    [Unit.Pixel]: {
      width: 0,
      height: 0,
      percentageWidth: 0,
      percentageHeight: 0,
      x: 0,
      y: 0,
      unit: Unit.Pixel,
    },
  },
  isLoadingFavorites: false,
  rotation: 0,
  transformations: [],
  enabledTracking: false,
  trackingParameters: [{
    key: 'UTM_source',
    value: '',
  }, {
    key: 'UTM_campaign',
    value: '',
  }, {
    key: 'UTM_description',
    value: '',
  }],
  showCustomRendition: false,
  showVersionHistory: false,
  useCustomRendition: false,
  useRepresentative: false,
  activeSetting: 'format',
  isLoading: false,
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'CANCEL_USE_CUSTOM_RENDITION':
      return {
        ...state,
        cropSize: {
          ...state.cropSize,
          width: action.payload.width,
          height: action.payload.height,
        },
        resizeSize: {
          ...state.resizeSize,
          width: action.payload.width,
          height: action.payload.height,
        },
        selectedFormat: {
          ...state.selectedFormat,
          ...action.payload,
          rotation: 0,
          x: 0,
          y: 0,
        },
        rotation: 0,
        transformations: [],
        showCustomRendition: false,
        useCustomRendition: false,
        activeSetting: 'resize',
      };
    case 'CONFIRM_USE_CUSTOM_RENDITION':
      return {
        ...state,
        cropSize: {
          ...state.cropSize,
          width: state.selectedFormat.width,
          height: state.selectedFormat.height,
        },
        resizeSize: {
          ...state.resizeSize,
          width: state.selectedFormat.width,
          height: state.selectedFormat.height,
        },
        rotation: 0,
        activeSetting: 'resize',
        showCustomRendition: false,
        useCustomRendition: true,
      };
    case 'SET_DEFAULT_SIZE':
      return {
        ...state,
        defaultSize: {
          ...state.defaultSize,
          ...action.payload,
        },
      };
    case 'RESET_DATA':
      return initialState;
    case 'SET_ACTIVE_SETTING':
      return {
        ...state,
        activeSetting: action.payload,
      };
    case 'SET_CROP_SIZE':
      return {
        ...state,
        cropSize: {
          ...state.cropSize,
          ...action.payload,
        },
      };
    case 'SET_ENABLED_TRACKING':
      return {
        ...state,
        enabledTracking: action.payload,
      };
    case 'SET_LAST_CROP_SIZE':
      return {
        ...state,
        lastCropSize: {
          ...state.lastCropSize,
          ...action.payload,
        },
      };
    case 'SET_LAST_RESIZE_SIZE':
      return {
        ...state,
        lastResizeSize: {
          ...state.lastResizeSize,
          ...action.payload,
        },
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    case 'SET_LOADING_FAVORITES':
      return {
        ...state,
        isLoadingFavorites: action.payload,
      };
    case 'SET_PREVIEW_LOADABLE':
      return {
        ...state,
        previewLoadable: action.payload,
      };
    case 'SET_RESIZE_SIZE':
      return {
        ...state,
        resizeSize: {
          ...state.resizeSize,
          ...action.payload,
        },
      };
    case 'SET_ROTATION':
      return {
        ...state,
        rotation: action.payload,
      };
    case 'SET_SELECTED_FORMAT':
      return {
        ...state,
        selectedFormat: {
          ...state.selectedFormat,
          ...action.payload,
        },
      };
    case 'SET_SELECTED_PROXY':

      if (typeof action.payload === 'string') {
        return {
          ...state,
          selectedProxy: action.payload,
          useCustomRendition: false,
          useRepresentative: false,
        };
      }
      return {
        ...state,
        selectedProxy: action.payload.proxy,
        useCustomRendition: Boolean(action.payload.useCustomRendition),
        useRepresentative: false,
      };
    case 'SET_SHOW_CUSTOM_RENDITION':
      return {
        ...state,
        // Remove selected proxy when custom rendition is selected
        selectedProxy: '',
        showCustomRendition: action.payload,
        useCustomRendition: false,
      };
    case 'SET_SHOW_VERSION_HISTORY':
      return {
        ...state,
        showVersionHistory: action.payload,
      };
    case 'SET_TRACKING_PARAMETERS':
      return {
        ...state,
        trackingParameters: action.payload,
      };
    case 'SET_TRANSFORMATIONS':
      return {
        ...state,
        transformations: [...state.transformations, action.payload],
      };
    case 'SET_USE_REPRESENTATIVE':
      return {
        ...state,
        selectedProxy: action.payload ? '' : state.selectedProxy,
        useRepresentative: action.payload,
      };
    default:
      return state;
  }
};

const FormatDialog: FC<Props> = ({
  allowCustomFormat,
  allowFavorites,
  allowProxy,
  allowTracking,
  autoExtension,
  availableExtensions,
  availableProxies,
  ctaText = 'Insert',
  extensions,
  isFavorite,
  maxHeight,
  open,
  previewUrl,
  selectedAsset,
  showVersions,
  supportedRepresentativeSubtypes,
  variant = 'dialog',
  onClose,
  onFavorite,
  onProxyConfirm,
  onFormatConfirm,
  onUnFavorite,
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [isDefined, setIsDefined] = useState(false);
  const dialogRef = useRef<CxDialog>(null);
  const drawerRef = useRef<CxDrawer>(null);
  const previewerRef = useRef<CropPreviewerHandle>(null);

  const setDefaultValues = useCallback(() => {
    if (!selectedAsset) {
      return;
    }

    const defaultRatio = convertPixelsToAspectRatio(
      state.defaultSize.width,
      state.defaultSize.height,
    );

    dispatch({
      type: 'SET_SELECTED_FORMAT',
      payload: {
        ...initialState.selectedFormat,
        url: selectedAsset.imageUrl,
        originalUrl: selectedAsset.originalUrl,
        extension: autoExtension ?? selectedAsset.extension,
        width: state.defaultSize.width,
        height: state.defaultSize.height,
      },
    });

    dispatch({
      type: 'SET_RESIZE_SIZE',
      payload: {
        ...initialState.resizeSize,
        width: state.defaultSize.width,
        height: state.defaultSize.height,
      },
    });

    dispatch({
      type: 'SET_CROP_SIZE',
      payload: {
        ...initialState.cropSize,
        width: state.defaultSize.width,
        height: state.defaultSize.height,
        percentageHeight: 100,
        percentageWidth: 100,
      },
    });

    dispatch({
      type: 'SET_ROTATION',
      payload: 0,
    });

    dispatch({
      type: 'SET_LAST_CROP_SIZE',
      payload: {
        ...initialState.lastCropSize,
        [Unit.Pixel]: {
          width: state.defaultSize.width,
          height: state.defaultSize.height,
          percentageHeight: 100,
          percentageWidth: 100,
          x: 0,
          y: 0,
          unit: Unit.Pixel,
        },
        [Unit.AspectRatio]: {
          width: defaultRatio.width,
          height: defaultRatio.height,
          percentageHeight: 100,
          percentageWidth: 100,
          x: 0,
          y: 0,
          unit: Unit.AspectRatio,
        },
      },
    });

    dispatch({
      type: 'SET_LAST_RESIZE_SIZE',
      payload: {
        [Unit.Pixel]: {
          width: state.defaultSize.width,
          height: state.defaultSize.height,
          unit: Unit.Pixel,
        },
        [Unit.AspectRatio]: {
          width: defaultRatio.width,
          height: defaultRatio.height,
          unit: Unit.AspectRatio,
        },
      },
    });

    if (availableProxies && availableProxies.length > 0) {
      dispatch({
        type: 'SET_SELECTED_PROXY',
        payload: availableProxies[0]?.id,
      });
    }
  }, [autoExtension, availableProxies, selectedAsset, state.defaultSize.height, state.defaultSize.width]);

  useEffect(() => {
    if (selectedAsset?.width && selectedAsset?.height) {
      dispatch({
        type: 'SET_DEFAULT_SIZE',
        payload: {
          width: parseInt(selectedAsset.width, 10),
          height: parseInt(selectedAsset.height, 10),
        },
      });
    }
  }, [selectedAsset?.width, selectedAsset?.height]);
  
  useEffect(() => {
    Promise.all([
      customElements.whenDefined('cx-dialog'),
      customElements.whenDefined('cx-drawer'),
      customElements.whenDefined('cx-dropdown'),
    ]).then(() => {
      setIsDefined(true);
    });
  }, []);

  useEffect(() => {
    const onRequestClose = (e: CxRequestCloseEvent) => {
      if (state.isLoadingFavorites) {
        e.preventDefault();
        return;
      }
      if (state.showVersionHistory) {
        e.preventDefault();
        dispatch({ type: 'SET_SHOW_VERSION_HISTORY', payload: false });
      } else {
        dispatch({ type: 'SET_PREVIEW_LOADABLE', payload: false });
        dispatch({ type: 'RESET_DATA' });
        onClose();
      }
    };

    const dialog = dialogRef.current;
    const drawer = drawerRef.current;

    dialog?.addEventListener('cx-request-close', onRequestClose);
    drawer?.addEventListener('cx-request-close', onRequestClose);

    return () => {
      dialog?.removeEventListener('cx-request-close', onRequestClose);
      drawer?.removeEventListener('cx-request-close', onRequestClose);
    };
  }, [isDefined, onClose, state.isLoadingFavorites, state.showVersionHistory]);

  useEffect(() => {
    const onAfterShow = () => {
      dispatch({ type: 'SET_PREVIEW_LOADABLE', payload: true });
    };

    const dialog = dialogRef.current;
    const drawer = drawerRef.current;

    dialog?.addEventListener('cx-after-show', onAfterShow);
    drawer?.addEventListener('cx-after-show', onAfterShow);

    return () => {
      dialog?.removeEventListener('cx-after-show', onAfterShow);
      drawer?.removeEventListener('cx-after-show', onAfterShow);
    };
  }, [isDefined, state.showCustomRendition, variant]);

  useEffect(() => {
    const onProxySelect = (e: CxSelectEvent) => {
      const value = e.detail.item.value;

      if (value === 'custom') {
        dispatch({ type: 'SET_SHOW_CUSTOM_RENDITION', payload: true });
        if (!state.useCustomRendition) {
          setDefaultValues();
        }
        return;
      }

      if (value === 'tracking') {
        dispatch({
          type: 'SET_ENABLED_TRACKING',
          payload: !state.enabledTracking,
        });
        return;
      }

      if (value === 'use-representative') {
        dispatch({
          type: 'SET_USE_REPRESENTATIVE',
          payload: !state.useRepresentative,
        });
        return;
      }

      if (value && availableProxies) {
        if (!availableProxies.map(item => item.id).includes(value)) {
          return;
        }
        dispatch({ type: 'SET_SELECTED_PROXY', payload: value });
      }
    };

    const dialog = dialogRef.current;
    const drawer = drawerRef.current;

    dialog?.addEventListener('cx-select', onProxySelect);
    drawer?.addEventListener('cx-select', onProxySelect);

    return () => {
      dialog?.removeEventListener('cx-select', onProxySelect);
      drawer?.removeEventListener('cx-select', onProxySelect);
    };
  }, [
    isDefined,
    state.enabledTracking,
    state.useCustomRendition,
    state.useRepresentative,
    setDefaultValues,
    availableProxies,
    selectedAsset?.extension,
  ]);

  useEffect(() => {
    setDefaultValues();
  }, [setDefaultValues]);

  const supportedRepresentative = useMemo(
    () =>
      supportedRepresentativeSubtypes?.includes(selectedAsset?.docSubType ?? '') &&
      selectedAsset?.imageUrl,
    [selectedAsset, supportedRepresentativeSubtypes],
  );

  const onLoadingChange = useCallback((isLoading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: isLoading });
  }, []);

  const onResizeChange = useCallback(async (width: number, height: number, unit: Unit, shouldApply: boolean) => {
    if (!selectedAsset) {
      return;
    }

    const currentWidth = state.selectedFormat.width || state.defaultSize.width;
    const currentHeight = state.selectedFormat.height || state.defaultSize.height;

    dispatch({
      type: 'SET_RESIZE_SIZE',
      payload: {
        width,
        height,
        unit,
      },
    });

    if (shouldApply) {
      let newFormatWidth = width;
      let newFormatHeight = height;

      if (state.resizeSize.unit !== unit) {
        newFormatWidth = currentWidth;
        newFormatHeight = currentHeight;
      } else if (unit === Unit.AspectRatio) {
        newFormatWidth =
            Math.round((width / height) * currentHeight);
        newFormatHeight = currentHeight;
      }

      const newImage = await previewerRef.current?.applyResize();

      dispatch({
        type: 'SET_SELECTED_FORMAT',
        payload: {
          url: newImage,
          width: newFormatWidth,
          height: newFormatHeight,
        },
      });

      dispatch({
        type: 'SET_TRANSFORMATIONS',
        payload: {
          key: TransformationAction.Resize,
          value: {
            width: newFormatWidth,
            height: newFormatHeight,
          },
        },
      });

      dispatch({
        type: 'SET_CROP_SIZE',
        payload: {
          width: newFormatWidth,
          height: newFormatHeight,
        },
      });

      const ratio = convertPixelsToAspectRatio(newFormatWidth, newFormatHeight);
      dispatch({
        type: 'SET_LAST_RESIZE_SIZE',
        payload: {
          [Unit.Pixel]: {
            width: newFormatWidth,
            height: newFormatHeight,
            unit: Unit.Pixel,
          },
          [Unit.AspectRatio]: {
            width: unit === Unit.AspectRatio ? width : ratio.width,
            height: unit === Unit.AspectRatio ? height : ratio.height,
            unit: Unit.AspectRatio,
          },
        },
      });

      dispatch({
        type: 'SET_LAST_CROP_SIZE',
        payload: {
          [Unit.Pixel]: {
            width: newFormatWidth,
            height: newFormatHeight,
            percentageHeight: 100,
            percentageWidth: 100,
            x: 0,
            y: 0,
            unit: Unit.Pixel,
          },
          [Unit.AspectRatio]: {
            width: unit === Unit.AspectRatio ? width : ratio.width,
            height: unit === Unit.AspectRatio ? height : ratio.height,
            percentageHeight: 100,
            percentageWidth: 100,
            x: 0,
            y: 0,
            unit: Unit.AspectRatio,
          },
        },
      });
    }
  }, [selectedAsset, state.defaultSize.height, state.defaultSize.width, state.resizeSize.unit, state.selectedFormat.height, state.selectedFormat.width]);

  const onCropChange = useCallback(async (width: number, height: number, unit: Unit, shouldApply: boolean) => {
    if (!selectedAsset) {
      return;
    }
    const previousUnit = state.cropSize.unit;
    const previewHandle = previewerRef.current;
    
    if (previewHandle && state.selectedFormat?.width && state.selectedFormat?.height) {

      if (unit === previousUnit && unit === Unit.Pixel) {
        const scale = Math.max(
          width / state.selectedFormat.width,
          height / state.selectedFormat.height,
        );
        previewHandle.setZoom(1 / scale);
      }

      if (unit !== previousUnit) {
        previewHandle.setZoom(1);
      }
    }


    dispatch({
      type: 'SET_CROP_SIZE',
      payload: {
        width,
        height,
        unit,
      },
    });

    if (shouldApply) {
      const newImage = await previewerRef.current?.applyCrop();

      let newWidth = width;
      let newHeight = height;
      if (unit === Unit.AspectRatio) {
        newWidth = Math.round((state.cropSize.percentageWidth * state.selectedFormat.width) / 100);
        newHeight = Math.round((state.cropSize.percentageHeight * state.selectedFormat.height) / 100);
      }
      previewHandle?.setZoom(1);

      const newX = Number(
        ((state.cropSize.x / 100) * state.selectedFormat.width).toFixed(0),
      );
      const newY = Number(
        ((state.cropSize.y / 100) * state.selectedFormat.height).toFixed(0),
      );

      dispatch({
        type: 'SET_SELECTED_FORMAT',
        payload: {
          url: newImage,
          width: newWidth,
          height: newHeight,
        },
      });

      dispatch({
        type: 'SET_RESIZE_SIZE',
        payload: {
          width: newWidth,
          height: newHeight,
          unit: Unit.Pixel,
        },
      });

      dispatch({
        type: 'SET_TRANSFORMATIONS',
        payload: {
          key: TransformationAction.Crop,
          value: {
            width: Number(newWidth.toFixed(0)),
            height: Number(newHeight.toFixed(0)),
            x: newX,
            y: newY,
          },
        },
      });

      const ratio = convertPixelsToAspectRatio(newWidth, newHeight);

      dispatch({
        type: 'SET_LAST_CROP_SIZE',
        payload: {
          [Unit.Pixel]:{
            width: Math.round(newWidth),
            height: Math.round(newHeight),
            percentageHeight: 100,
            percentageWidth: 100,
            x: 0,
            y: 0,
            unit: Unit.Pixel,
          },
          [Unit.AspectRatio]: {
            width: unit === Unit.AspectRatio ? width : ratio.width,
            height: unit === Unit.AspectRatio ? height : ratio.height,
            percentageHeight: 100,
            percentageWidth: 100,
            x: 0,
            y: 0,
            unit: Unit.AspectRatio,
          },
        },
      });

      dispatch({
        type: 'SET_LAST_RESIZE_SIZE',
        payload: {
          [Unit.Pixel]: {
            width: newWidth,
            height: newHeight,
            unit: Unit.Pixel,
          },
          [Unit.AspectRatio]: {
            width: unit === Unit.AspectRatio ? width : ratio.width,
            height: unit === Unit.AspectRatio ? height : ratio.height,
            unit: Unit.AspectRatio,
          },
        },
      });
    }
  },
  [
    selectedAsset,
    state.cropSize,
    state.selectedFormat.height,
    state.selectedFormat.width,
  ],
  );

  const onRotateChange = useCallback(async (rotation: number, shouldApply: boolean) => {
    dispatch({
      type: 'SET_ROTATION',
      payload: shouldApply ? 0 : rotation,
    });

    if (shouldApply) {
      const { width: newWidth, height: newHeight } = rotateBox(
        state.selectedFormat.width,
        state.selectedFormat.height,
        rotation,
      );
      const newImage = await previewerRef.current?.applyRotation();
      dispatch({
        type: 'SET_SELECTED_FORMAT',
        payload: {
          rotation,
          url: newImage,
          width: newWidth,
          height: newHeight,
        },
      });

      dispatch({
        type: 'SET_TRANSFORMATIONS',
        payload: {
          key: TransformationAction.Rotate,
          value: {
            rotation,
          },
        },
      });

      dispatch({
        type: 'SET_CROP_SIZE',
        payload: {
          width: newWidth,
          height: newHeight,
        },
      });

      dispatch({
        type: 'SET_RESIZE_SIZE',
        payload: {
          width: newWidth,
          height: newHeight,
          unit: Unit.Pixel,
        },
      });

      const ratio = convertPixelsToAspectRatio(newWidth, newHeight);
      dispatch({
        type: 'SET_LAST_CROP_SIZE',
        payload: {
          [Unit.Pixel]:{
            width: newWidth,
            height: newHeight,
            percentageHeight: 100,
            percentageWidth: 100,
            x: 0,
            y: 0,
            unit: Unit.Pixel,
          },
          [Unit.AspectRatio]: {
            width: ratio.width,
            height: ratio.height,
            percentageHeight: 100,
            percentageWidth: 100,
            x: 0,
            y: 0,
            unit: Unit.AspectRatio,
          },
        },
      });

      dispatch({
        type: 'SET_LAST_RESIZE_SIZE',
        payload: {
          [Unit.Pixel]: {
            width: newWidth,
            height: newHeight,
            unit: Unit.Pixel,
          },
          [Unit.AspectRatio]: {
            width: ratio.width,
            height: ratio.height,
            unit: Unit.AspectRatio,
          },
        },
      });
    }
  }, [state.selectedFormat]);

  const onExtensionChange = useCallback((extension: string) => {
    dispatch({
      type: 'SET_SELECTED_FORMAT',
      payload: {
        extension,
      },
    });
  }, []);

  const onViewChange = useCallback((view: string) => {
    dispatch({
      type: 'SET_CROP_SIZE',
      payload: {
        width: state.selectedFormat.width,
        height: state.selectedFormat.height,
        unit: Unit.Pixel,
      },
    });
    dispatch({
      type: 'SET_RESIZE_SIZE',
      payload: {
        width: state.selectedFormat.width,
        height: state.selectedFormat.height,
        unit: Unit.Pixel,
      },
    });
    dispatch({
      type: 'SET_ROTATION',
      payload: 0,
    });
    dispatch({
      type: 'SET_ACTIVE_SETTING',
      payload: view,
    });
  }, [state.selectedFormat]);

  const handleVersionHistory = useCallback(() => {
    dispatch({ type: 'SET_SHOW_VERSION_HISTORY', payload: true });
  }, []);
  
  const onFormatChange = useCallback((format: Proxy) => {
    let width = format.formatWidth;
    let height = format.formatHeight;

    if (format.proxyName === 'TRX' && selectedAsset) {
      width = Number(selectedAsset.width);
      height = Number(selectedAsset.height);
    }

    dispatch({
      type: 'SET_SELECTED_PROXY',
      payload: {
        proxy: format.id,
        useCustomRendition: true,
      },
    });

    dispatch({
      type: 'SET_SELECTED_FORMAT',
      payload: {
        width,
        height,
      },
    });
    dispatch({
      type: 'SET_RESIZE_SIZE',
      payload: {
        width,
        height,
        unit: Unit.Pixel,
      },
    });
    dispatch({
      type: 'SET_CROP_SIZE',
      payload: {
        width,
        height,
        percentageWidth: 100,
        percentageHeight: 100,
        x: 0,
        y: 0,
        unit: Unit.Pixel,
      },
    });

    const ratio = convertPixelsToAspectRatio(width, height);

    dispatch({
      type: 'SET_LAST_CROP_SIZE',
      payload: {
        [Unit.Pixel]:{
          width: Math.round(width),
          height: Math.round(height),
          percentageHeight: 100,
          percentageWidth: 100,
          x: 0,
          y: 0,
          unit: Unit.Pixel,
        },
        [Unit.AspectRatio]: {
          width: ratio.width,
          height: ratio.height,
          percentageHeight: 100,
          percentageWidth: 100,
          x: 0,
          y: 0,
          unit: Unit.AspectRatio,
        },
      },
    });

    dispatch({
      type: 'SET_LAST_RESIZE_SIZE',
      payload: {
        [Unit.Pixel]: {
          width: width,
          height: height,
          unit: Unit.Pixel,
        },
        [Unit.AspectRatio]: {
          width: ratio.width,
          height: ratio.height,
          unit: Unit.AspectRatio,
        },
      },
    });
  }, [selectedAsset]);

  useEffect(() => {
    if (!availableProxies || availableProxies.length === 0) {
      dispatch({ type: 'SET_SELECTED_PROXY', payload: '' });
      return;
    }
    dispatch({ type: 'SET_SELECTED_PROXY', payload: availableProxies[0].id });
  }, [availableProxies, selectedAsset]);

  const renderContent = useCallback(() => {
    const disabledInsert =
      state.isLoading || (!state.selectedProxy && !state.useCustomRendition && !state.useRepresentative);
    const supportedATS = allowCustomFormat && extensions.includes(
      selectedAsset ? selectedAsset.extension : '',
    );
    const supportedProxies = availableProxies && Object.values(availableProxies).flat().length > 0;

    const showCustomDimension = state.selectedFormat.width && state.selectedFormat.height && state.useCustomRendition;

    const renderHeader = () => {
      if (state.showVersionHistory) {
        return (
          <cx-space slot="label" justify-content="space-between" align-items="center">
            <cx-space direction="vertical" spacing="2x-small" style={{ flex: '1' }}>
              <cx-typography variant="h4">Version history</cx-typography>
              <cx-typography variant="body3" className='asset-name'>
                <cx-line-clamp lines={1}>{selectedAsset?.name}</cx-line-clamp>
              </cx-typography>
            </cx-space>
          </cx-space>
        );
      }

      return (
        <>
          <cx-space
            slot="label"
            justify-content="space-between"
            align-items="center"
          >
            <cx-space
              direction="vertical"
              spacing="2x-small"
              style={{ flex: '1' }}
            >
              <cx-typography variant="h4">Formats</cx-typography>
              <cx-typography variant="body3" className="asset-name">
                <cx-line-clamp lines={1}>{selectedAsset?.name}</cx-line-clamp>
              </cx-typography>
            </cx-space>
          </cx-space>
          {allowFavorites && (
            <cx-tooltip
              slot="header-actions"
              content={isFavorite ? 'Unfavorite' : 'Favorite'}
              placement="bottom"
            >
              {state.isLoadingFavorites ? (
                <cx-space
                  align-items="center"
                  justify-content="center"
                  style={{
                    width: '32px',
                    height: '32px',
                  }}
                >
                  <cx-spinner></cx-spinner>
                </cx-space>
              ) : (
                <cx-icon-button
                  name={isFavorite ? 'star' : 'star_outline'}
                  style={{
                    color: isFavorite
                      ? 'var(--cx-color-primary)'
                      : 'var(--cx-color-text)',
                  }}
                  onClick={async () => {
                    if (state.isLoadingFavorites) {
                      return;
                    }

                    dispatch({
                      type: 'SET_LOADING_FAVORITES',
                      payload: true,
                    });

                    if (!isFavorite) {
                      await onFavorite();
                    } else {
                      await onUnFavorite();
                    }

                    dispatch({
                      type: 'SET_LOADING_FAVORITES',
                      payload: false,
                    });
                  }}
                ></cx-icon-button>
              )}
            </cx-tooltip>
          )}
          {showVersions && (
            <cx-tooltip
              slot="header-actions"
              content="Version history"
              placement="bottom"
            >
              <cx-icon-button
                name="history"
                onClick={handleVersionHistory}
              ></cx-icon-button>
            </cx-tooltip>
          )}
        </>
      );
    };

    const renderBody = () => {
      let previewer =  null;
      let rendition = null;

      if (state.selectedFormat.width && state.selectedFormat.height && selectedAsset?.docType !== MediaType.Video) {
        previewer = (
          <CropPreviewer
            ref={previewerRef}
            loadable={state.previewLoadable}
            image={state.selectedFormat}
            selectedProxy={state.selectedProxy}
            resizer={state.resizeSize}
            cropper={state.cropSize}
            rotation={state.rotation}
            disabled={state.activeSetting !== 'crop' || !state.showCustomRendition}
            onCropComplete={(croppedArea) => {
              dispatch({
                type: 'SET_CROP_SIZE',
                payload: {
                  percentageWidth: croppedArea.width,
                  percentageHeight: croppedArea.height,
                  x: croppedArea.x,
                  y: croppedArea.y,
                },
              });
            }}
            onLoadingChange={onLoadingChange}
          />
        );
      } else {
        previewer = (
          <Previewer
            loadable={state.previewLoadable}
            asset={{
              docType: selectedAsset?.docType,
              imageUrl: selectedAsset?.imageUrl,
              videoUrl: previewUrl,
              extension: selectedAsset?.extension,
            }}
            onLoad={(size) => {
              if ((selectedAsset?.width && selectedAsset?.height) || !selectedAsset?.imageUrl) {
                return;
              }
              
              const defaultWidth = selectedAsset?.width ? parseInt(selectedAsset.width, 10) : size.width;
              const defaultHeight = selectedAsset?.height ? parseInt(selectedAsset.height, 10) : size.height;

              dispatch({ type: 'SET_DEFAULT_SIZE', payload: {
                width: defaultWidth,
                height: defaultHeight,
              } });
            }}
          />
        );
      }

      if (state.showVersionHistory) {
        return <VersionHistory
          assetId={selectedAsset?.id}
        />;
      }

      if (!allowProxy) {
        return previewer;
      }

      if (state.showCustomRendition && availableProxies) {
        rendition = (
          <CustomRendition
            activeSetting={state.activeSetting}
            extensions={
              availableExtensions && selectedAsset?.docType
                ? _uniqBy([
                  ...availableExtensions[selectedAsset.docType],
                  { displayName: 'Automatic', value: autoExtension },
                ], 'value')
                : [{ displayName: 'Automatic', value: autoExtension }]
            }
            availableProxies={availableProxies}
            imageSize={{
              width: state.selectedFormat.width
                ? state.selectedFormat.width
                : Infinity,
              height: state.selectedFormat.height
                ? state.selectedFormat.height
                : Infinity,
            }}
            resize={{
              width: state.resizeSize.width,
              height: state.resizeSize.height,
              unit: state.resizeSize.unit,
            }}
            crop={state.cropSize}
            lastAppliedCrop={state.lastCropSize}
            lastAppliedResize={state.lastResizeSize}
            proxy={state.selectedProxy}
            rotation={state.rotation}
            extension={state.selectedFormat.extension}
            onCropChange={onCropChange}
            onExtensionChange={onExtensionChange}
            onFormatChange={onFormatChange}
            onResizeChange={onResizeChange}
            onRotateChange={onRotateChange}
            onViewChange={onViewChange}
          />
        );
      } else {
        rendition = (
          <cx-space direction="vertical" spacing="small">
            {supportedProxies || supportedATS ? (
              <div
                style={{
                  width: '100%',
                }}
              >
                {supportedProxies && (
                  <ProxyMenu
                    items={availableProxies?.map((proxy) => {
                      if (proxy.proxyName === 'TRX' && selectedAsset) {
                        return {
                          value: proxy.id,
                          name: proxy.proxyLabel,
                          cdnName: proxy.cdnName,
                          width: selectedAsset.width,
                          height: selectedAsset.height,
                          extension: selectedAsset.extension,
                          docType: selectedAsset.docType,
                        };
                      }
                      return {
                        value: proxy.id,
                        name: proxy.proxyLabel,
                        cdnName: proxy.cdnName,
                        width: String(proxy.formatWidth),
                        height: String(proxy.formatHeight),
                        extension: proxy.extension ?? undefined,
                        docType: selectedAsset?.docType,
                      };
                    })}
                    selectedDisabled={state.useCustomRendition}
                    selectedItem={state.selectedProxy}
                  >
                    {supportedRepresentative && (
                      <cx-menu-item value="use-representative">
                        <cx-typography
                          variant="body3"
                          className={`proxy__name ${
                            state.useRepresentative ? 'selected' : ''
                          }`}
                        >
                          Representative image
                        </cx-typography>
                        <cx-icon slot="suffix" name={state.useRepresentative ? 'check' : ''}></cx-icon>
                      </cx-menu-item>
                    )}
                  </ProxyMenu>
                )}
                {supportedATS && (
                  <ProxyMenu
                    items={[]}
                    selectedItem={state.selectedProxy}
                    style={{
                      borderTopWidth: '0',
                    }}
                  >
                    <cx-menu-item value="custom">
                      <cx-icon slot="prefix" name="crop_rotate" className='icon--large'></cx-icon>
                      <div>
                        <cx-typography
                          variant="body3"
                          className={`proxy__name ${
                            state.useCustomRendition ? 'selected' : ''
                          }`}
                        >
                          Custom format
                        </cx-typography>
                        {showCustomDimension && (
                          <cx-typography variant="body3" className="proxy__details">
                            {state.selectedFormat.width} x {state.selectedFormat.height}
                            {state.selectedFormat.extension && (
                              <div className="proxy__extension-dot"></div>
                            )}
                            {state.selectedFormat.extension?.replace(/^\./, '').toUpperCase()}
                          </cx-typography>
                        )}
                      </div>
                      <cx-icon
                        slot="suffix"
                        name={state.useCustomRendition ? 'edit' : ''}
                        className="icon--large"
                      ></cx-icon>
                      <cx-icon
                        slot="suffix"
                        name={state.useCustomRendition ? 'check' : ''}
                        className="icon--large icon--primary"
                      ></cx-icon>
                    </cx-menu-item>
                  </ProxyMenu>
                )}
                {allowTracking && (
                  <div
                    style={{
                      backgroundColor: 'var(--cx-color-neutral-0)',
                      width: '100%',
                    }}
                  >
                    <ProxyMenu
                      style={{
                        border: 'none',
                      }}
                    >
                      <cx-menu-item value="tracking" className="proxy--switch">
                        <cx-typography variant="body3" className="proxy__name">
                          Tracking parameters
                        </cx-typography>
                        <cx-switch
                          checked={state.enabledTracking}
                          onClick={(e) => e.preventDefault()}
                        ></cx-switch>
                      </cx-menu-item>
                    </ProxyMenu>
                    {state.enabledTracking && (
                      <TrackingParameters
                        values={state.trackingParameters}
                        onChange={(params) =>
                          dispatch({
                            type: 'SET_TRACKING_PARAMETERS',
                            payload: params,
                          })
                        }
                      />
                    )}
                  </div>
                )}
              </div>
            ) : (
              <cx-space
                align-items="center"
                spacing="large"
                wrap="nowrap"
                style={{
                  backgroundColor: 'var(--cx-color-neutral-0)',
                  width: '100%',
                  padding: 'var(--cx-spacing-medium)',
                  gap: '20px',
                }}
              >
                <cx-icon
                  style={{
                    color: 'var(--cx-color-warning)',
                  }}
                  name="warning"
                  className="ic_warning_amber"
                ></cx-icon>
                <cx-typography variant="body3" className="proxy__name">
                  You don&apos;t have permission to share this asset.
                </cx-typography>
              </cx-space>
            )}
          </cx-space>
        );
      }

      return <>{previewer}{rendition}</>;
    };

    const renderFooter = () => {
      if (state.showVersionHistory) {
        return null;
      }

      let content = null;

      if (!allowProxy) {
        content = (
          <cx-button
            className="dialog__footer__button"
            onClick={() => {
              if (!selectedAsset?.docType) {
                return;
              }

              onProxyConfirm({
                extension: selectedAsset.extension,
                useRepresentative: true,
                value: '',
              });
            }}
            variant="primary"
          >
            <cx-icon slot="prefix" name="folder"></cx-icon>
            {ctaText}
          </cx-button>
        );
      } else if (state.showCustomRendition) {
        content = (
          <cx-space spacing="small" style={{ width: 'fit-content' }}>
            <cx-button
              variant="default"
              onClick={() => {
                dispatch({
                  type: 'CANCEL_USE_CUSTOM_RENDITION',
                  payload: {
                    url: selectedAsset?.imageUrl ?? '',
                    originalUrl: selectedAsset?.originalUrl ?? '',
                    width: parseInt(selectedAsset?.width ?? '0', 10),
                    height: parseInt(selectedAsset?.height ?? '0', 10),
                    extension: selectedAsset?.extension ?? '',
                  },
                });
              }}
            >
              Cancel
            </cx-button>
            <cx-button
              variant="primary"
              onClick={() => {
                dispatch({ type: 'CONFIRM_USE_CUSTOM_RENDITION' });
              }}
            >
              Done
            </cx-button>
          </cx-space>
        );
      } else {
        content = (
          <cx-button
          className="dialog__footer__button"
          disabled={disabledInsert}
          variant="primary"
          style={{ flex: 1 }}
          onClick={() => {
            const selectedProxy = availableProxies?.find((proxy) => {
              return proxy.id === state.selectedProxy;
            });

            if (!state.useCustomRendition) {
              if (!selectedAsset?.docType) {
                return;
              }

              if (!selectedProxy) {
                return;
              }

              onProxyConfirm({
                extension: selectedProxy.extension ?? selectedAsset.extension,
                value: selectedProxy.proxyName,
                permanentLink: selectedProxy.permanentLink ?? undefined,
                parameters: state.enabledTracking
                  ? state.trackingParameters
                  : undefined,
                useRepresentative: state.useRepresentative,
              });
            } else {
              onFormatConfirm({
                value: state.transformations,
                parameters: state.enabledTracking
                  ? state.trackingParameters
                  : undefined,
                proxiesPreference: selectedProxy?.proxyName,
                extension: state.selectedFormat.extension,
              });
            }
            dispatch({ type: 'RESET_DATA' });
            onClose();
          }}
        >
          {ctaText ?? 'Insert'}
        </cx-button>
        );
      }

      return (
        <div slot="footer" className="dialog__footer">
          {content}
        </div>
      );
    };

    return (
      <>
        {renderHeader()}
        {renderBody()}
        {renderFooter()}
      </>
    );
  }, [
    allowCustomFormat,
    allowFavorites,
    allowProxy,
    allowTracking,
    autoExtension,
    availableExtensions,
    availableProxies,
    ctaText,
    extensions,
    isFavorite,
    handleVersionHistory,
    previewUrl,
    selectedAsset,
    showVersions,
    state,
    supportedRepresentative,
    onClose,
    onCropChange,
    onExtensionChange,
    onFavorite,
    onFormatChange,
    onFormatConfirm,
    onLoadingChange,
    onProxyConfirm,
    onResizeChange,
    onRotateChange,
    onUnFavorite,
    onViewChange,
  ]);

  if (variant === 'drawer') {
    return (
      <Drawer
        ref={drawerRef}
        className="dialog"
        label="Drawer"
        placement="bottom"
        contained
        open={open}
      >
        {renderContent()}
      </Drawer>
    );
  }

  return (
    <Dialog
      ref={dialogRef}
      className="dialog"
      open={open}
      strategy="absolute"
      style={
        {
          '--max-height': `${maxHeight}px`,
          '--max-width': state.showVersionHistory ? '600px' : '520px',
        } as CSSProperties
      }
    >
      {renderContent()}
    </Dialog>
  );
};

export default FormatDialog;
