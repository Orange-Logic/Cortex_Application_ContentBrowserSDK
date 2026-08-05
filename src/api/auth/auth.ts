import http from '@/api/api';
import { UserInfo } from '@/types/auth';

import { AuthApiEndpoint } from '../endpoints';

export async function apiGetUserInfo() {
  try {
    const response = await http.request<UserInfo>({
      method: 'GET',
      transformResponse: [
        ...(Array.isArray(http.defaults.transformResponse)
          ? http.defaults.transformResponse
          : []),
        (
          rawResponse: UserInfo,
        ): UserInfo => {
          if (
            !rawResponse ||
            typeof rawResponse !== 'object'
          ) {
            throw new Error('Invalid response format');
          }

          const avatarHasProtocol = rawResponse.avatar?.includes('://');

          if (avatarHasProtocol) {
            return rawResponse;
          }

          return {
            ...rawResponse,
            avatar: `${http.defaults.baseURL?.replace(/\/$/, '') ?? ''}/${rawResponse.avatar?.replace(/^\//, '')}`,
          };
        },
      ],
      url: AuthApiEndpoint.GET_USER_INFO,
    });

    return response.data;
  } catch (error) {
    return null;
  }
}
