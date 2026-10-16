export interface CxContentBrowserGridClickEvent extends CustomEvent<{ id: string }> {
  detail: {
    id: string;
  };
}

declare global {
  interface GlobalEventHandlersEventMap {
    'cx-content-browser-grid-click': CxContentBrowserGridClickEvent;
  }
}
