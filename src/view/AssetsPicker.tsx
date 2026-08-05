import '@/components/content-browser/content-browser';
import '@/components/content-browser-loader';

import _isArray from 'lodash-es/isArray';
import _pickBy from 'lodash-es/pickBy';
import {
    forwardRef, useCallback, useContext, useEffect, useImperativeHandle, useRef, useState,
} from 'react';

import { AppContext } from '@/AppContext';
import { GlobalConfigContext } from '@/GlobalConfigContext';
import { useAppDispatch, useAppSelector } from '@/store';
import { applySessionSelector, logout } from '@/store/auth/auth.slice';
import {
    Asset, Facet, Folder, GetAssetLinkResponse, GetContentRequest, GetFoldersRequest, GridView,
} from '@/types/search';
import { isPromise } from '@/utils/function';
import { deleteData, getData, storeData } from '@/utils/storage';

import type {
    CxContentBrowserGridClickEvent, CxContentBrowserPinAssetChangeEvent, CxContentBrowserPinAssetLookupEvent,
    CxContentBrowserRequestChangeEvent, CxContentBrowserSelectedAssetEvent,
} from '@/events';
type CxContentBrowserAssetsRequest = Omit<GetContentRequest, 'folderID'> & { folderId?: string };
type CxContentBrowserFoldersRequest = {
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

type CxContentBrowserElement = HTMLElement & {
  fetchAssets: (params: CxContentBrowserAssetsRequest) => Promise<{
    facets: Facet[];
    items: Array<Asset & Record<string, string | boolean>>;
    totalCount: number;
  }>;
  fetchFolders: (params: CxContentBrowserFoldersRequest) => Promise<{
    data: Folder[];
    hasMore: boolean;
    totalCount: number;
  }>;
  selectAsset: (recordId: string) => Promise<void>;
  setIsAssetPinned: (isAssetPinned: boolean) => void;
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

function parseSelectedFacets(selectedFilter: string | null): Record<string, string[]> {
  if (!selectedFilter) {
    return {};
  }

  try {
    return _pickBy(JSON.parse(selectedFilter), _isArray) ?? {};
  } catch (_error) {
    return {};
  }
}

function parseStoredFacets(newFacets: string | null): Facet[] {
  if (!newFacets) {
    return [];
  }

  try {
    const parsedFacets = JSON.parse(newFacets);

    return _isArray(parsedFacets) ? parsedFacets as Facet[] : [];
  } catch (_error) {
    return [];
  }
}

function parseLegacyLastLocation(lastLocation: string | null): string {
  if (!lastLocation) {
    return '';
  }

  try {
    const parsedLastLocation = JSON.parse(lastLocation) as Folder;

    return parsedLastLocation?.id ?? '';
  } catch (_error) {
    return '';
  }
}

const AssetsPicker = forwardRef<AssetsPickerHandle, Props>(function AssetsPicker(
  { accessToken, siteUrl, multiSelect },
  ref,
) {
  const appDispatch = useAppDispatch();
  const useSession = useAppSelector(applySessionSelector);
  const {
    allowFavorites,
    allowFormatDialogPin,
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
  const {
    extraFields, getPinnedState, onAssetAction, onAssetSelected, onClose, onError, onPinAsset, onUnpinAsset,
  } = useContext(AppContext);

  const contentBrowserRef = useRef<CxContentBrowserElement | null>(null);

  const [isInitialLoadComplete, setIsInitialLoadComplete] = useState(false);
  const [defaultSettings, setDefaultSettings] = useState<DefaultSettings>({
    sortOrder: '',
    sortDirection: '',
    view: Object.values(GridView).includes(defaultGridView as GridView) ? defaultGridView as GridView : GridView.Medium,
    facets: [],
    selectedFacets: {},
    isSeeThrough: true,
    searchText: '',
    lastLocation: '',
  });
  const loadedFromStorage = useRef(false);

  const fetchAssets = useCallback(async (params: GetContentRequest) => {
    const el = contentBrowserRef.current;
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
    const el = contentBrowserRef.current;
    if (!el) {
      return undefined;
    }
    const run = el.fetchFolders;
    
    if (typeof run === 'function') {
      const response = await Promise.resolve(run.call(el, {
        ...params,
        folderId: params.folder?.id ?? '',
        searchTerm: params.searchText,
        seeThru: params.contentBrowserSeeThru,
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
    const el = contentBrowserRef.current;
    if (!el) {
      return;
    }
    const run = el.selectAsset;
    if (typeof run === 'function') {
      await Promise.resolve(run.call(el, recordId));
    }
  }, []);

  useImperativeHandle(ref, () => ({ fetchAssets, fetchFolders, selectAsset }), [fetchAssets, fetchFolders, selectAsset]);

  const onSelectedAsset = useCallback(async (event: CxContentBrowserSelectedAssetEvent) => {
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

  const onFetchAndMergeAssetsSuccess = useCallback((event: CxContentBrowserRequestChangeEvent) => {
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

  const onGridClick = useCallback((event: CxContentBrowserGridClickEvent) => {
    const { id } = event.detail;

    if (onAssetAction && id) {
      onAssetAction('select', id);
    }
  }, [onAssetAction]);

  const onPinAssetLookup = useCallback((event: CxContentBrowserPinAssetLookupEvent) => {
    if (!getPinnedState) {
      return;
    }

    try {
      event.detail.isAssetPinned = Boolean(getPinnedState(event.detail.assetId));
    } catch (error) {
      event.detail.isAssetPinned = false;
      const callbackError = error instanceof Error
        ? error
        : new Error('Failed to get pinned state');
      onError('Failed to get pinned state', callbackError);
    }
  }, [getPinnedState, onError]);

  const onPinAssetChange = useCallback(async (event: CxContentBrowserPinAssetChangeEvent) => {
    const { assetId, isPinned } = event.detail;
    const el = contentBrowserRef.current;
    const action = isPinned ? 'unpin' : 'pin';
    const errorMessage = `Failed to ${action} asset`;

    onAssetAction?.(action, assetId);

    try {
      if (isPinned) {
        await onUnpinAsset?.(assetId);
      } else {
        await onPinAsset?.(assetId);
      }
    } catch (error) {
      const callbackError = error instanceof Error ? error : new Error(errorMessage);

      onError(errorMessage, callbackError);
      el?.setIsAssetPinned(isPinned);
      return;
    }

    el?.setIsAssetPinned(!isPinned);
    onAssetAction?.(`after${isPinned ? 'Unpin' : 'Pin'}`, assetId);
  }, [onAssetAction, onError, onPinAsset, onUnpinAsset]);

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
        selectedFacets: parseSelectedFacets(selectedFilter),
        isSeeThrough: selectedIsSeeThrough === null ? true : selectedIsSeeThrough === 'true',
        searchText: searchText || '',
      };

      if (lastLocationMode) {
        newDefaultSettings.facets = parseStoredFacets(newFacets);

        if (lastLocationFolderId) {
          newDefaultSettings.lastLocation = lastLocationFolderId;
          deleteData('lastLocation');
        } else if (lastLocation) {
          newDefaultSettings.lastLocation = parseLegacyLastLocation(lastLocation);
        }
      }

      setDefaultSettings(newDefaultSettings as DefaultSettings);

      loadedFromStorage.current = true;
      setIsInitialLoadComplete(true);
    });
  }, [lastLocationMode, defaultGridView, defaultSettings.view]);

  if (!isInitialLoadComplete) {
    return <cx-content-browser-loader></cx-content-browser-loader>;
  }

  return (
    <cx-content-browser
      ref={contentBrowserRef}
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
      use-session={useSession}
      extra-fields={extraFields}
      error-message="Unauthorized"
      can-pin={allowPin}
      can-pin-asset={allowFormatDialogPin}
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
      multi-select={multiSelect ? 'true' : undefined}
      oncx-content-browser-selected-asset={onSelectedAsset}
      oncx-content-browser-request-change={onFetchAndMergeAssetsSuccess}
      oncx-content-browser-grid-click={onGridClick}
      oncx-content-browser-pin-asset-lookup={onPinAssetLookup}
      oncx-content-browser-pin-asset-change={onPinAssetChange}
      oncx-content-browser-header-close={onClose}
      oncx-content-browser-header-logout={onLogout}
    />
  );
});

export default AssetsPicker;
