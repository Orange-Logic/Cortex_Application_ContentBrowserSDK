export type CxContentBrowserFormatDialogVersionHistoryOpenEvent = CustomEvent<{
  assetId: string;
}>;

declare global {
  interface GlobalEventHandlersEventMap {
    'cx-content-browser-format-dialog-version-history-open': CxContentBrowserFormatDialogVersionHistoryOpenEvent;
  }
}
