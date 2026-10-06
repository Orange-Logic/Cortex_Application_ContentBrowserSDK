import { html, type PropertyValues } from 'lit';
import { property, query } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import { when } from 'lit/directives/when.js';
import _debounce from 'lodash-es/debounce';

import CortexElement from '@/base/element';
import componentStyles from '@/styles/component.styles';
import { Asset } from '@/types/asset';
import { type CtaTextTransform, TableColumn } from '@/types/content-browser';
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
  getRow(): { getData(): Record<string, unknown>; getElement(): HTMLElement; normalizeHeight(): void };
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
  label: HTMLSpanElement;
  rowElement: HTMLElement;
};

/** `cx-table`'s own row height, the one every other Cortex table renders at. */
export const ROW_HEIGHT = 48;

/** Narrow enough to be a deliberate choice, wide enough that a column never becomes a sliver. */
export const MIN_COLUMN_WIDTH = 48;

/** The trailing column that holds each row's CTA, keyed apart from every `column<n>` data column. */
export const CTA_FIELD = 'cta';

/** The empty column before the CTA column that takes the width no other column takes. */
export const FILLER_FIELD = 'filler';

/** The CTA column's width until a rendered button is measured. */
const INITIAL_CTA_COLUMN_WIDTH = 96;

/** The filler's share of the free space: above 0, which Tabulator reads as 1, and far below any data column's. */
const FILLER_GROW = 0.001;

/**
 * `(hover: none)` reads only the primary input, so a touch laptop or a tablet with a mouse matches
 * `(hover: hover)`, yet a finger on its touch screen has no hover either.
 */
const NO_HOVER_QUERIES = ['(hover: none)', '(any-pointer: coarse)'];

const FLEX_TRACK = /^(\d*\.?\d+)fr$/i;
const MINMAX_TRACK = /^minmax\(\s*(.+?)\s*,\s*(.+?)\s*\)$/i;
const PIXEL_LENGTH = /^(\d*\.?\d+)(px)?$/i;
const PERCENT_LENGTH = /^\d*\.?\d+%$/;

/*
 * Constants rather than literals in the template: `cx-table` rebuilds its whole Tabulator instance
 * whenever `columnDefaults` changes identity, and a literal is a new object on every render.
 */
const COLUMN_DEFAULTS: Partial<TableColumnDefinition> = {
  headerSort: false,
  resizable: true,
};

type ColumnSizing = Pick<TableColumnDefinition, 'minWidth' | 'width' | 'widthGrow'>;

const FLEXIBLE: ColumnSizing = { minWidth: MIN_COLUMN_WIDTH, widthGrow: 1 };

function parsePixels(value: string): number | undefined {
  const match = PIXEL_LENGTH.exec(value.trim());

  return match ? Number.parseFloat(match[1]) : undefined;
}

/** A host-authored minimum stands, unless it is one a flexible column could still collapse below. */
function flexibleMinimum(minimum: string): number {
  return Math.max(MIN_COLUMN_WIDTH, parsePixels(minimum) ?? 0);
}

/**
 * A drag stops only at a column's minimum, and Tabulator's own is 40px: a fixed column takes the
 * table's floor, or its authored width where that is narrower. Tabulator reads a width of 0 as no
 * width and gives the column a flexible share, so a column set to 0 floors at the table's floor.
 */
function fixedSizing(width: number, minimum = 0): ColumnSizing {
  if (width <= 0) {
    return { minWidth: MIN_COLUMN_WIDTH, width: MIN_COLUMN_WIDTH };
  }

  return { minWidth: Math.min(Math.max(MIN_COLUMN_WIDTH, minimum), width), width };
}

/** Tabulator reads a `widthGrow` of 0 as 1, so a share of 0 is laid out as a fixed width at its floor. */
function flexibleSizing(minimum: number, grow: number): ColumnSizing {
  return grow > 0 ? { minWidth: minimum, widthGrow: grow } : { minWidth: minimum, width: minimum };
}

