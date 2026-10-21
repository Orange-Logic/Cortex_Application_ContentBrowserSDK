import { html, type PropertyValues } from 'lit';
import { property, query } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import { when } from 'lit/directives/when.js';
import _debounce from 'lodash-es/debounce';

import CortexElement from '@/base/element';
import componentStyles from '@/styles/component.styles';
import { Asset } from '@/types/asset';
import { type CtaTextTransform, TableColumn, type TableRowActionPosition } from '@/types/content-browser';
import { watch } from '@/utils/watch';
/*
 * No published design-system version has a `components/table` entry. `cx-table` is defined by the
 * shared chunk this entry loads, so the import is what registers it (L-42BGNS 1a). Swap it for a
 * table entry once the design system publishes one.
 */
import CxButton from '@orangelogic/design-system/components/button';
import CxColorSwatchGroup from '@orangelogic/design-system/components/color-swatch-group';
import CxLineClamp from '@orangelogic/design-system/components/line-clamp';
import CxProgressBar from '@orangelogic/design-system/components/progress-bar';
import CxResizeObserver from '@orangelogic/design-system/components/resize-observer';
import { customElement, LocalizeController } from '@orangelogic/design-system/utils';

import CxContentBrowserNoResult from '../content-browser-no-result/content-browser-no-result';
import { layoutColumnWidths, measureTextWidth, MIN_COLUMN_WIDTH } from './column-layout';
import styles from './content-browser-table.styles';

import type { CxResizeEvent } from '@/events';
import type { CSSResultGroup } from 'lit';

const CxTable = CxColorSwatchGroup.dependencies['cx-table'];

type CxButtonElement = InstanceType<typeof CxButton>;
type CxTableElement = InstanceType<typeof CxTable>;
type Tabulator = NonNullable<CxTableElement['tabulatorInstance']>;
type TableColumnDefinition = NonNullable<CxTableElement['columns']>[number];

/** `cx-table` re-emits a Tabulator event as `cx-table.<name>`, carrying the listener's arguments. */
type TabulatorEvent<T extends unknown[]> = CustomEvent<{ args: T }>;

type TabulatorCell = {
  getElement(): HTMLElement | null;
  getRow(): { getData(): Record<string, unknown>; getElement(): HTMLElement };
  getValue(): unknown;
};

type TabulatorColumn = {
  getDefinition(): TableColumnDefinition;
  getElement(): HTMLElement;
  getField(): string;
  getWidth(): number;
  hide(): void;
  isVisible(): boolean;
  setWidth(width: number): Promise<unknown>;
  show(): Promise<void>;
};

/** What a title formatter receives in place of a cell. */
type TabulatorHeaderCell = {
  getColumn(): TabulatorColumn;
};

type TabulatorRow = {
  getData(): Record<string, unknown>;
  getElement(): HTMLElement;
};

/** A row's CTA button and what it is painted from. */
type RowCta = {
  assetId: string;
  button: CxButtonElement;
  container: HTMLDivElement;
  label: HTMLSpanElement;
  rowElement: HTMLElement;
};

/** `cx-table`'s own row height, the one every other Cortex table renders at. */
export const ROW_HEIGHT = 48;

/** Kept here too, so the old import path of the column floor stays valid. */
export { MIN_COLUMN_WIDTH };

/** An invisible column keeps Tabulator rows present when every data column is hidden. */
export const FILLER_FIELD = 'filler';

/** A small buffer keeps the final resize handle clear of the frame and scrollbar. */
const RESIZE_BUFFER_WIDTH = 6;

/**
 * `(hover: none)` reads only the primary input: a phone shows every CTA at rest, and a touch laptop
 * shows them on hover as any laptop does. At rest, a CTA covers the end of the last column.
 */
const NO_HOVER_QUERIES = ['(hover: none)'];

/*
 * Constants rather than literals in the template: `cx-table` rebuilds its whole Tabulator instance
 * whenever `columnDefaults` changes identity, and a literal is a new object on every render.
 */
const COLUMN_DEFAULTS: Partial<TableColumnDefinition> = {
  headerSort: false,
  resizable: true,
};

/** The fonts and the horizontal padding that the auto-fit measures a column with. */
type ColumnMetrics = { cellFont: string; headerFont: string; padding: number };

/**
 * The font of an element as a canvas font string. Not the `font` shorthand: Chromium gives `''` for
 * it when a font sub-property, such as `font-variant-numeric: tabular-nums`, cannot go into it.
 */
function canvasFont(element: Element): string {
  const { fontFamily, fontSize, fontStyle, fontWeight } = getComputedStyle(element);

  return `${fontStyle} ${fontWeight} ${fontSize} ${fontFamily}`;
}

/** The left and right padding and border of an element: the width its box adds around its content. */
function horizontalPadding(element: Element): number {
  const style = getComputedStyle(element);

  return (Number.parseFloat(style.paddingLeft) || 0) + (Number.parseFloat(style.paddingRight) || 0)
    + (Number.parseFloat(style.borderLeftWidth) || 0) + (Number.parseFloat(style.borderRightWidth) || 0);
}

/**
 * Column values ride on the asset under the Cortex field name as requested (see `apiGetAssets`),
 * which `Asset` cannot declare because the field set is the host's, not the SDK's. Read as an own
 * property: a field named after an `Object.prototype` member (`toString`, `constructor`) would
 * otherwise read back the inherited function.
 */
export function readCellValue(asset: Asset, field: string): string {
  if (!Object.prototype.hasOwnProperty.call(asset, field)) {
    return '';
  }

  const value = (asset as unknown as Record<string, unknown>)[field];

  if (value === undefined || value === null || typeof value === 'object') {
    return '';
  }

  return String(value);
}

/** A value the column definitions depend on, so they are rebuilt only when the host's columns change. */
function columnsSignature(columns: TableColumn[]): string {
  return JSON.stringify(columns.map(({ field, title }) => [field, title]));
}

/**
 * A page appended to a list: `next` starts with every asset of a non-empty `previous`, as the same
 * objects in the same order, and holds more. A refetch brings new objects, which can carry new values.
 */
function isAppendOf(previous: Asset[], next: Asset[]): boolean {
  return previous.length > 0
    && next.length > previous.length
    && previous.every((asset, index) => next[index] === asset);
}

function renderCellContent(value: string, inColdStorage: boolean): HTMLElement {
  // Built as an element with text content, never as a string: Tabulator inserts a formatter's string
  // as HTML, and these values are the DAM's own metadata. A clamp at one line too, as `cx-table`
  // clamps its own cells and headers: a Tabulator cell neither clips nor ellipsizes what overflows it.
  const content = document.createElement('cx-line-clamp');

  content.setAttribute('lines', '1');

  // A hover shows the full value of a clipped cell or header.
  if (value) {
    content.title = value;
  }

  if (inColdStorage) {
    content.style.opacity = '0.5';
  }

  content.textContent = value;

  return content;
}

