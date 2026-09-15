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
   * server-side — the SDK neither filters nor resolves fields of its own.
   */
  field: string;
  /** Lines a cell shows before the text is clamped. Default 1. */
  lines?: number;
  /** Column header text. */
  title: string;
  /** CSS grid track for the column, e.g. `200px`, `2fr`, `minmax(120px, 1fr)`. Default `minmax(0, 1fr)`. */
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

export type CtaTextTransform = 'none' | 'uppercase' | 'lowercase' | 'capitalize';

export enum ContentBrowserFormatDialogVariant {
  Dialog = 'dialog',
  Drawer = 'drawer',
}
