import http from '@/api/api';
import { MetadataApiEndpoint } from '@/api/endpoints';
import { Facet, SortOrder } from '@/types/content-browser';

import {
  GetAvailableFacetsResponse,
  GetContentBrowserParametersResponse,
  GetSortOrdersResponse,
} from './metadata.types';
import { toContentBrowserParameters } from './metadata.utils';

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
      url: MetadataApiEndpoint.GET_SORT_ORDERS,
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
      url: MetadataApiEndpoint.GET_AVAILABLE_FACETS,
    });

    return response.data;
  } catch (error) {
    return [];
  }
}

export async function apiGetContentBrowserParameters() {
  try {
    const response = await http.request<GetContentBrowserParametersResponse>({
      cache: false,
      method: 'GET',
      transformResponse: [
        ...(Array.isArray(http.defaults.transformResponse)
          ? http.defaults.transformResponse
          : []),
        toContentBrowserParameters,
      ],
      url: MetadataApiEndpoint.GET_CONTENT_BROWSER_PARAMETERS,
    });

    return response.data;
  } catch (error) {
    return toContentBrowserParameters({});
  }
}
