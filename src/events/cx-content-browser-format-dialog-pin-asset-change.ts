export type CxContentBrowserFormatDialogPinAssetChangeEvent = CustomEvent<{
  assetId: string;
  isPinned: boolean;
}>;

declare global {
  interface GlobalEventHandlersEventMap {
    'cx-content-browser-format-dialog-pin-asset-change': CxContentBrowserFormatDialogPinAssetChangeEvent;
  }
}
