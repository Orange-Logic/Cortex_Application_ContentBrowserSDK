import CxButton from '@orangelogic/design-system/components/button';
import CxDetails from '@orangelogic/design-system/components/details';
import CxSpace from '@orangelogic/design-system/components/space';
import CxSpinner from '@orangelogic/design-system/components/spinner';
import CxTree from '@orangelogic/design-system/components/tree';
import CxTreeItem from '@orangelogic/design-system/components/tree-item';
import CxTypography from '@orangelogic/design-system/components/typography';
import CortexElement from '@/base/element';
import { customElement, LocalizeController } from '@orangelogic/design-system/utils';
import { watch } from '@/utils/watch';

import { html, nothing } from 'lit';
import { property, state } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import { when } from 'lit/directives/when.js';

/**
 * @summary CxContentBrowser
 */
@customElement('cx-content-browser-control-filter-facet')
export default class CxContentBrowserControlFilterFacet extends CortexElement {
  static readonly dependencies = {
    'cx-button': CxButton,
    'cx-details': CxDetails,
    'cx-space': CxSpace,
    'cx-spinner': CxSpinner,
    'cx-tree': CxTree,
    'cx-tree-item': CxTreeItem,
    'cx-typography': CxTypography,
  };

  private readonly localize = new LocalizeController(this);

  private static readonly itemsPerPage = 10;

  @property({ attribute: 'loading', reflect: false, type: Boolean })
  loading = false;

  @property({ attribute: 'display-name', reflect: false, type: String })
  displayName = '';

  @property({ attribute: 'type', reflect: true, type: String })
  type = '';

  @property({ attribute: 'values', reflect: false, type: Array })
  values: Array<{
    count: number;
    displayValue: string;
    value: string;
  }> = [];

  @property({ attribute: 'collections', reflect: false, type: Array })
  collections: string[] = [];

  @state()
  private mappedSubtypes: Record<string, Record<string, number>> = {};

  @state()
  private mappedDisplayNames: Record<string, string> = {};

  @state()
  private page = 1;

  createRenderRoot() {
    return this;
  }

  @watch('values')
  handleValuesChange() {
    this.mappedSubtypes = this.values.reduce((acc, { count: value, value: key }) => {
      const [parent, subtype] = key.split('>>');

      if (!acc[parent] || typeof acc[parent] !== 'object') {
        acc[parent] = {};
      }

      if (subtype) {
        acc[parent][subtype] = value;
      }
      acc[parent].all = (acc[parent].all || 0) + value;

      return acc;
    }, {} as Record<string, Record<string, number>>);

    const mappedDisplayNames: Record<string, string> = {};
    this.values.forEach((facetName) => {
      mappedDisplayNames[facetName.value] = facetName.displayValue;
    });
    // iterate through the values again, splitting them by ">>" and checking if the parent is already in the mappedDisplayNames
    this.values.forEach((facetName) => {
      const parts = facetName.value.split('>>');

      if (parts.length > 1) {
        // For multi-level hierarchies, get the immediate parent (everything except the last part)
        const parent = parts.slice(0, -1).join('>>');

        if (!mappedDisplayNames[parent]) {
          mappedDisplayNames[parent] = parent.split(' ').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        }
      }
    });
    this.mappedDisplayNames = mappedDisplayNames;
  }

  private loadMore() {
    this.page++;
  }

  render() {
    return html`
      <cx-details open class="content-browser-control-filter-facet">
        <cx-space
          slot="summary"
          align-items="center"
          spacing="x-small"
          wrap="nowrap"
        >
          <cx-typography variant="body3">${this.displayName}</cx-typography>
          ${when(this.loading,
            () => html`<cx-spinner></cx-spinner>`,
            () => nothing,
          )}
        </cx-space>
        <cx-space direction="vertical">
          <cx-tree
            selection="multiple"
            label-select-single
            data-facet=${this.type}
          >
            ${repeat(Object.entries(this.mappedSubtypes)
              .slice(0, this.page * CxContentBrowserControlFilterFacet.itemsPerPage),
              ([key]) => key,
              ([key, value]) => {
                const { all, ...rest } = value;

                const totalCount = Object.values(rest).reduce(
                  (sum, count) => sum + count,
                  0,
                );

                return html`
                  <cx-tree-item
                    data-value=${key}
                    data-type=${this.type}
                    ?readonly=${this.loading}
                    ?partial-sync-checkboxes=${totalCount < all}
                    ?selected=${this.collections.includes(key)}
                  >
                    ${this.mappedDisplayNames[key]} ${all ? `(${all})` : nothing}
                    ${repeat(Object.entries(rest),
                      ([subtype, count]) => {
                        return html`
                          <cx-tree-item
                            data-value=${`${key}>>${subtype}`}
                            data-type=${this.type}
                            ?readonly=${this.loading}
                            ?selected=${this.collections.includes(`${key}>>${subtype}`)}
                          >
                            ${this.mappedDisplayNames[`${key}>>${subtype}`]} (${count})
                          </cx-tree-item>
                        `;
                      },
                    )}
                  </cx-tree-item>
                `;
              },
            )}
            ${when(
              Object.keys(this.mappedSubtypes).length > this.page * CxContentBrowserControlFilterFacet.itemsPerPage,
              () => html`
                <cx-space>
                  <cx-button variant="text" @click=${this.loadMore}>
                    <cx-icon name="add" slot="prefix"></cx-icon>
                    ${this.localize.term('more')}
                  </cx-button>
                </cx-space>
              `,
              () => nothing)}
          </cx-tree>
        </cx-space>
      </cx-details>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'cx-content-browser-control-filter-facet': CxContentBrowserControlFilterFacet;
  }
}
