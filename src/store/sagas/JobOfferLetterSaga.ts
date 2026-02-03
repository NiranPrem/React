/* eslint-disable @typescript-eslint/no-explicit-any */
import { takeLatest, put, call } from "redux-saga/effects";
import api from "../../services/api";
import ToastService from "../../services/toastService";
import { API_URLS } from "../../shared/utils/api-urls";
import {
	addJobOfferLetterFailure,
	addJobOfferLetterRequest,
	addJobOfferLetterSuccess,
	fetchJobOfferLetterFailure,
	fetchJobOfferLetterPreviewByIdFailure,
	fetchJobOfferLetterPreviewByIdRequest,
	fetchJobOfferLetterPreviewByIdSuccess,
	fetchJobOfferLetterRequest,
	fetchJobOfferLetterSuccess,
} from "../reducers/jobOfferLetterSlice";

// Define the payload interface for fetching job offers
interface FetchJobOfferLetterPayload {
	pageNumber: number;
	pageSize: number;
	searchTerm?: string;
	jobOpportunityId?: number;
}

// Fetch job offer letter with pagination and optional search term
function* fetchJobOfferLetterSaga(action: {
	type: string;
	payload: FetchJobOfferLetterPayload;
}): Generator<any, void, any> {
	try {
		if (!action.payload) {
			throw new Error("Missing payload for fetching job openings");
		}
		const response = yield call(
			api.get,
			`${API_URLS.JOB_OFFER}?pageNumber=${action.payload.pageNumber}&pageSize=${action.payload.pageSize}&jobOpportunityId=${action.payload.jobOpportunityId}`
		);
		yield put(fetchJobOfferLetterSuccess(response?.data));
	} catch (error: any) {
		const errMsg =
			error?.response?.data?.message ||
			(error instanceof Error ? error.message : "Something went wrong!");
		ToastService.showError(errMsg);
		yield put(fetchJobOfferLetterFailure(errMsg));
	}
}
// Fetch job offer letter by ID
function* fetchJobOfferLetterPreviewByIdSaga(
	action: ReturnType<typeof fetchJobOfferLetterPreviewByIdRequest>
): Generator<any, void, any> {
	try {
		const { candidateId } = action.payload;
		const response = yield call(
			api.get,
			`${API_URLS.JOB_OFFER}/candidate/${candidateId}/preview`
		);
		yield put(fetchJobOfferLetterPreviewByIdSuccess(response.data));
	} catch (error: any) {
		const errMsg =
			error?.response?.data?.message ||
			(error instanceof Error ? error.message : "Something went wrong!");
		ToastService.showError(errMsg);
		yield put(fetchJobOfferLetterPreviewByIdFailure(errMsg));
	}
}

// Add new job offer letter
function* addJobOfferLetterSaga(
	action: ReturnType<typeof addJobOfferLetterRequest>
): Generator<any, void, any> {
	try {
		if (!action.payload || !action.payload.candidateId) {
			throw new Error("Invalid offer letter payload");
		}

		const response = yield call(api.post, API_URLS.JOB_OFFER, action.payload);

		yield put(addJobOfferLetterSuccess(response.data));
		ToastService.showSuccess("Offer letter initiated successfully!");

		yield put(
			fetchJobOfferLetterRequest({
				pageNumber: 1,
				pageSize: 10,
				jobOpportunityId: action.payload.jobOpportunityId!,
			})
		);
	} catch (error) {
		yield put(addJobOfferLetterFailure("Something went wrong!"));
	}
}

// Watch for job offer letter actions
export function* watchJobOfferLetter() {
	yield takeLatest(fetchJobOfferLetterRequest.type, fetchJobOfferLetterSaga);
	yield takeLatest(
		fetchJobOfferLetterPreviewByIdRequest.type,
		fetchJobOfferLetterPreviewByIdSaga
	);
	yield takeLatest(addJobOfferLetterRequest.type, addJobOfferLetterSaga);
}
