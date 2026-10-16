export type CxContentBrowserControlFilterChangeEvent = CustomEvent<{
  selection: Record<string, string[]>;
}>;

declare global {
  interface GlobalEventHandlersEventMap {
    'cx-content-browser-control-filter-change': CxContentBrowserControlFilterChangeEvent;
  }
}
