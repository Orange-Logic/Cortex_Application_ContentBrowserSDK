/**
 * Fired synchronously before the format dialog opens for an asset, so a listener can
 * mutate `detail.isAssetPinned` in place (the dispatcher reads it back once `dispatchEvent`
 * returns) — the DOM-event equivalent of a synchronous host callback like `getPinnedState`.
 */
export type CxContentBrowserPinAssetLookupEvent = CustomEvent<{
  assetId: string;
  isAssetPinned: boolean;
}>;

declare global {
  interface GlobalEventHandlersEventMap {
    'cx-content-browser-pin-asset-lookup': CxContentBrowserPinAssetLookupEvent;
  }
}
