export type CxDamViewFormatDialogFavoriteChangeEvent = CustomEvent<{
  assetId: string;
  isFavorite: boolean;
}>;

declare global {
  interface GlobalEventHandlersEventMap {
    'cx-dam-view-format-dialog-favorite-change': CxDamViewFormatDialogFavoriteChangeEvent;
  }
}
