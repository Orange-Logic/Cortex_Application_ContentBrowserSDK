import _camelCase from 'lodash-es/camelCase';
import _debounce from 'lodash-es/debounce';
import _intersection from 'lodash-es/intersection';
import _isArray from 'lodash-es/isArray';
import _pickBy from 'lodash-es/pickBy';
import {
  FC, useCallback, useContext, useEffect, useMemo, useReducer, useRef, useState,
} from 'react';
import { Size } from 'react-easy-crop';
import AutoSizer from 'react-virtualized-auto-sizer';

import { AppContext } from '@/AppContext';
import { Browser } from '@/components/Browser';
import ControlBar from '@/components/ControlBar';
import FormatDialog from '@/components/FormatDialog';
import Header from '@/components/Header/Header';
import AssetCardWrapper from '@/components/Result/AssetCard';
import { ASSET_SIZE } from '@/consts/asset';
import { COMPUTED_FIELDS } from '@/consts/data';
import { GlobalConfigContext } from '@/GlobalConfigContext';
import { useAppDispatch, useAppSelector } from '@/store';
import {
  useGetAvailableExtensionsQuery, useGetAvailableFacetsQuery, useGetAvailableProxiesQuery,
  useGetParametersQuery, useGetSortOrdersQuery,
} from '@/store/assets/assets.api';
import {
  addAssetToFavorite, importAssets, removeAssetFromFavorite, selectedAssetIdSelector,
  setSelectedAssetId,
} from '@/store/assets/assets.slice';
import { applySessionSelector, authenticatedSelector, logout } from '@/store/auth/auth.slice';
import {
  useGetAssetByIdQuery, useGetAssetsQuery, useGetIsFavoriteQuery,
} from '@/store/search/search.api';
import { explorePath, RootFolder } from '@/store/search/search.slice';
import { useGetUserInfoQuery } from '@/store/user/user.api';
import { FormatLoaderState } from '@/types/assets';
import {
  Asset, AssetLinkInfo, AssetTransformationInfo, Facet, Folder, GetAssetLinkResponse, GridView, SortDirection,
} from '@/types/search';
import { MOBILE_THRESHOLD, PAGE_SIZE, RESIZE_TIMEOUT } from '@/utils/constants';
import { isPromise } from '@/utils/function';
import { getData, storeData } from '@/utils/storage';
import { skipToken } from '@reduxjs/toolkit/query';

import { Container, Content } from './Home.styled';

import { FORCE_OVERLAY_THRESHOLD } from '@/components/Browser/Browser.constants';
import Loader from '@/components/Loader';
import type { CxResizeEvent, CxResizeObserver } from '@orangelogic/design-system';
import { captureAnchor } from '@/utils/dom';

type Props = {
  multiSelect?: boolean;
};

type State = {
  containerSize: {
    width: number;
    height: number;
  };
  currentCount: number;
  currentFolder: Folder;
  defaultPageSize: number;
  facets: Facet[];
  hasScrolled: boolean;
  isLoading: boolean;
  isSeeThrough: boolean;
  openBrowser: boolean;
  start: number;
  pageSize: number;
  maxPageSize: number;
  searchText: string;
  selectedFacets: Record<string, string[]>;
  shouldResetFilters: boolean;
  sortDirection?: 'ascending' | 'descending';
  sortOrder: string;
  totalCount: number;
  view: GridView;
};

type Action =
  | { type: 'RESET_SEARCH' }
  | { type: 'SET_CONTAINER_SIZE'; payload: { width: number; height: number } }
  | { type: 'SET_CURRENT_COUNT'; payload: number }
  | { type: 'SET_CURRENT_FOLDER'; payload: {
    folder: Folder,
    shouldResetFilters?: boolean;
  } }
  | { type: 'SET_FACETS'; payload: Facet[] }
  | { type: 'SET_FILTERS'; payload: Record<string, string[]> }
  | { type: 'SET_HAS_SCROLLED'; payload: boolean }
  | { type: 'SET_IS_LOADING'; payload: boolean }
  | { type: 'SET_IS_SEE_THROUGH'; payload: boolean }
  | { type: 'SET_OPEN_BROWSER'; payload: boolean }
  | { type: 'SET_START'; payload: number }
  | { type: 'SET_PAGE_SIZE'; payload: {
    pageSize: number;
    returnToFirstPage: boolean;
  } }
  | { type: 'SET_SEARCH_TEXT'; payload: string }
  | { type: 'SET_SORT_DIRECTION'; payload: 'ascending' | 'descending' | undefined }
  | { type: 'SET_SORT_ORDER'; payload: string }
  | { type: 'SET_TOTAL_COUNT'; payload: number }
  | { type: 'SET_VIEW'; payload: GridView };

const initialState: State = {
  containerSize: {
    width: 0,
    height: 0,
  },
  currentCount: 0,
  currentFolder: RootFolder,
  defaultPageSize: PAGE_SIZE,
  facets: [],
  hasScrolled: false,
  isLoading: false,
  isSeeThrough: true,
  openBrowser: false,
  start: 0,
  pageSize: 0,
  maxPageSize: 0,
  searchText: '',
  selectedFacets: {},
  shouldResetFilters: true,
  sortDirection: undefined,
  sortOrder: '',
  totalCount: 0,
  view: GridView.Medium,
};

