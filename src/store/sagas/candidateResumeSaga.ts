/* eslint-disable @typescript-eslint/no-explicit-any */
import { takeLatest, put, call } from "redux-saga/effects";
import api from "../../services/api";

import ToastService from "../../services/toastService";
import { API_URLS } from "../../shared/utils/api-urls";
import {
	fetchCandidateResumeFailure,
	fetchCandidateResumeRequest,
	fetchCandidateResumeSuccess,
	updateCandidateResumeFailure,
	updateCandidateResumeRequest,
	updateCandidateResumeSuccess,
} from "../reducers/candidateResumeSlice";

// Define the payload type for fetching resumes
interface FetchResumePayload {
	pageNumber: number;
	pageSize: number;
	candidateId: string;
	documentId?: number;
}

// Fetch resume saga
function* fetchCandidateResumeSaga(action: {
	type: string;
	payload: FetchResumePayload;
}): Generator<any, void, any> {
	try {
		if (!action.payload) {
			throw new Error("Missing payload for fetching resumes");
		}
		const response = yield call(
			api.get,
			`${API_URLS.DOCUMENTS}/candidate/${action.payload.candidateId}?typeId=7&pageNumber=${action.payload.pageNumber}&pageSize=${action.payload.pageSize}`
		);
		yield put(fetchCandidateResumeSuccess(response?.data));
	} catch (error: any) {
		const errMsg =
			error?.response?.data?.message ||
			(error instanceof Error ? error.message : "Something went wrong!");
		ToastService.showError(errMsg);
		yield put(fetchCandidateResumeFailure(errMsg));
	}
}

// Update existing job opening
function* updateCandidateResumeSaga(
	action: ReturnType<typeof updateCandidateResumeRequest>
): Generator<any, void, any> {
	try {
		const { payload } = action;
		const response = yield call(api.put, `${API_URLS.CANDIDATES}`, payload);
		ToastService.showSuccess("Resume uploaded successfully!");
		yield put(updateCandidateResumeSuccess(response.data));
	} catch (error: any) {
		const errMsg =
			error?.response?.data?.message ||
			(error instanceof Error ? error.message : "Something went wrong!");
		ToastService.showError(errMsg);
		yield put(updateCandidateResumeFailure(errMsg));
	}
}

export function* watchCandidateResume() {
	yield takeLatest(fetchCandidateResumeRequest.type, fetchCandidateResumeSaga);
	yield takeLatest(
		updateCandidateResumeRequest.type,
		updateCandidateResumeSaga
	);
}
