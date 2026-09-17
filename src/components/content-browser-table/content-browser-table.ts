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

/** Narrow enough to be a deliberate choice, wide enough that a column never becomes a sliver. */
export const MIN_COLUMN_WIDTH = 48;

/**
 * The widest a column may be dragged. The table scrolls horizontally, so there is no layout-derived
 * maximum any more, but a bound is still needed twice over: a stray pointer event must not be able
 * to produce an absurd track, and the separator has to report a real `aria-valuemax`. Fixed rather
 * than measured, so the range is a constant and render costs no layout read.
 */
export const MAX_COLUMN_WIDTH = 2000;

/** Keyboard resize step, in pixels; Shift takes the larger one. */
export const COLUMN_RESIZE_STEP = 8;
export const COLUMN_RESIZE_STEP_LARGE = 32;

/**
 * The header and the virtualized rows are separate grids that must always resolve the same track
 * list. Publishing it as one custom property on the host keeps them in step, and lets a drag
 * repaint by writing a single property instead of re-rendering every visible row.
 */
export const TABLE_COLUMNS_PROPERTY = '--cx-content-browser-table-columns';

/** A track that takes a share of the free space: a bare `<flex>`, or a `minmax()` whose max is one. */
const FLEX_TRACK = /^\d*\.?\d+fr$/i;
const MINMAX_TRACK = /^minmax\(\s*(.+?)\s*,\s*(.+?)\s*\)$/i;
/** Minimums that measure cells which clip to nothing, so they are floors in name only. */
const COLLAPSIBLE_MINIMUM = /^(auto|min-content)$/i;
const PIXEL_MINIMUM = /^(\d*\.?\d+)(px)?$/i;

/**
 * Raises a flexible track's base size to `MIN_COLUMN_WIDTH`.
 *
 * `min-width: min-content` on the grids is what carries the table past its scrollport, but it also
 * means the grid is sized under a min-content constraint, and a flexible track resolves to its
 * *base* size under one. `minmax(0, 1fr)` has a base size of 0, so every flexible column collapsed
 * the moment the table overflowed: its title and cells clipped away and its resize handle trapped
 * inside a zero-width clipping cell, where the pointer cannot reach it to drag the column back.
 * Flooring the base at the width a drag already refuses to go below keeps the column reachable, and
 * covers a host-authored `minmax(0, 2fr)` or bare `2fr` the same way it covers the default.
 */
export function floorFlexibleTrack(track: string): string {
  const authored = track.trim();
  const minmax = MINMAX_TRACK.exec(authored);

  if (!minmax) {
    return FLEX_TRACK.test(authored) ? `minmax(${MIN_COLUMN_WIDTH}px, ${authored})` : authored;
  }

  const [, minimum, maximum] = minmax;

  if (!FLEX_TRACK.test(maximum)) {
    return authored;
  }

  const pixels = PIXEL_MINIMUM.exec(minimum);
  // A minimum the host authored for itself stands, unless it is one the grid can still collapse.
  const collapsible = COLLAPSIBLE_MINIMUM.test(minimum)
    || (pixels !== null && Number.parseFloat(pixels[1]) < MIN_COLUMN_WIDTH);

  return collapsible ? `minmax(${MIN_COLUMN_WIDTH}px, ${maximum})` : authored;
}

/**
 * A column's `field` is the host's own string. In a plain object literal one named after an
 * `Object.prototype` member (`toString`, `constructor`) reads back the inherited function instead of
 * `undefined`, and a stringified function in the track list invalidates `grid-template-columns` for
 * the header and every row.
 */
