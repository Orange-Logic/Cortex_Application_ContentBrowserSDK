export type CxDamViewControlFilterChangeEvent = CustomEvent<{
  selection: Record<string, string[]>;
}>;

declare global {
  interface GlobalEventHandlersEventMap {
    'cx-dam-view-control-filter-change': CxDamViewControlFilterChangeEvent;
  }
}
