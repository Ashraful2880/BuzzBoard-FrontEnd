import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User, AuthState } from "@/types/authTypes";

const storedUser = localStorage.getItem("buzzboard_user");
const storedToken = localStorage.getItem("buzzboard_token");

const initialState: AuthState = {
  user: storedUser ? JSON.parse(storedUser) : null,
  token: storedToken || null,
  isAuthModalOpen: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; token: string }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem("buzzboard_user", JSON.stringify(action.payload.user));
      localStorage.setItem("buzzboard_token", action.payload.token);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("buzzboard_user");
      localStorage.removeItem("buzzboard_token");
    },
    setAuthModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isAuthModalOpen = action.payload;
    },
  },
});

export const { setCredentials, logout, setAuthModalOpen } = authSlice.actions;
export default authSlice.reducer;
