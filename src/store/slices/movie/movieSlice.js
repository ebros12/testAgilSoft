// store/slices/movie.js
import { createSlice } from '@reduxjs/toolkit';

const movieSlice = createSlice({
  name: 'movie',
  initialState: {
    selectedMovie: null,
  },
  reducers: {
    setSelectedMovie(state, action) {
      state.selectedMovie = action.payload;
    },
  },
});

export const { setSelectedMovie, selectedMovie } = movieSlice.actions;
export default movieSlice;
