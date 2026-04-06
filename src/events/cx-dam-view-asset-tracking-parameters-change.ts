import type { TrackingParameter } from '@/types/asset';

export type CxDamViewAssetTrackingParametersChangeEvent = CustomEvent<{
  values: TrackingParameter[];
}>;

declare global {
  interface GlobalEventHandlersEventMap {
    'cx-dam-view-asset-tracking-parameters-change': CxDamViewAssetTrackingParametersChangeEvent;
  }
}
