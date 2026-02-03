/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { JobOpeningHistoryInterface } from "../../shared/interface/HistoryInterface";

// Define the structure of the job opening state
interface JobOpeningState {
  loading: boolean;
  error: string | null;
  history: JobOpeningHistoryInterface[];
}

// Initial state for the job opening slice
const initialState: JobOpeningState = {
  loading: false,
  error: null,
  history: [],
};

// Create a slice for job openings with actions and reducers
const jobOpeningHistorySlice = createSlice({
  name: "jobOpeningHistory",
  initialState,
  reducers: {
    // Fetch history request
    fetchJobOpeningHistoryRequest: (
      state,
      action: PayloadAction<{
        id: number;
      }>
    ) => {
      state.loading = true;
      state.error = null;
    },
    // Fetch history success
    fetchJobOpeningHistorySuccess: (
      state,
      action: PayloadAction<[JobOpeningHistoryInterface]>
    ) => {
      const data = action.payload;
      state.history = data;
      state.loading = false;
      state.error = null;
    },
    // Fetch history failure
    fetchJobOpeningHistoryFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
      state.history = [];
    },
  },
});

// Export actions for use in components and sagas
export const {
  fetchJobOpeningHistoryRequest,
  fetchJobOpeningHistorySuccess,
  fetchJobOpeningHistoryFailure,
} = jobOpeningHistorySlice.actions;

export default jobOpeningHistorySlice.reducer;
