/* eslint-disable @typescript-eslint/no-explicit-any */
import { takeLatest, put, call } from "redux-saga/effects";
import api from "../../services/api";

import ToastService from "../../services/toastService";
import { API_URLS } from "../../shared/utils/api-urls";
import {
  fetchCandidateHistoryFailure,
  fetchCandidateHistoryRequest,
  fetchCandidateHistorySuccess,
} from "../reducers/candidateHistorySlice";

// Define the payload type for fetching candidate history
interface FetchHistoryPayload {
  id: number;
}

// Fetch candidate history saga
function* fetchCandidateHistorySaga(action: {
  type: string;
  payload: FetchHistoryPayload;
}): Generator<any, void, any> {
  try {
    if (!action.payload) {
      throw new Error("Missing payload for fetching history");
    }
    const response = yield call(
      api.get,
      `${API_URLS.CANDIDATES}/${action.payload.id}/activities`
    );
    yield put(fetchCandidateHistorySuccess(response?.data));
  } catch (error: any) {
    const errMsg =
      error?.response?.data?.message ||
      (error instanceof Error ? error.message : "Something went wrong!");
    ToastService.showError(errMsg);
    yield put(fetchCandidateHistoryFailure(errMsg));
  }
}

// Watch for candidate actions
export function* watchCandidateHistory() {
  yield takeLatest(
    fetchCandidateHistoryRequest.type,
    fetchCandidateHistorySaga
  );
}
