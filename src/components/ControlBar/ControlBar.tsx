import _capitalize from 'lodash-es/capitalize';
import _debounce from 'lodash-es/debounce';
import { FC, useCallback, useEffect, useRef, useState } from 'react';

import { Filter, GridView, SortDirection } from '@/types/search';
import {
  CxChangeEvent,
  CxDropdown,
  CxInput,
  CxRemoveEvent,
  CxSelectEvent,
  CxSelectionChangeEvent,
} from '@/web-component';

import { sortDirections, sortOrders, views } from './ControlBar.constants';
import { Container, FlexWrapper } from './ControlBar.styled';

const TYPE = {
  type: 'type',
  visibilityClass: 'visibility class',
  status: 'status',
  extension: 'extension',
};

type Props = {
  allowSorting: boolean;
  currentCount: number;
  disabled: boolean;
  extensions: string[];
  facets?: Record<string, Record<string, number>>;
  isSeeThrough: boolean;
  mediaTypes: string[];
  searchValue: string;
  sortDirection: 'ascending' | 'descending';
  sortOrder: string;
  statuses: string[];
  totalCount: number;
  view: GridView;
  visibilityClasses: string[];
  onSearchChange: (value: string) => void;
  onSettingChange: (
    setting: string,
    value: GridView | SortDirection | Filter | string | boolean | string[]
  ) => void;
};

