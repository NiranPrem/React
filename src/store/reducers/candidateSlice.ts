/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { CandidateInterface } from "../../shared/interface/CandidateInterface";

// Define the structure of the candidate state
interface Candidate {
  data: CandidateInterface[];
  totalCount?: number;
}

// Define the structure of the candidate state
interface CandidateState {
  loading: boolean;
  success: boolean;
  editSuccess?: boolean;
  error: string | null;
  totalCount?: number;
  candidates: CandidateInterface[] | null;
  jobOpeningCandidates?: CandidateInterface[] | null;
  selectedCandidate: CandidateInterface | null;
  isDuplicateCandidate: boolean | null;
}

// Initial state for the candidate slice
const initialState: CandidateState = {
  loading: false,
  error: null,
  success: false,
  editSuccess: false,
  totalCount: 0,
  candidates: null,
  jobOpeningCandidates: null,
  selectedCandidate: null,
  isDuplicateCandidate: null,
};

// Create a slice for candidates with actions and reducers
const candidateSlice = createSlice({
  name: "candidates",
  initialState,
  reducers: {
    // Fetch all candidates
    fetchCandidateRequest: (
      state,
      action: PayloadAction<{
        pageNumber: number;
        pageSize: number;
      }>
    ) => {
      state.loading = true;
      state.error = null;
      state.success = false;
      state.selectedCandidate = null;
      state.editSuccess = false;
    },
    // Fetch candidates success
    fetchCandidateSuccess: (state, action: PayloadAction<Candidate>) => {
      const { data, totalCount = 0 } = action.payload;
      state.candidates = data;
      state.totalCount = totalCount;
      state.loading = false;
      state.error = null;
    },
    // Fetch candidates failure
    fetchCandidateFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.totalCount = 0;
      state.candidates = [];
      state.selectedCandidate = null;
      state.error = action.payload;
    },
    // Fetch all job Opening Candidates
    fetchCandidateByJobOpeningRequest: (
      state,
      action: PayloadAction<{
        pageNumber: number;
        pageSize: number;
        jobOpportunityId: number;
      }>
    ) => {
      state.loading = true;
      state.error = null;
      state.jobOpeningCandidates = [];
      state.success = false;
      state.selectedCandidate = null;
      state.editSuccess = false;
    },
    // Fetch job Opening Candidates success
    fetchCandidateByJobOpeningSuccess: (
      state,
      action: PayloadAction<Candidate>
    ) => {
      const { data, totalCount = 0 } = action.payload;
      state.jobOpeningCandidates = data;
      state.totalCount = totalCount;
      state.loading = false;
      state.error = null;
    },
    // Fetch job Opening Candidates failure
    fetchCandidateByJobOpeningFailure: (
      state,
      action: PayloadAction<string>
    ) => {
      state.loading = false;
      state.totalCount = 0;
      state.jobOpeningCandidates = [];
      state.selectedCandidate = null;
      state.error = action.payload;
    },
    // Search candidates
    searchCandidateRequest: (
      state,
      action: PayloadAction<{
        pageNumber: number;
        pageSize: number;
        searchTerm?: string;
      }>
    ) => {
      state.loading = true;
      state.success = false;
      state.error = null;
      state.selectedCandidate = null;
      state.editSuccess = false;
    },
    // Search candidates success
    searchCandidateSuccess: (state, action: PayloadAction<Candidate>) => {
      const { data, totalCount = 0 } = action.payload;
      state.candidates = data;
      state.totalCount = totalCount;
      state.loading = false;
      state.error = null;
    },
    // Search candidates failure
    searchCandidateFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.totalCount = 0;
      state.candidates = [];
      state.selectedCandidate = null;
      state.error = action.payload;
    },
    // Fetch candidate by ID
    fetchCandidateByIdRequest: (
      state,
      action: PayloadAction<{ candidateId: string }>
    ) => {
      state.loading = true;
      state.error = null;
      state.success = false;
      state.selectedCandidate = null;
      state.editSuccess = false;
    },
    // Fetch candidate by ID success
    fetchCandidateByIdSuccess: (
      state,
      action: PayloadAction<CandidateInterface>
    ) => {
      state.selectedCandidate = action.payload;
      state.loading = false;
      state.error = null;
    },
    // Fetch candidate by ID failure
    fetchCandidateByIdFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    // Add candidate
    addCandidateRequest: (state, action: PayloadAction<CandidateInterface>) => {
      state.loading = true;
      state.error = null;
      state.success = false;
      state.selectedCandidate = null;
      state.editSuccess = false;
    },
    // Add candidate
    addCandidateSuccess: (state, action: PayloadAction<CandidateInterface>) => {
      if (state.candidates) {
        state.candidates = [...state.candidates, action.payload];
      } else {
        state.candidates = [action.payload];
      }
      state.loading = false;
      state.error = null;
      state.success = true;
      setTimeout(() => {
        state.success = false;
      }, 3000);
    },
    // Add candidate failure
    addCandidateFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
    },
    // Update candidate
    updateCandidateRequest: (
      state,
      action: PayloadAction<CandidateInterface>
    ) => {
      state.loading = true;
      state.success = false;
      state.editSuccess = false;
      state.error = null;
    },
    // Update candidate success
    updateCandidateSuccess: (
      state,
      action: PayloadAction<CandidateInterface>
    ) => {
      const updatedCandidate = action.payload;
      if (state.candidates) {
        state.candidates = state.candidates.map((item) =>
          item.candidateId === updatedCandidate.candidateId
            ? updatedCandidate
            : item
        );
      }
      if (
        state.selectedCandidate &&
        state.selectedCandidate.candidateId === updatedCandidate.candidateId
      ) {
        state.selectedCandidate = updatedCandidate;
      }
      if (state.selectedCandidate) {
        state.selectedCandidate = {
          ...state.selectedCandidate,
          ...updatedCandidate,
        };
      }
      state.totalCount = state.candidates?.length ?? 0;
      state.loading = false;
      state.error = null;
      state.editSuccess = true;
    },
    // Update candidate failure
    updateCandidateFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    // Delete candidate
    deleteCandidateRequest: (
      state,
      action: PayloadAction<{ candidateId: number }>
    ) => {
      state.loading = true;
      state.error = null;
      state.success = false;
      state.editSuccess = false;
      state.selectedCandidate = null;
    },
    // Delete candidate success
    deleteCandidateSuccess: (state, action: PayloadAction<number>) => {
      const candidateId = action.payload;
      if (state.candidates) {
        state.candidates = state.candidates.filter(
          (item) => item.candidateId !== candidateId
        );
      }
      if (
        state.selectedCandidate &&
        state.selectedCandidate.candidateId === candidateId
      ) {
        state.selectedCandidate = null;
      }
      state.totalCount = state.candidates?.length ?? 0;
      state.loading = false;
      state.error = null;
    },
    // Delete candidate failure
    deleteCandidateFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    // Check duplicate candidate
    checkDuplicateCandidateRequest: (
      state,
      action: PayloadAction<{
        jobOpportunityId: number;
        email: string;
        mobile: string;
      }>
    ) => {
      state.loading = true;
      state.error = null;
      state.isDuplicateCandidate = null;
    },
    // Check duplicate candidate success
    checkDuplicateCandidateSuccess: (
      state,
      action: PayloadAction<{ isDuplicate: boolean }>
    ) => {
      state.loading = false;
      state.isDuplicateCandidate = action.payload.isDuplicate;
      state.error = null;
    },
    // Check duplicate candidate failure
    checkDuplicateCandidateFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
      state.isDuplicateCandidate = null;
    },
    resetCandidateEditState: (state) => {
      state.editSuccess = false;
    },
  },
});

// Export actions for use in components and sagas
export const {
  fetchCandidateRequest,
  fetchCandidateSuccess,
  fetchCandidateFailure,
  fetchCandidateByJobOpeningRequest,
  fetchCandidateByJobOpeningSuccess,
  fetchCandidateByJobOpeningFailure,
  fetchCandidateByIdRequest,
  fetchCandidateByIdSuccess,
  fetchCandidateByIdFailure,
  addCandidateRequest,
  addCandidateSuccess,
  addCandidateFailure,
  updateCandidateRequest,
  updateCandidateSuccess,
  updateCandidateFailure,
  deleteCandidateRequest,
  deleteCandidateSuccess,
  deleteCandidateFailure,
  searchCandidateRequest,
  searchCandidateSuccess,
  searchCandidateFailure,
  checkDuplicateCandidateRequest,
  checkDuplicateCandidateSuccess,
  checkDuplicateCandidateFailure,
  resetCandidateEditState,
} = candidateSlice.actions;

export default candidateSlice.reducer;
