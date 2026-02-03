/* eslint-disable @typescript-eslint/no-explicit-any */
import { takeLatest, put, call } from "redux-saga/effects";
import api from "../../services/api";
import {
  fetchJobOpeningDocumentsRequest,
  fetchJobOpeningDocumentsSuccess,
  fetchJobOpeningDocumentsFailure,
  deleteJobOpeningDocumentRequest,
  deleteJobOpeningDocumentSuccess,
  deleteJobOpeningDocumentFailure,
  updateJobOpeningDocumentRequest,
  updateJobOpeningDocumentSuccess,
  updateJobOpeningDocumentFailure,
} from "../reducers/jobOpeningDocumentSlice";
import ToastService from "../../services/toastService";
import { API_URLS } from "../../shared/utils/api-urls";

// Define the payload type for fetching documents
interface FetchDocumentPayload {
  pageNumber: number;
  pageSize: number;
  jobOpportunityId: string;
  documentId?: number;
}
// Fetch all documents
function* fetchJobOpeningDocumentsSaga(action: {
  type: string;
  payload: FetchDocumentPayload;
}): Generator<any, void, any> {
  try {
    if (!action.payload) {
      throw new Error("Missing payload for fetching documents");
    }
    const response = yield call(
      api.get,
      `${API_URLS.DOCUMENTS}/jobopportunity/${action.payload.jobOpportunityId}?pageNumber=${action.payload.pageNumber}&pageSize=${action.payload.pageSize}`
    );
    yield put(fetchJobOpeningDocumentsSuccess(response?.data));
  } catch (error: any) {
    const errMsg =
      error?.response?.data?.message ||
      (error instanceof Error ? error.message : "Something went wrong!");
    ToastService.showError(errMsg);
    yield put(fetchJobOpeningDocumentsFailure(errMsg));
  }
}

// Delete document saga
function* deleteJobOpeningDocumentSaga(
  action: ReturnType<typeof deleteJobOpeningDocumentRequest>
): Generator<any, void, any> {
  try {
    const { documentFileId } = action.payload;
    yield call(api.delete, `${API_URLS.DOCUMENTS}/${documentFileId}`);
    ToastService.showSuccess("Document deleted successfully!");
    yield put(deleteJobOpeningDocumentSuccess(documentFileId));
  } catch (error: any) {
    const errMsg =
      error?.response?.data?.message ||
      (error instanceof Error ? error.message : "Something went wrong!");
    ToastService.showError(errMsg);
    yield put(deleteJobOpeningDocumentFailure(errMsg));
  }
}

// Update existing job opening
function* updateJobOpeningDocumentSaga(
  action: ReturnType<typeof updateJobOpeningDocumentRequest>
): Generator<any, void, any> {
  try {
    const { payload } = action;
    const response = yield call(api.put, `${API_URLS.JOB_OPENING}`, payload);
    ToastService.showSuccess("Document uploaded successfully!");
    yield put(updateJobOpeningDocumentSuccess(response.data));
  } catch (error: any) {
    const errMsg =
      error?.response?.data?.message ||
      (error instanceof Error ? error.message : "Something went wrong!");
    ToastService.showError(errMsg);
    yield put(updateJobOpeningDocumentFailure(errMsg));
  }
}

export function* watchJobOpeningDocument() {
  yield takeLatest(
    fetchJobOpeningDocumentsRequest.type,
    fetchJobOpeningDocumentsSaga
  );
  yield takeLatest(
    deleteJobOpeningDocumentRequest.type,
    deleteJobOpeningDocumentSaga
  );
  yield takeLatest(
    updateJobOpeningDocumentRequest.type,
    updateJobOpeningDocumentSaga
  );
}
