import { GetAssetsRequest } from '@/types/asset';
import { GridView } from '@/types/content-browser';

export type CxContentBrowserRequestChangeEvent = CustomEvent<{
  request: GetAssetsRequest | null;
  view: GridView;
}>;

declare global {
  interface GlobalEventHandlersEventMap {
    'cx-content-browser-request-change': CxContentBrowserRequestChangeEvent;
  }
}
