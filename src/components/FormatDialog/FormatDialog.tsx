import {
  CSSProperties, FC, useCallback, useEffect, useMemo, useReducer, useRef, useState,
} from 'react';

import { useGetVideoUrlQuery } from '@/store/assets/assets.api';
import { TrackingParameter, Transformation, TransformationAction, Unit } from '@/types/assets';
import { Asset, MediaType } from '@/types/search';
import { convertPixelsToAspectRatio } from '@/utils/number';
import { rotateBox } from '@/utils/rotate';
import { CxDialog, CxDrawer, CxSelectEvent } from '@/web-component';
import { skipToken } from '@reduxjs/toolkit/query';

import CropPreviewer, { CropPreviewerHandle } from './CropPreviewer';
import CustomRendition from './CustomRendition';
import { Dialog, Drawer } from './FormatDialog.styled';
import Previewer from './Previewer';
import ProxyMenu from './ProxyMenu';
import TrackingParameters from './TrackingParameters';

type Props = {
  allowCustomFormat: boolean;
  availableProxies?: { [docType: string]: Record<string, string>[] };
  ctaText?: string;
  extensions: string[];
  maxHeight?: number;
  open: boolean;
  searchInDrive: boolean;
  selectedAsset: Asset | null;
  supportedRepresentativeSubtypes?: string[];
  variant?: 'dialog' | 'drawer';
  onClose: () => void;
  onProxyConfirm: (value: {
    extension: string;
    value: Record<string, string>;
    parameters?: TrackingParameter[];
    useRepresentative?: boolean;
  }) => void;
  onFormatConfirm: (value: {
    value: Transformation[];
    parameters?: TrackingParameter[];
    extension?: string;
  }) => void;
  onOpenInDriveConfirm: () => void;
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
  lastResizeSize: {
    width: number;
    height: number;
    unit: Unit;
  };
  cropSize: {
    width: number;
    height: number;
    percentageWidth: number;
    percentageHeight: number;
    x: number;
    y: number;
    unit: Unit;
  };
  lastCropSize: {
    width: number;
    height: number;
    unit: Unit;
  };
  rotation: number;
  transformations: Transformation[];
  enabledTracking: boolean;
  trackingParameters: TrackingParameter[];
  showCustomRendition: boolean;
  useCustomRendition: boolean;
  useRepresentative: boolean;
  activeSetting: string;
  isLoading: boolean;
};

type Action =
  | { type: 'CANCEL_USE_CUSTOM_RENDITION'; payload: { width: number; height: number, url: string } }
  | { type: 'CONFIRM_USE_CUSTOM_RENDITION' }
  | { type: 'RESET_DATA' }
  | { type: 'SET_ACTIVE_SETTING'; payload: string }
  | { type: 'SET_CROP_SIZE'; payload: Partial<State['cropSize']> }
  | { type: 'SET_DEFAULT_SIZE'; payload: Partial<State['defaultSize']> }
  | { type: 'SET_ENABLED_TRACKING'; payload: boolean }
  | { type: 'SET_LAST_RESIZE_SIZE'; payload: Partial<State['lastResizeSize']> }
  | { type: 'SET_LAST_CROP_SIZE'; payload: Partial<State['lastCropSize']> }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_PREVIEW_LOADABLE'; payload: boolean }
  | { type: 'SET_RESIZE_SIZE'; payload: Partial<State['resizeSize']> }
  | { type: 'SET_ROTATION'; payload: number }
  | { type: 'SET_SELECTED_FORMAT'; payload: Partial<State['selectedFormat']> }
  | { type: 'SET_SELECTED_PROXY'; payload: string }
  | { type: 'SET_SHOW_CUSTOM_RENDITION'; payload: boolean }
  | { type: 'SET_TRACKING_PARAMETERS'; payload: TrackingParameter[] }
  | { type: 'SET_TRANSFORMATIONS'; payload: Transformation }
  | { type: 'SET_USE_REPRESENTATIVE'; payload: boolean };

