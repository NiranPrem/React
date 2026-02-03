/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { JobOfferInterface } from "../../shared/interface/jobOfferLetterInterface";

// Define the structure of the job offer state
interface JobOfferLetter {
	data: JobOfferInterface[];
	totalCount?: number;
}
// Define the structure of the job offer state
interface JobOfferLetterState {
	loading: boolean;
	previewLoading: boolean;
	addLoading: boolean;
	success: boolean;
	editSuccess?: boolean;
	error: string | null;
	totalCount?: number;
	jobOfferLetterList: JobOfferInterface[] | null;
	selectedJobOffer: JobOfferInterface | null;
}
// Initial state for the job offer slice
const initialState: JobOfferLetterState = {
	loading: false,
	previewLoading: false,
	addLoading: false,
	error: null,
	editSuccess: false,
	success: false,
	totalCount: 0,
	jobOfferLetterList: null,
	selectedJobOffer: null,
};

// Create a slice for job offer with actions and reducers
const jobOfferLetterSlice = createSlice({
	name: "JobOfferLetter",
	initialState,
	reducers: {
		// Fetch all offer letters
		fetchJobOfferLetterRequest: (
			state,
			action: PayloadAction<{
				pageNumber: number;
				pageSize: number;
				jobOpportunityId: number;
			}>
		) => {
			state.loading = true;
			state.error = null;
			state.selectedJobOffer = null;
			state.success = false;
			state.editSuccess = false;
		},
		// Fetch offer letter  success
		fetchJobOfferLetterSuccess: (
			state,
			action: PayloadAction<JobOfferLetter>
		) => {
			const { data, totalCount = 0 } = action.payload;
			state.jobOfferLetterList = data;
			state.totalCount = totalCount;
			state.loading = false;
			state.error = null;
		},
		// Fetch offer letter  failure
		fetchJobOfferLetterFailure: (state, action: PayloadAction<string>) => {
			state.loading = false;
			state.totalCount = 0;
			state.jobOfferLetterList = [];
			state.selectedJobOffer = null;
			state.error = action.payload;
		},
		// Add job offer letter
		addJobOfferLetterRequest: (
			state,
			action: PayloadAction<JobOfferInterface>
		) => {
			state.addLoading = true;
			state.error = null;
			state.success = false;
			state.editSuccess = false;
		},
		// Add job offer letter success
		addJobOfferLetterSuccess: (
			state,
			action: PayloadAction<JobOfferInterface>
		) => {
			state.addLoading = false;
			state.error = null;
			state.success = true;
			if (state.jobOfferLetterList) {
				state.jobOfferLetterList.push(action.payload);
			}
		},
		// Add job offer letter failure
		addJobOfferLetterFailure: (state, action: PayloadAction<string>) => {
			state.loading = false;
			state.error = action.payload;
			state.success = false;
		},
		// Fetch job offer letter preview by ID
		fetchJobOfferLetterPreviewByIdRequest: (
			state,
			action: PayloadAction<{ candidateId: string }>
		) => {
			state.previewLoading = true;
			state.error = null;
			state.success = false;
			state.editSuccess = false;
		},
		// Fetch job offer letter preview by ID success
		fetchJobOfferLetterPreviewByIdSuccess: (
			state,
			action: PayloadAction<JobOfferInterface>
		) => {
			state.selectedJobOffer = action.payload;
			state.previewLoading = false;
			state.error = null;
		},
		// Fetch job offer letter preview by ID failure
		fetchJobOfferLetterPreviewByIdFailure: (
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
	fetchJobOfferLetterRequest,
	fetchJobOfferLetterSuccess,
	fetchJobOfferLetterFailure,
	addJobOfferLetterRequest,
	addJobOfferLetterSuccess,
	addJobOfferLetterFailure,
	fetchJobOfferLetterPreviewByIdRequest,
	fetchJobOfferLetterPreviewByIdSuccess,
	fetchJobOfferLetterPreviewByIdFailure,
} = jobOfferLetterSlice.actions;

export default jobOfferLetterSlice.reducer;
