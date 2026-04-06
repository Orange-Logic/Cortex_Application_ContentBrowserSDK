import { Asset, AssetLinkInfo, AssetTransformationInfo, TrackingParameter } from '@/types/asset';
import { Transformation } from '@/types/dam-view';

export type CxDamViewFormatDialogFormatConfirmEvent = CustomEvent<{
  asset: Asset;
  extension?: string;
  parameters?: TrackingParameter[];
  proxiesPreference?: string;
  sourceProxyMetadata?: AssetLinkInfo;
  transformations?: Transformation[];
  transformedAssetMetadata?: AssetTransformationInfo;
}>;

declare global {
  interface GlobalEventHandlersEventMap {
    'cx-dam-view-format-dialog-format-confirm': CxDamViewFormatDialogFormatConfirmEvent;
  }
}
