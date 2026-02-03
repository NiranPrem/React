/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { ReferralHistoryInterface } from "../../shared/interface/HistoryInterface";

// Define the structure of the Referrals opening state
interface ReferralState {
  loading: boolean;
  error: string | null;
  history: ReferralHistoryInterface[];
}

// Initial state for the Referrals opening slice
const initialState: ReferralState = {
  loading: false,
  error: null,
  history: [],
};

// Create a slice for Referrals with actions and reducers
const referralHistorySlice = createSlice({
  name: "referralHistory",
  initialState,
  reducers: {
    // Fetch history request
    fetchReferralHistoryRequest: (
      state,
      action: PayloadAction<{
        id: number;
      }>
    ) => {
      state.loading = true;
      state.error = null;
    },
    // Fetch history success
    fetchReferralHistorySuccess: (
      state,
      action: PayloadAction<[ReferralHistoryInterface]>
    ) => {
      const data = action.payload;
      state.history = data;
      state.loading = false;
      state.error = null;
    },
    // Fetch history failure
    fetchReferralHistoryFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
      state.history = [];
    },
  },
});

// Export actions for use in components and sagas
export const {
  fetchReferralHistoryRequest,
  fetchReferralHistorySuccess,
  fetchReferralHistoryFailure,
} = referralHistorySlice.actions;

export default referralHistorySlice.reducer;
