/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { DocumentInterface } from "../../shared/interface/DocumentInterface";
import type { CandidateInterface } from "../../shared/interface/CandidateInterface";

// Define the structure of a Resume
interface Resumes {
  data: DocumentInterface[];
  totalCount?: number;
}

// Define the structure of the resume state
interface ResumeState {
  loading: boolean;
  error: string | null;
  totalCount?: number;
  resume: DocumentInterface[] | null;
  deleteSuccess: boolean;
  updateSuccess: boolean;
}

// Initial state for the candidate Resume slice
const initialState: ResumeState = {
  loading: false,
  error: null,
  totalCount: 0,
  resume: null,
  deleteSuccess: false,
  updateSuccess: false,
};

const candidateResumeSlice = createSlice({
  name: "candidateResume",
  initialState,
  reducers: {
    // Fetch resume request
    fetchCandidateResumeRequest: (
      state,
      action: PayloadAction<{
        pageNumber: number;
        pageSize: number;
        candidateId: string;
      }>
    ) => {
      state.deleteSuccess = false;
      state.updateSuccess = false;
      state.loading = true;
      state.error = null;
    },
    // Fetch Resume success
    fetchCandidateResumeSuccess: (state, action: PayloadAction<Resumes>) => {
      const { data, totalCount = 0 } = action.payload;
      state.resume = data;
      state.totalCount = totalCount;
      state.loading = false;
      state.error = null;
    },
    // Fetch Resume failure
    fetchCandidateResumeFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
      state.resume = [];
      state.totalCount = 0;
    },
    // Update Resume
    updateCandidateResumeRequest: (
      state,
      action: PayloadAction<CandidateInterface>
    ) => {
      state.loading = true;
      state.error = null;
      state.deleteSuccess = false;
      state.updateSuccess = false;
    },
    // Update Resume success
    updateCandidateResumeSuccess: (
      state,
      action: PayloadAction<CandidateInterface>
    ) => {
      state.loading = false;
      state.error = null;
      state.updateSuccess = true;
    },
    // Update Resume failure
    updateCandidateResumeFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
      state.updateSuccess = false;
    },
  },
});

export const {
  fetchCandidateResumeRequest,
  fetchCandidateResumeSuccess,
  fetchCandidateResumeFailure,
  updateCandidateResumeRequest,
  updateCandidateResumeSuccess,
  updateCandidateResumeFailure,
} = candidateResumeSlice.actions;

export default candidateResumeSlice.reducer;
