import { Mutex } from 'async-mutex';

import { store } from '@/store';
import { getAccessTokenService } from '@/store/auth/auth.service';
import {
  AUTH_FEATURE_KEY, AuthState, endSession, logout, readStoredAccessKey, updateAuthTokens,
} from '@/store/auth/auth.slice';

import { getRequestUrl } from './getRequestUrl';
import { getSiteSessionRequestUrl } from './site-session';

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

/**
 * The access key the next token request should present: the live session's, which `oAuth`
 * drops before it changes the site, or the one stored for this site when an earlier failure
 * ended the session without condemning the key. Header mode never presents a stored key,
 * the same as restore. Throws when host storage cannot be read, which is not the same as
 * finding no key. (42AX2G)
 */
const readAccessKey = async (authState: AuthState): Promise<string | undefined> => {
  if (authState.accessKey) {
    return authState.accessKey;
  }
  if (authState.useHeaders) {
    return undefined;
  }
  return readStoredAccessKey(authState.siteUrl);
};

/**
 * Refresh the access token using the stored access key. De-duplicates concurrent calls via a shared mutex.
 * Returns the new access token on success, or null if the refresh failed.
 *
 * On failure the session is always dropped, but the stored access key is only
 * discarded when the server itself declined it — a transport failure keeps the key
 * so a later refresh can succeed. (42AX2G)
 */
export const refreshAccessToken = async (): Promise<string | null> => {
  if (store.getState()[AUTH_FEATURE_KEY].useSiteSession) {
    return null;
  }
  await mutex.waitForUnlock();

  // Another caller already refreshed while we were waiting — re-read latest state.
  if (mutex.isLocked()) {
    await mutex.waitForUnlock();
    return store.getState()[AUTH_FEATURE_KEY].accessToken ?? null;
  }

  const release = await mutex.acquire();
  try {
    const authState = store.getState()[AUTH_FEATURE_KEY];

    if (authState.useSiteSession) {
      return null;
    }

    // A host token is not an access key: ask the host for a new one (as 2.2.8 did) and never log out. (42BXQB)
    if (authState.useHeaders) {
      try {
        const result = await window.OrangeDAMContentBrowser?._onRequestToken?.();
        if (result?.token) {
          store.dispatch(updateAuthTokens({ accessKey: result.token }));
          return result.token;
        }
      } catch {
        // No token from the host.
      }
      return null;
    }

    let accessKey: string | undefined;
    try {
      accessKey = await readAccessKey(authState);
    } catch {
      // A failed read says nothing about the key, and `logout` would delete it —
      // a host storage bridge can time out while the key is still stored. (42AX2G)
      store.dispatch(endSession());
      return null;
    }

    if (!accessKey || !authState.siteUrl) {
      // No key was presented, so none was declined. `logout` here would delete a key
      // stored for another site. (42AX2G)
      store.dispatch(endSession());
      return null;
    }

    try {
      const tokenResp = await getAccessTokenService(accessKey);
      if (store.getState()[AUTH_FEATURE_KEY].useSiteSession) {
        return null;
      }
      if (tokenResp.accessToken) {
        store.dispatch(updateAuthTokens({ accessKey, accessToken: tokenResp.accessToken }));
        return tokenResp.accessToken;
      }
      // Only an explicit `success: false` condemns the key. A well-formed response
      // carrying no token is a server anomaly, so keep the key and let the next
      // refresh retry. (42AX2G)
      store.dispatch(tokenResp.success === false ? logout() : endSession());
      return null;
    } catch {
      // Reached on a transport failure or a non-JSON error body. This runs on every
      // 401 during normal use, so discarding the key here cost users a valid
      // credential on any passing network blip. Keep it and let the next refresh
      // retry. (42AX2G)
      if (!store.getState()[AUTH_FEATURE_KEY].useSiteSession) {
        store.dispatch(endSession());
      }
      return null;
    }
  } finally {
    release();
  }
};

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
  if (authState.useSiteSession) {
    const headers = new Headers(options?.headers);
    ['Authorization', 'Token', 'UseSession'].forEach((name) => headers.delete(name));
    return fetchWithTimeout(getSiteSessionRequestUrl(authState.siteUrl, resource), {
      ...options, credentials: 'same-origin', headers,
    });
  }
  resource = getRequestUrl(authState.siteUrl, resource, authState.accessToken);
  const response = await fetchWithTimeout(resource, options);

  if (retryWhenUnauthorize && !response.ok && response.status === 401) {
    const newToken = await refreshAccessToken();
    if (!newToken || !authState.siteUrl) {
      return response;
    }
    resource = getRequestUrl(authState.siteUrl, resource, newToken);
    return await fetchWithTimeout(resource, options);
  }

  return response;
};
