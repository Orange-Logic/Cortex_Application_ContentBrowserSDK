import type { TrackingParameter } from '@/types/asset';

export type CxContentBrowserAssetTrackingParametersChangeEvent = CustomEvent<{
  values: TrackingParameter[];
}>;

declare global {
  interface GlobalEventHandlersEventMap {
    'cx-content-browser-asset-tracking-parameters-change': CxContentBrowserAssetTrackingParametersChangeEvent;
  }
}
