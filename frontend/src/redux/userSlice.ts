import { createSlice } from '@reduxjs/toolkit';
import { initialUserState } from '../Types';
const initialState :initialUserState = {
  user: null,
};
export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.user = null;
    },
  },
});
console.log(userSlice);
export default  userSlice.reducer;
export const { login, logout } = userSlice.actions;