/**
 * @summary Table layout for the Content Browser: one row per asset, host-configured metadata columns
 * instead of a thumbnail, rendered by the design system's `cx-table`.
 *
 * @description Renders the same asset list the grid does and emits the same item events, so an asset
 * with no rendition — a text fragment, `digitized = 0` — is browsable and selectable by its
 * identifying fields. It fetches nothing of its own: a row exists, and a cell has a value, only
 * because the search response the grid also consumes carried it.
 *
 * @event cx-content-browser-grid-click - Emitted when a row's CTA button is activated, by a click or
 * from the keyboard: once for a double click on it, and never for a click or a double click on the
 * row itself.
 * @event cx-content-browser-grid-resize - Emitted when the number of rows the visible scrollport can
 * show changes, and again once a restarted list's rows are in, so the host can grow the page size.
 * A count measured while a page of the shown list loads is emitted once the load ends and any
 * rows it brings are in. A count measured after the load ends is emitted at once, and it can come
 * before the rows of a new list are in.
 * @event cx-content-browser-grid-scroll-end - Emitted while `has-more` is set, no page is loading, and
 * the last row comes into view: by scrolling the table's own scrollport, or by scrolling the page when
 * a table taller than the viewport holds its rows without overflowing and so never scrolls itself.
 * @event cx-content-browser-table-column-resize - Emitted when a host-configured column settles on a
 * new width: a drag of its divider released (`detail.reset` is `false`), or a double click on the
 * divider that removes the saved width and auto-fits the column (`detail.reset` is `true`). The
 * filler and the row action have no divider. `detail.width` is the column's width in whole pixels,
 * and is never `undefined`. The SDK saves the width itself.
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
    'cx-table': CxTable,
  };

  private readonly localize = new LocalizeController(this);

  @query('.content-browser-table')
  private readonly containerEl: HTMLDivElement;

  @query('cx-table')
  private readonly tableEl: CxTableElement | null;

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

  /**
   * Fields of `columns`, compared exactly, whose columns the table does not show. A hidden column
   * keeps its place, its cell values and a dragged width, so it comes back with the rows and the
   * scroll position unchanged. The filler and the row action remain when every host column is hidden.
   */
  @property({ attribute: false })
  hiddenFields: string[] = [];

  /**
   * The widths that the user saved, in pixels, keyed by the trimmed `field`. A column with a saved
   * width shows at that width. The other columns auto-fit to their content. A new map replaces the
   * old one, the drags and resets in memory included.
   */
  @property({ attribute: false })
  savedWidths: Record<string, number> = {};

  /**
   * The owner of `savedWidths`, such as the Cortex site. A new value drops the widths that a drag
   * held for the session. A new `savedWidths` for the same owner keeps them.
   */
  @property({ attribute: false })
  widthScope: string | undefined = undefined;

  /**
   * Where the row action shows: at the right edge of the host (`host-edge`), or at the end of the
   * last data column (`row-end`).
   */
  @property({ attribute: 'row-action-position', reflect: true })
  rowActionPosition: TableRowActionPosition = 'host-edge';

  assetMap: Map<string, Asset> = new Map();

  #columnDefinitions: TableColumnDefinition[] = [];

  #columnsSignature = '';

  /**
   * Tabulator reads a dotted `field` as a nested path, and every Cortex field name is dotted
   * (`CoreField.Identifier`), so a row stores each value under a key of its own. A key stays with its
   * host column across column changes: `cx-table` lays the rows it holds out under the new columns at
   * once, and the rebuilt rows land only once `setData` has waited out its debounce.
   */
  #columnKeys = new Map<string, string>();

  /** A new column set can bring a field the rows hold no value for, so every row is rebuilt. */
  #rowsNeedRebuild = false;

  /** The row keys every row the built table holds carries a value under. */
  #heldRowKeys = new Set<string>();

  /**
   * Widths the user has settled a column on, in pixels, keyed by the trimmed host field: new
   * definitions reach Tabulator through `setColumns`, which forgets every width a column was resized
   * to. Each new `savedWidths` replaces it, and a drag or a reset changes it until the next one. It
   * keeps the width of a field the host removes, so the field gets it again when the host adds it back.
   */
  #resizedWidths = new Map<string, number>();

  /**
   * Widths held for the session only, keyed by the trimmed host field: a drag keeps the width of
   * the other auto-fit columns, so they do not take the space the drag frees. Never emitted or
   * saved, so a reload or a new `widthScope` lets those columns fit again.
   */
  #sessionWidths = new Map<string, number>();

  /** Keyed by the row's element, which a row event and a host change can both reach. */
  #ctas = new WeakMap<HTMLElement, RowCta>();

  /**
   * The CTA each current row rendered last, on the page or taken off it: a relabel reaches every one
   * of them without building an element for a row that never rendered.
   */
  #renderedCtas = new Set<RowCta>();

  /** Tabulator formats a row's cells again on a column change, into the same row element. */
  #pointerTrackedRows = new WeakSet<HTMLElement>();

  #hoveredRow: HTMLElement | undefined;

  #focusedCta: RowCta | undefined;

  /** The CTA that held the keyboard focus as Tabulator began to render the rows again. */
  #ctaFocusedAtRender: CxButtonElement | undefined;

  /** Followed while the table is on the page: a mouse or a touch screen that is attached or removed changes them. */
  #noHoverQueries: MediaQueryList[] = [];

  /**
   * A device with no hover, or with a touch screen beside its mouse, has no row hover to show a CTA
   * to a finger, so a tap would press a CTA that the user cannot see. There every CTA stays on
   * screen, and one tap hands its asset over.
   */
  #hasNoHover = false;

  /** The Tabulator instance whose `tableBuilt` has fired: the only one rows may be handed to. */
  #builtTable: Tabulator | undefined;

  /**
   * The assets the built table holds rows for, in order, to tell an appended page from a new list: an
   * appended page keeps these objects, and a refetch brings new ones, which can carry new values.
   */
  #syncedAssets: Asset[] = [];

  /**
   * `setData` applies the list it was last given only once Tabulator's debounce runs out, and then
   * replaces every row: a page appended while one waits would go with the rows it joined.
   */
  #pendingReplaces = 0;

  #lastHeight = 0;

  /** The container's last observed size, in whole pixels. */
  #containerSize: { height: number; width: number } | undefined;

  #lastRowCount: number | undefined;

  /**
   * Set when the table counts the rows its box shows while a page of the shown list loads. Once that
   * load ends and any rows it brings are in, the table counts again and reports a new count.
   */
  #rowCountHeld = false;

  #lastRowObserver: IntersectionObserver | undefined;

  /** The width of the vertical scrollbar that the last auto-fit left space for. */
  #layoutScrollbarWidth = 0;

  /**
   * The natural width of each column at the last full layout, keyed by row key. A relayout for a
   * scrollbar that comes or goes reuses them, so the rows of an appended page are never measured.
   */
  #naturalWidths = new Map<string, number>();

  /** Set when a layout found the table with no width. The next container resize runs it. */
  #layoutPending = false;

  #fontsPending = false;

  #frameWidthObserver: ResizeObserver | undefined;

  private get tabulator(): Tabulator | undefined {
    const instance = this.tableEl?.tabulatorInstance ?? undefined;

    // `cx-table` destroys its instance on disconnect but keeps the reference.
    return instance !== undefined && instance === this.#builtTable && !instance.destroyed ? instance : undefined;
  }

  /** Tabulator's row holder: the one element that scrolls the rows. */
  private get scrollport(): HTMLElement | undefined {
    return this.tabulator?.rowManager?.element ?? undefined;
  }

  /** Each host column's row key, in order: a field the host repeats takes a key per occurrence. */
  private resolveColumnKeys(): string[] {
    const occurrences = new Map<string, number>();

    return this.columns.map(({ field }) => {
      const occurrence = occurrences.get(field) ?? 0;
      const identity = `${field}\u0000${occurrence}`;
      const key = this.#columnKeys.get(identity) ?? `column${this.#columnKeys.size}`;

      occurrences.set(field, occurrence + 1);
      this.#columnKeys.set(identity, key);

      return key;
    });
  }

  private buildColumnDefinitions(): TableColumnDefinition[] {
    return [...this.buildDataColumnDefinitions(), this.buildFillerColumnDefinition()];
  }

  /**
   * A pixel width for each column, so the `fitData` layout never sizes it from its content. The
   * auto-fit sets the real width once the columns are built (see `applyColumnLayout`). Until then a
   * column keeps the width it had in the previous definitions.
   */
  private buildDataColumnDefinitions(): TableColumnDefinition[] {
    const hidden = new Set(this.hiddenFields);
    const keys = this.resolveColumnKeys();
    const previousWidths = new Map(this.#columnDefinitions.map(({ field, width }) => [String(field), width]));

    return this.columns.map((column, index) => {
      const previous = previousWidths.get(keys[index]);

      return {
        field: keys[index],
        formatter: (cell: TabulatorCell) => {
          const row = cell.getRow();
          const inColdStorage = Boolean(row.getData().inColdStorage);

          if (inColdStorage) {
            // No click or insert reaches the host from this row, so it takes no pointer: `cx-table`
            // would otherwise give it the hover highlight and pointer cursor of a clickable row.
            row.getElement().style.pointerEvents = 'none';
          }

          return renderCellContent(String(cell.getValue() ?? ''), inColdStorage);
        },
        // Never `false`: Tabulator awaits a `show()` for it as it builds the header.
        hidden: hidden.has(column.field) || undefined,
        minWidth: MIN_COLUMN_WIDTH,
        title: column.title,
        // A node, as for a cell: `cx-table` parses a title string as HTML.
        titleFormatter: (cell: TabulatorCell) => renderCellContent(String(cell.getValue() ?? ''), false),
        width: this.#resizedWidths.get(column.field.trim())
          ?? this.#sessionWidths.get(column.field.trim())
          ?? (typeof previous === 'number' ? previous : MIN_COLUMN_WIDTH),
      };
    });
  }

  /**
   * Tabulator replaces its rows with a placeholder when no columns remain visible. This invisible
   * column keeps the rows and their actions available when the host hides every data column.
   * Its small, fixed width gives the final resize handle a buffer without a visible empty column.
   */
  private buildFillerColumnDefinition(): TableColumnDefinition {
    return {
      field: FILLER_FIELD,
      formatter: (cell: TabulatorCell) => {
        const element = cell.getElement();

        if (element) {
          // The buffer must keep its width even when the theme adds cell padding.
          element.style.padding = '0';
          element.style.visibility = 'hidden';
          // The pointer lands on the row itself, so the filler has no hover or click of its own.
          element.style.pointerEvents = 'none';
          element.setAttribute('aria-hidden', 'true');
        }

        return '';
      },
      headerSort: false,
      // A column laid out at 0 loses its width style, and renders as wide as its content.
      minWidth: RESIZE_BUFFER_WIDTH,
      resizable: false,
      title: '',
      titleFormatter: (cell: TabulatorHeaderCell) => {
        const header = cell.getColumn().getElement();

        // Out of sight, yet a screen reader reads it as the header of each row's action gridcell.
        header.style.opacity = '0';
        header.style.borderRight = 'none';
        header.style.pointerEvents = 'none';
        header.setAttribute('aria-label', this.ctaLabel);

        return '';
      },
      width: RESIZE_BUFFER_WIDTH,
    };
  }

  private get ctaLabel(): string {
    return this.ctaText || this.localize.term('insert');
  }

  /** The action overlays its row and takes no column width. */
  private renderRowAction(row: TabulatorRow) {
    const data = row.getData();
    const rowElement = row.getElement();
    const previous = this.#ctas.get(rowElement);

    rowElement.part.add('content-browser-row');
    previous?.container.remove();

    if (previous) {
      this.#renderedCtas.delete(previous);
      this.#ctas.delete(rowElement);
    }

    if (data.inColdStorage) {
      rowElement.style.pointerEvents = 'none';
      return;
    }

    rowElement.style.pointerEvents = '';
    const container = document.createElement('div');
    const overlay = document.createElement('div');
    const button = document.createElement('cx-button');
    const label = document.createElement('span');
    const cta: RowCta = { assetId: String(data.id ?? ''), button, container, label, rowElement };

    container.part.add('content-browser-action-anchor');
    container.setAttribute('role', 'gridcell');
    overlay.part.add('content-browser-action');
    overlay.append(button);
    container.append(overlay);
    rowElement.append(container);

    // A click on the row hands nothing over, so the row takes no pointer cursor, which `cx-table`
    // gives every selectable row. The CTA keeps a pointer cursor of its own.
    rowElement.style.cursor = 'default';
    button.classList.add('content-browser-table__cta');
    button.setAttribute('size', 'small');
    button.setAttribute('variant', 'primary');
    // The label supplies the overlay width without a column measurement.
    button.style.width = 'max-content';
    button.style.maxWidth = 'none';
    label.style.whiteSpace = 'nowrap';
    button.append(label);

    button.addEventListener('click', (event) => {
      // The second click of a double click repeats the activation the first one made.
      if (event.detail <= 1) {
        this.insertAsset(cta.assetId);
      }
    });
    button.addEventListener('focusin', () => {
      this.#focusedCta = cta;
      this.paintCta(cta);
    });
    button.addEventListener('focusout', () => {
      if (this.#focusedCta === cta) {
        this.#focusedCta = undefined;
      }

      this.paintCta(cta);
    });

    this.#ctas.set(rowElement, cta);
    this.#renderedCtas.add(cta);
    this.trackPointer(rowElement);
    this.paintCta(cta);
  }

  private isCtaShown(cta: RowCta): boolean {
    return this.#hasNoHover
      || cta.assetId === this.busyAssetId
      || cta.assetId === this.selectedAssetId
      || cta.rowElement === this.#hoveredRow
      // Focus dropped by taking the button off the page need not fire a `focusout`.
      || (cta === this.#focusedCta && cta.button.matches(':focus-within'));
  }

  /** In place, never rebuilt: a new button would drop the keyboard focus the old one held. */
  private paintCta(cta: RowCta) {
    const text = this.ctaLabel;

    if (cta.label.textContent !== text) {
      cta.label.textContent = text;
    }

    cta.label.style.textTransform = this.ctaTextTransform;
    cta.button.loading = cta.assetId === this.busyAssetId;
    // Opacity rather than visibility: a hidden CTA stays in the tab order, where focus reaching it
    // shows it.
    const shown = this.isCtaShown(cta);

    cta.container.style.opacity = shown ? '1' : '0';
    cta.container.style.pointerEvents = shown ? '' : 'none';
  }

  private paintRowCta(rowElement: HTMLElement | undefined) {
    const cta = rowElement ? this.#ctas.get(rowElement) : undefined;

    if (cta) {
      this.paintCta(cta);
    }
  }

  private paintAssetCta(assetId: string | undefined) {
    this.paintRowCta(this.findRow(assetId)?.getElement());
  }

  private trackPointer(rowElement: HTMLElement) {
    if (this.#pointerTrackedRows.has(rowElement)) {
      return;
    }

    this.#pointerTrackedRows.add(rowElement);
    rowElement.addEventListener('mouseenter', () => this.setHoveredRow(rowElement));
    rowElement.addEventListener('mouseleave', () => {
      if (this.#hoveredRow === rowElement) {
        this.setHoveredRow(undefined);
      }
    });
  }

  private setHoveredRow(rowElement: HTMLElement | undefined) {
    const previous = this.#hoveredRow;

    this.#hoveredRow = rowElement;
    this.paintRowCta(previous);
    this.paintRowCta(rowElement);
  }

  /**
   * Tabulator takes a row that scrolls out of its render window off the page, and a row taken off
   * the page gets no `mouseleave` to hide its CTA, nor need its button get a `focusout` for the
   * focus it drops.
   */
  private releaseDetachedCta() {
    if (this.#hoveredRow?.isConnected === false) {
      this.setHoveredRow(undefined);
    }

    const focused = this.#focusedCta;

    if (focused?.button.isConnected === false) {
      this.#focusedCta = undefined;
      this.paintCta(focused);
    }
  }

  /** Lays the columns and the rendered rows out again. */
  private redrawTable() {
    this.tabulator?.redraw();
    this.syncTableFrame();
  }

  /** The frame ends at the data columns. The scrollport remains available to the row actions. */
  private syncTableFrame() {
    const columns = this.tabulator?.getColumns() as TabulatorColumn[] | undefined;
    const widths = columns?.filter((column) => column.getField() !== FILLER_FIELD && column.isVisible())
      .map((column) => column.getWidth()) ?? [];
    // A column with no width yet keeps the empty frame full width until the first layout.
    const width = widths.every((value) => value > 0) ? widths.reduce((total, value) => total + value, 0) : 0;

    this.tableEl?.style.setProperty('--content-browser-table-width', width > 0 ? `${width + RESIZE_BUFFER_WIDTH}px` : '100%');
  }

  /**
   * Tabulator renders the rows again -- for an appended page, a redraw of its own or one of ours --
   * by taking every rendered row off the page and back, which drops the keyboard focus, so the CTA
   * that held it gets it back.
   */
  private handleRenderStarted(event: Event) {
    event.stopPropagation();

    const button = this.#focusedCta?.button;

    this.#ctaFocusedAtRender = button?.matches(':focus-within') ? button : undefined;
  }

  private handleRenderComplete(event: Event) {
    event.stopPropagation();

    // A vertical scrollbar that comes or goes changes the space for the columns.
    if (this.getScrollbarWidth() !== this.#layoutScrollbarWidth) {
      this.applyColumnLayout(false);
    }

    this.syncTableFrame();

    const button = this.#ctaFocusedAtRender;

    this.#ctaFocusedAtRender = undefined;

    if (button?.isConnected && !button.matches(':focus-within')) {
      // Tabulator renders the rows again in place, and its render buffer holds rows off screen: the
      // scroll stays where the user put it.
      button.focus({ preventScroll: true });
    }
  }

  private toRow(asset: Asset, keys: string[]): Record<string, unknown> {
    const row: Record<string, unknown> = {
      id: asset.id,
      inColdStorage: Boolean(asset.inColdStorage),
    };

    this.columns.forEach((column, index) => {
      row[keys[index]] = readCellValue(asset, column.field);
    });

    return row;
  }

  private findRow(assetId: string | undefined): TabulatorRow | undefined {
    if (!assetId) {
      return undefined;
    }

    return (this.tabulator?.getRow(assetId) || undefined) as TabulatorRow | undefined;
  }

  /**
   * `aria-current`, not `aria-selected`: this is a `grid` with no selection model of its own. The
   * row is never selected in Tabulator, so an import does not paint `cx-table`'s selected-row highlight.
   */
  private markCurrentRow(assetId: string | undefined, current: boolean) {
    const row = this.findRow(assetId);

    if (!row) {
      return;
    }

    row.getElement().setAttribute('aria-current', current ? 'true' : 'false');
  }

  /**
   * The fonts and the padding of a rendered header title and data cell. A table with no rendered
   * cell measures the values in the header font, with the header padding.
   */
  private readColumnMetrics(columns: TabulatorColumn[]): ColumnMetrics | undefined {
    const header = columns.map((column) => column.getElement()).find((element) => element.isConnected);
    const title = header?.querySelector('.tabulator-col-title cx-line-clamp')
      ?? header?.querySelector('.tabulator-col-title');

    if (!header || !title) {
      return undefined;
    }

    const headerFont = canvasFont(title);
    const headerContent = header.querySelector('.tabulator-col-content');
    const headerPadding = horizontalPadding(header) + (headerContent ? horizontalPadding(headerContent) : 0)
      + horizontalPadding(title.closest('.tabulator-col-title') ?? title);
    const key = header.getAttribute('tabulator-field') ?? '';
    const cell = this.tableEl?.shadowRoot?.querySelector<HTMLElement>(`.tabulator-row .tabulator-cell[tabulator-field="${key}"]`);
    const text = cell?.querySelector('cx-line-clamp');

    if (!cell || !text) {
      return { cellFont: headerFont, headerFont, padding: headerPadding };
    }

    return { cellFont: canvasFont(text), headerFont, padding: Math.max(headerPadding, horizontalPadding(cell)) };
  }

  private getScrollbarWidth(): number {
    const scrollport = this.tableEl?.tabulatorInstance?.rowManager?.element as HTMLElement | undefined;

    return scrollport ? scrollport.offsetWidth - scrollport.clientWidth : 0;
  }

  /** The widest of the title and the values of the loaded rows, plus the padding. */
  private measureNaturalWidth(column: TableColumn, metrics: ColumnMetrics): number {
    const widest = this.#syncedAssets.reduce(
      (width, asset) => Math.max(width, measureTextWidth(readCellValue(asset, column.field), metrics.cellFont)),
      measureTextWidth(column.title, metrics.headerFont),
    );

    // A sub-pixel border or text width must never clip the widest value, so round the total up.
    return Math.ceil(widest + metrics.padding);
  }

  /**
   * Sets the width of each visible host column: a saved or session width as is, and an auto-fit
   * width for the other columns, inside the width of the table (see `layoutColumnWidths`). A hidden
   * column keeps its width. A table with no width, as one in a hidden panel, keeps its widths until
   * it is shown.
   * @param measure Measure the natural widths again. Leave it false to reuse the natural widths of
   * the last full layout, for a change of the available width only.
   */
  private applyColumnLayout(measure = true) {
    const tabulator = this.tableEl?.tabulatorInstance;
    const element = tabulator && !tabulator.destroyed ? tabulator.element as HTMLElement | undefined : undefined;

    if (!tabulator || !element) {
      return;
    }

    if (element.clientWidth === 0) {
      // A ResizeObserver reports no size for a box that has none, so the table lays out when shown.
      this.#layoutPending ||= measure;
      return;
    }

    if (measure) {
      this.#layoutPending = false;
      this.layoutAgainWhenFontsLoad();
    }

    const hidden = new Set(this.hiddenFields);
    const keys = this.resolveColumnKeys();
    const shown = this.columns.flatMap((column, index) => {
      const tabulatorColumn = hidden.has(column.field) ? false : tabulator.getColumn(keys[index]) as TabulatorColumn | false;

      return tabulatorColumn ? [{ column, key: keys[index], tabulatorColumn }] : [];
    });
    const metrics = this.readColumnMetrics(shown.map(({ tabulatorColumn }) => tabulatorColumn));

    if (!metrics) {
      return;
    }

    const scrollbar = this.getScrollbarWidth();

    this.#layoutScrollbarWidth = scrollbar;
    const widths = layoutColumnWidths(shown.map(({ column, key }) => {
      let natural = measure ? undefined : this.#naturalWidths.get(key);

      if (natural === undefined) {
        natural = this.measureNaturalWidth(column, metrics);
        this.#naturalWidths.set(key, natural);
      }

      return { natural, saved: this.#resizedWidths.get(column.field.trim()) ?? this.#sessionWidths.get(column.field.trim()) };
    }), element.clientWidth - RESIZE_BUFFER_WIDTH - scrollbar);

    shown.forEach(({ key, tabulatorColumn }, index) => {
      const width = widths[index];

      void tabulatorColumn.setWidth(width);
      // `setColumns` and a remount build the columns from the definitions again.
      tabulatorColumn.getDefinition().width = width;

      const definition = this.#columnDefinitions.find(({ field }) => field === key);

      if (definition) {
        definition.width = width;
      }
    });
    this.syncTableFrame();
  }

  /**
   * The canvas measures with a fallback font while a web font loads, so measure again once the fonts
   * are ready. Guarded by one pending wait, and by the connection of the element.
   */
  private layoutAgainWhenFontsLoad() {
    if (this.#fontsPending || document.fonts?.status !== 'loading') {
      return;
    }

    this.#fontsPending = true;
    void document.fonts.ready.then(() => {
      this.#fontsPending = false;

      if (this.isConnected) {
        this.applyColumnLayout();
      }
    });
  }

  private readonly debouncedApplyColumnLayout = _debounce(this.applyColumnLayout, 100);

  /**
   * `content-browser` hands over the whole list on every page, so a list that only grows by a page
   * is appended: reassigning it would call `setData`, which scrolls the table back to the top. Any
   * other list -- a new search, sort, filter or folder, or a refetch that brings the assets the rows
   * show as new objects -- replaces the rows.
   */
  private async syncRows(replace = false) {
    const tabulator = this.tabulator;

    if (!tabulator) {
      return;
    }

    const columnKeys = this.resolveColumnKeys();
    const synced = this.#syncedAssets;
    const isNextPage = !replace && this.#pendingReplaces === 0 && isAppendOf(synced, this.assets);

    this.#syncedAssets = [...this.assets];

    if (isNextPage) {
      // An appended row carries the keys of the current columns only.
      this.#heldRowKeys = new Set(columnKeys.filter((key) => this.#heldRowKeys.has(key)));
      await tabulator.addData(this.assets.slice(synced.length).map((asset) => this.toRow(asset, columnKeys)));
    } else {
      this.#heldRowKeys = new Set(columnKeys);
      this.#pendingReplaces += 1;

      try {
        await tabulator.setData(this.assets.map((asset) => this.toRow(asset, columnKeys)));
      } finally {
        this.#pendingReplaces -= 1;
      }

      // A new list lays the columns out again. An appended page keeps the widths while the user scrolls.
      this.applyColumnLayout();
    }

    this.markCurrentRow(this.selectedAssetId, true);
    this.observeLastRow();
    this.reportRestartedRowCount();
    this.reportHeldRowCount();
  }

  private handleTableBuilt(event: Event) {
    event.stopPropagation();

    this.#builtTable = this.tableEl?.tabulatorInstance ?? undefined;
    if (this.#builtTable) {
      this.#builtTable.options.rowFormatter = (row) => this.renderRowAction(row);
    }
    // Keep the scrollport available to actions at the container edge. The frame follows the data width.
    const frame = this.scrollport?.parentElement;

    frame?.style.setProperty('width', '100%');
    frame?.part.add('content-browser-frame');
    this.scrollport?.part.add('content-browser-scrollport');
    const header = this.tableEl?.shadowRoot?.querySelector<HTMLElement>('.tabulator-header');
    const columns = header?.querySelector('.tabulator-headers');

    header?.part.add('content-browser-header');
    // The same listener is added once only, also when a new Tabulator instance is built in the same `cx-table`.
    this.tableEl?.shadowRoot?.addEventListener('dblclick', this.handleResizeHandleDoubleClick, { capture: true });
    this.#frameWidthObserver?.disconnect();
    if (columns) {
      // Column resize events fire on release. Observe the intrinsic width to follow each drag frame,
      // plus column hide/show, without a redraw that changes the user's widths or scroll position.
      this.#frameWidthObserver = new ResizeObserver(() => this.syncTableFrame());
      this.#frameWidthObserver.observe(columns);
    }
    this.syncTableFrame();
    this.#syncedAssets = [];
    void this.syncRows();
  }

  /**
   * `setData` replaces the rows only once its debounce runs out, and Tabulator emits `dataLoaded` just
   * before it does. Until then, the old rows stay on the page with their hover and focus.
   */
  private handleDataLoaded(event: Event) {
    event.stopPropagation();

    // Every row gets a new element, which neither the pointer nor the focus has reached yet.
    this.#hoveredRow = undefined;
    this.#focusedCta = undefined;
    this.#renderedCtas.clear();
  }

  /**
   * Every `setColumns` builds the columns again from the definitions: `cx-table` calls it from its
   * own `tableBuilt` handler, after this component's has run, and again for every new column set.
   */
  private handleColumnsLoaded(event: Event) {
    event.stopPropagation();
    this.applyColumnLayout();
  }

  willUpdate(changedProperties: PropertyValues<this>) {
    super.willUpdate(changedProperties);

    const signature = columnsSignature(this.columns);
    // `content-browser` builds a new array on every render, and a new `columns` array makes
    // `cx-table` call `setColumns`, which drops every width the user has dragged.
    const columnsChanged = signature !== this.#columnsSignature;
    // The no-result block unmounts `cx-table`, and the one that replaces it builds from these
    // definitions, which predate every drag since the columns last changed.
    const tableRemounts = changedProperties.get('empty') === true && !this.empty;

    if (columnsChanged) {
      this.#columnsSignature = signature;
      // The first render builds the table, which takes its rows once it is built. `setColumns` lays the
      // rows the table holds out under the new columns, so they are built again only for a key one of
      // them carries no value under.
      this.#rowsNeedRebuild = this.hasUpdated && this.resolveColumnKeys().some((key) => !this.#heldRowKeys.has(key));
    }

    const savedWidthsChanged = changedProperties.has('savedWidths');
    const widthScopeChanged = changedProperties.has('widthScope');

    if (widthScopeChanged) {
      this.#sessionWidths.clear();
    }

    if (savedWidthsChanged) {
      this.applySavedWidths();
    }

    if (columnsChanged || tableRemounts) {
      this.#columnDefinitions = this.buildColumnDefinitions();
    } else if (changedProperties.has('hiddenFields')) {
      this.applyHiddenFields();
    } else if (savedWidthsChanged || widthScopeChanged) {
      this.applyColumnLayout();
    }
  }

  /**
   * The new saved widths replace all the widths in memory: a width that the new map does not hold,
   * for example one of another site, goes away. Only a positive width counts: a bad entry has no effect.
   */
  private applySavedWidths() {
    this.#resizedWidths = new Map(Object.entries(this.savedWidths ?? {}).flatMap(([field, width]) => (
      typeof width === 'number' && Number.isFinite(width) && width > 0 ? [[field.trim(), Math.round(width)] as const] : []
    )));
  }

  /**
   * Through Tabulator's own column visibility: new definitions would reach it through `setColumns`,
   * and the rows would have to be rebuilt, which scrolls back to the top.
   */
  private applyHiddenFields() {
    const hidden = new Set(this.hiddenFields);
    const keys = this.resolveColumnKeys();
    const shows: Promise<void>[] = [];

    this.#columnDefinitions.forEach((definition) => {
      const field = String(definition.field);
      const hostColumn = this.columns[keys.indexOf(field)];

      // The host cannot hide the filler.
      if (!hostColumn) {
        return;
      }

      const isHidden = hidden.has(hostColumn.field);
      const column = this.tabulator?.getColumn(field) as TabulatorColumn | false | undefined;

      // `cx-table` gives these same definitions to each Tabulator instance it builds, for example on
      // a reconnect, and again once the instance is built.
      definition.hidden = isHidden || undefined;

      if (column && column.isVisible() === isHidden) {
        if (isHidden) {
          column.hide();
        } else {
          shows.push(column.show());
        }
      }
    });

    // The other columns take the space of a hidden column, and give space to a shown one.
    void Promise.all(shows).then(() => this.applyColumnLayout());
  }

  updated(changedProperties: PropertyValues<this>) {
    super.updated(changedProperties);

    if (this.empty) {
      this.#frameWidthObserver?.disconnect();
    }

    if (this.#rowsNeedRebuild) {
      this.#rowsNeedRebuild = false;
      void this.rebuildRows();
    }
  }

  /** Once `cx-table` has taken the new column definitions. */
  private async rebuildRows() {
    await this.tableEl?.updateComplete;
    await this.syncRows(true);
  }

  @watch('assets')
  handleAssetsChange(previous?: unknown) {
    const previousAssets = (previous as Asset[] | undefined) ?? [];

    // A page of records the list already holds comes back as a new array of the same assets, which
    // the rows already show: `setData` would scroll back to the top, and the new last row would report
    // itself in view and ask for yet another page.
    if (this.assets.length === previousAssets.length && this.assets.every((asset, index) => asset === previousAssets[index])) {
      return;
    }

    this.assetMap.clear();
    this.assets.forEach((item) => this.assetMap.set(item.id, item));

    // A new sort, search, filter or folder restarts the list at whatever page size the host last
    // asked for, not one sized to this scrollport, so the count has to reach the host again even when
    // it is unchanged. The rows never size the container, so no resize follows to measure it. A
    // restarted list can keep the first asset and grow, as one does when a filter is removed: only a
    // page appended to the same assets, as `syncRows` tells one, keeps the count. `syncRows` also
    // replaces the rows for a new table, new columns or a page that lands while a replace waits. None
    // of these restarts the list, so the count compares against the previous list, not the rows.
    if (!isAppendOf(previousAssets, this.assets)) {
      // Reported once the new rows are in (see `reportRestartedRowCount`).
      this.#lastRowCount = undefined;
    }

    void this.syncRows();
  }

  @watch('loading', { waitUntilFirstUpdate: true })
  async handleLoadingChange() {
    if (this.loading) {
      return;
    }

    // The `assets` watcher runs after this one, so the page that landed reaches the rows only
    // later in this same update. A new list waits for `setData`, and its row sync reports the count
    // once the new rows are in. A table that is not built yet reports at once, with the count of its
    // whole box.
    await this.updateComplete;

    if (this.#pendingReplaces === 0) {
      this.reportHeldRowCount();
    }
  }

  @watch('selectedAssetId', { waitUntilFirstUpdate: true })
  handleSelectedAssetIdChange(previous?: unknown) {
    this.markCurrentRow(previous as string | undefined, false);
    this.markCurrentRow(this.selectedAssetId, true);
    this.paintAssetCta(previous as string | undefined);
    this.paintAssetCta(this.selectedAssetId);
  }

  @watch('busyAssetId', { waitUntilFirstUpdate: true })
  handleBusyAssetIdChange(previous?: unknown) {
    this.paintAssetCta(previous as string | undefined);
    this.paintAssetCta(this.busyAssetId);
  }

  @watch(['ctaText', 'ctaTextTransform'], { waitUntilFirstUpdate: true })
  handleCtaTextChange() {
    // A new label builds no new columns, so the header keeps the name its title formatter gave it.
    ((this.tabulator?.getColumn(FILLER_FIELD) || undefined) as TabulatorColumn | undefined)
      ?.getElement().setAttribute('aria-label', this.ctaLabel);

    // A row not rendered yet has no CTA, and takes the new label when it renders one.
    this.#renderedCtas.forEach((cta) => this.paintCta(cta));
  }

  private readonly handleNoHoverChange = () => {
    this.setNoHover(this.#noHoverQueries.some((list) => list.matches));
  };

  /** In place, as a relabel is: a CTA built again would drop the keyboard focus the old one held. */
  private setNoHover(noHover: boolean) {
    if (noHover === this.#hasNoHover) {
      return;
    }

    this.#hasNoHover = noHover;
    this.#renderedCtas.forEach((cta) => this.paintCta(cta));
  }

  connectedCallback() {
    super.connectedCallback();

    this.#noHoverQueries = NO_HOVER_QUERIES.map((media) => window.matchMedia(media));
    this.#noHoverQueries.forEach((list) => list.addEventListener('change', this.handleNoHoverChange));
    this.handleNoHoverChange();

    // A reconnect, which a move of the picker is, makes `cx-table` build a new Tabulator instance
    // from definitions that predate the data-column drags.
    if (this.hasUpdated) {
      this.#columnDefinitions = this.buildColumnDefinitions();
      this.requestUpdate();
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();

    this.#noHoverQueries.forEach((list) => list.removeEventListener('change', this.handleNoHoverChange));
    this.#noHoverQueries = [];
    this.#lastRowObserver?.disconnect();
    this.#frameWidthObserver?.disconnect();
    this.debouncedCalculatePageSize.cancel();
    this.debouncedHandleScrollEnd.cancel();
    this.debouncedHandleLastRowVisible.cancel();
    this.debouncedRedrawTable.cancel();
    this.debouncedApplyColumnLayout.cancel();
  }

  private handleResize(event: CxResizeEvent) {
    event.stopPropagation();

    const entries = event.detail.entries;

    if (entries[0].target !== this.containerEl) {
      return;
    }

    const { height, width } = entries[0].contentRect;

    this.debouncedCalculatePageSize(height);
    this.refitToContainer(width, height);

    // The first size of a table built with no width comes only once the table is shown.
    if (this.#layoutPending) {
      this.applyColumnLayout();
    }
  }

  /**
   * A new container width changes the space that the auto-fit shares out, so the columns are laid
   * out again. `cx-table` renders its rows again for a new container height only until the first drag
   * of a column divider, so a new height redraws the rows, which leaves no blank area under them.
   */
  private refitToContainer(width: number, height: number) {
    const size = { height: Math.round(height), width: Math.round(width) };
    const previous = this.#containerSize;

    this.#containerSize = size;

    // The first size observed is the one the table is built at.
    if (previous === undefined) {
      return;
    }

    if (previous.width !== size.width) {
      this.debouncedApplyColumnLayout();
    }

    if (previous.height !== size.height) {
      this.debouncedRedrawTable();
    }
  }

  private readonly debouncedRedrawTable = _debounce(this.redrawTable, 100);

  private readonly debouncedCalculatePageSize = _debounce(this.calculatePageSize, 200);

  private calculatePageSize(height: number) {
    if (Math.abs(this.#lastHeight - height) < 10) {
      return;
    }

    this.#lastHeight = height;
    this.reportRowCount();
  }

  /** Counts the rows the last measured height shows, and tells the host when the count changes. */
  private reportRowCount() {
    const rowCount = Math.ceil(this.resolveVisibleHeight(this.#lastHeight) / ROW_HEIGHT);

    // While a page of the shown list loads, the page a count asks for follows the request in flight,
    // and it can land first: it then goes to the end of the old rows, and a new list that lands after
    // it drops it. During the initial folder wait, which has no assets, the host takes the count as
    // the size of the first page.
    this.#rowCountHeld = this.loading && this.assets.length > 0;

    // The host sizes the next page against the last page it asked for, not against the rows it
    // holds, so an unchanged count still fetches -- and where the rows size the table, every fetch
    // resizes it again.
    if (rowCount === this.#lastRowCount || this.#rowCountHeld) {
      return;
    }

    this.#lastRowCount = rowCount;

    // One asset per row, so the grid's column/row contract degenerates to a single column and the
    // host's page-size maths stays the same in both views.
    this.emit('cx-content-browser-grid-resize', {
      detail: {
        columnCount: 1,
        rowCount,
      },
    });
  }

  /**
   * Only once the restarted rows are in: the host asks for the next page at once, and a page that
   * lands while `setData` waits replaces the rows again and holds them back for another half second.
   * A measurement still in its debounce reports in the same count, because a second count inside the
   * host's 200 ms fetch debounce cancels the page the first count asked for.
   */
  private reportRestartedRowCount() {
    // Until the container is first measured, that measurement reports the count.
    if (!this.isConnected || this.#lastRowCount !== undefined || this.#lastHeight === 0) {
      return;
    }

    this.debouncedCalculatePageSize.flush();
    this.reportRowCount();
  }

  /**
   * Once the load ends and any rows it brings are in, the count measured meanwhile can ask for the
   * page after it. A table that is not built yet reports it at once.
   */
  private reportHeldRowCount() {
    if (!this.#rowCountHeld || !this.isConnected) {
      return;
    }

    this.debouncedCalculatePageSize.flush();
    this.reportRowCount();
  }

  /**
   * The rows never size the container (see the styles), so this is the height the host gives the
   * picker, and it can run past the viewport. No scrollport shows more rows than the viewport, so
   * while the rows do not overflow the scrollport the count stops there, and the page scrolls to the
   * rest, where the last row coming into view asks for more (`observeLastRow`). One that overflows,
   * or holds no rows yet, measures the space its container gives it and is used as is.
   */
  private resolveVisibleHeight(height: number): number {
    return this.isSizedByRows() ? Math.min(height, window.innerHeight) : height;
  }

  private isSizedByRows(): boolean {
    const scrollport = this.scrollport;

    // The rows the table holds, not the assets: `setData` holds a new list back for half a second, and
    // a table built with no rows keeps none until then.
    return (this.tabulator?.getDataCount() ?? 0) > 0
      && scrollport !== undefined
      && scrollport.scrollHeight <= scrollport.clientHeight + 1;
  }

  /**
   * A scrollport that holds its rows without overflowing never scrolls, so its own scroll never
   * reaches the end: the page scrolls instead. Once the table is taller than the viewport its count
   * is capped and stops fetching, which leaves the last row coming into view as the only sign the
   * user wants more.
   */
  private observeLastRow() {
    this.#lastRowObserver?.disconnect();

    const rows = (this.tabulator?.getRows() ?? []) as TabulatorRow[];
    const lastRow = rows[rows.length - 1];

    if (!lastRow) {
      return;
    }

    this.#lastRowObserver ??= new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        this.debouncedHandleLastRowVisible();
      }
    });
    this.#lastRowObserver.observe(lastRow.getElement());
  }

  private readonly debouncedHandleLastRowVisible = _debounce(this.handleLastRowVisible, 200);

  private handleLastRowVisible() {
    if (this.isSizedByRows() && this.containerEl.clientHeight > window.innerHeight) {
      this.handleScrollEnd();
    }
  }

  private insertAsset(assetId: string) {
    // A new list replaces the rows only once `setData` has waited out its debounce, so a CTA can
    // outlive its asset's move to cold storage.
    if (!assetId || this.assetMap.get(assetId)?.inColdStorage) {
      return;
    }

    this.emit('cx-content-browser-grid-click', {
      detail: {
        id: assetId,
      },
    });
  }

  /** The host field of a row key, or `undefined` for the filler. */
  private fieldOfKey(key: string | null | undefined): string | undefined {
    return key ? this.columns[this.resolveColumnKeys().indexOf(key)]?.field : undefined;
  }

  private handleColumnResized(event: TabulatorEvent<[TabulatorColumn]>) {
    event.stopPropagation();

    const [column] = event.detail.args;
    const field = this.fieldOfKey(column.getField());

    if (field === undefined) {
      return;
    }

    const width = Math.round(column.getWidth());

    // `setColumns` and a remount build the column from its definition again.
    column.getDefinition().width = width;
    this.#resizedWidths.set(field.trim(), width);
    this.holdOtherAutoFitWidths(field);
    this.emit('cx-content-browser-table-column-resize', {
      detail: {
        field,
        reset: false,
        width,
      },
    });
    this.applyColumnLayout();
  }

  /**
   * Holds each other visible auto-fit column at its width when the drag ends, for the session. A drag
   * on one column must not change the width of another column (L-42CA9K issue 2).
   */
  private holdOtherAutoFitWidths(dragged: string) {
    const hidden = new Set(this.hiddenFields);
    const keys = this.resolveColumnKeys();

    this.columns.forEach((column, index) => {
      const field = column.field.trim();

      if (field === dragged.trim() || hidden.has(column.field) || this.#resizedWidths.has(field)) {
        return;
      }

      const tabulatorColumn = this.tabulator?.getColumn(keys[index]) as TabulatorColumn | false | undefined;
      const width = tabulatorColumn ? Math.round(tabulatorColumn.getWidth()) : 0;

      if (width > 0) {
        this.#sessionWidths.set(field, width);
      }
    });
  }

  /**
   * A double click on a column divider removes the saved width, and the column auto-fits again. The
   * listener runs in the capture phase, before the listener of the divider, so the Tabulator fit to
   * the content does not run.
   */
  private readonly handleResizeHandleDoubleClick = (event: Event) => {
    const handle = (event.target as Element | null)?.closest?.('.tabulator-col-resize-handle');

    if (!handle) {
      return;
    }

    event.stopPropagation();

    // Tabulator puts the divider of a column right after the header of that column.
    const key = handle.previousElementSibling?.getAttribute('tabulator-field');
    const field = this.fieldOfKey(key);
    const column = key ? this.tabulator?.getColumn(key) as TabulatorColumn | false | undefined : undefined;

    if (field === undefined || !column) {
      return;
    }

    this.#resizedWidths.delete(field.trim());
    this.#sessionWidths.delete(field.trim());
    this.applyColumnLayout();
    this.emit('cx-content-browser-table-column-resize', {
      detail: {
        field,
        reset: true,
        width: Math.round(column.getWidth()),
      },
    });
  };

  private handleScrollVertical(event: Event) {
    event.stopPropagation();

    this.releaseDetachedCta();

    const scrollport = this.scrollport;

    // Within a row of the end, not a few pixels: Tabulator re-pads its virtual rows as they scroll in,
    // so the scroll height it reports at the bottom can sit past the furthest offset a scroll reaches.
    if (scrollport && scrollport.scrollTop + scrollport.clientHeight >= scrollport.scrollHeight - ROW_HEIGHT) {
      this.debouncedHandleScrollEnd();
    }
  }

  private readonly debouncedHandleScrollEnd = _debounce(this.handleScrollEnd, 200);

  private handleScrollEnd() {
    // A page asked for while another loads would be in flight with it, and pages append in the order
    // they arrive. A page with new rows gives the scrollport a new end, and `syncRows` observes the
    // new last row. After a page with no new row, only a new scroll to the end asks again.
    if (this.hasMore && !this.loading) {
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
        <div class="content-browser-table">
          ${when(this.empty,
            () => html`
              <cx-content-browser-no-result
                class="content-browser-table__empty"
                icon="search_off"
                message=${this.localize.term('noResults')}
              ></cx-content-browser-no-result>
            `,
            // Left without `data`: reassigning it calls `setData`, which scrolls back to the top on
            // every page, so rows are handed to the Tabulator instance directly (see `syncRows`).
            () => html`
              <cx-table
                class="content-browser-table__table"
                layout="fitData"
                placeholder=""
                no-selectable
                no-clipboard
                .columns=${this.#columnDefinitions}
                .columnDefaults=${COLUMN_DEFAULTS}
                .rowHeight=${ROW_HEIGHT}
                @cx-table.tableBuilt=${this.handleTableBuilt}
                @cx-table.dataLoaded=${this.handleDataLoaded}
                @cx-table.columnsLoaded=${this.handleColumnsLoaded}
                @cx-table.columnResized=${this.handleColumnResized}
                @cx-table.scrollVertical=${this.handleScrollVertical}
                @cx-table.renderStarted=${this.handleRenderStarted}
                @cx-table.renderComplete=${this.handleRenderComplete}
              ></cx-table>
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
