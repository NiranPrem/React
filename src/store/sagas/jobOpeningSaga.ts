/* eslint-disable @typescript-eslint/no-explicit-any */
import { takeLatest, put, call } from "redux-saga/effects";
import api from "../../services/api";
import {
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
	searchJobOpeningSuccess,
	searchJobOpeningFailure,
	searchJobOpeningRequest,
} from "../reducers/jobOpeningSlice";
import ToastService from "../../services/toastService";
import { API_URLS } from "../../shared/utils/api-urls";

// Define the payload interface for fetching job openings
interface FetchJobOpeningPayload {
	pageNumber: number;
	pageSize: number;
	searchTerm?: string;
}

// Fetch job openings with pagination and optional search term
function* fetchJobOpeningSaga(action: {
	type: string;
	payload: FetchJobOpeningPayload;
}): Generator<any, void, any> {
	try {
		if (!action.payload) {
			throw new Error("Missing payload for fetching job openings");
		}
		const response = yield call(
			api.get,
			`${API_URLS.JOB_OPENING}?pageNumber=${action.payload.pageNumber}&pageSize=${action.payload.pageSize}`
		);
		yield put(fetchJobOpeningSuccess(response?.data));
	} catch (error: any) {
		const errMsg =
			error?.response?.data?.message ||
			(error instanceof Error ? error.message : "Something went wrong!");
		ToastService.showError(errMsg);
		yield put(fetchJobOpeningFailure(errMsg));
	}
}

// Search job openings with pagination and optional search term
function* searchJobOpeningSaga(action: {
	type: string;
	payload: FetchJobOpeningPayload;
}): Generator<any, void, any> {
	try {
		if (!action.payload) {
			throw new Error("Missing payload for fetching job openings");
		}
		const response = yield call(
			api.get,
			`${API_URLS.JOB_OPENING}?pageNumber=${action.payload.pageNumber}&pageSize=${action.payload.pageSize}&searchTerm=${action.payload.searchTerm}`
		);
		yield put(searchJobOpeningSuccess(response?.data));
	} catch (error: any) {
		const errMsg =
			error?.response?.data?.message ||
			(error instanceof Error ? error.message : "Something went wrong!");
		ToastService.showError(errMsg);
		yield put(searchJobOpeningFailure(errMsg));
	}
}

// Fetch job opening by ID
function* fetchJobOpeningByIdSaga(
	action: ReturnType<typeof fetchJobOpeningByIdRequest>
): Generator<any, void, any> {
	try {
		const { openingId } = action.payload;
		const response = yield call(
			api.get,
			`${API_URLS.JOB_OPENING}/${openingId}`
		);
		yield put(fetchJobOpeningByIdSuccess(response.data));
	} catch (error: any) {
		const errMsg =
			error?.response?.data?.message ||
			(error instanceof Error ? error.message : "Something went wrong!");
		ToastService.showError(errMsg);
		yield put(fetchJobOpeningByIdFailure(errMsg));
	}
}

// Add new job opening
function* addJobOpeningSaga(
	action: ReturnType<typeof addJobOpeningRequest>
): Generator<any, void, any> {
	try {
		const jobOpening = action.payload;
		const response = yield call(
			api.post,
			`${API_URLS.JOB_OPENING}`,
			jobOpening
		);
		ToastService.showSuccess("Job opening added successfully!");
		yield put(addJobOpeningSuccess(response.data));
	} catch (error: any) {
		const errMsg =
			error?.response?.data?.message ||
			(error instanceof Error ? error.message : "Something went wrong!");
		ToastService.showError(errMsg);
		yield put(addJobOpeningFailure(errMsg));
	}
}

// Update existing job opening
function* updateJobOpeningSaga(
	action: ReturnType<typeof updateJobOpeningRequest>
): Generator<any, void, any> {
	try {
		const { payload } = action;
		const response = yield call(api.put, `${API_URLS.JOB_OPENING}`, payload);
		ToastService.showSuccess("Job opening updated successfully!");
		yield put(updateJobOpeningSuccess(response.data));
	} catch (error: any) {
		const errMsg =
			error?.response?.data?.message ||
			(error instanceof Error ? error.message : "Something went wrong!");
		ToastService.showError(errMsg);
		yield put(updateJobOpeningFailure(errMsg));
	}
}

// Update job opening status
function* updateJobOpeningStatusSaga(
	action: ReturnType<typeof updateJobOpeningStatusRequest>
): Generator<any, void, any> {
	try {
		const { jobOpportunityId, statusId } = action.payload;
		const response = yield call(
			api.post,
			`${API_URLS.JOB_OPENING}/${jobOpportunityId}/status-update`,
			statusId
		);
		ToastService.showSuccess("Job opening status updated successfully!");
		yield put(updateJobOpeningStatusSuccess(response.data));
	} catch (error: any) {
		const errMsg =
			error?.response?.data?.message ||
			(error instanceof Error ? error.message : "Something went wrong!");
		ToastService.showError(errMsg);
		yield put(updateJobOpeningStatusFailure(errMsg));
	}
}

// Delete job opening
function* deleteJobOpeningSaga(
	action: ReturnType<typeof deleteJobOpeningRequest>
): Generator<any, void, any> {
	try {
		const { jobOpportunityId } = action.payload;
		yield call(api.delete, `${API_URLS.JOB_OPENING}/${jobOpportunityId}`);
		ToastService.showSuccess("Job opening deleted successfully!");
		yield put(deleteJobOpeningSuccess(jobOpportunityId));
	} catch (error: any) {
		const errMsg =
			error?.response?.data?.message ||
			(error instanceof Error ? error.message : "Something went wrong!");
		ToastService.showError(errMsg);
		yield put(deleteJobOpeningFailure(errMsg));
	}
}

// Watch for job opening actions
export function* watchJobOpening() {
	yield takeLatest(fetchJobOpeningRequest.type, fetchJobOpeningSaga);
	yield takeLatest(fetchJobOpeningByIdRequest.type, fetchJobOpeningByIdSaga);
	yield takeLatest(addJobOpeningRequest.type, addJobOpeningSaga);
	yield takeLatest(updateJobOpeningRequest.type, updateJobOpeningSaga);
	yield takeLatest(
		updateJobOpeningStatusRequest.type,
		updateJobOpeningStatusSaga
	);
	yield takeLatest(deleteJobOpeningRequest.type, deleteJobOpeningSaga);
	yield takeLatest(searchJobOpeningRequest.type, searchJobOpeningSaga);
}
