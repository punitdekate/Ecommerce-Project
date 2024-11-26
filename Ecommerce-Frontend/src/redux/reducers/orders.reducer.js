import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../../init";
const INITIAL_STATE = { orders: [], isLoading: false, error: null };

export const getInitialOrders = createAsyncThunk(
  "orders/getInitialOrders",
  async (_, thunkApi) => {
    try {
      const state = thunkApi.getState();
      const { user } = state.userLoginReducer;

      if (!user) {
        return thunkApi.rejectWithValue("User not logged in");
      }

      const userDocRef = doc(db, "Users", user.id);

      // Fetch the document snapshot
      const userDocSnapshot = await getDoc(userDocRef);
      if (userDocSnapshot) {
        return userDocSnapshot.data().order;
      } else {
        return thunkApi.rejectWithValue("User not found");
      }
    } catch (error) {
      return thunkApi.rejectWithValue(error.message);
    }
  }
);
export const ordersSlice = createSlice({
  name: "orders",
  initialState: INITIAL_STATE,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getInitialOrders.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(getInitialOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = [...action.payload];
      })
      .addCase(getInitialOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const ordersReducer = ordersSlice.reducer;
export const ordersSelector = (state) => state.ordersReducer;
