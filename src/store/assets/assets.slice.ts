import type { PayloadAction } from '@reduxjs/toolkit';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '..';
import { AssetsState } from '../../types/assets';
import { AssetImage, GetAssetLinkResponse } from '../../types/search';
import { getExtraFields } from '../search/search.slice';
import { getAssetLinks } from './assets.service';

export const ASSETS_FEATURE_KEY                      = 'assets';
export const ASSETS_FEATURE_STORAGE_KEY              = ASSETS_FEATURE_KEY + '_storage';
export const ASSETS_FEATURE_STORAGE_KEY_IMPORT_PROXY = ASSETS_FEATURE_STORAGE_KEY + '_importProxy';

const initialState: AssetsState = {
  selectedAssets: [],
  onlyIIIFPrefix: false,
  isProxyModalOpen: false,
  isImporting: false,
};

// ======================================================================
// Selector
// ======================================================================
export const onlyIIIFPrefixSelector = (state: RootState) =>
  state[ASSETS_FEATURE_KEY].onlyIIIFPrefix;

export const importProxySelector = (state: RootState) =>
  state[ASSETS_FEATURE_KEY].importProxy;

export const selectedAssetsSelector = (state: RootState) =>
  state[ASSETS_FEATURE_KEY].selectedAssets;

export const isProxyModalOpenSelector = (state: RootState) =>
  state[ASSETS_FEATURE_KEY].isProxyModalOpen;

export const isImportingSelector = (state: RootState) =>
  state[ASSETS_FEATURE_KEY].isImporting;

// ======================================================================
// Slice
// ======================================================================
export const assetsState = createSlice({
  name: ASSETS_FEATURE_KEY,
  initialState,
  reducers: {
    setSelectedAssets: (state, action: PayloadAction<AssetImage[]>) => {
      state.selectedAssets = action.payload;
    },
    enableOnlyIIIFPrefix: (state) => {
      state.onlyIIIFPrefix = true;
    },
    setImportProxy: (state, action: PayloadAction<string>) => {
      state.importProxy = action.payload;
    },
    setIsProxyModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isProxyModalOpen = action.payload;
    },
    setIsImporting: (state, action: PayloadAction<boolean>) => {
      state.isImporting = action.payload;
    },
  },
});

export const { enableOnlyIIIFPrefix, setImportProxy, setSelectedAssets, setIsProxyModalOpen, setIsImporting } = assetsState.actions;

// ======================================================================
// Action
// ======================================================================
export const importAssets = createAsyncThunk<void, { importProxy?: string, rememberProxy: boolean }>(
  `${ASSETS_FEATURE_KEY}/oAuth`,
  async ({ importProxy, rememberProxy }, { dispatch, getState }) => {
    dispatch(setIsImporting(true));

    if (rememberProxy && importProxy) {
      localStorage.setItem(ASSETS_FEATURE_STORAGE_KEY_IMPORT_PROXY, importProxy);
      dispatch(setImportProxy(importProxy));
    }
    const rootState      = getState() as RootState;
    const selectedAssets = selectedAssetsSelector(rootState);
    const onlyIIIFPrefix = onlyIIIFPrefixSelector(rootState);
    const extraFields    = getExtraFields(rootState)?.join('&ExtraFields=');
    if (!importProxy) {
      importProxy    = importProxySelector(rootState);
    }
    const images = await getAssetLinks(selectedAssets, extraFields, onlyIIIFPrefix, importProxy);

    dispatch(setIsProxyModalOpen(false));
    window.CortexAssetPicker._onImageSelected?.(images as GetAssetLinkResponse[]);

    dispatch(setIsImporting(false));
  },
);

export default assetsState.reducer;
