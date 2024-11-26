import { createSlice } from "@reduxjs/toolkit";

const INITIAL_STATE = { message: null, type: null };

export const popupSlice = createSlice({
  name: "popup",
  initialState: INITIAL_STATE,
  reducers: {
    success: (state, action) => {
      message = action.payload;
    },
    error: (state, action) => {
      message = action.payload;
    },
  },
});
