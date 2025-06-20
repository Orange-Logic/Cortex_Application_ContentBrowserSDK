import _debounce from 'lodash-es/debounce';
import _intersection from 'lodash-es/intersection';
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
import { GlobalConfigContext } from '@/GlobalConfigContext';
import { useAppDispatch, useAppSelector } from '@/store';
import {
  useGetAvailableExtensionsQuery,
  useGetAvailableProxiesQuery, useGetParametersQuery, useGetSortOrdersQuery,
} from '@/store/assets/assets.api';
import { addAssetToFavorite, importAssets, removeAssetFromFavorite, selectedAssetIdSelector, setSelectedAssetId } from '@/store/assets/assets.slice';
import { authenticatedSelector, logout, applySessionSelector } from '@/store/auth/auth.slice';
import { useGetAssetByIdQuery, useGetAssetsQuery, useGetIsFavoriteQuery } from '@/store/search/search.api';
import { explorePath, RootFolder } from '@/store/search/search.slice';
import { useGetUserInfoQuery } from '@/store/user/user.api';
import { FormatLoaderState } from '@/types/assets';
import {
  Asset, Filter, Folder, GetAssetLinkResponse, GridView, SortDirection,
} from '@/types/search';
import { MOBILE_THRESHOLD, PAGE_SIZE, RESIZE_TIMEOUT } from '@/utils/constants';
import { getData, storeData } from '@/utils/storage';
import type { CxResizeEvent, CxResizeObserver } from '@orangelogic-private/design-system';
import { skipToken } from '@reduxjs/toolkit/query';

import { Container } from './Home.styled';

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
  extensions: string[];
  facets: Record<string, Record<string, number>>;
  hasScrolled: boolean;
  isLoading: boolean;
  isSeeThrough: boolean;
  mediaTypes: string[];
  openBrowser: boolean;
  start: number;
  pageSize: number;
  maxPageSize: number;
  searchText: string;
  shouldResetFilters: boolean;
  sortDirection?: 'ascending' | 'descending';
  sortOrder: string;
  statuses: string[];
  totalCount: number;
  view: GridView;
  visibilityClasses: string[];
};

