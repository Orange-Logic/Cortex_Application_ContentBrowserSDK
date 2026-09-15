import CortexElement from '@/base/element';
import http from '@/api/api';
import {
  apiAddAssetToFavorite,
  apiGetAssetFavoriteStatus,
  apiGetAssetLinks,
  apiGetAssets,
  apiGetAssetsByIDs,
  apiGetAssetVersionHistory,
  apiGetAvailableExtensions,
  apiGetAvailableProxies,
  apiRemoveAssetFromFavorite,
  DEFAULT_VIEW_SIZE,
  FIELD_ALLOW_ATS_LINK,
  FIELD_DOC_TYPE,
  FIELD_EXTENSION,
  FIELD_FILE_SIZE,
  FIELD_IDENTIFIER,
  FIELD_KEYWORDS,
  FIELD_MAX_HEIGHT,
  FIELD_MAX_WIDTH,
  FIELD_ORIGINAL_FILE_NAME,
  FIELD_RECORD_ID,
  FIELD_SCRUB_URL,
  FIELD_SUBTYPE,
  FIELD_TITLE_WITH_FALLBACK,
  ORIGINAL_VIEW_SIZE,
} from '@/api/asset';
import { GetAssetLinksRequest, GetAssetsByIDsResponse, GetAvailableExtensionsResponse, GetAvailableProxiesResponse } from '@/api/asset/asset.types';
import { apiGetUserInfo } from '@/api/auth';
import { AssetApiEndpoint, AuthApiEndpoint, FOLDER_API_ENDPOINT, MetadataApiEndpoint } from '@/api/endpoints';
import { apiGetFolders } from '@/api/folder';
import {
  apiGetAvailableFacets,
  apiGetContentBrowserParameters,
  apiGetSortOrders,
} from '@/api/metadata';
import { GetContentBrowserParametersResponse } from '@/api/metadata/metadata.types';
import { Asset, GetAssetsRequest, MediaType } from '@/types/asset';
import { UserInfo } from '@/types/auth';
import { Facet, SortOrder } from '@/types/content-browser';
import { GetFolderRequest } from '@/types/folder';
import { getSiteSessionRequestUrl, resolveSiteSessionUrl } from '@/utils/site-session';

import type { ReactiveController } from 'lit';
import _intersection from 'lodash-es/intersection';
import _isEqual from 'lodash-es/isEqual';
import _uniqBy from 'lodash-es/uniqBy';

type FetchAndMergeAssetsControllerOptions = {
  /** Cortex fields the table-view columns read, requested on every search alongside the fixed set. */
  additionalFields?: string[];
  availableDocTypes: string[];
  baseUrl: string;
  defaultFolderId: string;
  defaultIsSeeThrough: boolean;
  defaultSearchText: string;
  defaultSelectedFacets: Record<string, string[]>;
  defaultSortDirection: 'ascending' | 'descending';
  defaultSortOrderName: string;
  token: string;
  useSession: string;
  useSiteSession?: boolean;
};

type FetchAndMergeAssetsControllerDataOptions = {
  allowedExtensions: string[];
  availableRepresentativeSubtypes: string[];
};

export class FetchAndMergeAssetsController implements ReactiveController {
  private readonly host: CortexElement;

  private availableFacets: Array<Facet['facetDetails']> = [];

  private facets: Facet[] = [];

  private items: Array<Asset & Record<string, string | boolean>> = [];

  private totalCount: number = 0;

  private lastRequest: GetAssetsRequest | null = null;

  private sortOrders: Record<string, SortOrder[]> = {};

  private parameters: GetContentBrowserParametersResponse | null = null;

  private availableExtensions: GetAvailableExtensionsResponse | null = null;

  private userInfo: UserInfo | null = null;

  private loading = false;

  private isLoggedIn = true;

  private token: string;

  private useSession: string;

  private useSiteSession: boolean;

  private baseUrl: string;

  private pendingTokenRefresh: Promise<string | null> | null = null;

  private resolvePendingTokenRefresh: ((token: string | null) => void) | null = null;

  private readonly tokenRefreshTimeoutMs = 15000;

  private readonly availableDocTypes: string[];

  private additionalFields: string[];

  private readonly defaultSearchText: string;

  private readonly defaultSelectedFacets: Record<string, string[]>;

