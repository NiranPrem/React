/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { JobRequestHistoryInterface } from "../../shared/interface/HistoryInterface";

// Define the structure of the job request state
interface JobRequestState {
  loading: boolean;
  error: string | null;
  history: JobRequestHistoryInterface[];
}

// Initial state for the job request slice
const initialState: JobRequestState = {
  loading: false,
  error: null,
  history: [],
};

// Create a slice for job request with actions and reducers
const jobRequestHistorySlice = createSlice({
  name: "jobRequestHistory",
  initialState,
  reducers: {
    // Fetch history request
    fetchJobRequestHistoryRequest: (
      state,
      action: PayloadAction<{
        id: number;
      }>
    ) => {
      state.loading = true;
      state.error = null;
    },
    // Fetch history success
    fetchJobRequestHistorySuccess: (
      state,
      action: PayloadAction<[JobRequestHistoryInterface]>
    ) => {
      const data = action.payload;
      state.history = data;
      state.loading = false;
      state.error = null;
    },
    // Fetch history failure
    fetchJobRequestHistoryFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
      state.history = [];
    },
  },
});

// Export actions for use in components and sagas
export const {
  fetchJobRequestHistoryRequest,
  fetchJobRequestHistorySuccess,
  fetchJobRequestHistoryFailure,
} = jobRequestHistorySlice.actions;

export default jobRequestHistorySlice.reducer;
