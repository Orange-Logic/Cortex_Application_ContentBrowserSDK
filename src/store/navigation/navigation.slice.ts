import { RootState } from '@/store';
import { NavigationState } from '@/types/navigation';
import { createSlice } from '@reduxjs/toolkit';

export const NAVIGATION_FEATURE_KEY = 'navigation';

// #region Slice
const initialState: NavigationState = {
  currentPage: 'home',
};

export const navigationState = createSlice({
  name: NAVIGATION_FEATURE_KEY,
  initialState,
  reducers: {
    openSettings: (state) => {
      state.currentPage = 'settings';
    },
    openHome: (state) => {
      state.currentPage = 'home';
    },
  },
});

export default navigationState.reducer;
export const { openSettings, openHome } = navigationState.actions;
// #endregion

// #region Selector
export const selectCurrentPage = (state: RootState) =>
  state[NAVIGATION_FEATURE_KEY].currentPage;
// #endregion

