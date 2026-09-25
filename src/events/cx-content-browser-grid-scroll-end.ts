export type CxContentBrowserGridScrollEndEvent = CustomEvent<Record<PropertyKey, never>>;

declare global {
  interface GlobalEventHandlersEventMap {
    'cx-content-browser-grid-scroll-end': CxContentBrowserGridScrollEndEvent;
  }
}
