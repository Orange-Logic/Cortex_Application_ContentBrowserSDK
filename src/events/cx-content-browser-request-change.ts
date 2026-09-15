import { GetAssetsRequest } from '@/types/asset';
import { ContentBrowserView } from '@/types/content-browser';

export type CxContentBrowserRequestChangeEvent = CustomEvent<{
  request: GetAssetsRequest | null;
  view: ContentBrowserView;
}>;

declare global {
  interface GlobalEventHandlersEventMap {
    'cx-content-browser-request-change': CxContentBrowserRequestChangeEvent;
  }
}
