import { Asset } from './search';

export type GetLargestDownloadLinkRes = {
  downloadLink: string;
};

export type AssetsState = {
  errorMessage?: string;
  selectedAssetId?: string;
};

export enum ImageImportStatus {
  Importing,
  Success,
  Failed,
}

export type ImageImport = {
  image: Asset;
  message?: string;
  status: ImageImportStatus;
};

export enum TransformationAction {
  Resize,
  Crop,
  Rotate,
  Quality,
  KeepMetadata,
}

export type Transformation = {
  key: TransformationAction;
  value: {
    width?: number;
    height?: number;
    x?: number;
    y?: number;
    rotation?: number;
    keepMetadata?: boolean;
    quality?: number;
  };
};

export type TrackingParameter = { key: string; value: string };

export enum Unit {
  Pixel = 'pixels',
  AspectRatio = 'aspect-ratio',
}

export type SortOrder = {
  description: string;
  id: string;
  isDefault?: boolean;
  legacyValue: string;
  name: string;
  sortDirection: string;
  sortDirectionDisplayName: string;
  sortDirectionGroupKey: string;
  sortType: string;
};


/**
* ShowDialog: no loader, the format dialog is ready to open
* 
* ShowLoader : show loader, hide the format dialog
* 
* Hide: hide loader, hide the format dialog
*/
export enum FormatLoaderState {
  Hide = 'hide',
  ShowLoader = 'show-loader',
  ShowDialog = 'show-dialog',
}