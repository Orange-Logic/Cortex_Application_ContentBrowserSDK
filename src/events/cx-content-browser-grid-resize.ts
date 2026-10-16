export type CxContentBrowserGridResizeEvent = CustomEvent<{
  columnCount: number;
  rowCount: number;
}>;

declare global {
  interface GlobalEventHandlersEventMap {
    'cx-content-browser-grid-resize': CxContentBrowserGridResizeEvent;
  }
}
