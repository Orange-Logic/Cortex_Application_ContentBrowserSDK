export type CxContentBrowserPinAssetChangeEvent = CustomEvent<{
  assetId: string;
  isPinned: boolean;
}>;

declare global {
  interface GlobalEventHandlersEventMap {
    'cx-content-browser-pin-asset-change': CxContentBrowserPinAssetChangeEvent;
  }
}
