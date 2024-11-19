import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  wishlistItems: [],
};

const slice = createSlice({
  name: "wishlistItems",
  initialState,
  reducers: {
    UpdatewishlitItems(state, action) {
      state.wishlistItems = action.payload;
    },
  },
});

export const { UpdatewishlitItems } = slice.actions;
export default slice.reducer;
