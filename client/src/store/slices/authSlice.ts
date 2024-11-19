import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: localStorage.getItem("authUser") ? JSON.parse(localStorage.getItem("authUser") as string) : null,
};

const slice = createSlice({
  name: "authState",
  initialState,
  reducers: {
    UpdateAuthState(state, action) {
      state.user = action.payload;
    },
  },
});
export const getAuthState = (state: any) => state.auth.user;
export const { UpdateAuthState } = slice.actions;

export default slice.reducer;
