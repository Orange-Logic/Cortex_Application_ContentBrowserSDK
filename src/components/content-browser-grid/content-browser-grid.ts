import '@lit-labs/virtualizer';

import { html } from 'lit';
import { property, query, state } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import { when } from 'lit/directives/when.js';
import _debounce from 'lodash-es/debounce';

import CortexElement from '@/base/element';
import componentStyles from '@/styles/component.styles';
import { Asset } from '@/types/asset';
import { ASSET_SIZE, GridView } from '@/types/content-browser';
import { watch } from '@/utils/watch';
import { grid } from '@lit-labs/virtualizer/layouts/grid.js';
import CxProgressBar from '@orangelogic/design-system/components/progress-bar';
import CxResizeObserver from '@orangelogic/design-system/components/resize-observer';
import { customElement, LocalizeController } from '@orangelogic/design-system/utils';

import CxContentBrowserAssetCard from '../content-browser-asset-card/content-browser-asset-card';
import CxContentBrowserNoResult from '../content-browser-no-result/content-browser-no-result';
import ScrollAnchorController from './scroll-anchor-controller';
import styles from './content-browser-grid.styles';

import type { CxResizeEvent } from '@/events';
import type { CSSResultGroup } from 'lit';

@customElement('cx-content-browser-grid')
export default class CxContentBrowserGrid extends CortexElement {
  static readonly styles: CSSResultGroup = [componentStyles, styles];

  static readonly dependencies = {
    'cx-content-browser-asset-card': CxContentBrowserAssetCard,
    'cx-content-browser-no-result': CxContentBrowserNoResult,
    'cx-progress-bar': CxProgressBar,
    'cx-resize-observer': CxResizeObserver,
  };

  private readonly localize = new LocalizeController(this);

  @query('.content-browser-grid')
  private readonly containerEl: HTMLDivElement;

  @query('lit-virtualizer')
  private readonly virtualizerEl: HTMLElement;

  @property({ attribute: 'assets', reflect: false, type: Array })
  assets: Asset[] = [];

  @property({ attribute: 'empty', reflect: true, type: Boolean })
  empty: boolean = false;

  @property({ attribute: 'view', reflect: true, type: String })
  view: GridView = GridView.Medium;

  @property({ attribute: 'has-more', reflect: true, type: Boolean })
  hasMore: boolean = false;

  @property({ attribute: 'loading', reflect: true, type: Boolean })
  loading: boolean = false;

  @property({ attribute: 'show-title', reflect: true, type: Boolean })
  showTitle: boolean = true;

  @property({ attribute: 'show-size', reflect: true, type: Boolean })
  showSize: boolean = true;

  @property({ attribute: 'show-dimensions', reflect: true, type: Boolean })
  showDimensions: boolean = true;

  @property({ attribute: 'show-tags', reflect: true, type: Boolean })
  showTags: boolean = false;

  @property({ attribute: 'selected-asset-id', reflect: true, type: String })
  selectedAssetId: string | undefined = undefined;

  @state()
  assetMap: Map<string, Asset> = new Map();

  @state()
  columnWidth: number = 0;

  readonly #gutter = 8;

  #lastHeight = 0;

  #lastWidth = 0;

  private readonly scrollAnchorController = new ScrollAnchorController(this, {
    getContainer: () => this.virtualizerEl,
    getItemIndexById: (id) => this.assets.findIndex((asset) => asset.id === id),
    itemSelector: 'cx-content-browser-asset-card',
  });

