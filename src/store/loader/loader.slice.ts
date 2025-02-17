import type { PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@/store';
import { createSlice } from '@reduxjs/toolkit';

export const LOADER_FEATURE_KEY = 'LOADER_FEATURE_KEY';

export type LoaderStyle = 'Fullpage' | 'Partial';
export type LoaderState = {
  isLoading: boolean;
  message?: string;
  style?: LoaderStyle;
};

// #region Slice
const initialState: LoaderState = {
  isLoading: false,
};

export const loaderSlice = createSlice({
  name: LOADER_FEATURE_KEY,
  initialState,
  reducers: {
    setFullPageLoader: (
      state,
      {
        payload,
      }: PayloadAction<Pick<LoaderState, 'isLoading' | 'message'> | boolean>,
    ) => {
      if (typeof payload === 'boolean') {
        state.isLoading = payload;
      } else {
        state.isLoading = payload.isLoading ?? state.isLoading;
        state.message = payload.message ?? state.message;
      }
      state.style = 'Fullpage';
    },
    clearLoader: (state) => {
      state.isLoading = false;
      state.message = undefined;
      state.style = undefined;
    },
  },
});

export const { setFullPageLoader, clearLoader } = loaderSlice.actions;
export default loaderSlice.reducer;
// #endregion

// #region Selector
export const isLoadingSelector = (rootState: RootState) =>
  rootState[LOADER_FEATURE_KEY].isLoading;

export const isLoaderMessageSelector = (rootState: RootState) =>
  rootState[LOADER_FEATURE_KEY].message;

export const isLoaderStyleSelector = (rootState: RootState) =>
  rootState[LOADER_FEATURE_KEY].style;
// #endregion