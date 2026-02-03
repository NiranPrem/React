/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { InterviewHistoryInterface } from "../../shared/interface/InterviewsInterface";

// Define the structure of the job opening state
interface InterviewState {
  loading: boolean;
  error: string | null;
  history: InterviewHistoryInterface[];
}

// Initial state for the job opening slice
const initialState: InterviewState = {
  loading: false,
  error: null,
  history: [],
};

// Create a slice for job openings with actions and reducers
const interviewHistorySlice = createSlice({
  name: "interviewHistory",
  initialState,
  reducers: {
    // Fetch history request
    fetchInterviewHistoryRequest: (
      state,
      action: PayloadAction<{
        id: number;
      }>
    ) => {
      state.loading = true;
      state.error = null;
    },
    // Fetch history success
    fetchInterviewHistorySuccess: (
      state,
      action: PayloadAction<[InterviewHistoryInterface]>
    ) => {
      const data = action.payload;
      state.history = data;
      state.loading = false;
      state.error = null;
    },
    // Fetch history failure
    fetchInterviewHistoryFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
      state.history = [];
    },
  },
});

// Export actions for use in components and sagas
export const {
  fetchInterviewHistoryRequest,
  fetchInterviewHistorySuccess,
  fetchInterviewHistoryFailure,
} = interviewHistorySlice.actions;

export default interviewHistorySlice.reducer;
