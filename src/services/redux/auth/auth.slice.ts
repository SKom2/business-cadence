import { createSlice } from '@reduxjs/toolkit';
import { IAuthResponse } from "./auth.types.ts";

const initialState: IAuthResponse = {
  user: null,
  token: '',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setToken: (state, action) => {
      state.token = action.payload
      console.log(state.token);
    }
  },
});

export const { setUser, setToken } = authSlice.actions;
export const authReducer = authSlice.reducer;
