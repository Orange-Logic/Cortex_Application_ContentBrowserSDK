export type CxDamViewGridResizeEvent = CustomEvent<{
  columnCount: number;
  rowCount: number;
}>;

declare global {
  interface GlobalEventHandlersEventMap {
    'cx-dam-view-grid-resize': CxDamViewGridResizeEvent;
  }
}
