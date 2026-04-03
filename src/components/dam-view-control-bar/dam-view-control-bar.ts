import { html } from 'lit';
import { property, state } from 'lit/decorators.js';

import CortexElement from '@/base/element';
import componentStyles from '@/styles/component.styles';
import { ChangeOption, Facet, SortOrder } from '@/types/dam-view';
import CxAvatar from '@orangelogic/design-system/components/avatar';
import CxIcon from '@orangelogic/design-system/components/icon';
import CxInput from '@orangelogic/design-system/components/input';
import CxLineClamp from '@orangelogic/design-system/components/line-clamp';
import CxSpace from '@orangelogic/design-system/components/space';
import CxTypography from '@orangelogic/design-system/components/typography';
import { customElement, LocalizeController } from '@orangelogic/design-system/utils';

import CxDamViewControlFilter from '../dam-view-control-filter/dam-view-control-filter';
import CxDamViewControlSort from '../dam-view-control-sort/dam-view-control-sort';
import CxDamViewControlView from '../dam-view-control-view/dam-view-control-view';
import styles from './dam-view-control-bar.styles';

import type { CxChangeEvent } from '@/events';
import type { CSSResultGroup, TemplateResult } from 'lit';
/**
 * @summary DAM view control bar for sorting, filtering, and changing asset view modes in the header toolbar.
 *
 * @description Combines sort, filter, and view controls into a single toolbar interface for the Content Browser. Allows users to change asset view layout, apply filters, and sort results using integrated dropdown and toolbar controls. Adapted from ContentBrowserSDK Header React component.
 *
 * @property {number} currentCount - The number of items currently displayed.
 * @property {number} totalCount - The total number of items available.
 * @property {string} sortOrder - The active sort field or direction.
 * @property {Record<string, SortOrder[]>} sortOrders - Mapping of sort keys to their order options.
 * @property {string} view - The current asset view mode.
 * @property {Array<ControlOption>} views - All available view layout options.
 * @property {Facet[]} facets - The currently active facets for filtering.
 * @property {Array<Facet['facetDetails']>} availableFacets - Metadata about all available facets.
 * @property {Record<string, string[]>} selectedFacets - Currently selected filter values by facet.
 * @property {boolean} isSeeThrough - If "see through" mode is enabled.
 * @property {boolean} loading - If the toolbar or its sub-controls are loading.
 * @property {ChangeOption | undefined} newlyChangedOption - Metadata about the last user-initiated change.
 *
 * @event cx-dam-view-control-bar-search-change - Fired when the search text is changed.
 */
@customElement('cx-dam-view-control-bar')
export default class CxDamViewControlBar extends CortexElement {
  static readonly styles: CSSResultGroup = [componentStyles, styles];

  static readonly dependencies = {
    'cx-avatar': CxAvatar,
    'cx-dam-view-control-filter': CxDamViewControlFilter,
    'cx-dam-view-control-sort': CxDamViewControlSort,
    'cx-dam-view-control-view': CxDamViewControlView,
    'cx-icon': CxIcon,
    'cx-input': CxInput,
    'cx-line-clamp': CxLineClamp,
    'cx-space': CxSpace,
    'cx-typography': CxTypography,
  };

  private readonly localize = new LocalizeController(this);

  @property({ attribute: 'current-count', type: Number })
  currentCount = 0;

  @property({ attribute: 'total-count', type: Number })
  totalCount = 0;

  @property({ attribute: 'sort-order-name', reflect: true, type: String })
  sortOrderName = '';

  @property({ attribute: 'sort-direction', reflect: true, type: String })
  sortDirection = '';

  @property({ attribute: 'sort-orders', reflect: false, type: Array })
  sortOrders: Record<string, SortOrder[]> = {};

  @property({ attribute: 'view', reflect: true, type: String })
  view = 'medium';

  @property({ attribute: 'views', reflect: false, type: Array })
  views = [];

  @property({ attribute: 'facets', reflect: false, type: Array })
  facets: Facet[] = [];

  @property({ attribute: 'available-facets', reflect: false, type: Array })
  availableFacets: Array<Facet['facetDetails']> = [];

  @property({ attribute: 'selected-facets', reflect: false, type: Object })
  selectedFacets: Record<string, string[]> = {};

  @property({ attribute: 'is-see-through', reflect: true, type: Boolean })
  isSeeThrough = false;

  @property({ attribute: 'loading', reflect: true, type: Boolean })
  loading = false;

  @property({ attribute: false, reflect: false, type: Object })
  newlyChangedOption: ChangeOption | undefined;

  @property({ attribute: 'is-mobile', reflect: false, type: Boolean })
  isMobile = false;

  @state()
  private searchText = '';

  private handleSearchChange(event: CxChangeEvent) {
    this.searchText = (event.target as CxInput).value;

    this.emit('cx-dam-view-control-bar-search-change', {
      detail: {
        searchText: this.searchText,
      },
    });
  }

  render(): TemplateResult {
    return html`
      <cx-space
        class="control-bar"
        align-items="center"
        justify-content="space-between"
        spacing="x-small"
        wrap="nowrap"
      >
        <cx-space class="control-bar__left" direction="horizontal" spacing="x-small" wrap="nowrap" align-items="center">
          <cx-input
            aria-label=${this.localize.term('search')}
            class="control-bar__search-input"
            value=${this.searchText}
            placeholder=${`${this.localize.term('search')}...`}
            clearable
            @cx-change=${this.handleSearchChange}
          >
            <cx-icon
              name="search"
              slot="prefix"
            ></cx-icon>
          </cx-input>
          <cx-dam-view-control-filter
            .availableFacets=${this.availableFacets}
            .facets=${this.facets}
            .newlyChangedOption=${this.newlyChangedOption}
            .selectedFacets=${this.selectedFacets}
            ?is-mobile=${this.isMobile}
            ?loading=${this.loading}
          ></cx-dam-view-control-filter>
        </cx-space>
        <cx-space direction="horizontal" spacing="x-small" wrap="nowrap" align-items="center">
          <cx-line-clamp lines="1">
            <cx-typography variant="body3">${this.localize.term('itemOfTotal', this.currentCount, this.totalCount)}</cx-typography>
          </cx-line-clamp>
          <cx-dam-view-control-view
            view=${this.view}
            .views=${this.views}
            ?is-see-through=${this.isSeeThrough}
            ?is-mobile=${this.isMobile}
          ></cx-dam-view-control-view>
          <cx-dam-view-control-sort
            sort-order-name=${this.sortOrderName}
            sort-direction=${this.sortDirection}
            .newlyChangedOption=${this.newlyChangedOption}
            .sortOrders=${this.sortOrders}
            ?is-mobile=${this.isMobile}
            ?loading=${this.loading}
          ></cx-dam-view-control-sort>
        </cx-space>
      </cx-space>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'cx-dam-view-control-bar': CxDamViewControlBar;
  }
}
