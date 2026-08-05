export type CxContentBrowserControlSortOrderChangeEvent = CustomEvent<{
  sortDirection: string;
  sortOrderName: string;
}>;

declare global {
  interface GlobalEventHandlersEventMap {
    'cx-content-browser-control-sort-order-change': CxContentBrowserControlSortOrderChangeEvent;
  }
}
