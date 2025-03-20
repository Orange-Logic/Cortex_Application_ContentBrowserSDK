import _intersection from 'lodash-es/intersection';
import isEqual from 'lodash-es/isEqual';
import { FC, useCallback, useContext, useEffect, useMemo, useReducer, useRef } from 'react';

import { AppContext } from '@/AppContext';
import { Browser } from '@/components/Browser';
import ControlBar from '@/components/ControlBar';
import FormatDialog from '@/components/FormatDialog';
import Header from '@/components/Header/Header';
import Results from '@/components/Result/Result';
import { GlobalConfigContext } from '@/GlobalConfigContext';
import { useAppDispatch, useAppSelector } from '@/store';
import {
  useGetAvailableProxiesQuery, useGetParametersQuery, useGetSortOrdersQuery,
} from '@/store/assets/assets.api';
import { importAssets, resetImportStatus } from '@/store/assets/assets.slice';
import { authenticatedSelector, logout, siteUrlSelector } from '@/store/auth/auth.slice';
import { useGetAssetsQuery } from '@/store/search/search.api';
import { explorePath, RootFolder } from '@/store/search/search.slice';
import {
  Asset, Filter, Folder, GetAssetLinkResponse, GridView, SortDirection,
} from '@/types/search';
import { MOBILE_THRESHOLD, PAGE_SIZE } from '@/utils/constants';
import { getData, storeData } from '@/utils/storage';
import { CxResizeEvent, CxResizeObserver } from '@/web-component';
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
  extensions: string[];
  facets: Record<string, Record<string, number>>;
  hasScrolled: boolean;
  isLoading: boolean;
  isSeeThrough: boolean;
  mediaTypes: string[];
  openBrowser: boolean;
  page: number;
  searchText: string;
  selectedAsset: Asset | null;
  shouldResetFilters: boolean;
  sortDirection: 'ascending' | 'descending';
  sortOrder: string;
  statuses: string[];
  totalCount: number;
  view: GridView;
  visibilityClasses: string[];
  newlySelectedFacet: string;
};

type Action =
  | { type: 'RESET_SEARCH' }
  | { type: 'SET_CONTAINER_SIZE'; payload: { width: number; height: number } }
  | { type: 'SET_CURRENT_COUNT'; payload: number }
  | { type: 'SET_CURRENT_FOLDER'; payload: Folder }
  | { type: 'SET_FACETS'; payload: Record<string, Record<string, number>> }
  | { type: 'SET_FILTERS'; payload: Filter }
  | { type: 'SET_HAS_SCROLLED'; payload: boolean }
  | { type: 'SET_IS_LOADING'; payload: boolean }
  | { type: 'SET_IS_SEE_THROUGH'; payload: boolean }
  | { type: 'SET_OPEN_BROWSER'; payload: boolean }
  | { type: 'SET_PAGE'; payload: number }
  | { type: 'SET_SEARCH_TEXT'; payload: string }
  | { type: 'SET_SELECTED_ASSET'; payload: Asset | null }
  | { type: 'SET_SORT_DIRECTION'; payload: 'ascending' | 'descending' }
  | { type: 'SET_SORT_ORDER'; payload: string }
  | { type: 'SET_TOTAL_COUNT'; payload: number }
  | { type: 'SET_VIEW'; payload: GridView }
  | { type: 'SET_NEWLY_SELECTED_FACET'; payload: string };

