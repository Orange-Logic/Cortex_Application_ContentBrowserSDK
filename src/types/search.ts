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
};

export type ContentItem = {
  fields: {
    [key: string]: string;
  };
  recordID: string;
};

export type GetContentResponse = {
  contentItems?: ContentItem[];
  facets: Record<string, Record<string, number>>;
  totalCount: number;
};

export type GetContentRequest = {
  extensions: string[];
  folderID: string;
  isSeeThrough: boolean;
  mediaTypes: string[];
  start: number;
  pageSize: number;
  searchText: string;
  sortOrder?: string;
  statuses: string[];
  visibilityClasses: string[];
  useSession?: string;
};

export type GetAssetLinkResponse = {
  extraFields?: {
    [key: string]: string;
  };
  imageUrl: string;
  metadata?: {
    [key: string]: string;
  };
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