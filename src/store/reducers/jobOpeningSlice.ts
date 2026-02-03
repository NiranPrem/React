/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { JobInterface } from "../../shared/interface/JobInterface";

// Define the structure of the job opening state
interface JobOpening {
  data: JobInterface[];
  totalCount?: number;
}
// Define the structure of the job opening state
interface JobOpeningState {
  loading: boolean;
  success: boolean;
  editSuccess?: boolean;
  error: string | null;
  totalCount?: number;
  jobOpenings: JobInterface[] | null;
  selectedJobOpening: JobInterface | null;
}

// Initial state for the job opening slice
const initialState: JobOpeningState = {
  loading: false,
  error: null,
  success: false,
  editSuccess: false,
  totalCount: 0,
  jobOpenings: null,
  selectedJobOpening: null,
};

// Create a slice for job openings with actions and reducers
const jobOpeningSlice = createSlice({
  name: "jobOpening",
  initialState,
  reducers: {
    // Fetch all job openings
    fetchJobOpeningRequest: (
      state,
      action: PayloadAction<{
        pageNumber: number;
        pageSize: number;
      }>
    ) => {
      state.loading = true;
      state.error = null;
      state.selectedJobOpening = null;
      state.success = false;
      state.editSuccess = false;
    },
    // Fetch job openings success
    fetchJobOpeningSuccess: (state, action: PayloadAction<JobOpening>) => {
      const { data, totalCount = 0 } = action.payload;
      state.jobOpenings = data;
      state.totalCount = totalCount;
      state.loading = false;
      state.error = null;
    },
    // Fetch job openings failure
    fetchJobOpeningFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.totalCount = 0;
      state.jobOpenings = [];
      state.selectedJobOpening = null;
      state.error = action.payload;
    },
    // Search job openings
    searchJobOpeningRequest: (
      state,
      action: PayloadAction<{
        pageNumber: number;
        pageSize: number;
        searchTerm?: string;
      }>
    ) => {
      state.loading = true;
      state.error = null;
      state.selectedJobOpening = null;
      state.success = false;
      state.editSuccess = false;
    },
    // Search job openings success
    searchJobOpeningSuccess: (state, action: PayloadAction<JobOpening>) => {
      const { data, totalCount = 0 } = action.payload;
      state.jobOpenings = data;
      state.totalCount = totalCount;
      state.loading = false;
      state.error = null;
    },
    // Search job openings failure
    searchJobOpeningFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.totalCount = 0;
      state.jobOpenings = [];
      state.selectedJobOpening = null;
      state.error = action.payload;
    },
    // Fetch job opening by ID
    fetchJobOpeningByIdRequest: (
      state,
      action: PayloadAction<{ openingId: string }>
    ) => {
      state.loading = true;
      state.error = null;
      state.selectedJobOpening = null;
      state.success = false;
      state.editSuccess = false;
    },
    // Fetch job opening by ID success
    fetchJobOpeningByIdSuccess: (
      state,
      action: PayloadAction<JobInterface>
    ) => {
      state.selectedJobOpening = action.payload;
      state.loading = false;
      state.error = null;
    },
    // Fetch job opening by ID failure
    fetchJobOpeningByIdFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    // Add job opening
    addJobOpeningRequest: (state, action: PayloadAction<JobInterface>) => {
      state.loading = true;
      state.error = null;
      state.success = false;
      state.selectedJobOpening = null;
      state.editSuccess = false;
    },
    // Add job opening
    addJobOpeningSuccess: (state, action: PayloadAction<JobInterface>) => {
      if (state.jobOpenings) {
        state.jobOpenings = [...state.jobOpenings, action.payload];
      } else {
        state.jobOpenings = [action.payload];
      }
      state.loading = false;
      state.error = null;
      state.success = true;
    },
    // Add job opening failure
    addJobOpeningFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
    },
    // Update job opening
    updateJobOpeningRequest: (state, action: PayloadAction<JobInterface>) => {
      state.loading = true;
      state.error = null;
      state.success = false;
      state.editSuccess = false;
    },
    // Update job opening success
    updateJobOpeningSuccess: (state, action: PayloadAction<JobInterface>) => {
      const updatedJobOpening = action.payload;
      if (state.jobOpenings) {
        state.jobOpenings = state.jobOpenings.map((item) =>
          item.jobOpportunityId === updatedJobOpening.jobOpportunityId
            ? updatedJobOpening
            : item
        );
      }
      if (
        state.selectedJobOpening &&
        state.selectedJobOpening.jobOpportunityId ===
        updatedJobOpening.jobOpportunityId
      ) {
        state.selectedJobOpening = updatedJobOpening;
      }
      if (state.selectedJobOpening) {
        state.selectedJobOpening = {
          ...state.selectedJobOpening,
          ...updatedJobOpening,
        };
      }
      state.totalCount = state.jobOpenings?.length ?? 0;
      state.loading = false;
      state.error = null;
      state.editSuccess = true;
    },
    // Update job opening failure
    updateJobOpeningFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.editSuccess = false;
      state.error = action.payload;
    },
    // Update job opening status
    updateJobOpeningStatusRequest: (
      state,
      action: PayloadAction<{ jobOpportunityId: number; statusId: number }>
    ) => {
      state.loading = true;
      state.error = null;
      state.success = false;
      state.editSuccess = false;
    },
    // Update job opening status success
    updateJobOpeningStatusSuccess: (
      state,
      action: PayloadAction<JobInterface>
    ) => {
      const updatedJobOpening = action.payload;
      if (state.jobOpenings) {
        state.jobOpenings = state.jobOpenings.map((item) =>
          item.jobOpportunityId === updatedJobOpening.jobOpportunityId
            ? updatedJobOpening
            : item
        );
      }
      if (
        state.selectedJobOpening &&
        state.selectedJobOpening.jobOpportunityId ===
        updatedJobOpening.jobOpportunityId
      ) {
        state.selectedJobOpening = {
          ...state.selectedJobOpening,
          statusId: updatedJobOpening.statusId,
          status: updatedJobOpening.status,
        };
      }
      state.loading = false;
      state.error = null;
      state.editSuccess = true;
    },
    // Update job opening status failure
    updateJobOpeningStatusFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.editSuccess = false;
      state.error = action.payload;
    },
    // Delete job opening
    deleteJobOpeningRequest: (
      state,
      action: PayloadAction<{ jobOpportunityId: number }>
    ) => {
      state.loading = true;
      state.error = null;
      state.success = false;
      state.editSuccess = false;
      state.selectedJobOpening = null;
    },
    // Delete job opening success
    deleteJobOpeningSuccess: (state, action: PayloadAction<number>) => {
      const jobOpportunityId = action.payload;
      if (state.jobOpenings) {
        state.jobOpenings = state.jobOpenings.filter(
          (item) => item.jobOpportunityId !== jobOpportunityId
        );
      }
      if (
        state.selectedJobOpening &&
        state.selectedJobOpening.jobOpportunityId === jobOpportunityId
      ) {
        state.selectedJobOpening = null;
      }
      state.totalCount = state.jobOpenings?.length ?? 0;
      state.loading = false;
      state.error = null;
    },
    // Delete job opening failure
    deleteJobOpeningFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    // Reset job opening state
    resetJobOpeningEditState: (state) => {
      state.editSuccess = false;
    },
  },
});

// Export actions for use in components and sagas
export const {
  fetchJobOpeningRequest,
  fetchJobOpeningSuccess,
  fetchJobOpeningFailure,
  fetchJobOpeningByIdRequest,
  fetchJobOpeningByIdSuccess,
  fetchJobOpeningByIdFailure,
  addJobOpeningRequest,
  addJobOpeningSuccess,
  addJobOpeningFailure,
  updateJobOpeningRequest,
  updateJobOpeningSuccess,
  updateJobOpeningFailure,
  updateJobOpeningStatusRequest,
  updateJobOpeningStatusSuccess,
  updateJobOpeningStatusFailure,
  deleteJobOpeningRequest,
  deleteJobOpeningSuccess,
  deleteJobOpeningFailure,
  searchJobOpeningRequest,
  searchJobOpeningSuccess,
  searchJobOpeningFailure,
  resetJobOpeningEditState,
} = jobOpeningSlice.actions;

export default jobOpeningSlice.reducer;
