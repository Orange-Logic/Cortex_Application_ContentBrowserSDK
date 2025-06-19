import _mapKeys from 'lodash-es/mapKeys';
import _camelCase from 'lodash-es/camelCase';

import {
  DEFAULT_VIEW_SIZE, ORIGINAL_VIEW_SIZE, FIELD_CORTEX_PATH, FIELD_DOC_TYPE, FIELD_EXTENSION, FIELD_FILE_SIZE,
  FIELD_HAS_BROWSER_CHILDREN,
  FIELD_IDENTIFIER, FIELD_KEYWORDS, FIELD_MAX_HEIGHT, FIELD_MAX_WIDTH, FIELD_SCRUB_URL, FIELD_SUBTYPE, FIELD_TITLE_WITH_FALLBACK, FIELD_ALLOW_ATS_LINK,
} from '@/consts/data';
import { Asset, Folder, GetContentRequest, GetContentResponse, GetFavoritesResponse } from '@/types/search';
import { AppBaseQuery, GetValueByKeyCaseInsensitive } from '@/utils/api';
import { isNullOrWhiteSpace } from '@/utils/string';
import { createApi, retry } from '@reduxjs/toolkit/query/react';

const NATURAL_SORT_ORDER_REFERENCE_ID = 'OR4ND000000063615';

const resolveFolderExtraFilters = (searchText: string, allowedFolders?: string[]) => {
  let baseQuery = 'MediaType:Story OR MediaType:Album';
  if (!isNullOrWhiteSpace(searchText)) {
    baseQuery = `(${baseQuery}) AND Story_Title:${searchText}`;
  }
  if (allowedFolders?.length) {
    const allowedFoldersQuery = allowedFolders
      .map(folder => `Path:${folder}*`)
      .join(' OR ');
    baseQuery = `(${baseQuery}) AND (${allowedFoldersQuery})`;
  }

  return baseQuery;
};

const resolveAssetExtraFilters = ({
  extensions,
  searchText,
  statuses,
  visibilityClasses,
}: {
  extensions: string[];
  searchText: string;
  statuses: string[];
  visibilityClasses: string[];
}) => {
  let statusQuery = '';
  if (statuses?.length) {
    statusQuery = statuses
      .map(status => `WorkflowStatus:${status}`)
      .join(' OR ');
    if (statuses.length > 1) {
      statusQuery = `(${statusQuery})`;
    }
  }

  let extensionsQuery = '';
  if (extensions?.length) {
    extensionsQuery = extensions
      .map(extension => `FileExtension:${extension}`)
      .join(' OR ');
    if (extensions.length > 1) {
      extensionsQuery = `(${extensionsQuery})`;
    }
  }

  let visibilityClassesQuery = '';
  if (visibilityClasses?.length) {
    visibilityClassesQuery = visibilityClasses
      .map(visibilityClass => `Purpose:${visibilityClass}`)
      .join(' OR ');
    if (visibilityClasses.length > 1) {
      visibilityClassesQuery = `(${visibilityClassesQuery})`;
    }
  }

  const searchTextQuery = isNullOrWhiteSpace(searchText) ? '' : `Text:${searchText}`;

  const filters = [statusQuery, extensionsQuery, visibilityClassesQuery, searchTextQuery].filter(filter => filter.length > 0);

  return filters.join(' AND ');
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
      }: {
        allowedFolders?: string[];
        folder: Folder;
        searchText: string;
        useSession?: string;
      }) => {
        const params = [
          [
            'extraFilters',
            resolveFolderExtraFilters(searchText, allowedFolders),
          ],
          ['fields', FIELD_CORTEX_PATH],
          ['fields', FIELD_DOC_TYPE],
          ['fields', FIELD_TITLE_WITH_FALLBACK],
          ['fields', FIELD_HAS_BROWSER_CHILDREN],
          ['orderBy', NATURAL_SORT_ORDER_REFERENCE_ID],
        ];

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
      ): Folder[] => {
        return (
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
        );
      },
      providesTags: (_result, _error, arg) => {
        return [{ type: 'Folders', id: arg.folder.id }];
      },
    }),
    getCollections: builder.query({
      query: ({
        folder,
        searchText,
        useSession,
      }) => {
        const params = [
          [
            'extraFilters',
            resolveFolderExtraFilters(searchText),
          ],
          ['fields', FIELD_CORTEX_PATH],
          ['fields', FIELD_DOC_TYPE],
          ['fields', FIELD_TITLE_WITH_FALLBACK],
          ['seeThru', true],
          ['subtypeCriteria', folder],
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
        _meta,
      ): Folder[] => {
        return (
          response.contentItems
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
            })) ?? []
        );
      },
      providesTags: (_result, _error, arg) => {
        return [{ type: 'Folders', id: arg.folder.id }];
      },
    }),
    getAssets: builder.query({
      query: ({
        extensions,
        folderID,
        isSeeThrough,
        mediaTypes,
        start,
        pageSize,
        searchText,
        sortOrder,
        statuses,
        visibilityClasses,
        useSession,
      }: GetContentRequest) => {
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
          ['seeThru', isSeeThrough],
          ['start', start],
          ['limit', pageSize],
        ];
        const extraFilters = resolveAssetExtraFilters({
          extensions,
          searchText,
          statuses,
          visibilityClasses,
        });
        if (extraFilters) {
          params.push(['extraFilters', extraFilters]);
        }
        if (sortOrder) {
          params.push(['orderBy', sortOrder]);
        }
        if (mappedMediaTypes.length) {
          params.push(...mappedMediaTypes);
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
      ): {
        facets: Record<string, Record<string, number>>;
        items: Asset[];
        totalCount: number;
      } => ({
        facets: _mapKeys(response.facets, (_, key) => _camelCase(key)),
        items:
          response.contentItems?.map((item) => {
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
          },
          'Images',
        ];
      },
      merge: (currentCachedData, responseData, request) => {
        if (request.arg.start > 0) {
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
          extensions: queryArgs.extensions,
          id: queryArgs.folderID,
          isSeeThrough: queryArgs.isSeeThrough,
          mediaTypes: queryArgs.mediaTypes,
          searchText: queryArgs.searchText,
          sortOrder: queryArgs.sortOrder,
          statuses: queryArgs.statuses,
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
          ['extraFilters', `SystemIdentifier:${id}`],
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
