import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '..';
import { NavigationState } from '../../types/navigation';

export const NAVIGATION_FEATURE_KEY = 'navigation';

// ======================================================================
// Slice
// ======================================================================
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

// ======================================================================
// Selector
// ======================================================================
export const selectCurrentPage = (state: RootState) =>
  state[NAVIGATION_FEATURE_KEY].currentPage;


export const { openSettings, openHome } = navigationState.actions;

export default navigationState.reducer;
