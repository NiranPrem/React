/* eslint-disable @typescript-eslint/no-explicit-any */
import { takeLatest, put, call } from "redux-saga/effects";
import api from "../../services/api";
import ToastService from "../../services/toastService";
import { API_URLS } from "../../shared/utils/api-urls";
import {
  fetchJobRequestHistoryFailure,
  fetchJobRequestHistoryRequest,
  fetchJobRequestHistorySuccess,
} from "../reducers/jobRequestHistorySlice";

// Define the payload type for fetching job request history
interface FetchHistoryPayload {
  id: number;
}

// Fetch all history
function* fetchJobRequestHistorySaga(action: {
  type: string;
  payload: FetchHistoryPayload;
}): Generator<any, void, any> {
  try {
    if (!action.payload) {
      throw new Error("Missing payload for fetching history");
    }
    const response = yield call(
      api.get,
      `${API_URLS.JOB_REQUEST}/${action.payload.id}/activities`
    );
    yield put(fetchJobRequestHistorySuccess(response?.data));
  } catch (error: any) {
    const errMsg =
      error?.response?.data?.message ||
      (error instanceof Error ? error.message : "Something went wrong!");
    ToastService.showError(errMsg);
    yield put(fetchJobRequestHistoryFailure(errMsg));
  }
}

// Watch for job Request actions
export function* watchJobRequestHistory() {
  yield takeLatest(
    fetchJobRequestHistoryRequest.type,
    fetchJobRequestHistorySaga
  );
}
