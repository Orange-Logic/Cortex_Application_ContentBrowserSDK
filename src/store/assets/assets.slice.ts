import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '..';
import { AssetsState, ImageImportStatus } from '../../types/assets';

export const ASSETS_FEATURE_KEY = 'assets';

// ======================================================================
// Slice
// ======================================================================
const initialState: AssetsState = {
  isImporting: false,
  downloadState: {},
  onlyIIIFPrefix: false,
};

export const assetsState = createSlice({
  name: ASSETS_FEATURE_KEY,
  initialState,
  reducers: {
    setDownloadStatus: (
      state,
      action: PayloadAction<{
        imageId: string;
        data: AssetsState['downloadState']['string'];
      }>,
    ) => {
      if (state.isImporting) {
        state.downloadState[action.payload.imageId] = action.payload.data;
      }
    },
    clearDownloadState: (state) => {
      state.downloadState = {};
    },
    stopAllImport: (state) => {
      state.downloadAbortController?.abort();
      state.isImporting = false;
      Object.keys(state.downloadState).forEach((key) => {
        state.downloadState[key] = {
          message: 'Import Aborted',
          name: state.downloadState[key].name,
          status: ImageImportStatus.Failed,
        };
      });
    },
    setAbortController: (state, action: PayloadAction<AbortController>) => {
      state.downloadAbortController = action.payload;
    },
    enableOnlyIIIFPrefix: (state) => {
      state.onlyIIIFPrefix = true;
    },
  },
});

// ======================================================================
// Selector
// ======================================================================
export const assetsIsImportingSelector = (state: RootState) =>
  state[ASSETS_FEATURE_KEY].isImporting;

export const downloadStateSelector = (state: RootState) =>
  state[ASSETS_FEATURE_KEY].downloadState;

export const { clearDownloadState, stopAllImport, enableOnlyIIIFPrefix } = assetsState.actions;
export default assetsState.reducer;
