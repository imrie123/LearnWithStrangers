import { createSlice } from '@reduxjs/toolkit';


const initialState = {
    token: null,
};
export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
   setToken: (state, action) => {
      state.token = action.payload;
    },
    clearToken: (state) => {
      state.token = null;
    },
  },
});

export default  authSlice.reducer;
export const { setToken, clearToken } = authSlice.actions;