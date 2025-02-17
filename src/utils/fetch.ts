import { Mutex } from 'async-mutex';

import { RootState, store } from '@/store';
import { getAccessTokenService } from '@/store/auth/auth.service';
import { AUTH_FEATURE_KEY, logout, setAccessToken } from '@/store/auth/auth.slice';

const mutex = new Mutex();

interface CortexFetchOptions extends RequestInit {
  /**
   * Time out in milliseconds
   */
  timeout?: number;
  /**
   * Extended with timeout option and retry option. This value is true by default.
   * Fetch the data from the given url with retry when the response is not ok or have status code 401
   * This function will try to fetch the data again with a new token if the previous token is expired
   * The token will be refreshed similar to the logic in AppBaseQuery
   */
  retryWhenUnauthorize?: boolean
}


/**
 * Wrapper of fetch API with timeout option
 * @param resource 
 * @param options 
 * @returns 
 */
const fetchWithTimeout = async (resource: RequestInfo | URL, options: RequestInit & { timeout?: number }) => {
  const { timeout } = options;

  if (timeout) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    const response = await fetch(resource, {
      ...options,
      signal: options.signal ?? controller.signal,
    });
    clearTimeout(id);
    return response;
  } else {
    return await fetch(resource, options);
  }
};

// Merge the request path with the correct host URL
export const getRequestUrl = (hostUrl: string, path: string, token?: string) => {
  const url = new URL(path, hostUrl);
  if (token) {
    if (!url.searchParams.Token) {
      url.searchParams.append('Token', token);
    } else {
      url.searchParams.Token = token;
    }
  }
  return url.href;
};

/**
 * Wrapper of fetch API with timeout option
 * @param resource 
 * @param options 
 * @returns 
 */
export const cortexFetch = async (resource: string, options: CortexFetchOptions) => {
  const { retryWhenUnauthorize = true } = options;
  const authState = (store.getState() as RootState)[AUTH_FEATURE_KEY];
  resource        = getRequestUrl(authState.siteUrl, resource, authState.accessToken);
  const response    = await fetchWithTimeout(resource, options);

  if (retryWhenUnauthorize && !response.ok && response.status === 401) {
    await mutex.waitForUnlock();

    if (!mutex.isLocked()) {
      const release = await mutex.acquire();
      try {
        if (!authState.accessKey || !authState.siteUrl) {
          store.dispatch(logout());
          return response;
        } else {
          let needsLoggingOut = false;
          try {
            const tokenResp = await getAccessTokenService(authState.accessKey);

            if (tokenResp.accessToken) {
              store.dispatch(setAccessToken(tokenResp.accessToken));
              resource = getRequestUrl(authState.siteUrl, resource, authState.accessToken);
              return await fetchWithTimeout(resource, options);
            } else {
              console.warn('access token not found -- logging out');
              needsLoggingOut = true;
              return response;
            }
          } catch (e) {
            console.error(`${e} -- logging out`);
            needsLoggingOut = true;
            return response;
          } finally {
            if (needsLoggingOut) {
              store.dispatch(logout());
            }
          }
        }
      } finally {
        release();
      }
    } else {
      await mutex.waitForUnlock();
      return await fetchWithTimeout(resource, options);
    }
  }

  return response;
};
