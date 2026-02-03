/* eslint-disable @typescript-eslint/no-explicit-any */
import { takeLatest, put, call } from "redux-saga/effects";
import api from "../../services/api";
import ToastService from "../../services/toastService";
import { API_URLS } from "../../shared/utils/api-urls";
import {
  fetchJobOpeningHistoryFailure,
  fetchJobOpeningHistoryRequest,
  fetchJobOpeningHistorySuccess,
} from "../reducers/jobOpeningHistorySlice";

// Define the payload type for fetching job opening history
interface FetchHistoryPayload {
  id: number;
}

// Fetch all history
function* fetchJobOpeningHistorySaga(action: {
  type: string;
  payload: FetchHistoryPayload;
}): Generator<any, void, any> {
  try {
    if (!action.payload) {
      throw new Error("Missing payload for fetching history");
    }
    const response = yield call(
      api.get,
      `${API_URLS.JOB_OPENING}/${action.payload.id}/activities`
    );
    yield put(fetchJobOpeningHistorySuccess(response?.data));
  } catch (error: any) {
    const errMsg =
      error?.response?.data?.message ||
      (error instanceof Error ? error.message : "Something went wrong!");
    ToastService.showError(errMsg);
    yield put(fetchJobOpeningHistoryFailure(errMsg));
  }
}

// Watch for job opening actions
export function* watchJobOpeningHistory() {
  yield takeLatest(
    fetchJobOpeningHistoryRequest.type,
    fetchJobOpeningHistorySaga
  );
}
