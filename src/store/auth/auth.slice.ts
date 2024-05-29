/* eslint-disable @typescript-eslint/no-use-before-define */
import type { PayloadAction } from '@reduxjs/toolkit';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '..';
import {
  GetAccessKeyRes,
  GetAccessKeyResponseCode,
  OAuthRes,
} from '../../types/auth';
import { getRequestUrl } from '../../utils/getRequestUrl';
import { deleteData, getData, storeData } from '../../utils/storage';
import { RandomString } from '../../utils/string';
import { resetImportStatus } from '../assets/assets.slice';
import { resetSearchState } from '../search/search.slice';
import {
  CANCEL_AUTH_MESSAGE,
  abortAuthService,
  authAbortController,
  getAccessKeyService,
  getAccessTokenService,
  requestAuthorizeService,
} from './auth.service';

export const AUTH_FEATURE_KEY = 'auth';
export const AUTH_FEATURE_ACCESS_KEY_KEY = `${AUTH_FEATURE_KEY}_access_key_key`;
export const AUTH_FEATURE_SITE_URL_KEY = `${AUTH_FEATURE_KEY}_site_url_key`;

export type AuthState = {
  siteUrl: string;
  userConfigSiteUrl?: string;
  nonce?: string;
  accessToken?: string;
  accessKey?: string;
  oAuthUrl?: string;
  error?: string;
  status: 'authenticated' | 'unauthenticated' | 'restoreSession' | 'requestLogin' | 'waitForAuthorise';
};

// ======================================================================
// Action
// ======================================================================
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
      if (authAbortController.signal.aborted) {
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
      dispatch(resetSearchState());
      dispatch(resetImportStatus());

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

    const execute = async () => {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      let siteUrl = siteUrlSelector(getState() as RootState);
      if (!siteUrl) {
        siteUrl = await getData(AUTH_FEATURE_SITE_URL_KEY) || '';
        if (!siteUrl) {
          // eslint-disable-next-line @typescript-eslint/no-use-before-define
          siteUrl = userConfigSiteUrlSelector(getState() as RootState) ?? '';
        }
        if (!!siteUrl) {
          // eslint-disable-next-line @typescript-eslint/no-use-before-define
          dispatch(setSiteUrl(siteUrl));
        }
      }

      if (!siteUrl) {
        return false;
      }

      const accessKey = await getData(AUTH_FEATURE_ACCESS_KEY_KEY);

      if (accessKey) {
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
          return true;
        }
      }
      return false;
    };

    let isSuccess = false;

    try {
      isSuccess = await execute();
      if (!isSuccess) {
        return rejectWithValue('Unable to recover access key');
      }

      // Login successfully, reset other state
      dispatch(resetSearchState());
      dispatch(resetImportStatus());
    } catch (exception) {
      return rejectWithValue((exception as Error).message);
    } finally {
      if (!isSuccess) {
        dispatch(logout());
      }
    }
  },
);

// ======================================================================
// Slice
// ======================================================================
const initialState: AuthState = {
  siteUrl: '',
  status: 'unauthenticated',
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
      state.nonce = RandomString(12);
    },
    logout: (state) => {
      state.status = 'unauthenticated';
      state.error = '';
      state.accessKey = undefined;
      state.accessToken = undefined;
      state.oAuthUrl = undefined;
      state.siteUrl = state.userConfigSiteUrl ?? '';
      deleteData(AUTH_FEATURE_ACCESS_KEY_KEY);
      deleteData(AUTH_FEATURE_SITE_URL_KEY);
    },
    setAuthStatus: (state, action: PayloadAction<AuthState['status']>) => {
      state.status = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(
        oAuth.fulfilled,
        (state, { payload }) => {
          if (!!payload) {
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
      .addCase(oAuth.rejected, (state, action) => {
        state.error = action.payload as string;
        state.status = 'unauthenticated';
        deleteData(AUTH_FEATURE_ACCESS_KEY_KEY);
      })
      .addCase(oAuth.pending, (state) => {
        state.error = '';
      });
  },
});

export default authSlice.reducer;
export const { logout, setAccessToken, generateNonce, setSiteUrl, setUserConfigSiteUrl } = authSlice.actions;

// ======================================================================
// Selector
// ======================================================================
export const authenticatedSelector = (rootState: RootState) =>
  rootState[AUTH_FEATURE_KEY].status == 'authenticated';

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

export const appAuthUrlSelector = (rootState: RootState) => {
  const siteUrl = rootState[AUTH_FEATURE_KEY].siteUrl;
  return !!siteUrl ? getRequestUrl(siteUrl, `AppAuth?RID=${rootState[AUTH_FEATURE_KEY].nonce}`) : '';
};