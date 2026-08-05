import { GridView } from '@/types/content-browser';

export type CxContentBrowserControlViewChangeEvent = CustomEvent<{
  isSeeThrough: boolean;
  view: GridView;
}>;

declare global {
  interface GlobalEventHandlersEventMap {
    'cx-content-browser-control-view-change': CxContentBrowserControlViewChangeEvent;
  }
}