const ControlBar: FC<Props> = ({
  allowSorting,
  currentCount,
  disabled,
  extensions,
  facets,
  isSeeThrough,
  mediaTypes,
  searchValue: searchText,
  sortDirection,
  sortOrder,
  statuses,
  totalCount,
  view,
  visibilityClasses,
  onSearchChange,
  onSettingChange,
}) => {
  const [isDefined, setIsDefined] = useState(false);
  const searchRef = useRef<CxInput>(null);
  const filterDropdownRef = useRef<CxDropdown>(null);
  const viewDropdownRef = useRef<CxDropdown>(null);
  const sortDropdownRef = useRef<CxDropdown>(null);

  useEffect(() => {
    Promise.all([
      customElements.whenDefined('cx-input'),
      customElements.whenDefined('cx-checkbox'),
      customElements.whenDefined('cx-dropdown'),
    ]).then(() => setIsDefined(true));
  }, []);

  useEffect(() => {
    const onSearchInput = _debounce((e: CxChangeEvent) => {
      const value = (e.target as CxInput).value;
      if (searchText !== value) {
        onSearchChange(value);
      }
    }, 300);
    const searchInput = searchRef.current;
    searchInput?.addEventListener('cx-input', onSearchInput);
    return () => {
      searchInput?.removeEventListener('cx-input', onSearchInput);
    };
  }, [isDefined, searchText, onSearchChange]);

  useEffect(() => {
    const onViewSelect = (e: CxSelectEvent) => {
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
    const onFilterRemove = (e: CxRemoveEvent) => {
      const target = e.target as HTMLElement;
      const type = target.dataset.type;
      const value = target.dataset.value;

      if (!value) {
        return;
      }

      let newMediaTypes = mediaTypes;
      let newVisibilityClasses = visibilityClasses;
      let newStatuses = statuses;
      let newExtensions = extensions;

      switch (type) {
        case TYPE.type:
          newMediaTypes = mediaTypes.filter((item) => item !== value);
          break;
        case TYPE.visibilityClass:
          newVisibilityClasses = visibilityClasses.filter((item) => item !== value);
          break;
        case TYPE.status:
          newStatuses = statuses.filter((item) => item !== value);
          break;
        case TYPE.extension:
          newExtensions = extensions.filter((item) => item !== value);
          break;
        default:
          break;
      }

      onSettingChange('filter', {
        mediaTypes: newMediaTypes,
        visibilityClasses: newVisibilityClasses,
        statuses: newStatuses,
        extensions: newExtensions,
      });
    };
    const onFilterSelectionChange = (e: CxSelectionChangeEvent) => {
      const newSelection = e.detail.selection.reduce(
        (acc, item) => {
          const type = item.dataset.type;
          const value = item.dataset.value;

          if (!value) {
            return acc;
          }

          switch (type) {
            case TYPE.type:
              acc.mediaTypes.push(value);
              break;
            case TYPE.visibilityClass:
              acc.visibilityClasses.push(value);
              break;
            case TYPE.status:
              acc.statuses.push(value);
              break;
            case TYPE.extension:
              acc.extensions.push(value);
              break;
            default:
              break;
          }

          return acc;
        }, {
          extensions: [] as string[],
          mediaTypes: [] as string[],
          visibilityClasses: [] as string[],
          statuses: [] as string[],
        },
      );

      onSettingChange('filter', newSelection);
    };
    const onSortSelect = (e: CxSelectEvent) => {
      const type = e.detail.item.dataset.type;
      const value = e.detail.item.value;

      if (!value) {
        return;
      }

      if (type === 'sort-direction') {
        onSettingChange('sortDirection', value as 'ascending' | 'descending');
      } else if (type === 'sort-order') {
        onSettingChange('sortOrder', value);
      }
    };
    const filterDropdown = filterDropdownRef.current;
    const sortDropdown = sortDropdownRef.current;
    filterDropdown?.addEventListener('cx-selection-change', onFilterSelectionChange);
    filterDropdown?.addEventListener('cx-remove', onFilterRemove);
    sortDropdown?.addEventListener('cx-select', onSortSelect);
    return () => {
      filterDropdown?.removeEventListener('cx-selection-change', onFilterSelectionChange);
      filterDropdown?.removeEventListener('cx-remove', onFilterRemove);
      sortDropdown?.removeEventListener('cx-select', onSortSelect);
    };
  }, [
    isDefined,
    extensions,
    mediaTypes,
    statuses,
    visibilityClasses,
    onSettingChange,
  ]);

  const renderAppliedFilters = useCallback(() => {
    const appliedFilersCount = mediaTypes.length + visibilityClasses.length + statuses.length + extensions.length;

    return (
      <cx-details
        className={`filter-details ${appliedFilersCount === 0 ? 'filter-details--empty' : ''}`.trim()}
        summary={'Applied filters' + (appliedFilersCount > 0 ? ` (${appliedFilersCount})` : '')}
      >
        <cx-space direction="horizontal" spacing="small">
          {mediaTypes.map((item) => (
            <cx-tag
              key={item}
              removable
              data-value={item}
              data-type={TYPE.type}
            >
              {item.toLowerCase()}
            </cx-tag>
          ))}
          {visibilityClasses.map((item) => (
            <cx-tag
              key={item}
              removable
              data-value={item}
              data-type={TYPE.visibilityClass}
            >
              {item.toLowerCase()}
            </cx-tag>
          ))}
          {statuses.map((item) => (
            <cx-tag
              key={item}
              removable
              data-value={item}
              data-type={TYPE.status}
            >
              {item.toLowerCase()}
            </cx-tag>
          ))}
          {extensions.map((item) => (
            <cx-tag
              key={item}
              removable
              data-value={item}
              data-type={TYPE.extension}
            >
              {item.toLowerCase()}
            </cx-tag>
          ))}
        </cx-space>
      </cx-details>
    );
  }, [extensions, mediaTypes, statuses, visibilityClasses]);

  const renderFacet = (
    facet: Record<string, number>,
    type: string,
    collections: string[],
    capitalize = true,
  ) => {
    if (!facet || Object.values(facet).length === 0) {
      return null;
    }

    // The current facet value is flat. If a facet includes the ">>" character, it means it's a subtype, and the parent type is the value before ">>". We need to group them.
    // For example, "contact >> email", "contact >> phone", and "contact >> address" should be grouped as "contact" => { email: 10, phone: 5, address: 3 }
    const mappedSubtypes = Object.entries(facet).reduce(
      (acc, [key, value]) => {
        const [parent, subtype] = key.split('>>');
        if (subtype) {
          if (!acc[parent]) {
            acc[parent] = {};
          }
          (acc[parent] as Record<string, number>)[subtype] = value;
        } else {
          acc[key] = value;
        }
        return acc;
      },
      {} as Record<string, Record<string, number> | number>,
    );

    return (
      <cx-details
        className="filter-details"
        summary={_capitalize(type)}
      >
        <cx-space direction="vertical">
          <cx-tree selection="multiple">
            {Object.entries(mappedSubtypes).map(([key, value]) => {
              if (typeof value === 'object') {
                return (
                  <cx-tree-item
                    key={key}
                    data-value={key}
                    data-type={type}
                    readonly={disabled}
                    selected={collections.includes(key)}
                  >
                    {/* <cx-checkbox
                      key={key}
                      value={key}
                      data-type={type}
                      checked={collections.includes(key)}
                    > */}
                      {capitalize ? _capitalize(key) : key}
                    {/* </cx-checkbox> */}
                    {Object.entries(value).map(([subtype, count]) => (
                      <cx-tree-item
                        key={subtype}
                        data-value={`${key}>>${subtype}`}
                        data-type={type}
                        readonly={disabled}
                        selected={collections.includes(`${key}>>${subtype}`)}
                      >
                        {/* <cx-checkbox
                          key={subtype}
                          value={subtype}
                          data-type={type}
                          checked={collections.includes(subtype)}
                        > */}
                          {capitalize ? _capitalize(subtype) : subtype} (
                          {count})
                        {/* </cx-checkbox> */}
                      </cx-tree-item>
                    ))}
                  </cx-tree-item>
                );
              }
              return (
                <cx-tree-item
                  key={key}
                  data-value={key}
                  data-type={type}
                  readonly={disabled}
                  selected={collections.includes(key)}
                >
                  {/* <cx-checkbox
                    key={key}
                    value={key}
                    data-type={type}
                    checked={collections.includes(key)}
                  > */}
                    {capitalize ? _capitalize(key) : key} ({value})
                  {/* </cx-checkbox> */}
                </cx-tree-item>
              );
            })}
          </cx-tree>
        </cx-space>
      </cx-details>
    );
  };

  return (
    <Container>
      <FlexWrapper
        style={{
          flex: 1,
        }}
      >
        <cx-input
          ref={searchRef}
          defaultValue={searchText}
          placeholder="Search..."
          clearable
        >
          <cx-icon name="search" slot="prefix"></cx-icon>
        </cx-input>
        <cx-dropdown ref={filterDropdownRef}>
          <div slot="trigger">
            <cx-tooltip content="Filter">
              <cx-icon-button
                name="filter_alt"
                label="Filter"
                outline
              ></cx-icon-button>
            </cx-tooltip>
          </div>
          {renderAppliedFilters()}
          {renderFacet(facets?.type ?? {}, TYPE.type, mediaTypes)}
          {renderFacet(
            facets?.visibilityClass ?? {},
            TYPE.visibilityClass,
            visibilityClasses,
          )}
          {renderFacet(facets?.status ?? {}, TYPE.status, statuses)}
          {renderFacet(
            facets?.extension ?? {},
            TYPE.extension,
            extensions,
            false,
          )}
        </cx-dropdown>
      </FlexWrapper>
      <FlexWrapper>
        <cx-line-clamp lines={1}>
          <cx-typography variant="body3">
            {currentCount} of {totalCount}
          </cx-typography>
        </cx-line-clamp>
        <cx-dropdown
          ref={viewDropdownRef}
          auto-width-factor={0.5}
          stay-open-on-select
        >
          <div slot="trigger">
            <cx-tooltip content="View">
              <cx-icon-button
                name="dashboard"
                label="View"
                outline
              ></cx-icon-button>
            </cx-tooltip>
          </div>
          <cx-menu>
            <cx-menu-label>View</cx-menu-label>
            <cx-menu-item>
              Grid
              <cx-menu slot="submenu">
                {views.map((item) => (
                  <cx-menu-item
                    key={item.value}
                    value={item.value.toString()}
                    class={item.value === view ? 'selected' : ''}
                  >
                    {item.label}
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
              <cx-line-clamp lines={1}>See-thru</cx-line-clamp>
              <cx-switch
                checked={isSeeThrough}
                onClick={(e) => e.preventDefault()}
              ></cx-switch>
            </cx-menu-item>
          </cx-menu>
        </cx-dropdown>
        <cx-dropdown
          ref={sortDropdownRef}
          auto-width-factor={0.5}
          stay-open-on-select
        >
          <div slot="trigger">
            <cx-tooltip content="Sort">
              <cx-icon-button name="sort" label="Sort" outline></cx-icon-button>
            </cx-tooltip>
          </div>
          <cx-menu>
            {sortDirections.map((item) => (
              <cx-menu-item
                key={item.value}
                data-type="sort-direction"
                disabled={!allowSorting}
                value={item.value}
                class={sortDirection === item.value ? 'selected' : ''}
              >
                {item.value.replace(/\b\w/g, (char) => char.toUpperCase())}
                {<item.icon></item.icon>}
              </cx-menu-item>
            ))}
            <cx-divider></cx-divider>
            {sortOrders.map((item) => (
              <cx-menu-item
                key={item.key}
                data-type="sort-order"
                value={item.key}
                class={sortOrder === item.key ? 'selected' : ''}
              >
                {item.label.replace(/\b\w/g, (char) => char.toUpperCase())}
                {
                  <cx-icon
                    slot="prefix"
                    name={sortOrder === item.key ? 'check' : ''}
                  ></cx-icon>
                }
              </cx-menu-item>
            ))}
          </cx-menu>
        </cx-dropdown>
      </FlexWrapper>
    </Container>
  );
};

export default ControlBar;
