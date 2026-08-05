export type CxContentBrowserControlBarSearchChangeEvent = CustomEvent<{
  searchText: string;
}>;

declare global {
  interface GlobalEventHandlersEventMap {
    'cx-content-browser-control-bar-search-change': CxContentBrowserControlBarSearchChangeEvent;
  }
}
