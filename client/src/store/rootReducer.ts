import { combineReducers } from "redux";

//apiSlice
import { apiSlice } from "./slices/apiSlice";

//Slices
import authReducer from "./slices/authSlice";
import adminReducer from "./slices/adminSlice";
import categoryReducer from "./slices/categorySlice";
import cartReducer from "./slices/cartItemSlice";
import wishlistReducer from "./slices/wishlistSlice";
import currentPageProdcutsReducer from "./slices/productsSlice";
import mainReducer from "./slices/mainSlice";
import searchPageProductsReducer from "./slices/searchProductsSlice";
const rootReducer = combineReducers({
  [apiSlice.reducerPath]: apiSlice.reducer,
  auth: authReducer,
  categories: categoryReducer,
  admin: adminReducer,
  cartItems: cartReducer,
  wishlistItems: wishlistReducer,
  main: mainReducer,
  currentPageProducts: currentPageProdcutsReducer,
  searchPageProducts: searchPageProductsReducer,
});

export { rootReducer };
