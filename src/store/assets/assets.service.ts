import { store } from '@/store';
import { CortexErrorResponse } from '@/types/common';
import { Asset, GetAssetLinkResponse } from '@/types/search';
import { cortexFetch } from '@/utils/api';

import { assetsApi } from './assets.api';
import { TrackingParameter, Transformation, TransformationAction } from '@/types/assets';

export const getAssetLinks = async (
  {
    assets,
    extraFields,
    permanentLink,
    proxyPreference,
    transformations,
    parameters,
    extension,
    useSession,
  }: {
    assets: Asset[];
    extraFields?: string;
    permanentLink?: string;
    proxyPreference?: string;
    transformations?: Transformation[];
    parameters?: TrackingParameter[];
    maxWidth?: number;
    maxHeight?: number;
    extension?: string;
    useSession?: string;
  },
): Promise<GetAssetLinkResponse[]> => {
  let baseUrl = '/webapi/extensibility/integrations/contentBrowserSDK/GetAssetLink_4by?';
  if (useSession) {
    baseUrl += `UseSession=${useSession}&`;
  }
  if (extraFields) {
    baseUrl += `ExtraFields=${extraFields}&`;
  }
  if (permanentLink) {
    baseUrl += `GenerateAssetUrl=${false}&`;
  }
  baseUrl += 'RecordId=';

  const getAssetLinkErrors: { [key: string]: Asset[] } = {};
  const failToImportAssets: string[] = [];
  const isOnlyOneAssetSelected = assets.length === 1;
  // Loop through all selected assets to replace Image url by IIIF urls
  const result = (await Promise.all(assets.map(async (asset) => {
    let url = baseUrl + asset.id;
    if (proxyPreference) {
      url += `&Proxy=${proxyPreference}`;
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

    let imageUrl = permanentLink || (responseData as GetAssetLinkResponse).imageUrl;

    if (transformations && transformations.length > 0) {
      imageUrl += '/t/';
    }

    transformations?.forEach(({ key, value }) => {
      if (key === TransformationAction.Resize) {
        const validTransformations = [
          ...[
            {
              key: 're_w_',
              value: value.width,
            },
            {
              key: 're_h_',
              value: value.height,
            },
          ]
            .filter((item) => item.value !== undefined)
            .map((item) => ({
              key: item.key,
              value: Math.round(Number(item.value)),
            })),
          {
            key: 're_rm_',
            value: 'stretch',
          },
        ];
  
        validTransformations.forEach(({ key: vKey, value: vValue }, index) => {
          imageUrl += `${vKey}${vValue}${index < validTransformations.length - 1 ? ',' : ''}`;
        });

        imageUrl += '/';
      }
  
      if (key === TransformationAction.Crop) {
        const validTransformations = [
          ...[
            {
              key: 'c_w_',
              value: value.width,
            },
            {
              key: 'c_h_',
              value: value.height,
            },
            {
              key: 'c_x_',
              value: value.x,
            },
            {
              key: 'c_y_',
              value: value.y,
            },
          ]
            .filter((item) => item.value !== undefined)
            .map((item) => ({
              key: item.key,
              value: Math.round(Number(item.value)),
            })),
          {
            key: 'c_whu_',
            value: 'pixel',
          },
        ];
  
        validTransformations.forEach(({ key: vKey, value: vValue }, index) => {
          imageUrl += `${vKey}${vValue}${index < validTransformations.length - 1 ? ',' : ''}`;
        });

        imageUrl += '/';
      }
  
      if (key === TransformationAction.Rotate) {
        const validTransformations = [{
          key: 'r_a_',
          value: value.rotation,
        }].filter(item => item.value !== undefined).map(item => ({ key: item.key, value: Math.round(Number(item.value)) }));
  
        validTransformations.forEach(({ key: vKey, value: vValue }, index) => {
          imageUrl += `${vKey}${vValue}${index < validTransformations.length - 1 ? ',' : ''}`;
        });

        imageUrl += '/';
      }
    });

    if (transformations && transformations.length > 0) {
      imageUrl += `${asset.identifier}`;
    }

    if (!permanentLink) {
      imageUrl += `${extension ?? asset.extension}`;
    }

    const queryParams: string[] = [];

    if (parameters && parameters.length > 0) {
      parameters.forEach(({ key, value }) => {
        queryParams.push(`${encodeURIComponent(key.trim())}=${encodeURIComponent(value.trim())}`);
      });
    }

    if (useSession) {
      queryParams.push(`UseSession=${useSession}`);
    }

    if (queryParams.length > 0) {
      imageUrl += `?${queryParams.join('&')}`;
    }
    
    (responseData as GetAssetLinkResponse).imageUrl = imageUrl;
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
          const proxies           = assetsApi.endpoints.getAvailableProxies.select({})(store.getState()).data?.proxies;
          if (!proxies) {
            acc.push(`Failed to import ${namesOfAssetWithError}. Change the import proxy in Settings or re-check your permission`);
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