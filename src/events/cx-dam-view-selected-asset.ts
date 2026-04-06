export type CxDamViewSelectedAssetEvent = CustomEvent<Array<Record<string, unknown>>>;

declare global {
  interface GlobalEventHandlersEventMap {
    'cx-dam-view-selected-asset': CxDamViewSelectedAssetEvent;
  }
}
