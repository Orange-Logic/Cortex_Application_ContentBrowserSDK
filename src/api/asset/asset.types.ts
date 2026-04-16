import { Asset, AssetVersion, AvailableProxy, MediaType, TrackingParameter } from '@/types/asset';
import { Facet, Transformation } from '@/types/content-browser';

export type CortexErrorResponse = {
  'Asset ID'?: string;
  'Asset Identifier'?: string;
  ErrorCode: 'OL_ERR_001_NOTFOUND' | 'OL_ERR_002_NOTALLOWED' | 'OL_ERR_003_REMOVED' | 'OL_ASSETLINKSERVICE_ERROR_001_LINKS_TO_NON_REQUIRED_FORMATS_NOT_ALLOWED' | 'OL_ERR_006_BADREQUEST';
  'Format'?: string;
  Message: string;
};

export type ContentItem = {
  fields: {
    [key: string]: string;
  };
  recordID: string;
};

export type GetAssetLinkRequest = {
  ExtraFields?: string;
  Proxy?: string;
  RecordId: string;
  Token?: string;
};

export type GetAssetLinkResponse = {
  assetLinkInfo?: {
    [key: string]: string | number | boolean | null;
  };
  extraFields?: {
    [key: string]: string | number | boolean | null;
  };
  imageUrl: string;
  metadata?: {
    [key: string]: string | number | boolean | null;
  };
};

export type GetContentResponse = {
  contentItems?: ContentItem[];
  facets: Facet[];
  totalCount: number;
};

export type GetAssetsByIDsRequest = {
  extraFields?: string[];
  recordIds: string[];
  token?: string;
};

export type GetAssetsByIDsResponse = {
  facets: Facet[];
  items: Array<
  Pick<Asset, 'recordId' | 'originalUrl' | 'name'> & Record<string, string>
  >;
  totalCount: number;
};

export type GetAssetsRawResponse = {
  contentItems?: ContentItem[];
  facets: Facet[];
  totalCount: number;
};

export type GetAssetsResponse = {
  facets: Facet[];
  items: Array<Asset & Record<string, string | boolean>>;
  totalCount: number;
};

export type GetAvailableProxiesRequest = {
  assetRecordId: string;
  siteUrl?: string;
  token?: string;
};

export type GetAvailableProxiesRawResponse = {
  proxies: Array<{
    cdnName: string | null;
    extension: string | null;
    formatHeight: number;
    formatWidth: number;
    height: number;
    permanentLink: string | null;
    proxyLabel: string;
    proxyName: string;
    width: number;
  }>;
};

export type GetAvailableProxiesResponse = AvailableProxy[];

export type FormatsByDocType = {
  Audio: Record<string, string>;
  Image: Record<string, string>;
  Multimedia: Record<string, string>;
  Video: Record<string, string>;
};

export type GetAssetVersionHistoryResponse = {
  count: number;
  versions: AssetVersion[];
};

export type GetAvailableExtensionsResponse = Record<MediaType, Array<{ displayName: string; value: string }>>;

export type GetAssetLinksRequest = {
  assets: Asset[];
  extension?: string;
  extraFields?: string[];
  maxHeight?: number;
  maxWidth?: number;
  parameters?: TrackingParameter[];
  permanentLink?: string;
  proxyPreference?: string;
  token?: string;
  transformations?: Transformation[];
  useSession?: string;
};
