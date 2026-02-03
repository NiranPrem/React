/* eslint-disable @typescript-eslint/no-explicit-any */
import { takeLatest, put, call } from "redux-saga/effects";
import api from "../../services/api";
import ToastService from "../../services/toastService";
import { API_URLS } from "../../shared/utils/api-urls";
import {
	fetchReferralResumeFailure,
	fetchReferralResumeRequest,
	fetchReferralResumeSuccess,
	updateReferralResumeFailure,
	updateReferralResumeRequest,
	updateReferralResumeSuccess,
} from "../reducers/referralResumeSlice";

// Define the payload type for fetching Resume
interface FetchResumePayload {
	pageNumber: number;
	pageSize: number;
	referralId: string;
	documentId?: number;
}

// Fetch Resume saga
function* fetchReferralResumeSaga(action: {
	type: string;
	payload: FetchResumePayload;
}): Generator<any, void, any> {
	try {
		if (!action.payload) {
			throw new Error("Missing payload for fetching Resume");
		}
		const response = yield call(
			api.get,
			`${API_URLS.DOCUMENTS}/referral/${action.payload.referralId}?typeId=7&pageNumber=${action.payload.pageNumber}&pageSize=${action.payload.pageSize}`
		);
		yield put(fetchReferralResumeSuccess(response?.data));
	} catch (error: any) {
    const data = error?.response?.data;
    const errMsg =
      (typeof data === "string" ? data : data?.message || data?.title || data?.detail) ||
      (error instanceof Error ? error.message : "Something went wrong!");
		ToastService.showError(errMsg);
		yield put(fetchReferralResumeFailure(errMsg));
	}
}

// Update existing job opening
function* updateReferralResumeSaga(
	action: ReturnType<typeof updateReferralResumeRequest>
): Generator<any, void, any> {
	try {
		const { payload } = action;
		const response = yield call(api.put, `${API_URLS.REFERRAL}`, payload);
		ToastService.showSuccess("Resume uploaded successfully!");
		yield put(updateReferralResumeSuccess(response.data));
	} catch (error: any) {
    const data = error?.response?.data;
    const errMsg =
      (typeof data === "string" ? data : data?.message || data?.title || data?.detail) ||
      (error instanceof Error ? error.message : "Something went wrong!");
		ToastService.showError(errMsg);
		yield put(updateReferralResumeFailure(errMsg));
	}
}

export function* watchReferralResume() {
	yield takeLatest(fetchReferralResumeRequest.type, fetchReferralResumeSaga);
	yield takeLatest(updateReferralResumeRequest.type, updateReferralResumeSaga);
}