const initialState: State = {
  containerSize: {
    width: 0,
    height: 0,
  },
  currentCount: 0,
  currentFolder: RootFolder,
  extensions: [],
  facets: {},
  hasScrolled: false,
  isLoading: false,
  isSeeThrough: true,
  mediaTypes: [],
  openBrowser: false,
  page: 0,
  searchText: '',
  selectedAsset: null,
  shouldResetFilters: true,
  sortDirection: 'descending',
  sortOrder: 'file name',
  statuses: [],
  totalCount: 0,
  view: GridView.Medium,
  visibilityClasses: [],
  newlySelectedFacet:'', 
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SET_CONTAINER_SIZE':
      return { ...state, containerSize: action.payload };
    case 'SET_CURRENT_COUNT':
      return { ...state, currentCount: action.payload };
    case 'SET_CURRENT_FOLDER':
      return { ...state, currentFolder: action.payload, page: 0, shouldResetFilters: true };
    case 'SET_FACETS':
      return { ...state, facets: action.payload };
    case 'SET_FILTERS': {
      const shouldResetFilters = false;

      return {
        ...state,
        page: 0,
        mediaTypes: action.payload.mediaTypes,
        visibilityClasses: action.payload.visibilityClasses,
        shouldResetFilters,
        statuses: action.payload.statuses,
        extensions: action.payload.extensions,
      };
    }
    case 'SET_HAS_SCROLLED':
      return { ...state, hasScrolled: action.payload };
    case 'SET_IS_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_IS_SEE_THROUGH':
      return { ...state, isSeeThrough: action.payload, page: 0 };
    case 'SET_OPEN_BROWSER':
      return { ...state, openBrowser: action.payload };
    case 'SET_PAGE':
      return { ...state, page: state.page + action.payload };
    case 'SET_SEARCH_TEXT':
      return { ...state, page: 0, searchText: action.payload };
    case 'SET_SELECTED_ASSET':
      return { ...state, selectedAsset: action.payload };
    case 'SET_SORT_DIRECTION':
      return { ...state, page: 0, sortDirection: action.payload };
    case 'SET_SORT_ORDER':
      return { ...state, page: 0, sortOrder: action.payload };
    case 'SET_TOTAL_COUNT':
      return { ...state, totalCount: action.payload };
    case 'SET_VIEW':
      return { ...state, view: action.payload };
    case 'RESET_SEARCH':
      return {
        ...state,
        currentCount: 0,
        currentFolder: RootFolder,
        searchText: '',
        selectedAsset: null,
        totalCount: 0,
      };
    case 'SET_NEWLY_SELECTED_FACET':
      return { ...state, newlySelectedFacet: action.payload };
    default:
      return state;
  }
};

