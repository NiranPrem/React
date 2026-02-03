/* eslint-disable @typescript-eslint/no-explicit-any */
import { takeLatest, put, call } from "redux-saga/effects";
import api from "../../services/api";
import {
	fetchInterviewRequest,
	fetchInterviewSuccess,
	fetchInterviewFailure,
	fetchInterviewByIdRequest,
	fetchInterviewByIdSuccess,
	fetchInterviewByIdFailure,
	addInterviewRequest,
	addInterviewSuccess,
	addInterviewFailure,
	updateInterviewRequest,
	updateInterviewSuccess,
	updateInterviewFailure,
	searchInterviewSuccess,
	searchInterviewFailure,
	searchInterviewRequest,
	fetchFeedbackByInterviewIdSuccess,
	fetchFeedbackByInterviewIdFailure,
	fetchFeedbackByInterviewIdRequest,
	addFeedbackByInterviewRequest,
	addFeedbackByInterviewSuccess,
	addFeedbackByInterviewFailure,
	updateFeedbackByInterviewRequest,
	updateFeedbackByInterviewSuccess,
	updateFeedbackByInterviewFailure,
	generateLinkRequest,
	generateLinkSuccess,
	generateLinkFailure,
	interviewDecisionRequest,
	interviewDecisionSuccess,
	interviewDecisionFailure,
} from "../reducers/interviewSlice";
import ToastService from "../../services/toastService";
import { API_URLS } from "../../shared/utils/api-urls";

// Define the payload interface for fetching interview
interface FetchInterviewPayload {
	pageNumber: number;
	pageSize: number;
	searchTerm?: string;
	jobOpportunityId?: number;
	candidateId?: number;
}

// Fetch interview with pagination and optional search term
function* fetchInterviewSaga(action: {
	type: string;
	payload: FetchInterviewPayload;
}): Generator<any, void, any> {
	try {
		if (!action.payload) {
			throw new Error("Missing payload for fetching interview");
		}
		const response = yield call(
			api.get,
			`${API_URLS.INTERVIEWS}?pageNumber=${action.payload.pageNumber}&pageSize=${action.payload.pageSize}&jobOpportunityId=${action.payload.jobOpportunityId}&candidateId=${action.payload.candidateId}`
		);
		yield put(fetchInterviewSuccess(response?.data));
	} catch (error: any) {
		const errMsg =
			error?.response?.data?.message ||
			(error instanceof Error ? error.message : "Something went wrong!");
		ToastService.showError(errMsg);
		yield put(fetchInterviewFailure(errMsg));
	}
}

// Search interview with pagination and optional search term
function* searchInterviewSaga(action: {
	type: string;
	payload: FetchInterviewPayload;
}): Generator<any, void, any> {
	try {
		if (!action.payload) {
			throw new Error("Missing payload for fetching interview");
		}
		const response = yield call(
			api.get,
			`${API_URLS.INTERVIEWS}?pageNumber=${action.payload.pageNumber}&pageSize=${action.payload.pageSize}&jobOpportunityId=${action.payload.jobOpportunityId}&candidateId=${action.payload.candidateId}&searchTerm=${action.payload.searchTerm}`
		);
		yield put(searchInterviewSuccess(response?.data));
	} catch (error: any) {
		const errMsg =
			error?.response?.data?.message ||
			(error instanceof Error ? error.message : "Something went wrong!");
		ToastService.showError(errMsg);
		yield put(searchInterviewFailure(errMsg));
	}
}

// Fetch interview by ID
function* fetchInterviewByIdSaga(
	action: ReturnType<typeof fetchInterviewByIdRequest>
): Generator<any, void, any> {
	try {
		const { interviewId } = action.payload;
		const response = yield call(
			api.get,
			`${API_URLS.INTERVIEWS}/${interviewId}`
		);
		yield put(fetchInterviewByIdSuccess(response.data));
	} catch (error: any) {
		const errMsg =
			error?.response?.data?.message ||
			(error instanceof Error ? error.message : "Something went wrong!");
		ToastService.showError(errMsg);
		yield put(fetchInterviewByIdFailure(errMsg));
	}
}

// Add new interview
function* addInterviewSaga(
	action: ReturnType<typeof addInterviewRequest>
): Generator<any, void, any> {
	try {
		const interview = action.payload;
		const response = yield call(api.post, `${API_URLS.INTERVIEWS}`, interview);
		ToastService.showSuccess("Interview added successfully!");
		yield put(addInterviewSuccess(response.data));
	} catch (error: any) {
		const errMsg =
			error?.response?.data?.message ||
			(error instanceof Error ? error.message : "Something went wrong!");
		ToastService.showError(errMsg);
		yield put(addInterviewFailure(errMsg));
	}
}

