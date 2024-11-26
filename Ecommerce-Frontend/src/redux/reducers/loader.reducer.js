import { createSlice } from "@reduxjs/toolkit";

const INITIAL_STATE = { isLoading: false };

const loaderSlice = createSlice({
  name: "loader",
  initialState: INITIAL_STATE,
  reducers: {
    start: (state, action) => {
      state.isLoading = true;
    },
    end: (state, action) => {
      state.isLoading = false;
    },
  },
});

export const loaderReducer = loaderSlice.reducer;
export const { start, end } = loaderSlice.actions;
export const loaderSelector = (state) => state.loaderReducer;
