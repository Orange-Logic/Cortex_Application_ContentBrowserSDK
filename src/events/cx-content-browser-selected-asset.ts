export type CxContentBrowserSelectedAssetEvent = CustomEvent<Array<Record<string, unknown>>>;

declare global {
  interface GlobalEventHandlersEventMap {
    'cx-content-browser-selected-asset': CxContentBrowserSelectedAssetEvent;
  }
}