  private readonly defaultSortOrderName: string;

  private readonly defaultSortDirection: string;

  private readonly defaultFolderId: string;

  private readonly defaultIsSeeThrough: boolean;

  #lastGetDataParameters: {
    allowedExtensions: string[];
    availableRepresentativeSubtypes: string[];
  } | null = null;

  #lastMappedAvailableExtensions: GetAvailableExtensionsResponse | null = null;

  #lastData: {
    availableExtensions: GetAvailableExtensionsResponse | null;
    availableFacets: Array<Facet['facetDetails']>;
    facets: Facet[];
    isLoggedIn: boolean;
    items: Array<Asset & Record<string, string | boolean>>;
    loading: boolean;
    parameters: {
      ATSEnabled?: boolean;
      autoExtension?: string;
      collectionPath?: string;
      supportedExtensions?: string[];
      supportedRepresentativeSubtypes?: string[];
    } | null;
    request: GetAssetsRequest | null;
    sortOrders: Record<string, SortOrder[]>;
    totalCount: number;
    userInfo: UserInfo | null;
  } | null = null;

  #hasFetchedOnce = false;

  private requestInterceptorId: number | null = null;

  private responseInterceptorId: number | null = null;

  constructor(host: CortexElement, {
    additionalFields,
    availableDocTypes,
    baseUrl,
    defaultFolderId,
    defaultIsSeeThrough,
    defaultSearchText,
    defaultSelectedFacets,
    defaultSortDirection,
    defaultSortOrderName,
    token,
    useSession,
    useSiteSession = false,
  }: FetchAndMergeAssetsControllerOptions) {
    this.host = host;

    this.availableDocTypes = availableDocTypes;

    this.additionalFields = additionalFields ?? [];

    this.defaultFolderId = defaultFolderId;

    this.defaultIsSeeThrough = defaultIsSeeThrough;

    this.defaultSearchText = defaultSearchText;

    this.defaultSelectedFacets = defaultSelectedFacets;

    this.defaultSortOrderName = defaultSortOrderName;

    this.defaultSortDirection = defaultSortDirection;

    this.applyTransportMode(useSiteSession, baseUrl, token, useSession);

    this.requestInterceptorId = http.interceptors.request.use((config) => {
      if (this.useSiteSession) {
        config.baseURL = this.baseUrl;
        config.url = getSiteSessionRequestUrl(this.baseUrl, config.url ?? '');
        config.withCredentials = true;
        config.auth = undefined;
        ['Authorization', 'Token', 'UseSession'].forEach((name) => config.headers.delete(name));
        config.params = { ...config.params };
        for (const key of Object.keys(config.params)) {
          if (['token', 'usesession'].includes(key.toLowerCase())) {
            delete config.params[key];
          }
        }
        return config;
      }
      // Match on the path only: a url may legitimately carry its own query string, and exact equality
      // would drop it out of this allowlist -- silently sending the request without Token/UseSession.
      if (config.url && ![
        AssetApiEndpoint.GET_AVAILABLE_EXTENSIONS,
        AssetApiEndpoint.GET_ASSET_VERSION_HISTORY,
        AssetApiEndpoint.GET_CONTENT_V1,
        AssetApiEndpoint.ADD_ASSET_TO_FAVORITE,
        AssetApiEndpoint.REMOVE_ASSET_FROM_FAVORITE,
        AssetApiEndpoint.GET_FAVORITE_ASSETS,
        AssetApiEndpoint.GET_CONTENT_V3,
        AssetApiEndpoint.GET_AVAILABLE_PROXIES,
        AssetApiEndpoint.GET_ASSET_LINK,
        MetadataApiEndpoint.GET_AVAILABLE_FACETS,
        MetadataApiEndpoint.GET_CONTENT_BROWSER_PARAMETERS,
        MetadataApiEndpoint.GET_SORT_ORDERS,
        AuthApiEndpoint.GET_USER_INFO,
        FOLDER_API_ENDPOINT,
      ].includes(config.url.split('?')[0])) {
        return config;
      }

      if (this.baseUrl) {
        config.baseURL = this.baseUrl;
      }

      config.params = {
        ...config.params,
        Token: this.token || undefined,
        UseSession: this.useSession || undefined,
      };

      return config;
    });

    this.responseInterceptorId = http.interceptors.response.use(
      (response) => {
        if (!this.useSiteSession && response.status >= 200 && response.status < 300 && !this.isLoggedIn) {
          this.isLoggedIn = true;
          this.host.requestUpdate();
        }

        return response;
      },
      async (error) => {
        if (this.useSiteSession && error?.response?.status === 401) {
          this.isLoggedIn = false;
          this.host.requestUpdate();
          return Promise.reject(error);
        }
        const originalConfig = error?.config as (typeof error.config & { _retry?: boolean }) | undefined;

        if (error?.response?.status === 401 && originalConfig && !originalConfig._retry) {
          originalConfig._retry = true;

          const newToken = await this.waitForNewToken();

          if (!newToken) {
            this.isLoggedIn = false;
            this.host.requestUpdate();
            return Promise.reject(error);
          }

          return http.request(originalConfig);
        }

        return Promise.reject(error);
      },
    );

    this.host.addController?.(this);
  }

  private waitForNewToken(): Promise<string | null> {
    if (!this.pendingTokenRefresh) {
      this.pendingTokenRefresh = new Promise((resolve) => {
        this.resolvePendingTokenRefresh = resolve;
      });

      globalThis.dispatchEvent(new CustomEvent('cx-unauthorized'));

      setTimeout(() => {
        if (this.resolvePendingTokenRefresh) {
          this.resolvePendingTokenRefresh(null);
          this.pendingTokenRefresh = null;
          this.resolvePendingTokenRefresh = null;
        }
      }, this.tokenRefreshTimeoutMs);
    }

    return this.pendingTokenRefresh;
  }

  /**
   * Site-session mode decides the transport (cookies on the Cortex origin vs. Token/UseSession
   * params), so it has to be applied to the interceptor state and base URL, not just captured once.
   */
  private applyTransportMode(useSiteSession: boolean, baseUrl: string, token: string, useSession: string) {
    this.useSiteSession = useSiteSession;
    this.baseUrl = useSiteSession ? resolveSiteSessionUrl(baseUrl) : baseUrl;
    this.token = useSiteSession ? '' : token;
    this.useSession = useSiteSession ? '' : useSession;

    http.defaults.baseURL = this.baseUrl;
  }

  /**
   * `setSiteSession(...)` can flip the mode while the host stays mounted, so keep the transport in
   * step with the UI instead of serving requests through the mode the controller was built with.
   */
  updateSiteSession(useSiteSession: boolean, baseUrl: string, token: string, useSession: string) {
    if (useSiteSession === this.useSiteSession) {
      return;
    }

    this.applyTransportMode(useSiteSession, baseUrl, token, useSession);

    // A pending refresh belongs to the previous mode; release its waiter so it cannot resolve later.
    if (this.resolvePendingTokenRefresh) {
      this.resolvePendingTokenRefresh(null);
      this.pendingTokenRefresh = null;
      this.resolvePendingTokenRefresh = null;
    }

    this.isLoggedIn = true;
    this.#hasFetchedOnce = false;

    this.fetchInitialData();

    if (this.lastRequest) {
      this.fetchAndMergeAssets(this.lastRequest);
    }

    this.host.requestUpdate();
  }

  /**
   * Table columns are host configuration and can be reconfigured after mount, unlike the rest of
   * these options — every later fetch must ask for the current field list, not the one that
   * happened to be set when the controller was constructed.
   */
  updateAdditionalFields(additionalFields: string[]) {
    this.additionalFields = additionalFields;
  }

  updateAuth(token: string, useSession: string) {
    if (this.useSiteSession) {
      return;
    }
    const tokenChanged = this.token !== token;
    const wasLoggedOut = !this.isLoggedIn;

    this.token = token;
    this.useSession = useSession;

    if (tokenChanged && this.resolvePendingTokenRefresh) {
      this.resolvePendingTokenRefresh(token || null);
      this.pendingTokenRefresh = null;
      this.resolvePendingTokenRefresh = null;
    }

    if (tokenChanged && wasLoggedOut && token) {
      this.isLoggedIn = true;
      this.fetchInitialData();

      if (this.lastRequest) {
        this.fetchAndMergeAssets(this.lastRequest);
      }

      this.host.requestUpdate();
    }
  }

  private fetchInitialData() {
    apiGetUserInfo().then((userInfo) => {
      this.userInfo = userInfo;

      this.host.requestUpdate();
    });

    apiGetAvailableFacets().then((availableFacets) => {
      this.availableFacets = availableFacets;

      this.host.requestUpdate();
    });

    apiGetContentBrowserParameters().then((parameters) => {
      this.parameters = parameters;

      this.host.requestUpdate();
    });

    apiGetAvailableExtensions().then((availableExtensions) => {
      this.availableExtensions = availableExtensions;

      this.host.requestUpdate();
    });
  }

  private _debounceTimeout: ReturnType<typeof setTimeout> | undefined;

  private _debouncePromise: Promise<unknown> | null = null;

  private _debounceResolve: ((value: unknown) => void) | null = null;

  private mapAvailableExtensions(allowedExtensions: string[]) {
    // object of extensions that's available for selection in the custom format dialog.
    // E.g. {Image: [{display: 'JPG', value: '.jpg'}], Audio: [{display: 'MP3', value: '.mp3'}]}
    if (!this.availableExtensions || !allowedExtensions || allowedExtensions.length === 0) {
      return this.availableExtensions;
    }

    return Object.entries(this.availableExtensions).reduce((acc, [key, value]) => {
      return {
        ...acc,
        [key]: value.filter((ext) => {
          if (!allowedExtensions || allowedExtensions.length === 0) {
            return true;
          }

          return allowedExtensions.some((item) => ext.value.toLowerCase() === `.${item.toLowerCase()}`);
        }),
      };
    }, this.availableExtensions);
  }

  async fetchAssets(request: GetAssetsRequest) {
    return await apiGetAssets(request);
  }

  async fetchFolders(request: GetFolderRequest) {
    return await apiGetFolders(request);
  }

  /**
   * A folder switch (or any refetch) can return a facet list that no longer includes a
   * currently-selected value. Keep those selected-but-missing values visible (count 0) instead
   * of silently dropping them from the filter dropdown, mirroring the legacy React behavior.
   */
  private mergeFacetsWithSelected(
    newFacets: Facet[],
    previousFacets: Facet[],
    selectedFacets: Record<string, string[]> = {},
  ): Facet[] {
    const facetKey = (facet: Facet) => `${facet.facetDetails.facetFieldName}|${facet.facetDetails.displayName}`;

    const facetsMap = new Map(
      previousFacets.map((facet) => [
        facetKey(facet),
        {
          ...facet,
          values: facet.values
            .filter((value) => selectedFacets[facet.facetDetails.facetFieldName]?.includes(value.value))
            .map((value) => ({ ...value, count: 0 })),
        },
      ]),
    );

    newFacets
      .filter((facet) => facet.values.length > 0)
      .forEach((facet) => {
        const previousSelectedValues = facetsMap.get(facetKey(facet))?.values ?? [];

        const values = [
          ...facet.values,
          ...previousSelectedValues.filter((previousValue) => !facet.values.some(
            (value) => value.value === previousValue.value && value.displayValue === previousValue.displayValue,
          )),
        ];

        facetsMap.set(facetKey(facet), { ...facet, values });
      });

    return Array.from(facetsMap.values());
  }

  async fetchAndMergeAssets(request: GetAssetsRequest) {
    /**
     * Always run these lines immediately
     */
    this.loading = true;
    this.host.requestUpdate();

    if (request.start === null) {
      return;
    }

    /**
     * Now only debounce the fetching section
     */
    if (this._debounceTimeout) {
      clearTimeout(this._debounceTimeout);
      this._debounceTimeout = undefined;
    }

    /**
     * Only one outstanding promise per debounce
     */
    this._debouncePromise ??= new Promise((resolve) => {
      this._debounceResolve = resolve;
    });

    this._debounceTimeout = setTimeout(async () => {
      if (Object.keys(this.sortOrders).length === 0) {
        const sortOrders = await apiGetSortOrders();
        this.sortOrders = sortOrders;
      }

      const forceRefetch =
        request.start === this.lastRequest?.start &&
        !!request.pageSize &&
        !!this.lastRequest?.pageSize &&
        request.pageSize > this.lastRequest?.pageSize;

      if (!this.#hasFetchedOnce) {
        request = {
          ...request,
          folderId: this.defaultFolderId,
          isSeeThrough: this.defaultIsSeeThrough,
          searchText: this.defaultSearchText,
          selectedFacets: this.defaultSelectedFacets,
          sortDirection: this.defaultSortDirection,
          sortOrderName: this.defaultSortOrderName,
        };
      }

      let sortOrder;

      if (request.sortOrderName && request.sortDirection) {
        sortOrder = this.sortOrders[request.sortOrderName]?.find((item) => item.sortDirection.toLowerCase() === request.sortDirection?.toLowerCase())?.id;

        if (!sortOrder && this.sortOrders[request.sortOrderName][0]) {
          sortOrder = this.sortOrders[request.sortOrderName][0].id;
          request.sortDirection = this.sortOrders[request.sortOrderName][0].sortDirection;
        }
      }

      request = {
        ...request,
        fields: this.additionalFields,
        limitedToDocTypes: this.availableDocTypes,
      };

      this.lastRequest = request;

      const assets = await apiGetAssets({
        ...request,
        sortOrder,
      });

      if (request.start && request.start > 0 && !forceRefetch) {
        this.items = _uniqBy([...this.items, ...assets.items], 'recordId');
      } else {
        this.items = assets.items;
      }
      this.facets = this.mergeFacetsWithSelected(assets.facets, this.facets, request.selectedFacets);
      this.totalCount = assets.totalCount;

      this.loading = false;
      this.#hasFetchedOnce = true;
      this.host.requestUpdate();

      if (this._debounceResolve) {
        this._debounceResolve(this.lastRequest);
      }
      this._debouncePromise = null;
      this._debounceResolve = null;
    }, 200);
  }

  async fetchAssetFavoriteStatus(id: string) {
    return apiGetAssetFavoriteStatus({
      assetRecordId: id,
    });
  }

  async fetchAssetByID(id: string, options?: {
    allowedExtensions?: string[];
    canFavorite?: boolean;
    simplePick?: boolean;
  }) {
    const { allowedExtensions = [], canFavorite = false, simplePick = false } = options ?? {};

    const promises: Partial<[Promise<GetAssetsByIDsResponse>, Promise<GetAvailableProxiesResponse | undefined>, Promise<boolean>]> = [
      apiGetAssetsByIDs({
        extraFields: [
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
          ORIGINAL_VIEW_SIZE,
        ],
        recordIds: [id],
      }),
      // Simple-pick mode never offers a proxy or a transformation, so the only thing this response
      // would still supply is the preview image -- which getcontent already returns as LargeSizePreview.
      simplePick
        ? Promise.resolve(undefined)
        : apiGetAvailableProxies({
          assetRecordId: id,
        }),
    ];

    if (canFavorite) {
      promises.push(this.fetchAssetFavoriteStatus(id));
    } else {
      promises.push(Promise.resolve(false));
    }

    const [assets, proxyData, isFavorite = false] = await Promise.all(promises);

    const item = assets?.items[0];

    if (!item) {
      return undefined;
    }

    let assetExtension = item[FIELD_EXTENSION];

    if (assetExtension && !assetExtension.startsWith('.')) {
      assetExtension = '.' + assetExtension;
    }

    return {
      asset: {
        allowATSLink: item[FIELD_ALLOW_ATS_LINK] === 'True',
        docSubType: item[FIELD_SUBTYPE] ?? '',
        docType: (item[FIELD_DOC_TYPE] as MediaType) ?? '',
        extension: assetExtension,
        height: item[FIELD_MAX_HEIGHT] ?? '0',
        id: item.recordId,
        identifier: item[FIELD_IDENTIFIER] ?? '',
        imageUrl: item[DEFAULT_VIEW_SIZE] ?? '',
        inColdStorage: Boolean(item.inColdStorage),
        name: item[FIELD_TITLE_WITH_FALLBACK] ?? '',
        originalUrl: item[ORIGINAL_VIEW_SIZE] ?? '',
        previewUrl: proxyData?.previewUrl ?? item[DEFAULT_VIEW_SIZE] ?? '',
        recordId: item[FIELD_RECORD_ID] ?? '',
        scrubUrl: item[FIELD_SCRUB_URL] ?? '',
        size: item[FIELD_FILE_SIZE] ?? '0 MB',
        tags: item[FIELD_KEYWORDS] ?? '',
        width: item[FIELD_MAX_WIDTH] ?? '0',
      },
      isFavorite,
      proxies: (proxyData?.proxies ?? []).filter((proxy) => {
        if (!allowedExtensions || allowedExtensions.length === 0) {
          return true;
        }
        let proxyExtension = '';

        if (proxy.extension) {
          proxyExtension = proxy.extension.replace('.', '');
        } else {
          const extensionFromPermanentLinks = proxy.permanentLink?.split('.').at(-1);
          proxyExtension = extensionFromPermanentLinks ?? '';
        }

        return allowedExtensions.some((extension) => {
          if (!proxyExtension) {
            return false;
          }

          return proxyExtension.toLowerCase() === extension.toLowerCase();
        });
      }),
    };
  }

  async fetchAssetVersionHistory(id: string) {
    return apiGetAssetVersionHistory({
      assetRecordId: id,
    });
  }

  async addAssetToFavorite(id: string) {
    return apiAddAssetToFavorite({
      assetRecordId: id,
    });
  }

  async removeAssetFromFavorite(id: string) {
    return apiRemoveAssetFromFavorite({
      assetRecordId: id,
    });
  }

  async getAssetLink(payload: GetAssetLinksRequest) {
    const response = await apiGetAssetLinks({
      ...payload,
      useSession: this.useSiteSession ? undefined : payload.useSession ?? this.useSession,
    });

    if (!payload.useRepresentative) {
      return response;
    }

    /**
     * The resolved link always carries the asset's own extension (see apiGetAssetLinks),
     * which is wrong for a representative image (e.g. a video's .mp4 extension). Fall back
     * to the asset's already-known representative/thumbnail URL instead, matching the legacy
     * `importAssets` thunk behavior.
     */
    return {
      ...response,
      data: response.data.map((item, index) => ({
        ...item,
        imageUrl: payload.assets[index]?.imageUrl ?? item.imageUrl,
      })),
    };
  }

  getData(options?: FetchAndMergeAssetsControllerDataOptions) {
    const {
      allowedExtensions = [],
      availableRepresentativeSubtypes = [],
    } = options ?? {};

    if (!_isEqual(this.#lastGetDataParameters, options)) {
      this.#lastGetDataParameters = {
        allowedExtensions,
        availableRepresentativeSubtypes,
      };

      this.#lastMappedAvailableExtensions = this.mapAvailableExtensions(allowedExtensions);
    }

    this.#lastData = {
      availableExtensions: this.#lastMappedAvailableExtensions,
      availableFacets: this.availableFacets,
      facets: this.facets,
      isLoggedIn: this.isLoggedIn,
      items: this.items,
      loading: this.loading,
      /**
       * Keep `null` when apiGetContentBrowserParameters() hasn't resolved yet instead of
       * spreading `{...null}` into an empty-but-truthy object — consumers (e.g.
       * content-browser-format-dialog's can-custom-format) need to tell "not loaded yet" apart
       * from "loaded, ATSEnabled is false". The fetch already calls host.requestUpdate() once it
       * resolves, so this naturally re-renders with the real value once it's ready.
       */
      parameters: this.parameters ? {
        ...this.parameters,
        supportedRepresentativeSubtypes: availableRepresentativeSubtypes?.length
          ? _intersection(
            availableRepresentativeSubtypes,
            this.parameters.supportedRepresentativeSubtypes ?? [],
          )
          : this.parameters.supportedRepresentativeSubtypes ?? [],
      } : null,
      request: this.lastRequest,
      sortOrders: this.sortOrders,
      totalCount: this.totalCount,
      userInfo: this.userInfo,
    };

    return this.#lastData;
  }

  hostConnected() {
    this.fetchInitialData();
  }

  hostDisconnected() {
    if (this.requestInterceptorId !== null) {
      http.interceptors.request.eject(this.requestInterceptorId);
      this.requestInterceptorId = null;
    }

    if (this.responseInterceptorId !== null) {
      http.interceptors.response.eject(this.responseInterceptorId);
      this.responseInterceptorId = null;
    }

    this.facets = [];
    this.items = [];
    this.totalCount = 0;
    this.sortOrders = {};
  }
}
