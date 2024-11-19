import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface NewArrivalsState {
  [key: string]: any; // This allows dynamic keys
  MensNewArrivals: any[];
  WomensNewArrivals: any[];
  KidsNewArrivals: any[];
}

const initialState: NewArrivalsState = {
  MensNewArrivals: [],
  WomensNewArrivals: [],
  KidsNewArrivals: []
};

const slice = createSlice({
  name: "main",
  initialState,
  reducers: {
    UpdateNewArrivals(state, action: PayloadAction<{ category: string, items: any[] }>) {
      const { category, items } = action.payload;
        state[category] = items; // Dynamically update the correct category
    }
  }
});

export const { UpdateNewArrivals } = slice.actions;
export default slice.reducer;
