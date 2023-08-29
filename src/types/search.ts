export type Folder = {
  id: string;
  title: string;
  docType: string;
  path: string[];
  fullPath: string;
};

export type AssetImage = {
  id: string;
  name: string;
  imageUrl: string;
  tags: string;
  width: string;
  height: string;
  size: string;
};

export type ContentItem = {
  recordID: string;
  fields: {
    [key: string]: string;
  };
};

export type GetContentResponse = {
  contentItems?: ContentItem[];
  totalCount: number;
};

export type GetContentRequest = {
  folderID: string;
  searchText: string;
  page: number;
  isSeeThrough: boolean;
};

export interface GetAssetLinkResponse {
  imageUrl: string;
  metadata?: {
    [key: string]: string;
  }
  extraFields?: {
    [key: string]: string;
  }
}
