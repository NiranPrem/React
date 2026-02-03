/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { JobInterface } from "../../shared/interface/JobInterface";

// Define the structure of the job opening state
interface ReferralJobOpening {
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
const referralJobOpeningSlice = createSlice({
	name: "referralJobOpening",
	initialState,
	reducers: {
		// Fetch all job openings
		fetchReferralJobOpeningRequest: (
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
		fetchReferralJobOpeningSuccess: (
			state,
			action: PayloadAction<ReferralJobOpening>
		) => {
			const { data, totalCount = 0 } = action.payload;
			state.jobOpenings = data;
			state.totalCount = totalCount;
			state.loading = false;
			state.error = null;
		},
		// Fetch job openings failure
		fetchReferralJobOpeningFailure: (state, action: PayloadAction<string>) => {
			state.loading = false;
			state.totalCount = 0;
			state.jobOpenings = [];
			state.selectedJobOpening = null;
			state.error = action.payload;
		},
		// Fetch active job openings details
		fetchReferralActiveJobOpeningDetailsRequest: (
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
		// Fetch active job openings details success
		fetchReferralActiveJobOpeningDetailsSuccess: (
			state,
			action: PayloadAction<ReferralJobOpening>
		) => {
			const { data, totalCount = 0 } = action.payload;
			state.jobOpenings = data;
			state.totalCount = totalCount;
			state.loading = false;
			state.error = null;
		},
		// Fetch active job openings details failure
		fetchReferralActiveJobOpeningDetailsFailure: (
			state,
			action: PayloadAction<string>
		) => {
			state.loading = false;
			state.totalCount = 0;
			state.jobOpenings = [];
			state.selectedJobOpening = null;
			state.error = action.payload;
		},
		// Search job openings
		searchReferralJobOpeningRequest: (
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
		searchReferralJobOpeningSuccess: (
			state,
			action: PayloadAction<ReferralJobOpening>
		) => {
			const { data, totalCount = 0 } = action.payload;
			state.jobOpenings = data;
			state.totalCount = totalCount;
			state.loading = false;
			state.error = null;
		},
		// Search job openings failure
		searchReferralJobOpeningFailure: (state, action: PayloadAction<string>) => {
			state.loading = false;
			state.totalCount = 0;
			state.jobOpenings = [];
			state.selectedJobOpening = null;
			state.error = action.payload;
		},
		// Fetch job opening by ID
		fetchReferralJobOpeningByIdRequest: (
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
		fetchReferralJobOpeningByIdSuccess: (
			state,
			action: PayloadAction<JobInterface>
		) => {
			state.selectedJobOpening = action.payload;
			state.loading = false;
			state.error = null;
		},
		// Fetch job opening by ID failure
		fetchReferralJobOpeningByIdFailure: (
			state,
			action: PayloadAction<string>
		) => {
			state.loading = false;
			state.error = action.payload;
		},
	},
});

// Export actions for use in components and sagas
export const {
	fetchReferralJobOpeningRequest,
	fetchReferralJobOpeningSuccess,
	fetchReferralJobOpeningFailure,
	fetchReferralActiveJobOpeningDetailsRequest,
	fetchReferralActiveJobOpeningDetailsSuccess,
	fetchReferralActiveJobOpeningDetailsFailure,
	fetchReferralJobOpeningByIdRequest,
	fetchReferralJobOpeningByIdSuccess,
	fetchReferralJobOpeningByIdFailure,
	searchReferralJobOpeningRequest,
	searchReferralJobOpeningSuccess,
	searchReferralJobOpeningFailure,
} = referralJobOpeningSlice.actions;

export default referralJobOpeningSlice.reducer;
