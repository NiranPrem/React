/* eslint-disable @typescript-eslint/no-explicit-any */
import { takeLatest, put, call } from "redux-saga/effects";
import api from "../../services/api";
import ToastService from "../../services/toastService";
import { API_URLS } from "../../shared/utils/api-urls";
import {
	fetchReferralActiveJobOpeningDetailsFailure,
	fetchReferralActiveJobOpeningDetailsRequest,
	fetchReferralActiveJobOpeningDetailsSuccess,
	fetchReferralJobOpeningByIdFailure,
	fetchReferralJobOpeningByIdRequest,
	fetchReferralJobOpeningByIdSuccess,
	fetchReferralJobOpeningFailure,
	fetchReferralJobOpeningRequest,
	fetchReferralJobOpeningSuccess,
	searchReferralJobOpeningFailure,
	searchReferralJobOpeningRequest,
	searchReferralJobOpeningSuccess,
} from "../reducers/referralJobOpeningSlice";

// Define the payload interface for fetching job openings
interface FetchReferralJobOpeningPayload {
	pageNumber: number;
	pageSize: number;
	searchTerm?: string;
}

// Fetch job openings with pagination and optional search term
function* fetchReferralJobOpeningSaga(action: {
	type: string;
	payload: FetchReferralJobOpeningPayload;
}): Generator<any, void, any> {
	try {
		if (!action.payload) {
			throw new Error("Missing payload for fetching job openings");
		}
		const { pageNumber, pageSize, searchTerm } = action.payload;
		let url = `${API_URLS.JOB_OPENING}/activeJobs?isActive=true&pageNumber=${pageNumber}&pageSize=${pageSize}`;
		if (searchTerm) {
			url += `&searchTerm=${searchTerm}`;
		}
		const response = yield call(api.get, url);
		yield put(fetchReferralJobOpeningSuccess(response?.data));
	} catch (error: any) {
		const errMsg =
			error?.response?.data?.message ||
			(error instanceof Error ? error.message : "Something went wrong!");
		ToastService.showError(errMsg);
		yield put(fetchReferralJobOpeningFailure(errMsg));
	}
}

// Fetch all active job openings with pagination and optional search term
function* fetchReferralActiveJobOpeningDetailsSaga(action: {
	type: string;
	payload: FetchReferralJobOpeningPayload;
}): Generator<any, void, any> {
	try {
		if (!action.payload) {
			throw new Error(
				"Missing payload for fetching active job openings details"
			);
		}
		const { pageNumber, pageSize, searchTerm } = action.payload;
		let url = `${API_URLS.JOB_OPENING}/activeJobWithDetails?pageNumber=${pageNumber}&pageSize=${pageSize}`;
		if (searchTerm) {
			url += `&searchTerm=${searchTerm}`;
		}
		const response = yield call(api.get, url);
		yield put(fetchReferralActiveJobOpeningDetailsSuccess(response?.data));
	} catch (error: any) {
		const errMsg =
			error?.response?.data?.message ||
			(error instanceof Error ? error.message : "Something went wrong!");
		ToastService.showError(errMsg);
		yield put(fetchReferralActiveJobOpeningDetailsFailure(errMsg));
	}
}

// Search job openings with pagination and optional search term
function* searchReferralJobOpeningSaga(action: {
	type: string;
	payload: FetchReferralJobOpeningPayload;
}): Generator<any, void, any> {
	try {
		if (!action.payload) {
			throw new Error("Missing payload for fetching job openings");
		}
		const response = yield call(
			api.get,
			`${API_URLS.JOB_OPENING}/activeJobs?isActive=true&pageNumber=${action.payload.pageNumber}&pageSize=${action.payload.pageSize}&searchTerm=${action.payload.searchTerm}`
		);
		yield put(searchReferralJobOpeningSuccess(response?.data));
	} catch (error: any) {
		const errMsg =
			error?.response?.data?.message ||
			(error instanceof Error ? error.message : "Something went wrong!");
		ToastService.showError(errMsg);
		yield put(searchReferralJobOpeningFailure(errMsg));
	}
}

// Fetch job opening by ID
function* fetchReferralJobOpeningByIdSaga(
	action: ReturnType<typeof fetchReferralJobOpeningByIdRequest>
): Generator<any, void, any> {
	try {
		const { openingId } = action.payload;
		const response = yield call(
			api.get,
			`${API_URLS.JOB_OPENING}/${openingId}`
		);
		yield put(fetchReferralJobOpeningByIdSuccess(response.data));
	} catch (error: any) {
		const errMsg =
			error?.response?.data?.message ||
			(error instanceof Error ? error.message : "Something went wrong!");
		ToastService.showError(errMsg);
		yield put(fetchReferralJobOpeningByIdFailure(errMsg));
	}
}

// Watch for job opening actions
export function* watchReferralJobOpening() {
	yield takeLatest(
		fetchReferralJobOpeningRequest.type,
		fetchReferralJobOpeningSaga
	);
	yield takeLatest(
		fetchReferralActiveJobOpeningDetailsRequest.type,
		fetchReferralActiveJobOpeningDetailsSaga
	);
	yield takeLatest(
		fetchReferralJobOpeningByIdRequest.type,
		fetchReferralJobOpeningByIdSaga
	);
	yield takeLatest(
		searchReferralJobOpeningRequest.type,
		searchReferralJobOpeningSaga
	);
}
