import { AssetsState, TrackingParameter, Transformation } from '@/types/assets';
import { Asset, GetAssetLinkResponse } from '@/types/search';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { getAssetLinks } from './assets.service';

export const SETTINGS_DEFAULT_PROXY = 'Always show asset format selector';

export const ASSETS_FEATURE_KEY                      = 'assets';
export const ASSETS_FEATURE_STORAGE_KEY              = ASSETS_FEATURE_KEY + '_storage';
export const ASSETS_FEATURE_STORAGE_KEY_IMPORT_PROXY = ASSETS_FEATURE_STORAGE_KEY + '_importProxy';
export const ASSETS_FEATURE_STORAGE_TTL              = 1000 * 60 * 60;

const initialState: AssetsState = {
};

// #region Slice
export const assetsSlice = createSlice({
  name: ASSETS_FEATURE_KEY,
  initialState,
  reducers: {
    resetImportStatus: (state) => {
      state.errorMessage = undefined;
    },
  },
  extraReducers(builder) {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    builder.addCase(importAssets.pending, (state) => {
      state.errorMessage = undefined;
    });
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    builder.addCase(importAssets.rejected, (state, action) => {
      state.errorMessage = action.error.message;
    });
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    builder.addCase(importAssets.fulfilled, (state) => {
      state.errorMessage = undefined;
    });
  },
});
// #endregion

export const { resetImportStatus } = assetsSlice.actions;

// #region Action
export const importAssets = createAsyncThunk<
GetAssetLinkResponse[],
{
  extension?: string;
  extraFields?: string[];
  maxHeight?: number;
  maxWidth?: number;
  parameters?: TrackingParameter[];
  proxiesPreference?: Record<string, string>;
  selectedAsset: Asset;
  transformations?: Transformation[];
  useRepresentative?: boolean;
}
>(
  `${ASSETS_FEATURE_KEY}/importAssets`,
  async (
    {
      extension,
      extraFields,
      maxHeight,
      maxWidth,
      parameters,
      proxiesPreference,
      selectedAsset,
      transformations,
      useRepresentative,
    },
  ) => {

    const images = await getAssetLinks({
      assets: [selectedAsset],
      extraFields: extraFields?.join('&ExtraFields='),
      proxyPreference: proxiesPreference,
      transformations,
      parameters,
      maxWidth,
      maxHeight,
      extension,
    });

    if (useRepresentative) {
      return [{
        ...images[0],
        imageUrl: selectedAsset.imageUrl,
      }];
    }

    return images;
  },
);
// #endregion

export default assetsSlice.reducer;
