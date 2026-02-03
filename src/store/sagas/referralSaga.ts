/* eslint-disable @typescript-eslint/no-explicit-any */
import { takeLatest, put, call } from "redux-saga/effects";
import api from "../../services/api";
import {
  fetchReferralRequest,
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
  searchReferralSuccess,
  searchReferralFailure,
  searchReferralRequest,
  fetchReferralSuccess,
} from "../reducers/referralSlice";
import ToastService from "../../services/toastService";
import { API_URLS } from "../../shared/utils/api-urls";

// Define the payload interface for fetching referrals
interface FetchReferralPayload {
  pageNumber: number;
  pageSize: number;
  searchTerm?: string;
}

// Fetch referrals with pagination and optional search term
function* fetchReferralSaga(action: {
  type: string;
  payload: FetchReferralPayload;
}): Generator<any, void, any> {
  try {
    if (!action.payload) {
      throw new Error("Missing payload for fetching referrals data");
    }
    const response = yield call(
      api.get,
      `${API_URLS.REFERRAL}?pageNumber=${action.payload.pageNumber}&pageSize=${action.payload.pageSize}`
    );
    yield put(fetchReferralSuccess(response?.data));
  } catch (error: any) {
    const data = error?.response?.data;
    const errMsg =
      (typeof data === "string" ? data : data?.message || data?.title || data?.detail) ||
      (error instanceof Error ? error.message : "Something went wrong!");
    ToastService.showError(errMsg);
    yield put(fetchReferralFailure(errMsg));
  }
}

// Search referrals with pagination and optional search term
function* searchReferralSaga(action: {
  type: string;
  payload: FetchReferralPayload;
}): Generator<any, void, any> {
  try {
    if (!action.payload) {
      throw new Error("Missing payload for fetching referrals data");
    }
    const response = yield call(
      api.get,
      `${API_URLS.REFERRAL}?pageNumber=${action.payload.pageNumber}&pageSize=${action.payload.pageSize}&searchTerm=${action.payload.searchTerm}`
    );
    yield put(searchReferralSuccess(response?.data));
  } catch (error: any) {
    const data = error?.response?.data;
    const errMsg =
      (typeof data === "string" ? data : data?.message || data?.title || data?.detail) ||
      (error instanceof Error ? error.message : "Something went wrong!");
    ToastService.showError(errMsg);
    yield put(searchReferralFailure(errMsg));
  }
}

// Fetch referrals Request by ID
function* fetchReferralByIdSaga(
  action: ReturnType<typeof fetchReferralByIdRequest>
): Generator<any, void, any> {
  try {
    const { referralId } = action.payload;
    const response = yield call(api.get, `${API_URLS.REFERRAL}/${referralId}`);
    yield put(fetchReferralByIdSuccess(response.data));
  } catch (error: any) {
    const data = error?.response?.data;
    const errMsg =
      (typeof data === "string" ? data : data?.message || data?.title || data?.detail) ||
      (error instanceof Error ? error.message : "Something went wrong!");
    ToastService.showError(errMsg);
    yield put(fetchReferralByIdFailure(errMsg));
  }
}

// Add new referrals Request
function* addReferralSaga(
  action: ReturnType<typeof addReferralRequest>
): Generator<any, void, any> {
  try {
    const referral = action.payload;
    const response = yield call(api.post, `${API_URLS.REFERRAL}`, referral);
    ToastService.showSuccess("Referral added successfully!");
    yield put(addReferralSuccess(response.data));
  } catch (error: any) {
    const data = error?.response?.data;
    const errMsg =
      (typeof data === "string" ? data : data?.message || data?.title || data?.detail) ||
      (error instanceof Error ? error.message : "Something went wrong!");
    ToastService.showError(errMsg);
    yield put(addReferralFailure(errMsg));
  }
}

// Update existing referrals Request
function* updateReferralSaga(
  action: ReturnType<typeof updateReferralRequest>
): Generator<any, void, any> {
  try {
    const { payload } = action;
    const response = yield call(api.put, `${API_URLS.REFERRAL}`, payload);
    ToastService.showSuccess("Referral updated successfully!");
    yield put(updateReferralSuccess(response.data));
  } catch (error: any) {
    const data = error?.response?.data;
    const errMsg =
      (typeof data === "string" ? data : data?.message || data?.title || data?.detail) ||
      (error instanceof Error ? error.message : "Something went wrong!");
    ToastService.showError(errMsg);
    yield put(updateReferralFailure(errMsg));
  }
}

// Delete referrals Request
function* deleteReferralSaga(
  action: ReturnType<typeof deleteReferralRequest>
): Generator<any, void, any> {
  try {
    const { referralId } = action.payload;
    yield call(api.delete, `${API_URLS.REFERRAL}/${referralId}`);
    ToastService.showSuccess("Referral deleted successfully!");
    yield put(deleteReferralSuccess(referralId));
  } catch (error: any) {
    const data = error?.response?.data;
    const errMsg =
      (typeof data === "string" ? data : data?.message || data?.title || data?.detail) ||
      (error instanceof Error ? error.message : "Something went wrong!");
    ToastService.showError(errMsg);
    yield put(deleteReferralFailure(errMsg));
  }
}

// Watch for referrals Request actions
export function* watchReferrals() {
  yield takeLatest(fetchReferralRequest.type, fetchReferralSaga);
  yield takeLatest(fetchReferralByIdRequest.type, fetchReferralByIdSaga);
  yield takeLatest(addReferralRequest.type, addReferralSaga);
  yield takeLatest(updateReferralRequest.type, updateReferralSaga);
  yield takeLatest(deleteReferralRequest.type, deleteReferralSaga);
  yield takeLatest(searchReferralRequest.type, searchReferralSaga);
}
