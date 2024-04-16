import type { PayloadAction } from '@reduxjs/toolkit';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '..';
import { MESSAGE_NEW_LINE } from '../../consts/data';
import {
  GetAccessKeyRes,
  GetAccessKeyResponseCode,
  OAuthRes,
} from '../../types/auth';
import { getRequestUrl } from '../../utils/getRequestUrl';
import { deleteData, getData, storeData } from '../../utils/storage';
import { RandomString } from '../../utils/string';
import { resetImportStatus } from '../assets/assets.slice';
import {
  clearLoader,
  loaderSlice,
  setFullPageLoader,
} from '../loader/loader.slice';
import { resetSearchState } from '../search/search.slice';
import {
  getAccessKeyService,
  getAccessTokenService,
  requestAuthorizeService,
} from './auth.service';

export const AUTH_FEATURE_KEY = 'auth';
export const AUTH_FEATURE_ACCESS_KEY_KEY = `${AUTH_FEATURE_KEY}_access_key_key`;
export const AUTH_FEATURE_SITE_URL_KEY = `${AUTH_FEATURE_KEY}_site_url_key`;

export type AuthState = {
  authenticated: boolean;
  siteUrl: string;
  userConfigSiteUrl?: string;
  accessToken?: string;
  accessKey?: string;
  oAuthUrl?: string;
  error?: string;
};

// ======================================================================
// Action
// ======================================================================
export const oAuth = createAsyncThunk<OAuthRes, { siteUrl: string }>(
  `${AUTH_FEATURE_KEY}/oauth`,
  async ({ siteUrl }, { rejectWithValue, dispatch }) => {
    dispatch(
      loaderSlice.actions.setFullPageLoader({
        isLoading: true,
        message: 'Please allow access for this addon in the new popup.',
      }),
    );
    const execute = async () => {
      const nonce = RandomString(12);
      const resp = await requestAuthorizeService(siteUrl, nonce);
      const requestID = resp.requestID;
      const popupUrl = getRequestUrl(siteUrl, `AppAuth?RID=${nonce}`);
      dispatch(
        loaderSlice.actions.setFullPageLoader({
          isLoading: true,
          message: `Please allow access for this addon in the new popup or open this Url in new tab.${MESSAGE_NEW_LINE}${popupUrl}`,
        }),
      );
      window.open(popupUrl, '_blank');
      const getAccessKeyData = await getAccessKeyService(siteUrl, requestID);
      if (getAccessKeyData.accessKey) {
        const tokenResp = await getAccessTokenService(
          siteUrl,
          getAccessKeyData.accessKey,
        );
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
    } finally {
      dispatch(clearLoader());
    }
  },
);

export const initAuthInfoFromCache = createAsyncThunk(
  `${AUTH_FEATURE_KEY}/initAuthInfoFromCache`,
  async (_, { dispatch, rejectWithValue, getState }) => {
    dispatch(
      setFullPageLoader({
        isLoading: true,
        message: 'Trying to restore your previous session',
      }),
    );

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
          await getAccessTokenService(
            siteUrl,
            accessKey,
          )
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
      dispatch(clearLoader());
    }
  },
);

// ======================================================================
// Slice
// ======================================================================
const initialState: AuthState = {
  authenticated: false,
  siteUrl: '',
};

export const authSlice = createSlice({
  name: AUTH_FEATURE_KEY,
  initialState,
  reducers: {
    setAccessToken: (state, action: PayloadAction<string | undefined>) => {
      state.accessToken = action.payload;
    },
    updateAuthTokens: (state, action: PayloadAction<Partial<AuthState>>) => {
      state.authenticated = true;
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
    logout: (state) => {
      state.authenticated = false;
      state.error = '';
      state.accessKey = undefined;
      state.accessToken = undefined;
      state.oAuthUrl = undefined;
      state.siteUrl = state.userConfigSiteUrl ?? '';
      deleteData(AUTH_FEATURE_ACCESS_KEY_KEY);
      deleteData(AUTH_FEATURE_SITE_URL_KEY);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(
        oAuth.fulfilled,
        (state, { payload: { accessKey, accessToken, siteUrl } }) => {
          state.accessKey = accessKey;
          state.accessToken = accessToken;
          state.authenticated = true;
          state.siteUrl = siteUrl;
          storeData(AUTH_FEATURE_ACCESS_KEY_KEY, accessKey ?? '');
          storeData(AUTH_FEATURE_SITE_URL_KEY, siteUrl);
        },
      )
      .addCase(oAuth.rejected, (state, action) => {
        state.error = action.payload as string;
        deleteData(AUTH_FEATURE_ACCESS_KEY_KEY);
      })
      .addCase(oAuth.pending, (state) => {
        state.error = '';
      });
  },
});

export default authSlice.reducer;
export const { logout, setAccessToken, setSiteUrl, setUserConfigSiteUrl } = authSlice.actions;

// ======================================================================
// Selector
// ======================================================================
export const authenticatedSelector = (rootState: RootState) =>
  rootState[AUTH_FEATURE_KEY].authenticated;

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
