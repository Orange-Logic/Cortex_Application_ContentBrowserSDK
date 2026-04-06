type FavoriteChange = {
  assetId: string;
  isFavorite: boolean;
};

export type CxDamViewFavoriteChangeEvent = CustomEvent<FavoriteChange>;

export type CxDamViewFavoriteChangedStatusEvent = CustomEvent<FavoriteChange>;

declare global {
  interface GlobalEventHandlersEventMap {
    'cx-dam-view-favorite-change': CxDamViewFavoriteChangeEvent;
    'cx-dam-view-favorite-changed-status': CxDamViewFavoriteChangedStatusEvent;
  }
}
