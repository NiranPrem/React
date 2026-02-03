/* eslint-disable @typescript-eslint/no-explicit-any */
import { takeLatest, put, call } from "redux-saga/effects";
import api from "../../services/api";
import {
  fetchJobRequestRequest,
  fetchJobRequestSuccess,
  fetchJobRequestFailure,
  fetchJobRequestByIdRequest,
  fetchJobRequestByIdSuccess,
  fetchJobRequestByIdFailure,
  addJobRequestRequest,
  addJobRequestSuccess,
  addJobRequestFailure,
  updateJobRequestRequest,
  updateJobRequestSuccess,
  updateJobRequestFailure,
  deleteJobRequestRequest,
  deleteJobRequestSuccess,
  deleteJobRequestFailure,
  searchJobRequestSuccess,
  searchJobRequestFailure,
  searchJobRequestRequest,
} from "../reducers/jobRequestSlice";
import ToastService from "../../services/toastService";
import { API_URLS } from "../../shared/utils/api-urls";

// Define the payload interface for fetching job Requests
interface FetchJobRequestPayload {
  pageNumber: number;
  pageSize: number;
  searchTerm?: string;
}

// Fetch job Requests with pagination and optional search term
function* fetchJobRequestSaga(action: {
  type: string;
  payload: FetchJobRequestPayload;
}): Generator<any, void, any> {
  try {
    if (!action.payload) {
      throw new Error("Missing payload for fetching job Requests");
    }
    const response = yield call(
      api.get,
      `${API_URLS.JOB_REQUEST}?pageNumber=${action.payload.pageNumber}&pageSize=${action.payload.pageSize}`
    );
    yield put(fetchJobRequestSuccess(response?.data));
  } catch (error: any) {
    const errMsg =
      error?.response?.data?.message ||
      (error instanceof Error ? error.message : "Something went wrong!");
    ToastService.showError(errMsg);
    yield put(fetchJobRequestFailure(errMsg));
  }
}

// Search job Requests with pagination and optional search term
function* searchJobRequestSaga(action: {
  type: string;
  payload: FetchJobRequestPayload;
}): Generator<any, void, any> {
  try {
    if (!action.payload) {
      throw new Error("Missing payload for fetching job Requests");
    }
    const response = yield call(
      api.get,
      `${API_URLS.JOB_REQUEST}?pageNumber=${action.payload.pageNumber}&pageSize=${action.payload.pageSize}&searchTerm=${action.payload.searchTerm}`
    );
    yield put(searchJobRequestSuccess(response?.data));
  } catch (error: any) {
    const errMsg =
      error?.response?.data?.message ||
      (error instanceof Error ? error.message : "Something went wrong!");
    ToastService.showError(errMsg);
    yield put(searchJobRequestFailure(errMsg));
  }
}

// Fetch job Request by ID
function* fetchJobRequestByIdSaga(
  action: ReturnType<typeof fetchJobRequestByIdRequest>
): Generator<any, void, any> {
  try {
    const { id } = action.payload;
    const response = yield call(api.get, `${API_URLS.JOB_REQUEST}/${id}`);
    yield put(fetchJobRequestByIdSuccess(response.data));
  } catch (error: any) {
    const errMsg =
      error?.response?.data?.message ||
      (error instanceof Error ? error.message : "Something went wrong!");
    ToastService.showError(errMsg);
    yield put(fetchJobRequestByIdFailure(errMsg));
  }
}

// Add new job Request
function* addJobRequestSaga(
  action: ReturnType<typeof addJobRequestRequest>
): Generator<any, void, any> {
  try {
    const jobRequest = action.payload;
    const response = yield call(
      api.post,
      `${API_URLS.JOB_REQUEST}`,
      jobRequest
    );
    ToastService.showSuccess("Job Request added successfully!");
    yield put(addJobRequestSuccess(response.data));
  } catch (error: any) {
    const errMsg =
      error?.response?.data?.message ||
      (error instanceof Error ? error.message : "Something went wrong!");
    ToastService.showError(errMsg);
    yield put(addJobRequestFailure(errMsg));
  }
}

// Update existing job Request
function* updateJobRequestSaga(
  action: ReturnType<typeof updateJobRequestRequest>
): Generator<any, void, any> {
  try {
    const { payload } = action;
    const response = yield call(api.put, `${API_URLS.JOB_REQUEST}`, payload);
    ToastService.showSuccess("Job Request updated successfully!");
    yield put(updateJobRequestSuccess(response.data));
  } catch (error: any) {
    const errMsg =
      error?.response?.data?.message ||
      (error instanceof Error ? error.message : "Something went wrong!");
    ToastService.showError(errMsg);
    yield put(updateJobRequestFailure(errMsg));
  }
}

// Delete job Request
function* deleteJobRequestSaga(
  action: ReturnType<typeof deleteJobRequestRequest>
): Generator<any, void, any> {
  try {
    const { id } = action.payload;
    yield call(api.delete, `${API_URLS.JOB_REQUEST}/${id}`);
    ToastService.showSuccess("Job Request deleted successfully!");
    yield put(deleteJobRequestSuccess(id));
  } catch (error: any) {
    const errMsg =
      error?.response?.data?.message ||
      (error instanceof Error ? error.message : "Something went wrong!");
    ToastService.showError(errMsg);
    yield put(deleteJobRequestFailure(errMsg));
  }
}

// Watch for job Request actions
export function* watchJobRequest() {
  yield takeLatest(fetchJobRequestRequest.type, fetchJobRequestSaga);
  yield takeLatest(fetchJobRequestByIdRequest.type, fetchJobRequestByIdSaga);
  yield takeLatest(addJobRequestRequest.type, addJobRequestSaga);
  yield takeLatest(updateJobRequestRequest.type, updateJobRequestSaga);
  yield takeLatest(deleteJobRequestRequest.type, deleteJobRequestSaga);
  yield takeLatest(searchJobRequestRequest.type, searchJobRequestSaga);
}
