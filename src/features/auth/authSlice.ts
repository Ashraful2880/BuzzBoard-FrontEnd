import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User, AuthState } from "@/types/authTypes";

const storedUser = localStorage.getItem("buzzboard_user");
const storedToken = localStorage.getItem("buzzboard_token");

function parseStoredUser(raw: string | null): User | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as User;
  } catch {
    localStorage.removeItem("buzzboard_user");
    localStorage.removeItem("buzzboard_token");
    return null;
  }
}

const initialState: AuthState = {
  user: parseStoredUser(storedUser),
  token: storedToken || null,
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
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
