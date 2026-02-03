/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RequestInterface } from "../../shared/interface/RequestInterface";

// Define the structure of the job Request state
interface JobRequest {
  data: RequestInterface[];
  totalCount?: number;
}
// Define the structure of the job Request state
interface JobRequestState {
  loading: boolean;
  success: boolean;
  editSuccess?: boolean;
  error: string | null;
  totalCount?: number;
  jobRequests: RequestInterface[] | null;
  selectedJobRequest: RequestInterface | null;
}

// Initial state for the job Request slice
const initialState: JobRequestState = {
  loading: false,
  error: null,
  success: false,
  editSuccess: false,
  totalCount: 0,
  jobRequests: null,
  selectedJobRequest: null,
};

// Create a slice for job Requests with actions and reducers
const jobRequestSlice = createSlice({
  name: "jobRequest",
  initialState,
  reducers: {
    // Fetch all job Requests
    fetchJobRequestRequest: (
      state,
      action: PayloadAction<{
        pageNumber: number;
        pageSize: number;
      }>
    ) => {
      state.loading = true;
      state.error = null;
      state.selectedJobRequest = null;
      state.success = false;
      state.editSuccess = false;
    },
    // Fetch job Requests success
    fetchJobRequestSuccess: (state, action: PayloadAction<JobRequest>) => {
      const { data, totalCount = 0 } = action.payload;
      state.jobRequests = data;
      state.totalCount = totalCount;
      state.loading = false;
      state.error = null;
    },
    // Fetch job Requests failure
    fetchJobRequestFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.totalCount = 0;
      state.jobRequests = [];
      state.selectedJobRequest = null;
      state.error = action.payload;
    },
    // Search job Requests
    searchJobRequestRequest: (
      state,
      action: PayloadAction<{
        pageNumber: number;
        pageSize: number;
        searchTerm?: string;
      }>
    ) => {
      state.loading = true;
      state.error = null;
      state.selectedJobRequest = null;
      state.success = false;
      state.editSuccess = false;
    },
    // Search job Requests success
    searchJobRequestSuccess: (state, action: PayloadAction<JobRequest>) => {
      const { data, totalCount = 0 } = action.payload;
      state.jobRequests = data;
      state.totalCount = totalCount;
      state.loading = false;
      state.error = null;
    },
    // Search job Requests failure
    searchJobRequestFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.totalCount = 0;
      state.jobRequests = [];
      state.selectedJobRequest = null;
      state.error = action.payload;
    },
    // Fetch job Request by ID
    fetchJobRequestByIdRequest: (
      state,
      action: PayloadAction<{ id: string }>
    ) => {
      state.loading = true;
      state.error = null;
      state.selectedJobRequest = null;
      state.success = false;
      state.editSuccess = false;
    },
    // Fetch job Request by ID success
    fetchJobRequestByIdSuccess: (
      state,
      action: PayloadAction<RequestInterface>
    ) => {
      state.selectedJobRequest = action.payload;
      state.loading = false;
      state.error = null;
    },
    // Fetch job Request by ID failure
    fetchJobRequestByIdFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    // Add job Request
    addJobRequestRequest: (state, action: PayloadAction<RequestInterface>) => {
      state.loading = true;
      state.error = null;
      state.success = false;
      state.selectedJobRequest = null;
      state.editSuccess = false;
    },
    // Add job Request
    addJobRequestSuccess: (state, action: PayloadAction<RequestInterface>) => {
      if (state.jobRequests) {
        state.jobRequests = [...state.jobRequests, action.payload];
      } else {
        state.jobRequests = [action.payload];
      }
      state.loading = false;
      state.error = null;
      state.success = true;
    },
    // Add job Request failure
    addJobRequestFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
    },
    // Update job Request
    updateJobRequestRequest: (
      state,
      action: PayloadAction<RequestInterface>
    ) => {
      state.loading = true;
      state.error = null;
      state.success = false;
      state.editSuccess = false;
    },
    // Update job Request success
    updateJobRequestSuccess: (
      state,
      action: PayloadAction<RequestInterface>
    ) => {
      const updatedJobRequest = action.payload;
      if (state.jobRequests) {
        state.jobRequests = state.jobRequests.map((item) =>
          item.id === updatedJobRequest.id
            ? updatedJobRequest
            : item
        );
      }
      if (
        state.selectedJobRequest &&
        state.selectedJobRequest.id === updatedJobRequest.id
      ) {
        state.selectedJobRequest = updatedJobRequest;
      }
      if (state.selectedJobRequest) {
        state.selectedJobRequest = {
          ...state.selectedJobRequest,
          ...updatedJobRequest,
        };
      }
      state.totalCount = state.jobRequests?.length ?? 0;
      state.loading = false;
      state.error = null;
      state.editSuccess = true;
    },
    // Update job Request failure
    updateJobRequestFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    // Delete job Request
    deleteJobRequestRequest: (
      state,
      action: PayloadAction<{ id: number }>
    ) => {
      state.loading = true;
      state.error = null;
      state.success = false;
      state.selectedJobRequest = null;
      state.editSuccess = false;
    },
    // Delete job Request success
    deleteJobRequestSuccess: (state, action: PayloadAction<number>) => {
      const id = action.payload;
      if (state.jobRequests) {
        state.jobRequests = state.jobRequests.filter(
          (item) => item.id !== id
        );
      }
      if (
        state.selectedJobRequest &&
        state.selectedJobRequest.id === id
      ) {
        state.selectedJobRequest = null;
      }
      state.totalCount = state.jobRequests?.length ?? 0;
      state.loading = false;
      state.error = null;
    },
    // Delete job Request failure
    deleteJobRequestFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    // Reset job Request state
    resetJobRequestEditState: (state) => {
      state.editSuccess = false;
    },
  },
});

// Export actions for use in components and sagas
export const {
  fetchJobRequestRequest,
  fetchJobRequestSuccess,
  fetchJobRequestFailure,
  fetchJobRequestByIdRequest,
  fetchJobRequestByIdSuccess,
  fetchJobRequestByIdFailure,
  addJobRequestRequest,
  addJobRequestSuccess,
  addJobRequestFailure,
  updateJobRequestRequest,
  updateJobRequestSuccess,
  updateJobRequestFailure,
  deleteJobRequestRequest,
  deleteJobRequestSuccess,
  deleteJobRequestFailure,
  searchJobRequestRequest,
  searchJobRequestSuccess,
  searchJobRequestFailure,
  resetJobRequestEditState,
} = jobRequestSlice.actions;

export default jobRequestSlice.reducer;
