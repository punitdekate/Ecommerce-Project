import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  doc,
  updateDoc,
  arrayUnion,
  collection,
  getDoc,
  getDocs,
  arrayRemove,
} from "firebase/firestore";
import { db } from "../../init";

// Initial state for the cart
const INITIAL_STATE = { cart: [], error: null, isLoading: false };

export const getInitialCart = createAsyncThunk(
  "cart/getInitialCart",
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
        return userDocSnapshot.data().cart;
      } else {
        return thunkApi.rejectWithValue("User not found");
      }
    } catch (error) {
      return thunkApi.rejectWithValue(error.message);
    }
  }
);

export const addToCartThunk = createAsyncThunk(
  "cart/addToCart",
  async (productData, thunkApi) => {
    try {
      const state = thunkApi.getState();
      const { user } = state.userLoginReducer;

      if (!user) {
        return thunkApi.rejectWithValue("User not logged in");
      }

      const cart = state.cartReducer.cart;
      const productIsPresentInCart = cart.find(
        (item) => item.id === productData.id
      );

      if (productIsPresentInCart) {
        return thunkApi.rejectWithValue("Product is already in cart");
      }

      const userDocRef = doc(db, "Users", user.id);
      const cartItem = { ...productData, count: 1 };

      // Add product to Firestore cart
      await updateDoc(userDocRef, {
        cart: arrayUnion(cartItem),
      });

      return cartItem;
    } catch (error) {
      return thunkApi.rejectWithValue("Error in adding product to cart");
    }
  }
);

export const removeFromCartThunk = createAsyncThunk(
  "cart/removeFromCart",
  async (productId, thunkApi) => {
    try {
      const state = thunkApi.getState();
      const { user } = state.userLoginReducer;

      if (!user) {
        return thunkApi.rejectWithValue("User not logged in");
      }

      const cart = state.cartReducer.cart;
      const productIsPresentInCart = cart.find((item) => item.id === productId);

      if (!productIsPresentInCart) {
        return thunkApi.rejectWithValue(
          "Product you are trying to remove from cart is not in the cart"
        );
      }

      const userDocRef = doc(db, "Users", user.id);

      // Update Firestore to remove the item
      await updateDoc(userDocRef, {
        cart: arrayRemove(productIsPresentInCart),
      });

      // Return the updated cart
      const updatedCart = cart.filter((item) => item.id !== productId);
      return updatedCart;
    } catch (error) {
      return thunkApi.rejectWithValue(error.message);
    }
  }
);

export const opCartThunk = createAsyncThunk(
  "cart/opCart",
  async (data, thunkApi) => {
    try {
      const state = thunkApi.getState();
      const { user } = state.userLoginReducer;
      const snapshot = await getDocs(collection(db, "Users"));
      const userExistsRef = snapshot.docs.find((doc) => doc.id === user.id);
      if (userExistsRef) {
        const updatedCart = userExistsRef.data().cart.map((ele) => {
          if (ele.id === data.productId) {
            if (data.op === "add") {
              ele.count += 1;
            } else if (data.op === "sub" && ele.count > 1) {
              ele.count -= 1;
            }
          }
          return ele;
        });
        const userDocRef = doc(db, "Users", userExistsRef.id);
        await updateDoc(userDocRef, { cart: [...updatedCart] });
        return updatedCart;
      }
    } catch (error) {
      return thunkApi.rejectWithValue(error.message);
    }
  }
);

// Cart slice
export const cartSlice = createSlice({
  name: "cart",
  initialState: INITIAL_STATE,
  reducers: {
    start: (state) => {
      state.isLoading = true;
    },
    addToCart: (state, action) => {
      state.cart.push(action.payload);
    },
    removeFromCart: (state, action) => {
      state.cart = state.cart.filter((ele) => ele.id !== action.payload);
    },
    inc: (state, action) => {
      state.cart = state.cart.map((ele) => {
        if (ele.id === action.payload) {
          ele.count += 1;
        }
        return ele;
      });
    },
    dec: (state, action) => {
      state.cart = state.cart.map((ele) => {
        if (ele.id === action.payload && ele.count > 1) {
          ele.count -= 1;
        }
        return ele;
      });
    },
    reset: (state, action) => {
      state.cart = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Add to Cart Thunk
      .addCase(addToCartThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addToCartThunk.fulfilled, (state, action) => {
        state.cart.push(action.payload);
        state.isLoading = false;
        state.error = null;
      })
      .addCase(addToCartThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Get Initial Cart Thunk
      .addCase(getInitialCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getInitialCart.fulfilled, (state, action) => {
        state.cart = [...action.payload];
        state.isLoading = false;
        state.error = null;
      })
      .addCase(getInitialCart.rejected, (state, action) => {
        state.error = action.payload;
        state.isLoading = false;
      })
      // Remove from Cart Thunk
      .addCase(removeFromCartThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(removeFromCartThunk.fulfilled, (state, action) => {
        state.cart = [...action.payload];
        state.isLoading = false;
        state.error = null;
      })
      .addCase(removeFromCartThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      //inc and dec cart item
      .addCase(opCartThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(opCartThunk.fulfilled, (state, action) => {
        state.cart = [...action.payload];
        state.isLoading = false;
        state.error = null;
      })
      .addCase(opCartThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

// Reducer export
export const cartReducer = cartSlice.reducer;

// Action creators export
export const { addToCart, removeFromCart, inc, dec, reset } = cartSlice.actions;

// Selector export
export const cartSelector = (state) => state.cartReducer;
