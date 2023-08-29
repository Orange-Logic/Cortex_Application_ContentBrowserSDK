import { AssetImage } from './search';

export type GetLargestDownloadLinkRes = {
  downloadLink: string;
};

export type AssetsState = {
  isImporting: boolean;
  downloadState: {
    [imageId in string]: {
      name: string;
      status: ImageImportStatus;
      message: string;
    };
  };
  downloadAbortController?: AbortController;
  onlyIIIFPrefix: boolean;
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
