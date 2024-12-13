import { configureStore } from '@reduxjs/toolkit';

import { loginSlice } from './slices/login';
import movieSlice from './slices/movie/movieSlice';

export const store = configureStore({
  reducer: {
    login: loginSlice.reducer,
    movie: movieSlice.reducer,  // Aquí se agrega el reducer de `movie`
  },
});
