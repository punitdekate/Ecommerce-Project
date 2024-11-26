import { configureStore } from "@reduxjs/toolkit";
import { productListReducer } from "./redux/reducers/productList.reducer";
import { userLoginReducer } from "./redux/reducers/user.reducer";
import { categoriesReducer } from "./redux/reducers/productCategories.reducer";
import { loaderReducer } from "./redux/reducers/loader.reducer";
import { cartReducer } from "./redux/reducers/cart.reducer";
import { ordersReducer } from "./redux/reducers/orders.reducer";
import { placeOrderReducer } from "./redux/reducers/placeOrder.reducer";
export const store = configureStore({
  reducer: {
    productListReducer,
    userLoginReducer,
    categoriesReducer,
    loaderReducer,
    cartReducer,
    ordersReducer,
    placeOrderReducer,
  },
});
