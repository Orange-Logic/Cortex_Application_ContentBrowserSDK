type FavoriteChange = {
  assetId: string;
  isFavorite: boolean;
};

export type CxContentBrowserFavoriteChangeEvent = CustomEvent<FavoriteChange>;

export type CxContentBrowserFavoriteChangedStatusEvent = CustomEvent<FavoriteChange>;

declare global {
  interface GlobalEventHandlersEventMap {
    'cx-content-browser-favorite-change': CxContentBrowserFavoriteChangeEvent;
    'cx-content-browser-favorite-changed-status': CxContentBrowserFavoriteChangedStatusEvent;
  }
}
