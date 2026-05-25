import http from '@/api/api';
import { Asset, GetAssetsRequest, MediaType } from '@/types/asset';
import { TransformationAction } from '@/types/content-browser';
import { AssetApiEndpoint } from '@/api/endpoints';

import {
  CortexErrorResponse,
  GetAssetLinkRequest,
  GetAssetLinkResponse,
  GetAssetLinksRequest,
  GetAssetLinksResponse,
  GetAssetsByIDsRequest,
  GetAssetsByIDsResponse,
  GetAssetsRawResponse,
  GetAssetsResponse,
  GetAssetVersionHistoryResponse,
  GetAvailableExtensionsResponse,
  GetAvailableProxiesRawResponse,
  GetAvailableProxiesResponse,
  GetContentResponse,
} from './asset.types';
export const DEFAULT_VIEW_SIZE = 'CoreField.LargeSizePreview';
export const FIELD_ALLOW_ATS_LINK = 'AllowATSLink';
export const FIELD_CORTEX_PATH = 'Document.CortexPath';
export const FIELD_DOC_CAPTION_LONG = 'Document.CaptionLong';
export const FIELD_DOC_TITLE = 'Document.Title';
export const FIELD_DOC_TYPE = 'CoreField.DocType';
export const FIELD_EXTENSION = 'Document.FileExtension';
export const FIELD_FILE_SIZE = 'CoreField.FileSize';
export const FIELD_HAS_BROWSER_CHILDREN = 'Document.HasBrowserChildren';
export const FIELD_IDENTIFIER = 'CoreField.Identifier';
export const FIELD_KEYWORDS = 'CoreField.Keywords';
export const FIELD_LARGE_SIZE_PREVIEW_ID = 'Document.DocumentDirectRepresentativeRID';
export const FIELD_MAX_HEIGHT = 'CoreField.MaxHeight';
export const FIELD_MAX_WIDTH = 'CoreField.MaxWidth';
export const FIELD_ORIGINAL_FILE_NAME = 'CoreField.OriginalFileName';
export const FIELD_RECORD_ID = 'Document.RecordID';
export const FIELD_SCRUB_URL = 'ScrubURL';
export const FIELD_STORAGE_GROUP = 'CoreField.S6_StorageGroup';
export const FIELD_SUBTYPE = 'CoreField.DocSubType';
export const FIELD_TITLE_WITH_FALLBACK = 'CoreField.TitleWithFallback';
export const FIELD_UPDATED_FILE_NAME = 'CoreField.UpdatedFileName';
export const LIBRARY_NAME = 'Library';
export const MESSAGE_NEW_LINE = '\n';
export const ORIGINAL_VIEW_SIZE = 'CoreField.OriginalPreview';

export function resolveAssetExtraFilters(
  selectedFacets?: Record<string, string[]>,
) {
  if (!selectedFacets || Object.keys(selectedFacets).length === 0) {
    return {};
  }

  return Object.entries(selectedFacets).reduce<{
    SubtypeCriteria?: string[];
    FacetFilters?: Record<string, string[]>;
  }>(
    (acc, [key, values]) => {
      if (!values || values.length === 0) {
        return acc;
      }

      if (key === 'Types') {
        return {
          ...acc,
          SubtypeCriteria: values,
        };
      }

      return {
        ...acc,
        FacetFilters: {
          ...acc.FacetFilters,
          [key]: values,
        },
      };
    },
    {},
  );
}

function isCortexErrorResponse(response: GetAssetLinkResponse | CortexErrorResponse): response is CortexErrorResponse {
  return response && typeof response === 'object' && 'ErrorCode' in response;
}

