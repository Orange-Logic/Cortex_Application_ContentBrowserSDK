import { SortOrder } from '@/types/assets';
import { Asset, MediaType } from '@/types/search';
import { AppBaseQuery } from '@/utils/api';
import { hasElements, uniqueArray } from '@/utils/array';
import { createApi } from '@reduxjs/toolkit/query/react';

const Parameters = {
  ExtensionsThatSupportTransformationUsingATS: 'ExtensionsThatSupportTransformationUsingATS',
  EnableATSInGetLink: 'EnableATSInGetLink',
  CollectionSubtypeCriteria: 'CollectionSubtypeCriteria',
  SupportDocTypes: 'SupportDocTypes',
  RepresentativeSupportedDocSubType: 'RepresentativeSupportedDocSubType',
};

type GetAvailableProxiesRequest = {
  assetImages?: Asset[];
  docTypes?: string[];
  useSession?: string;
};

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
export type GetAvailableProxiesResponse = {
  proxiesForDocType: {
    [docType: string]: Record<string, string>[];
  }
};

const sanitizeSortOrder = (sortOrder: string) => {
  if (sortOrder.includes('First')) {
    return 'date created';
  }
  return sortOrder.replace(/(ASC|DESC)/, '').trim().toLowerCase();
};

/**
 * get query parameter for AvailableProxies_4ea_v2 API
 * @param {GetAvailableProxiesRequest} 
 * @returns {string[][]}
 */
const getAvailableProxiesAPIParams = ({ assetImages, docTypes, useSession }: GetAvailableProxiesRequest): string[][] => {
  let result = [];
  if (!hasElements(assetImages)) {
    docTypes = hasElements(docTypes) ? docTypes : Object.values(MediaType);

    result = uniqueArray(docTypes as string[]).map(docType => ['DocTypes', docType]);
  } else {
    const assetDocTypes = uniqueArray(assetImages as Asset[], (asset) => asset.docType)
      .map(asset => ['DocTypes', asset.docType]);

    result = (assetImages as Asset[]).map(asset => ['RecordIDs', asset.id]).concat(assetDocTypes);
  }

  if (useSession) {
    result.push(['UseSession', useSession]);
  }

  return result;
};

// Define a service using a base URL and expected endpoints
export const assetsApi = createApi({
  reducerPath: 'assetsApi',
  baseQuery: AppBaseQuery,
  tagTypes: ['AvailableProxies', 'Parameters', 'SortOrders'],
  endpoints: (builder) => ({
    getAvailableProxies: builder.query<GetAvailableProxiesResponse, GetAvailableProxiesRequest>({
      query: (request) => ({
        url: '/webapi/extensibility/integrations/gab/assetbrowser/AvailableProxies_4ea_v3?',
        params: getAvailableProxiesAPIParams(request),
      }),
      serializeQueryArgs: ({ queryArgs }) => getAvailableProxiesAPIParams(queryArgs),
      providesTags: (_result, _error, _args) => ['AvailableProxies'],
    }),
    getParameters: builder.query<{
      ATSEnabled: boolean;
      collectionPath: string;
      supportedExtensions: string[];
      supportedRepresentativeSubtypes: string[];
      supportedDocTypes: string[];
    }, {
      useSession?: string;
    }>({
      query: ({ useSession }) => {
        const params = [];

        if (useSession) {
          params.push(['UseSession', useSession]);
        }

        return {
          url: '/webapi/configuration/parameters/getparameters_412Z_v1',
          params,
        };
      },
      transformResponse: (response: Record<string, string>) => {
        return {
          ATSEnabled: response[Parameters.EnableATSInGetLink].toLowerCase() === 'true',
          collectionPath: response[Parameters.CollectionSubtypeCriteria]?.toLowerCase() ?? '',
          supportedDocTypes: response[Parameters.SupportDocTypes]?.split(/\r?\n/) ?? [],
          supportedExtensions: response[Parameters.ExtensionsThatSupportTransformationUsingATS]?.split('\n') ?? [],
          supportedRepresentativeSubtypes: response[Parameters.RepresentativeSupportedDocSubType]?.split('\r\n') ?? [],
        };
      },
      providesTags: ['Parameters'],
    }),
    getSortOrders: builder.query<Record<string, SortOrder[]>, {
      useSession?: string;
    }>({
      query: ({ useSession }) => ({
        url: '/webapi/objectmanagement/sortorders_49V_v1',
        params: useSession ? [['UseSession', useSession]] : [],
      }),
      providesTags: ['SortOrders'],
      transformResponse: (response: { sortOrders: SortOrder[] }) => {
        return response.sortOrders.reduce((acc, item) => {
          const id = sanitizeSortOrder(item.name);
          
          acc[id] = [...(acc[id] ?? []), item];
    
          return acc;
        }, {} as Record<string, SortOrder[]>);
      },
    }),
    getVideoUrl: builder.query<string, { id: string; useSession?: string }>({
      query: ({ id, useSession }) => {
        const params = [['RecordID', id], ['Proxy', 'WebHigh']];
        if (useSession) {
          params.push(['UseSession', useSession]);
        }
        return {
          url: '/webapi/extensibility/integrations/gab/assetbrowser/GetAssetLink_4by?',
          params,
        };
      },
      transformResponse: (response: { imageUrl: string }) => {
        return response.imageUrl;
      },
      serializeQueryArgs: ({ queryArgs }) => {
        return queryArgs.id;
      },
    }),
  }),
});

// < { proxies: { [key: string]: string } }, void>

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetAvailableProxiesQuery,
  useGetParametersQuery,
  useGetSortOrdersQuery,
  useGetVideoUrlQuery,
} = assetsApi;
