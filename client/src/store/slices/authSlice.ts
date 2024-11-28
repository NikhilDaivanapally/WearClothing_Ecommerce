import { createSlice } from "@reduxjs/toolkit";

interface userInterface {
  id: string;
  username: string;
  profileimage: string;
  email: string;
  role: string;
}

const initialState: { user: userInterface | null } = {
  user: null,
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
