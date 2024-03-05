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

  let errorMessage: string = '';
  // Loop through all selected assets to replace Image url by IIIF urls
  const result = (await Promise.all(assets.map(async (asset) => {
    const response  = await cortexFetch(baseUrl + asset.id, { method: 'GET' });
    let responseData: GetAssetLinkResponse | null = null;
    if (response.ok) {
      responseData = await response.json();
    }

    if (!responseData) {
      errorMessage += `Failed to retrive asset link and metadata for asset ${asset.id}.\n`;
      return {
        imageUrl: asset.imageUrl,
      } as GetAssetLinkResponse;
    }

    responseData.imageUrl += onlyIIIFPrefix ? '' : '/full/max/0.0/default.jpg';
    return responseData;
  })));

  if (!!errorMessage) {
    throw new Error(errorMessage);
  }

  return result;
};

