import { createSlice } from "@reduxjs/toolkit";
import { getDocs, collection } from "firebase/firestore";
import { db } from "../../init";
import { createAsyncThunk } from "@reduxjs/toolkit";

const INITIAL_STATE = { products: [], isLoading: false, error: null };

// define and export productList async thunk below
export const getInitialState = createAsyncThunk(
  "productList/getInitialState",
  async (_, thunkApi) => {
    try {
      thunkApi.dispatch(fetchStart());
      const snapshot = await getDocs(collection(db, "Products"));
      const productList = snapshot.docs.map((item) => item.data());
      thunkApi.dispatch(fetchSuccess(productList));
    } catch (e) {
      thunkApi.dispatch(fetchError());
    }
  }
);

export const getSearchProductList = createAsyncThunk(
  "productLis/search",
  async (searchInput, thunkApi) => {
    try {
      if (searchInput) {
        // Fetch all products
        thunkApi.dispatch(fetchStart());
        const snapshot = await getDocs(collection(db, "Products"));

        // Filter products based on the search input
        const productList = snapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((item) =>
            item.title.toLowerCase().includes(searchInput.toLowerCase())
          );
        thunkApi.dispatch(fetchSuccess(productList));
      }
    } catch (error) {
      thunkApi.dispatch(fetchError("Error in fetching search products"));
    }
  }
);

export const getFilterProductList = createAsyncThunk(
  "productList/filter",
  async (filter = {}, thunkApi) => {
    try {
      // Fetch all products
      console.log(filter);
      const snapshot = await getDocs(collection(db, "Products"));

      // Get all products without filtering if the filter is empty
      let productList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Apply price filter if it exists
      if (filter.price) {
        productList = productList.filter(
          (item) => Number(item.price) <= Number(filter.price)
        );
      }

      // Apply category filter if it exists and is not empty
      if (filter.selectedCategory && filter.selectedCategory.length > 0) {
        productList = productList.filter((item) =>
          filter.selectedCategory.includes(item.category.toLowerCase())
        );
      }

      // Dispatch the success action with filtered productList
      thunkApi.dispatch(fetchSuccess(productList));
    } catch (error) {
      // Dispatch the error action with the error message
      thunkApi.dispatch(fetchError(error.message));
    }
  }
);

// refactor to use the createSlice method
const productListSlice = createSlice({
  name: "productList",
  initialState: INITIAL_STATE,
  reducers: {
    fetchStart: (state, action) => {
      state.isLoading = true;
    },
    fetchSuccess: (state, action) => {
      state.products = action.payload;
      state.isLoading = false;
    },
    fetchError: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

// export the productList reducer function and action creators here
export const productListReducer = productListSlice.reducer;
export const { fetchStart, fetchSuccess, fetchError } =
  productListSlice.actions;
export const productListSelector = (state) => state.productListReducer;
