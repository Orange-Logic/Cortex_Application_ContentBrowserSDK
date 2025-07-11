import { v4 as uuidv4 } from 'uuid';

import { SortOrder } from '@/types/assets';
import { Asset, Facet, MediaType, Proxy } from '@/types/search';
import { AppBaseQuery, GetValueByKeyCaseInsensitive } from '@/utils/api';
import { hasElements, uniqueArray } from '@/utils/array';
import { createApi, retry } from '@reduxjs/toolkit/query/react';

const Parameters = {
  ExtensionsThatSupportTransformationUsingATS: 'ExtensionsThatSupportTransformationUsingATS',
  EnableATSInGetLink: 'EnableATSInGetLink',
  CollectionSubtypeCriteria: 'CollectionSubtypeCriteria',
  SupportDocTypes: 'SupportedDocSubTypesV2',
  RepresentativeSupportedDocSubType: 'RepresentativeSupportedDocSubType',
  ExtensionAuto: 'ExtensionAuto',
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

type GetAvailableExtensionsResponse = Record<MediaType, { displayName: string; value: string }[]>;

type GetAvailableFacetsResponse = Facet['facetDetails'][];

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

const baseQueryWithRetry = retry(AppBaseQuery, { 
  maxRetries: 2,
});

// Define a service using a base URL and expected endpoints
export const assetsApi = createApi({
  reducerPath: 'assetsApi',
  baseQuery: baseQueryWithRetry,
  tagTypes: ['AvailableExtensions', 'AvailableFacets', 'AvailableProxies', 'Parameters', 'SortOrders', 'VersionHistory'],
  endpoints: (builder) => ({
    getAvailableExtensions: builder.query<GetAvailableExtensionsResponse, { useSession: string }>({
      query: ({ useSession }) => ({
        url: '/webapi/extensibility/integrations/gab/assetbrowser/getavailableextensionsfortransformation_419v_v1',
        params: useSession ? [['UseSession', useSession]] : [],
      }),
      transformResponse: (response: { extensions: GetAvailableExtensionsResponse }) => {
        return response.extensions;
      },
      providesTags: ['AvailableExtensions'],
      serializeQueryArgs: () => {
        return 'getAvailableExtensions';
      },
    }),
    getAvailableProxies: builder.query<GetAvailableProxiesResponse, GetAvailableProxiesRequest>({
      keepUnusedDataFor: 0,
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
    getAvailableFacets: builder.query<GetAvailableFacetsResponse,  { useSession: string }>({
      keepUnusedDataFor: 0,
      query: ({ useSession }) => ({
        url: '/webapi/extensibility/integrations/gab/assetbrowser/getavailablefacets',
        params: useSession ? [['UseSession', useSession]] : [],
      }),
      transformResponse: (response: { facets: Facet['facetDetails'][] }) => response.facets,
      providesTags: ['AvailableFacets'],
    }),
    getParameters: builder.query<{
      ATSEnabled: boolean;
      autoExtension: string;
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
          url: '/webapi/extensibility/integrations/contentBrowserSDK/getparameters_412Z_v1',
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
          autoExtension: response[Parameters.ExtensionAuto]?.toLowerCase() ?? '.auto',
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
    getVersionHistory: builder.query<{
      count: number;
      versions: Record<string, string>[];
    }, {
      assetId: string;
      useSession?: string;
    }>({
      keepUnusedDataFor: 0,
      query: ({ assetId, useSession }) => {
        const params = [['RecordID', assetId]];

        if (useSession) {
          params.push(['UseSession', useSession]);
        }

        return {
          url: '/webapi/extensibility/integrations/contentBrowserSDK/getassetversion_418f',
          params,
        };
      },
      transformResponse: (response: { count: number, versions: Record<string, string>[] }) => {
        return {
          count: response.count,
          versions: response.versions.map((version) => ({
            createByEmail: GetValueByKeyCaseInsensitive(version, 'CreateByEmail'),
            fileImportDate: GetValueByKeyCaseInsensitive(version, 'FileImportDate'),
            scrubUrl: GetValueByKeyCaseInsensitive(version, 'ScrubUrl'),
            versionCreateDate: GetValueByKeyCaseInsensitive(version, 'VersionCreateDate'),
            versionFileName: GetValueByKeyCaseInsensitive(version, 'UpdatedFileName'),
            versionFileUrl: GetValueByKeyCaseInsensitive(version, 'PreviewUrl'),
            versionId: GetValueByKeyCaseInsensitive(version, 'VersionID'),
            versionNumber: GetValueByKeyCaseInsensitive(version, 'VersionNumber'),
            versionNumberDisplay: GetValueByKeyCaseInsensitive(version, 'VersionNumberDisplay'),
          }) as Record<string, string>),
        };
      },
      providesTags: (_result, _error, _args) => ['VersionHistory'],
    }),
  }),
});

// < { proxies: { [key: string]: string } }, void>

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetAvailableExtensionsQuery,
  useGetAvailableFacetsQuery,
  useGetAvailableProxiesQuery,
  useGetParametersQuery,
  useGetSortOrdersQuery,
  useGetVersionHistoryQuery,
} = assetsApi;
