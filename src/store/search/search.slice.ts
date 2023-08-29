import type { PayloadAction } from '@reduxjs/toolkit';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '..';
import { Folder } from '../../types/search';
import { searchApi } from './search.api';

// ======================================================================
// Const
// ======================================================================
export const SEARCH_FEATURE_KEY = 'search';

export const RootFolder: Folder = Object.freeze({
  id: '',
  title: '',
  docType: 'Story',
  path: [],
  fullPath: '',
});

export type SearchState = {
  currentFolder: Folder;
  imageSearchText: string;
  extraFields?: string[];
};

// ======================================================================
// Slice
// ======================================================================
const initialState: SearchState = {
  currentFolder: RootFolder, // root folder
  imageSearchText: '',
};

export const explorePath = createAsyncThunk(
  'auth/explorePath',
  async (folder: Folder, thunkAPI) => {
    thunkAPI.dispatch(
      searchApi.util.invalidateTags([
        { type: 'ImagesInFolders', id: folder.id },
      ]),
    );
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    thunkAPI.dispatch(searchSlice.actions.internalExplorePath(folder));
  },
);

export const searchSlice = createSlice({
  name: SEARCH_FEATURE_KEY,
  initialState,
  reducers: {
    internalExplorePath: (state, action: PayloadAction<Folder>) => {
      state.currentFolder = action.payload;
    },
    setImageSearchText: (state, action: PayloadAction<string>) => {
      state.imageSearchText = action.payload;
    },
    reset: (state) => {
      state.currentFolder = initialState.currentFolder;
      state.imageSearchText = initialState.imageSearchText;
    },
    setExtraFields: (state, action: PayloadAction<string[]>) => {
      state.extraFields = action.payload;
    },
  },
});

// ======================================================================
// Selector
// ======================================================================
export const getCurrentFolder = (state: RootState) =>
  state[SEARCH_FEATURE_KEY].currentFolder;
export const getSearchText = (state: RootState) =>
  state[SEARCH_FEATURE_KEY].imageSearchText;
export const getExtraFields = (state: RootState) =>
  state[SEARCH_FEATURE_KEY].extraFields;

export const { internalExplorePath, setImageSearchText, reset, setExtraFields } =
  searchSlice.actions;
export default searchSlice.reducer;
