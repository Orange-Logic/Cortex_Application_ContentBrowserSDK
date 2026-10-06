export enum OptionType {
  FILTER = 'filter',
  SORT_DIRECTION = 'sort-direction',
  SORT_ORDER = 'sort-order',
}

export type ControlOption = {
  label: string,
  value: string;
};

export type ChangeOption = {
  type: OptionType,
  value: string,
};

export type Facet = {
  facetDetails: {
    displayName: string;
    facetFieldName: string;
    facetIndexedFieldName?: string;
  };
  values: Array<{
    count: number;
    displayValue: string;
    value: string;
  }>;
};

export type SortOrder = {
  description: string;
  id: string;
  isDefault?: boolean;
  legacyValue: string;
  name: string;
  sortDirection: string;
  sortDirectionDisplayName: string;
  sortDirectionGroupKey: string;
  sortType: string;
};

export enum GridView {
  Large = 'large',
  Medium = 'medium',
  Small = 'small',
}

/**
 * The table layout. `GridView` members are the grid's pixel-width presets, so a layout that is not
 * a grid at all cannot be one of them.
 */
export const TABLE_VIEW = 'table';

/** What the content browser is currently rendering: one of the grid size presets, or the table. */
export type ContentBrowserView = GridView | typeof TABLE_VIEW;

export type TableColumnAlign = 'center' | 'left' | 'right';

/**
 * One column of the table view. The host owns the column set: the SDK ships the mechanism and no
 * default column list, so nothing here is guessed from the asset's doc type.
 */
export type TableColumn = {
  /** Horizontal alignment of the cell text. Default `left`. */
  align?: TableColumnAlign;
  /**
   * Cortex field the column reads, e.g. `CoreField.Identifier` or `Dell.Snippet`. It is appended to
   * the field list of the same search call the grid uses, so what a given caller gets back is decided
   * server-side — the SDK neither filters nor resolves fields of its own. Surrounding whitespace
   * is trimmed, and the trimmed name is what the duplicate-column check compares.
   */
  field: string;
  /** Lines a cell shows before the text is clamped. Default 1. */
  lines?: number;
  /** Column header text. */
  title: string;
  /**
   * Column width, written as a CSS grid track. A length in pixels (`200px`) is a fixed width. A
   * percentage (`25%`) is a fixed share of the table's width, in whole percents (a fraction is
   * dropped, so `12.5%` is 12%), converted to pixels once when the table builds its columns; it
   * does not follow later resizes of the table. A `<flex>` value (`2fr`) is a share of the width
   * left over. A `minmax()` keeps a pixel minimum above 48px: `minmax(120px, 1fr)` is a share that
   * never narrows below 120px, and `minmax(100px, 200px)` is a fixed 200px width that a drag can
   * narrow to 100px. Any other form (`10rem`, `auto`, `max-content`) takes an equal flexible share.
   * Default `minmax(0, 1fr)`. No column narrows below 48px, in the layout or in a drag, so a
   * percentage share narrower than 48px renders at 48px. The one exception is a pixel width above 0
   * and below 48px, which renders as set. A width of 0 (`0px`, or a `0fr` share) renders at 48px. A
   * column has no maximum width.
   */
  width?: string;
};

export const ASSET_SIZE = {
  [GridView.Small]: {
    maxWidth: 178,
    minWidth: 130,
  },
  [GridView.Medium]: {
    maxWidth: 292,
    minWidth: 190,
  },
  [GridView.Large]: {
    maxWidth: 456,
    minWidth: 302,
  },
};

export enum Unit {
  AspectRatio = '%',
  Pixel = 'px',
}

export const cropModes = [
  {
    label: 'Freeform',
    value: 'free',
  },
  {
    label: 'Widescreen (16:9)',
    value: '16:9',
  },
  {
    label: 'Phone (9:16)',
    value: '9:16',
  },
  {
    label: 'Presentation (4:3)',
    value: '4:3',
  },
  {
    label: 'Square (1:1)',
    value: '1:1',
  },
  {
    label: 'Landscape (3:2)',
    value: '3:2',
  },
  {
    label: 'Portrait (2:3)',
    value: '2:3',
  },
];

export const INPUT_DEBOUNCE_DELAY = 1000;

export type Proxy = {
  cdnName: string | null;
  extension: string | null;
  formatHeight: number;
  formatWidth: number;
  height: number;
  id: string;
  permanentLink: string | null;
  proxyLabel: string;
  proxyName: string;
  width: number;
};

export enum TransformationAction {
  Crop = 'Crop',
  Metadata = 'Metadata',
  Proxy = 'Proxy',
  Quality = 'Quality',
  Resize = 'Resize',
  Rotate = 'Rotate',
}

export type Transformation = {
  key: TransformationAction;
  value: {
    disabledSize?: boolean;
    height?: number;
    keepMetadata?: boolean;
    mode?: string;
    quality?: number;
    rotation?: number;
    unit?: Unit;
    width?: number;
    x?: number;
    y?: number;
  };
};

export type Parameter = { key: string; value: string };

export type CropMode = {
  auto?: boolean;
  disabledSize?: boolean;
  label: string;
  value: string;
};

export type FocusMode = {
  auto?: boolean;
  label: string;
  value: string;
};

export type DefaultFocusMode = 'manual' | 'center';

/**
 * Import behaviour when the host would rather not show the format picker.
 *
 * - `false` — the format dialog opens as usual.
 * - `true` — insert with the first available format, without showing the dialog.
 * - a format name — insert with that format, matched case-insensitively against a proxy's
 *   `proxyName` or `proxyLabel`. A name matching nothing opens the dialog as usual.
 */
export type AutoSelectFormat = boolean | string;

/**
 * Serves markup hosts: `<cx-content-browser auto-select-format="WEB">`. The union has to survive a
 * round trip through a string, so `"true"`/`"false"` are the booleans and anything else is a format
 * name; a bare attribute means `true`, matching how a boolean attribute normally reads.
 *
 * React hosts bypass this entirely — `CortexElement.createProperty` aliases the attribute name onto
 * the prototype, so react-dom finds `'auto-select-format' in element` and assigns the property with
 * its real type rather than setting an attribute.
 */
export const autoSelectFormatConverter = {
  fromAttribute: (value: string | null): AutoSelectFormat => {
    if (value === null) {
      return false;
    }

    const normalized = value.trim();

    if (normalized === '' || normalized.toLowerCase() === 'true') {
      return true;
    }

    if (normalized.toLowerCase() === 'false') {
      return false;
    }

    return normalized;
  },
  toAttribute: (value: AutoSelectFormat): string | null => {
    return value === false ? null : String(value);
  },
};

/**
 * Whether `autoSelectFormat` is switched on at all — a blank string is off, not a format named " ".
 *
 * Config-level, not per-asset: it says the host has asked to skip the picker, not that this
 * particular asset will skip it. A named format that no proxy matches still opens the dialog.
 */
export function isAutoSelectFormatActive(value: AutoSelectFormat): boolean {
  return value === true || (typeof value === 'string' && value.trim() !== '');
}

export type CtaTextTransform = 'none' | 'uppercase' | 'lowercase' | 'capitalize';

export enum ContentBrowserFormatDialogVariant {
  Dialog = 'dialog',
  Drawer = 'drawer',
}
