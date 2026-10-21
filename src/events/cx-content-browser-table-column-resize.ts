export interface CxContentBrowserTableColumnResizeEvent extends CustomEvent<{ field: string; reset: boolean; width: number | undefined }> {
  detail: {
    /** The Cortex field the resized column maps to, trimmed of surrounding whitespace (see `TableColumn.field`). */
    field: string;
    /**
     * `false` after a drag of the column divider. `true` after a double click on the divider, which
     * removes the saved width and auto-fits the column again.
     */
    reset: boolean;
    /**
     * The column's width in whole pixels: the dragged width, or the auto-fit width after a reset.
     * The SDK saves a dragged width itself. The value is never `undefined`. The type keeps
     * `undefined` so that existing handlers stay valid.
     */
    width: number | undefined;
  };
}

declare global {
  interface GlobalEventHandlersEventMap {
    'cx-content-browser-table-column-resize': CxContentBrowserTableColumnResizeEvent;
  }
}
