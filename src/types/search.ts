export type Folder = {
  id: string;
  title: string;
  docType: string;
  path: string[];
  parents: Folder[];
  fullPath: string;
  hasChildren: boolean;
  icon?: string;
};

export type Asset = {
  docType: MediaType;
  docSubType: string;
  extension: string;
  height?: string;
  id: string;
  identifier: string;
  imageUrl: string;
  originalUrl: string;
  name: string;
  scrubUrl: string;
  size: string;
  tags: string;
  width?: string;
  allowATSLink?: boolean;
  recordId: string;
};

export type ContentItem = {
  fields: {
    [key: string]: string;
  };
  recordID: string;
};

export type Facet = {
  facetDetails: {
    displayName: string;
    facetFieldName: string;
  };
  values: {
    count: number;
    displayValue: string;
    value: string;
  }[];
};

export type GetContentResponse = {
  contentItems?: ContentItem[];
  facets: Facet[];
  totalCount: number;
};

export type GetContentRequest = {
  folderID?: string;
  isSeeThrough?: boolean;
  limitedToDocTypes?: string[];
  pageSize?: number;
  searchText?: string;
  selectedFacets?: Record<string, string[]>;
  sortOrder?: string;
  start?: number;
  useSession?: string;
};

export type AssetLinkInfo = {
  cdnName: string | null;
  extension: string | null;
  isCustomFormat: boolean | null;
  permanentLink: string | null;
  proxyLabel: string | null;
  proxyName: string | null;
  width: number | null;
  height: number | null;
};

export type AssetTransformationInfo = {
  extension: string | null;
  isCustomFormat: boolean | null;
  height: number | null;
  width: number | null;
  permanentLink: string | null;
};

export type GetAssetLinkResponse = {
  extraFields?: {
    [key: string]: string;
  };
  imageUrl: string;
  metadata?: {
    [key: string]: string;
  };
  assetLinkInfo?: AssetLinkInfo | AssetTransformationInfo;
  assetTransformationSource?: AssetLinkInfo;
};

export type GetTransformedAssetLinkResponse = {
  expirationDate: string | null,
  fileExtension: string | null,
  format: string,
  identifier: string,
  imageResizingMethod: string | null
  link: string,
  maxHeight: number,
  maxWidth: number,
  recordID: string,
};

export type GetFavoritesResponse = {
  favoriteRecordIds: string[] | null;
};

export type GetFoldersRequest = {
  allowedFolders?: string[];
  folder?: Folder;
  searchText: string;
  useSession?: string;
  start?: number;
  pageSize?: number;
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

export enum GridView {
  Small = 'small',
  Medium = 'medium',
  Large = 'large',
}

export enum SortDirection {
  Ascending = 'ascending',
  Descending = 'descending',
}

export type Filter = {
  mediaTypes: string[],
  visibilityClasses: string[],
  statuses: string[],
  extensions: string[],
};

export type Proxy = {
  cdnName: string | null;
  extension: string | null;
  id: string;
  formatHeight: number;
  formatWidth: number;
  height: number;
  permanentLink: string | null;
  proxyLabel: string;
  proxyName: string;
  width: number;
};