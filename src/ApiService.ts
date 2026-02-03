import { store } from '@/store';
import { searchApi } from '@/store/search/search.api';
import type { GetContentRequest, GetFoldersRequest } from '@/types/search';
import { FOLDER_PAGE_SIZE } from './utils/constants';

export class APIService {
  private static instance: APIService;
  
  static getInstance(): APIService {
    if (!APIService.instance) {
      APIService.instance = new APIService();
    }
    return APIService.instance;
  }

  async fetchAssets(params: GetContentRequest) {
    /**
     * This approach requires the store to be initialized and the API to be properly set up
     */
    const result = await store.dispatch(
      searchApi.endpoints.getAssets.initiate(params, { forceRefetch: true }),
    );

    if ('data' in result) {
      return result.data;
    }

    return {
      facets: [],
      items: [],
      totalCount: 0,
    };
  }

  async fetchFolders(params: GetFoldersRequest) {
    const result = await store.dispatch(
      searchApi.endpoints.getFolders.initiate({
        ...params,
        pageSize: params.pageSize ?? FOLDER_PAGE_SIZE,
      }, { forceRefetch: true }),
    );

    if ('data' in result) {
      return result.data;
    }

    return {
      items: [],
      totalCount: 0,
    };
  }
}

export const ContentBrowserApiService = APIService.getInstance();