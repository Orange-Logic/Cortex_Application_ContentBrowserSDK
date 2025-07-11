import _mapKeys from 'lodash-es/mapKeys';
import _camelCase from 'lodash-es/camelCase';
import _uniqBy from 'lodash-es/uniqBy';

import {
  DEFAULT_VIEW_SIZE, ORIGINAL_VIEW_SIZE, FIELD_CORTEX_PATH, FIELD_DOC_TYPE, FIELD_EXTENSION, FIELD_FILE_SIZE,
  FIELD_HAS_BROWSER_CHILDREN,
  FIELD_IDENTIFIER, FIELD_KEYWORDS, FIELD_MAX_HEIGHT, FIELD_MAX_WIDTH, FIELD_SCRUB_URL, FIELD_SUBTYPE, FIELD_TITLE_WITH_FALLBACK, FIELD_ALLOW_ATS_LINK,
  FIELD_RECORD_ID,
  FIELD_ORIGINAL_FILE_NAME,
  FIELD_UPDATED_FILE_NAME,
} from '@/consts/data';
import { Asset, Folder, GetContentRequest, GetContentResponse, GetFavoritesResponse } from '@/types/search';
import { AppBaseQuery, GetValueByKeyCaseInsensitive } from '@/utils/api';
import { isNullOrWhiteSpace } from '@/utils/string';
import { createApi, retry } from '@reduxjs/toolkit/query/react';
import { FOLDER_PAGE_SIZE } from '@/utils/constants';

const NATURAL_SORT_ORDER_REFERENCE_ID = 'OR4ND000000063615';

const resolveFolderExtraFilters = ({
  searchText,
  folder,
  allowedFolders,
}: {
  searchText: string;
  folder?: Folder;
  allowedFolders?: string[];
}) => {
  let baseQuery = 'MediaType:Story OR MediaType:Album';
  if (!isNullOrWhiteSpace(searchText)) {
    baseQuery = `(${baseQuery}) AND Story_Title:${searchText}`;
  }
  if (allowedFolders?.length) {
    const allowedFoldersQuery = allowedFolders
      .map((item) => `Path:${item}${folder?.id ? '/*' : ''}`)
      .join(' OR ');
    baseQuery = `(${baseQuery}) AND (${allowedFoldersQuery})`;
  }

  return baseQuery;
};

const resolveAssetExtraFilters = ({
  extensions,
  statuses,
  visibilityClasses,
}: {
  extensions: string[];
  searchText: string;
  statuses: string[];
  visibilityClasses: string[];
}) => {
  const filterResult: Record<string, string> = {};

  let statusQuery = '';
  if (statuses?.length) {
    statusQuery = statuses
      .map(status => `WorkflowStatus:${status}`)
      .join(' OR ');
    filterResult.Status = statusQuery;
  }

  let extensionsQuery = '';
  if (extensions?.length) {
    extensionsQuery = extensions
      .map(extension => `FileExtension:${extension}`)
      .join(' OR ');
    filterResult.Extension = extensionsQuery;
  }

  let visibilityClassesQuery = '';
  if (visibilityClasses?.length) {
    visibilityClassesQuery = visibilityClasses
      .map(visibilityClass => `Purpose:${visibilityClass}`)
      .join(' OR ');
    filterResult.VisibilityClass = visibilityClassesQuery;
  }

  return filterResult;
};

