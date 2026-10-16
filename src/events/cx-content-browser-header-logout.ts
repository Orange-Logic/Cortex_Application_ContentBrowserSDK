export type CxContentBrowserHeaderLogoutEvent = CustomEvent<Record<PropertyKey, never>>;

declare global {
  interface GlobalEventHandlersEventMap {
    'cx-content-browser-header-logout': CxContentBrowserHeaderLogoutEvent;
  }
}
