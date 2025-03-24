import _mapKeys from 'lodash-es/mapKeys';
import _camelCase from 'lodash-es/camelCase';

import {
  DEFAULT_VIEW_SIZE, FIELD_CORTEX_PATH, FIELD_DOC_TYPE, FIELD_EXTENSION, FIELD_FILE_SIZE,
  FIELD_HAS_BROWSER_CHILDREN,
  FIELD_IDENTIFIER, FIELD_KEYWORDS, FIELD_MAX_HEIGHT, FIELD_MAX_WIDTH, FIELD_SCRUB_URL, FIELD_SUBTYPE, FIELD_TITLE_WITH_FALLBACK,
} from '@/consts/data';
import { Asset, Folder, GetContentRequest, GetContentResponse } from '@/types/search';
import { AppBaseQuery, GetValueByKeyCaseInsensitive } from '@/utils/api';
import { isNullOrWhiteSpace } from '@/utils/string';
import { createApi } from '@reduxjs/toolkit/query/react';

const NATURAL_SORT_ORDER_REFERENCE_ID = 'OR4ND000000063615';

const resolveFolderExtraFilters = (searchText: string) => {
  if (isNullOrWhiteSpace(searchText)) {
    return 'MediaType:Story OR MediaType:Album';
  }
  return `(MediaType:Story OR MediaType:Album) AND Story_Title:${searchText}`;
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
      .map(visibilityClass => `PessimisticVisibilityClass:${visibilityClass}`)
      .join(' OR ');
    if (visibilityClasses.length > 1) {
      visibilityClassesQuery = `(${visibilityClassesQuery})`;
    }
  }
  
  const searchTextQuery = isNullOrWhiteSpace(searchText) ? '' : `Text:${searchText}`;
  
  const filters = [statusQuery, extensionsQuery, visibilityClassesQuery, searchTextQuery].filter(filter => filter.length > 0);

  return filters.join(' AND ');
};

// Define a service using a base URL and expected endpoints
export const searchApi = createApi({
  reducerPath: 'searchApi',
  baseQuery: AppBaseQuery,
  tagTypes: ['Folders', 'Images', 'ImagesInFolders'],
  endpoints: (builder) => ({
    getFolders: builder.query({
      query: ({
        folder,
        searchText,
        useSession,
      }: {
        folder: Folder;
        searchText: string;
        useSession?: string;
      }) => {
        const params = [
          [
            'extraFilters',
            resolveFolderExtraFilters(searchText),
          ],
          ['fields', FIELD_CORTEX_PATH],
          ['fields', FIELD_DOC_TYPE],
          ['fields', FIELD_TITLE_WITH_FALLBACK],
          ['fields', FIELD_HAS_BROWSER_CHILDREN],
          ['objectRecordID', folder.id],
          ['orderBy', NATURAL_SORT_ORDER_REFERENCE_ID],
          ['seeThru', !isNullOrWhiteSpace(searchText)],
        ];

        if (useSession) {
          params.push(['UseSession', useSession]);
        }

        return {
          url: '/webapi/extensibility/integrations/gab/assetbrowser/getcontent_4bw_v1',
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
        useSession,
      }) => {
        const params = [
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
          url: '/webapi/extensibility/integrations/gab/assetbrowser/getcontent_4bw_v1',
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
        page,
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
          ['fields', FIELD_KEYWORDS],
          ['fields', FIELD_MAX_WIDTH],
          ['fields', FIELD_MAX_HEIGHT],
          ['fields', FIELD_FILE_SIZE],
          ['fields', FIELD_DOC_TYPE],
          ['fields', FIELD_SUBTYPE],
          ['fields', FIELD_IDENTIFIER],
          ['fields', FIELD_EXTENSION],
          [
            'extraFilters',
            resolveAssetExtraFilters({
              extensions,
              searchText,
              statuses,
              visibilityClasses,
            }),
          ],
          ['orderBy', sortOrder],
          ['seeThru', isSeeThrough],
          ['start', page * pageSize],
          ['limit', pageSize],
        ];
        if (mappedMediaTypes.length) {
          params.push(...mappedMediaTypes);
        }
        if (useSession) {
          params.push(['UseSession', useSession]);
        }
        return {
          url: '/webapi/extensibility/integrations/gab/assetbrowser/getcontent_4bw_v1',
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
          response.contentItems?.map((item) => ({
            docType   : GetValueByKeyCaseInsensitive(item.fields, FIELD_DOC_TYPE) ?? '',
            docSubType: GetValueByKeyCaseInsensitive(item.fields, FIELD_SUBTYPE) ?? '',
            extension : GetValueByKeyCaseInsensitive(item.fields, FIELD_EXTENSION) ?? '',
            height    : GetValueByKeyCaseInsensitive(item.fields, FIELD_MAX_HEIGHT) ?? '0',
            id:       item.recordID,
            identifier: GetValueByKeyCaseInsensitive(item.fields, FIELD_IDENTIFIER) ?? '',
            imageUrl  : GetValueByKeyCaseInsensitive(item.fields, DEFAULT_VIEW_SIZE) ?? '',
            name      : GetValueByKeyCaseInsensitive(item.fields, FIELD_TITLE_WITH_FALLBACK) ?? '',
            scrubUrl  : GetValueByKeyCaseInsensitive(item.fields, FIELD_SCRUB_URL) ?? '',
            size      : GetValueByKeyCaseInsensitive(item.fields, FIELD_FILE_SIZE) ?? '0 MB',
            tags      : GetValueByKeyCaseInsensitive(item.fields, FIELD_KEYWORDS) ?? '',
            width     : GetValueByKeyCaseInsensitive(item.fields, FIELD_MAX_WIDTH) ?? '0',
          } as Asset)) ?? [],
        totalCount: response.totalCount,
      }),
      providesTags: (_result, _error, arg) => {
        return [
          {
            extensions: arg.extensions,
            id: arg.folderID,
            isSeeThrough: arg.isSeeThrough,
            mediaTypes: arg.mediaTypes,
            page: arg.page,
            searchText: arg.searchText,
            sortOrder: arg.sortOrder,
            statuses: arg.statuses,
            type: 'ImagesInFolders',
          },
          'Images',
        ];
      },
      merge: (currentCachedData, responseData, request) => {
        if (request.arg.page > 0) {
          currentCachedData.items.push(...responseData.items);
          return currentCachedData;
        } else {
          return responseData;
        }
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      },
      serializeQueryArgs: ({ endpointName }) => {
        return endpointName;
      },
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetFoldersQuery, useGetCollectionsQuery, useGetAssetsQuery } =
  searchApi;
