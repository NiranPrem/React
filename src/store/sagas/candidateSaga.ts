/* eslint-disable @typescript-eslint/no-explicit-any */
import { takeLatest, put, call } from "redux-saga/effects";
import api from "../../services/api";
import {
  fetchCandidateRequest,
  fetchCandidateSuccess,
  fetchCandidateFailure,
  fetchCandidateByIdRequest,
  fetchCandidateByIdSuccess,
  fetchCandidateByIdFailure,
  addCandidateRequest,
  addCandidateSuccess,
  addCandidateFailure,
  updateCandidateRequest,
  updateCandidateSuccess,
  updateCandidateFailure,
  deleteCandidateRequest,
  deleteCandidateSuccess,
  deleteCandidateFailure,
  searchCandidateSuccess,
  searchCandidateFailure,
  searchCandidateRequest,
  fetchCandidateByJobOpeningSuccess,
  fetchCandidateByJobOpeningFailure,
  fetchCandidateByJobOpeningRequest,
  checkDuplicateCandidateRequest,
  checkDuplicateCandidateSuccess,
  checkDuplicateCandidateFailure,
} from "../reducers/candidateSlice";
import ToastService from "../../services/toastService";
import { API_URLS } from "../../shared/utils/api-urls";

// Define the payload interface for fetching candidates
interface FetchCandidatePayload {
  pageNumber: number;
  pageSize: number;
  searchTerm?: string;
  jobOpportunityId?: number;
}

// Fetch candidates with pagination
function* fetchCandidateSaga(action: {
  type: string;
  payload: FetchCandidatePayload;
}): Generator<any, void, any> {
  try {
    if (!action.payload) {
      throw new Error("Missing payload for fetching candidates");
    }
    const response = yield call(
      api.get,
      `${API_URLS.CANDIDATES}?pageNumber=${action.payload.pageNumber}&pageSize=${action.payload.pageSize}`
    );
    yield put(fetchCandidateSuccess(response?.data));
  } catch (error: any) {
    const errMsg =
      error?.response?.data?.message ||
      (error instanceof Error ? error.message : "Something went wrong!");
    ToastService.showError(errMsg);
    yield put(fetchCandidateFailure(errMsg));
  }
}

// Fetch candidates with pagination
function* fetchCandidateByJobOpeningSaga(action: {
  type: string;
  payload: FetchCandidatePayload;
}): Generator<any, void, any> {
  try {
    if (!action.payload) {
      throw new Error("Missing payload for fetching candidates");
    }
    const response = yield call(
      api.get,
      `${API_URLS.CANDIDATES}?pageNumber=${action.payload.pageNumber}&pageSize=${action.payload.pageSize}&jobOpportunityId=${action.payload.jobOpportunityId}`
    );
    yield put(fetchCandidateByJobOpeningSuccess(response?.data));
  } catch (error: any) {
    const errMsg =
      error?.response?.data?.message ||
      (error instanceof Error ? error.message : "Something went wrong!");
    ToastService.showError(errMsg);
    yield put(fetchCandidateByJobOpeningFailure(errMsg));
  }
}

// Search candidates by term
function* searchCandidateSaga(action: {
  type: string;
  payload: FetchCandidatePayload;
}): Generator<any, void, any> {
  try {
    if (!action.payload) {
      throw new Error("Missing payload for fetching candidates");
    }
    const response = yield call(
      api.get,
      `${API_URLS.CANDIDATES}?pageNumber=${action.payload.pageNumber}&pageSize=${action.payload.pageSize}&searchTerm=${action.payload.searchTerm}`
    );
    yield put(searchCandidateSuccess(response?.data));
  } catch (error: any) {
    const errMsg =
      error?.response?.data?.message ||
      (error instanceof Error ? error.message : "Something went wrong!");
    ToastService.showError(errMsg);
    yield put(searchCandidateFailure(errMsg));
  }
}

