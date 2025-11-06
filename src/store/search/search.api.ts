import _uniqBy from 'lodash-es/uniqBy';

import {
  DEFAULT_VIEW_SIZE, ORIGINAL_VIEW_SIZE, FIELD_CORTEX_PATH, FIELD_DOC_TYPE, FIELD_EXTENSION, FIELD_FILE_SIZE,
  FIELD_HAS_BROWSER_CHILDREN,
  FIELD_IDENTIFIER, FIELD_KEYWORDS, FIELD_MAX_HEIGHT, FIELD_MAX_WIDTH, FIELD_SCRUB_URL, FIELD_SUBTYPE, FIELD_TITLE_WITH_FALLBACK, FIELD_ALLOW_ATS_LINK,
  FIELD_RECORD_ID,
  FIELD_ORIGINAL_FILE_NAME,
  FIELD_UPDATED_FILE_NAME,
  FIELD_RAW_DOC_SUBTYPE,
} from '@/consts/data';
import { Asset, Facet, Folder, GetContentRequest, GetContentResponse, GetFavoritesResponse, GetFoldersRequest } from '@/types/search';
import { AppBaseQuery, GetValueByKeyCaseInsensitive } from '@/utils/api';
import { isNullOrWhiteSpace } from '@/utils/string';
import { createApi, retry } from '@reduxjs/toolkit/query/react';
import { FOLDER_PAGE_SIZE } from '@/utils/constants';

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

