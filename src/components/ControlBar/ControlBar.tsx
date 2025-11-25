import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { SortOrder } from '@/types/assets';
import { Facet as FacetType, GridView, SortDirection } from '@/types/search';
import type {
  CxChangeEvent,
  CxDropdown,
  CxInput,
  CxMenuItem,
  CxRemoveEvent,
  CxSelectEvent,
  CxSelectionChangeEvent,
  CxTreeItem,
} from '@orangelogic-private/design-system';

import { sortDirections, views } from './ControlBar.constants';
import { Container } from './ControlBar.styled';
import Facet from './Facet';
import LineClamp from '../LineClamp';

type Props = {
  allowSorting: boolean;
  availableFacets: FacetType['facetDetails'][];
  currentCount: number;
  loading: boolean;
  facets?: FacetType[];
  isMobile: boolean;
  isSeeThrough: boolean;
  searchValue: string;
  selectedFacets: Record<string, string[]>;
  sortDirection?: 'ascending' | 'descending';
  sortOrder: string;
  sortOrders?: Record<string, SortOrder[]>;
  totalCount: number;
  view: GridView;
  onSearchChange: (value: string) => void;
  onSettingChange: (
    setting: string,
    value:
    | GridView
    | SortDirection
    | Record<string, string[]>
    | string
    | boolean
    | string[]
  ) => void;
};

