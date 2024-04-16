import { store } from '..';
import { CortexErrorResponse } from '../../types/common';
import { AssetImage, GetAssetLinkResponse } from '../../types/search';
import { cortexFetch } from '../../utils/api';
import { assetsApi } from './assets.api';
import { importProxySelector } from './assets.slice';

export const getAssetLinks = async (
  assets: AssetImage[],
  extraFields?: string,
  onlyIIIFPrefix?: boolean,
  proxy?: string,
): Promise<GetAssetLinkResponse[]> => {
  let baseUrl = '/webapi/extensibility/integrations/gab/assetbrowser/GetAssetLink_4by?';
  if (!!extraFields)
    baseUrl += `ExtraFields=${extraFields}&`;
  if (!!proxy)
    baseUrl += `Proxy=${proxy}&`;
  baseUrl += 'RecordId=';

  const errorMessages: { [key: string]: string[] } = {};
  const failToImportAssets: string[] = [];
  const isOnlyOneAssetSelected = assets.length === 1;
  // Loop through all selected assets to replace Image url by IIIF urls
  const result = (await Promise.all(assets.map(async (asset) => {
    const response  = await cortexFetch(baseUrl + asset.id, { method: 'GET' });
    let responseData: GetAssetLinkResponse | CortexErrorResponse | null = null;
    responseData = await response.json();

    if (!response.ok || !responseData) {
      // We will give more details error message if only one asset was imported
      if (isOnlyOneAssetSelected && responseData) {
        const errorResponseData = responseData as CortexErrorResponse;
        if (!errorMessages[errorResponseData.ErrorCode]) {
          errorMessages[errorResponseData.ErrorCode] = [asset.name];
        } else {
          errorMessages[errorResponseData.ErrorCode].push(asset.name);
        }
      } else {
        failToImportAssets.push(asset.name);
      }
      return {
        imageUrl: asset.imageUrl,
      } as GetAssetLinkResponse;
    }

    (responseData as GetAssetLinkResponse).imageUrl += onlyIIIFPrefix ? '' : '/full/max/0.0/default.jpg';
    return responseData as GetAssetLinkResponse;
  })));

  

  if (failToImportAssets.length > 0) {
    Object.keys(errorMessages).reduce((acc, curr) => {
      switch (curr) {
        case 'OL_ERR_001_NOTFOUND':
          acc.push(`${errorMessages[curr].join(', ')} not found`);
          break;
        case 'OL_ASSETLINKSERVICE_ERROR_001_LINKS_TO_NON_REQUIRED_FORMATS_NOT_ALLOWED':
          const proxies = assetsApi.endpoints.getAvailableProxies.select()(store.getState()).data?.proxies;
          const selectedProxy = importProxySelector(store.getState());
          const qualityName = !proxies || !selectedProxy
            ? 'selected'
            : Object.keys(proxies).find(key => proxies[key] == selectedProxy)?.toLowerCase();
          acc.push(`Failed to import ${qualityName} quality of ${errorMessages[curr].join(', ')}.\nChange the import proxy in Settings or re-check your permission`);
          break;
        case 'OL_ERR_002_NOTALLOWED':
          acc.push(`You don't have permission to import ${errorMessages[curr].join(', ')}`);
          break;
        case 'OL_ERR_003_REMOVED':
          acc.push(`${errorMessages[curr].join(', ')} was removed`);
          break;
        case 'OL_ERR_006_BADREQUEST':
        default:
          acc.push(`Failed to import asset ${errorMessages[curr].join(', ')}`);
          break;
      }
      return acc;
    }, [] as string[]);

    throw new Error('Failed to import the following assets: ' + failToImportAssets.join('\n '));
  }

  return result;
};

