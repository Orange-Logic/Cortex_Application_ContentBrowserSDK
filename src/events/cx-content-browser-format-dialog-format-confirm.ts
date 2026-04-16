import { Asset, AssetLinkInfo, AssetTransformationInfo, TrackingParameter } from '@/types/asset';
import { Transformation } from '@/types/content-browser';

export type CxContentBrowserFormatDialogFormatConfirmEvent = CustomEvent<{
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
    'cx-content-browser-format-dialog-format-confirm': CxContentBrowserFormatDialogFormatConfirmEvent;
  }
}
