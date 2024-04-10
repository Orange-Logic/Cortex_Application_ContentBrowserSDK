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
        let errorMessage: string;
        const errorResponseData = responseData as CortexErrorResponse;
        switch (errorResponseData.ErrorCode) {
          case 'OL_ERR_001_NOTFOUND':
            errorMessage = `${asset.name} is not found`;
            break;
          case 'OL_ASSETLINKSERVICE_ERROR_001_LINKS_TO_NON_REQUIRED_FORMATS_NOT_ALLOWED':
            const proxies = assetsApi.endpoints.getAvailableProxies.select()(store.getState()).data?.proxies;
            const selectedProxy = importProxySelector(store.getState());
            if (!proxies || !selectedProxy) {
              errorMessage = `You don't have permission to import selected quality of ${asset.name}`;
            } else {
              errorMessage = `You don't have permission to import ${Object.keys(proxies).find(key => proxies[key] == selectedProxy)} quality of ${asset.name}`;
            }
            break;
          case 'OL_ERR_002_NOTALLOWED':
            errorMessage = `You don't have permission to import ${asset.name}`;
            break;
          case 'OL_ERR_003_REMOVED':
            errorMessage = `${asset.name} was removed`;
            break;
          case 'OL_ERR_006_BADREQUEST':
          default:
            errorMessage = `Failed to import asset ${asset.name}`;
            if (errorResponseData.Message) {
              errorMessage += `. Message: ${errorResponseData.Message}`;
            }
            break;
        }
        failToImportAssets.push(errorMessage);
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
    if (isOnlyOneAssetSelected) {
      throw new Error(failToImportAssets[0]);
    }
    throw new Error('Failed to import the following assets: ' + failToImportAssets.join(', '));
  }

  return result;
};

