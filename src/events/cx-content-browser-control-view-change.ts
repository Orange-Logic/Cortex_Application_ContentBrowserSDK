import { ContentBrowserView } from '@/types/content-browser';

export type CxContentBrowserControlViewChangeEvent = CustomEvent<{
  isSeeThrough: boolean;
  view: ContentBrowserView;
}>;

declare global {
  interface GlobalEventHandlersEventMap {
    'cx-content-browser-control-view-change': CxContentBrowserControlViewChangeEvent;
  }
}
