import { configureStore } from '@reduxjs/toolkit';
import { exampleSlice } from './slices/exampleSlice';

export const store = configureStore({
  reducer: {
    example: exampleSlice.reducer,
  },
});
