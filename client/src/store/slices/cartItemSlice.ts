import { createSlice } from "@reduxjs/toolkit";

interface cartInterface {
  cart: {
    id: string | null;
    products: any;
  };
}

const initialState: cartInterface = {
  cart: {
    id: null,
    products: [],
  },
};

const slice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    UpdateCart(state, action) {
      state.cart = action.payload;
    },
  },
});

export const { UpdateCart } = slice.actions;
export default slice.reducer;
