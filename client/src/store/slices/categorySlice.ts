import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  Category: [],
};

const slice = createSlice({
  name: "Category",
  initialState,
  reducers: {
    UpdateCategoryState(state, action) {
      state.Category = action.payload;
    },
  },
});
export const getCategories = (state: any) => state.categories.Category;
export const { UpdateCategoryState } = slice.actions;

export default slice.reducer;