const reducer = (state: State, action: Action): State => {
  const resetPageState = {
    start: 0,
    pageSize: state.maxPageSize,
  };
  switch (action.type) {
    case 'SET_CONTAINER_SIZE':
      return { ...state, containerSize: action.payload };
    case 'SET_CURRENT_COUNT':
      return { ...state, currentCount: action.payload };
    case 'SET_CURRENT_FOLDER':
      return { ...state, currentFolder: action.payload.folder, shouldResetFilters: !!action.payload.shouldResetFilters,  ...resetPageState };
    case 'SET_FACETS':
      return { ...state, facets: action.payload };
    case 'SET_FILTERS':
      return {
        ...state,
        selectedFacets: action.payload,
        shouldResetFilters: false,
        ...resetPageState,
      };
    case 'SET_HAS_SCROLLED':
      return { ...state, hasScrolled: action.payload };
    case 'SET_IS_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_IS_SEE_THROUGH':
      return { ...state, isSeeThrough: action.payload, ...resetPageState };
    case 'SET_OPEN_BROWSER':
      return { ...state, openBrowser: action.payload };
    case 'SET_START':{
      return { ...state, start: action.payload, pageSize: state.defaultPageSize };
    }
    case 'SET_PAGE_SIZE': {
      const result = { ...state, pageSize: action.payload.pageSize, maxPageSize: action.payload.pageSize };
      if (action.payload.returnToFirstPage) {
        result.start = 0;
      }
      return result;
    }
    case 'SET_SEARCH_TEXT':
      return { ...state,  ...resetPageState, searchText: action.payload };
    case 'SET_SORT_DIRECTION':
      return { ...state,  ...resetPageState, sortDirection: action.payload };
    case 'SET_SORT_ORDER':
      return { ...state,  ...resetPageState, sortOrder: action.payload };
    case 'SET_TOTAL_COUNT':
      return { ...state, totalCount: action.payload };
    case 'SET_VIEW': {
      let defaultPageSize = PAGE_SIZE;
      switch (action.payload) {
        case GridView.Large:
          defaultPageSize = 15;
          break;
        case GridView.Medium:
          defaultPageSize = 20;
          break;
        case GridView.Small:
          defaultPageSize = 30;
          break;
        default:
          break;
      }
      return { ...state, view: action.payload, defaultPageSize };
    }
    case 'RESET_SEARCH':
      return {
        ...state,
        currentCount: 0,
        currentFolder: RootFolder,
        searchText: '',
        totalCount: 0,
      };
    default:
      return state;
  }
};

