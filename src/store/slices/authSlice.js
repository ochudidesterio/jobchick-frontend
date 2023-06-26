import {createSlice} from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    loggedIn: false,
    user: {},
    token: null,
    loading: false,
    error: null,
    likeJob: [],
    language:""
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
    updateUser(state, {payload}) {
      state.user = payload;
    },
    logout(state) {
      state.loggedIn = false;
      state.user = {};
      state.token = null;
      state.loading = false;
      state.error = null;
    },
    setLikeJob(state, {payload}) {
      state.likeJob = payload;
    },
    likeJob(state, {payload}) {
      const index = state.likeJob.findIndex(job => job.id === payload.id);
      if (index === -1) {
        // Add the job to likeJob array if it doesn't exist
        state.likeJob.push(payload);
      } else {
        // Replace the job if it already exists
        state.likeJob[index] = payload;
      }
    },
    unlikeJob(state, {payload}) {
      state.likeJob = state.likeJob.filter(job => job.id !== payload.id);
    },
    setLanguage(state,{payload}){
      state.language = payload
    }
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  updateUser,
  likeJob,
  unlikeJob,
  setLikeJob,
  setLanguage
} = authSlice.actions;

export default authSlice.reducer;