const resolveAssetExtraFilters = (selectedFacets?: Record<string, string[]>) => {
  if (!selectedFacets || Object.keys(selectedFacets).length === 0) {
    return {
      subtypeCriteria: [],
      facetFilters: {},
    };
  }
  
  return Object.entries(selectedFacets).reduce<{
    subtypeCriteria: string[];
    facetFilters: Record<string, string[]>;
  }>((acc, [key, values]) => {
    if (!values || values.length === 0) {
      return acc;
    }

    if (key === 'Types') {
      return {
        ...acc,
        subtypeCriteria: acc.subtypeCriteria.concat(
          values,
        ),
      };
    }

    return {
      ...acc,
      facetFilters: {
        ...acc.facetFilters,
        [key]: values,
      },
    };
  }, {
    subtypeCriteria: [],
    facetFilters: {},
  });
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
      keepUnusedDataFor: 0,
      query: ({
        allowedFolders,
        folder,
        searchText,
        useSession,
        start = 0,
        pageSize = FOLDER_PAGE_SIZE,
        self = false,
        includeDirectChild,
        damViewSeeThru,
      }: GetFoldersRequest) => {
        const params = [
          ['DamViewSeeThru', damViewSeeThru ? 'true' : 'false'],
        ];

        if (start || start >= 0) {
          params.push(['Start', start.toString()]);  
        }

        if (searchText) {
          params.push(['Text', searchText]);
          params.push(['SeeThru', 'true']);
        }

        if (pageSize) {
          params.push(['Limit', pageSize.toString()]);
        }

        if (allowedFolders?.length && !folder?.id) {
          allowedFolders.forEach((item) => {
            params.push(['ObjectRecordIDs', item]);
          });
          params.push(['Self', 'true']);
          params.push(['IncludeDirectChild', includeDirectChild?.toString() ?? 'false']);
        } else if (folder?.id) {
          params.push(['ObjectRecordIDs', folder.id]);
          params.push(['IncludeDirectChild', includeDirectChild?.toString() ?? 'true']);
        }

        if (useSession) {
          params.push(['UseSession', useSession]);
        }

        if (self) {
          params.push(['Self', 'true']);
        }

        return {
          url: '/webapi/extensibility/integrations/gab/assetbrowser/gethierarchy_41e8',
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
                  path: arg.folder ? [...arg.folder.path, arg.folder.title] : [],
                  fullPath: (
                    GetValueByKeyCaseInsensitive(item.fields, FIELD_CORTEX_PATH) ?? ''
                  ).replace(/^Root\//i, ''),
                  parents: arg.folder ? [...arg.folder.parents, arg.folder] : [],
                  hasChildren: (GetValueByKeyCaseInsensitive(item.fields, FIELD_HAS_BROWSER_CHILDREN) ?? '0') === '1',
                  isShared: GetValueByKeyCaseInsensitive(item.fields, FIELD_RAW_DOC_SUBTYPE) === 'DO_OR1ND000001913488',
                };
              }) ?? []
          ),
          totalCount: response.totalCount,
        };
      },
      providesTags: (_result, _error, arg) => {
        return [{ type: 'Folders', id: arg.folder?.id ?? 'Root' }];
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
      keepUnusedDataFor: 0,
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
      keepUnusedDataFor: 0,
      query: ({
        folderID,
        isSeeThrough,
        limitedToDocTypes = [],
        pageSize,
        searchText,
        selectedFacets,
        sortOrder,
        start,
        useSession,
      }: GetContentRequest) => {
        const body = {
          fields: [
            DEFAULT_VIEW_SIZE,
            FIELD_DOC_TYPE,
            FIELD_EXTENSION,
            FIELD_FILE_SIZE,
            FIELD_IDENTIFIER,
            FIELD_KEYWORDS,
            FIELD_MAX_HEIGHT,
            FIELD_MAX_WIDTH,
            FIELD_ORIGINAL_FILE_NAME,
            FIELD_RECORD_ID,
            FIELD_SUBTYPE,
            FIELD_TITLE_WITH_FALLBACK,
            FIELD_UPDATED_FILE_NAME,
            ORIGINAL_VIEW_SIZE,
          ],
          seeThru: !!isSeeThrough,
          objectRecordID: folderID ?? undefined,
          start: start ?? undefined,
          limit: pageSize ?? undefined,
          orderBy: sortOrder,
          limitedToDocTypes,
          text: searchText,
          useSession,
          ...resolveAssetExtraFilters(selectedFacets),
        };

        return {
          url: '/webapi/extensibility/integrations/contentBrowserSDK/getcontent_4bw_v3',
          body,
          method: 'POST',
        };
      },
      transformResponse: (
        response: GetContentResponse,
      ): {
        facets: Facet[];
        items: Asset[];
        totalCount: number;
      } => ({
        facets: response.facets,
        items:
          response.contentItems?.map((item) => {
            let extension = GetValueByKeyCaseInsensitive(item.fields, FIELD_EXTENSION) ?? '';
            const name = GetValueByKeyCaseInsensitive(item.fields, FIELD_ORIGINAL_FILE_NAME);
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
            selectedFacets: Object.values(arg.selectedFacets ?? {}),
            id: arg.folderID,
            isSeeThrough: arg.isSeeThrough,
            searchText: arg.searchText,
            sortOrder: arg.sortOrder,
            type: 'ImagesInFolders',
          },
          'Images',
        ];
      },
      merge: (currentCachedData, responseData, request) => {
        if (request.arg.start && request.arg.start > 0) {
          return {
            ...currentCachedData,
            items: _uniqBy([...currentCachedData.items, ...responseData.items], 'recordId'),
          };
        } else {
          return responseData;
        }
      },
      forceRefetch({ currentArg, previousArg }) {
        if (currentArg?.start === previousArg?.start) {
          /**
           * Handle case when user changes page size by resizing the browser
           * Only refetch when page size is bigger
           */
          return !!currentArg?.pageSize && !!previousArg?.pageSize && currentArg.pageSize > previousArg.pageSize;
        }
        return currentArg !== previousArg;
      },
      serializeQueryArgs: ({ endpointName, queryArgs }) => {
        return {
          endpointName,
          selectedFacets: Object.values(queryArgs.selectedFacets ?? {}),
          id: queryArgs.folderID,
          isSeeThrough: queryArgs.isSeeThrough,
          searchText: queryArgs.searchText,
          sortOrder: queryArgs.sortOrder,
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
      keepUnusedDataFor: 0,
      query: ({
        id,
        useSession,
      }: {
        id: string;
        useSession?: string;
      }) => {
        const params = [
          ['extraFilters', `RecordID:${id}`],
          ['fields', DEFAULT_VIEW_SIZE],
          ['fields', FIELD_DOC_TYPE],
          ['fields', FIELD_EXTENSION],
          ['fields', FIELD_FILE_SIZE],
          ['fields', FIELD_IDENTIFIER],
          ['fields', FIELD_KEYWORDS],
          ['fields', FIELD_MAX_HEIGHT],
          ['fields', FIELD_MAX_WIDTH],
          ['fields', FIELD_ORIGINAL_FILE_NAME],
          ['fields', FIELD_RECORD_ID],
          ['fields', FIELD_SUBTYPE],
          ['fields', FIELD_TITLE_WITH_FALLBACK],
          ['fields', FIELD_UPDATED_FILE_NAME],
          ['fields', ORIGINAL_VIEW_SIZE],
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

        const name = GetValueByKeyCaseInsensitive(item.fields, FIELD_ORIGINAL_FILE_NAME);
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
          name,
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
