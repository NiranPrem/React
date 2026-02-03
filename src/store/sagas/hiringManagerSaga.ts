/* eslint-disable @typescript-eslint/no-explicit-any */
import { takeLatest, put, call } from "redux-saga/effects";
import api from "../../services/api";
import ToastService from "../../services/toastService";
import { API_URLS } from "../../shared/utils/api-urls";
import {
  fetchHiringManagersFailure,
  fetchHiringManagersRequest,
  fetchHiringManagersSuccess,
} from "../reducers/hiringManagerSlice";

// Fetch hiring managers saga
function* fetchHiringManager(): Generator<any, void, any> {
  try {
    const response = yield call(
      api.get,
      `${API_URLS.USERS_BY_ROLE_HIRING_MANAGER}`
    );
    yield put(fetchHiringManagersSuccess(response?.data));
  } catch (error: any) {
    const errMsg =
      error?.response?.data?.message ||
      (error instanceof Error ? error.message : "Something went wrong!");
    ToastService.showError(errMsg);
    yield put(fetchHiringManagersFailure(errMsg));
  }
}

export function* watchHiringManager() {
  yield takeLatest(fetchHiringManagersRequest.type, fetchHiringManager);
}
