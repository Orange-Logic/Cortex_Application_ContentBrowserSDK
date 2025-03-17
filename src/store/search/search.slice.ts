import { Folder } from '@/types/search';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { searchApi } from './search.api';

export const RootFolder: Folder = Object.freeze({
  id: '',
  title: '',
  docType: 'Story',
  path: [],
  fullPath: '',
});

// #region Thunk
export const explorePath = createAsyncThunk(
  'auth/explorePath',
  async (folder: Folder, { dispatch }) => {
    dispatch(
      searchApi.util.invalidateTags([
        { type: 'ImagesInFolders', id: folder.id },
      ]),
    );

    return true;
  },
);
// #endregion