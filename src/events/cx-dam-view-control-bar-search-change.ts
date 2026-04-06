export type CxDamViewControlBarSearchChangeEvent = CustomEvent<{
  searchText: string;
}>;

declare global {
  interface GlobalEventHandlersEventMap {
    'cx-dam-view-control-bar-search-change': CxDamViewControlBarSearchChangeEvent;
  }
}
