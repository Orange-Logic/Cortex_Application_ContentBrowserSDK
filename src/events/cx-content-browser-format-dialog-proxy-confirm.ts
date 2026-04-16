import { GetAssetLinksRequest } from '@/types/asset';

export type CxContentBrowserFormatDialogProxyConfirmEvent = CustomEvent<GetAssetLinksRequest>;

declare global {
  interface GlobalEventHandlersEventMap {
    'cx-content-browser-format-dialog-proxy-confirm': CxContentBrowserFormatDialogProxyConfirmEvent;
  }
}
