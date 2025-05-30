import type { PayloadAction } from '@reduxjs/toolkit';
import {
  AUTH_FEATURE_ACCESS_KEY_KEY, AUTH_FEATURE_KEY, AUTH_FEATURE_SITE_URL_KEY, USE_SESSION,
} from '@/consts/auth';
import { RootState } from '@/store';
import { resetImportStatus } from '@/store/assets/assets.slice';
import { GetAccessKeyRes, GetAccessKeyResponseCode, OAuthRes } from '@/types/auth';
import { getRequestUrl } from '@/utils/getRequestUrl';
import { deleteData, getData, storeData } from '@/utils/storage';
import { generateRandomString } from '@/utils/string';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { assetsApi } from '../assets/assets.api';
import { searchApi } from '../search/search.api';
import { userApi } from '../user/user.api';
import {
  abortAuthService, authAbortController, CANCEL_AUTH_MESSAGE, getAccessKeyService,
  getAccessTokenService, requestAuthorizeService,
} from './auth.service';

export { AUTH_FEATURE_ACCESS_KEY_KEY, AUTH_FEATURE_KEY, AUTH_FEATURE_SITE_URL_KEY, USE_SESSION };

export type AuthState = {
  siteUrl: string;
  userConfigSiteUrl?: string;
  nonce?: string;
  accessToken?: string;
  accessKey?: string;
  oAuthUrl?: string;
  error?: string;
  status: 'authenticated' | 'unauthenticated' | 'restoreSession' | 'requestLogin' | 'waitForAuthorise';
  useHeaders?: boolean;
  useSession: string;
};

// #region Slice
const initialState: AuthState = {
  siteUrl: '',
  status: 'unauthenticated',
  useSession: '',
};

export const authSlice = createSlice({
  name: AUTH_FEATURE_KEY,
  initialState,
  reducers: {
    setAccessToken: (state, action: PayloadAction<string | undefined>) => {
      state.accessToken = action.payload;
    },
    updateAuthTokens: (state, action: PayloadAction<Partial<AuthState>>) => {
      state.status = 'authenticated';
      state.accessKey = action.payload.accessKey;
      state.accessToken = action.payload.accessToken;
    },
    setSiteUrl: (state, action: PayloadAction<string>) => {
      state.error = '';
      state.siteUrl = action.payload;
    },
    setUserConfigSiteUrl: (state, action: PayloadAction<string>) => {
      state.userConfigSiteUrl = action.payload;
    },
    generateNonce: (state) => {
      state.nonce = generateRandomString(12);
    },
    logout: (state) => {
      state.status = 'unauthenticated';
      state.error = '';
      state.accessKey = undefined;
      state.accessToken = undefined;
      state.oAuthUrl = undefined;
      state.siteUrl = state.userConfigSiteUrl ?? '';
      state.nonce = undefined;
      state.useSession = '';
      state.useHeaders = false;
      deleteData(AUTH_FEATURE_ACCESS_KEY_KEY);
      deleteData(AUTH_FEATURE_SITE_URL_KEY);
      deleteData(USE_SESSION);
      deleteData('selectedSortOrder');
      deleteData('selectedSortDirection');
      deleteData('selectedView');
      deleteData('newlySelectedFacet');
      deleteData('newFacets');
      deleteData('selectedFilter');
      deleteData('selectedIsSeeThrough');
      deleteData('searchText');
      deleteData('lastLocation');
      deleteData('retryCount');
    },
    setAuthStatus: (state, action: PayloadAction<AuthState['status']>) => {
      state.status = action.payload;
    },
    setUseSession: (state, action: PayloadAction<string>) => {
      state.useSession = action.payload;
      storeData(USE_SESSION, action.payload);
    },
    setUseHeaders: (state, action: PayloadAction<boolean>) => {
      state.useHeaders = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        oAuth.fulfilled,
        (state, { payload }) => {
          if (payload) {
            const { accessKey, accessToken, siteUrl } = payload;
            state.accessKey = accessKey;
            state.accessToken = accessToken;
            state.status = 'authenticated';
            state.siteUrl = siteUrl;
            storeData(AUTH_FEATURE_ACCESS_KEY_KEY, accessKey ?? '');
            storeData(AUTH_FEATURE_SITE_URL_KEY, siteUrl);
          }
        },
      )
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
      .addCase(oAuth.rejected, (state, action) => {
        state.error = action.payload as string;
        state.status = 'unauthenticated';
        deleteData(AUTH_FEATURE_ACCESS_KEY_KEY);
      })
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
      .addCase(oAuth.pending, (state) => {
        state.error = '';
      });
  },
});

