import { createSlice } from "@reduxjs/toolkit";

interface cartItemsInterface {
  cartItems: any | null;
}

const initialState: cartItemsInterface = {
  cartItems: null,
};

const slice = createSlice({
  name: "cartItems",
  initialState,
  reducers: {
    UpdateCartItems(state, action) {
      state.cartItems = action.payload;
    },
  },
});

export const { UpdateCartItems } = slice.actions;
export default slice.reducer;
