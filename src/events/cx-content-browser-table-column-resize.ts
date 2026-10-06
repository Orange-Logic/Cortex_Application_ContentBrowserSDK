export interface CxContentBrowserTableColumnResizeEvent extends CustomEvent<{ field: string; width: number | undefined }> {
  detail: {
    /** The Cortex field the resized column maps to, trimmed of surrounding whitespace (see `TableColumn.field`). */
    field: string;
    /**
     * The column's width in whole pixels, after a drag or after a double click on its divider fits
     * it to its content. Never `undefined` since the table moved to `cx-table`, which has no reset to
     * the configured width; the type keeps `undefined` so existing handlers stay valid.
     */
    width: number | undefined;
  };
}

declare global {
  interface GlobalEventHandlersEventMap {
    'cx-content-browser-table-column-resize': CxContentBrowserTableColumnResizeEvent;
  }
}
