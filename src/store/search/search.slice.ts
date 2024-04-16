import type { PayloadAction } from '@reduxjs/toolkit';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '..';
import { Folder, MediaType } from '../../types/search';
import { searchApi } from './search.api';
import { assetsSlice } from '../assets/assets.slice';

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
  mediaTypes: MediaType[];
};

// ======================================================================
// Slice
// ======================================================================
const initialState: SearchState = {
  currentFolder: RootFolder, // root folder
  imageSearchText: '',
  mediaTypes: [],
};

export const explorePath = createAsyncThunk(
  'auth/explorePath',
  async (folder: Folder, thunkAPI) => {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    const currentFolder = getCurrentFolder(thunkAPI.getState() as RootState);
    if (folder.path === currentFolder.path) {
      return;
    }
    thunkAPI.dispatch(
      searchApi.util.invalidateTags([
        { type: 'ImagesInFolders', id: folder.id },
      ]),
    );
    thunkAPI.dispatch(assetsSlice.actions.setSelectedAssets([]));
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
    setMediaTypes: (state, action: PayloadAction<MediaType[]>) => {
      state.mediaTypes = action.payload;
    },
    resetCurrentFolder: (state) => {
      state.currentFolder = initialState.currentFolder;
    },
    resetSearchText: (state) => {
      state.imageSearchText = initialState.imageSearchText;
    },
    resetMediaTypes: (state) => {
      state.mediaTypes = initialState.mediaTypes;
    },
    resetSearchState: (state) => {
      state.currentFolder = initialState.currentFolder;
      state.imageSearchText = initialState.imageSearchText;
      state.mediaTypes = initialState.mediaTypes;
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
export const getMediaTypes = (state: RootState) =>
  state[SEARCH_FEATURE_KEY].mediaTypes;

export const {
  internalExplorePath,
  setImageSearchText,
  resetSearchState,
  setExtraFields,
  setMediaTypes,
  resetCurrentFolder,
  resetSearchText,
  resetMediaTypes,
} = searchSlice.actions;
export default searchSlice.reducer;
