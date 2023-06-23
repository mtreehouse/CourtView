import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import spinnerReducer from './slices/spinnerSlice';

export const store = configureStore({
  reducer: {
    loading: spinnerReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
