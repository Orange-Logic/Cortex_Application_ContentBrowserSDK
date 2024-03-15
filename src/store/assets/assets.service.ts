import { AssetImage, GetAssetLinkResponse } from '../../types/search';
import { cortexFetch } from '../../utils/api';

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
  // Loop through all selected assets to replace Image url by IIIF urls
  const result = (await Promise.all(assets.map(async (asset) => {
    const response  = await cortexFetch(baseUrl + asset.id, { method: 'GET' });
    let responseData: GetAssetLinkResponse | null = null;
    responseData = await response.json();

    if (!response.ok || !responseData) {
      failToImportAssets.push(asset.name);
      return {
        imageUrl: asset.imageUrl,
      } as GetAssetLinkResponse;
    }

    responseData.imageUrl += onlyIIIFPrefix ? '' : '/full/max/0.0/default.jpg';
    return responseData;
  })));

  if (failToImportAssets.length > 0) {
    throw new Error("You don't have permission to import the following assets: " + failToImportAssets.join(', '));
  }

  return result;
};

