import { createSlice } from "@reduxjs/toolkit";

interface wishlistInterface {
  wishlist: {
    id: string | null;
    products: any;
  };
}
const initialState: wishlistInterface = {
  wishlist: {
    id: null,
    products: [],
  },
};

const slice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    UpdateWishlist(state, action) {
      state.wishlist = action.payload;
    },
  },
});

export const { UpdateWishlist } = slice.actions;
export default slice.reducer;
