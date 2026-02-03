/* eslint-disable @typescript-eslint/no-explicit-any */
import { takeLatest, put, call } from "redux-saga/effects";
import api from "../../services/api";

import ToastService from "../../services/toastService";
import { API_URLS } from "../../shared/utils/api-urls";
import {
  deleteInterviewDocumentFailure,
  deleteInterviewDocumentRequest,
  deleteInterviewDocumentSuccess,
  fetchInterviewDocumentsFailure,
  fetchInterviewDocumentsRequest,
  fetchInterviewDocumentsSuccess,
  updateInterviewDocumentFailure,
  updateInterviewDocumentRequest,
  updateInterviewDocumentSuccess,
} from "../reducers/interviewDocumentSlice";

// Define the payload type for fetching documents
interface FetchDocumentPayload {
  pageNumber: number;
  pageSize: number;
  interviewId: string;
  documentId?: number;
}
// Fetch all documents
function* fetchInterviewDocumentsSaga(action: {
  type: string;
  payload: FetchDocumentPayload;
}): Generator<any, void, any> {
  try {
    if (!action.payload) {
      throw new Error("Missing payload for fetching documents");
    }
    const response = yield call(
      api.get,
      `${API_URLS.DOCUMENTS}/interview/${action.payload.interviewId}?pageNumber=${action.payload.pageNumber}&pageSize=${action.payload.pageSize}`
    );
    yield put(fetchInterviewDocumentsSuccess(response?.data));
  } catch (error: any) {
    const errMsg =
      error?.response?.data?.message ||
      (error instanceof Error ? error.message : "Something went wrong!");
    ToastService.showError(errMsg);
    yield put(fetchInterviewDocumentsFailure(errMsg));
  }
}

// Delete document saga
function* deleteInterviewDocumentSaga(
  action: ReturnType<typeof deleteInterviewDocumentRequest>
): Generator<any, void, any> {
  try {
    const { documentFileId } = action.payload;
    yield call(api.delete, `${API_URLS.DOCUMENTS}/${documentFileId}`);
    ToastService.showSuccess("Document deleted successfully!");
    yield put(deleteInterviewDocumentSuccess(documentFileId));
  } catch (error: any) {
    const errMsg =
      error?.response?.data?.message ||
      (error instanceof Error ? error.message : "Something went wrong!");
    ToastService.showError(errMsg);
    yield put(deleteInterviewDocumentFailure(errMsg));
  }
}

// Update existing document saga
function* updateInterviewDocumentSaga(
  action: ReturnType<typeof updateInterviewDocumentRequest>
): Generator<any, void, any> {
  try {
    const { payload } = action;
    const response = yield call(
      api.post,
      `${API_URLS.INTERVIEWS}/documents/upload`,
      payload
    );

    ToastService.showSuccess("Document uploaded successfully!");
    yield put(updateInterviewDocumentSuccess(response.data));
  } catch (error: any) {
    const errMsg =
      error?.response?.data?.message ||
      (error instanceof Error ? error.message : "Something went wrong!");
    ToastService.showError(errMsg);
    yield put(updateInterviewDocumentFailure(errMsg));
  }
}

export function* watchInterviewDocument() {
  yield takeLatest(
    fetchInterviewDocumentsRequest.type,
    fetchInterviewDocumentsSaga
  );
  yield takeLatest(
    deleteInterviewDocumentRequest.type,
    deleteInterviewDocumentSaga
  );
  yield takeLatest(
    updateInterviewDocumentRequest.type,
    updateInterviewDocumentSaga
  );
}
