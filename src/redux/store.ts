import { configureStore } from "@reduxjs/toolkit";
import brandReducer from "./reducer/brand.slice";
import colorReducer from "./reducer/color.slice";
import sizeReducer from "./reducer/size.slice";
import cartItemsReducer from "./reducer/cartItems.slide";
import categoryReducer from "./reducer/category.slice";
import heroSliderReducer from "./reducer/hero-slide.slice";
import billReducer from "./reducer/bill.slice";
import receiptReducer from "./reducer/receipt.slice";
import policyReducer from "./reducer/policy.slice";
import supplierReducer from "./reducer/supplier.slice";
import productModalReducer from "./reducer/products.slice";
import userReducer from "./reducer/user.slice";
import usersReducer from "./reducer/users.slice";
import bannersReducer from "./reducer/banners.slice";

export const store = configureStore({
  reducer: {
    productModal: productModalReducer,
    cartItems: cartItemsReducer,
    category: categoryReducer,
    brands: brandReducer,
    sizes: sizeReducer,
    colors: colorReducer,
    heroSlideData: heroSliderReducer,
    policy: policyReducer,
    user: userReducer,
    bill: billReducer,
    receipt: receiptReducer,
    supplier: supplierReducer,
    users: usersReducer,
    banners: bannersReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