export default authSlice.reducer;
export const { logout, setAccessToken, generateNonce, setSiteUrl, setUserConfigSiteUrl, setUseSession, setUseHeaders } = authSlice.actions;
// #endregion

// #region Selector
export const authenticatedSelector = (rootState: RootState) =>
  rootState[AUTH_FEATURE_KEY].status == 'authenticated';

export const accessKeySelector = (rootState: RootState) =>
  rootState[AUTH_FEATURE_KEY].accessKey;

export const accessTokenSelector = (rootState: RootState) =>
  rootState[AUTH_FEATURE_KEY].accessToken;

export const oAuthUrlSelector = (rootState: RootState) =>
  rootState[AUTH_FEATURE_KEY].oAuthUrl;

export const siteUrlSelector = (rootState: RootState) =>
  rootState[AUTH_FEATURE_KEY].siteUrl;

export const userConfigSiteUrlSelector = (rootState: RootState) =>
  rootState[AUTH_FEATURE_KEY].userConfigSiteUrl;

export const authErrorSelector = (rootState: RootState) =>
  rootState[AUTH_FEATURE_KEY].error;

export const nonceSelector = (rootState: RootState) =>
  rootState[AUTH_FEATURE_KEY].nonce;

export const authStateSelector = (rootState: RootState) => 
  rootState[AUTH_FEATURE_KEY].status;

export const applySessionSelector = (rootState: RootState) =>
  rootState[AUTH_FEATURE_KEY].useSession;

export const applyHeadersSelector = (rootState: RootState) =>
  !!rootState[AUTH_FEATURE_KEY].useHeaders;

export const appAuthUrlSelector = (rootState: RootState) => {
  const siteUrl = rootState[AUTH_FEATURE_KEY].siteUrl;
  return siteUrl ? getRequestUrl(siteUrl, `AppAuth?RID=${rootState[AUTH_FEATURE_KEY].nonce}`) : '';
};
// #endregion

// #region Action
export const cancelAuth = createAsyncThunk(`${AUTH_FEATURE_KEY}/oauth`, (_, { dispatch, getState }) => {
  if (!authenticatedSelector(getState() as RootState)) {
    abortAuthService();
    dispatch(authSlice.actions.setAuthStatus('unauthenticated'));
  }
});

