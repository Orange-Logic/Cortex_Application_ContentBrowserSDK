import { FC, useCallback, useContext, useEffect, useRef, useState } from 'react';

import _isArray from 'lodash-es/isArray';
import _pickBy from 'lodash-es/pickBy';
import type { CxDamViewSelectedAssetEvent } from '@orangelogic/design-system';
import { AppContext } from '@/AppContext';
import { Facet, GetAssetLinkResponse, GridView } from '@/types/search';
import { GlobalConfigContext } from '@/GlobalConfigContext';
import { getData } from '@/utils/storage';
import { isPromise } from '@/utils/function';

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
};

const AssetsPicker: FC<Props> = ({ accessToken, siteUrl } : Props) => {
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

  const [isInitialLoadComplete, setIsInitialLoadComplete] = useState(false);
  const [defaultSettings, setDefaultSettings] = useState<DefaultSettings>({
    sortOrder: '',
    sortDirection: '',
    view: Object.values(GridView).includes(defaultGridView as GridView) ? defaultGridView as GridView : GridView.Medium,
    facets: [],
    selectedFacets: {},
    isSeeThrough: false,
    searchText: '',
  });
  const loadedFromStorage = useRef(false);

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

  useEffect(() => {
    Promise.all([
      getData('selectedSortOrder'),
      getData('selectedSortDirection'),
      getData('selectedView'),
      getData('newFacets'),
      getData('selectedFilter'),
      getData('selectedIsSeeThrough'),
      getData('searchText'),
    ]).then(([sortOrder, sortDirection, view, newFacets, selectedFilter, selectedIsSeeThrough, searchText]) => {
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
          newDefaultSettings.selectedFacets = _pickBy(JSON.parse(selectedFilter), _isArray);
        } catch (error) {
          newDefaultSettings.selectedFacets = {};
        }
      }

      if (lastLocationMode && newFacets) {
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

      setDefaultSettings(newDefaultSettings as DefaultSettings);

      loadedFromStorage.current = true;
      setIsInitialLoadComplete(true);
    });
  }, [lastLocationMode, defaultGridView, defaultSettings.view]);
  
  return (
    <cx-dam-view
      allowed-extensions={allowedExtensions}
      allowed-folders={allowedFolders}
      available-doc-types={availableDocTypes}
      available-representative-subtypes={availableRepresentativeSubtypes}
      default-grid-view={defaultSettings.view}
      default-sort-order-name={defaultSettings.sortOrder}
      default-sort-direction={defaultSettings.sortDirection}
      default-facets={defaultSettings.facets}
      default-selected-facets={defaultSettings.selectedFacets}
      default-is-see-through={defaultSettings.isSeeThrough}
      default-search-text={defaultSettings.searchText}
      token={accessToken ?? ''}
      base-url={siteUrl ?? ''}
      extra-fields={extraFields}
      can-pin={allowPin}
      can-favorite={allowFavorites}
      can-use-proxy={allowProxy}
      can-track={allowTracking}
      can-view-versions={showVersions}
      cta-text={ctaText}
      cta-text-transform={ctaTextTransform}
      show-collections={showCollections}
      show-favorite-folder={showFavoriteFolder}
      oncx-dam-view-selected-asset={onSelectedAsset}
    ></cx-dam-view>
  );
};

export default AssetsPicker;
