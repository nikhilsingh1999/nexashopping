import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  id: string;
  uid: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  image_url: string | null;
  credit_limit: string;
  available_credit: string;
  overdue_amount: string;
  wallet_balance: string;
  referred_by: string;
  email_verified: boolean;
  credit_score: number;
  total_repayments: number;
  created_at: string;
  updated_at: string;
}

interface AuthState {
  user: User | null;
  idToken: string | null;
  refreshToken: string | null;
}

const initialState: AuthState = {
  user: null,
  idToken: null,
  refreshToken: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ user: User; idToken: string; refreshToken: string }>) => {
      state.user = action.payload.user;
      state.idToken = action.payload.idToken;
      state.refreshToken = action.payload.refreshToken;
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.idToken = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.idToken = null;
      state.refreshToken = null;
    },
  },
});

export const { login, setToken, logout } = authSlice.actions;
export default authSlice.reducer;