// Fetch candidate by ID
function* fetchCandidateByIdSaga(
  action: ReturnType<typeof fetchCandidateByIdRequest>
): Generator<any, void, any> {
  try {
    const { candidateId } = action.payload;
    const response = yield call(
      api.get,
      `${API_URLS.CANDIDATES}/${candidateId}`
    );
    yield put(fetchCandidateByIdSuccess(response.data));
  } catch (error: any) {
    const errMsg =
      error?.response?.data?.message ||
      (error instanceof Error ? error.message : "Something went wrong!");
    ToastService.showError(errMsg);
    yield put(fetchCandidateByIdFailure(errMsg));
  }
}

// Add new candidate
function* addCandidateSaga(
  action: ReturnType<typeof addCandidateRequest>
): Generator<any, void, any> {
  try {
    const candidate = action.payload;
    const response = yield call(api.post, `${API_URLS.CANDIDATES}`, candidate);
    ToastService.showSuccess("Candidate added successfully!");
    yield put(addCandidateSuccess(response.data));
  } catch (error: any) {
    const errMsg =
      error?.response?.data?.message ||
      (error instanceof Error ? error.message : "Something went wrong!");
    ToastService.showError(errMsg);
    yield put(addCandidateFailure(errMsg));
  }
}

// Update existing candidate
function* updateCandidateSaga(
  action: ReturnType<typeof updateCandidateRequest>
): Generator<any, void, any> {
  try {
    const { payload } = action;
    const response = yield call(api.put, `${API_URLS.CANDIDATES}`, payload);
    ToastService.showSuccess("Candidate updated successfully!");
    yield put(updateCandidateSuccess(response.data));

  } catch (error: any) {
    const errMsg =
      error?.response?.data?.message ||
      (error instanceof Error ? error.message : "Something went wrong!");
    ToastService.showError(errMsg);
    yield put(updateCandidateFailure(errMsg));
  }
}

// Delete candidate
function* deleteCandidateSaga(
  action: ReturnType<typeof deleteCandidateRequest>
): Generator<any, void, any> {
  try {
    const { candidateId } = action.payload;
    yield call(api.delete, `${API_URLS.CANDIDATES}/${candidateId}`);
    ToastService.showSuccess("Candidate deleted successfully!");
    yield put(deleteCandidateSuccess(candidateId));
  } catch (error: any) {
    const errMsg =
      error?.response?.data?.message ||
      (error instanceof Error ? error.message : "Something went wrong!");
    ToastService.showError(errMsg);
    yield put(deleteCandidateFailure(errMsg));
  }
}

// Check duplicate candidate
function* checkDuplicateCandidateSaga(
  action: ReturnType<typeof checkDuplicateCandidateRequest>
): Generator<any, void, any> {
  try {
    const { jobOpportunityId, email, mobile } = action.payload;
    const response = yield call(
      api.get,
      `${API_URLS.CANDIDATES}/check-duplicate?jobOpportunityId=${jobOpportunityId}&email=${email}&mobile=${mobile}`
    );
    yield put(checkDuplicateCandidateSuccess(response.data));
  } catch (error: any) {
    const errMsg =
      error?.response?.data?.message ||
      (error instanceof Error ? error.message : "Something went wrong!");
    ToastService.showError(errMsg);
    yield put(checkDuplicateCandidateFailure(errMsg));
  }
}

// Watch for candidate actions
export function* watchCandidate() {
  yield takeLatest(fetchCandidateRequest.type, fetchCandidateSaga);
  yield takeLatest(
    fetchCandidateByJobOpeningRequest.type,
    fetchCandidateByJobOpeningSaga
  );
  yield takeLatest(fetchCandidateByIdRequest.type, fetchCandidateByIdSaga);
  yield takeLatest(addCandidateRequest.type, addCandidateSaga);
  yield takeLatest(updateCandidateRequest.type, updateCandidateSaga);
  yield takeLatest(deleteCandidateRequest.type, deleteCandidateSaga);
  yield takeLatest(searchCandidateRequest.type, searchCandidateSaga);
  yield takeLatest(
    checkDuplicateCandidateRequest.type,
    checkDuplicateCandidateSaga
  );
}
