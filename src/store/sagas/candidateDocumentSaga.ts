/* eslint-disable @typescript-eslint/no-explicit-any */
import { takeLatest, put, call } from "redux-saga/effects";
import api from "../../services/api";
import {
  fetchCandidateDocumentsRequest,
  fetchCandidateDocumentsSuccess,
  fetchCandidateDocumentsFailure,
  deleteCandidateDocumentRequest,
  deleteCandidateDocumentSuccess,
  deleteCandidateDocumentFailure,
  updateCandidateDocumentRequest,
  updateCandidateDocumentSuccess,
  updateCandidateDocumentFailure,
} from "../reducers/candidateDocumentSlice";
import ToastService from "../../services/toastService";
import { API_URLS } from "../../shared/utils/api-urls";

// Define the payload type for fetching documents
interface FetchDocumentPayload {
  pageNumber: number;
  pageSize: number;
  candidateId: string;
  documentId?: number;
}

// Fetch documents saga
function* fetchCandidateDocumentsSaga(action: {
  type: string;
  payload: FetchDocumentPayload;
}): Generator<any, void, any> {
  try {
    if (!action.payload) {
      throw new Error("Missing payload for fetching documents");
    }
    const response = yield call(
      api.get,
      `${API_URLS.DOCUMENTS}/candidate/${action.payload.candidateId}?pageNumber=${action.payload.pageNumber}&pageSize=${action.payload.pageSize}`
    );
    yield put(fetchCandidateDocumentsSuccess(response?.data));
  } catch (error: any) {
    const errMsg =
      error?.response?.data?.message ||
      (error instanceof Error ? error.message : "Something went wrong!");
    ToastService.showError(errMsg);
    yield put(fetchCandidateDocumentsFailure(errMsg));
  }
}

// Delete document saga
function* deleteCandidateDocumentSaga(
  action: ReturnType<typeof deleteCandidateDocumentRequest>
): Generator<any, void, any> {
  try {
    const { documentFileId } = action.payload;
    yield call(api.delete, `${API_URLS.DOCUMENTS}/${documentFileId}`);
    ToastService.showSuccess("Document deleted successfully!");
    yield put(deleteCandidateDocumentSuccess(documentFileId));
  } catch (error: any) {
    const errMsg =
      error?.response?.data?.message ||
      (error instanceof Error ? error.message : "Something went wrong!");
    ToastService.showError(errMsg);
    yield put(deleteCandidateDocumentFailure(errMsg));
  }
}

// Update existing job opening
function* updateCandidateDocumentSaga(
  action: ReturnType<typeof updateCandidateDocumentRequest>
): Generator<any, void, any> {
  try {
    const { payload } = action;
    const response = yield call(api.put, `${API_URLS.CANDIDATES}`, payload);
    ToastService.showSuccess("Document uploaded successfully!");
    yield put(updateCandidateDocumentSuccess(response.data));
  } catch (error: any) {
    const errMsg =
      error?.response?.data?.message ||
      (error instanceof Error ? error.message : "Something went wrong!");
    ToastService.showError(errMsg);
    yield put(updateCandidateDocumentFailure(errMsg));
  }
}

export function* watchCandidateDocument() {
  yield takeLatest(
    fetchCandidateDocumentsRequest.type,
    fetchCandidateDocumentsSaga
  );
  yield takeLatest(
    deleteCandidateDocumentRequest.type,
    deleteCandidateDocumentSaga
  );
  yield takeLatest(
    updateCandidateDocumentRequest.type,
    updateCandidateDocumentSaga
  );
}
