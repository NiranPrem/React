/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { CandidateHistoryInterface } from "../../shared/interface/HistoryInterface";

// Define the structure of the job opening state
interface JobOpeningState {
  loading: boolean;
  error: string | null;
  history: CandidateHistoryInterface[];
}

// Initial state for the job opening slice
const initialState: JobOpeningState = {
  loading: false,
  error: null,
  history: [],
};

// Create a slice for job openings with actions and reducers
const candidateHistorySlice = createSlice({
  name: "candidateHistory",
  initialState,
  reducers: {
    // Fetch history request
    fetchCandidateHistoryRequest: (
      state,
      action: PayloadAction<{
        id: number;
      }>
    ) => {
      state.loading = true;
      state.error = null;
    },
    // Fetch history success
    fetchCandidateHistorySuccess: (
      state,
      action: PayloadAction<[CandidateHistoryInterface]>
    ) => {
      const data = action.payload;
      state.history = data;
      state.loading = false;
      state.error = null;
    },
    // Fetch history failure
    fetchCandidateHistoryFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
      state.history = [];
    },
  },
});

// Export actions for use in components and sagas
export const {
  fetchCandidateHistoryRequest,
  fetchCandidateHistorySuccess,
  fetchCandidateHistoryFailure,
} = candidateHistorySlice.actions;

export default candidateHistorySlice.reducer;
