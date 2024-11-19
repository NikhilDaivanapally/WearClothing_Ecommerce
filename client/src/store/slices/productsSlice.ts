import { createSlice } from "@reduxjs/toolkit";

interface productInterface {
  totalProductsCount: number;
  currentBuyProduct: any;
  priceRange:any
}

const initialState: productInterface = {
  totalProductsCount: 0,
  // productsData: [],
  // brands: [],
  priceRange: null,
  currentBuyProduct: null,
};

const slice = createSlice({
  name: "currentPageProducts",
  initialState,
  reducers: {
    UpdateTotalProductsCount(state, action) {
      state.totalProductsCount = action.payload;
    },
    // UpdateProductsData(state, action) {
    //   state.productsData = action.payload;
    // },
    // UpdateBrands(state, action) {
    //   state.brands = action.payload;
    // },
    UpdatePriceRange(state, action) {
      state.priceRange = action.payload;
    },
    UpdateCurrentBuyProduct(state, action) {
      state.currentBuyProduct = action.payload;
    },
  },
});
export const {
  // UpdateBrands,
  UpdatePriceRange,
  // UpdateProductsData,
  UpdateTotalProductsCount,
  UpdateCurrentBuyProduct,
} = slice.actions;
export default slice.reducer;
