export type CxContentBrowserHeaderCloseEvent = CustomEvent<Record<PropertyKey, never>>;

declare global {
  interface GlobalEventHandlersEventMap {
    'cx-content-browser-header-close': CxContentBrowserHeaderCloseEvent;
  }
}
