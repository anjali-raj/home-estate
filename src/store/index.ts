import { configureStore } from '@reduxjs/toolkit';
import {
  useDispatch,
  useSelector,
  type TypedUseSelectorHook,
} from 'react-redux';
import favouritesReducer from './favourites-slice';
import savedSearchesReducer from './saved-searches-slice';

export const makeStore = () =>
  configureStore({
    reducer: {
      favourites: favouritesReducer,
      savedSearches: savedSearchesReducer,
    },
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];

// Typed hooks — use these instead of the plain react-redux ones.
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
