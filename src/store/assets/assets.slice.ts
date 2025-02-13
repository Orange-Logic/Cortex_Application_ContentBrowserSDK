import type { PayloadAction } from '@reduxjs/toolkit';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '..';
import { AssetsState } from '../../types/assets';
import { StringTable } from '../../types/common';
import { AssetImage, GetAssetLinkResponse } from '../../types/search';
import { deleteData, GetDocTypeProxyKey, storeData } from '../../utils/storage';
import { IsStringFilled } from '../../utils/string';
import { getExtraFields } from '../search/search.slice';
import { getAssetLinks } from './assets.service';

export const SETTINGS_DEFAULT_PROXY = 'Always show asset format selector';

export const ASSETS_FEATURE_KEY                      = 'assets';
export const ASSETS_FEATURE_STORAGE_KEY              = ASSETS_FEATURE_KEY + '_storage';
export const ASSETS_FEATURE_STORAGE_KEY_IMPORT_PROXY = ASSETS_FEATURE_STORAGE_KEY + '_importProxy';
export const ASSETS_FEATURE_STORAGE_TTL              = 1000 * 60 * 60;

const initialState: AssetsState = {
  selectedAssets: [],
  onlyIIIFPrefix: false,
  isProxyModalOpen: false,
  isImporting: false,
  storedProxiesPreference: {},
};

// ======================================================================
// Selector
// ======================================================================
export const onlyIIIFPrefixSelector = (state: RootState) =>
  state[ASSETS_FEATURE_KEY].onlyIIIFPrefix;

export const storedProxiesPreferenceSelector = (state: RootState) =>
  state[ASSETS_FEATURE_KEY].storedProxiesPreference;

export const selectedAssetsSelector = (state: RootState) =>
  state[ASSETS_FEATURE_KEY].selectedAssets;

export const totalSelectedAssetSelector = (state: RootState) =>
  state[ASSETS_FEATURE_KEY].selectedAssets.length;

export const isProxyModalOpenSelector = (state: RootState) =>
  state[ASSETS_FEATURE_KEY].isProxyModalOpen;

export const isImportingSelector = (state: RootState) =>
  state[ASSETS_FEATURE_KEY].isImporting;

export const importAssetErrorMessageSelector = (state: RootState) =>
  state[ASSETS_FEATURE_KEY].errorMessage;

// ======================================================================
// Slice
// ======================================================================
export const assetsSlice = createSlice({
  name: ASSETS_FEATURE_KEY,
  initialState,
  reducers: {
    setSelectedAssets: (state, action: PayloadAction<AssetImage[]>) => {
      state.selectedAssets = action.payload;
    },
    enableOnlyIIIFPrefix: (state) => {
      state.onlyIIIFPrefix = true;
    },
    setStoredProxiesPreference: (state, action: PayloadAction<Partial<AssetsState['storedProxiesPreference']>>) => {
      state.storedProxiesPreference = { ...state.storedProxiesPreference, ...action.payload };
      Object.entries(state.storedProxiesPreference).forEach(([docType, value]) => {
        if (IsStringFilled(value)) {
          if (value === SETTINGS_DEFAULT_PROXY) {
            deleteData(GetDocTypeProxyKey(docType));
          } else {
            storeData(GetDocTypeProxyKey(docType), value as string, 'LocalStorage', ASSETS_FEATURE_STORAGE_TTL);
          }
        }
      });
    },
    setIsProxyModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isProxyModalOpen = action.payload;
    },
    resetImportStatus: (state) => {
      state.selectedAssets = initialState.selectedAssets;
      state.onlyIIIFPrefix = initialState.onlyIIIFPrefix;
      state.isProxyModalOpen = initialState.isProxyModalOpen;
      state.isImporting = initialState.isImporting;
      state.errorMessage = undefined;
    },
  },
  extraReducers(builder) {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    builder.addCase(importAssets.pending, (state) => {
      state.isImporting = true;
      state.isProxyModalOpen = false;
      state.errorMessage = undefined;
    });
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    builder.addCase(importAssets.rejected, (state, action) => {
      state.isImporting = false;
      state.errorMessage = action.error.message;
    });
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    builder.addCase(importAssets.fulfilled, (state) => {
      state.isImporting = false;
      state.errorMessage = undefined;
    });
  },
});

export const { enableOnlyIIIFPrefix, setStoredProxiesPreference, setSelectedAssets, setIsProxyModalOpen, resetImportStatus } = assetsSlice.actions;

// ======================================================================
// Action
// ======================================================================
export const importAssets = createAsyncThunk<void, Partial<StringTable> | undefined>(
  `${ASSETS_FEATURE_KEY}/oAuth`,
  async (proxiesPreference, { getState }) => {
    const rootState      = getState() as RootState;
    const selectedAssets = selectedAssetsSelector(rootState);
    const onlyIIIFPrefix = onlyIIIFPrefixSelector(rootState);
    const extraFields    = getExtraFields(rootState)?.join('&ExtraFields=');
    proxiesPreference    = proxiesPreference ?? storedProxiesPreferenceSelector(rootState);
    
    const images         = await getAssetLinks(selectedAssets, extraFields, onlyIIIFPrefix, proxiesPreference);

    // Trigger the callback function from the parent window
    window.CortexAssetPicker._onImageSelected?.(images as GetAssetLinkResponse[]);
    window.CortexAssetPicker._onClose?.();
  },
);

export default assetsSlice.reducer;
