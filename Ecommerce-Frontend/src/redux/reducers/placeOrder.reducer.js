import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { getDocs, collection, doc, updateDoc } from "firebase/firestore";
import { db } from "../../init";
const INITIAL_STATE = { success: false, placeOrderError: null, orderId: null };

export const placeOrderThunk = createAsyncThunk(
  "placeOrder/placed",
  async (_, thunkApi) => {
    try {
      const state = thunkApi.getState();
      const { cart } = state.cartReducer;
      const { user } = state.userLoginReducer;
      const order = {
        id: Date.now(),
        order: [...cart],
        total: cart
          .reduce((acc, curVal) => {
            return acc + parseFloat(curVal.price * curVal.count);
          }, 0)
          .toFixed(2),
        date: new Date().toString(),
      };
      const snapshot = await getDocs(collection(db, "Users"));
      const userExistsRef = snapshot.docs.find((doc) => doc.id === user.id);
      if (userExistsRef) {
        const userDocRef = doc(db, "Users", userExistsRef.id);
        await updateDoc(userDocRef, {
          order: user.order ? [order, ...userExistsRef.data().order] : [order],
          cart: [],
        });
        return { orderId: order.id, success: true };
      } else {
        return thunkApi.rejectWithValue("User not exist in db");
      }
    } catch (error) {
      return thunkApi.rejectWithValue(error.message);
    }
  }
);
const placeOrderSlice = createSlice({
  name: "placeOrder",
  initialState: INITIAL_STATE,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(placeOrderThunk.pending, (state, action) => {
        state.success = false;
      })
      .addCase(placeOrderThunk.fulfilled, (state, action) => {
        state.success = action.payload.success;
        state.orderId = action.payload.orderId;
      })
      .addCase(placeOrderThunk.rejected, (state, action) => {
        state.placeOrderError = action.payload;
      });
  },
});

export const placeOrderReducer = placeOrderSlice.reducer;
export const placeOrderSelector = (state) => state.placeOrderReducer;