export const oAuth = createAsyncThunk<OAuthRes, { siteUrl: string }>(
  `${AUTH_FEATURE_KEY}/oauth`,
  async ({ siteUrl }, { rejectWithValue, dispatch, getState }) => {
    dispatch(authSlice.actions.setSiteUrl(siteUrl));
    dispatch(authSlice.actions.setAuthStatus('requestLogin'));

    const execute = async () => {
      dispatch(generateNonce());
      const nonce = nonceSelector(getState() as RootState);
      const resp = await requestAuthorizeService(nonce ?? '');
      if (authAbortController.controller.signal.aborted) {
        throw Error(CANCEL_AUTH_MESSAGE);
      }
      const requestID = resp.requestID;
      const popupUrl = appAuthUrlSelector(getState() as RootState);
      dispatch(authSlice.actions.setAuthStatus('waitForAuthorise'));
      window.open(popupUrl, '_blank');
      const getAccessKeyData = await getAccessKeyService(requestID);
      if (getAccessKeyData.accessKey) {
        const tokenResp = await getAccessTokenService(getAccessKeyData.accessKey);
        if (tokenResp.accessToken) {
          return {
            code: GetAccessKeyResponseCode.Authorized,
            accessKey: getAccessKeyData.accessKey,
            accessToken: tokenResp.accessToken,
            siteUrl,
          };
        }
      }
      return getAccessKeyData;
    };

    let getOAuthResult: Awaited<ReturnType<typeof execute>>;
    try {
      getOAuthResult = await execute();
      if (getOAuthResult.code !== GetAccessKeyResponseCode.Authorized) {
        return rejectWithValue((getOAuthResult as GetAccessKeyRes).message);
      }

      // Login successfully, reset other state
      dispatch(resetImportStatus());
      dispatch(searchApi.util.resetApiState());
      dispatch(assetsApi.util.resetApiState());
      dispatch(userApi.util.resetApiState());

      return getOAuthResult as OAuthRes;
    } catch (exception) {
      return rejectWithValue((exception as Error).message);
    }
  },
);

export const initAuthInfoFromCache = createAsyncThunk(
  `${AUTH_FEATURE_KEY}/initAuthInfoFromCache`,
  async (_, { dispatch, rejectWithValue, getState }) => {
    dispatch(authSlice.actions.setAuthStatus('restoreSession'));
    const useHeaders = applyHeadersSelector(getState() as RootState);

    const execute = async () => {
      if (useHeaders && window.OrangeDAMContentBrowser?._onRequestToken) {
        const result = await window.OrangeDAMContentBrowser?._onRequestToken();

        if (result) {
          dispatch(
          // eslint-disable-next-line @typescript-eslint/no-use-before-define
            authSlice.actions.updateAuthTokens({
              accessKey: result.token,
            }),
          );
          if (result.siteUrl) {
            dispatch(setSiteUrl(result.siteUrl));
          }
        }

        return !!result;
      } else {
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        let siteUrl = siteUrlSelector(getState() as RootState);
        if (!siteUrl) {
          siteUrl = await getData(AUTH_FEATURE_SITE_URL_KEY) ?? '';
          if (!siteUrl) {
          // eslint-disable-next-line @typescript-eslint/no-use-before-define
            siteUrl = userConfigSiteUrlSelector(getState() as RootState) ?? '';
          }
          if (siteUrl) {
          // eslint-disable-next-line @typescript-eslint/no-use-before-define
            dispatch(setSiteUrl(siteUrl));
          }
        }

        if (!siteUrl) {
          return false;
        }

        const accessKey = await getData(AUTH_FEATURE_ACCESS_KEY_KEY);

        if (accessKey) {
          if (useHeaders) {
            dispatch(
            // eslint-disable-next-line @typescript-eslint/no-use-before-define
              authSlice.actions.updateAuthTokens({
                accessKey,
              }),
            );
          } else {
            const accessToken = (
              await getAccessTokenService(accessKey)
            ).accessToken;
            if (accessToken) {
              dispatch(
                // eslint-disable-next-line @typescript-eslint/no-use-before-define
                authSlice.actions.updateAuthTokens({
                  accessKey,
                  accessToken,
                }),
              );
            } else {
              dispatch(logout());
              return false;
            }
          }
          return true;
        }
        return false;
      }
    };

    let isSuccess = false;

    try {
      isSuccess = await execute();
      if (!isSuccess) {
        return rejectWithValue('Unable to recover access key');
      }

      dispatch(resetImportStatus());
      dispatch(searchApi.util.resetApiState());
      dispatch(assetsApi.util.resetApiState());
      dispatch(userApi.util.resetApiState());
    } catch (exception) {
      return rejectWithValue((exception as Error).message);
    } finally {
      if (!isSuccess) {
        dispatch(logout());
      }
    }
  },
);
// #endregion
