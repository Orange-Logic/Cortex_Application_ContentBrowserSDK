import {
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';

import _isArray from 'lodash-es/isArray';
import _pickBy from 'lodash-es/pickBy';
import type { CxDamViewGridClickEvent, CxDamViewRequestChangeEvent, CxDamViewSelectedAssetEvent } from '@orangelogic/design-system';
import { AppContext } from '@/AppContext';
import { Asset, Facet, Folder, GetAssetLinkResponse, GetContentRequest, GetFoldersRequest, GridView } from '@/types/search';
import { GlobalConfigContext } from '@/GlobalConfigContext';
import { getData, storeData, deleteData } from '@/utils/storage';
import { isPromise } from '@/utils/function';
import Loader from '@/components/Loader';
import { useAppDispatch } from '@/store';
import { logout } from '@/store/auth/auth.slice';

type CxDamViewAssetsRequest = Omit<GetContentRequest, 'folderID'> & { folderId?: string };
type CxDamViewFoldersRequest = {
  allowedFolders?: string[];
  baseUrl?: string;
  bearerToken?: string;
  excludeVirtualFolders?: boolean;
  folderId: string;
  includeDirectChild?: boolean;
  limit?: number;
  searchTerm?: string;
  seeThru?: boolean;
  self?: boolean;
  start?: number;
  token?: string;
  useSession?: string;
};

export type AssetsPickerHandle = {
  fetchAssets: (params: GetContentRequest) => Promise<{
    facets: Facet[];
    items: Array<Asset & Record<string, string | boolean>>;
    totalCount: number;
  } | undefined>;
  fetchFolders: (params: GetFoldersRequest) => Promise<{
    items: Folder[];
    totalCount: number;
  } | undefined>;
  selectAsset: (recordId: string) => Promise<void>;
};

type CxDamViewElement = HTMLElement & {
  fetchAssets: (params: CxDamViewAssetsRequest) => Promise<{
    facets: Facet[];
    items: Array<Asset & Record<string, string | boolean>>;
    totalCount: number;
  }>;
  fetchFolders: (params: CxDamViewFoldersRequest) => Promise<{
    data: Folder[];
    hasMore: boolean;
    totalCount: number;
  }>;
  selectAsset: (recordId: string) => Promise<void>;
};

type Props = {
  multiSelect?: boolean;
  accessToken?: string;
  siteUrl?: string;
};

type DefaultSettings = {
  sortOrder: string;
  sortDirection: 'ascending' | 'descending' | '';
  view: GridView;
  facets: Facet[];
  selectedFacets: Record<string, string[]>;
  isSeeThrough: boolean;
  searchText: string;
  lastLocation: string;
};

const AssetsPicker = forwardRef<AssetsPickerHandle, Props>(function AssetsPicker(
  { accessToken, siteUrl },
  ref,
) {
  const appDispatch = useAppDispatch();
  const {
    allowFavorites,
    allowLogout,
    allowPin,
    allowProxy,
    allowTracking,
    allowedExtensions, // list of allowed extensions from runtime properties. e.g. ['.jpg', '.png', '.mp4']
    allowedFolders,
    availableDocTypes,
    availableRepresentativeSubtypes,
    ctaText,
    ctaTextTransform,
    defaultGridView,
    displayInfo,
    isContentBrowserPopedup,
    lastLocationMode,
    persistMode,
    pluginInfo,
    showCollections,
    showFavoriteFolder,
    showVersions,
  } = useContext(GlobalConfigContext);
  const { extraFields, onAssetAction, onAssetSelected, onClose } = useContext(AppContext);

  const damViewRef = useRef<CxDamViewElement | null>(null);

  const [isInitialLoadComplete, setIsInitialLoadComplete] = useState(false);
  const [defaultSettings, setDefaultSettings] = useState<DefaultSettings>({
    sortOrder: '',
    sortDirection: '',
    view: Object.values(GridView).includes(defaultGridView as GridView) ? defaultGridView as GridView : GridView.Medium,
    facets: [],
    selectedFacets: {},
    isSeeThrough: false,
    searchText: '',
    lastLocation: '',
  });
  const loadedFromStorage = useRef(false);

  const fetchAssets = useCallback(async (params: GetContentRequest) => {
    const el = damViewRef.current;
    if (!el) {
      return undefined;
    }
    const run = el.fetchAssets;

    if (typeof run === 'function') {
      return await Promise.resolve(run.call(el, {
        ...params,
        folderId: params.folderID,
      }));
    }

    return undefined;
  }, []);

  const fetchFolders = useCallback(async (params: GetFoldersRequest) => {
    const el = damViewRef.current;
    if (!el) {
      return undefined;
    }
    const run = el.fetchFolders;
    
    if (typeof run === 'function') {
      const response = await Promise.resolve(run.call(el, {
        ...params,
        folderId: params.folder?.id ?? '',
        searchTerm: params.searchText,
        seeThru: params.damViewSeeThru,
        limit: params.pageSize,
      }));

      return {
        items: response.data,
        totalCount: response.totalCount,
      };
    }

    return undefined;
  }, []);

  const selectAsset = useCallback(async (recordId: string) => {
    const el = damViewRef.current;
    if (!el) {
      return;
    }
    const run = el.selectAsset;
    if (typeof run === 'function') {
      await Promise.resolve(run.call(el, recordId));
    }
  }, []);

  useImperativeHandle(ref, () => ({ fetchAssets, fetchFolders, selectAsset }), [fetchAssets, fetchFolders, selectAsset]);

  const onSelectedAsset = useCallback(async (event: CxDamViewSelectedAssetEvent) => {
    const result = onAssetSelected(event.detail as GetAssetLinkResponse[]);

    if (isPromise(result)) {
      try {
        await result;
      } catch (error) {
        console.error('Error in onAssetSelected:', error);
        return;
      }
    }
    if (persistMode) {
      return;
    }
    onClose?.();
  }, [onAssetSelected, onClose, persistMode]);

  const onFetchAndMergeAssetsSuccess = useCallback((event: CxDamViewRequestChangeEvent) => {
    if (!loadedFromStorage.current) {
      return;
    }

    if (!event.detail.request) {
      return;
    }

    const {
      isSeeThrough,
      folderId,
      searchText,
      selectedFacets,
      sortOrderName,
      sortDirection,
    } = event.detail.request;

    if (sortOrderName !== undefined) {
      storeData('selectedSortOrder', sortOrderName);
    }
    if (folderId !== undefined) {
      storeData('lastLocationFolderId', folderId);
    }
    if (sortDirection) {
      storeData('selectedSortDirection', sortDirection);
    }
    if (event.detail.view) {
      storeData('selectedView', event.detail.view);
    }
    if (selectedFacets !== undefined) {
      storeData(
        'selectedFilter',
        JSON.stringify(selectedFacets),
      );
    }
    if (isSeeThrough !== undefined) {
      storeData('selectedIsSeeThrough', isSeeThrough.toString());
    }
    if (searchText !== undefined) {
      storeData('searchText', searchText);
    }
  }, []);

  const onGridClick = useCallback((event: CxDamViewGridClickEvent) => {
    const { id } = event.detail;

    if (onAssetAction && id) {
      onAssetAction('select', id);
    }
  }, [onAssetAction]);

  const onLogout = useCallback(() => {
    appDispatch(logout());
  }, [appDispatch]);

  useEffect(() => {
    Promise.all([
      getData('selectedSortOrder'),
      getData('selectedSortDirection'),
      getData('selectedView'),
      getData('newFacets'),
      getData('selectedFilter'),
      getData('selectedIsSeeThrough'),
      getData('searchText'),
      getData('lastLocation'),
      getData('lastLocationFolderId'),
    ]).then(([sortOrder, sortDirection, view, newFacets, selectedFilter, selectedIsSeeThrough, searchText, lastLocation, lastLocationFolderId]) => {
      const newDefaultSettings: Partial<DefaultSettings> = {
        sortOrder: sortOrder || '',
        sortDirection: ['ascending', 'descending'].includes(sortDirection as 'ascending' | 'descending') ? sortDirection as 'ascending' | 'descending' : undefined,
        view: view as GridView || defaultSettings.view,
        selectedFacets: {},
        isSeeThrough: selectedIsSeeThrough === 'true' || false,
        searchText: searchText || '',
      };

      if (selectedFilter) {
        try {
          newDefaultSettings.selectedFacets = _pickBy(JSON.parse(selectedFilter), _isArray) ?? {};
        } catch (error) {
          newDefaultSettings.selectedFacets = {};
        }
      }

      if (lastLocationMode) {
        if (newFacets) {
          try {
            const parsedFacets = JSON.parse(newFacets);
            if (_isArray(parsedFacets)) {
              newDefaultSettings.facets = parsedFacets;
            } else {
              newDefaultSettings.facets = [];
            }
          } catch (error) {
            newDefaultSettings.facets = [];
          }
        }

        if (lastLocationFolderId) {
          newDefaultSettings.lastLocation = lastLocationFolderId;
          deleteData('lastLocation');
        } else if (lastLocation) {
          /**
           * Deprecated: lastLocation is no longer used, this is for backward compatibility
           */
          try {
            const parsedLastLocation = JSON.parse(lastLocation) as Folder;
            if (parsedLastLocation) {
              newDefaultSettings.lastLocation = parsedLastLocation.id;
            }
          } catch (error) {
            newDefaultSettings.lastLocation = '';
          }
        }
      }

      setDefaultSettings(newDefaultSettings as DefaultSettings);

      loadedFromStorage.current = true;
      setIsInitialLoadComplete(true);
    });
  }, [lastLocationMode, defaultGridView, defaultSettings.view]);

  if (!isInitialLoadComplete) {
    return <Loader />;
  }

  return (
    <cx-dam-view
      // @ts-expect-error - cx-dam-view is not typed
      ref={damViewRef}
      allowed-extensions={allowedExtensions}
      allowed-folders={allowedFolders}
      application-name={pluginInfo.publicApplicationName}
      available-doc-types={availableDocTypes}
      available-representative-subtypes={availableRepresentativeSubtypes}
      default-grid-view={defaultSettings.view}
      default-sort-order-name={defaultSettings.sortOrder}
      default-sort-direction={defaultSettings.sortDirection}
      default-facets={defaultSettings.facets}
      default-selected-facets={defaultSettings.selectedFacets}
      default-is-see-through={defaultSettings.isSeeThrough}
      default-search-text={defaultSettings.searchText}
      default-folder-id={defaultSettings.lastLocation}
      token={accessToken ?? ''}
      base-url={siteUrl ?? ''}
      extra-fields={extraFields}
      can-pin={allowPin}
      can-favorite={allowFavorites}
      can-logout={allowLogout}
      can-use-proxies={allowProxy}
      can-track={allowTracking}
      can-view-versions={showVersions}
      cta-text={ctaText}
      cta-text-transform={ctaTextTransform}
      show-close-button={isContentBrowserPopedup}
      show-collections={showCollections}
      show-favorite-folder={showFavoriteFolder}
      show-tags={displayInfo.tags}
      show-dimensions={displayInfo.dimension}
      show-size={displayInfo.fileSize}
      show-title={displayInfo.title}
      oncx-dam-view-selected-asset={onSelectedAsset}
      oncx-dam-view-request-change={onFetchAndMergeAssetsSuccess}
      oncx-dam-view-grid-click={onGridClick}
      oncx-dam-view-header-close={onClose}
      oncx-dam-view-header-logout={onLogout}
    ></cx-dam-view>
  );
});

export default AssetsPicker;
