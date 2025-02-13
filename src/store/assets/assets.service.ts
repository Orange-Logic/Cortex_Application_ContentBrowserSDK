import { store } from '..';
import { CortexErrorResponse, StringTable } from '../../types/common';
import { AssetImage, GetAssetLinkResponse } from '../../types/search';
import { cortexFetch } from '../../utils/api';
import { UniqueArray } from '../../utils/array';
import { IsStringFilled } from '../../utils/string';
import { assetsApi } from './assets.api';
import { storedProxiesPreferenceSelector } from './assets.slice';

export const getAssetLinks = async (
  assets: AssetImage[],
  extraFields?: string,
  onlyIIIFPrefix?: boolean,
  proxyPreference?: Partial<StringTable>,
): Promise<GetAssetLinkResponse[]> => {
  let baseUrl = '/webapi/extensibility/integrations/gab/assetbrowser/GetAssetLink_4by?';
  if (!!extraFields)
    baseUrl += `ExtraFields=${extraFields}&`;
  baseUrl += 'RecordId=';

  const getAssetLinkErrors: { [key: string]: AssetImage[] } = {};
  const failToImportAssets: string[] = [];
  const isOnlyOneAssetSelected = assets.length === 1;
  // Loop through all selected assets to replace Image url by IIIF urls
  const result = (await Promise.all(assets.map(async (asset) => {
    let url = baseUrl + asset.id;
    if (proxyPreference && proxyPreference[asset.docType]) {
      url += `&Proxy=${proxyPreference[asset.docType]}`;
    }
    const response  = await cortexFetch(url, { method: 'GET' });
    let responseData: GetAssetLinkResponse | CortexErrorResponse | null = null;
    responseData = await response.json();

    if (!response.ok || !responseData) {
      // We will give more details error message if only one asset was imported
      if (isOnlyOneAssetSelected && responseData) {
        const errorResponseData = responseData as CortexErrorResponse;
        if (!getAssetLinkErrors[errorResponseData.ErrorCode]) {
          getAssetLinkErrors[errorResponseData.ErrorCode] = [asset];
        } else {
          getAssetLinkErrors[errorResponseData.ErrorCode].push(asset);
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
    Object.entries(getAssetLinkErrors).reduce((acc, [errorCode, assetsWithError]) => {
      const namesOfAssetWithError = assetsWithError.map(asset => asset.name).join(', ');

      switch (errorCode) {
        case 'OL_ERR_001_NOTFOUND':
          acc.push(`${namesOfAssetWithError} not found`);
          break;
        case 'OL_ASSETLINKSERVICE_ERROR_001_LINKS_TO_NON_REQUIRED_FORMATS_NOT_ALLOWED':
          const proxies           = assetsApi.endpoints.getAvailableProxies.select({})(store.getState()).data?.proxiesForDocType;
          const selectedProxy     = storedProxiesPreferenceSelector(store.getState());
          const docTypesWithIssue = UniqueArray(assetsWithError, (asset) => asset.docType).map(asset => asset.docType);
          if (!proxies || !selectedProxy || !docTypesWithIssue.every(docType => IsStringFilled(selectedProxy[docType]))) {
            acc.push(`Failed to import ${namesOfAssetWithError}. Change the import proxy in Settings or re-check your permission`);
          } else {
            const docTypesToProxyName = docTypesWithIssue.map(docType => `${proxies[selectedProxy[docType] as string]} for ${docType}`).join(' and ');

            acc.push(`Failed to import ${docTypesToProxyName} quality.\nChange the import proxy in Settings or re-check your permission.\n These asset are not imported: ${namesOfAssetWithError}`);
          }
          break;
        case 'OL_ERR_002_NOTALLOWED':
          acc.push(`You don't have permission to import ${namesOfAssetWithError}`);
          break;
        case 'OL_ERR_003_REMOVED':
          acc.push(`${namesOfAssetWithError} was removed`);
          break;
        case 'OL_ERR_006_BADREQUEST':
        default:
          acc.push(`Failed to import asset ${namesOfAssetWithError}`);
          break;
      }
      return acc;
    }, [] as string[]);

    throw new Error('Failed to import the following assets: ' + failToImportAssets.join('\n '));
  }

  return result;
};

