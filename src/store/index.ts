import { configureStore } from '@reduxjs/toolkit';
import type { TypedUseSelectorHook } from 'react-redux';
import { useDispatch, useSelector } from 'react-redux';
import assetsReducer, { ASSETS_FEATURE_KEY } from './assets/assets.slice';
import authReducer, { AUTH_FEATURE_KEY } from './auth/auth.slice';
import loaderReducer, { LOADER_FEATURE_KEY } from './loader/loader.slice';
import { searchApi } from './search/search.api';
import searchReducer, { SEARCH_FEATURE_KEY } from './search/search.slice';
import { userApi } from './user/user.api';

export const store = configureStore({
  reducer: {
    [AUTH_FEATURE_KEY]: authReducer,
    [SEARCH_FEATURE_KEY]: searchReducer,
    [ASSETS_FEATURE_KEY]: assetsReducer,
    [LOADER_FEATURE_KEY]: loaderReducer,
    [searchApi.reducerPath]: searchApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([searchApi.middleware, userApi.middleware]),
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