const HomePage: FC<Props> = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const authenticated = useAppSelector(authenticatedSelector);
  const useSession = useAppSelector(applySessionSelector);
  const selectedAssetId = useAppSelector(selectedAssetIdSelector);
  const {
    allowedExtensions, // list of allowed extensions from runtime properties. e.g. ['.jpg', '.png', '.mp4']
    allowedFolders,
    allowFavorites,
    allowPin,
    allowProxy,
    allowTracking,
    availableDocTypes,
    availableRepresentativeSubtypes,
    ctaText,
    ctaTextTransform,
    lastLocationMode,
    persistMode,
    showCollections,
    showFavoriteFolder,
    showVersions,
    defaultGridView,
  } = useContext(GlobalConfigContext);
  const { extraFields, onAssetAction, onAssetSelected, onClose } = useContext(AppContext);

  const { data: selectedAssetData, isFetching: isFetchingSelectedAsset, isError: isErrorSelectedAsset } = useGetAssetByIdQuery(selectedAssetId ? {
    id: selectedAssetId,
    useSession,
  } : skipToken);

  const selectedAsset = useMemo(() => {
    if (!selectedAssetData || !selectedAssetId || selectedAssetData.recordId !== selectedAssetId) {
      return null;
    }
    return selectedAssetData;
  }, [selectedAssetData, selectedAssetId]); 

  const { data: userInfo, isFetching: isFetchingUserInfo, isLoading: isLoadingUserInfo, refetch: refetchUserInfo } = useGetUserInfoQuery({});

  useEffect(() => {
    if (authenticated) {
      refetchUserInfo();
    }
  }, [authenticated, refetchUserInfo]);

  const {
    data: availableProxies,
    isFetching: isFetchingAvailableProxies,
    isError: isErrorAvailableProxies,
  } = useGetAvailableProxiesQuery(selectedAsset
    ? {
      assetImages: selectedAsset ? [selectedAsset] : [],
      useSession,
    }
    : skipToken,
  );

  const { data: availableExtensions } = useGetAvailableExtensionsQuery({ useSession });

  const { data: params } = useGetParametersQuery({
    useSession,
  });
  const {
    ATSEnabled,
    autoExtension = '.auto',
    collectionPath,
    supportedExtensions,
    supportedRepresentativeSubtypes,
  } = params || {};

  const { data: sortOrders } = useGetSortOrdersQuery({
    useSession,
  });

  const { data: availableFacets } = useGetAvailableFacetsQuery({ useSession });

  const { data: isFavorite, refetch: refetchIsFavorite } = useGetIsFavoriteQuery(
    selectedAsset && allowFavorites ? {
      recordId: selectedAsset.id,
    } : skipToken);

  const [browserMounted, setBrowserMounted] = useState(false);
  const [isResized, setIsResized] = useState(false);
  const [showFormatLoader, setShowFormatLoader] = useState<FormatLoaderState>(FormatLoaderState.Hide);
  const [itemsCount, setItemsCount] = useState(0);
  const [isPersistent, setIsPersistent] = useState(false);
  const [isInitialLoadComplete, setIsInitialLoadComplete] = useState(false);

  const browserMountedRef = useRef(browserMounted);
  const containerRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const containerResizeObserverRef = useRef<CxResizeObserver>(null);
  const loadedFromStorage = useRef(false);
  const facetsRef = useRef<Facet[]>([]);
  const selectedFacetsRef = useRef<Record<string, string[]>>({});
  const appDispatch = useAppDispatch();

  const pageSizeRef = useRef(state.pageSize);
  const viewRef = useRef(state.view);
  const isWindowResizing = useRef(false);
  const resizeTimerRef = useRef<NodeJS.Timeout | null>(null);
  browserMountedRef.current = browserMounted;
  facetsRef.current = state.facets;
  selectedFacetsRef.current = state.selectedFacets;
  viewRef.current = state.view;
  pageSizeRef.current = state.pageSize;
  const formatDialogTimeoutRef = useRef<number | null>(null);
  const assetScrollAnchorRef = useRef<{
    id: string;
    offset: number;
  } | null>(null);
  const assetScrollContainerRef = useRef<HTMLDivElement>(null);

  const mappedMediaTypes = useMemo(() => {
    if (state.selectedFacets.Types && state.selectedFacets.Types.length > 0) return state.selectedFacets.Types;
    return ['*'];
  }, [state.selectedFacets]);

  const isConfigError = useMemo(() => !mappedMediaTypes?.length || mappedMediaTypes.length === 0, [mappedMediaTypes]);

  const selectedSortOrder = useMemo(() => {
    if (!sortOrders) {
      return undefined;
    }

    const defaultSortOrder = Object.values(sortOrders).find(
      (sortOrder) => sortOrder.some((order) => order.isDefault),
    )?.[0];

    if (!state.sortOrder || !sortOrders[state.sortOrder] || sortOrders[state.sortOrder].length === 0) {
      if (defaultSortOrder) {
        dispatch({ type: 'SET_SORT_DIRECTION', payload: defaultSortOrder.sortDirection.toLowerCase() as 'ascending' | 'descending' });
        dispatch({ type: 'SET_SORT_ORDER', payload: defaultSortOrder.sortDirectionGroupKey.toLowerCase() });
      }

      return defaultSortOrder;
    }

    if (sortOrders[state.sortOrder].length === 1) {
      return sortOrders[state.sortOrder][0];
    }

    return sortOrders[state.sortOrder].find(
      ({ sortDirection }) => sortDirection.toLowerCase() === state.sortDirection,
    );
  }, [sortOrders, state.sortDirection, state.sortOrder]);

  const filteredProxies = useMemo(() => {
    return availableProxies?.proxies.filter(proxy => {
      if (!allowedExtensions || allowedExtensions.length === 0) return true;
      let proxyExtension = '';
      if (!proxy.extension) {
        const extensionFromPermanentLinks = proxy.permanentLink?.split('.').at(-1);
        proxyExtension = extensionFromPermanentLinks ?? '';
      } else {
        proxyExtension = proxy.extension.replace('.', '');
      }

      return allowedExtensions.some(extension => {
        if (!proxyExtension) return false;
        return proxyExtension.toLowerCase() === extension.toLowerCase();
      });
    });
  }, [availableProxies, allowedExtensions]);

  const shouldFetch = useMemo(() => {
    return isResized && sortOrders && mappedMediaTypes?.length && browserMounted;
  }, [isResized, sortOrders, mappedMediaTypes, browserMounted]);

  const { data, isFetching, isError, refetch } = useGetAssetsQuery(shouldFetch ? {
    folderID: state.currentFolder.id,
    isSeeThrough: state.isSeeThrough,
    limitedToDocTypes: availableDocTypes,
    pageSize: state.pageSize,
    searchText: state.searchText,
    selectedFacets: state.selectedFacets,
    sortOrder: selectedSortOrder?.id,
    start: state.start,
    useSession,
  } : skipToken);

  useEffect(() => {
    setItemsCount(data?.items.length ?? 0);
  }, [data?.items.length]);

  useEffect(() => {
    if (isErrorSelectedAsset) {
      appDispatch(setSelectedAssetId(null));
    }
  }, [appDispatch, isErrorSelectedAsset]);

  useEffect(() => {
    if (onAssetAction && selectedAsset?.recordId) {
      onAssetAction('select', selectedAsset.recordId);
    }
  }, [onAssetAction, selectedAsset]);

  useEffect(() => {
    // isFetching is constantly switched between true and false due to the changed parameters
    // Set isLoading to true when isFetching is true for at least 200ms and set it to false when isFetching is false for at least 200ms
    let timer = null;

    if (isFetching) {
      dispatch({ type: 'SET_IS_LOADING', payload: true });
    } else {
      timer = setTimeout(() => {
        dispatch({ type: 'SET_IS_LOADING', payload: isFetching });
      }, 200);
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [isFetching]);
  
  useEffect(() => {
    if (authenticated) {
      appDispatch(setSelectedAssetId(null));
      dispatch({ type: 'RESET_SEARCH' });

      Promise.all([
        getData('selectedSortOrder'),
        getData('selectedSortDirection'),
        getData('selectedView'),
        getData('newFacets'),
        getData('selectedFilter'),
        getData('selectedIsSeeThrough'),
        getData('searchText'),
      ]).then(([sortOrder, sortDirection, view, newFacets, selectedFilter, selectedIsSeeThrough, searchText]) => {
        if (sortOrder) {
          dispatch({ type: 'SET_SORT_ORDER', payload: sortOrder });
        }
        if (sortDirection === 'ascending' || sortDirection === 'descending') {
          dispatch({ type: 'SET_SORT_DIRECTION', payload: sortDirection });
        }
      
        if (view === null) {
          view = defaultGridView;
        }

        if (typeof view === 'string') {
          if (!Object.values(GridView).includes(view as GridView)) {
            /**
             * Default to Medium if the stored view is invalid.
             */
            dispatch({ type: 'SET_VIEW', payload: GridView.Medium });
          } else {
            dispatch({ type: 'SET_VIEW', payload: view as GridView });
          }
        }
      
        if (lastLocationMode) {
          if (newFacets) {
            const parsedFacets = JSON.parse(newFacets);
            if (_isArray(parsedFacets)) {
              dispatch({ type: 'SET_FACETS', payload: parsedFacets });
            } else {
              dispatch({ type: 'SET_FACETS', payload: [] });
            }
          }
          if (selectedFilter) {
            const parsedFilter = JSON.parse(selectedFilter);

            if (parsedFilter) {
              dispatch({ type: 'SET_FILTERS', payload: _pickBy(parsedFilter, _isArray) });
            } else {
              dispatch({ type: 'SET_FILTERS', payload: {} });
            }
          }
          if (selectedIsSeeThrough) {
            dispatch({ type: 'SET_IS_SEE_THROUGH', payload: selectedIsSeeThrough === 'true' });
          }
          if (searchText) {
            dispatch({ type: 'SET_SEARCH_TEXT', payload: searchText });
          }
        }

        loadedFromStorage.current = true;
        setIsInitialLoadComplete(true);
      });
    }
  }, [appDispatch, authenticated, lastLocationMode, defaultGridView]);

  useEffect(() => {
    /**
     * Force re-render of the container to ensure that the width is recalculated correctly.
     * The issue is that the container width is not updated correctly when the Content Browser is mounted inside custom windows, e.g. in the File on Demand, Contentful.
     */
    let timeout = null;
    const container = containerRef.current;

    if (!container) {
      return;
    }

    const currentWidth = container.offsetWidth;
    container.style.width = (currentWidth - 1) + 'px';

    timeout = setTimeout(() => {
      container.style.width = '100%';
    }, 50);

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [authenticated]);

  useEffect(() => {
    const resizeObserver = containerResizeObserverRef.current;
    if (!resizeObserver) {
      return;
    }
    if (containerRef.current) {
      dispatch({
        type: 'SET_CONTAINER_SIZE',
        payload: {
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        },
      });
    }
    const onResize = (e: CxResizeEvent) => {
      const entries = e.detail.entries;

      window.requestAnimationFrame((): void | undefined => {
        if (!Array.isArray(entries) || !entries.length) {
          return;
        }
        if (entries[0].target === containerRef.current) {
          dispatch({
            type: 'SET_CONTAINER_SIZE',
            payload: {
              width: entries[0].contentRect.width,
              height: entries[0].contentRect.height,
            },
          });
        }
      });
    };

    resizeObserver.addEventListener('cx-resize', onResize);

    return () => {
      resizeObserver.removeEventListener('cx-resize', onResize);
    };
  }, [isInitialLoadComplete]);

  useEffect(() => {
    if (!selectedSortOrder && loadedFromStorage.current) {
      dispatch({ type: 'SET_SORT_ORDER', payload: initialState.sortOrder });
    }
  }, [selectedSortOrder, sortOrders]);

  useEffect(() => {
    if (!loadedFromStorage.current) {
      return;
    }

    storeData('selectedSortOrder', state.sortOrder);
    if (state.sortDirection) {
      storeData('selectedSortDirection', state.sortDirection);
    }
    storeData('selectedView', state.view);
    storeData('newFacets', JSON.stringify(state.facets));
    storeData(
      'selectedFilter',
      JSON.stringify(state.selectedFacets),
    );
    storeData('selectedIsSeeThrough', state.isSeeThrough.toString());
    storeData('searchText', state.searchText);
  }, [state.currentFolder, state.facets, state.isSeeThrough, state.sortDirection, state.sortOrder, state.searchText, state.view, state.selectedFacets]);

  const isMobile = state.containerSize.width > 0 && state.containerSize.width <= MOBILE_THRESHOLD;

  const onItemSelect = (item: Asset) => {
    appDispatch(setSelectedAssetId(item.recordId));
  };

  const onSearchChange = useCallback((value: string) => {
    appDispatch(setSelectedAssetId(null));
    dispatch({ type: 'SET_SEARCH_TEXT', payload: value });
  }, [appDispatch]);

  const lastHeightRef = useRef(0);
  const lastWidthRef = useRef(0);

  const defaultPageSizeRef = useRef(state.defaultPageSize);
  defaultPageSizeRef.current = state.defaultPageSize;
  
  const handleResize = useCallback((rect: Size, options?:{ returnToFirstPage?: boolean, force?: boolean }) => {
    const { width, height } = rect;
    const containerWidth = width || 0;
    const containerHeight = height || 0;
    if (containerWidth * containerHeight === 0 || !loadedFromStorage.current) {
      return;
    }
    const lastHeight = lastHeightRef.current;
    const lastWidth = lastWidthRef.current;
    if (Math.abs(lastHeight - containerHeight) < 10 && Math.abs(lastWidth - containerWidth) < 10 && !options?.force) {
      return;
    }
    lastHeightRef.current = containerHeight;
    lastWidthRef.current = containerWidth;
    const gutter = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--cx-spacing-medium') || '16', 10);
    const breakpoint = ASSET_SIZE[viewRef.current]?.minWidth || ASSET_SIZE[GridView.Large].minWidth;
    const columnCount = Math.max(1, Math.floor((containerWidth + gutter) / (breakpoint + gutter)));
    const rowCount = Math.ceil(containerHeight / (breakpoint + gutter));
    const newPageSize = Math.ceil((rowCount * columnCount) / defaultPageSizeRef.current + 1) * defaultPageSizeRef.current;
    setIsResized(true);
    if (newPageSize !== pageSizeRef.current && newPageSize !== 0) {
      dispatch({
        type: 'SET_PAGE_SIZE',
        payload: {
          pageSize: newPageSize,
          returnToFirstPage: !!options?.returnToFirstPage,
        },
      });
    }
  }, []);

  const debouncedHandleResize = useMemo(() => {
    return _debounce(handleResize, RESIZE_TIMEOUT, {
      leading: false,
    });
  }, [handleResize]);

  useEffect(() => {
    if (loadedFromStorage.current) {
      const container = resultRef.current;
      viewRef.current = state.view;
      if (container) {
        debouncedHandleResize({
          width: container.clientWidth,
          height: container.clientHeight,
        }, {
          force: true,
        });
      }
    }
  }, [debouncedHandleResize, state.view]);

  const onSettingChange = useCallback(
    (
      setting: string,
      value: GridView | SortDirection | Record<string, string[]> | string | boolean | string[],
    ) => {
      switch (setting) {
        case 'view':
          dispatch({ type: 'SET_VIEW', payload: value as GridView });
          break;
        case 'sortDirection':
          dispatch({
            type: 'SET_SORT_DIRECTION',
            payload: value as SortDirection,
          });
          break;
        case 'sortOrder':
          dispatch({ type: 'SET_SORT_ORDER', payload: value.toString() });
          break;
        case 'isSeeThrough':
          dispatch({ type: 'SET_IS_SEE_THROUGH', payload: Boolean(value) });
          break;
        case 'filter':
          dispatch({ type: 'SET_FILTERS', payload: value as Record<string, string[]> });
          break;
        default:
          break;
      }
    },
    [],
  );

  const onDataChange = useCallback(
    (newData: {
      facets: Facet[];
      items: Asset[];
      totalCount: number;
      currentCount: number;
    }) => {
      dispatch({ type: 'SET_CURRENT_COUNT', payload: newData.currentCount });
      dispatch({ type: 'SET_TOTAL_COUNT', payload: newData.totalCount });
      dispatch({ type: 'SET_FACETS', payload: newData.facets });
    },
    [],
  );

  const onFolderSelect = useCallback(
    async (folder: Folder) => {
      if (!browserMountedRef.current) {
        setBrowserMounted(true);
      }
      const resultAction = await appDispatch(explorePath(folder));
      if (explorePath.fulfilled.match(resultAction)) {
        dispatch({ type: 'SET_CURRENT_FOLDER', payload: {
          folder,
          shouldResetFilters: browserMountedRef.current,
        } });
        if (!isPersistent) {
          dispatch({ type: 'SET_OPEN_BROWSER', payload: false });
        }
        appDispatch(setSelectedAssetId(null));
        storeData('lastLocation', JSON.stringify(folder));
      }
    },
    [appDispatch, isPersistent],
  );

  const onLoadMore = useCallback(() => {
    if (isWindowResizing.current) {
      isWindowResizing.current = false;
      return;
    }
    dispatch({ type: 'SET_START', payload: itemsCount ?? 0 });
  }, [itemsCount]);

  const onScroll = useCallback((e: MouseEvent) => {
    if (!e.target) {
      return;
    }

    assetScrollContainerRef.current = e.target as HTMLDivElement;

    const newScrollTop = (e.target as HTMLElement).scrollTop;
    
    if (newScrollTop === 0) {
      dispatch({ type: 'SET_HAS_SCROLLED', payload: false });
    } else {
      dispatch({ type: 'SET_HAS_SCROLLED', payload: true });
    }
    const anchor = captureAnchor(e.target as HTMLElement, {
      itemSelector: 'cx-card',
    });
    if (anchor) {
      assetScrollAnchorRef.current = anchor;
    }
  }, []);

  const handleSelectedAsset = useCallback(async (images: GetAssetLinkResponse[], selectedProxyMetadata?: AssetLinkInfo, transformedAssetMetadata?: AssetTransformationInfo) => {
    const payload = [...images];
    // inject info from COMPUTED_FIELDS if requested, which are from the getContent api, not from the extrafields of the getLink response
    COMPUTED_FIELDS.forEach((item) => {
      const key = _camelCase(item) as keyof typeof selectedAsset;
      if (selectedAsset && extraFields?.includes(item)) {
        payload[0] = {
          ...payload[0],
          extraFields: {
            ...(payload[0]?.extraFields || {}),
            [item]: selectedAsset[key],
          },
        };
      }
      // inject info from the selected proxy or transformation
      if (transformedAssetMetadata) { 
        // inject info stored in the selected transformation in UI, the transformation source from the AvailableProxies api, and the link from the getLink response
        payload[0] = {
          ...payload[0],
          assetTransformationSource: selectedProxyMetadata,
          assetLinkInfo: {
            extension: transformedAssetMetadata.extension,
            isCustomFormat: transformedAssetMetadata.isCustomFormat ?? true,
            permanentLink: payload[0].imageUrl,
            width: transformedAssetMetadata.width,
            height: transformedAssetMetadata.height,
          },
        };
      } else {
        // inject info from the selected proxy from the AvailableProxies api, and the link from the getLink response
        payload[0] = { 
          ...payload[0],
          assetLinkInfo: { 
            cdnName: selectedProxyMetadata?.cdnName ?? null,
            extension: selectedProxyMetadata?.extension ?? null,
            isCustomFormat: selectedProxyMetadata?.isCustomFormat ?? false,
            permanentLink: payload[0].imageUrl ?? null,
            proxyLabel: selectedProxyMetadata?.proxyLabel ?? null,
            proxyName: selectedProxyMetadata?.proxyName ?? null,
            width: selectedProxyMetadata?.width ?? null,
            height: selectedProxyMetadata?.height ?? null,
          },
        };
      }
    });

    const result = onAssetSelected(payload);

    if (isPromise(result)) {
      try {
        await result;
      } catch (error) {
        console.error('Error in onAssetSelected:', error);
        return false;
      }
    }

    if (persistMode) {
      return true;
    }
    onClose?.();

    return true;
  }, [extraFields, onAssetSelected, onClose, persistMode, selectedAsset]);

  const hasNextPage = useMemo(
    () => (data ? state.start + state.pageSize < state.totalCount : false),
    [data, state.pageSize, state.start, state.totalCount],
  );

  useEffect(() => {
    if (onDataChange) {
      // Create a map for efficient facet lookup and updates
      const facetsMap = new Map(
        facetsRef.current.map(facet => [
          `${facet.facetDetails.facetFieldName}|${facet.facetDetails.displayName}`,
          // Reset count to 0 for existing facets
          {
            ...facet,
            values: facet.values.reduce((acc, value) => {
              const isFacetSelected = selectedFacetsRef
                .current[facet.facetDetails.facetFieldName]
                ?.find(selectedValue => selectedValue === value.value);
              if (isFacetSelected) {
                acc.push({ ...value, count: 0 });
              }

              return acc;
            }, [] as Facet['values']),
          },
        ]),
      );

      // Update with new facets data
      const newFacets = data?.facets?.filter(facet => facet.values.length > 0) ?? [];
      newFacets.forEach(facet => {
        const currentFacetValue = facetsMap.get(`${facet.facetDetails.facetFieldName}|${facet.facetDetails.displayName}`);
        const values = [
          ...facet.values,
          ...(currentFacetValue?.values.filter(currValue => !facet?.values.find(v => currValue.value === v.value && currValue.displayValue === v.displayValue)) ?? []),
        ];

        facetsMap.set(`${facet.facetDetails.facetFieldName}|${facet.facetDetails.displayName}`, { ...facet, values });
      });

      onDataChange({
        currentCount: data?.items.length ?? 0,
        items: data?.items ?? [],
        facets: Array.from(facetsMap.values()),
        totalCount: data?.totalCount ?? 0,
      });
    }
  }, [data, onDataChange]);

  useEffect(() => {
    const onWindowResize = () => {
      isWindowResizing.current = true;

      if (resizeTimerRef.current) {
        clearTimeout(resizeTimerRef.current);
      }

      resizeTimerRef.current = setTimeout(() => {
        isWindowResizing.current = false;
      }, RESIZE_TIMEOUT);
    };
    
    window.addEventListener('resize', onWindowResize);
    return () => {
      window.removeEventListener('resize', onWindowResize);
    };
  }, []);

  useEffect(() => {
    const timeout = formatDialogTimeoutRef.current;
    const clearTimeout = () => {
      if (timeout) {
        window.clearTimeout(timeout);
      }
    };
    clearTimeout();

    if (isFetchingSelectedAsset || isFetchingAvailableProxies) {
      setShowFormatLoader(FormatLoaderState.Hide); // Hide the loader and the dialog when starting to fetch proxies
      formatDialogTimeoutRef.current = window.setTimeout(() => {
        setShowFormatLoader(FormatLoaderState.ShowLoader); // Show loader after 800ms
      }, 800);
    } else if (!isFetchingSelectedAsset && !isFetchingAvailableProxies && (availableProxies?.proxies || isErrorAvailableProxies)) {
      if (formatDialogTimeoutRef.current) {
        clearTimeout();
        setShowFormatLoader(FormatLoaderState.ShowDialog); // Hide loader when proxies are fetched
      }
    }

    return () => {
      clearTimeout();
    };

  }, [availableProxies, isErrorAvailableProxies, isFetchingAvailableProxies, isFetchingSelectedAsset]);

  useEffect(() =>{
    if (!selectedAsset) {
      // If no asset is selected, set this to ShowDialog so the dialog can be shown when there is no need to fetch availableProxies.
      setShowFormatLoader(FormatLoaderState.ShowDialog);
    }
  }, [selectedAsset]);

  const filteredAllowedExtensions = useMemo(() => { 
    // object of extensions that's available for selection in the custom format dialog. 
    // E.g. {Image: [{display: 'JPG', value: '.jpg'}], Audio: [{display: 'MP3', value: '.mp3'}]}
    if (!availableExtensions || !allowedExtensions || allowedExtensions.length === 0) {
      return availableExtensions;
    }
    
    return Object.entries(availableExtensions).reduce((acc, [key, value]) => {
      return {
        ...acc,
        [key]: value.filter((ext) => {
          if (!allowedExtensions || allowedExtensions.length === 0) {
            return true;
          }
          return allowedExtensions.some((item) => ext.value.toLowerCase() === `.${item.toLowerCase()}`);
        }),
      };
    }, availableExtensions);
  }, [availableExtensions, allowedExtensions]);

  const forceOverlay = state.containerSize.width < FORCE_OVERLAY_THRESHOLD;

  if (!isInitialLoadComplete) {
    return <Loader />;
  }

  return (
    <cx-resize-observer ref={containerResizeObserverRef}>
      <Container ref={containerRef} className="cbsdk__home">
        <Browser
          allowedFolders={allowedFolders}
          allowPin={allowPin}
          collectionPath={collectionPath}
          currentFolder={state.currentFolder}
          favoriteFolderId={userInfo?.favoriteFolderRecordID}
          lastLocationMode={lastLocationMode}
          open={state.openBrowser}
          showCollections={showCollections}
          showFavoriteFolder={showFavoriteFolder}
          useSession={useSession}
          onFolderSelect={onFolderSelect}
          onClose={() => dispatch({ type: 'SET_OPEN_BROWSER', payload: false })}
          isPersistent={isPersistent}
          onChangePersistent={setIsPersistent}
          forceOverlay={forceOverlay}
          damViewSeeThru={state.isSeeThrough}
        />
        <Content>
          <Header
            bordered={state.hasScrolled}
            currentFolder={state.currentFolder}
            isFetching={isFetchingUserInfo}
            isLoading={isLoadingUserInfo}
            userInfo={userInfo}
            showMenu={!isPersistent}
            onMenuClick={() =>
              dispatch({ type: 'SET_OPEN_BROWSER', payload: true })
            }
            onLogout={() => {
              appDispatch(logout());
              appDispatch(setSelectedAssetId(null));
              dispatch({ type: 'RESET_SEARCH' });
            }}
          >
            <ControlBar
              allowSorting={selectedSortOrder?.sortDirection !== 'Mono' && !!selectedSortOrder}
              availableFacets={availableFacets ?? []}
              currentCount={state.currentCount}
              facets={state.facets}
              isMobile={isMobile}
              isSeeThrough={state.isSeeThrough}
              loading={state.isLoading}
              searchValue={state.searchText}
              selectedFacets={state.selectedFacets}
              sortDirection={state.sortDirection}
              sortOrder={state.sortOrder}
              sortOrders={sortOrders}
              totalCount={state.totalCount}
              view={state.view}
              onSearchChange={onSearchChange}
              onSettingChange={onSettingChange}
            />
          </Header>
            <div
              style={{
                flex: 1,
                minHeight: '320px',
                padding: '0 var(--cx-spacing-medium)',
                position: 'relative',
              }}
            >
            <AutoSizer onResize={debouncedHandleResize}>
              {({ height, width }: Size) => {
                return (
                  <div 
                    style={{
                      height: height + 'px',
                      width: width + 'px',
                    }}
                  >
                    <AssetCardWrapper
                      ref={resultRef}
                      isError={isError}
                      isConfigError={isConfigError}
                      hasNextPage={hasNextPage}
                      height={height}
                      isLoadingData={state.isLoading || !data}
                      isFetched={!!data || isConfigError}
                      items={data?.items || []}
                      selectedAsset={selectedAsset ?? null}
                      view={state.view}
                      width={width}
                      onItemSelect={onItemSelect}
                      onLoadMore={onLoadMore}
                      onScroll={onScroll}
                      scrollAnchor={assetScrollAnchorRef.current}
                      key={
                        state.currentFolder.id +
                        state.searchText +
                        Object.values(state.selectedFacets).join('+') +
                        state.isSeeThrough +
                        state.view
                      }
                    />
                  </div>
                );
              }}
            </AutoSizer>
          </div>
          {showFormatLoader === FormatLoaderState.ShowLoader && (
            <cx-space className="format-loader">
              <cx-spinner></cx-spinner>
            </cx-space>
          )}
          <FormatDialog
          allowCustomFormat={!!ATSEnabled && !!selectedAsset?.allowATSLink}
          allowFavorites={allowFavorites}
          allowProxy={allowProxy}
          allowTracking={allowTracking}
          allowedExtensions={allowedExtensions}
          appendAutoExtension={allowedExtensions?.includes(autoExtension) ?? false}
          autoExtension={autoExtension}
          availableExtensions={filteredAllowedExtensions}
          availableProxies={isErrorAvailableProxies ? [] : isFetchingAvailableProxies ? undefined : filteredProxies}
          ctaText={ctaText}
          ctaTextTransform={ctaTextTransform}
          extensions={supportedExtensions ?? []}
          isFavorite={!!isFavorite}
          maxHeight={state.containerSize.height}
          open={!!selectedAsset && showFormatLoader === FormatLoaderState.ShowDialog}
          previewUrl={isErrorAvailableProxies || isFetchingAvailableProxies ? undefined : availableProxies?.previewUrl}
          selectedAsset={selectedAsset ?? null}
          showVersions={showVersions}
          supportedRepresentativeSubtypes={
            availableRepresentativeSubtypes?.length
              ? _intersection(
                availableRepresentativeSubtypes,
                supportedRepresentativeSubtypes,
              )
              : supportedRepresentativeSubtypes
          }
          variant={isMobile ? 'drawer' : 'dialog'}
          boundary={containerRef.current}
          onClose={() => {
            appDispatch(setSelectedAssetId(null));
            onAssetAction('unselect', '');
          }}
          onFavorite={async () => {
            if (!selectedAsset) {
              return false;
            }

            const result = await appDispatch(
              addAssetToFavorite({
                recordId: selectedAsset.recordId,
              }),
            );

            if (addAssetToFavorite.fulfilled.match(result)) {
              if (onAssetAction) {
                onAssetAction('favorite', selectedAsset.recordId);
              }
              await refetchIsFavorite();
              if (onAssetAction) {
                onAssetAction('afterFavorite', selectedAsset.recordId);
              }

              if (state.currentFolder.id === userInfo?.favoriteFolderRecordID) {
                if (state.start === 0) {
                  refetch();
                } else {
                  dispatch({
                    type: 'SET_CURRENT_FOLDER',
                    payload: {
                      folder: state.currentFolder,
                      shouldResetFilters: true,
                    },
                  });
                }
              }
            }

            if (result) {
              return true;
            }

            return result;
          }}
          onProxyConfirm={async ({
            extension,
            value,
            permanentLink,
            parameters,
            useRepresentative,
            selectedProxyMetadata,
          }) => {
            if (!selectedAsset) {
              return false;
            }

            const images = await appDispatch(
              importAssets({
                extension,
                extraFields,
                parameters,
                permanentLink,
                proxiesPreference: value,
                selectedAsset: selectedAsset,
                useRepresentative,
                useSession,
              }),
            );

            let successfullyInserted = false;
            if (importAssets.fulfilled.match(images)) {
              successfullyInserted = await handleSelectedAsset(images.payload, selectedProxyMetadata);
            }

            return successfullyInserted;
          }}
          onFormatConfirm={async ({ value, parameters, proxiesPreference, extension, sourceProxyMetadata, transformedAssetMetadata }) => {
            if (!selectedAsset) {
              return false;
            }

            const maxWidth = selectedAsset?.width
              ? parseInt(selectedAsset.width, 10)
              : 0;
            const maxHeight = selectedAsset?.height
              ? parseInt(selectedAsset.height, 10)
              : 0;
            const images = await appDispatch(
              importAssets({
                extraFields,
                extension,
                maxHeight,
                maxWidth,
                parameters,
                proxiesPreference,
                selectedAsset,
                useSession,
                transformations: value,
              }),
            );

            let successfullyInserted = false;

            if (importAssets.fulfilled.match(images)) {
              successfullyInserted = await handleSelectedAsset(images.payload, sourceProxyMetadata, transformedAssetMetadata);
            }

            return successfullyInserted; 
          }}
          onUnFavorite={async () => {
            if (!selectedAsset) {
              return false;
            }

            const result = await appDispatch(
              removeAssetFromFavorite({
                recordId: selectedAsset.recordId,
              }),
            );

            if (removeAssetFromFavorite.fulfilled.match(result)) {
              if (onAssetAction) {
                onAssetAction('unfavorite', selectedAsset.recordId);
              }
              await refetchIsFavorite();
              if (onAssetAction) {
                onAssetAction('afterUnfavorite', selectedAsset.recordId);
              }

              if (state.currentFolder.id === userInfo?.favoriteFolderRecordID) {
                if (state.start === 0) {
                  refetch();
                } else {
                  dispatch({
                    type: 'SET_CURRENT_FOLDER',
                    payload: {
                      folder: state.currentFolder,
                      shouldResetFilters: true,
                    },
                  });
                }
              }
            }

            if (result) {
              return true;
            }

            return result;
          }}
        />
        </Content>
      </Container>
    </cx-resize-observer>
  );
};

export default HomePage;