const initialState: State = {
  previewLoadable: false,
  defaultSize: {
    width: 0,
    height: 0,
  },
  selectedProxy: 'TRX',
  selectedFormat: {
    url: '',
    width: 0,
    height: 0,
    x: 0,
    y: 0,
    extension: 'jpeg',
    rotation: 0,
  },
  resizeSize: {
    width: 0,
    height: 0,
    unit: Unit.Pixel,
  },
  lastResizeSize: {
    width: 0,
    height: 0,
    unit: Unit.Pixel,
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
    width: 0,
    height: 0,
    unit: Unit.Pixel,
  },
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
  useCustomRendition: false,
  useRepresentative: false,
  activeSetting: 'resize',
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
          extension: 'jpeg',
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
      return {
        ...state,
        selectedProxy: action.payload,
        useCustomRendition: false,
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

const getProxyValue = (proxy: Record<string, string>, fallbackExtension: string) => {
  return proxy.proxyName === 'TRX' ? proxy.proxyName : `${proxy.proxyName}-${proxy.extension?.substring(1) ?? fallbackExtension}`;
};

const FormatDialog: FC<Props> = ({
  allowCustomFormat,
  availableProxies,
  ctaText,
  extensions,
  maxHeight,
  open,
  searchInDrive,
  selectedAsset,
  supportedRepresentativeSubtypes,
  variant = 'dialog',
  onClose,
  onProxyConfirm,
  onFormatConfirm,
  onOpenInDriveConfirm,
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [isDefined, setIsDefined] = useState(false);
  const dialogRef = useRef<CxDialog>(null);
  const drawerRef = useRef<CxDrawer>(null);
  const previewerRef = useRef<CropPreviewerHandle>(null);

  const { data: videoUrl, isFetching, isError } = useGetVideoUrlQuery(
    selectedAsset?.docType === MediaType.Video
      ? { id: selectedAsset?.id ?? '' }
      : skipToken,
  );

  const setDefaultValues = useCallback(() => {
    if (!selectedAsset) {
      return;
    }

    dispatch({
      type: 'SET_SELECTED_FORMAT',
      payload: {
        ...initialState.selectedFormat,
        url: selectedAsset.imageUrl,
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
        width: state.defaultSize.width,
        height: state.defaultSize.height,
      },
    });

    dispatch({
      type: 'SET_LAST_RESIZE_SIZE',
      payload: {
        width: state.defaultSize.width,
        height: state.defaultSize.height,
      },
    });
  }, [selectedAsset, state.defaultSize]);

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
    const onRequestClose = () => {
      dispatch({ type: 'SET_PREVIEW_LOADABLE', payload: false });
      dispatch({ type: 'RESET_DATA' });
      onClose();
    };

    const dialog = dialogRef.current;
    const drawer = drawerRef.current;

    dialog?.addEventListener('cx-request-close', onRequestClose);
    drawer?.addEventListener('cx-request-close', onRequestClose);

    return () => {
      dialog?.removeEventListener('cx-request-close', onRequestClose);
      drawer?.removeEventListener('cx-request-close', onRequestClose);
    };
  }, [isDefined, onClose]);

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

      if (value) {
        const allProxies = Object.entries(availableProxies ?? {}).map(
          ([_, proxies]) =>
            Object.values(proxies).map((proxy) =>
              getProxyValue(proxy, selectedAsset?.extension ?? ''),
            ),
        );

        if (!allProxies.flat().includes(value)) {
          return;
        }
      }
      dispatch({ type: 'SET_SELECTED_PROXY', payload: value });
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

    let newResizeWidth = width;
    let newResizeHeight = height;

    if (state.resizeSize.unit === Unit.AspectRatio && unit === Unit.Pixel) {
      newResizeWidth = state.defaultSize.width;
      newResizeHeight = state.defaultSize.height;
    } else if (
      state.resizeSize.unit === Unit.Pixel &&
      unit === Unit.AspectRatio
    ) {
      const aspectRatio = convertPixelsToAspectRatio(
        state.defaultSize.width,
        state.defaultSize.height,
      );
      newResizeWidth = aspectRatio.width;
      newResizeHeight = aspectRatio.height;
    }

    dispatch({
      type: 'SET_RESIZE_SIZE',
      payload: {
        width: newResizeWidth,
        height: newResizeHeight,
        unit,
      },
    });

    if (shouldApply) {
      let newFormatWidth = width;
      let newFormatHeight = height;

      if (state.resizeSize.unit !== unit) {
        newFormatWidth = state.defaultSize.width;
        newFormatHeight = state.defaultSize.height;
      } else if (unit === Unit.AspectRatio) {
        newFormatWidth =
            (width / height) * state.defaultSize.height;
        newFormatHeight = state.defaultSize.height;
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

      dispatch({
        type: 'SET_LAST_RESIZE_SIZE',
        payload: {
          width: newResizeWidth,
          height: newResizeHeight,
          unit,
        },
      });
    }
  }, [selectedAsset, state.defaultSize, state.resizeSize.unit]);

  const onCropChange = useCallback(async (width: number, height: number, unit: Unit, shouldApply: boolean) => {
    if (!selectedAsset) {
      return;
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
        newWidth = (state.cropSize.percentageWidth * state.selectedFormat.width) / 100;
        newHeight = (state.cropSize.percentageHeight * state.selectedFormat.height) / 100;
      }

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

      dispatch({
        type: 'SET_LAST_CROP_SIZE',
        payload: {
          width,
          height,
          unit,
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
    console.log(' onRotateChange ~ shouldApply:', shouldApply);

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

  const renderContent = useCallback(() => {
    const disabledInsert =
      state.isLoading || (!state.selectedProxy && !state.useCustomRendition && !state.useRepresentative);
    const supportedATS = allowCustomFormat && extensions.includes(
      selectedAsset ? `.${selectedAsset.extension}` : '',
    );
    const supportedProxies = availableProxies && Object.values(availableProxies).flat().length > 0;

    const showCustomDimension = state.selectedFormat.width && state.selectedFormat.height && state.useCustomRendition;

    const renderBody = () => {
      let previewer =  null;
      let rendition = null;

      if (state.selectedFormat.width && state.selectedFormat.height && selectedAsset?.docType !== MediaType.Video) {
        previewer = (
          <CropPreviewer
            ref={previewerRef}
            loadable={state.previewLoadable}
            image={state.selectedFormat}
            resizer={state.resizeSize}
            cropper={state.cropSize}
            rotation={state.rotation}
            disabled={state.activeSetting !== 'crop'}
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
              videoUrl,
              extension: selectedAsset?.extension,
            }}
            isError={isError}
            isFetching={isFetching}
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

      if (searchInDrive) {
        return previewer;
      }

      if (state.showCustomRendition) {
        rendition = (
          <CustomRendition
            activeSetting={state.activeSetting}
            imageSize={{
              width: selectedAsset?.width ? Number(selectedAsset.width) : Infinity,
              height: selectedAsset?.height ? Number(selectedAsset.height) : Infinity,
            }}
            resize={{
              width: state.resizeSize.width,
              height: state.resizeSize.height,
              unit: state.resizeSize.unit,
            }}
            crop={{
              width: state.cropSize.width,
              height: state.cropSize.height,
              unit: state.cropSize.unit,
            }}
            lastAppliedCrop={state.lastCropSize}
            lastAppliedResize={state.lastResizeSize}
            rotation={state.rotation}
            extension={state.selectedFormat.extension}
            onResizeChange={onResizeChange}
            onCropChange={onCropChange}
            onRotateChange={onRotateChange}
            onViewChange={onViewChange}
            onExtensionChange={onExtensionChange}
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
                {supportedProxies &&
                  Object.entries(availableProxies ?? {}).map(
                    ([docType, proxies]) => (
                      <ProxyMenu
                        key={docType}
                        items={Object.entries(proxies).map(([, proxy]) => {
                          if (proxy.proxyName === 'TRX' && selectedAsset) {
                            return {
                              value: getProxyValue(proxy, selectedAsset.extension ?? ''),
                              name: proxy.proxyLabel,
                              width: selectedAsset.width,
                              height: selectedAsset.height,
                              extension: selectedAsset.extension,
                              docType,
                            };
                          }
                          return {
                            value: getProxyValue(proxy, selectedAsset?.extension ?? ''),
                            name: proxy.proxyLabel,
                            width: proxy.formatWidth,
                            height: proxy.formatHeight,
                            extension: proxy.extension,
                            docType,
                          };
                        })}
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
                            {<cx-icon slot="suffix" name={state.useRepresentative ? 'check' : ''}></cx-icon>}
                          </cx-menu-item>
                        )}
                      </ProxyMenu>
                    ),
                  )}
                {supportedATS && (
                  <ProxyMenu items={[]} selectedItem={state.selectedProxy}>
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
                        className='icon--large'
                      ></cx-icon>
                      <cx-icon
                        slot="suffix"
                        name={state.useCustomRendition ? 'check' : ''}
                        className='icon--large icon--primary'
                      ></cx-icon>
                    </cx-menu-item>
                  </ProxyMenu>
                )}
              </div>
            ) : null}
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
          </cx-space>
        );
      }

      return <>{previewer}{rendition}</>;
    };

    const renderFooter = () => {
      if (searchInDrive) {
        return (
          <cx-button
            className="dialog__footer__button"
            onClick={onOpenInDriveConfirm}
            variant="primary"
          >
            <cx-icon slot="prefix" name="folder"></cx-icon>
            {ctaText ?? 'Open in drive'}
          </cx-button>
        );
      }

      if (state.showCustomRendition) {
        return (
          <cx-space spacing="small" style={{ width: 'fit-content' }}>
            <cx-button
              variant="default"
              onClick={() => {
                dispatch({
                  type: 'CANCEL_USE_CUSTOM_RENDITION',
                  payload: {
                    url: selectedAsset?.imageUrl ?? '',
                    width: parseInt(selectedAsset?.width ?? '0', 10),
                    height: parseInt(selectedAsset?.height ?? '0', 10),
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
      }

      return (
        <cx-button
          className="dialog__footer__button"
          disabled={disabledInsert}
          variant="primary"
          style={{ flex: 1 }}
          onClick={() => {
            if (state.selectedProxy) {
              if (!selectedAsset?.docType) {
                return;
              }

              const [proxyName, extension] = state.selectedProxy.split('-');

              onProxyConfirm({
                extension,
                value: {
                  [selectedAsset.docType]: proxyName,
                },
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
    };

    return (
      <>
        <cx-space slot="label" direction="vertical" spacing="2x-small">
          <cx-typography variant="h4">Formats</cx-typography>
          <cx-typography variant="body3" className='asset-name'>
            <cx-line-clamp lines={1}>{selectedAsset?.name}</cx-line-clamp>
          </cx-typography>
        </cx-space>
        {renderBody()}
        <div slot="footer" className="dialog__footer">
          {renderFooter()}
        </div>
      </>
    );
  }, [
    allowCustomFormat,
    availableProxies,
    ctaText,
    extensions,
    isError,
    isFetching,
    searchInDrive,
    selectedAsset,
    videoUrl,
    supportedRepresentative,
    onClose,
    onCropChange,
    onExtensionChange,
    onFormatConfirm,
    onLoadingChange,
    onOpenInDriveConfirm,
    onProxyConfirm,
    onResizeChange,
    onRotateChange,
    onViewChange,
    state,
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
        } as CSSProperties
      }
    >
      {renderContent()}
    </Dialog>
  );
};

export default FormatDialog;
