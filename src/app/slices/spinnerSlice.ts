import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';

export interface SpinnerState {
  isLoading: false | true;
}

const initialState: SpinnerState = {
  isLoading: false,
};

export const spinnerSlice = createSlice({
  name: 'loading',
  initialState,
  reducers: {
    showLoading: (state, action) => {
      state.isLoading = action.payload;
    }
  },
});

export const { showLoading } = spinnerSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const isLoadingState = (state: RootState) => state.loading.isLoading;

export default spinnerSlice.reducer;
