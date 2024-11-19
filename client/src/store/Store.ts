import { configureStore, Middleware } from "@reduxjs/toolkit";
import { apiSlice } from "./slices/apiSlice";
import { rootReducer } from "./rootReducer";

// Define the store with proper TypeScript configuration
const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
    }).concat(apiSlice.middleware as Middleware),
});

// Define RootState and AppDispatch types for TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