/**
 * Maps a host column's `width`, authored as a CSS grid track, onto Tabulator column sizing under the
 * `fitColumns` layout: a pixel length is a fixed width, a percentage is a fixed share of the table
 * width in whole percents (`12.5%` is 12%), converted to pixels once when the table builds its
 * columns, or once it is shown if it built them hidden, and not resized afterward, a `<flex>` share
 * is `widthGrow`, and a `minmax()` keeps a pixel minimum above `MIN_COLUMN_WIDTH`. Any other track
 * takes an equal share of the free space.
 * Every column floors at `MIN_COLUMN_WIDTH` (48px). The one exception is a pixel width above 0 and
 * below 48px, which renders as set. A width of 0 (`0px`, or a `0fr` share) renders at 48px.
 */
export function toColumnSizing(track: string | undefined): ColumnSizing {
  const authored = track?.trim() ?? '';

  if (!authored) {
    return FLEXIBLE;
  }

  const pixels = parsePixels(authored);

  if (pixels !== undefined) {
    return fixedSizing(pixels);
  }

  if (PERCENT_LENGTH.test(authored)) {
    // Tabulator reads a floor only as it builds the column, before the percentage becomes pixels, so a
    // share narrower than the floor cannot keep its own width as a pixel track does.
    return { minWidth: MIN_COLUMN_WIDTH, width: authored };
  }

  const flex = FLEX_TRACK.exec(authored);

  if (flex) {
    return flexibleSizing(MIN_COLUMN_WIDTH, Number.parseFloat(flex[1]));
  }

  const minmax = MINMAX_TRACK.exec(authored);

  if (!minmax) {
    return FLEXIBLE;
  }

  const [, minimum, maximum] = minmax;
  const maximumFlex = FLEX_TRACK.exec(maximum);

  if (maximumFlex) {
    return flexibleSizing(flexibleMinimum(minimum), Number.parseFloat(maximumFlex[1]));
  }

  const maximumPixels = parsePixels(maximum);

  if (maximumPixels !== undefined) {
    return fixedSizing(maximumPixels, parsePixels(minimum));
  }

  return { ...FLEXIBLE, minWidth: flexibleMinimum(minimum) };
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
  return JSON.stringify(columns.map(({ align, field, lines, title, width }) => [align, field, lines, title, width]));
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

function renderCellContent(value: string, lines: number, inColdStorage: boolean): HTMLElement {
  // Built as an element with text content, never as a string: Tabulator inserts a formatter's string
  // as HTML, and these values are the DAM's own metadata. A clamp at one line too, as `cx-table`
  // clamps its own cells and headers: a Tabulator cell neither clips nor ellipsizes what overflows it.
  const content = document.createElement('cx-line-clamp');

  content.setAttribute('lines', String(lines));

  if (lines > 1) {
    content.style.whiteSpace = 'normal';
  }

  if (inColdStorage) {
    content.style.opacity = '0.5';
  }

  content.textContent = value;

  return content;
}

/**
 * Tabulator sizes a row as it renders it, before the clamp has rendered its lines, and keeps that
 * height: the row is sized again once the clamp has, and never below a single-line row.
 */
async function fitRowToClamp(cell: TabulatorCell, clamp: InstanceType<typeof CxLineClamp>) {
  cell.getElement()?.style.setProperty('min-height', `${ROW_HEIGHT}px`);
  await clamp.updateComplete;

  if (clamp.isConnected) {
    cell.getRow().normalizeHeight();
  }
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
 * new width: a drag of its divider released, or a double click on the divider that fits the column to
 * its content. Never emitted for the empty filler column or the CTA column, which have no divider.
 * `detail.width` is the column's width in whole pixels; `undefined` is never emitted. Resized widths
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
   * scroll position unchanged. The filler and the CTA column always show, so when each host column
   * is hidden, the rows stay with only their CTA.
   */
  @property({ attribute: false })
  hiddenFields: string[] = [];

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
   * Widths the user has settled a column on, in pixels, keyed by the host's field: new definitions
   * reach Tabulator through `setColumns`, which forgets every width a column was resized to.
   */
  #resizedWidths = new Map<string, number>();

  /** Set while the percentage columns hold the floor of a table built with no width (see `pinPercentWidths`). */
  #percentWidthsPending = false;

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

  /** Carried into every rebuilt column set, so a new table starts at the width its button needs. */
  #ctaColumnWidth = INITIAL_CTA_COLUMN_WIDTH;

  /**
   * The label the CTA column was fitted to since the rows were last replaced. Every CTA shares it, so
   * one that renders with it measures nothing, however often Tabulator formats its row again.
   */
  #ctaFittedLabel: string | undefined;

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

  /** The container's last observed size, as `<width>x<height>` in whole pixels. */
  #containerSize: string | undefined;

  #lastRowCount: number | undefined;

  /**
   * Set when the table counts the rows its box shows while a page of the shown list loads. Once that
   * load ends and any rows it brings are in, the table counts again and reports a new count.
   */
  #rowCountHeld = false;

  #lastRowObserver: IntersectionObserver | undefined;

  private get tabulator(): Tabulator | undefined {
    const instance = this.tableEl?.tabulatorInstance ?? undefined;

    // `cx-table` destroys its instance on disconnect but keeps the reference.
    return instance !== undefined && instance === this.#builtTable && !instance.destroyed ? instance : undefined;
  }

  /** Tabulator's row holder: the one element that scrolls the rows. */
  private get scrollport(): HTMLElement | undefined {
    return this.tabulator?.rowManager?.element ?? undefined;
  }

  private get hasMultilineColumn(): boolean {
    return this.columns.some((column) => (column.lines ?? 1) > 1);
  }

  private resolveColumnSizing(column: TableColumn): ColumnSizing {
    const sizing = toColumnSizing(column.width);
    const resized = this.#resizedWidths.get(column.field);

    if (resized === undefined) {
      return sizing;
    }

    // Pinned at the dragged width, keeping its floor but no share of the free space, as the live
    // column is pinned once its drag settles (see `handleColumnResized`).
    return { minWidth: sizing.minWidth, width: resized };
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
    return [...this.buildDataColumnDefinitions(), this.buildFillerColumnDefinition(), this.buildCtaColumnDefinition()];
  }

  private buildDataColumnDefinitions(): TableColumnDefinition[] {
    const hidden = new Set(this.hiddenFields);
    const keys = this.resolveColumnKeys();
    const variableRowHeight = this.hasMultilineColumn;

    return this.columns.map((column, index) => {
      const lines = Math.max(1, column.lines ?? 1);

      return {
        field: keys[index],
        formatter: (cell: TabulatorCell, _params: unknown, onRendered: (callback: () => void) => void) => {
          const row = cell.getRow();
          const inColdStorage = Boolean(row.getData().inColdStorage);
          const content = renderCellContent(String(cell.getValue() ?? ''), lines, inColdStorage);

          if (inColdStorage) {
            // No click or insert reaches the host from this row, so it takes no pointer: `cx-table`
            // would otherwise give it the hover highlight and pointer cursor of a clickable row.
            row.getElement().style.pointerEvents = 'none';
          }

          if (lines > 1) {
            onRendered(() => void fitRowToClamp(cell, content as InstanceType<typeof CxLineClamp>));
          } else if (variableRowHeight) {
            // A row is as tall as its shown cells, so hiding the multi-line column must not shrink it.
            onRendered(() => cell.getElement()?.style.setProperty('min-height', `${ROW_HEIGHT}px`));
          }

          return content;
        },
        headerHozAlign: column.align,
        // Never `false`: Tabulator awaits a `show()` for it as it builds the header, so a percentage
        // column still has a width of 0 when `pinPercentWidths` pins it, and lays out as flexible.
        hidden: hidden.has(column.field) || undefined,
        hozAlign: column.align,
        title: column.title,
        // A node, as for a cell: `cx-table` parses a title string as HTML.
        titleFormatter: (cell: TabulatorCell) => renderCellContent(String(cell.getValue() ?? ''), 1, false),
        variableHeight: lines > 1,
        ...this.resolveColumnSizing(column),
      };
    });
  }

  /**
   * `fitColumns` gives the free space only to columns with no fixed width, and a drag fixes the width
   * of the column it resizes. Once every data column has one, this column takes the space they leave,
   * which would otherwise show blank, and keeps the CTA at the right edge. The CTA column cannot do it
   * itself: its floor is the button's measured width, and Tabulator reads a floor only as it builds the
   * column.
   */
  private buildFillerColumnDefinition(): TableColumnDefinition {
    const variableRowHeight = this.hasMultilineColumn;

    return {
      field: FILLER_FIELD,
      formatter: (cell: TabulatorCell) => {
        const element = cell.getElement();

        if (variableRowHeight) {
          // A row is as tall as its shown cells, and Cortex can hide each host cell that carries the
          // minimum. On the row, not on this cell or the CTA cell: Tabulator stretches them to it.
          cell.getRow().getElement().style.minHeight = `${ROW_HEIGHT}px`;
        }

        if (element) {
          // `cx-table` pads every cell, which would render the 1px column far wider than it is laid out.
          element.style.padding = '0';
          // The pointer lands on the row itself, so the filler has no hover or click of its own.
          element.style.pointerEvents = 'none';
          element.setAttribute('aria-hidden', 'true');
        }

        return '';
      },
      headerSort: false,
      // A column laid out at 0 loses its width style, and renders as wide as its content.
      minWidth: 1,
      resizable: false,
      title: '',
      titleFormatter: (cell: TabulatorHeaderCell) => {
        const header = cell.getColumn().getElement();

        // No divider of its own: at 1px it doubles the one before it, and wide it splits the empty
        // area over the CTA column.
        header.style.borderRight = 'none';
        header.style.pointerEvents = 'none';
        header.setAttribute('aria-hidden', 'true');

        return '';
      },
      widthGrow: FILLER_GROW,
    };
  }

  /**
   * A button of our own in a formatter cell rather than a `cx-table` hover-menu action: a row action
   * renders an icon, with its label only as a tooltip.
   */
  private buildCtaColumnDefinition(): TableColumnDefinition {
    return {
      field: CTA_FIELD,
      formatter: (cell: TabulatorCell) => this.renderCta(cell),
      // Held at the right edge of a table wider than the picker: a click on the row hands nothing
      // over, so the CTA is the only insert a row has.
      frozen: true,
      headerSort: false,
      hozAlign: 'right',
      // Tabulator's default floor would hold a narrower button's column wider than it is measured.
      minWidth: 0,
      resizable: false,
      title: '',
      // Untitled on screen, but a header a screen reader reads needs a name.
      titleFormatter: (cell: TabulatorHeaderCell) => {
        cell.getColumn().getElement().setAttribute('aria-label', this.ctaLabel);

        return '';
      },
      width: this.#ctaColumnWidth,
    };
  }

  private get ctaLabel(): string {
    return this.ctaText || this.localize.term('insert');
  }

  private renderCta(cell: TabulatorCell): HTMLElement | string {
    const row = cell.getRow();
    const data = row.getData();

    if (data.inColdStorage) {
      return '';
    }

    const rowElement = row.getElement();
    const button = document.createElement('cx-button');
    const label = document.createElement('span');
    const cta: RowCta = { assetId: String(data.id ?? ''), button, label, rowElement };

    // A click on the row hands nothing over, so the row takes no pointer cursor, which `cx-table`
    // gives every selectable row. The CTA keeps a pointer cursor of its own.
    rowElement.style.cursor = 'default';
    button.classList.add('content-browser-table__cta');
    button.setAttribute('size', 'small');
    button.setAttribute('variant', 'primary');
    // Its own label's width in any column, so the column can be measured against it: `cx-button`
    // caps itself at its container's width.
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

    const previous = this.#ctas.get(rowElement);

    // Tabulator formats a row again into the same element, which takes the CTA it held off the page for good.
    if (previous) {
      this.#renderedCtas.delete(previous);
    }

    this.#ctas.set(rowElement, cta);
    this.#renderedCtas.add(cta);
    this.trackPointer(rowElement);
    this.paintCta(cta);
    void this.fitCtaColumn(cta);

    return button;
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
    cta.button.style.opacity = this.isCtaShown(cta) ? '1' : '0';
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

  /**
   * The label is the host's, so no fixed width fits it: the column takes the rendered button's
   * width plus whatever its cell puts around the button.
   */
  private async fitCtaColumn(cta: RowCta) {
    await cta.button.updateComplete;

    const tabulator = this.tabulator;
    const column = (tabulator?.getColumn(CTA_FIELD) || undefined) as TabulatorColumn | undefined;
    const container = cta.button.parentElement;

    if (!tabulator || !column || !container || !cta.button.isConnected) {
      return;
    }

    const labelKey = `${this.ctaLabel}\u0000${this.ctaTextTransform}`;

    if (labelKey === this.#ctaFittedLabel) {
      return;
    }

    const header = column.getElement().getBoundingClientRect().width;

    // A table that CSS hides lays out no cell and no button to measure: the column is fitted once the
    // table is shown again (see `handleResize`).
    if (container.clientWidth === 0 || header === 0) {
      return;
    }

    this.#ctaFittedLabel = labelKey;

    const style = getComputedStyle(container);
    const content = container.clientWidth - Number.parseFloat(style.paddingLeft) - Number.parseFloat(style.paddingRight);
    // A scaled ancestor scales what `getBoundingClientRect` reports, never a layout width: the button is
    // taken back to the column's own pixels by the scale its header renders at.
    const scale = column.getWidth() > 0 ? header / column.getWidth() : 1;
    const width = Math.ceil(column.getWidth() - content + cta.button.getBoundingClientRect().width / scale);

    if (width === Math.round(column.getWidth())) {
      return;
    }

    this.#ctaColumnWidth = width;
    // `fitColumns` sizes a column by its definition on every layout, not by its live width.
    column.getDefinition().width = width;
    await column.setWidth(width);
    // Lays the other columns out around the new width.
    this.redrawTable();
  }

  /** Lays the columns and the rendered rows out again. */
  private redrawTable() {
    this.tabulator?.redraw();
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
   * Tabulator selection is there only for `cx-table`'s selected-row style: `selectableRows` stays at
   * its `highlight` default, so a click never selects a row by itself.
   */
  private markCurrentRow(assetId: string | undefined, current: boolean) {
    const row = this.findRow(assetId);

    if (!row) {
      return;
    }

    row.getElement().setAttribute('aria-current', current ? 'true' : 'false');

    if (current) {
      this.tabulator?.selectRow(assetId);
    } else {
      this.tabulator?.deselectRow(assetId);
    }
  }

  private getPercentColumns(tabulator: Tabulator): TabulatorColumn[] {
    return (tabulator.getColumns() as TabulatorColumn[]).filter((column) => {
      const { width } = column.getDefinition();

      return typeof width === 'string' && PERCENT_LENGTH.test(width);
    });
  }

  /**
   * Tabulator converts a percentage to pixels once, as it builds the column, but `fitColumns` goes on
   * budgeting the column at that share of the table's current width, which leaves the flexible columns
   * a gap or an overflow at any other width: the column is budgeted at the width it was built at. A
   * table hidden as it builds its columns has no width to take a share of, and Tabulator floors every
   * share at the column's minimum: those shares are converted once the table is shown.
   */
  private pinPercentWidths(tabulator: Tabulator) {
    const columns = this.getPercentColumns(tabulator);

    this.#percentWidthsPending = columns.length > 0 && tabulator.element.clientWidth === 0;

    if (this.#percentWidthsPending) {
      return;
    }

    columns.forEach((column) => {
      column.getDefinition().width = column.getWidth();
    });
  }

  /** At the first width the table has, as Tabulator converts a share when it builds the column. */
  private async convertPendingPercentWidths() {
    const tabulator = this.tabulator;

    if (!this.#percentWidthsPending || !tabulator || tabulator.element.clientWidth === 0) {
      return;
    }

    this.#percentWidthsPending = false;

    const tableWidth = tabulator.element.clientWidth;

    await Promise.all(this.getPercentColumns(tabulator).map(async (column) => {
      const definition = column.getDefinition();

      // `setWidth` floors the width at the column's minimum, as the build does.
      await column.setWidth(Math.floor(tableWidth / 100 * Number.parseInt(String(definition.width), 10)));
      definition.width = column.getWidth();
    }));
    // Lays the other columns out around the converted widths.
    this.redrawTable();
  }

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
    }

    this.markCurrentRow(this.selectedAssetId, true);
    this.observeLastRow();
    this.reportRestartedRowCount();
    this.reportHeldRowCount();
  }

  private handleTableBuilt(event: Event) {
    event.stopPropagation();

    this.#builtTable = this.tableEl?.tabulatorInstance ?? undefined;
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
    // Fitted once per list: a new table or column set starts the CTA column at its definitions' width.
    this.#ctaFittedLabel = undefined;
  }

  /**
   * Every `setColumns` builds the columns again from the host definitions, which keep the
   * percentage: `cx-table` calls it from its own `tableBuilt` handler, after this component's has
   * run, and again for every new column set.
   */
  private handleColumnsLoaded(event: Event) {
    event.stopPropagation();

    const tabulator = this.tableEl?.tabulatorInstance;

    if (tabulator && !tabulator.destroyed) {
      this.pinPercentWidths(tabulator);
    }
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
      this.forgetRemovedColumnWidths();
    }

    if (columnsChanged || tableRemounts) {
      this.#columnDefinitions = this.buildColumnDefinitions();
    } else if (changedProperties.has('hiddenFields')) {
      this.applyHiddenFields();
    }
  }

  /**
   * Through Tabulator's own column visibility: new definitions would reach it through `setColumns`,
   * and the rows would have to be rebuilt, which scrolls back to the top.
   */
  private applyHiddenFields() {
    const hidden = new Set(this.hiddenFields);
    const keys = this.resolveColumnKeys();

    this.#columnDefinitions.forEach((definition) => {
      const field = String(definition.field);
      const hostColumn = this.columns[keys.indexOf(field)];

      // The filler and the CTA column are the table's own, and the host cannot hide them.
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
          void column.show();
        }
      }
    });
  }

  updated(changedProperties: PropertyValues<this>) {
    super.updated(changedProperties);

    if (this.#rowsNeedRebuild) {
      this.#rowsNeedRebuild = false;
      void this.rebuildRows();
    }
  }

  /** A column the host stops configuring starts again from the host's width if it comes back. */
  private forgetRemovedColumnWidths() {
    const fields = new Set(this.columns.map((column) => column.field));

    [...this.#resizedWidths.keys()]
      .filter((field) => !fields.has(field))
      .forEach((field) => this.#resizedWidths.delete(field));
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
    ((this.tabulator?.getColumn(CTA_FIELD) || undefined) as TabulatorColumn | undefined)
      ?.getElement().setAttribute('aria-label', this.ctaLabel);

    // A row not rendered yet has no CTA, and takes the new label when it renders one.
    this.#renderedCtas.forEach((cta) => this.paintCta(cta));
    this.fitRenderedCta();
  }

  /** Every CTA shares the label, so one on the page measures the column for all of them. */
  private fitRenderedCta() {
    const rendered = [...this.#renderedCtas].find((cta) => cta.button.isConnected);

    if (rendered) {
      void this.fitCtaColumn(rendered);
    }
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
    // from definitions that predate every drag and every fit of the CTA column since the columns
    // last changed.
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
    this.debouncedCalculatePageSize.cancel();
    this.debouncedHandleScrollEnd.cancel();
    this.debouncedHandleLastRowVisible.cancel();
    this.debouncedRedrawTable.cancel();
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
    void this.convertPendingPercentWidths();
    // A CTA that rendered or took a new label while the table was hidden is measured once it is shown.
    this.fitRenderedCta();
  }

  /**
   * `cx-table` lays its columns and rows out again for a new container size only until the first
   * drag of a column divider. After it, the columns keep the old width and the rows fill only the old
   * height, which leaves a blank area right of the columns or under the rows.
   */
  private refitToContainer(width: number, height: number) {
    const size = `${Math.round(width)}x${Math.round(height)}`;
    const previous = this.#containerSize;

    this.#containerSize = size;

    // The first size observed is the one the table is built at.
    if (previous !== undefined && previous !== size) {
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

  private handleColumnResized(event: TabulatorEvent<[TabulatorColumn]>) {
    event.stopPropagation();

    const [column] = event.detail.args;
    const field = this.columns[this.resolveColumnKeys().indexOf(column.getField())]?.field;

    if (field === undefined) {
      return;
    }

    const width = Math.round(column.getWidth());

    // `fitColumns` sizes each column by its definition on every layout, which every new list runs:
    // a flexible one would snap back to its share, and a fixed one would be budgeted at its old width.
    column.getDefinition().width = width;
    this.#resizedWidths.set(field, width);
    this.emit('cx-content-browser-table-column-resize', {
      detail: {
        field,
        width,
      },
    });
    // A drag resizes the dragged column only: the width it frees or takes goes to the flexible
    // columns, the filler among them, only on the next layout.
    this.redrawTable();
  }

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
                layout="fitColumns"
                placeholder=""
                no-selectable
                no-clipboard
                .columns=${this.#columnDefinitions}
                .columnDefaults=${COLUMN_DEFAULTS}
                .rowHeight=${this.hasMultilineColumn ? undefined : ROW_HEIGHT}
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
