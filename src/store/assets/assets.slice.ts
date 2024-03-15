import type { PayloadAction } from '@reduxjs/toolkit';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '..';
import { AssetsState } from '../../types/assets';
import { AssetImage, GetAssetLinkResponse } from '../../types/search';
import { getData, storeData } from '../../utils/storage';
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

export const importAssetErrorMessageSelector = (state: RootState) =>
  state[ASSETS_FEATURE_KEY].errorMessage;

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
    resetImportStatus: (state) => {
      state.selectedAssets = initialState.selectedAssets;
      state.onlyIIIFPrefix = initialState.onlyIIIFPrefix;
      state.isProxyModalOpen = initialState.isProxyModalOpen;
      state.isImporting = initialState.isImporting;
    },
  },
  extraReducers(builder) {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    builder.addCase(importAssets.pending, (state) => {
      state.isImporting = true;
      state.errorMessage = undefined;
    });
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    builder.addCase(importAssets.rejected, (state, action) => {
      state.isImporting = false;
      console.error(action, action.error.message);
      state.errorMessage = action.error.message;
    });
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    builder.addCase(importAssets.fulfilled, (state) => {
      state.isImporting = false;
      state.errorMessage = undefined;
    });
  },
});

export const { enableOnlyIIIFPrefix, setImportProxy, setSelectedAssets, setIsProxyModalOpen, setIsImporting, resetImportStatus } = assetsState.actions;

// ======================================================================
// Action
// ======================================================================
export const importAssets = createAsyncThunk<void, { importProxy?: string, rememberProxy: boolean }>(
  `${ASSETS_FEATURE_KEY}/oAuth`,
  async ({ importProxy, rememberProxy }, { dispatch, getState }) => {
    dispatch(setIsImporting(true));

    // If import proxy is not defined, try to get it from storage. If it's not there, show the select proxy modal
    if (!importProxy) {
      importProxy = await getData(ASSETS_FEATURE_STORAGE_KEY_IMPORT_PROXY) ?? undefined;
    }
    if (!importProxy) {
      dispatch(setIsProxyModalOpen(true));
      dispatch(setIsImporting(false));
      return;
    }

    if (rememberProxy && importProxy) {
      storeData(ASSETS_FEATURE_STORAGE_KEY_IMPORT_PROXY, importProxy, 'LocalStorage', 1000 * 60 * 60);
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

    window.CortexAssetPicker._onClose?.();
  },
);

export default assetsState.reducer;