const ControlBar: FC<Props> = ({
  allowSorting,
  availableFacets,
  currentCount,
  loading,
  facets,
  isMobile,
  isSeeThrough,
  searchValue: searchText,
  selectedFacets,
  sortDirection,
  sortOrder,
  sortOrders,
  totalCount,
  view,
  onSearchChange,
  onSettingChange,
}) => {
  const [isDefined, setIsDefined] = useState(false);
  const [newlyChangedOption, setNewlyChangedOption] = useState<{
    type?: string;
    value?: string;
  }>({
    type: undefined,
    value: undefined,
  });
  const searchRef = useRef<CxInput>(null);
  const filterDropdownRef = useRef<CxDropdown>(null);
  const viewDropdownRef = useRef<CxDropdown>(null);
  const sortDropdownRef = useRef<CxDropdown>(null);
  const selectedViewMenuItemRef = useRef<CxMenuItem>(null);

  useEffect(() => {
    Promise.all([
      customElements.whenDefined('cx-input'),
      customElements.whenDefined('cx-checkbox'),
      customElements.whenDefined('cx-dropdown'),
    ]).then(() => setIsDefined(true));
  }, []);

  useEffect(() => {
    const onSearchInput = (e: CxChangeEvent) => {
      const value = (e.target as CxInput).value;
      if (searchText !== value) {
        onSearchChange(value);
      }
    };
    const searchInput = searchRef.current;
    searchInput?.addEventListener('cx-change', onSearchInput);
    return () => {
      searchInput?.removeEventListener('cx-change', onSearchInput);
    };
  }, [isDefined, searchText, onSearchChange]);

  useEffect(() => {
    const onViewSelect = (e: CxSelectEvent<CxMenuItem>) => {
      const value = e.detail.item.value;

      if (value === 'see-thru') {
        onSettingChange('isSeeThrough', !isSeeThrough);
      } else {
        onSettingChange('view', value ?? GridView.Medium);
      }
    };
    const viewDropdown = viewDropdownRef.current;
    viewDropdown?.addEventListener('cx-select', onViewSelect);
    return () => {
      viewDropdown?.removeEventListener('cx-select', onViewSelect);
    };
  }, [isDefined, isSeeThrough, onSettingChange]);

  useEffect(() => {
    const selectedViewMenuItem = selectedViewMenuItemRef.current;
    if (!isDefined || !selectedViewMenuItem) return;
    const container = selectedViewMenuItem.closest('.cbsdk__home');
    if (!container) return;
    selectedViewMenuItem.flipBoundary = container;
    selectedViewMenuItem.shiftBoundary = container;
  }, [isDefined]);

  useEffect(() => {
    const onFilterRemove = (e: CxRemoveEvent) => {
      const target = e.target as HTMLElement;
      const type = target.dataset.type;
      const value = target.dataset.value;

      if (!value || !type) {
        return;
      }

      const newFilter = { ...selectedFacets };

      if (newFilter[type]) {
        newFilter[type] = newFilter[type].filter((item) => item !== value);
      }

      onSettingChange('filter', newFilter);
    };
    const onFilterSelectionChange = (e: CxSelectionChangeEvent<CxTreeItem>) => {
      const facet = (e.target as HTMLElement).dataset.facet;

      if (!facet) {
        return;
      }

      setNewlyChangedOption({
        type: 'filter',
        value: facet,
      });

      const newSelection = e.detail.selection.reduce(
        (acc, item) => {
          const type = item.dataset.type;
          const value = item.dataset.value;

          if (!value || !type) {
            return acc;
          }

          if (!acc[type]) {
            acc[type] = [];
          }

          acc[type].push(value);

          return acc;
        },
        {
          ...selectedFacets,
          [facet]: [] as string[],
        },
      );

      onSettingChange('filter', newSelection);
    };
    const onSortSelect = (e: CxSelectEvent<CxMenuItem>) => {
      const type = e.detail.item.dataset.type;
      const value = e.detail.item.value;

      if (!value) {
        return;
      }

      if (type === 'sort-direction') {
        setNewlyChangedOption({
          type: 'sortDirection',
          value,
        });
        onSettingChange('sortDirection', value as 'ascending' | 'descending');
      } else if (type === 'sort-order') {
        setNewlyChangedOption({
          type: 'sortOrder',
          value,
        });
        onSettingChange('sortOrder', value);
      }
    };
    const filterDropdown = filterDropdownRef.current;
    const sortDropdown = sortDropdownRef.current;
    filterDropdown?.addEventListener(
      'cx-selection-change',
      onFilterSelectionChange,
    );
    filterDropdown?.addEventListener('cx-remove', onFilterRemove);
    sortDropdown?.addEventListener('cx-select', onSortSelect);
    return () => {
      filterDropdown?.removeEventListener(
        'cx-selection-change',
        onFilterSelectionChange,
      );
      filterDropdown?.removeEventListener('cx-remove', onFilterRemove);
      sortDropdown?.removeEventListener('cx-select', onSortSelect);
    };
  }, [isDefined, selectedFacets, onSettingChange]);

  const selectedView = useMemo(
    () => views.find((item) => item.value === view),
    [view],
  );

  const mappedDisplayNames = useMemo(() => {
    return facets?.reduce((acc, facet) => {
      const displayNames = facet.values.reduce((displayNamesAcc, { value, displayValue }) => {
        displayNamesAcc[value] = displayValue;

        return displayNamesAcc;
      }, {} as Record<string, string>);

      return {
        ...acc,
        [facet.facetDetails.facetFieldName]: displayNames,
      };
    }, {} as Record<string, Record<string, string>>) ?? {};
  }, [facets]);

  const appliedFiltersCount = useMemo(() => {
    return Object.entries(selectedFacets).reduce((acc, [key, values]) => {
      if (!mappedDisplayNames[key]) {
        return acc;
      }
      return acc + values.filter(value => mappedDisplayNames[key][value]).length;
    }, 0);
  }, [selectedFacets, mappedDisplayNames]);

  const renderAppliedFilters = useCallback(() => {
    return (
      <cx-details
        data-cy="applied-filters"
        open
        className={`filter-details ${
          appliedFiltersCount === 0 ? 'filter-details--empty' : ''
        }`.trim()}
      >
        <cx-space
          slot="summary"
          align-items="center"
          spacing="x-small"
          wrap="nowrap"
        >
          <span>
            Applied filters{' '}
            {appliedFiltersCount > 0 ? ` (${appliedFiltersCount})` : ''}
          </span>
          {loading && newlyChangedOption.type === 'filter' && (
            <cx-spinner></cx-spinner>
          )}
        </cx-space>
        <cx-space
          direction="horizontal"
          spacing="small"
          style={{
            maxWidth: '320px',
          }}
        >
          {Object.entries(selectedFacets).map(([key, values]) => {
            if (!values || values.length === 0) {
              return null;
            }

            return values.filter(value => mappedDisplayNames[key][value]).map((value) => {
              return (
                <cx-tag
                  key={value}
                  removable
                  data-value={value}
                  data-type={key}
                  size="small"
                >
                  {mappedDisplayNames[key][value]}
                  <cx-icon slot="suffix" name="close"></cx-icon>
                </cx-tag>
              );
            });
          })}
        </cx-space>
        {appliedFiltersCount > 0 && (
          <cx-button
            variant="text"
            className="clear-all-button"
            onClick={() => {
              onSettingChange('filter', {
                mediaTypes: [],
                visibilityClasses: [],
                statuses: [],
                extensions: [],
              });
            }}
          >
            Clear all
            <cx-icon slot="prefix" name="clear" label="Clear"></cx-icon>
          </cx-button>
        )}
      </cx-details>
    );
  }, [appliedFiltersCount, loading, mappedDisplayNames, newlyChangedOption.type, onSettingChange, selectedFacets]);

  return (
    <Container>
      <cx-space
        align-items="center"
        spacing="x-small"
        wrap="nowrap"
        style={{
          flex: 1,
        }}
      >
        <cx-input
          ref={searchRef}
          value={searchText}
          placeholder="Search..."
          clearable
          className="search-input"
        >
          <cx-icon
            name="search"
            slot="prefix"
            className="icon--large"
          ></cx-icon>
        </cx-input>
        <cx-dropdown ref={filterDropdownRef}>
          <div slot="trigger">
            <cx-tooltip content="Filter">
              <cx-icon-button
                name="filter_alt"
                label="Filter"
                outline
                data-cy="filter-button"
              >
                {appliedFiltersCount > 0 && (
                  <cx-badge slot="badge" pill size="small">
                    {appliedFiltersCount}
                  </cx-badge>
                )}
              </cx-icon-button>
            </cx-tooltip>
          </div>
          {renderAppliedFilters()}
          {availableFacets.length > 0 && (
            <cx-space direction="vertical" className="filter-details">
              {availableFacets.map((availableFacet) => {
                const facet = facets?.find(
                  (item) =>
                    item.facetDetails.facetFieldName ===
                    availableFacet.facetFieldName,
                );

                if (!facet) {
                  return null;
                }

                return (
                  <Facet
                    key={facet.facetDetails.facetFieldName}
                    values={facet.values}
                    displayName={facet.facetDetails.displayName}
                    type={facet.facetDetails.facetFieldName}
                    collections={
                      selectedFacets[facet.facetDetails.facetFieldName] || []
                    }
                  />
                );
              })}
            </cx-space>
          )}
        </cx-dropdown>
      </cx-space>
      <cx-space
        align-items="center"
        spacing="x-small"
        wrap="nowrap"
        style={{ marginLeft: 'auto' }}
      >
        <LineClamp lines={1}>
          <cx-typography variant="body3">
            {currentCount} of {totalCount}
          </cx-typography>
        </LineClamp>
        <cx-dropdown
          ref={viewDropdownRef}
          auto-width-factor={isMobile ? 1 : 0.6}
          stay-open-on-select
          placement="bottom-end"
          skidding={isMobile ? 40 : 0}
        >
          <div slot="trigger">
            <cx-tooltip content="View">
              <cx-icon-button
                name="dashboard"
                label="View"
                outline
                data-cy="view-button"
              ></cx-icon-button>
            </cx-tooltip>
          </div>
          {isMobile ? (
            <cx-menu variant="multiple" key="multiple-menu">
              <cx-menu active name="main">
                <cx-menu-label>View</cx-menu-label>
                <cx-menu-item menu="submenu" class={selectedView ? 'selected' : ''}>
                  Grid ({selectedView?.label})
                  <cx-icon slot="prefix" name="grid_view"></cx-icon>
                </cx-menu-item>
                <cx-divider></cx-divider>
                <cx-menu-item value="see-thru" className="menu-item--switch">
                  <LineClamp lines={1}>See-thru</LineClamp>
                  <cx-switch
                    checked={isSeeThrough}
                    onClick={(e) => e.preventDefault()}
                  ></cx-switch>
                </cx-menu-item>
              </cx-menu>
              <cx-menu name="submenu" back="main">
                {views.map((item) => (
                  <cx-menu-item
                    key={item.value}
                    value={item.value.toString()}
                    class={item.value === view ? 'selected' : ''}
                  >
                    <LineClamp lines={1}>{item.label}</LineClamp>
                    {
                      <cx-icon
                        slot="prefix"
                        name={view === item.value ? 'check' : ''}
                      ></cx-icon>
                    }
                  </cx-menu-item>
                ))}
              </cx-menu>
            </cx-menu>
          ) : (
            <cx-menu key="default-menu">
              <cx-menu-label>View</cx-menu-label>
              <cx-menu-item ref={selectedViewMenuItemRef} class={selectedView ? 'selected' : ''}>
                Grid ({selectedView?.label})
                <cx-menu slot="submenu">
                  {views.map((item) => (
                    <cx-menu-item
                      key={item.value}
                      value={item.value.toString()}
                      class={item.value === view ? 'selected' : ''}
                    >
                      <LineClamp lines={1}>{item.label}</LineClamp>
                      {
                        <cx-icon
                          slot="prefix"
                          name={view === item.value ? 'check' : ''}
                        ></cx-icon>
                      }
                    </cx-menu-item>
                  ))}
                </cx-menu>
                <cx-icon slot="prefix" name="grid_view"></cx-icon>
              </cx-menu-item>
              <cx-divider></cx-divider>
              <cx-menu-item value="see-thru" className="menu-item--switch">
                <LineClamp lines={1}>See-thru</LineClamp>
                <cx-switch
                  checked={isSeeThrough}
                  onClick={(e) => e.preventDefault()}
                ></cx-switch>
              </cx-menu-item>
            </cx-menu>
          )}
        </cx-dropdown>
        <cx-dropdown
          ref={sortDropdownRef}
          auto-width-factor={isMobile ? 1 : 0.5}
          stay-open-on-select
        >
          <div slot="trigger">
            <cx-tooltip content="Sort">
              <cx-icon-button
                name="sort"
                label="Sort"
                outline
                data-cy="sort-button"
              ></cx-icon-button>
            </cx-tooltip>
          </div>
          <cx-menu>
            {(sortOrders
              ? sortDirections.map((item) => {
                const label = sortOrders[sortOrder]?.find(
                  (sort) =>
                    sort.sortDirection.toLowerCase() ===
                      item.value.toLowerCase(),
                )?.sortDirectionDisplayName;

                return {
                  ...item,
                  label: label ?? item.value,
                };
              })
              : sortDirections
            ).map((item) => (
              <cx-menu-item
                key={item.value}
                data-type="sort-direction"
                disabled={!allowSorting}
                value={item.value}
                class={
                  allowSorting && sortDirection === item.value ? 'selected' : ''
                }
              >
                {item.label.replace(/\b\w/g, (char) => char.toUpperCase())}
                {loading &&
                newlyChangedOption.type === 'sortDirection' &&
                newlyChangedOption.value === item.value ? (
                  <cx-spinner slot="prefix"></cx-spinner>
                  ) : (
                  <item.icon></item.icon>
                  )}
              </cx-menu-item>
            ))}
            <cx-divider></cx-divider>
            {Object.keys(sortOrders ?? {}).map((item) => (
              <cx-menu-item
                key={item}
                data-type="sort-order"
                value={item}
                class={sortOrder === item ? 'selected' : ''}
              >
                {item.replace(/\b\w/g, (char) => char.toUpperCase())}
                {loading &&
                newlyChangedOption.type === 'sortOrder' &&
                newlyChangedOption.value === item ? (
                  <cx-spinner slot="prefix"></cx-spinner>
                  ) : (
                  <cx-icon
                    slot="prefix"
                    name={sortOrder === item ? 'check' : ''}
                  ></cx-icon>
                  )}
              </cx-menu-item>
            ))}
          </cx-menu>
        </cx-dropdown>
      </cx-space>
    </Container>
  );
};

export default ControlBar;
