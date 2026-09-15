import '@lit-labs/virtualizer';

import { html, nothing } from 'lit';
import { property, query, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { repeat } from 'lit/directives/repeat.js';
import { styleMap } from 'lit/directives/style-map.js';
import { when } from 'lit/directives/when.js';
import _debounce from 'lodash-es/debounce';

import CortexElement from '@/base/element';
import componentStyles from '@/styles/component.styles';
import { Asset } from '@/types/asset';
import { type CtaTextTransform, TableColumn } from '@/types/content-browser';
import { watch } from '@/utils/watch';
import CxButton from '@orangelogic/design-system/components/button';
import CxLineClamp from '@orangelogic/design-system/components/line-clamp';
import CxProgressBar from '@orangelogic/design-system/components/progress-bar';
import CxResizeObserver from '@orangelogic/design-system/components/resize-observer';
import CxTypography from '@orangelogic/design-system/components/typography';
import { customElement, LocalizeController } from '@orangelogic/design-system/utils';

import ScrollAnchorController from '../content-browser-grid/scroll-anchor-controller';
import CxContentBrowserNoResult from '../content-browser-no-result/content-browser-no-result';
import styles from './content-browser-table.styles';

import type { CxResizeEvent } from '@/events';
import type { CSSResultGroup } from 'lit';

export const ROW_HEIGHT = 40;

/**
 * The action column is an explicit track, not an implicit one. Left implicit, the grid sizes it
 * from content *after* distributing free space, so a host's fractional track (`minmax(0, 2fr)` on
 * Title) is computed against a width the button then eats into and the last text column is clipped.
 * `max-content` is stable across rows because every row's button carries the same label.
 */
export const ACTION_COLUMN_TRACK = 'max-content';

/**
 * Column values ride on the asset under the Cortex field name as requested (see `apiGetAssets`),
 * which `Asset` cannot declare because the field set is the host's, not the SDK's.
 */
export function readCellValue(asset: Asset, field: string): string {
  const value = (asset as unknown as Record<string, unknown>)[field];

  if (value === undefined || value === null || typeof value === 'object') {
    return '';
  }

  return String(value);
}

/**
 * @summary Table layout for the Content Browser: one row per asset, host-configured metadata columns
 * instead of a thumbnail.
 *
 * @description Renders the same asset list the grid does and emits the same item events, so an asset
 * with no rendition — a text fragment, `digitized = 0` — is browsable and selectable by its
 * identifying fields. It fetches nothing of its own: a row exists, and a cell has a value, only
 * because the search response the grid also consumes carried it.
 *
 * @event cx-content-browser-grid-click - Emitted when a row is activated by click or keyboard.
 * @event cx-content-browser-grid-resize - Emitted with the visible row count so the host can grow the page size.
 * @event cx-content-browser-grid-scroll-end - Emitted when the row list is scrolled to the end.
 */
@customElement('cx-content-browser-table')
export default class CxContentBrowserTable extends CortexElement {
  static readonly styles: CSSResultGroup = [componentStyles, styles];

  static readonly dependencies = {
    'cx-button': CxButton,
    'cx-content-browser-no-result': CxContentBrowserNoResult,
    'cx-line-clamp': CxLineClamp,
    'cx-progress-bar': CxProgressBar,
    'cx-resize-observer': CxResizeObserver,
    'cx-typography': CxTypography,
  };

  private readonly localize = new LocalizeController(this);

  @query('.content-browser-table')
  private readonly containerEl: HTMLDivElement;

  @query('lit-virtualizer')
  private readonly virtualizerEl: HTMLElement;

  @query('.content-browser-table__header')
  private readonly headerEl: HTMLDivElement;

  @property({ attribute: 'assets', reflect: false, type: Array })
  assets: Asset[] = [];

  @property({ attribute: 'columns', reflect: false, type: Array })
  columns: TableColumn[] = [];

  @property({ attribute: 'cta-text', reflect: false, type: String })
  ctaText: string = '';

  @property({ attribute: 'cta-text-transform', reflect: false, type: String })
  ctaTextTransform: CtaTextTransform = 'capitalize';

  @property({ attribute: 'empty', reflect: true, type: Boolean })
  empty: boolean = false;

  @property({ attribute: 'has-more', reflect: true, type: Boolean })
  hasMore: boolean = false;

  @property({ attribute: 'loading', reflect: true, type: Boolean })
  loading: boolean = false;

  @property({ attribute: 'selected-asset-id', reflect: true, type: String })
  selectedAssetId: string | undefined = undefined;

  @state()
  assetMap: Map<string, Asset> = new Map();

  #lastHeight = 0;

  private readonly scrollAnchorController = new ScrollAnchorController(this, {
    getContainer: () => this.virtualizerEl,
    getItemIndexById: (id) => this.assets.findIndex((asset) => asset.id === id),
    itemSelector: '.content-browser-table__row',
  });

  constructor() {
    super();

    // Rows are rendered by lit-virtualizer, not by this element's own template, so Lit does not bind
    // these to the host for us.
    this.handleRowClick = this.handleRowClick.bind(this);
    this.handleActionClick = this.handleActionClick.bind(this);
    this.handleRowKeyDown = this.handleRowKeyDown.bind(this);
  }

  private get templateColumns(): string {
    const columns = this.columns.map((column) => column.width ?? 'minmax(0, 1fr)');

    return [...columns, ACTION_COLUMN_TRACK].join(' ');
  }

  #gutterObserver: ResizeObserver | undefined;

  #observedScroller: HTMLElement | undefined;

  private syncScrollbarGutter() {
    if (!this.virtualizerEl || !this.headerEl) {
      return;
    }

    const gutter = this.virtualizerEl.offsetWidth - this.virtualizerEl.clientWidth;

    this.headerEl.style.paddingInlineEnd = `calc(var(--cx-spacing-medium) + ${gutter}px)`;
  }

  updated() {
    // The scroller gains its scrollbar only once rows are laid out, which is after this update
    // completes -- measuring here alone would always read the empty-list gutter of 0. The empty
    // state and the scroller are separate template branches, so the element is replaced whenever
    // the list flips between them and the observer has to follow it.
    if (this.virtualizerEl !== this.#observedScroller) {
      this.#gutterObserver?.disconnect();
      this.#observedScroller = this.virtualizerEl;

      if (this.virtualizerEl) {
        this.#gutterObserver ??= new ResizeObserver(() => this.syncScrollbarGutter());
        this.#gutterObserver.observe(this.virtualizerEl);
      }
    }

    this.syncScrollbarGutter();
  }

  disconnectedCallback() {
    super.disconnectedCallback();

    this.#gutterObserver?.disconnect();
    this.#gutterObserver = undefined;
    this.#observedScroller = undefined;
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

    this.scrollAnchorController.capture();
    this.debouncedCalculatePageSize(entries[0].contentRect.height);
  }

  private readonly debouncedCalculatePageSize = _debounce(this.calculatePageSize, 200);

  private calculatePageSize(height: number) {
    if (Math.abs(this.#lastHeight - height) < 10) {
      return;
    }

    this.#lastHeight = height;

    // One asset per row, so the grid's column/row contract degenerates to a single column and the
    // host's page-size maths stays the same in both views.
    this.scrollAnchorController.setLayoutMetrics({
      columnCount: 1,
      itemHeight: ROW_HEIGHT,
    });

    this.emit('cx-content-browser-grid-resize', {
      detail: {
        columnCount: 1,
        rowCount: Math.ceil(height / ROW_HEIGHT),
      },
    });

    this.scrollAnchorController.scheduleRestore();
  }

  private selectRow(assetId: string) {
    if (!assetId || this.assetMap.get(assetId)?.inColdStorage) {
      return;
    }

    this.emit('cx-content-browser-grid-click', {
      detail: {
        id: assetId,
      },
    });
  }

  private handleRowClick(event: MouseEvent) {
    this.selectRow((event.currentTarget as HTMLElement).dataset.id ?? '');
  }

  private handleActionClick(event: MouseEvent) {
    // The row is also clickable, so let the button own the activation rather than firing twice.
    event.stopPropagation();
    this.selectRow((event.currentTarget as HTMLElement).dataset.id ?? '');
  }

  private handleRowKeyDown(event: KeyboardEvent) {
    if (event.key !== 'Enter' && event.key !== ' ') {
      return;
    }

    event.preventDefault();
    this.selectRow((event.currentTarget as HTMLElement).dataset.id ?? '');
  }

  /**
   * @param assetId - omitted for the header's sizing twin, which is inert and never announced.
   */
  private renderActionButton(assetId: string | undefined) {
    const isPlaceholder = assetId === undefined;

    return html`
      <cx-button
        class=${classMap({
          'content-browser-table__action': true,
          'content-browser-table__action--placeholder': isPlaceholder,
        })}
        data-id=${ifDefined(assetId)}
        size="small"
        variant="primary"
        tabindex="-1"
        aria-hidden=${isPlaceholder ? 'true' : 'false'}
        @click=${isPlaceholder ? nothing : this.handleActionClick}
      >
        <span style=${styleMap({ textTransform: this.ctaTextTransform })}>
          ${this.ctaText || this.localize.term('insert')}
        </span>
      </cx-button>
    `;
  }

  /**
   * Bound fresh on every render at the call site, deliberately. `lit-virtualizer` re-runs this only
   * when `items` or `renderItem` change identity, and the selected id lives on neither — with a
   * stable reference the rows keep their first render and the selected row is never marked. A new
   * `items` array alone does not do it; the function identity is what the virtualizer acts on.
   */
  private renderRow(asset: Asset) {
    // The virtualizer can still ask for an index the shrunken item list no longer has.
    if (!asset) {
      return nothing;
    }

    return html`
      <div
        class=${classMap({
          'content-browser-table__row': true,
          'content-browser-table__row--disabled': Boolean(asset.inColdStorage),
          'content-browser-table__row--selected': asset.id === this.selectedAssetId,
        })}
        data-id=${asset.id}
        role="row"
        tabindex=${asset.inColdStorage ? -1 : 0}
        aria-selected=${asset.id === this.selectedAssetId}
        style=${styleMap({
          'grid-template-columns': this.templateColumns,
          'min-height': `${ROW_HEIGHT}px`,
        })}
        @click=${this.handleRowClick}
        @keydown=${this.handleRowKeyDown}
      >
        ${repeat(this.columns,
          (column) => column.field,
          (column) => html`
            <div
              class=${classMap({
                'content-browser-table__cell': true,
                [`content-browser-table__cell--${column.align}`]: Boolean(column.align),
              })}
              role="cell"
            >
              <cx-line-clamp lines=${column.lines ?? 1}>
                <cx-typography variant="body3">${readCellValue(asset, column.field)}</cx-typography>
              </cx-line-clamp>
            </div>
          `,
        )}
        <div class="content-browser-table__cell content-browser-table__cell--action" role="cell">
          ${this.renderActionButton(asset.id)}
        </div>
      </div>
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
        class="content-browser-table-loading"
        style=${styleMap({
          opacity: this.loading ? 1 : 0,
        })}
      >
        <cx-progress-bar indeterminate></cx-progress-bar>
      </div>
      <cx-resize-observer @cx-resize=${this.handleResize}>
        <div class="content-browser-table" role="table">
          <div class="content-browser-table__head" role="rowgroup">
            <div
              class="content-browser-table__header"
              role="row"
              style=${styleMap({ 'grid-template-columns': this.templateColumns })}
            >
              ${repeat(this.columns,
                (column) => column.field,
                (column) => html`
                  <div
                    class=${classMap({
                      'content-browser-table__cell': true,
                      [`content-browser-table__cell--${column.align}`]: Boolean(column.align),
                    })}
                    role="columnheader"
                  >
                    <cx-line-clamp lines="1">
                      <cx-typography variant="small">${column.title}</cx-typography>
                    </cx-line-clamp>
                  </div>
                `,
              )}
              <div
                class="content-browser-table__cell content-browser-table__cell--action"
                role="columnheader"
                aria-label=${this.ctaText || this.localize.term('insert')}
              >
                ${this.renderActionButton(undefined)}
              </div>
            </div>
          </div>
          ${when(this.empty,
            () => html`
              <cx-content-browser-no-result
                class="content-browser-table__empty"
                icon="search_off"
                message=${this.localize.term('noResults')}
              ></cx-content-browser-no-result>
            `,
            () => html`
              <lit-virtualizer
                class="content-browser-table__body"
                role="rowgroup"
                scroller
                style=${styleMap({
                  'overflow-x': 'hidden',
                })}
                .items=${this.assets}
                .renderItem=${(asset: Asset) => this.renderRow(asset)}
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
    'cx-content-browser-table': CxContentBrowserTable;
  }
}
