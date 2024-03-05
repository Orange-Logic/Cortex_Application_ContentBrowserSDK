import { createApi } from '@reduxjs/toolkit/query/react';
import { AppBaseQuery } from '../../utils/api';

// Define a service using a base URL and expected endpoints
export const assetsApi = createApi({
  reducerPath: 'assetsApi',
  baseQuery: AppBaseQuery,
  tagTypes: ['AvailableProxies'],
  endpoints: (builder) => ({
    getAvailableProxies: builder.query < { proxies: { [key: string]: string } }, void>({
      query: () => ({
        url: '/webapi/extensibility/integrations/gab/assetbrowser/AvailableProxies_4ea',
      }),
      providesTags: (_result, _error, _args) => ['AvailableProxies'],
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetAvailableProxiesQuery } = assetsApi;
