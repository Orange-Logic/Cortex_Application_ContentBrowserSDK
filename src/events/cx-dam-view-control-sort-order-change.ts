export type CxDamViewControlSortOrderChangeEvent = CustomEvent<{
  sortDirection: string;
  sortOrderName: string;
}>;

declare global {
  interface GlobalEventHandlersEventMap {
    'cx-dam-view-control-sort-order-change': CxDamViewControlSortOrderChangeEvent;
  }
}
