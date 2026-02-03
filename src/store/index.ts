import { configureStore } from '@reduxjs/toolkit';
import type { TypedUseSelectorHook } from 'react-redux';
import { useDispatch, useSelector } from 'react-redux';
import authReducer, { AUTH_FEATURE_KEY } from './auth/auth.slice';
import assetsReducer, { ASSETS_FEATURE_KEY } from './assets/assets.slice';
import { searchApi } from './search/search.api';
import { assetsApi } from './assets/assets.api';
import { userApi } from './user/user.api';

export const store = configureStore({
  reducer: {
    [AUTH_FEATURE_KEY]: authReducer,
    [ASSETS_FEATURE_KEY]: assetsReducer,
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
