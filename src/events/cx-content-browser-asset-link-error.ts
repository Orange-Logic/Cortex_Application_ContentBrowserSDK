import type { AssetLinkError } from '@/api/asset/asset';

export type CxContentBrowserAssetLinkErrorEvent = CustomEvent<{ error: AssetLinkError }>;

declare global {
  interface GlobalEventHandlersEventMap {
    'cx-content-browser-asset-link-error': CxContentBrowserAssetLinkErrorEvent;
  }
}
