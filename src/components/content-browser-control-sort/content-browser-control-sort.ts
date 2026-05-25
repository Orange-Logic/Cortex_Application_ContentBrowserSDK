import CxDivider from '@orangelogic/design-system/components/divider';
import CxDropdown from '@orangelogic/design-system/components/dropdown';
import CxIcon from '@orangelogic/design-system/components/icon';
import CxIconButton from '@orangelogic/design-system/components/icon-button';
import CxMenu from '@orangelogic/design-system/components/menu';
import CxMenuItem from '@orangelogic/design-system/components/menu-item';
import CxSpinner from '@orangelogic/design-system/components/spinner';
import CxTooltip from '@orangelogic/design-system/components/tooltip';
import CortexElement from '@/base/element';
import type { CxSelectEvent } from '@/events';
import componentStyles from '@/styles/component.styles';
import { ControlOption, SortOrder } from '@/types/content-browser';
import { customElement, LocalizeController } from '@orangelogic/design-system/utils';
import { watch } from '@/utils/watch';

import type { CSSResultGroup, TemplateResult } from 'lit';
import { html, nothing } from 'lit';
import { property, state } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import { when } from 'lit/directives/when.js';

import styles from './content-browser-control-sort.styles';

enum OptionType {
  SORT_DIRECTION = 'sort-direction',
  SORT_ORDER = 'sort-order',
}

type ChangeOption = {
  type: OptionType,
  value: string,
};

/**
 * @summary DAM view sort control. Allows users to select the sort field and sort direction for assets.
 *
 * @description Provides a dropdown toolbar for sorting assets by various fields and choosing ascending or descending order. Adapted from ContentBrowserSDK Header React component.
 *
 * @property {string} sortOrder - The current sort field value.
 * @property {Record<string, SortOrder[]>} sortOrders - Mapping of sort fields to available order options.
 * @property {boolean} loading - Indicates if sort options are loading.
 * @property {boolean} isMobile - Adjusts dropdown UI for mobile devices.
 * @property {object} newlyChangedOption - Metadata about the last user-initiated sort change.
 *
 * @event cx-content-browser-control-sort-change - Emitted when the sort field or sort order is changed.
 */
@customElement('cx-content-browser-control-sort')
export default class CxContentBrowserControlSort extends CortexElement {
  static readonly styles: CSSResultGroup = [componentStyles, styles];

  static readonly dependencies = {
    'cx-divider': CxDivider,
    'cx-dropdown': CxDropdown,
    'cx-icon': CxIcon,
    'cx-icon-button': CxIconButton,
    'cx-menu': CxMenu,
    'cx-menu-item': CxMenuItem,
    'cx-spinner': CxSpinner,
    'cx-tooltip': CxTooltip,
  };

  private readonly localize = new LocalizeController(this);

  @property({ attribute: 'sort-order-name', reflect: true, type: String })
  sortOrderName = '';

  @property({ attribute: 'sort-direction', reflect: true, type: String })
  sortDirection = '';

  @property({ attribute: 'sort-orders', reflect: false, type: Array })
  sortOrders: Record<string, SortOrder[]> = {};

  @property({ attribute: 'loading', reflect: true, type: Boolean })
  loading = false;

  @property({ attribute: 'is-mobile', reflect: false, type: Boolean })
  isMobile = false;

  @property({ attribute: 'newly-changed-option', reflect: false, type: Object })
  newlyChangedOption: ChangeOption | undefined;

  @state()
  private mappedSortDirections: Array<ControlOption & { icon: TemplateResult }> = [];

  @state()
  private readonly sortDirections = [{
    icon: html`<cx-icon name="arrow_upward" slot="checked-icon"></cx-icon>`,
    label: this.localize.term('ascending'),
    value: 'ascending',
  }, {
    icon: html`<cx-icon name="arrow_downward" slot="checked-icon"></cx-icon>`,
    label: this.localize.term('descending'),
    value: 'descending',
  }];

  get canSort() {
    return this.sortOrders[this.sortOrderName]?.length > 1;
  }

  private handleSortSelect(event: CxSelectEvent<CxMenuItem>) {
    const type = event.detail.item.dataset.type;
    const value = event.detail.item.value;

    if (!value || !type) {
      return;
    }

    if (type === OptionType.SORT_DIRECTION) {
      this.emit('cx-content-browser-control-sort-order-change', {
        detail: {
          sortDirection: value,
          sortOrderName: this.sortOrderName,
        },
      });
    } else {
      this.emit('cx-content-browser-control-sort-order-change', {
        detail: {
          sortDirection: this.sortDirection,
          sortOrderName: value,
        },
      });
    }
  }

  @watch('sortOrderName')
  @watch('sortDirection')
  @watch('sortOrders', { waitUntilFirstUpdate: true })
  @watch('sortDirections', { waitUntilFirstUpdate: true })
  async handleSortDirectionsChange() {
    this.mappedSortDirections = this.sortDirections.map((item) => {
      const label = Object.values(this.sortOrders).flat().find(
        (sort) => {
          return sort.sortDirection.toLowerCase() === item.value.toLowerCase() && sort.sortDirectionGroupKey.toLowerCase() === this.sortOrderName.toLowerCase();
        })?.sortDirectionDisplayName || item.label;

      return {
        ...item,
        label,
      };
    });
  }

  render(): TemplateResult {
    return html`
      <cx-dropdown
        auto-width-factor=${this.isMobile ? 1 : 0.5}
        stay-open-on-select
        placement="bottom-end"
        distance="4"
        skidding=${this.isMobile ? 40 : 0}
        @cx-select=${this.handleSortSelect}
        hoist
      >
        <div slot="trigger">
          <cx-tooltip content=${this.localize.term('sort')}>
            <cx-icon-button
              name="sort"
              label=${this.localize.term('sort')}
              outline
            ></cx-icon-button>
          </cx-tooltip>
        </div>
        <cx-menu>
          ${repeat(this.mappedSortDirections,
            (item) => item.value,
            (item) => {
              const isLoading = this.loading && this.newlyChangedOption?.value === item.value && this.newlyChangedOption?.type === OptionType.SORT_DIRECTION;

              return html`
                <cx-menu-item
                  key=${item.value}
                  always-show-checked-icon
                  data-type=${OptionType.SORT_DIRECTION}
                  value=${item.value}
                  type="checkbox"
                  ?checked=${this.canSort && this.sortDirection === item.value}
                  ?disabled=${!this.canSort}
                >
                  ${item.label.replaceAll(/(\b\w)/g, (char) => char.toUpperCase())}
                  ${when(isLoading,
                    () => html`<cx-spinner slot="checked-icon"></cx-spinner>`,
                    () => item.icon,
                  )}
                </cx-menu-item>
              `;
            },
          )}
          <cx-divider></cx-divider>
          ${repeat(Object.keys(this.sortOrders),
            (item) => item,
            (item) => {
              const isLoading = this.loading && this.newlyChangedOption?.value === item && this.newlyChangedOption?.type === OptionType.SORT_ORDER;

              return html`<cx-menu-item
                key=${item}
                data-type=${OptionType.SORT_ORDER}
                value=${item}
                type="checkbox"
                ?checked=${this.sortOrderName === item}
              >
                ${item.replaceAll(/(\b\w)/g, (char) => char.toUpperCase())}
                ${when(isLoading,
                  () => html`<cx-spinner slot="checked-icon"></cx-spinner>`,
                  () => nothing,
                )}
              </cx-menu-item>`;
            },
          )}
        </cx-menu>
      </cx-dropdown>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'cx-content-browser-control-sort': CxContentBrowserControlSort;
  }
}
