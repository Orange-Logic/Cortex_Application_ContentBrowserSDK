import { store } from '@/store';
import { UserInfo } from '@/types/user';
import { AppBaseQuery } from '@/utils/api';
import { createApi, retry } from '@reduxjs/toolkit/query/react';

import { AUTH_FEATURE_KEY } from '../auth/auth.slice';

const baseQueryWithRetry = retry(AppBaseQuery, { 
  maxRetries: 2,
});
// Define a service using a base URL and expected endpoints
export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: baseQueryWithRetry,
  endpoints: (builder) => ({
    getUserInfo: builder.query({
      query: () => '/webapi/extensibility/integrations/contentBrowserSDK/authorization/getuserinfo_4bs_v1',
      transformResponse: (response: UserInfo): UserInfo => {
        const authState = store.getState()[AUTH_FEATURE_KEY];
        
        const avatarHasProtocol = response.avatar?.includes('://');
        if (avatarHasProtocol) {
          return response;
        }

        return {
          ...response,
          avatar: `${authState.siteUrl}/${response.avatar}`,
        };
      },
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetUserInfoQuery } = userApi;
