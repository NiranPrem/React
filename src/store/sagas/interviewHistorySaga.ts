/* eslint-disable @typescript-eslint/no-explicit-any */
import { takeLatest, put, call } from "redux-saga/effects";
import api from "../../services/api";
import ToastService from "../../services/toastService";
import { API_URLS } from "../../shared/utils/api-urls";
import {
  fetchInterviewHistoryFailure,
  fetchInterviewHistoryRequest,
  fetchInterviewHistorySuccess,
} from "../reducers/interviewHistorySlice";

// Define the payload type for fetching INTERVIEW history
interface FetchHistoryPayload {
  id: number;
}

// Fetch all history
function* fetchInterviewHistorySaga(action: {
  type: string;
  payload: FetchHistoryPayload;
}): Generator<any, void, any> {
  try {
    if (!action.payload) {
      throw new Error("Missing payload for fetching history");
    }
    const response = yield call(
      api.get,
      `${API_URLS.INTERVIEWS}/activities?interviewId=${action.payload.id}`,
    );
    yield put(fetchInterviewHistorySuccess(response?.data));
  } catch (error: any) {
    const errMsg =
      error?.response?.data?.message ||
      (error instanceof Error ? error.message : "Something went wrong!");
    ToastService.showError(errMsg);
    yield put(fetchInterviewHistoryFailure(errMsg));
  }
}

// Watch for interview actions
export function* watchInterviewHistory() {
  yield takeLatest(
    fetchInterviewHistoryRequest.type,
    fetchInterviewHistorySaga,
  );
}
