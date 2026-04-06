import http from '@/api/api';
import { METADATA_API_ENDPOINT } from '@/api/endpoints';
import { Facet, SortOrder } from '@/types/dam-view';

import {
  ContentBrowserParameters,
  GetAvailableFacetsResponse,
  GetContentBrowserParametersResponse,
  GetSortOrdersResponse,
} from './metadata.types';

export async function apiGetSortOrders() {
  try {
    const response = await http.request<GetSortOrdersResponse>({
      method: 'GET',
      transformResponse: [
        ...(Array.isArray(http.defaults.transformResponse)
          ? http.defaults.transformResponse
          : []),
          (sortOrdersRawResponse: { sortOrders?: SortOrder[] }): GetSortOrdersResponse => {
            const sortOrders = Array.isArray(sortOrdersRawResponse?.sortOrders)
              ? sortOrdersRawResponse.sortOrders
              : [];

            return sortOrders.reduce((acc, item) => {
              const rawKey = item?.sortDirectionGroupKey?.trim() || item?.name?.trim();

              if (!rawKey) {
                return acc;
              }
              const id = rawKey.toLowerCase();
              acc[id] = [...(acc[id] ?? []), item];

              return acc;
            }, {} as Record<string, SortOrder[]>);
          },
      ],
      url: METADATA_API_ENDPOINT.GET_SORT_ORDERS,
    });

    return response.data;
  } catch (error) {
    return {};
  }
}

export async function apiGetAvailableFacets() {
  try {
    const response = await http.request<GetAvailableFacetsResponse>({
      method: 'GET',
      transformResponse: [
        ...(Array.isArray(http.defaults.transformResponse)
          ? http.defaults.transformResponse
          : []),
          (availableFacetsRawResponse: { facets?: Array<Facet['facetDetails']> }): GetAvailableFacetsResponse => {
            return Array.isArray(availableFacetsRawResponse?.facets)
              ? availableFacetsRawResponse.facets
              : [];
          },
      ],
      url: METADATA_API_ENDPOINT.GET_AVAILABLE_FACETS,
    });

    return response.data;
  } catch (error) {
    return [];
  }
}

export async function apiGetContentBrowserParameters() {
  try {
    const response = await http.request<GetContentBrowserParametersResponse>({
      method: 'GET',
      transformResponse: [
        ...(Array.isArray(http.defaults.transformResponse)
          ? http.defaults.transformResponse
          : []),
        (contentBrowserParametersRawResponse: Record<string, string>): GetContentBrowserParametersResponse => {
          return {
            ATSEnabled: contentBrowserParametersRawResponse[ContentBrowserParameters.EnableATSInGetLink].toLowerCase() === 'true',
            autoExtension: contentBrowserParametersRawResponse[ContentBrowserParameters.ExtensionAuto]?.toLowerCase() ?? '.auto',
            collectionPath: contentBrowserParametersRawResponse[ContentBrowserParameters.CollectionSubtypeCriteria]?.toLowerCase() ?? '',
            supportedExtensions: contentBrowserParametersRawResponse[ContentBrowserParameters.ExtensionsThatSupportTransformationUsingATS]?.split('\n') ?? [],
            supportedRepresentativeSubtypes: contentBrowserParametersRawResponse[ContentBrowserParameters.RepresentativeSupportedDocSubType]?.split('\r\n') ?? [],
          };
        },
      ],
      url: METADATA_API_ENDPOINT.GET_CONTENT_BROWSER_PARAMETERS,
    });

    return response.data;
  } catch (error) {
    return {
      ATSEnabled: false,
      autoExtension: '.auto',
      collectionPath: '',
      supportedExtensions: [],
      supportedRepresentativeSubtypes: [],
    };
  }
}
