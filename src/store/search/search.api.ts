import _ from 'lodash';
import { createApi } from '@reduxjs/toolkit/query/react';
import { DEFAULT_VIEW_SIZE, FIELD_CORTEX_PATH, FIELD_DOC_TYPE, FIELD_FILE_SIZE, FIELD_KEYWORDS, FIELD_MAX_HEIGHT, FIELD_MAX_WIDTH, FIELD_TITLE_WITH_FALLBACK } from '../../consts/data';
import { AssetImage, Folder, GetContentRequest, GetContentResponse, MediaType } from '../../types/search';
import { AppBaseQuery, GetValueByKeyCaseInsensitive } from '../../utils/api';
import { PAGE_SIZE } from '../../utils/constants';
import { IsNullOrWhiteSpace } from '../../utils/string';

const resolveExtraFilters = (searchText: string, mediaTypes: MediaType[]) => {
  const typesToFilter = _.isEmpty(mediaTypes) ? Object.keys(MediaType) : mediaTypes;

  const typesQuery = typesToFilter
    .map(type => type === MediaType.MultiMedia ? 'FileExtension:PDF' : `MediaType:${type}`)
    .join(' OR ');

  const searchTextQuery = IsNullOrWhiteSpace(searchText) ? '' : ` AND Text:${searchText}`;

  return typesQuery + searchTextQuery;
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
      }: {
        folder: Folder;
        searchText: string;
      }) => ({
        url: '/webapi/extensibility/integrations/gab/assetbrowser/getcontent_4bw_v1',
        params: [
          ['objectRecordID', folder.id],
          ['fields', 'CoreField.TitleWithFallback'],
          ['fields', 'CoreField.DocType'],
          ['fields', 'Document.CortexPath'],
          [
            'extraFilters',
            IsNullOrWhiteSpace(searchText)
              ? 'MediaType:Story OR MediaType:Album'
              : `(MediaType:Story OR MediaType:Album) AND Story_Title:${searchText}`,
          ],
          ['seeThru', !IsNullOrWhiteSpace(searchText)],
        ],
      }),
      transformResponse: (
        response: GetContentResponse,
        _meta,
        arg,
      ): Folder[] => {
        return (
          response.contentItems
            ?.map((item) => ({
              id: item.recordID,
              title:
                GetValueByKeyCaseInsensitive(item.fields, FIELD_TITLE_WITH_FALLBACK) ?? '',
              docType:
                GetValueByKeyCaseInsensitive(item.fields, FIELD_DOC_TYPE) ?? '',
              path: [...arg.folder.path, arg.folder.title],
              fullPath: (
                GetValueByKeyCaseInsensitive(item.fields, FIELD_CORTEX_PATH) ?? ''
              ).replace(/^Root\//i, ''),
            }))
            .filter((item) => {
              return item.title
                .toLowerCase()
                .startsWith(arg.searchText.toLowerCase());
            }) ?? []
        );
      },
      providesTags: (_result, _error, arg) => {
        return [{ type: 'Folders', id: arg.folder.id }];
      },
    }),
    getImages: builder.query({
      query: ({
        folderID,
        searchText,
        page,
        isSeeThrough,
        mediaTypes,
      }: GetContentRequest) => {
        return {
          url: '/webapi/extensibility/integrations/gab/assetbrowser/getcontent_4bw_v1',
          params: [
            ['objectRecordID', folderID],
            ['fields', FIELD_TITLE_WITH_FALLBACK],
            ['fields', DEFAULT_VIEW_SIZE],
            ['fields', FIELD_KEYWORDS],
            ['fields', FIELD_MAX_WIDTH],
            ['fields', FIELD_MAX_HEIGHT],
            ['fields', FIELD_FILE_SIZE],
            [
              'extraFilters',
              resolveExtraFilters(searchText, mediaTypes),
            ],
            ['seeThru', isSeeThrough],
            ['start', page * PAGE_SIZE],
            ['limit', PAGE_SIZE],
          ],
        };
      },
      transformResponse: (response: GetContentResponse): { items: AssetImage[]; totalCount: number } => ({
        items:
          response.contentItems?.map((item) => ({
            id: item.recordID,
            name:
              GetValueByKeyCaseInsensitive(item.fields, FIELD_TITLE_WITH_FALLBACK) ?? '',
            imageUrl:
              GetValueByKeyCaseInsensitive(item.fields, DEFAULT_VIEW_SIZE) ?? '',
            tags:
              GetValueByKeyCaseInsensitive(item.fields, FIELD_KEYWORDS) ?? '',
            width:
              GetValueByKeyCaseInsensitive(item.fields, FIELD_MAX_WIDTH) ?? '0',
            height:
              GetValueByKeyCaseInsensitive(item.fields, FIELD_MAX_HEIGHT) ?? '0',
            size:
              GetValueByKeyCaseInsensitive(item.fields, FIELD_FILE_SIZE) ?? '0 MB',
          })) ?? [],
        totalCount: response.totalCount,
      }),
      providesTags: (_result, _error, arg) => {
        return [
          { type: 'ImagesInFolders', id: arg.folderID, page: arg.page, searchText: arg.searchText, isSeeThrough: arg.isSeeThrough },
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
      // Refetch when the page arg changes
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      },
      serializeQueryArgs: ({ endpointName }) => {
        return endpointName;
      },
    }),
    getContent: builder.query({
      query: (
        objectRecordID: string,
        seeThru?: boolean,
        fields?: string[],
      ) => ({
        url: '/webapi/extensibility/integrations/gab/assetbrowser/getcontent_4bw_v1',
        params: { objectRecordID, seeThru, fields },
      }),
      transformResponse: (response: GetContentResponse) => {
        return response.contentItems;
      },
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetFoldersQuery, useGetImagesQuery, useGetContentQuery } =
  searchApi;
