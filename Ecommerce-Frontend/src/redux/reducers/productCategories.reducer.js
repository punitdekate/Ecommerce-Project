import { createSlice } from "@reduxjs/toolkit";

const INITIAL_STATE = {
  categories: [
    "Electronics",
    "Clothing",
    "Computers",
    "Smartphones",
    "Footwear",
  ],
};

const categoriesSlice = createSlice({
  name: "categories",
  initialState: INITIAL_STATE,
  reducers: {
    fetchCategories: (state, action) => {},
  },
});

export const categoriesReducer = categoriesSlice.reducer;
export const categoriesSelector = (state) => state.categoriesReducer;
