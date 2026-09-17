export interface CxContentBrowserTableColumnResizeEvent extends CustomEvent<{ field: string; width: number | undefined }> {
  detail: {
    /** The Cortex field the resized column maps to, as the host configured it. */
    field: string;
    /** Resolved width in pixels, or `undefined` when the column was reset to its configured width. */
    width: number | undefined;
  };
}

declare global {
  interface GlobalEventHandlersEventMap {
    'cx-content-browser-table-column-resize': CxContentBrowserTableColumnResizeEvent;
  }
}