  constructor() {
    super();

    this.renderItem = this.renderItem.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  @watch('view', { waitUntilFirstUpdate: true })
  handleViewChange() {
    this.scrollAnchorController.capture();
    this.calculatePageSize(this.#lastWidth, this.#lastHeight, true);
  }

  @watch('assets')
  handleAssetsChange() {
    this.assetMap.clear();
    this.assets.forEach((item) => this.assetMap.set(item.id, item));
    this.scrollAnchorController.scheduleRestore();
  }

  private handleResize(event: CxResizeEvent) {
    event.stopPropagation();

    const entries = event.detail.entries;

    if (entries[0].target !== this.containerEl) {
      return;
    }

    const { height, width } = entries[0].contentRect;

    this.scrollAnchorController.capture();
    this.debouncedCalculatePageSize(width, height);
  }

  private readonly debouncedCalculatePageSize = _debounce(this.calculatePageSize, 200);

  private calculatePageSize(width: number, height: number, force: boolean = false) {
    const lastHeight = this.#lastHeight;
    const lastWidth = this.#lastWidth;

    if (!force && Math.abs(lastHeight - height) < 10 && Math.abs(lastWidth - width) < 10) {
      return;
    }

    this.#lastHeight = height;
    this.#lastWidth = width;

    const { columnCount, rowCount } = this.calculateColumnCount(width, height);
    this.scrollAnchorController.setLayoutMetrics({
      columnCount,
      itemHeight: Math.max(this.columnWidth, 150) + this.#gutter,
    });

    this.emit('cx-content-browser-grid-resize', {
      detail: {
        columnCount,
        rowCount,
      },
    });

    this.scrollAnchorController.scheduleRestore();
  }

  private calculateColumnCount(width: number, height?: number) {
    if (width < 100) {
      return {
        columnCount: 0,
        rowCount: 0,
      };
    }

    // Use virtualizer's clientWidth to account for vertical scrollbar taking space
    const effectiveWidth = this.virtualizerEl?.clientWidth || width;

    const breakPoint = ASSET_SIZE[this.view]?.minWidth || ASSET_SIZE[GridView.Large].minWidth;
    const columnCount = Math.max(1, Math.floor((effectiveWidth + this.#gutter) / (breakPoint + this.#gutter)));

    let rowCount = 0;

    if (height) {
      rowCount = Math.ceil(height / (breakPoint + this.#gutter));
    }

    const newColumnWidth = Math.floor((effectiveWidth - this.#gutter * (columnCount + 1)) / columnCount);

    if (newColumnWidth !== this.columnWidth) {
      this.columnWidth = newColumnWidth;
    }

    return {
      columnCount,
      rowCount,
    };
  }

  private handleClick(event: MouseEvent) {
    const target = event.target as CxContentBrowserAssetCard;
    const assetId = target.assetId;

    if (!assetId) {
      return;
    }

    if (this.assetMap.get(assetId)?.inColdStorage) {
      return;
    }

    this.emit('cx-content-browser-grid-click', {
      detail: {
        id: assetId,
      },
    });
  }

  private renderItem(asset: Asset) {
    return html`
      <cx-content-browser-asset-card
        data-id=${asset.id}
        asset-id=${asset.id}
        asset-name=${asset.name}
        asset-size=${asset.size}
        asset-width=${asset.width}
        asset-height=${asset.height}
        image-url=${asset.imageUrl}
        original-url=${asset.originalUrl}
        scrub-url=${asset.scrubUrl}
        doc-type=${asset.docType}
        extension=${asset.extension}
        ?selected=${asset.id === this.selectedAssetId}
        ?show-title=${this.showTitle}
        ?show-size=${this.showSize}
        ?show-dimensions=${this.showDimensions}
        ?show-tags=${this.showTags}
        ?in-cold-storage=${asset.inColdStorage}
        @click=${this.handleClick}
      ></cx-content-browser-asset-card>
    `;
  }

  private handleScroll(event: Event) {
    const container = event.target as HTMLDivElement;

    this.scrollAnchorController.capture(container);

    if (container.scrollTop + container.clientHeight >= container.scrollHeight - 10) {
      this.debouncedHandleScrollEnd();
    }
  }

  private readonly debouncedHandleScrollEnd = _debounce(this.handleScrollEnd, 200);

  private handleScrollEnd() {
    if (this.hasMore) {
      this.emit('cx-content-browser-grid-scroll-end');
    }
  }

  render() {
    return html`
        <div
          class="content-browser-grid-loading"
          style=${styleMap({
            opacity: this.loading ? 1 : 0,
            padding: `0 ${this.#gutter * 2}px ${this.#gutter}px`,
          })}
        >
          <cx-progress-bar indeterminate></cx-progress-bar>
        </div>
      <cx-resize-observer @cx-resize=${this.handleResize}>
        <div class="content-browser-grid">
          ${when(this.empty,
            () => html`
              <cx-content-browser-no-result
                class="content-browser-grid__empty"
                icon="search_off"
                message=${this.localize.term('noResults')}
              ></cx-content-browser-no-result>
            `,
            () => html`
              <lit-virtualizer
                scroller
                style=${styleMap({
                  height: '100%',
                  'overflow-x': 'hidden',
                })}
                .layout=${grid({
                  gap: `${this.#gutter}px`,
                  itemSize: {
                    height: `${Math.max(this.columnWidth, 150)}px`,
                    width: `${this.columnWidth}px`,
                  },
                  flex: { preserve: 'aspect-ratio' },
                })}
                .items=${this.assets}
                .renderItem=${this.renderItem}
                @scroll=${this.handleScroll}
              ></lit-virtualizer>
            `,
          )}
        </div>
      </cx-resize-observer>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'cx-content-browser-grid': CxContentBrowserGrid;
  }
}
