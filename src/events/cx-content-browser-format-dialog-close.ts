export type CxContentBrowserFormatDialogCloseEvent = CustomEvent<Record<PropertyKey, never>>;

declare global {
  interface GlobalEventHandlersEventMap {
    'cx-content-browser-format-dialog-close': CxContentBrowserFormatDialogCloseEvent;
  }
}
