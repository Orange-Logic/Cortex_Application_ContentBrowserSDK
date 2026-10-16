export type CxContentBrowserGridRetryEvent = CustomEvent<Record<PropertyKey, never>>;

declare global {
  interface GlobalEventHandlersEventMap {
    'cx-content-browser-grid-retry': CxContentBrowserGridRetryEvent;
  }
}
