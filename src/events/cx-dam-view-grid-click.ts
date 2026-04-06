export interface CxDamViewGridClickEvent extends CustomEvent<{ id: string }> {
  detail: {
    id: string;
  };
}

declare global {
  interface GlobalEventHandlersEventMap {
    'cx-dam-view-grid-click': CxDamViewGridClickEvent;
  }
}
