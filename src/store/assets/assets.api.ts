import { StringTable } from '@/types/common';
import { AssetImage, MediaType } from '@/types/search';
import { AppBaseQuery } from '@/utils/api';
import { HasElements, UniqueArray } from '@/utils/array';
import { createApi } from '@reduxjs/toolkit/query/react';

interface GetAvailableProxiesRequest {
  assetImages?: AssetImage[];
  docTypes?: string[];
}

/**
 * Example response:
 * ```json
 * {
 *   "proxiesForDocType": {
 *     "Image": {
 *       "TRX": "Highest Quality",
 *       "TR1": "Medium res.",
 *       "TR1_COMP": "Medium res. comp."
 *     }
 *   }
 * }
 * ```
 */
export interface GetAvailableProxiesResponse {
  proxiesForDocType: {
    [docType: string]: StringTable
  }
}

/**
 * get query parameter for AvailableProxies_4ea_v2 API
 * @param {GetAvailableProxiesRequest} 
 * @returns {string[][]}
 */
const getAvailableProxiesAPIParams = ({ assetImages, docTypes }: GetAvailableProxiesRequest): string[][] => {
  if (!HasElements(assetImages)) {
    docTypes = HasElements(docTypes) ? docTypes : Object.values(MediaType);

    return UniqueArray(docTypes as string[]).map(docType => ['DocTypes', docType]);
  } else {
    const assetDocTypes = UniqueArray(assetImages as AssetImage[], (asset) => asset.docType)
      .map(asset => ['DocTypes', asset.docType]);

    return (assetImages as AssetImage[]).map(asset => ['RecordIDs', asset.id]).concat(assetDocTypes);
  }
};

// Define a service using a base URL and expected endpoints
export const assetsApi = createApi({
  reducerPath: 'assetsApi',
  baseQuery: AppBaseQuery,
  tagTypes: ['AvailableProxies'],
  endpoints: (builder) => ({
    getAvailableProxies: builder.query<GetAvailableProxiesResponse, GetAvailableProxiesRequest>({
      query: (request) => ({
        url: '/webapi/extensibility/integrations/gab/assetbrowser/AvailableProxies_4ea_v2?',
        params: getAvailableProxiesAPIParams(request),
      }),
      serializeQueryArgs: ({ queryArgs }) => getAvailableProxiesAPIParams(queryArgs),
      providesTags: (_result, _error, _args) => ['AvailableProxies'],
    }),
  }),
});

// < { proxies: { [key: string]: string } }, void>

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetAvailableProxiesQuery } = assetsApi;
