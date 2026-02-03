/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { ReferralInterface } from "../../shared/interface/ReferralInterface";

// Define the structure of the Referrals Request state
interface Referrals {
  data: ReferralInterface[];
  totalCount?: number;
}
// Define the structure of the Referrals Request state
interface ReferralState {
  loading: boolean;
  success: boolean;
  editSuccess?: boolean;
  error: string | null;
  totalCount?: number;
  referrals: ReferralInterface[] | null;
  selectedReferral: ReferralInterface | null;
}

// Initial state for the Referrals Request slice
const initialState: ReferralState = {
  loading: false,
  error: null,
  success: false,
  editSuccess: false,
  totalCount: 0,
  referrals: null,
  selectedReferral: null,
};

// Create a slice for Referrals Requests with actions and reducers
const ReferralSlice = createSlice({
  name: "referrals",
  initialState,
  reducers: {
    // Fetch all Referrals Requests
    fetchReferralRequest: (
      state,
      action: PayloadAction<{
        pageNumber: number;
        pageSize: number;
      }>
    ) => {
      state.loading = true;
      state.error = null;
      state.selectedReferral = null;
      state.success = false;
      state.editSuccess = false;
    },
    // Fetch Referrals Requests success
    fetchReferralSuccess: (state, action: PayloadAction<Referrals>) => {
      const { data, totalCount = 0 } = action.payload;
      state.referrals = data;
      state.totalCount = totalCount;
      state.loading = false;
      state.error = null;
    },
    // Fetch Referrals Requests failure
    fetchReferralFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.totalCount = 0;
      state.referrals = [];
      state.selectedReferral = null;
      state.error = action.payload;
    },
    // Search Referrals Requests
    searchReferralRequest: (
      state,
      action: PayloadAction<{
        pageNumber: number;
        pageSize: number;
        searchTerm?: string;
      }>
    ) => {
      state.loading = true;
      state.error = null;
      state.selectedReferral = null;
      state.success = false;
      state.editSuccess = false;
    },
    // Search Referrals Requests success
    searchReferralSuccess: (state, action: PayloadAction<Referrals>) => {
      const { data, totalCount = 0 } = action.payload;
      state.referrals = data;
      state.totalCount = totalCount;
      state.loading = false;
      state.error = null;
    },
    // Search Referrals Requests failure
    searchReferralFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.totalCount = 0;
      state.referrals = [];
      state.selectedReferral = null;
      state.error = action.payload;
    },
    // Fetch Referrals Request by ID
    fetchReferralByIdRequest: (
      state,
      action: PayloadAction<{ referralId: string }>
    ) => {
      state.loading = true;
      state.error = null;
      state.selectedReferral = null;
      state.success = false;
      state.editSuccess = false;
    },
    // Fetch Referrals Request by ID success
    fetchReferralByIdSuccess: (
      state,
      action: PayloadAction<ReferralInterface>
    ) => {
      state.selectedReferral = action.payload;
      state.loading = false;
      state.error = null;
    },
    // Fetch Referrals Request by ID failure
    fetchReferralByIdFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    // Add Referrals Request
    addReferralRequest: (state, action: PayloadAction<ReferralInterface>) => {
      state.loading = true;
      state.error = null;
      state.success = false;
      state.selectedReferral = null;
      state.editSuccess = false;
    },
    // Add Referrals Request
    addReferralSuccess: (state, action: PayloadAction<ReferralInterface>) => {
      if (state.referrals) {
        state.referrals = [...state.referrals, action.payload];
      } else {
        state.referrals = [action.payload];
      }
      state.loading = false;
      state.error = null;
      state.success = true;
    },
    // Add Referrals Request failure
    addReferralFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
    },
    // Update Referrals Request
    updateReferralRequest: (
      state,
      action: PayloadAction<ReferralInterface>
    ) => {
      state.loading = true;
      state.error = null;
      state.success = false;
      state.editSuccess = false;
    },
    // Update Referrals Request success
    updateReferralSuccess: (
      state,
      action: PayloadAction<ReferralInterface>
    ) => {
      const updatedReferrals = action.payload;
      if (state.referrals) {
        state.referrals = state.referrals.map((item) =>
          item.referralId === updatedReferrals.referralId
            ? updatedReferrals
            : item
        );
      }
      if (
        state.selectedReferral &&
        state.selectedReferral.referralId === updatedReferrals.referralId
      ) {
        state.selectedReferral = updatedReferrals;
      }
      if (state.selectedReferral) {
        state.selectedReferral = {
          ...state.selectedReferral,
          ...updatedReferrals,
        };
      }
      state.totalCount = state.referrals?.length ?? 0;
      state.loading = false;
      state.error = null;
      state.editSuccess = true;
    },
    // Update Referrals Request failure
    updateReferralFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    // Delete Referrals Request
    deleteReferralRequest: (
      state,
      action: PayloadAction<{ referralId: number }>
    ) => {
      state.loading = true;
      state.error = null;
      state.success = false;
      state.selectedReferral = null;
      state.editSuccess = false;
    },
    // Delete Referrals Request success
    deleteReferralSuccess: (state, action: PayloadAction<number>) => {
      const referralId = action.payload;
      if (state.referrals) {
        state.referrals = state.referrals.filter(
          (item) => item.referralId !== referralId
        );
      }
      if (
        state.selectedReferral &&
        state.selectedReferral.referralId === referralId
      ) {
        state.selectedReferral = null;
      }
      state.totalCount = state.referrals?.length ?? 0;
      state.loading = false;
      state.error = null;
    },
    // Delete Referrals Request failure
    deleteReferralFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    // Reset Referrals Request state
    resetReferralEditState: (state) => {
      state.editSuccess = false;
    },
  },
});

// Export actions for use in components and sagas
export const {
  fetchReferralRequest,
  fetchReferralSuccess,
  fetchReferralFailure,
  fetchReferralByIdRequest,
  fetchReferralByIdSuccess,
  fetchReferralByIdFailure,
  addReferralRequest,
  addReferralSuccess,
  addReferralFailure,
  updateReferralRequest,
  updateReferralSuccess,
  updateReferralFailure,
  deleteReferralRequest,
  deleteReferralSuccess,
  deleteReferralFailure,
  searchReferralRequest,
  searchReferralSuccess,
  searchReferralFailure,
  resetReferralEditState,
} = ReferralSlice.actions;

export default ReferralSlice.reducer;
