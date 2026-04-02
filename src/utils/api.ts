import { Mutex } from 'async-mutex';

import { store } from '@/store';
import { getAccessTokenService } from '@/store/auth/auth.service';
import {
  AUTH_FEATURE_KEY, logout, setAccessToken,
} from '@/store/auth/auth.slice';

import { getRequestUrl } from './getRequestUrl';

type CortexFetchOptions = RequestInit & {
  /**
   * Time out in milliseconds
   */
  timeout?: number;
  /**
   * Extended with timeout option and retry option. This value is true by default.
   * Fetch the data from the given url with retry when the response is not ok or have status code 401
   * This function will try to fetch the data again with a new token if the previous token is expired
   */
  retryWhenUnauthorize?: boolean
};

const mutex = new Mutex();

/*
 * Check if the available status of the site url
 * If site is not available then we will return an error message, else null
 */
export const checkCorrectSiteUrl = (url: string): Promise<string | null> => {
  return new Promise((resolve, rejected) => {
    const img = new Image();
    img.onload = () => resolve(null);
    img.onerror = () => rejected();
    img.src = `${url}${url.endsWith('/') ? '' : '/'}Include/ImageUsedToCheckSiteAvailabilityFromBrowser.gif`;
  });
};


/**
 * Wrapper of fetch API with timeout option
 * @param resource
 * @param options
 * @returns
 */
const fetchWithTimeout = async (resource: RequestInfo | URL, options?: RequestInit & { timeout?: number }) => {
  const { timeout } = options ?? {};

  if (timeout) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    const response = await fetch(resource, {
      ...options,
      signal: options?.signal ?? controller.signal,
    });
    clearTimeout(id);
    return response;
  } else {
    return await fetch(resource, options);
  }
};

/**
 * Wrapper of fetch API with timeout option
 * @param resource
 * @param options
 * @returns
 */
export const cortexFetch = async (resource: string, options?: CortexFetchOptions) => {
  const { retryWhenUnauthorize = true } = options || {};
  const authState = store.getState()[AUTH_FEATURE_KEY];
  resource = getRequestUrl(authState.siteUrl, resource, authState.accessToken);
  const response = await fetchWithTimeout(resource, options);

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
              needsLoggingOut = true;
              return response;
            }
          } catch (e) {
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
