import { AssetImage } from './search';

export type GetLargestDownloadLinkRes = {
  downloadLink: string;
};

export type AssetsState = {
  selectedAssets: AssetImage[];
  onlyIIIFPrefix: boolean;
  importProxy?: string;
  isProxyModalOpen: boolean;
  isImporting: boolean;
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
