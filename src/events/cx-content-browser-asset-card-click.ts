export type CxContentBrowserAssetCardClickEvent = CustomEvent<{
  id: string;
}>;

declare global {
  interface GlobalEventHandlersEventMap {
    'cx-content-browser-asset-card-click': CxContentBrowserAssetCardClickEvent;
  }
}