const HomePage: FC<Props> = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const authenticated = useAppSelector(authenticatedSelector);
  const siteUrl = useAppSelector(siteUrlSelector);
  const {
    availableRepresentativeSubtypes,
    availableDocTypes,
    ctaText,
    persistMode,
    searchInDrive,
    showCollections,
    useSession,
  } = useContext(GlobalConfigContext);
  const { extraFields } = useContext(AppContext);
  const { data: availableProxies } = useGetAvailableProxiesQuery(state.selectedAsset ? {
    assetImages: state.selectedAsset ? [state.selectedAsset] : [],
  } : skipToken);
  const { data: params } = useGetParametersQuery({
    useSession,
  });
  const {
    ATSEnabled,
    collectionPath,
    supportedExtensions,
    supportedRepresentativeSubtypes,
    supportedDocTypes,
  } = params || {};
  const { data: sortOrders } = useGetSortOrdersQuery({
    useSession,
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const resizeObserverRef = useRef<CxResizeObserver>(null);
  const loadedFromStorage = useRef(false);
  const facetsRef = useRef<Record<string, Record<string, number>>>({});
  const appDispatch = useAppDispatch();

  facetsRef.current = state.facets;

  const mappedMediaTypes = useMemo(() => {
    const globalIntersection = availableDocTypes?.length ? _intersection(availableDocTypes, supportedDocTypes) : supportedDocTypes;
    if (!globalIntersection || globalIntersection.length === 0) return state.mediaTypes;
    const intersection = _intersection(state.mediaTypes, globalIntersection);
    if (intersection.length > 0) return intersection;
    return globalIntersection;
  }, [availableDocTypes, state.mediaTypes, supportedDocTypes]);

  const selectedSortOrder = useMemo(() => {
    if (sortOrders?.[state.sortOrder]?.length === 1) {
      return sortOrders?.[state.sortOrder]?.[0];
    }
    return sortOrders?.[state.sortOrder]?.find(
      ({ sortDirection }) => sortDirection.toLowerCase() === state.sortDirection,
    );
  }, [sortOrders, state.sortDirection, state.sortOrder]);

  const { data, isFetching, isError } = useGetAssetsQuery(selectedSortOrder && mappedMediaTypes?.length ? {
    extensions: state.extensions,
    folderID: state.currentFolder.id,
    isSeeThrough: state.isSeeThrough,
    mediaTypes: mappedMediaTypes,
    page: state.page,
    searchText: state.searchText,
    sortOrder: selectedSortOrder.id,
    statuses: state.statuses ?? [],
    visibilityClasses: state.visibilityClasses,
    useSession,
  } : skipToken);

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
      dispatch({ type: 'RESET_SEARCH' });

      Promise.all([
        getData('selectedSortOrder'),
        getData('selectedSortDirection'),
        getData('selectedView'),
      ]).then(([sortOrder, sortDirection, view]) => {
        if (sortOrder) {
          dispatch({ type: 'SET_SORT_ORDER', payload: sortOrder });
        }
        if (sortDirection === 'ascending' || sortDirection === 'descending') {
          dispatch({ type: 'SET_SORT_DIRECTION', payload: sortDirection });
        }
        if (typeof view === 'string') {
          dispatch({ type: 'SET_VIEW', payload: view as GridView });
        }
        loadedFromStorage.current = true;
      });
    }
  }, [authenticated]);

  useEffect(() => {
    const resizeObserver = resizeObserverRef.current;
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
    if (!loadedFromStorage.current) {
      return;
    }

    storeData('selectedSortOrder', state.sortOrder);
    storeData('selectedSortDirection', state.sortDirection);
    storeData('selectedView', state.view);
  }, [state.view, state.sortOrder, state.sortDirection]);

  const isMobile = state.containerSize.width <= MOBILE_THRESHOLD;

  const onItemSelect = (item: Asset) => {
    dispatch({ type: 'SET_SELECTED_ASSET', payload: item });
  };

  const onSearchChange = useCallback((value: string) => {
    dispatch({ type: 'SET_SELECTED_ASSET', payload: null });
    dispatch({ type: 'SET_SEARCH_TEXT', payload: value });
  }, []);

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
        case 'sortOrder': {
          dispatch({ type: 'SET_SORT_ORDER', payload: value.toString() });
          break;
        }
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
      if (state.shouldResetFilters) {
        dispatch({ type: 'SET_FACETS', payload: newData.facets });
      } else if (state.newlySelectedFacet === '') {
        dispatch({ type: 'SET_FACETS', payload: newData.facets });
      } else {
        const newFacets: Record<string, Record<string, number>> = {};
        Object.entries(facetsRef.current).forEach(([filter, facets]) => {
          newFacets[filter] = {};
          if (filter !== state.newlySelectedFacet) {
            Object.keys(facets).forEach((facet) => {
              if (newData?.facets?.[filter]?.[facet]) {
                newFacets[filter][facet] = newData.facets[filter][facet];
              }
            });
          } else {
            Object.keys(facets).forEach((facet) => {
              newFacets[filter][facet] = facetsRef.current?.[filter]?.[facet];
            });
          }
        });
        Object.entries(newData.facets).forEach(([filter, facets]) => {
          if (!newFacets[filter]) {
            newFacets[filter] = {};
          }
          Object.keys(facets).forEach((facet) => {
            newFacets[filter][facet] = newData.facets?.[filter]?.[facet];
          });
        });

        if (isEqual(newFacets, facetsRef.current)) {
          return;
        }

        dispatch({
          type: 'SET_FACETS',
          payload: {
            ...newFacets,
          },
        });
      }
      
      dispatch({ type: 'SET_TOTAL_COUNT', payload: newData.totalCount });
    },
    [state.shouldResetFilters, state.newlySelectedFacet],
  );

  const onFolderSelect = useCallback(
    async (folder: Folder) => {
      if (folder.fullPath === state.currentFolder.fullPath) {
        return;
      }
      const resultAction = await appDispatch(explorePath(folder));
      if (explorePath.fulfilled.match(resultAction)) {
        dispatch({ type: 'SET_CURRENT_FOLDER', payload: folder });
        dispatch({ type: 'SET_SELECTED_ASSET', payload: null });
        dispatch({ type: 'SET_OPEN_BROWSER', payload: false });
      }
    },
    [appDispatch, state.currentFolder.fullPath],
  );

  const onLoadMore = useCallback(() => {
    dispatch({ type: 'SET_PAGE', payload: 1 });
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
    window.CortexAssetPicker._onAssetSelected?.(images);
    if (persistMode) {
      return;
    }
    window.CortexAssetPicker._onClose?.();
  }, [persistMode]);

  const hasNextPage = useMemo(
    () => (data ? (state.page + 1) * PAGE_SIZE < state.totalCount : false),
    [data, state.page, state.totalCount],
  );

  const setNewlySelectedFacet = useCallback((newFacet: string) => {
    dispatch({ type: 'SET_NEWLY_SELECTED_FACET', payload: newFacet });
  }, []);

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

  return (
    <cx-resize-observer ref={resizeObserverRef}>
      <Container ref={containerRef}>
        <Header
          bordered={state.hasScrolled}
          currentFolder={state.currentFolder}
          onHomeSelect={() => {
            onFolderSelect(RootFolder);
          }}
          onMenuClick={() =>
            dispatch({ type: 'SET_OPEN_BROWSER', payload: true })
          }
          onLogout={() => {
            appDispatch(logout());
            appDispatch(resetImportStatus());
            dispatch({ type: 'RESET_SEARCH' });
          }}
        >
          <ControlBar
            allowSorting={selectedSortOrder?.sortDirection !== 'Mono'}
            currentCount={state.currentCount}
            extensions={state.extensions}
            facets={state.facets}
            isSeeThrough={state.isSeeThrough}
            loading={state.isLoading}
            mediaTypes={state.mediaTypes}
            searchValue={state.searchText}
            sortDirection={state.sortDirection}
            sortOrder={state.sortOrder}
            statuses={state.statuses}
            totalCount={state.totalCount}
            view={state.view}
            visibilityClasses={state.visibilityClasses}
            onChangeNewlySelectedFacet={setNewlySelectedFacet}
            onSearchChange={onSearchChange}
            onSettingChange={onSettingChange}
          />
        </Header>
        <Browser
          site={siteUrl}
          collectionPath={collectionPath}
          currentFolder={state.currentFolder}
          open={state.openBrowser}
          showCollections={showCollections}
          useSession={useSession}
          onFolderSelect={onFolderSelect}
          onClose={() => dispatch({ type: 'SET_OPEN_BROWSER', payload: false })}
        />
        <Results
          key={
            state.currentFolder.id +
            state.searchText +
            state.mediaTypes.join('+') +
            state.extensions.join('+') +
            state.statuses.join('+') +
            state.visibilityClasses.join('+') +
            state.isSeeThrough
          }
          hasNextPage={hasNextPage || false}
          isError={isError}
          isLoading={state.isLoading}
          items={data?.items || []}
          selectedAsset={state.selectedAsset}
          view={state.view}
          onItemSelect={onItemSelect}
          onLoadMore={onLoadMore}
          onScroll={onScroll}
        />
        <FormatDialog
          allowCustomFormat={!!ATSEnabled}
          availableProxies={availableProxies?.proxiesForDocType}
          ctaText={ctaText}
          extensions={supportedExtensions ?? []}
          maxHeight={state.containerSize.height}
          open={!!state.selectedAsset}
          searchInDrive={searchInDrive}
          selectedAsset={state.selectedAsset}
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
            dispatch({ type: 'SET_SELECTED_ASSET', payload: null })
          }
          onProxyConfirm={async ({ extension, value, parameters, useRepresentative }) => {
            if (!state.selectedAsset) {
              return;
            }

            const images = await appDispatch(
              importAssets({
                extension,
                extraFields,
                parameters,
                proxiesPreference: value,
                selectedAsset: state.selectedAsset,
                useRepresentative,
              }),
            );

            if (importAssets.fulfilled.match(images)) {
              handleSelectedAsset(images.payload);
            }
          }}
          onFormatConfirm={async ({ value, parameters, extension }) => {
            if (!state.selectedAsset) {
              return;
            }

            const maxWidth = state.selectedAsset?.width
              ? parseInt(state.selectedAsset.width, 10)
              : 0;
            const maxHeight = state.selectedAsset?.height
              ? parseInt(state.selectedAsset.height, 10)
              : 0;
            const images = await appDispatch(
              importAssets({
                extraFields,
                extension,
                maxHeight,
                maxWidth,
                parameters,
                selectedAsset: state.selectedAsset,
                transformations: value,
              }),
            );

            if (importAssets.fulfilled.match(images)) {
              handleSelectedAsset(images.payload);
            }
          }}
          onOpenInDriveConfirm={() => {
            if (!state.selectedAsset) {
              return;
            }

            window.CortexAssetPicker._onAssetSelected?.([
              {
                imageUrl: state.selectedAsset.imageUrl,
              },
            ]);
          }}
        />
      </Container>
    </cx-resize-observer>
  );
};

export default HomePage;
