/* eslint-disable @typescript-eslint/no-explicit-any */
import { takeLatest, put, call } from "redux-saga/effects";
import api from "../../services/api";
import ToastService from "../../services/toastService";
import { API_URLS } from "../../shared/utils/api-urls";
import {
  fetchReferralHistoryFailure,
  fetchReferralHistoryRequest,
  fetchReferralHistorySuccess,
} from "../reducers/referralHistorySlice";

// Define the payload type for fetching Referral request history
interface FetchHistoryPayload {
  id: number;
}

// Fetch all history
function* fetchReferralHistorySaga(action: {
  type: string;
  payload: FetchHistoryPayload;
}): Generator<any, void, any> {
  try {
    if (!action.payload) {
      throw new Error("Missing payload for fetching history");
    }
    const response = yield call(
      api.get,
      `${API_URLS.REFERRAL}/${action.payload.id}/activities`
    );
    yield put(fetchReferralHistorySuccess(response?.data));
  } catch (error: any) {
    const errMsg =
      error?.response?.data?.message ||
      (error instanceof Error ? error.message : "Something went wrong!");
    ToastService.showError(errMsg);
    yield put(fetchReferralHistoryFailure(errMsg));
  }
}

// Watch for Referral Request actions
export function* watchReferralHistory() {
  yield takeLatest(fetchReferralHistoryRequest.type, fetchReferralHistorySaga);
}
