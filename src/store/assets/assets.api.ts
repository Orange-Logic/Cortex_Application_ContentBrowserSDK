import { v4 as uuidv4 } from 'uuid';

import { SortOrder } from '@/types/assets';
import { Asset, MediaType, Proxy } from '@/types/search';
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

export type GetAvailableProxiesResponse = {
  previewUrl: string;
  proxies: Proxy[];
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

    result = (assetImages as Asset[]).map(asset => ['RecordID', asset.id]).concat(assetDocTypes);
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
        url: '/webapi/extensibility/integrations/contentBrowserSDK/AvailableProxies_4ea_v3?',
        params: getAvailableProxiesAPIParams(request),
      }),
      transformResponse: (response: { proxies: Proxy[]; previewUrl: string }) => {
        const { previewUrl, proxies } = response;
        return {
          previewUrl,
          proxies: proxies.map((proxy) => {
            return {
              ...proxy,
              id: uuidv4(),
            };
          }),
        };
      },
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
        url: '/webapi/extensibility/integrations/contentBrowserSDK/sortorders_4147',
        params: useSession ? [['UseSession', useSession]] : [],
      }),
      providesTags: ['SortOrders'],
      transformResponse: (response: { sortOrders: SortOrder[] }) => {
        const value = response.sortOrders.reduce((acc, item) => {
          const id = (item.sortDirectionGroupKey || item.name).trim().toLowerCase();
          
          acc[id] = [...(acc[id] ?? []), item];
    
          return acc;
        }, {} as Record<string, SortOrder[]>);

        Object.keys(value).forEach((key) => {
          const sortOrder = value[key];
          if (sortOrder.length === 1) {
            sortOrder[0].sortDirection = 'Mono';
          }
        });

        return value;
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
} = assetsApi;