type Action =
  | { type: 'RESET_SEARCH' }
  | { type: 'SET_CONTAINER_SIZE'; payload: { width: number; height: number } }
  | { type: 'SET_CURRENT_COUNT'; payload: number }
  | { type: 'SET_CURRENT_FOLDER'; payload: {
    folder: Folder,
    shouldResetFilters?: boolean;
  } }
  | { type: 'SET_FACETS'; payload: Record<string, Record<string, number>> }
  | { type: 'SET_FILTERS'; payload: Filter }
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
  extensions: [],
  facets: {},
  hasScrolled: false,
  isLoading: false,
  isSeeThrough: true,
  mediaTypes: [],
  openBrowser: false,
  start: 0,
  pageSize: 0,
  maxPageSize: 0,
  searchText: '',
  shouldResetFilters: true,
  sortDirection: undefined,
  sortOrder: '',
  statuses: [],
  totalCount: 0,
  view: GridView.Medium,
  visibilityClasses: [],
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
        mediaTypes: action.payload.mediaTypes,
        visibilityClasses: action.payload.visibilityClasses,
        shouldResetFilters: false,
        statuses: action.payload.statuses,
        extensions: action.payload.extensions,
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
      return { ...state, start: state.start + state.pageSize, pageSize: state.defaultPageSize };
    }
    case 'SET_PAGE_SIZE': {
      const result = { ...state, pageSize: action.payload.pageSize, maxPageSize: action.payload.pageSize };
      if (action.payload.returnToFirstPage) {
        result.start = 0;
      } else {
        result.start = state.start + state.pageSize;
        result.pageSize = Math.abs(action.payload.pageSize - result.start);
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
    allowedExtensions,
    allowedFolders,
    allowFavorites,
    allowProxy,
    allowTracking,
    availableDocTypes,
    availableRepresentativeSubtypes,
    ctaText,
    lastLocationMode,
    persistMode,
    showCollections,
    showFavoriteFolder,
    showVersions,
  } = useContext(GlobalConfigContext);
  const { extraFields, onAssetAction } = useContext(AppContext);

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

  const { data: availableExtensions } = useGetAvailableExtensionsQuery();

  const { data: params } = useGetParametersQuery({
    useSession,
  });
  const {
    ATSEnabled,
    autoExtension = '.auto',
    collectionPath,
    supportedDocTypes,
    supportedExtensions,
    supportedRepresentativeSubtypes,
  } = params || {};

  const { data: sortOrders } = useGetSortOrdersQuery({
    useSession,
  });

  const { data: isFavorite, refetch: refetchIsFavorite } = useGetIsFavoriteQuery(
    selectedAsset && allowFavorites ? {
      recordId: selectedAsset.id,
    } : skipToken);

  const [browserMounted, setBrowserMounted] = useState(false);
  const [isResized, setIsResized] = useState(false);
  const [showFormatLoader, setShowFormatLoader] = useState<FormatLoaderState>(FormatLoaderState.Hide);

  const browserMountedRef = useRef(browserMounted);
  const containerRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const containerResizeObserverRef = useRef<CxResizeObserver>(null);
  const loadedFromStorage = useRef(false);
  const facetsRef = useRef<Record<string, Record<string, number>>>({});
  const appDispatch = useAppDispatch();

  const pageSizeRef = useRef(state.pageSize);
  const viewRef = useRef(state.view);
  const isWindowResizing = useRef(false);
  const resizeTimerRef = useRef<NodeJS.Timeout | null>(null);
  browserMountedRef.current = browserMounted;
  facetsRef.current = state.facets;
  viewRef.current = state.view;
  pageSizeRef.current = state.pageSize;
  const formatDialogTimeoutRef = useRef<number | null>(null);

  const mappedMediaTypes = useMemo(() => {
    const globalIntersection = (availableDocTypes?.length ? _intersection(availableDocTypes, supportedDocTypes) : supportedDocTypes)?.map(item => item.toLowerCase());
    if (!globalIntersection || globalIntersection.length === 0) return state.mediaTypes;
    const intersection = state.mediaTypes.reduce((acc, mediaType) => {
      const [parent] = mediaType.split('>>');

      if (globalIntersection.includes(`${parent.toLowerCase()}*`) || globalIntersection.includes(parent.toLowerCase())) {
        if (!mediaType.includes('>>')) {
          return acc.concat(`${parent}*`);
        }

        return acc.concat(mediaType);
      }

      return acc;
    }, [] as string[]);
    if (intersection.length > 0) return intersection;
    return globalIntersection;
  }, [availableDocTypes, state.mediaTypes, supportedDocTypes]);

  const isConfigError = useMemo(() => (!mappedMediaTypes?.length || mappedMediaTypes.length === 0) && !!supportedDocTypes, [mappedMediaTypes, supportedDocTypes]);

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

  useEffect(() => console.log(mappedMediaTypes), [mappedMediaTypes]);

  const { data, isFetching, isError, refetch } = useGetAssetsQuery(isResized && sortOrders && mappedMediaTypes?.length && browserMounted ? {
    extensions: state.extensions,
    folderID: state.currentFolder.id,
    isSeeThrough: state.isSeeThrough,
    mediaTypes: mappedMediaTypes,
    start: state.start,
    pageSize: state.pageSize,
    searchText: state.searchText,
    sortOrder: selectedSortOrder?.id,
    statuses: state.statuses ?? [],
    visibilityClasses: state.visibilityClasses,
    useSession,
  } : skipToken);

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
        if (typeof view === 'string') {
          dispatch({ type: 'SET_VIEW', payload: view as GridView });
        }
        
        if (lastLocationMode) {
          if (newFacets) {
            const parsedFacets = JSON.parse(newFacets);
            dispatch({ type: 'SET_FACETS', payload: parsedFacets });
          }
          if (selectedFilter) {
            const parsedFilter = JSON.parse(selectedFilter);
            dispatch({ type: 'SET_FILTERS', payload: parsedFilter });
          }
          if (selectedIsSeeThrough) {
            dispatch({ type: 'SET_IS_SEE_THROUGH', payload: selectedIsSeeThrough === 'true' });
          }
          if (searchText) {
            dispatch({ type: 'SET_SEARCH_TEXT', payload: searchText });
          }
        }
      
        loadedFromStorage.current = true;
      });
    }
  }, [appDispatch, authenticated, lastLocationMode]);

  useEffect(() => {
    const resizeObserver = containerResizeObserverRef.current;
    if (!resizeObserver) {
      return;
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
  }, []);

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
      JSON.stringify({
        mediaTypes: state.mediaTypes,
        visibilityClasses: state.visibilityClasses,
        shouldResetFilters: false,
        statuses: state.statuses,
        extensions: state.extensions,
      }),
    );
    storeData('selectedIsSeeThrough', state.isSeeThrough.toString());
    storeData('searchText', state.searchText);
  }, [
    state.currentFolder,
    state.extensions,
    state.facets,
    state.isSeeThrough,
    state.mediaTypes,
    state.sortDirection,
    state.sortOrder,
    state.searchText,
    state.statuses,
    state.view,
    state.visibilityClasses,
  ]);

  const isMobile = state.containerSize.width <= MOBILE_THRESHOLD;

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
    if (newPageSize !== pageSizeRef.current) {
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
    return _debounce(handleResize, 300, {
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
          returnToFirstPage: true,
          force: true,
        });
      }
    }
  }, [debouncedHandleResize, state.view]);

  const onSettingChange = useCallback(
    (
      setting: string,
      value: GridView | SortDirection | Filter | string | boolean | string[],
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
          dispatch({ type: 'SET_FILTERS', payload: value as Filter });
          break;
        default:
          break;
      }
    },
    [],
  );

  const onDataChange = useCallback(
    (newData: {
      facets: Record<string, Record<string, number>>;
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
      if (folder.id === state.currentFolder.id) {
        return;
      }
      const resultAction = await appDispatch(explorePath(folder));
      if (explorePath.fulfilled.match(resultAction)) {
        dispatch({ type: 'SET_CURRENT_FOLDER', payload: {
          folder,
          shouldResetFilters: browserMountedRef.current,
        } });
        dispatch({ type: 'SET_OPEN_BROWSER', payload: false });
        appDispatch(setSelectedAssetId(null));
        storeData('lastLocation', JSON.stringify(folder));
      }
    },
    [appDispatch, state.currentFolder.id],
  );

  const onLoadMore = useCallback(() => {
    if (isWindowResizing.current) {
      isWindowResizing.current = false;
      return;
    }
    dispatch({ type: 'SET_START', payload: 1 });
  }, []);

  const onScroll = useCallback((e: MouseEvent) => {
    if (!e.target) {
      return;
    }

    if ((e.target as HTMLElement).scrollTop === 0) {
      dispatch({ type: 'SET_HAS_SCROLLED', payload: false });
    } else {
      dispatch({ type: 'SET_HAS_SCROLLED', payload: true });
    }
  }, []);

  const handleSelectedAsset = useCallback((images: GetAssetLinkResponse[]) => {
    window.OrangeDAMContentBrowser._onAssetSelected?.(images);
    if (persistMode) {
      return;
    }
    window.OrangeDAMContentBrowser._onClose?.();
  }, [persistMode]);

  const hasNextPage = useMemo(
    () => (data ? state.start + state.pageSize < state.totalCount : false),
    [data, state.pageSize, state.start, state.totalCount],
  );

  useEffect(() => {
    if (onDataChange) {
      onDataChange({
        currentCount: data?.items.length ?? 0,
        items: data?.items || [],
        facets: data?.facets || {},
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

  return (
    <cx-resize-observer ref={containerResizeObserverRef}>
      <Container ref={containerRef}>
        <Header
          bordered={state.hasScrolled}
          currentFolder={state.currentFolder}
          isFetching={isFetchingUserInfo}
          isLoading={state.isLoading || isLoadingUserInfo}
          userInfo={userInfo}
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
            currentCount={state.currentCount}
            extensions={state.extensions}
            facets={state.facets}
            isMobile={isMobile}
            isSeeThrough={state.isSeeThrough}
            loading={state.isLoading}
            mediaTypes={state.mediaTypes}
            searchValue={state.searchText}
            sortDirection={state.sortDirection}
            sortOrder={state.sortOrder}
            sortOrders={sortOrders}
            statuses={state.statuses}
            totalCount={state.totalCount}
            view={state.view}
            visibilityClasses={state.visibilityClasses}
            onSearchChange={onSearchChange}
            onSettingChange={onSettingChange}
          />
        </Header>
        <Browser
          allowedFolders={allowedFolders}
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
        />
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
                    key={
                      state.currentFolder.id +
                      state.searchText +
                      state.mediaTypes.join('+') +
                      state.extensions.join('+') +
                      state.statuses.join('+') +
                      state.visibilityClasses.join('+') +
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
          autoExtension={autoExtension}
          availableExtensions={availableExtensions}
          availableProxies={isErrorAvailableProxies ? [] : isFetchingAvailableProxies ? undefined : filteredProxies}
          ctaText={ctaText}
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
          onClose={() =>
            appDispatch(setSelectedAssetId(null))
          }
          onFavorite={async () => {
            if (!selectedAsset) {
              return false;
            }

            const result = await appDispatch(
              addAssetToFavorite({
                recordId: selectedAsset.id,
              }),
            );

            if (addAssetToFavorite.fulfilled.match(result)) {
              if (onAssetAction) {
                onAssetAction('favorite', selectedAsset.id);
              }
              await refetchIsFavorite();

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
          }) => {
            if (!selectedAsset) {
              return;
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

            if (importAssets.fulfilled.match(images)) {
              handleSelectedAsset(images.payload);
            }
          }}
          onFormatConfirm={async ({ value, parameters, proxiesPreference, extension }) => {
            if (!selectedAsset) {
              return;
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

            if (importAssets.fulfilled.match(images)) {
              handleSelectedAsset(images.payload);
            }
          }}
          onUnFavorite={async () => {
            if (!selectedAsset) {
              return false;
            }

            const result = await appDispatch(
              removeAssetFromFavorite({
                recordId: selectedAsset.id,
              }),
            );

            if (removeAssetFromFavorite.fulfilled.match(result)) {
              if (onAssetAction) {
                onAssetAction('unfavorite', selectedAsset.id);
              }
              await refetchIsFavorite();

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
      </Container>
    </cx-resize-observer>
  );
};

export default HomePage;
