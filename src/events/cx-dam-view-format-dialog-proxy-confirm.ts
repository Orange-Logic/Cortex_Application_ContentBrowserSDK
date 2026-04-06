import { GetAssetLinksRequest } from '@/types/asset';

export type CxDamViewFormatDialogProxyConfirmEvent = CustomEvent<GetAssetLinksRequest>;

declare global {
  interface GlobalEventHandlersEventMap {
    'cx-dam-view-format-dialog-proxy-confirm': CxDamViewFormatDialogProxyConfirmEvent;
  }
}
