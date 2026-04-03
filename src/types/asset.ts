export type AssetVersion = {
  createByEmail: string;
  fileImportDate: string;
  scrubUrl: string;
  versionCreateDate: string;
  versionFileName: string;
  versionFileUrl: string;
  versionId: string;
  versionNumber: number;
  versionNumberDisplay: string;
};

export type AvailableProxy = {
  cdnName: string | null;
  extension: string | null;
  formatHeight: number;
  formatWidth: number;
  height: number;
  id: string;
  permanentLink: string | null;
  proxyLabel: string;
  proxyName: string;
  width: number;
};

export type TrackingParameter = {
  key: string;
  value: string;
};

export enum MediaType {
  Album = 'Album',
  Audio = 'Audio',
  Image = 'Image',
  Multimedia = 'Multimedia',
  Story = 'Story',
  Video = 'Video',
  Widget = 'Widget',
}

export type Asset = {
  allowATSLink?: boolean;
  docSubType: string;
  docType: MediaType;
  extension: string;
  height?: string;
  id: string;
  identifier: string;
  imageUrl: string;
  inColdStorage?: boolean;
  name: string;
  originalUrl: string;
  recordId: string;
  scrubUrl?: string;
  size: string;
  tags: string;
  width?: string;
};

export type AssetLinkInfo = {
  cdnName: string | null;
  extension: string | null;
  height: number | null;
  isCustomFormat: boolean | null;
  permanentLink: string | null;
  proxyLabel: string | null;
  proxyName: string | null;
  width: number | null;
};

export type AssetTransformationInfo = {
  extension: string | null;
  height: number | null;
  isCustomFormat: boolean;
  permanentLink: string | null;
  width: number | null;
};

export type GetAssetLinksRequest = {
  asset: Asset;
  extension: string;
  extraFields?: string[];
  parameters?: TrackingParameter[];
  permanentLink?: string;
  proxiesPreference?: string;
  proxyPreference?: string;
  selectedProxyMetadata?: AssetLinkInfo;
  useRepresentative?: boolean;
};

export type GetAssetsRequest = {
  folderId?: string;
  isSeeThrough?: boolean;
  limitedToDocTypes?: string[];
  pageSize?: number;
  searchText?: string;
  selectedFacets?: Record<string, string[]>;
  sortDirection?: string;
  sortOrder?: string;
  sortOrderName?: string;
  start?: number;
  useSession?: string;
};

// folderID?: string;
