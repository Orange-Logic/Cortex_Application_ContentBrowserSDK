import http from '@/api/api';
import {
  AssetApiEndpoint,
  FOLDER_API_ENDPOINT,
} from '@/api/endpoints';
import { GetFolderRequest, GetFolderResponse } from '@/types/folder';

import { FolderField } from './folder.types';

export const FOLDER_PAGE_SIZE = 50;

function resolveCollectionsExtraFilters({
  searchText,
}: {
  searchText?: string;
}): string {
  if (!searchText?.trim()) {
    return '';
  }

  return `Story_Title:${searchText}`;
}


export type GetContentResponse = {
  contentItems: Array<{
    fields: {
      [key: string]: string;
    };
    recordID: string;
  }>;
  totalCount: number;
};

export async function apiGetFolders({
  allowedFolders,
  baseUrl,
  bearerToken,
  excludeVirtualFolders,
  folderId,
  includeDirectChild,
  limit = FOLDER_PAGE_SIZE,
  searchTerm,
  self,
  start = 0,
  token,
}: GetFolderRequest) {
  let objectRecordIDs: string[] = [];
  let includesDirectChildren = includeDirectChild ?? true;

  if (allowedFolders && allowedFolders.length > 0 && !folderId) {
    objectRecordIDs = allowedFolders;
    self = true;
    includesDirectChildren = false;
  } else if (folderId) {
    objectRecordIDs = [folderId];
  }

  try {
    const response = await http.request<GetFolderResponse, GetFolderRequest>({
      baseURL: baseUrl,
      headers: {
        Authorization: `Bearer ${bearerToken}`,
      },
      method: 'GET',
      params: {
        IncludeDirectChild: includesDirectChildren,
        IncludeVirtualFolders: !excludeVirtualFolders,
        Limit: limit,
        ObjectRecordIDs: objectRecordIDs,
        SeeThru: !!searchTerm,
        Self: self,
        Start: start,
        Text: searchTerm || undefined,
        Token: token || undefined,
      },
      paramsSerializer: {
        indexes: null,
      },
      responseType: 'json',
      transformResponse: [
        ...(Array.isArray(http.defaults.transformResponse)
          ? http.defaults.transformResponse
          : []),
        (rawResponse: GetContentResponse, _headers, status): GetFolderResponse => {
          if (status !== undefined && (status < 200 || status >= 300)) {
            return {
              data: [],
              hasMore: false,
              totalCount: 0,
            };
          }

          if (!rawResponse || typeof rawResponse !== 'object') {
            throw new Error('Invalid response format');
          }

          const length = rawResponse.contentItems?.length ?? 0;

          return {
            data:
              rawResponse.contentItems?.map((item) => {
                return {
                  docType: item.fields[FolderField.DocType] ?? '',
                  fullPath: item.fields[FolderField.CortexPath] ?? '',
                  hasChildren:
                    item.fields[FolderField.HasBrowserChildren] === '1',
                  id: item.recordID,
                  isShared: item.fields[FolderField.rawDocSubtype] === 'DO_OR1ND000001913488',
                  representativeAssetId:
                    item.fields[FolderField.RepresentativeAssetId] ?? '',
                  title: item.fields[FolderField.TitleWithFallback] ?? '',
                };
              }) ?? [],
            hasMore: start + length < rawResponse.totalCount,
            totalCount: rawResponse.totalCount,
          };
        },
      ],
      url: FOLDER_API_ENDPOINT,
    });

    return response.data;
  } catch (error) {
    return {
      data: [],
      hasMore: false,
    };
  }
}

export type GetCollectionsRequest = {
  baseUrl?: string;
  bearerToken?: string;
  folderId: string;
  pageSize?: number;
  searchTerm?: string;
  start?: number;
  token?: string;
};

export async function apiGetCollections({
  baseUrl,
  bearerToken,
  folderId,
  pageSize = FOLDER_PAGE_SIZE,
  searchTerm,
  start = 0,
  token,
}: GetCollectionsRequest): Promise<GetFolderResponse> {
  try {
    const extraFilters = resolveCollectionsExtraFilters({ searchText: searchTerm });
    const response = await http.request<
      GetFolderResponse,
      GetCollectionsRequest
    >({
      baseURL: baseUrl,
      headers: {
        Authorization: `Bearer ${bearerToken}`,
      },
      method: 'GET',
      params: {
        ...(extraFilters && { ExtraFilters: extraFilters }),
        Fields: [
          FolderField.CortexPath,
          FolderField.DocType,
          FolderField.TitleWithFallback,
        ],
        Limit: pageSize,
        SeeThru: true,
        Start: start,
        SubtypeCriteria: folderId,
        Token: token || undefined,
      },
      paramsSerializer: {
        indexes: null,
      },
      responseType: 'json',
      transformResponse: [
        ...(Array.isArray(http.defaults.transformResponse)
          ? http.defaults.transformResponse
          : []),
        (
          rawResponse: GetContentResponse,
          _headers,
          status,
        ): GetFolderResponse => {
          if (status !== undefined && (status < 200 || status >= 300)) {
            return {
              data: [],
              hasMore: false,
              totalCount: 0,
            };
          }

          if (!rawResponse || typeof rawResponse !== 'object') {
            return {
              data: [],
              hasMore: false,
              totalCount: 0,
            };
          }

          const length = rawResponse.contentItems?.length ?? 0;

          return {
            data: rawResponse.contentItems?.map((item) => ({
              docType: item.fields[FolderField.DocType] ?? '',
              fullPath: item.fields[FolderField.CortexPath]?.replace(/^Root\//i, '') ?? '',
              hasChildren: false,
              id: item.recordID,
              parents: [],
              path: [],
              title: item.fields[FolderField.TitleWithFallback] ?? '',
            })) ?? [],
            hasMore: start + length < rawResponse.totalCount,
            totalCount: rawResponse.totalCount,
          };
        },
      ],
      url: AssetApiEndpoint.GET_CONTENT_V1,
    });

    return response.data;
  } catch (error) {
    return {
      data: [],
      hasMore: false,
      totalCount: 0,
    };
  }
}
