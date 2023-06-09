import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    loggedIn: false,
    user: {},
    token: null,
    loading: false,
    error: null,
  },
  reducers: {
    loginStart(state) {
      state.loading = true;
      state.error = null;
    },
    loginSuccess(state, {payload}) {
      state.loggedIn = true;
      state.user = payload;
      state.token = payload.token;
      state.loading = false;
      state.error = null;
    },
    loginFailure(state, {payload}) {
      state.loading = false;
      state.error = payload;
    },
    updateUser(state,{payload}){
      state.user =payload
    },
    logout(state) {
      state.loggedIn = false;
      state.user = {};
      state.token = null;
      state.loading = false;
      state.error = null;
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout,updateUser } = authSlice.actions;

export default authSlice.reducer;