function createColumnWidths(entries: readonly (readonly [string, number])[] = []): Record<string, number> {
  return Object.assign(Object.create(null) as Record<string, number>, Object.fromEntries(entries));
}

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
 * @event cx-content-browser-table-column-resize - Emitted when a column settles on a new width: a
 * drag released, a keyboard step, or a reset by double click or Home. `detail.width` is the pixel
 * width, or `undefined` when the column was reset to the track the host configured. Resized widths
 * are session-only -- the SDK has no storage that survives a reload -- so this event is the host's
 * only chance to persist them.
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

  @query('.content-browser-table__head')
  private readonly headEl: HTMLElement;

  @query('lit-virtualizer')
  private readonly bodyEl: HTMLElement & { layoutComplete?: Promise<unknown> };

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

  /**
   * The asset whose insert is still running, so its row keeps the CTA on screen and spinning.
   */
  // Set by the host component as a property; an attribute round trip would turn undefined into null.
  @property({ attribute: false })
  busyAssetId: string | undefined = undefined;

  @state()
  assetMap: Map<string, Asset> = new Map();

  /** Widths the user has dragged, in pixels, keyed by the column's Cortex field. */
  @state()
  private columnWidths: Record<string, number> = createColumnWidths();

  #lastHeight = 0;

  #lastScrollTop = 0;

  private readonly scrollAnchorController = new ScrollAnchorController(this, {
    // The rows scroll inside the table container, not inside the virtualizer, so that is the
    // element whose scroll offset an anchor has to be captured against and restored on.
    getContainer: () => this.containerEl,
    // The sticky header is the container's first in-flow child, so row 0 starts below it rather
    // than at the content origin. Measured rather than a constant: the height is whatever the
    // host's tokens and column titles resolve to.
    getContentOffset: () => this.headEl?.getBoundingClientRect().height ?? 0,
    getItemIndexById: (id) => this.assets.findIndex((asset) => asset.id === id),
    // The container is a plain div, so it has no `layoutComplete` of its own; the virtualizer still
    // has to have laid the rows out before a restore can land on one.
    getLayoutSource: () => this.bodyEl,
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

  /** One authored track per configured column, in order. The action track is not one of them. */
  private buildColumnTracks(widths: Record<string, number>): string[] {
    return this.columns.map((column) => {
      const resized = widths[column.field];

      return resized === undefined ? floorFlexibleTrack(column.width ?? 'minmax(0, 1fr)') : `${resized}px`;
    });
  }

  private buildTemplateColumns(widths: Record<string, number>): string {
    return [...this.buildColumnTracks(widths), ACTION_COLUMN_TRACK].join(' ');
  }

  private get templateColumns(): string {
    return this.buildTemplateColumns(this.columnWidths);
  }

  /** Live drag state. Not reactive: a drag repaints by writing the custom property directly. */
  #resize:
    | { field: string; pointerId: number; startWidth: number; startX: number; width: number }
    | undefined;

  /** Bound only when a browser refuses pointer capture; with capture the handle sees the whole drag. */
  #fallbackListeners:
    | {
      onCancel: (event: PointerEvent) => void;
      onMove: (event: PointerEvent) => void;
      onUp: (event: PointerEvent) => void;
      target: Document;
    }
    | undefined;

  private resolveColumnWidth(field: string): number {
    const configured = this.columnWidths[field];

    if (configured !== undefined) {
      return configured;
    }

    // Nothing dragged yet, so the starting point is whatever the configured track resolved to. The
    // handle nested in the cell carries the same data-field, so the columnheader has to be named.
    const cell = this.renderRoot.querySelector<HTMLElement>(
      `.content-browser-table__header [role="columnheader"][data-field="${CSS.escape(field)}"]`,
    );

    // Clamped, not merely rounded: an fr track on a wide viewport resolves wider than the maximum a
    // width may be pinned to, and an unclamped start inverts every gesture made from it -- a 2px
    // nudge, or one ArrowRight, would clamp back to the maximum and persist a column hundreds of
    // pixels narrower than the one the user was pointing at. Rounding is the clamp's job too: an fr
    // track measures fractional, and a keyboard step would compound the fraction on every press.
    return this.clampColumnWidth(cell?.getBoundingClientRect().width ?? MIN_COLUMN_WIDTH);
  }

  private clampColumnWidth(width: number): number {
    // `clientX` is a double, and fractional whenever `devicePixelRatio` is, so the drag delta arrives
    // fractional too -- and this width is both the published track and the number the host persists.
    return Math.round(Math.min(MAX_COLUMN_WIDTH, Math.max(MIN_COLUMN_WIDTH, width)));
  }

  private commitColumnWidth(field: string, width: number | undefined) {
    // The event is the host's persistence trigger, so a width that changes nothing -- a reset of a
    // column that was never resized, a step already at the minimum, a press that never moved -- must
    // not ask it to write.
    if (this.columnWidths[field] === width) {
      return;
    }

    const next = createColumnWidths(Object.entries(this.columnWidths));

    if (width === undefined) {
      delete next[field];
    } else {
      next[field] = width;
    }

    this.columnWidths = next;
    this.emit('cx-content-browser-table-column-resize', { detail: { field, width } });
  }

  /**
   * Kept off the reactive path: its only effect is the cursor, the text selection and the handle
   * colour, while a reactive toggle would rebind `renderItem` and re-render every visible row twice
   * per drag.
   */
  private setResizingClass(active: boolean) {
    this.containerEl?.classList.toggle('content-browser-table--resizing', active);
  }

  private bindFallbackListeners(target: Document) {
    const onMove = (event: PointerEvent) => this.handleResizeMove(event);
    const onUp = (event: PointerEvent) => this.handleResizeEnd(event);
    const onCancel = (event: PointerEvent) => this.handleResizeCancel(event);

    this.#fallbackListeners = { onCancel, onMove, onUp, target };
    target.addEventListener('pointermove', onMove);
    target.addEventListener('pointerup', onUp);
    target.addEventListener('pointercancel', onCancel);
  }

  private releaseFallbackListeners() {
    if (!this.#fallbackListeners) {
      return;
    }

    const { onCancel, onMove, onUp, target } = this.#fallbackListeners;

    target.removeEventListener('pointermove', onMove);
    target.removeEventListener('pointerup', onUp);
    target.removeEventListener('pointercancel', onCancel);
    this.#fallbackListeners = undefined;
  }

  /**
   * With the fallback bound, an event dispatched at the handle reaches the handle's own binding and
   * then the document one, running every terminal handler twice. The fallback owns the whole drag on
   * that path, so the element-level delivery is dropped.
   */
  private isHandledByFallback(event: Event): boolean {
    return this.#fallbackListeners !== undefined && event.currentTarget !== this.#fallbackListeners.target;
  }

  /** Every trace of a drag: the state the track-list publish is gated on, the cursor, the fallback. */
  private endResize() {
    this.#resize = undefined;
    this.releaseFallbackListeners();
    this.setResizingClass(false);
  }

  private handleResizeStart(event: PointerEvent) {
    const handle = event.currentTarget as HTMLElement;
    const field = handle.dataset.field;

    // A secondary pointer, a button other than the primary one, or a second press while a drag is
    // already running would take that drag over and orphan the first pointer's release.
    if (!field || !event.isPrimary || event.button !== 0 || this.#resize) {
      return;
    }

    // Without this the drag selects the header text instead of moving the divider.
    event.preventDefault();

    // preventDefault also suppresses the compatibility mousedown, and with it the focus the press
    // would have given the handle, leaving the arrow keys dead straight after a drag.
    handle.focus();

    const startWidth = this.resolveColumnWidth(field);

    this.#resize = {
      field,
      pointerId: event.pointerId,
      startWidth,
      startX: event.clientX,
      width: startWidth,
    };
    this.setResizingClass(true);

    try {
      // Lets the pointer leave the handle mid-drag. A browser that refuses must not abort the drag.
      handle.setPointerCapture(event.pointerId);
    } catch {
      // Without capture a release off the handle never reaches the handle's own listeners, and the
      // drag would latch: `#resize` set for good, the track-list publish gated on it, the resize
      // cursor and `user-select: none` stuck on.
      this.bindFallbackListeners(handle.ownerDocument);
    }
  }

  /**
   * The track list a running drag owns, built against the columns rendering right now: the committed
   * widths with the drag's own preview over the top. Falls back to the committed list when no drag is
   * running, so one expression covers both.
   */
  private get previewTemplateColumns(): string {
    if (!this.#resize) {
      return this.templateColumns;
    }

    const preview = createColumnWidths(Object.entries(this.columnWidths));

    preview[this.#resize.field] = this.#resize.width;

    return this.buildTemplateColumns(preview);
  }

  /** Repaints the drag with one property write: no re-render, no layout read. */
  private previewColumnWidth(width: number) {
    if (!this.#resize) {
      return;
    }

    this.#resize.width = width;
    this.style.setProperty(TABLE_COLUMNS_PROPERTY, this.previewTemplateColumns);
  }

  private handleResizeMove(event: PointerEvent) {
    if (this.isHandledByFallback(event) || !this.#resize || this.#resize.pointerId !== event.pointerId) {
      return;
    }

    this.previewColumnWidth(this.clampColumnWidth(
      this.#resize.startWidth + (event.clientX - this.#resize.startX),
    ));
  }

  private handleResizeEnd(event: PointerEvent) {
    if (this.isHandledByFallback(event) || !this.#resize || this.#resize.pointerId !== event.pointerId) {
      return;
    }

    const { field, startWidth, width } = this.#resize;

    this.endResize();

    // `handleColumnsChange` can drop the dragged column mid-drag, and committing would write its
    // width straight back in. The drag's preview is still on the host, so put the committed list back.
    if (!this.columns.some((column) => column.field === field)) {
      this.style.setProperty(TABLE_COLUMNS_PROPERTY, this.templateColumns);

      return;
    }

    if (width !== startWidth) {
      this.commitColumnWidth(field, width);

      return;
    }

    // A drag that ended where it began commits nothing, but `handleResizeMove` has already published
    // a fixed px track. Left there the column is pinned with no state behind it: it stops flexing,
    // announces no value, and `Home` and double click are inert because there is nothing to reset.
    this.style.setProperty(TABLE_COLUMNS_PROPERTY, this.templateColumns);
  }

  /**
   * A gesture the user agent took away was never a decision: restore the committed track list and
   * tell the host nothing.
   */
  private handleResizeCancel(event: PointerEvent) {
    if (this.isHandledByFallback(event) || !this.#resize || this.#resize.pointerId !== event.pointerId) {
      return;
    }

    this.endResize();
    this.style.setProperty(TABLE_COLUMNS_PROPERTY, this.templateColumns);
  }

  private handleResizeKeyDown(event: KeyboardEvent) {
    const handle = event.currentTarget as HTMLElement;
    const field = handle.dataset.field;

    if (!field) {
      return;
    }

    if (event.key === 'Home') {
      event.preventDefault();
      this.commitColumnWidth(field, undefined);

      return;
    }

    const step = event.shiftKey ? COLUMN_RESIZE_STEP_LARGE : COLUMN_RESIZE_STEP;
    const delta = event.key === 'ArrowLeft' ? -step : event.key === 'ArrowRight' ? step : 0;

    if (!delta) {
      return;
    }

    event.preventDefault();

    const startWidth = this.resolveColumnWidth(field);
    const width = this.clampColumnWidth(startWidth + delta);

    // A step with nowhere to go is not a decision to pin the column where it already stands. Pinning
    // it would take a column that resolves wider than the maximum down to it -- for a press asking
    // to widen -- and ask the host to persist that.
    if (width === startWidth) {
      return;
    }

    this.commitColumnWidth(field, width);
  }

  private handleResizeReset(event: MouseEvent) {
    const field = (event.currentTarget as HTMLElement).dataset.field;

    if (field) {
      this.commitColumnWidth(field, undefined);
    }
  }

  private renderResizeHandle(column: TableColumn) {
    // The range is the two constants the drag and the keyboard step clamp to -- ARIA defaults a
    // missing maximum to 100, so a value of 200 without one reads as out of range. Only a committed
    // width is announced: resolving one here would cost a layout read per handle on every render,
    // and a column still on its configured track has no value of its own to report.
    const pinned = this.columnWidths[column.field];

    // The handle is a descendant of the columnheader, so the column's own name is already in the
    // accessible context; repeating it as the label announces "Identifier Identifier".
    return html`
      <div
        class="content-browser-table__resize"
        role="separator"
        aria-orientation="vertical"
        aria-label=${this.localize.term('resize')}
        aria-valuemin=${MIN_COLUMN_WIDTH}
        aria-valuemax=${MAX_COLUMN_WIDTH}
        aria-valuenow=${ifDefined(pinned)}
        tabindex="0"
        data-field=${column.field}
        @pointerdown=${this.handleResizeStart}
        @pointermove=${this.handleResizeMove}
        @pointerup=${this.handleResizeEnd}
        @pointercancel=${this.handleResizeCancel}
        @lostpointercapture=${this.handleResizeEnd}
        @dblclick=${this.handleResizeReset}
        @keydown=${this.handleResizeKeyDown}
      ></div>
    `;
  }

  @watch('columns', { waitUntilFirstUpdate: true })
  handleColumnsChange() {
    // A reconfigured column set must not keep dragging widths onto fields that are gone: a rotating
    // column set would otherwise leave one entry behind per field it has ever configured.
    const fields = new Set(this.columns.map((column) => column.field));
    const kept = Object.entries(this.columnWidths).filter(([field]) => fields.has(field));

    if (kept.length !== Object.keys(this.columnWidths).length) {
      this.columnWidths = createColumnWidths(kept);
    }
  }

  updated() {
    // A drag owns the property while it runs, so an unrelated re-render must not reset it to the
    // committed widths -- but it must not leave a stale track list behind either: `columns` can
    // change mid-drag, and the grid would resolve the previous track count against the new cell set.
    this.style.setProperty(TABLE_COLUMNS_PROPERTY, this.previewTemplateColumns);
  }

  disconnectedCallback() {
    super.disconnectedCallback();

    // A teardown mid-drag would otherwise keep `#resize` set, which gates the track-list publish for
    // good, with the resize cursor latched on and the fallback listeners still on the document.
    this.endResize();
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
    const isBusy = !isPlaceholder && assetId === this.busyAssetId;

    return html`
      <cx-button
        class=${classMap({
          'content-browser-table__action': true,
          'content-browser-table__action--busy': isBusy,
          'content-browser-table__action--placeholder': isPlaceholder,
        })}
        data-id=${ifDefined(assetId)}
        size="small"
        variant="primary"
        tabindex="-1"
        ?loading=${isBusy}
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
        aria-current=${asset.id === this.selectedAssetId ? 'true' : 'false'}
        style=${styleMap({
          'min-height': `${ROW_HEIGHT}px`,
        })}
        @click=${this.handleRowClick}
        @keydown=${this.handleRowKeyDown}
      >
        ${repeat(this.columns,
          (column, index) => `${column.field}:${index}`,
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

    // The container scrolls both axes now. Scrolling sideways to reach a widened column leaves every
    // vertical metric exactly where it was, so an unguarded end test stays true and asks the host for
    // another page on a gesture that revealed no rows.
    const scrolledVertically = container.scrollTop !== this.#lastScrollTop;

    this.#lastScrollTop = container.scrollTop;

    if (!scrolledVertically) {
      return;
    }

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
        <div
          class="content-browser-table"
          role="table"
          @scroll=${this.handleScroll}
        >
          <div class="content-browser-table__head" role="rowgroup">
            <div
              class="content-browser-table__header"
              role="row"
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
                    data-field=${column.field}
                  >
                    <cx-line-clamp lines="1">
                      <cx-typography variant="small">${column.title}</cx-typography>
                    </cx-line-clamp>
                    ${this.renderResizeHandle(column)}
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
            // Deliberately not a `scroller`: the table container scrolls both axes, so the
            // virtualizer sizes itself to the whole list and reacts to that ancestor's scrolling.
            // One scrollport is what keeps the header and the rows on one horizontal offset.
            () => html`
              <lit-virtualizer
                class="content-browser-table__body"
                role="rowgroup"
                .items=${this.assets}
                .renderItem=${(asset: Asset) => this.renderRow(asset)}
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
