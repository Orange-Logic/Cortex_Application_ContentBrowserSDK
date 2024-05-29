import { createApi } from '@reduxjs/toolkit/query/react';
import { UserInfo } from '../../types/user';
import { AppBaseQuery } from '../../utils/api';

// Define a service using a base URL and expected endpoints
export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: AppBaseQuery,
  endpoints: (builder) => ({
    getUserInfo: builder.query({
      query: () => '/webapi/extensibility/integrations/gab/authorization/getuserinfo_4bs_v1',
      transformResponse: (response: UserInfo) => {
        return response;
      },
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetUserInfoQuery } = userApi;
