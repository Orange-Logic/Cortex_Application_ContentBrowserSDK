export type CxDamViewAssetCardClickEvent = CustomEvent<{
  id: string;
}>;

declare global {
  interface GlobalEventHandlersEventMap {
    'cx-dam-view-asset-card-click': CxDamViewAssetCardClickEvent;
  }
}
