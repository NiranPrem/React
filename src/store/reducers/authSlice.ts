/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface User {
  name: string;
  role: Array<string>;
  userId: number;
  profileImage?: string;
}

interface Activate {
  success: boolean;
  message: string;
  token: string;
  data: {
    email: string;
    name: string;
    status: string;
  };
}

interface Auth {
  token: string;
}

// Define the structure of the auth state
interface AuthState {
  isAuthenticated: boolean;
  isADAuthenticated: boolean;
  token: Auth | null;
  user: User | null;
  activate: Activate | null;
  loading: boolean;
  error: string | null;
}

// Define the structure of login credentials
interface LoginCredentials {
  username: string;
  password: string;
}

// Define the structure of login credentials
interface AdLoginCredentials {
  azureAccessToken: string;
  userToken?: string;
}

// Initial state for the auth slice
const initialState: AuthState = {
  isAuthenticated: !!localStorage.getItem("token") || false,
  isADAuthenticated: false,
  token: null,
  user: null,
  loading: false,
  error: null,
  activate: null,
};

// Create a slice for authentication
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    loginRequest: (state, _action: PayloadAction<LoginCredentials>) => {
      state.loading = true;
      state.error = null;
      state.isAuthenticated = false;
      state.user = null;
    },
    loginSuccess: (state, action: PayloadAction<Auth>) => {
      state.token = action.payload;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isAuthenticated = true;
      state.loading = false;
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    adLoginRequest: (state, _action: PayloadAction<AdLoginCredentials>) => {
      state.loading = true;
      state.error = null;
      state.isAuthenticated = false;
      state.isADAuthenticated = false;
      state.user = null;
    },
    adLoginSuccess: (state, action: PayloadAction<Auth>) => {
      state.token = action.payload;
      state.isAuthenticated = true;
      state.isADAuthenticated = true;
      state.loading = false;
      state.error = null;
    },
    adLoginFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isAuthenticated = false;
      state.isADAuthenticated = false;
      state.token = null;
      state.loading = false;
    },
    fetchUserRequest: (state) => {
      state.loading = true;
      state.error = null;
      state.user = null;
    },
    fetchUserSuccess: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.loading = false;
      state.error = null;
    },
    fetchUserFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.user = null;
      state.loading = false;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.loading = false;
      state.error = null;
    },

    fetchUserActivationRequest: (
      state,
      action: PayloadAction<{ token: string }>
    ) => {
      state.loading = true;
      state.error = null;
      state.activate = null;
    },
    fetchUserActivationSuccess: (state, action: PayloadAction<Activate>) => {
      state.activate = action.payload;
      state.loading = false;
      state.error = null;
    },
    fetchUserActivationFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.activate = null;
      state.loading = false;
    },
    fetchUserAcceptRequest: (
      state,
      _action: PayloadAction<AdLoginCredentials>
    ) => {
      state.loading = true;
      state.error = null;
      state.isAuthenticated = false;
      state.isADAuthenticated = false;
      state.user = null;
    },
    fetchUserAcceptSuccess: (state, action: PayloadAction<Auth>) => {
      state.token = action.payload;
      state.isAuthenticated = true;
      state.isADAuthenticated = true;
      state.loading = false;
      state.error = null;
    },
    fetchUserAcceptFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isAuthenticated = false;
      state.isADAuthenticated = false;
      state.token = null;
      state.loading = false;
    },
  },
});

export const {
  loginRequest,
  loginSuccess,
  loginFailure,
  adLoginRequest,
  adLoginSuccess,
  adLoginFailure,
  fetchUserRequest,
  fetchUserSuccess,
  fetchUserFailure,
  fetchUserActivationRequest,
  fetchUserActivationSuccess,
  fetchUserActivationFailure,
  fetchUserAcceptRequest,
  fetchUserAcceptSuccess,
  fetchUserAcceptFailure,
  logout,
} = authSlice.actions;
export default authSlice.reducer;
