export type CxContentBrowserFormatDialogFavoriteChangeEvent = CustomEvent<{
  assetId: string;
  isFavorite: boolean;
}>;

declare global {
  interface GlobalEventHandlersEventMap {
    'cx-content-browser-format-dialog-favorite-change': CxContentBrowserFormatDialogFavoriteChangeEvent;
  }
}