const baseQueryWithRetry = retry(AppBaseQuery, { 
  maxRetries: 2,
});
// Define a service using a base URL and expected endpoints
export const searchApi = createApi({
  reducerPath: 'searchApi',
  baseQuery: baseQueryWithRetry,
  tagTypes: ['Folders', 'Images', 'ImagesInFolders'],
  endpoints: (builder) => ({
    getFolders: builder.query({
      query: ({
        allowedFolders,
        folder,
        searchText,
        useSession,
        start = 0,
        pageSize = FOLDER_PAGE_SIZE,
      }: {
        allowedFolders?: string[];
        folder: Folder;
        searchText: string;
        useSession?: string;
        start?: number;
        pageSize?: number;
      }) => {
        const params = [
          [
            'extraFilters',
            resolveFolderExtraFilters({ searchText, folder, allowedFolders }),
          ],
          ['fields', FIELD_CORTEX_PATH],
          ['fields', FIELD_DOC_TYPE],
          ['fields', FIELD_TITLE_WITH_FALLBACK],
          ['fields', FIELD_HAS_BROWSER_CHILDREN],
          ['orderBy', NATURAL_SORT_ORDER_REFERENCE_ID],
        ];

        if (start || start >= 0) {
          params.push(['start', start.toString()]);  
        }

        if (pageSize) {
          params.push(['limit', pageSize.toString()]);
        }
        
        if (folder.id) {
          params.push(['objectRecordID', folder.id]);
        }

        if (!isNullOrWhiteSpace(searchText) || (allowedFolders && allowedFolders.length > 0) ) {
          params.push(['seeThru', 'true']);
        }

        if (useSession) {
          params.push(['UseSession', useSession]);
        }

        return {
          url: '/webapi/extensibility/integrations/contentBrowserSDK/getcontent_4bw_v1',
          params,
        };
      },
      transformResponse: (
        response: GetContentResponse,
        _meta,
        arg,
      ): {
        items: Folder[];
        totalCount: number;
      } => {
        return {
          items: (
            response.contentItems
              ?.map((item) => {
                return {
                  id: item.recordID,
                  title:
                  GetValueByKeyCaseInsensitive(item.fields, FIELD_TITLE_WITH_FALLBACK) ?? '',
                  docType:
                  GetValueByKeyCaseInsensitive(item.fields, FIELD_DOC_TYPE) ?? '',
                  path: [...arg.folder.path, arg.folder.title],
                  fullPath: (
                    GetValueByKeyCaseInsensitive(item.fields, FIELD_CORTEX_PATH) ?? ''
                  ).replace(/^Root\//i, ''),
                  parents: [...arg.folder.parents, arg.folder],
                  hasChildren: (GetValueByKeyCaseInsensitive(item.fields, FIELD_HAS_BROWSER_CHILDREN) ?? '0') === '1' ? true : false,
                };
              }) ?? []
          ),
          totalCount: response.totalCount,
        };
      },
      providesTags: (_result, _error, arg) => {
        return [{ type: 'Folders', id: arg.folder.id }];
      },
      merge: (currentCachedData, responseData, request) => {
        if (request.arg.start && request.arg.start > 0) {
          currentCachedData.items.push(...responseData.items);
          return currentCachedData;
        } else {
          return responseData;
        }
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      },
      serializeQueryArgs: ({ endpointName, queryArgs }) => {
        return {
          endpointName,
          id: queryArgs.folder?.id,
          type: 'Folders',
        };
      },
    }),
    getCollections: builder.query({
      query: ({
        folder,
        searchText,
        useSession,
        start = 0,
        pageSize = FOLDER_PAGE_SIZE,
      }) => {
        const params = [
          [
            'extraFilters',
            resolveFolderExtraFilters({ searchText }),
          ],
          ['fields', FIELD_CORTEX_PATH],
          ['fields', FIELD_DOC_TYPE],
          ['fields', FIELD_TITLE_WITH_FALLBACK],
          ['seeThru', true],
          ['subtypeCriteria', folder],
        ];

        if (start || start >= 0) {
          params.push(['start', start.toString()]);  
        }

        if (pageSize) {
          params.push(['limit', pageSize.toString()]);
        }

        if (useSession) {
          params.push(['UseSession', useSession]);
        }

        return {
          url: '/webapi/extensibility/integrations/contentBrowserSDK/getcontent_4bw_v1',
          params,
        };
      },
      transformResponse: (
        response: GetContentResponse,
        _meta,
      ): {
        items: Folder[];
        totalCount: number;
      } => {
        return {
          items: response.contentItems
            ?.map((item) => ({
              id: item.recordID,
              title:
                GetValueByKeyCaseInsensitive(item.fields, FIELD_TITLE_WITH_FALLBACK) ?? '',
              docType:
                GetValueByKeyCaseInsensitive(item.fields, FIELD_DOC_TYPE) ?? '',
              path: [],
              fullPath: (
                GetValueByKeyCaseInsensitive(item.fields, FIELD_CORTEX_PATH) ?? ''
              ).replace(/^Root\//i, ''),
              parents: [],
              hasChildren: false,
            })) ?? [],
          totalCount: response.totalCount,
        };
      },
      providesTags: (_result, _error, arg) => {
        return [{ type: 'Folders', id: arg.folder.id }];
      },
      merge: (currentCachedData, responseData, request) => {
        if (request.arg.start && request.arg.start > 0) {
          currentCachedData.items.push(...responseData.items);
          return currentCachedData;
        } else {
          return responseData;
        }
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      },
      serializeQueryArgs: ({ endpointName, queryArgs }) => {
        return {
          endpointName,
          id: queryArgs.folder?.id,
          type: 'Folders',
        };
      },
    }),
    getAssets: builder.query({
      query: ({
        extensions,
        folderID,
        isSeeThrough,
        limitedToDocTypes,
        mediaTypes,
        pageSize,
        searchText,
        sortOrder,
        start,
        statuses,
        useSession,
        visibilityClasses,
      }: GetContentRequest) => {
        const mappedLimitedToDocTypes = limitedToDocTypes.map((docType) => ['limitedToDocTypes', docType]);
        const mappedMediaTypes = mediaTypes.map((mediaType) => ['subtypeCriteria', mediaType]);
        const params = [
          ['objectRecordID', folderID],
          ['fields', FIELD_TITLE_WITH_FALLBACK],
          ['fields', DEFAULT_VIEW_SIZE],
          ['fields', ORIGINAL_VIEW_SIZE],
          ['fields', FIELD_KEYWORDS],
          ['fields', FIELD_MAX_WIDTH],
          ['fields', FIELD_MAX_HEIGHT],
          ['fields', FIELD_FILE_SIZE],
          ['fields', FIELD_DOC_TYPE],
          ['fields', FIELD_SUBTYPE],
          ['fields', FIELD_IDENTIFIER],
          ['fields', FIELD_EXTENSION],
          ['fields', FIELD_RECORD_ID],
          ['fields', FIELD_ORIGINAL_FILE_NAME],
          ['fields', FIELD_UPDATED_FILE_NAME],
          ['seeThru', isSeeThrough],
          ['start', start],
          ['limit', pageSize],
        ];
        const fieldFilters = resolveAssetExtraFilters({
          extensions,
          searchText,
          statuses,
          visibilityClasses,
        });

        Object.entries(fieldFilters).forEach(([key, value]) => {
          params.push([`facetFilters[${key}]`, value]);
        }, '');

        if (sortOrder) {
          params.push(['orderBy', sortOrder]);
        }
        if (mappedLimitedToDocTypes.length) {
          params.push(...mappedLimitedToDocTypes);
        }
        if (mappedMediaTypes.length) {
          params.push(...mappedMediaTypes);
        }
        if (searchText) {
          params.push(['extraFilters', `Text:${searchText}`]);
        }
        if (useSession) {
          params.push(['UseSession', useSession]);
        }
        return {
          url: '/webapi/extensibility/integrations/contentBrowserSDK/getcontent_4bw_v2',
          params,
        };
      },
      transformResponse: (
        response: GetContentResponse,
      ): {
        facets: Record<string, Record<string, number>>;
        items: Asset[];
        totalCount: number;
      } => ({
        facets: _mapKeys(response.facets, (_, key) => _camelCase(key)),
        items:
          response.contentItems?.map((item) => {
            let extension = GetValueByKeyCaseInsensitive(item.fields, FIELD_EXTENSION) ?? '';
            let name = GetValueByKeyCaseInsensitive(item.fields, FIELD_UPDATED_FILE_NAME);
            if (extension && !extension.startsWith('.')) {
              extension = '.' + extension;
            }

            if (isNullOrWhiteSpace(name)) {
              name = GetValueByKeyCaseInsensitive(item.fields, FIELD_ORIGINAL_FILE_NAME);
            }

            return {
              docType: GetValueByKeyCaseInsensitive(item.fields, FIELD_DOC_TYPE) ?? '',
              docSubType: GetValueByKeyCaseInsensitive(item.fields, FIELD_SUBTYPE) ?? '',
              extension,
              height: GetValueByKeyCaseInsensitive(item.fields, FIELD_MAX_HEIGHT) ?? '0',
              id: item.recordID,
              identifier: GetValueByKeyCaseInsensitive(item.fields, FIELD_IDENTIFIER) ?? '',
              imageUrl: GetValueByKeyCaseInsensitive(item.fields, DEFAULT_VIEW_SIZE) ?? '',
              originalUrl: GetValueByKeyCaseInsensitive(item.fields, ORIGINAL_VIEW_SIZE) ?? '',
              name: name ?? '',
              scrubUrl: GetValueByKeyCaseInsensitive(item.fields, FIELD_SCRUB_URL) ?? '',
              size: GetValueByKeyCaseInsensitive(item.fields, FIELD_FILE_SIZE) ?? '0 MB',
              tags: GetValueByKeyCaseInsensitive(item.fields, FIELD_KEYWORDS) ?? '',
              width: GetValueByKeyCaseInsensitive(item.fields, FIELD_MAX_WIDTH) ?? '0',
              allowATSLink: GetValueByKeyCaseInsensitive(item.fields, FIELD_ALLOW_ATS_LINK) === 'True',
              recordId: GetValueByKeyCaseInsensitive(item.fields, FIELD_RECORD_ID) ?? '',
            } as Asset;
          }) ?? [],
        totalCount: response.totalCount,
      }),
      providesTags: (_result, _error, arg) => {
        return [
          {
            extensions: arg.extensions,
            id: arg.folderID,
            isSeeThrough: arg.isSeeThrough,
            mediaTypes: arg.mediaTypes,
            searchText: arg.searchText,
            sortOrder: arg.sortOrder,
            statuses: arg.statuses,
            type: 'ImagesInFolders',
            visibilityClasses: arg.visibilityClasses,
          },
          'Images',
        ];
      },
      merge: (currentCachedData, responseData, request) => {
        if (request.arg.start > 0) {
          return {
            ...currentCachedData,
            items: _uniqBy([...currentCachedData.items, ...responseData.items], 'recordId'),
          };
        } else {
          return responseData;
        }
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      },
      serializeQueryArgs: ({ endpointName, queryArgs }) => {
        return {
          endpointName,
          extensions: queryArgs.extensions,
          id: queryArgs.folderID,
          isSeeThrough: queryArgs.isSeeThrough,
          mediaTypes: queryArgs.mediaTypes,
          searchText: queryArgs.searchText,
          sortOrder: queryArgs.sortOrder,
          statuses: queryArgs.statuses,
          visibilityClasses: queryArgs.visibilityClasses,
          type: 'ImagesInFolders',
        };
      },
    }),
    getIsFavorite: builder.query({
      keepUnusedDataFor: 0,
      query: ({
        recordId,
      }: {
        recordId: string;
      }) => {
        const params = [
          ['recordId', recordId],
        ];

        return {
          url: '/webapi/extensibility/integrations/contentBrowserSDK/getfavorites_419t',
          params,
        };
      },
      transformResponse: (
        response: GetFavoritesResponse,
        _meta,
        {
          recordId,
        },
      ): boolean => {
        return response.favoriteRecordIds ? response.favoriteRecordIds[0] === recordId : false;
      },
    }),
    getAssetById: builder.query({
      query: ({
        id,
        useSession,
      }: {
        id: string;
        useSession?: string;
      }) => {
        const params = [
          ['extraFilters', `RecordID:${id}`],
          ['fields', FIELD_TITLE_WITH_FALLBACK],
          ['fields', DEFAULT_VIEW_SIZE],
          ['fields', ORIGINAL_VIEW_SIZE],
          ['fields', FIELD_KEYWORDS],
          ['fields', FIELD_MAX_WIDTH],
          ['fields', FIELD_MAX_HEIGHT],
          ['fields', FIELD_FILE_SIZE],
          ['fields', FIELD_DOC_TYPE],
          ['fields', FIELD_SUBTYPE],
          ['fields', FIELD_IDENTIFIER],
          ['fields', FIELD_EXTENSION],
          ['fields', FIELD_RECORD_ID],
          ['seeThru', 'true'],
        ];

        if (useSession) {
          params.push(['UseSession', useSession]);
        }

        return {
          url: '/webapi/extensibility/integrations/contentBrowserSDK/getcontent_4bw_v1',
          params,
        };
      },
      transformResponse: (
        response: GetContentResponse,
      ): Asset | undefined => {
        const item = response.contentItems?.[0];
        if (!item) {
          return undefined;
        }

        let extension = GetValueByKeyCaseInsensitive(item.fields, FIELD_EXTENSION) ?? '';
        if (extension && !extension.startsWith('.')) {
          extension = '.' + extension;
        }
        return {
          docType: GetValueByKeyCaseInsensitive(item.fields, FIELD_DOC_TYPE) ?? '',
          docSubType: GetValueByKeyCaseInsensitive(item.fields, FIELD_SUBTYPE) ?? '',
          extension,
          height: GetValueByKeyCaseInsensitive(item.fields, FIELD_MAX_HEIGHT) ?? '0',
          id: item.recordID,
          identifier: GetValueByKeyCaseInsensitive(item.fields, FIELD_IDENTIFIER) ?? '',
          imageUrl: GetValueByKeyCaseInsensitive(item.fields, DEFAULT_VIEW_SIZE) ?? '',
          originalUrl: GetValueByKeyCaseInsensitive(item.fields, ORIGINAL_VIEW_SIZE) ?? '',
          name: GetValueByKeyCaseInsensitive(item.fields, FIELD_TITLE_WITH_FALLBACK) ?? '',
          scrubUrl: GetValueByKeyCaseInsensitive(item.fields, FIELD_SCRUB_URL) ?? '',
          size: GetValueByKeyCaseInsensitive(item.fields, FIELD_FILE_SIZE) ?? '0 MB',
          tags: GetValueByKeyCaseInsensitive(item.fields, FIELD_KEYWORDS) ?? '',
          width: GetValueByKeyCaseInsensitive(item.fields, FIELD_MAX_WIDTH) ?? '0',
          allowATSLink: GetValueByKeyCaseInsensitive(item.fields, FIELD_ALLOW_ATS_LINK) === 'True',
          recordId: GetValueByKeyCaseInsensitive(item.fields, FIELD_RECORD_ID) ?? '',
        } as Asset;
      },
      providesTags: (_result, _error, arg) => {
        return [{ type: 'Images', id: arg.id }];
      },
      serializeQueryArgs: ({ endpointName, queryArgs }) => ({
        endpointName,
        id: queryArgs.id,
        useSession: queryArgs.useSession,
      }),
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetFoldersQuery, useGetCollectionsQuery, useGetAssetsQuery, useGetAssetByIdQuery, useGetIsFavoriteQuery } =
  searchApi;
