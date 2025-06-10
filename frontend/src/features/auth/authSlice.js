import { createSlice } from "@reduxjs/toolkit";
const user = JSON.parse(localStorage.getItem("user"));
const initialState = {
    user:user || null,
    token: localStorage.getItem("token") || null,
}

export const authSlice = createSlice({
    name: "auth",
    initialState,
reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem("user", JSON.stringify(action.payload.user));
      localStorage.setItem("token", action.payload.token);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.clear();
    },
    },
});


export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;