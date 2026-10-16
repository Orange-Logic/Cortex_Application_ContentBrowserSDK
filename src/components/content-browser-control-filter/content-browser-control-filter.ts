
import { html, nothing } from 'lit';
import { property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { repeat } from 'lit/directives/repeat.js';
import { styleMap } from 'lit/directives/style-map.js';
import { when } from 'lit/directives/when.js';

import CortexElement from '@/base/element';
import { CxRemoveEvent, CxSelectionChangeEvent } from '@/events';
import componentStyles from '@/styles/component.styles';
import { ChangeOption, Facet, OptionType } from '@/types/content-browser';
import { watch } from '@/utils/watch';
import CxBadge from '@orangelogic/design-system/components/badge';
import CxButton from '@orangelogic/design-system/components/button';
import CxDetails from '@orangelogic/design-system/components/details';
import CxDivider from '@orangelogic/design-system/components/divider';
import CxDropdown from '@orangelogic/design-system/components/dropdown';
import CxIcon from '@orangelogic/design-system/components/icon';
import CxIconButton from '@orangelogic/design-system/components/icon-button';
import CxLineClamp from '@orangelogic/design-system/components/line-clamp';
import CxMenu from '@orangelogic/design-system/components/menu';
import CxMenuItem from '@orangelogic/design-system/components/menu-item';
import CxMenuLabel from '@orangelogic/design-system/components/menu-label';
import CxSpace from '@orangelogic/design-system/components/space';
import CxSpinner from '@orangelogic/design-system/components/spinner';
import CxSwitch from '@orangelogic/design-system/components/switch';
import CxTag from '@orangelogic/design-system/components/tag';
import CxTooltip from '@orangelogic/design-system/components/tooltip';
import CxTypography from '@orangelogic/design-system/components/typography';
import { customElement, LocalizeController } from '@orangelogic/design-system/utils';

import CxContentBrowserControlFilterFacet from '../content-browser-control-filter-facet/content-browser-control-filter-facet';
import styles from './content-browser-control-filter.styles';

import type CxTreeItem from '@orangelogic/design-system/components/tree-item';
import type { CSSResultGroup, TemplateResult } from 'lit';
/**
 * @summary DAM view filter control for applying, viewing, and managing asset filters in the toolbar.
 *
 * @description Presents available filter facets to refine asset results in the Content Browser.
 * Users can select, clear, or modify filters using dropdown panels. Adapted from ContentBrowserSDK Filter React component.
 *
 * @property {Facet[]} facets - Active facet objects providing metadata and available options.
 * @property {Array<Facet['facetDetails']>} availableFacets - Array of available facet details.
 * @property {Record<string, string[]>} selectedFacets - Mapping of currently selected filter values per facet name.
 * @property {boolean} loading - Indicates if facet/filter options are loading.
 * @property {ChangeOption | undefined} newlyChangedOption - Metadata about the last user-initiated filter change.
 * @property {boolean} isMobile - Whether mobile mode is enabled.
 *
 * @event cx-content-browser-control-filter-change - Fired when the filters are changed.
 */
@customElement('cx-content-browser-control-filter')
export default class CxContentBrowserControlFilter extends CortexElement {
  static readonly styles: CSSResultGroup = [componentStyles, styles];

  static readonly dependencies = {
    'cx-badge': CxBadge,
    'cx-button': CxButton,
    'cx-content-browser-control-filter-facet': CxContentBrowserControlFilterFacet,
    'cx-details': CxDetails,
    'cx-divider': CxDivider,
    'cx-dropdown': CxDropdown,
    'cx-icon': CxIcon,
    'cx-icon-button': CxIconButton,
    'cx-line-clamp': CxLineClamp,
    'cx-menu': CxMenu,
    'cx-menu-item': CxMenuItem,
    'cx-menu-label': CxMenuLabel,
    'cx-space': CxSpace,
    'cx-spinner': CxSpinner,
    'cx-switch': CxSwitch,
    'cx-tag': CxTag,
    'cx-tooltip': CxTooltip,
    'cx-typography': CxTypography,
  };

  private readonly localize = new LocalizeController(this);

  @property({ attribute: 'facets', reflect: false, type: Array })
  facets: Facet[] = [];

  @property({ attribute: 'available-facets', reflect: false, type: Array })
  availableFacets: Array<Facet['facetDetails']> = [];

  @property({ attribute: 'selected-facets', reflect: false, type: Object })
  selectedFacets: Record<string, string[]> = {};

  @property({ attribute: 'loading', reflect: false, type: Boolean })
  loading = false;

  @property({ attribute: 'newly-changed-option', reflect: false, type: Object })
  newlyChangedOption: ChangeOption | undefined;

  @property({ attribute: 'is-mobile', reflect: false, type: Boolean })
  isMobile = false;

  @state()
  private appliedFiltersCount = 0;

  @state()
  mappedDisplayNames: Record<string, Record<string, string>> = {};

  @watch('facets')
  handleFacetsChange() {
    this.mappedDisplayNames = this.facets.reduce((acc, facet) => {
      const displayNames = facet.values.reduce((displayNamesAcc, { displayValue, value }) => {
        displayNamesAcc[value] = displayValue;

        return displayNamesAcc;
      }, {} as Record<string, string>);

      return {
        ...acc,
        [facet.facetDetails.facetFieldName]: displayNames,
      };
    }, {} as Record<string, Record<string, string>>);

    this.updateAppliedFiltersCount();
  }

  @watch('selectedFacets')
  handleSelectedFacetsChange() {
    this.updateAppliedFiltersCount();
  }

  private updateAppliedFiltersCount() {
    this.appliedFiltersCount = Object.entries(this.selectedFacets).reduce((acc, [key, values]) => {
      return acc + values.filter((value) => this.mappedDisplayNames[key]?.[value]).length;
    }, 0);
  }

  private handleClearAllClick() {
    this.emit('cx-content-browser-control-filter-change', {
      detail: {
        selection: {},
      },
    });
  }

  private handleSelectionChange(event: CxSelectionChangeEvent<CxTreeItem>) {
    const facet = (event.target as HTMLElement).dataset.facet;

    if (!facet) {
      return;
    }

    const newSelection = event.detail.selection.reduce(
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
        ...this.selectedFacets,
        [facet]: [] as string[],
      },
    );

    this.emit('cx-content-browser-control-filter-change', {
      detail: {
        selection: newSelection,
      },
    });
  }

  private handleRemove(event: CxRemoveEvent) {
    const target = event.target as HTMLElement;
    const type = target.dataset.type;
    const value = target.dataset.value;

    if (!value || !type) {
      return;
    }

    const newFilter = { ...this.selectedFacets };

    if (newFilter[type]) {
      newFilter[type] = newFilter[type].filter((item) => item !== value);
    }

    this.emit('cx-content-browser-control-filter-change', {
      detail: {
        selection: newFilter,
      },
    });
  }

  private renderAppliedFilters() {
    return html`
      <cx-details
        open
        class=${classMap({
          'filter-details': true,
          'filter-details--empty': this.appliedFiltersCount === 0,
        })}
      >
        <cx-space
          slot="summary"
          align-items="center"
          spacing="x-small"
          wrap="nowrap"
        >
          <cx-typography variant="body3">
            ${this.localize.term('appliedFilters')}
            ${when(this.appliedFiltersCount > 0,
              () => html` (${this.appliedFiltersCount})`,
              () => nothing,
            )}
          </cx-typography>
          ${when(this.loading && this.newlyChangedOption?.type === OptionType.FILTER,
            () => html`<cx-spinner></cx-spinner>`,
            () => nothing,
          )}
        </cx-space>
        <cx-space
          direction="horizontal"
          spacing="small"
          style=${styleMap({
            'max-width': '320px',
          })}
        >
          ${repeat(Object.entries(this.selectedFacets),
            ([key, values]) => [key, values],
            ([key, values]) => {
              return values.filter((value) => this.mappedDisplayNames[key]?.[value]).map((value) => {
                return html`
                  <cx-tag
                    key=${value}
                    removable
                    data-value=${value}
                    data-type=${key}
                    size="small"
                  >
                    ${this.mappedDisplayNames[key][value]}
                  </cx-tag>
                `;
              });
            },
          )}
        </cx-space>
        ${when(this.appliedFiltersCount > 0,
          () => html`
            <cx-button
              variant="text"
              @click=${this.handleClearAllClick}
            >
              ${this.localize.term('clearAll')}
              <cx-icon slot="prefix" name="clear" label=${this.localize.term('clearAll')}></cx-icon>
            </cx-button>
          `,
          () => nothing,
        )}
      </cx-details>
    `;
  }

  render(): TemplateResult {
    return html`
      <cx-dropdown
        auto-width-factor=${this.isMobile ? 1 : 0.6}
        stay-open-on-select
        placement="bottom-start"
        distance="4"
        skidding=${this.isMobile ? 40 : 0}
        @cx-remove=${this.handleRemove}
        @cx-selection-change=${this.handleSelectionChange}
        hoist
      >
        <div slot="trigger">
          <cx-tooltip content=${this.localize.term('filter')}>
            <cx-icon-button
              name="filter_alt"
              label=${this.localize.term('filter')}
              outline
              data-testid="filter-button"
            >
            ${when(this.appliedFiltersCount > 0,
              () => html`<cx-badge slot="badge" pill size="small">${this.appliedFiltersCount}</cx-badge>`,
              () => nothing,
            )}
            </cx-icon-button>
          </cx-tooltip>
        </div>
        ${this.renderAppliedFilters()}
        ${when(this.availableFacets.length > 0,
          () => html`<div>
            ${repeat(this.availableFacets,
              (availableFacet) => availableFacet.facetFieldName,
              (availableFacet) => {
                const facet = this.facets.find(
                  (item) =>
                    item.facetDetails.facetFieldName ===
                    availableFacet.facetFieldName,
                );

                if (!facet) {
                  return nothing;
                }

                return html`
                  <cx-content-browser-control-filter-facet
                    display-name=${facet.facetDetails.displayName}
                    type=${facet.facetDetails.facetFieldName}
                    .collections=${this.selectedFacets[facet.facetDetails.facetFieldName] || []}
                    .values=${facet.values}
                  ></cx-content-browser-control-filter-facet>
                `;
              },
            )}
          </div>`,
          () => nothing,
        )}
      </cx-dropdown>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'cx-content-browser-control-filter': CxContentBrowserControlFilter;
  }
}