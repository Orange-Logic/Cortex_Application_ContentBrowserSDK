export interface CortexErrorResponse {
  Message: string;
  ErrorCode: 'OL_ERR_001_NOTFOUND' | 'OL_ERR_002_NOTALLOWED' | 'OL_ERR_003_REMOVED' | 'OL_ASSETLINKSERVICE_ERROR_001_LINKS_TO_NON_REQUIRED_FORMATS_NOT_ALLOWED' | 'OL_ERR_006_BADREQUEST';
  'Asset ID': string;
  'Asset Identifier'?: string;
}
