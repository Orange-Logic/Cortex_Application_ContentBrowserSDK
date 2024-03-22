import { configureStore } from '@reduxjs/toolkit';
import type { TypedUseSelectorHook } from 'react-redux';
import { useDispatch, useSelector } from 'react-redux';
import authReducer, { AUTH_FEATURE_KEY } from './auth/auth.slice';
import assetsReducer, { ASSETS_FEATURE_KEY } from './assets/assets.slice';
import loaderReducer, { LOADER_FEATURE_KEY } from './loader/loader.slice';
import navigationReducer, { NAVIGATION_FEATURE_KEY } from './navigation/navigation.slice';
import searchReducer, { SEARCH_FEATURE_KEY } from './search/search.slice';
import { searchApi } from './search/search.api';
import { assetsApi } from './assets/assets.api';
import { userApi } from './user/user.api';

export const store = configureStore({
  reducer: {
    [AUTH_FEATURE_KEY]: authReducer,
    [SEARCH_FEATURE_KEY]: searchReducer,
    [ASSETS_FEATURE_KEY]: assetsReducer,
    [LOADER_FEATURE_KEY]: loaderReducer,
    [NAVIGATION_FEATURE_KEY]: navigationReducer,
    [searchApi.reducerPath]: searchApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [assetsApi.reducerPath]: assetsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([searchApi.middleware, userApi.middleware, assetsApi.middleware]),
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
