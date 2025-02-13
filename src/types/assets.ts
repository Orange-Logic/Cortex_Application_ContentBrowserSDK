import { StringTable } from './common';
import { AssetImage } from './search';

export type GetLargestDownloadLinkRes = {
  downloadLink: string;
};

export type AssetsState = {
  selectedAssets: AssetImage[];
  onlyIIIFPrefix: boolean;
  storedProxiesPreference: Partial<StringTable>;
  /**
   * Used to control the proxy modal open/close state.
   */
  isProxyModalOpen: boolean;
  /**
   * isImporting occured when the asset import is confirmed by the user and we retrieve the import info (download link, metadata, ...) from the server.
   * It will be set to false when we return the import info to the user.
   */
  isImporting: boolean;
  errorMessage?: string;
};

export enum ImageImportStatus {
  Importing,
  Success,
  Failed,
}

export type ImageImport = {
  image: AssetImage;
  status: ImageImportStatus;
  message?: string;
};
