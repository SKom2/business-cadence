import { createSlice } from '@reduxjs/toolkit';
import { IAuthResponse } from "./auth.types.ts";

const initialState: IAuthResponse = {
  session: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setSession: (state, action) => {
      state.session = action.payload;
    },
  },
});

export const { setSession } = authSlice.actions;
export const authReducer = authSlice.reducer;