// Update existing interview
function* updateInterviewSaga(
	action: ReturnType<typeof updateInterviewRequest>
): Generator<any, void, any> {
	try {
		const { payload } = action;
		const response = yield call(
			api.put,
			`${API_URLS.INTERVIEWS}/${payload.interviewId}`,
			payload
		);
		ToastService.showSuccess("Interview updated successfully!");
		yield put(updateInterviewSuccess(response.data));
	} catch (error: any) {
		const errMsg =
			error?.response?.data?.message ||
			(error instanceof Error ? error.message : "Something went wrong!");
		ToastService.showError(errMsg);
		yield put(updateInterviewFailure(errMsg));
	}
}

// Fetch feedback by interview ID
function* fetchFeedbackByInterviewIdSaga(
	action: ReturnType<typeof fetchInterviewByIdRequest>
): Generator<any, void, any> {
	try {
		const { interviewId } = action.payload;
		const response = yield call(
			api.get,
			`${API_URLS.INTERVIEWS}/feedback?id=${interviewId}`
		);
		yield put(fetchFeedbackByInterviewIdSuccess(response.data));
	} catch (error: any) {
		const errMsg =
			error?.response?.data?.message ||
			(error instanceof Error ? error.message : "Something went wrong!");
		ToastService.showError(errMsg);
		yield put(fetchFeedbackByInterviewIdFailure(errMsg));
	}
}

// Add new feedback
function* addFeedbackByInterviewSaga(
	action: ReturnType<typeof addFeedbackByInterviewRequest>
): Generator<any, void, any> {
	try {
		const interview = action.payload;
		const response = yield call(
			api.post,
			`${API_URLS.INTERVIEWS}/feedback`,
			interview
		);
		ToastService.showSuccess("Feedback added successfully!");
		yield put(addFeedbackByInterviewSuccess(response.data));
	} catch (error: any) {
		const errMsg =
			error?.response?.data?.message ||
			(error instanceof Error ? error.message : "Something went wrong!");
		ToastService.showError(errMsg);
		yield put(addFeedbackByInterviewFailure(errMsg));
	}
}

// Update existing feedback
function* updateFeedbackByInterviewSaga(
	action: ReturnType<typeof updateFeedbackByInterviewRequest>
): Generator<any, void, any> {
	try {
		const { payload } = action;
		const response = yield call(
			api.put,
			`${API_URLS.INTERVIEWS}/feedback`,
			payload
		);
		ToastService.showSuccess("Feedback updated successfully!");
		yield put(updateFeedbackByInterviewSuccess(response.data));
	} catch (error: any) {
		const errMsg =
			error?.response?.data?.message ||
			(error instanceof Error ? error.message : "Something went wrong!");
		ToastService.showError(errMsg);
		yield put(updateFeedbackByInterviewFailure(errMsg));
	}
}

// Generate link interview
function* generateInterviewLinkSaga(
	action: ReturnType<typeof generateLinkRequest>
): Generator<any, void, any> {
	try {
		const interview = action.payload;
		const response = yield call(
			api.post,
			`${API_URLS.INTERVIEWS}/generate-meeting`,
			interview
		);
		yield put(generateLinkSuccess(response.data));
	} catch (error: any) {
		const errMsg =
			error?.response?.data?.message ||
			(error instanceof Error ? error.message : "Something went wrong!");
		ToastService.showError(errMsg);
		yield put(generateLinkFailure(errMsg));
	}
}

function* sendInterviewDecisionEmailSaga(
	action: ReturnType<typeof interviewDecisionRequest>
): Generator<any, void, any> {
	try {
		const { interviewId } = action.payload;
		const response = yield call(
			api.post,
			`${API_URLS.INTERVIEWS}/${interviewId}/decision`,
			action.payload
		);
		ToastService.showSuccess("Send interview decision successfully!");
		yield put(interviewDecisionSuccess(response.data));
	} catch (error: any) {
		const errMsg =
			error?.response?.data?.message ||
			(error instanceof Error ? error.message : "Something went wrong!");
		ToastService.showError(errMsg);
		yield put(interviewDecisionFailure(errMsg));
	}
}

// Watch for interview actions
export function* watchInterview() {
	yield takeLatest(fetchInterviewRequest.type, fetchInterviewSaga);
	yield takeLatest(fetchInterviewByIdRequest.type, fetchInterviewByIdSaga);
	yield takeLatest(addInterviewRequest.type, addInterviewSaga);
	yield takeLatest(updateInterviewRequest.type, updateInterviewSaga);
	yield takeLatest(searchInterviewRequest.type, searchInterviewSaga);
	yield takeLatest(
		fetchFeedbackByInterviewIdRequest.type,
		fetchFeedbackByInterviewIdSaga
	);
	yield takeLatest(
		addFeedbackByInterviewRequest.type,
		addFeedbackByInterviewSaga
	);
	yield takeLatest(
		updateFeedbackByInterviewRequest.type,
		updateFeedbackByInterviewSaga
	);
	yield takeLatest(generateLinkRequest.type, generateInterviewLinkSaga);
	yield takeLatest(
		interviewDecisionRequest.type,
		sendInterviewDecisionEmailSaga
	);
}