function createId() {
  const cryptoApi = globalThis.crypto;

  if (cryptoApi?.randomUUID) {
    return cryptoApi.randomUUID();
  }

  if (cryptoApi?.getRandomValues) {
    const bytes = cryptoApi.getRandomValues(new Uint8Array(16));

    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;

    const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0'));

    return [
      hex.slice(0, 4).join(''),
      hex.slice(4, 6).join(''),
      hex.slice(6, 8).join(''),
      hex.slice(8, 10).join(''),
      hex.slice(10).join(''),
    ].join('-');
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export async function apiGetAssetLinks({
  assets,
  extension,
  extraFields,
  parameters,
  permanentLink,
  proxyPreference,
  transformations,
  useSession,
}: GetAssetLinksRequest): Promise<GetAssetLinksResponse> {
  const getAssetLinkErrors: { [key: string]: Asset[] } = {};
  const isOnlyOneAssetSelected = assets.length === 1;
  let hasError = false;

  try {
    const responses = await Promise.all(assets.map((asset) => {
      return http.request<
        GetAssetLinkResponse,
        GetAssetLinkRequest
      >({
        method: 'GET',
        params: {
          ExtraFields: extraFields,
          GenerateAssetUrl: !permanentLink,
          Parameters: parameters,
          Proxy: proxyPreference,
          RecordId: asset.recordId,
          UseSession: useSession || undefined,
        },
        paramsSerializer: {
          indexes: null,
        },
        transformResponse: [
          ...(Array.isArray(http.defaults.transformResponse)
            ? http.defaults.transformResponse
            : []),
          (rawResponse: GetAssetLinkResponse | CortexErrorResponse): GetAssetLinkResponse => {
            if (isCortexErrorResponse(rawResponse)) {
              hasError = true;
              // We will give more details error message if only one asset was imported
              if (isOnlyOneAssetSelected) {
                if (getAssetLinkErrors[rawResponse.ErrorCode]) {
                  getAssetLinkErrors[rawResponse.ErrorCode].push(asset);
                } else {
                  getAssetLinkErrors[rawResponse.ErrorCode] = [asset];
                }
              }

              return {
                imageUrl: asset.imageUrl,
              } as GetAssetLinkResponse;
            }

            const sourceUrl = permanentLink || rawResponse.imageUrl;
            const [sourcePath, sourceQuery] = sourceUrl.split('?', 2);
            const mergedParams = new URLSearchParams(sourceQuery ?? '');
            let imageUrl = sourcePath;

            if (transformations && transformations.length > 0) {
              imageUrl += '/t/';
            }

            transformations?.forEach(({ key, value }) => {
              if (key === TransformationAction.Resize) {
                const validTransformations = [
                  ...[
                    {
                      key: 're_w_',
                      value: value.width,
                    },
                    {
                      key: 're_h_',
                      value: value.height,
                    },
                  ]
                    .filter((item) => item.value !== undefined)
                    .map((item) => ({
                      key: item.key,
                      value: Math.round(Number(item.value)),
                    })),
                  {
                    key: 're_rm_',
                    value: 'stretch',
                  },
                ];

                validTransformations.forEach(({ key: vKey, value: vValue }, index) => {
                  imageUrl += `${vKey}${vValue}${index < validTransformations.length - 1 ? ',' : ''}`;
                });

                imageUrl += '/';
              }

              if (key === TransformationAction.Crop) {
                const validTransformations = [
                  ...[
                    {
                      key: 'c_w_',
                      value: value.width,
                    },
                    {
                      key: 'c_h_',
                      value: value.height,
                    },
                    {
                      key: 'c_x_',
                      value: value.x,
                    },
                    {
                      key: 'c_y_',
                      value: value.y,
                    },
                  ]
                    .filter((item) => item.value !== undefined)
                    .map((item) => ({
                      key: item.key,
                      value: Math.round(Number(item.value)),
                    })),
                  {
                    key: 'c_whu_',
                    value: 'pixel',
                  },
                ];

                validTransformations.forEach(({ key: vKey, value: vValue }, index) => {
                  imageUrl += `${vKey}${vValue}${index < validTransformations.length - 1 ? ',' : ''}`;
                });

                imageUrl += '/';
              }

              if (key === TransformationAction.Rotate) {
                const validTransformations = [{
                  key: 'r_a_',
                  value: value.rotation,
                }].filter((item) => item.value !== undefined).map((item) => ({ key: item.key, value: Math.round(Number(item.value)) }));

                validTransformations.forEach(({ key: vKey, value: vValue }, index) => {
                  imageUrl += `${vKey}${vValue}${index < validTransformations.length - 1 ? ',' : ''}`;
                });

                imageUrl += '/';
              }

              if (key === TransformationAction.Quality) {
                const validTransformations = [{
                  key: 'q_level_',
                  value: value.quality,
                }].filter((item) => item.value !== undefined).map((item) => ({ key: item.key, value: Math.round(Number(item.value)) }));

                validTransformations.forEach(({ key: vKey, value: vValue }, index) => {
                  imageUrl += `${vKey}${vValue}${index < validTransformations.length - 1 ? ',' : ''}`;
                });

                imageUrl += '/';
              }

              if (key === TransformationAction.Metadata) {
                const validTransformations = [{
                  key: 'fl_keep_metadata',
                  value: value.keepMetadata,
                }].filter((item) => item.value !== undefined).map((item) => ({ key: item.key, value: item.value }));

                validTransformations.forEach(({ key: vKey }, index) => {
                  imageUrl += `${vKey}${index < validTransformations.length - 1 ? ',' : ''}`;
                });

                imageUrl += '/';
              }
            });

            if (transformations && transformations.length > 0) {
              imageUrl += `${asset.identifier}`;
            }

            if (!permanentLink) {
              const assetExtension = extension ?? asset.extension;
              const normalizedExtension = assetExtension.startsWith('.') ? assetExtension : `.${assetExtension}`;
              imageUrl = imageUrl.replace(/\.[^./]+$/, '') + normalizedExtension;
            }

            parameters?.forEach(({ key, value }) => {
              mergedParams.set(key.trim(), value.trim());
            });

            if (useSession && !mergedParams.has('UseSession')) {
              mergedParams.set('UseSession', useSession);
            }

            const finalQuery = mergedParams.toString();
            if (finalQuery) {
              imageUrl += `?${finalQuery}`;
            }

            return {
              ...rawResponse,
              imageUrl,
            };
          },
        ],
        url: AssetApiEndpoint.GET_ASSET_LINK,
      });
    }));

    return {
      data: responses.map((response) => response.data),
      isError: hasError,
    };
  } catch {
    return {
      data: [],
      isError: true,
    };
  }
}

export async function apiGetAssetsByIDs({
  extraFields,
  recordIds,
}: GetAssetsByIDsRequest) {
  if (!Array.isArray(recordIds) || recordIds.length === 0) {
    return { facets: [], items: [], totalCount: 0 };
  }

  const validatedExtraFields =
    extraFields?.filter((field) => field && typeof field === 'string') ?? [];

  try {
    const response = await http.request<GetAssetsByIDsResponse, GetAssetsByIDsRequest>({
      method: 'GET',
      params: {
        ExtraFilters: `RecordID:${recordIds.join(' OR ')}`,
        Fields: [
          ...validatedExtraFields,
          ORIGINAL_VIEW_SIZE,
          FIELD_UPDATED_FILE_NAME,
          FIELD_ORIGINAL_FILE_NAME,
          FIELD_DOC_TITLE,
          FIELD_DOC_CAPTION_LONG,
        ],
        SeeThru: true,
      },
      paramsSerializer: {
        indexes: null,
      },
      responseType: 'json',
      transformResponse: [
        ...(Array.isArray(http.defaults.transformResponse)
          ? http.defaults.transformResponse
          : []),
        (rawResponse: GetContentResponse): GetAssetsByIDsResponse => {
          const mappedItems =
            rawResponse.contentItems?.map((item) => {
              let name = item.fields[FIELD_UPDATED_FILE_NAME] ?? '';

              if (name === '') {
                name = item.fields[FIELD_ORIGINAL_FILE_NAME] ?? '';
              }

              return {
                name,
                originalUrl: item.fields[ORIGINAL_VIEW_SIZE] ?? '',
                recordId: item.recordID,
                ...validatedExtraFields.reduce(
                  (acc, field) => {
                    acc[field] = item.fields[field] ?? '';

                    return acc;
                  },
                  {} as Record<string, string>,
                ),
              };
            }) ?? [];

          mappedItems.sort((a, b) => {
            const indexA = recordIds.indexOf(a.recordId);
            const indexB = recordIds.indexOf(b.recordId);

            return indexA - indexB;
          });

          return {
            facets: rawResponse.facets,
            items: mappedItems,
            totalCount: rawResponse.totalCount,
          };
        },
      ],
      url: AssetApiEndpoint.GET_CONTENT_V1,
    });

    return response.data;
  } catch (error) {
    return {
      facets: [],
      items: [],
      totalCount: 0,
    };
  }
}

export async function apiGetAssets({
  folderId,
  isSeeThrough,
  limitedToDocTypes = [],
  pageSize,
  searchText,
  selectedFacets,
  sortOrder,
  start,
  useSession,
}: GetAssetsRequest) {
  try {
    const response = await http.request<GetAssetsResponse>({
      data: {
        Fields: [
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
          FIELD_STORAGE_GROUP,
          ORIGINAL_VIEW_SIZE,
        ],
        Limit: pageSize || undefined,
        LimitedToDocTypes: limitedToDocTypes,
        ObjectRecordID: folderId || undefined,
        OrderBy: sortOrder,
        SeeThru: isSeeThrough || undefined,
        SelectedFacets: selectedFacets,
        Start: start,
        Text: searchText || undefined,
        UseSession: useSession || undefined,
        ...resolveAssetExtraFilters(selectedFacets),
      },
      method: 'POST',
      transformResponse: [
        ...(Array.isArray(http.defaults.transformResponse)
          ? http.defaults.transformResponse
          : []),
        (rawResponse: GetAssetsRawResponse): GetAssetsResponse => {
          const mappedItems =
            rawResponse.contentItems?.map((item) => {
              let extension = item.fields[FIELD_EXTENSION] ?? '';
              const name = item.fields[FIELD_ORIGINAL_FILE_NAME];

              if (extension && !extension.startsWith('.')) {
                extension = '.' + extension;
              }

              return {
                allowATSLink: item.fields[FIELD_ALLOW_ATS_LINK] === 'True',
                docSubType: item.fields[FIELD_SUBTYPE] ?? '',
                docType: (item.fields[FIELD_DOC_TYPE] as MediaType) ?? '',
                extension,
                height: item.fields[FIELD_MAX_HEIGHT] ?? '0',
                id: item.recordID,
                identifier: item.fields[FIELD_IDENTIFIER] ?? '',
                imageUrl: item.fields[DEFAULT_VIEW_SIZE] ?? '',
                inColdStorage: item.fields[FIELD_STORAGE_GROUP] === 'Cold Storage',
                name: name ?? '',
                originalUrl: item.fields[ORIGINAL_VIEW_SIZE] ?? '',
                recordId: item.fields[FIELD_RECORD_ID] ?? '',
                scrubUrl: item.fields[FIELD_SCRUB_URL] ?? '',
                size: item.fields[FIELD_FILE_SIZE] ?? '0 MB',
                tags: item.fields[FIELD_KEYWORDS] ?? '',
                width: item.fields[FIELD_MAX_WIDTH] ?? '0',
              };
            }) ?? [];

          return {
            facets: rawResponse.facets,
            items: mappedItems,
            totalCount: rawResponse.totalCount,
          };
        },
      ],
      url: AssetApiEndpoint.GET_CONTENT_V3,
    });

    return response.data;
  } catch (error) {
    return {
      facets: [],
      items: [],
      totalCount: 0,
    };
  }
}

export async function apiGetAvailableProxies({
  assetRecordId,
  siteUrl,
}: {
  assetRecordId: string;
  siteUrl?: string;
  token?: string;
}) {
  try {
    const response = await http.request<GetAvailableProxiesResponse>({
      baseURL: siteUrl,
      method: 'GET',
      params: {
        RecordId: assetRecordId,
      },
      responseType: 'json',
      transformResponse: [
        ...(Array.isArray(http.defaults.transformResponse)
          ? http.defaults.transformResponse
          : []),
        (
          rawResponse: GetAvailableProxiesRawResponse,
        ): GetAvailableProxiesResponse => {
          if (!rawResponse || typeof rawResponse !== 'object') {
            return {
              previewUrl: '',
              proxies: [],
            };
          }

          return {
            previewUrl: rawResponse.previewUrl ?? '',
            proxies: rawResponse.proxies?.map((proxy) => ({
              cdnName: proxy.cdnName,
              extension: proxy.extension,
              formatHeight: proxy.formatHeight,
              formatWidth: proxy.formatWidth,
              height: proxy.height,
              id: createId(),
              permanentLink: proxy.permanentLink,
              proxyLabel: proxy.proxyLabel,
              proxyName: proxy.proxyName,
              width: proxy.width,
            })) ?? [],
          };
        },
      ],
      url: AssetApiEndpoint.GET_AVAILABLE_PROXIES,
    });

    return response.data;
  } catch (error) {
    return {
      previewUrl: '',
      proxies: [],
    };
  }
}

export async function apiGetAvailableExtensions() {
  try {
    const response = await http.request<GetAvailableExtensionsResponse>({
      method: 'GET',
      responseType: 'json',
      transformResponse: [
        ...(Array.isArray(http.defaults.transformResponse)
          ? http.defaults.transformResponse
          : []),
        (
          rawResponse: { extensions: GetAvailableExtensionsResponse },
        ): GetAvailableExtensionsResponse => {
          return rawResponse.extensions;
        },
      ],
      url: AssetApiEndpoint.GET_AVAILABLE_EXTENSIONS,
    });

    return response.data;
  } catch (error) {
    return {} as GetAvailableExtensionsResponse;
  }
}

export async function apiGetAssetFavoriteStatus({
  assetRecordId,
}: {
  assetRecordId: string;
}) {
  try {
    const response = await http.request<boolean>({
      method: 'GET',
      params: {
        RecordId: assetRecordId,
      },
      responseType: 'json',
      transformResponse: [
        ...(Array.isArray(http.defaults.transformResponse)
          ? http.defaults.transformResponse
          : []),
        (
          rawResponse: {
            favoriteRecordIds: string[];
          },
        ): boolean => {
          if (!rawResponse.favoriteRecordIds) {
            return false;
          }

          return rawResponse.favoriteRecordIds.includes(assetRecordId);
        },
      ],
      url: AssetApiEndpoint.GET_FAVORITE_ASSETS,
    });

    return response.data;
  } catch (error) {
    return false;
  }
}

export async function apiGetAssetVersionHistory({
  assetRecordId,
}: {
  assetRecordId: string;
}) {
  try {
    const response = await http.request<GetAssetVersionHistoryResponse>({
      method: 'GET',
      params: {
        RecordId: assetRecordId,
      },
      responseType: 'json',
      transformResponse: [
        ...(Array.isArray(http.defaults.transformResponse)
          ? http.defaults.transformResponse
          : []),
        (
          rawResponse: {
            count: number;
            versions: Array<Record<string, string>>;
          },
        ): GetAssetVersionHistoryResponse => {
          return {
            count: rawResponse.count,
            versions: rawResponse.versions.map((version) => ({
              createByEmail: version.CreateByEmail,
              fileImportDate: version.FileImportDate,
              scrubUrl: version.ScrubUrl,
              versionCreateDate: version.VersionCreateDate,
              versionFileName: version.UpdatedFileName || version.VersionFileName,
              versionFileUrl: version.PreviewUrl,
              versionId: version.VersionID,
              versionNumber: Number(version.VersionNumber),
              versionNumberDisplay: version.VersionNumberDisplay,
            })),
          };
        },
      ],
      url: AssetApiEndpoint.GET_ASSET_VERSION_HISTORY,
    });

    return response.data;
  } catch (error) {
    return {
      count: 0,
      versions: [],
    };
  }
}

export async function apiAddAssetToFavorite({
  assetRecordId,
  siteUrl,
}: {
  assetRecordId: string;
  siteUrl?: string;
}): Promise<boolean> {
  try {
    const response = await http.request<boolean>({
      baseURL: siteUrl,
      data: {
        RecordId: assetRecordId,
      },
      method: 'POST',
      responseType: 'json',
      transformResponse: [
        ...(Array.isArray(http.defaults.transformResponse)
          ? http.defaults.transformResponse
          : []),
        (rawResponse: { status: string, success: boolean }): boolean => {
          if (rawResponse.success) {
            return true;
          }

          return false;
        },
      ],
      url: AssetApiEndpoint.ADD_ASSET_TO_FAVORITE,
    });

    return response.data;
  } catch (error) {
    return false;
  }
}

export async function apiRemoveAssetFromFavorite({
  assetRecordId,
  siteUrl,
}: {
  assetRecordId: string;
  siteUrl?: string;
}): Promise<boolean> {
  try {
    const response = await http.request<boolean>({
      baseURL: siteUrl,
      data: {
        RecordId: assetRecordId,
      },
      method: 'POST',
      responseType: 'json',
      transformResponse: [
        ...(Array.isArray(http.defaults.transformResponse)
          ? http.defaults.transformResponse
          : []),
        (rawResponse: { status: string, success: boolean }): boolean => {
          if (rawResponse.success) {
            return true;
          }

          return false;
        },
      ],
      url: AssetApiEndpoint.REMOVE_ASSET_FROM_FAVORITE,
    });

    return response.data;
  } catch (error) {
    return false;
  }
}