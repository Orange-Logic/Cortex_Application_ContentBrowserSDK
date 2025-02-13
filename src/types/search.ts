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
  docType: MediaType;
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
  mediaTypes: MediaType[];
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

export enum MediaType {
  Image = 'Image',
  Others = 'Multimedia',
  // Preserve for later use
  // Graphic = 'Graphic',
  // Video = 'Video',
  // Audio = 'Audio',
}
