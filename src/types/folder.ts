export enum FolderSelectVariant {
  Input = 'input',
  Select = 'select',
}

export type Folder = {
  docType: string;
  fullPath: string;
  hasChildren: boolean;
  id: string;
  isShared?: boolean;
  representativeAssetId?: string;
  title: string;
  url?: string;
};

export type GetFolderResponse = {
  data: Folder[];
  hasMore: boolean;
  totalCount: number;
};

export type GetFolderRequest = {
  allowedFolders?: string[];
  baseUrl?: string;
  bearerToken?: string;
  excludeVirtualFolders?: boolean;
  folderId: string;
  includeDirectChild?: boolean;
  limit?: number;
  searchTerm?: string;
  seeThru?: boolean;
  self?: boolean;
  start?: number;
  token?: string;
  useSession?: string;
};

export type FolderSelectApi = (
  params: GetFolderRequest,
) => Promise<GetFolderResponse>;
