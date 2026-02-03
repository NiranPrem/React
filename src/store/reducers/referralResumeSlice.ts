/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { DocumentInterface } from "../../shared/interface/DocumentInterface";
import type { ReferralInterface } from "../../shared/interface/ReferralInterface";

// Define the structure of a Resume
interface Resumes {
  data: DocumentInterface[];
  totalCount?: number;
}

// Define the structure of the Resume state
interface ResumesState {
  loading: boolean;
  error: string | null;
  totalCount?: number;
  resumes: DocumentInterface[] | null;
  deleteSuccess: boolean;
  updateSuccess: boolean;
}

// Initial state for the referral Resume slice
const initialState: ResumesState = {
  loading: false,
  error: null,
  totalCount: 0,
  resumes: null,
  deleteSuccess: false,
  updateSuccess: false,
};

const referralResumeSlice = createSlice({
  name: "referralResumes",
  initialState,
  reducers: {
    // Fetch Resume request
    fetchReferralResumeRequest: (
      state,
      action: PayloadAction<{
        pageNumber: number;
        pageSize: number;
        referralId: string;
      }>
    ) => {
      state.deleteSuccess = false;
      state.updateSuccess = false;
      state.loading = true;
      state.error = null;
    },
    // Fetch Resume success
    fetchReferralResumeSuccess: (
      state,
      action: PayloadAction<Resumes>
    ) => {
      const { data, totalCount = 0 } = action.payload;
      state.resumes = data;
      state.totalCount = totalCount;
      state.loading = false;
      state.error = null;
    },
    // Fetch resumes failure
    fetchReferralResumeFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
      state.resumes = [];
      state.totalCount = 0;
    },
    // Update Resume success
    updateReferralResumeRequest: (
      state,
      action: PayloadAction<ReferralInterface>
    ) => {
      state.loading = true;
      state.error = null;
      state.deleteSuccess = false;
      state.updateSuccess = false;
    },
    // Update Resume success
    updateReferralResumeSuccess: (
      state,
      action: PayloadAction<ReferralInterface>
    ) => {
      state.loading = false;
      state.error = null;
      state.updateSuccess = true;
    },
    // Update Resume failure
    updateReferralResumeFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
      state.updateSuccess = false;
    },
  },
});

export const {
  fetchReferralResumeRequest,
  fetchReferralResumeSuccess,
  fetchReferralResumeFailure,
  updateReferralResumeRequest,
  updateReferralResumeSuccess,
  updateReferralResumeFailure,
} = referralResumeSlice.actions;

export default referralResumeSlice.reducer;
