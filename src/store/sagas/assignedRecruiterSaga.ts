/* eslint-disable @typescript-eslint/no-explicit-any */
import { takeLatest, put, call } from "redux-saga/effects";
import api from "../../services/api";
import ToastService from "../../services/toastService";
import { API_URLS } from "../../shared/utils/api-urls";
import {
  fetchAssignedRecruitersFailure,
  fetchAssignedRecruitersRequest,
  fetchAssignedRecruitersSuccess,
} from "../reducers/assignedRecruiterSlice";

/**
 * Saga to handle fetching assigned recruiters.
 * It listens for the fetchAssignedRecruitersRequest action,
 * calls the API to get the data, and dispatches success or failure actions.
 */
function* fetchAssignedRecruiter(): Generator<any, void, any> {
  try {
    const response = yield call(api.get, `${API_URLS.USERS_BY_ROLE}`);
    yield put(fetchAssignedRecruitersSuccess(response?.data));
  } catch (error: any) {
    const errMsg =
      error?.response?.data?.message ||
      (error instanceof Error ? error.message : "Something went wrong!");
    ToastService.showError(errMsg);
    yield put(fetchAssignedRecruitersFailure(errMsg));
  }
}

export function* watchAssignedRecruiter() {
  yield takeLatest(fetchAssignedRecruitersRequest.type, fetchAssignedRecruiter);
}
