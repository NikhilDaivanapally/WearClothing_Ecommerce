import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  totalSearchProductsCount: 0,
  SearchproductsData: [],
  SearchProductsBrands: [],
  SearchProductPriceRange: null,
};

const slice = createSlice({
  name: "SearchPageProducts",
  initialState,
  reducers: {
    UpdateTotalSearchProductsCount(state, action) {
      state.totalSearchProductsCount = action.payload;
    },
    UpdateSearchProductsData(state, action) {
      state.SearchproductsData = action.payload;
    },
    UpdateSearchProductsBrands(state, action) {
      state.SearchProductsBrands = action.payload;
    },
    UpdateSearchProductsPriceRange(state, action) {
      state.SearchProductPriceRange = action.payload;
    },
  },
});
export const {
  UpdateSearchProductsBrands,
  UpdateSearchProductsPriceRange,
  UpdateSearchProductsData,
  UpdateTotalSearchProductsCount,
} = slice.actions;
export default slice.reducer;
