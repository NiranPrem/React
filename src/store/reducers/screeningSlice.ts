/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type {
	FeedbackInterface,
	InterviewDecisionInterface,
	InterviewInterface,
	InterviewUpdatePayloadInterface,
} from "../../shared/interface/InterviewsInterface";

// Define the structure of the interview state
interface Interviews {
	data: InterviewInterface[];
	totalCount?: number;
}

interface Feedback {
	data: FeedbackInterface | null;
}
// Define the structure of the interview state
interface InterviewsState {
	loading: boolean;
	success: boolean;
	editSuccess?: boolean;
	error: string | null;
	totalCount?: number;
	interviews: InterviewInterface[] | null;
	selectedInterview: InterviewInterface | null;
	feedback: FeedbackInterface | null;
	meetingLinkLoading?: boolean;
	generatedMeetingLink?: string | null;
	interviewDecision?: InterviewDecisionInterface[] | null;
}

// Initial state for the interviews slice
const initialState: InterviewsState = {
	loading: false,
	error: null,
	success: false,
	editSuccess: false,
	totalCount: 0,
	interviews: null,
	selectedInterview: null,
	feedback: null,
	meetingLinkLoading: false,
	generatedMeetingLink: null,
};

// Create a slice for interview with actions and reducers
const interviewSlice = createSlice({
	name: "screening",
	initialState,
	reducers: {
		// Fetch all interview
		fetchInterviewRequest: (
			state,
			action: PayloadAction<{
				pageNumber: number;
				pageSize: number;
				jobOpportunityId: number;
				candidateId: number;
			}>
		) => {
			state.loading = true;
			state.error = null;
			state.interviews = [];
			state.selectedInterview = null;
			state.success = false;
			state.editSuccess = false;
		},
		// Fetch interview  success
		fetchInterviewSuccess: (state, action: PayloadAction<Interviews>) => {
			const { data, totalCount = 0 } = action.payload;
			state.interviews = data;
			state.totalCount = totalCount;
			state.loading = false;
			state.error = null;
		},
		// Fetch interview  failure
		fetchInterviewFailure: (state, action: PayloadAction<string>) => {
			state.loading = false;
			state.totalCount = 0;
			state.interviews = [];
			state.selectedInterview = null;
			state.error = action.payload;
		},
		// Search interview
		searchInterviewRequest: (
			state,
			action: PayloadAction<{
				pageNumber: number;
				pageSize: number;
				jobOpportunityId: number;
				candidateId: number;
				searchTerm?: string;
			}>
		) => {
			state.loading = true;
			state.error = null;
			state.selectedInterview = null;
			state.success = false;
			state.editSuccess = false;
		},
		// Search interview  success
		searchInterviewSuccess: (state, action: PayloadAction<Interviews>) => {
			const { data, totalCount = 0 } = action.payload;
			state.interviews = data;
			state.totalCount = totalCount;
			state.loading = false;
			state.error = null;
		},
		// Search interview  failure
		searchInterviewFailure: (state, action: PayloadAction<string>) => {
			state.loading = false;
			state.totalCount = 0;
			state.interviews = [];
			state.selectedInterview = null;
			state.error = action.payload;
		},
		// Fetch interview by ID
		fetchInterviewByIdRequest: (
			state,
			action: PayloadAction<{ interviewId: string }>
		) => {
			state.loading = true;
			state.error = null;
			state.selectedInterview = null;
			state.success = false;
			state.editSuccess = false;
			state.feedback = null;
		},
		// Fetch interview by ID success
		fetchInterviewByIdSuccess: (
			state,
			action: PayloadAction<InterviewInterface>
		) => {
			state.selectedInterview = action.payload;
			state.loading = false;
			state.error = null;
		},
		// Fetch interview by ID failure
		fetchInterviewByIdFailure: (state, action: PayloadAction<string>) => {
			state.loading = false;
			state.error = action.payload;
		},
		// Add interview
		addInterviewRequest: (state, action: PayloadAction<InterviewInterface>) => {
			state.loading = true;
			state.error = null;
			state.success = false;
			state.selectedInterview = null;
			state.editSuccess = false;
		},
		// Add interview
		addInterviewSuccess: (state, action: PayloadAction<InterviewInterface>) => {
			if (state.interviews) {
				state.interviews = [...state.interviews, action.payload];
			} else {
				state.interviews = [action.payload];
			}
			state.loading = false;
			state.error = null;
			state.success = true;
		},
		// Add interview failure
		addInterviewFailure: (state, action: PayloadAction<string>) => {
			state.loading = false;
			state.error = action.payload;
			state.success = false;
		},
		// Update interview
		updateInterviewRequest: (
			state,
			action: PayloadAction<InterviewInterface>
		) => {
			state.loading = true;
			state.error = null;
			state.success = false;
			state.editSuccess = false;
		},
		// Update interview success
		updateInterviewSuccess: (
			state,
			action: PayloadAction<InterviewUpdatePayloadInterface>
		) => {
			const updatedInterview = action.payload.data;
			if (state.interviews) {
				state.interviews = state.interviews.map((item) =>
					item.interviewId === updatedInterview.interviewId
						? updatedInterview
						: item
				);
			}
			if (
				state.selectedInterview &&
				state.selectedInterview.interviewId === updatedInterview.interviewId
			) {
				state.selectedInterview = updatedInterview;
			}
			if (state.selectedInterview) {
				state.selectedInterview = {
					...state.selectedInterview,
					...updatedInterview,
				};
			}
			state.totalCount = state.interviews?.length ?? 0;
			state.loading = false;
			state.error = null;
			state.editSuccess = true;
		},

		// Update interview failure
		updateInterviewFailure: (state, action: PayloadAction<string>) => {
			state.loading = false;
			state.editSuccess = false;
			state.error = action.payload;
		},
		// Fetch interview by ID
		fetchFeedbackByInterviewIdRequest: (
			state,
			action: PayloadAction<{ interviewId: string }>
		) => {
			state.loading = true;
			state.error = null;
			state.feedback = null;
			state.success = false;
			state.editSuccess = false;
		},
		// Fetch interview by ID success
		fetchFeedbackByInterviewIdSuccess: (
			state,
			action: PayloadAction<Feedback>
		) => {
			const { data } = action.payload;
			state.feedback = data;
			state.loading = false;
			state.error = null;
		},
		// Fetch interview by ID failure
		fetchFeedbackByInterviewIdFailure: (
			state,
			action: PayloadAction<string>
		) => {
			state.feedback = null;
			state.loading = false;
			state.error = action.payload;
		},
		addFeedbackByInterviewRequest: (
			state,
			action: PayloadAction<FeedbackInterface>
		) => {
			state.loading = true;
			state.error = null;
			state.success = false;
			state.selectedInterview = null;
			state.editSuccess = false;
		},
		// Add feedback
		addFeedbackByInterviewSuccess: (state, action: PayloadAction<Feedback>) => {
			const { data } = action.payload;
			state.feedback = data;
			state.loading = false;
			state.error = null;
			state.success = true;
		},
		// Add interview failure
		addFeedbackByInterviewFailure: (state, action: PayloadAction<string>) => {
			state.loading = false;
			state.error = action.payload;
			state.success = false;
		},
		// Update interview
		updateFeedbackByInterviewRequest: (
			state,
			action: PayloadAction<FeedbackInterface>
		) => {
			state.feedback = action.payload;
			state.loading = true;
			state.error = null;
			state.success = false;
			state.editSuccess = false;
		},
		// Update interview success
		updateFeedbackByInterviewSuccess: (
			state,
			action: PayloadAction<Feedback>
		) => {
			const { data } = action.payload;
			state.feedback = data;
			state.loading = false;
			state.error = null;
			state.editSuccess = true;
		},
		// Update interview failure
		updateFeedbackByInterviewFailure: (
			state,
			action: PayloadAction<string>
		) => {
			state.loading = false;
			state.editSuccess = false;
			state.error = action.payload;
		},
		resetInterviewEditState: (state) => {
			state.editSuccess = false;
		},
		// Generate link interview request
		generateLinkRequest: (state, action: PayloadAction<InterviewInterface>) => {
			state.loading = true;
			state.error = null;
			state.success = false;
			state.editSuccess = false;
			state.generatedMeetingLink = null;
			state.meetingLinkLoading = true;
		},
		generateLinkSuccess: (
			state,
			action: PayloadAction<{ joinUrl: string }>
		) => {
			state.loading = false;
			state.error = null;
			state.meetingLinkLoading = false;
			state.generatedMeetingLink = action.payload.joinUrl;
		},
		// Generate link interview failure
		generateLinkFailure: (state, action: PayloadAction<string>) => {
			state.loading = false;
			state.error = action.payload;
			state.success = false;
			state.meetingLinkLoading = false;
		},
		// Interview Decision Request
		interviewDecisionRequest: (
			state,
			action: PayloadAction<InterviewDecisionInterface>
		) => {
			state.loading = true;
			state.error = null;
			state.success = false;
			state.selectedInterview = null;
			state.editSuccess = false;
		},
		// Interview Decision success
		interviewDecisionSuccess: (
			state,
			action: PayloadAction<InterviewDecisionInterface>
		) => {
			if (state.interviewDecision) {
				state.interviewDecision = [...state.interviewDecision, action.payload];
			} else {
				state.interviewDecision = [action.payload];
			}
			state.loading = false;
			state.error = null;
			state.success = true;
		},
		// Interview Decision failure
		interviewDecisionFailure: (state, action: PayloadAction<string>) => {
			state.loading = false;
			state.error = action.payload;
			state.success = false;
		},
	},
});

// Export actions for use in components and sagas
export const {
	fetchInterviewRequest,
	fetchInterviewSuccess,
	fetchInterviewFailure,
	fetchInterviewByIdRequest,
	fetchInterviewByIdSuccess,
	fetchInterviewByIdFailure,
	fetchFeedbackByInterviewIdRequest,
	fetchFeedbackByInterviewIdSuccess,
	fetchFeedbackByInterviewIdFailure,
	addFeedbackByInterviewRequest,
	addFeedbackByInterviewSuccess,
	addFeedbackByInterviewFailure,
	updateFeedbackByInterviewRequest,
	updateFeedbackByInterviewSuccess,
	updateFeedbackByInterviewFailure,
	addInterviewRequest,
	addInterviewSuccess,
	addInterviewFailure,
	updateInterviewRequest,
	updateInterviewSuccess,
	updateInterviewFailure,
	searchInterviewRequest,
	searchInterviewSuccess,
	searchInterviewFailure,
	resetInterviewEditState,
	generateLinkRequest,
	generateLinkSuccess,
	generateLinkFailure,
	interviewDecisionRequest,
	interviewDecisionSuccess,
	interviewDecisionFailure,
} = interviewSlice.actions;

export default interviewSlice.reducer;
