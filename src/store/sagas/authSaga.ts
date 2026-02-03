/* eslint-disable @typescript-eslint/no-explicit-any */
import { takeLatest, put, call } from "redux-saga/effects";
import {
  loginRequest,
  loginSuccess,
  loginFailure,
  adLoginSuccess,
  adLoginFailure,
  adLoginRequest,
  fetchUserRequest,
  fetchUserSuccess,
  fetchUserFailure,
  fetchUserActivationRequest,
  fetchUserAcceptRequest,
  fetchUserAcceptSuccess,
  fetchUserAcceptFailure,
  fetchUserActivationFailure,
  fetchUserActivationSuccess,
} from "../reducers/authSlice";
import api from "../../services/api";
import ToastService from "../../services/toastService";
import { API_URLS } from "../../shared/utils/api-urls";

// Login saga to handle user login
function* loginSaga(
  action: ReturnType<typeof loginRequest>
): Generator<any, void, any> {
  try {
    const response = yield call(
      api.post,
      `${API_URLS.AUTH_LOGIN}`,
      action.payload
    );
    const { accessToken, refreshToken } = response.data;
    if (!accessToken || !refreshToken) {
      yield put(loginFailure(response.data));
      return;
    }
    localStorage.setItem("token", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    yield put(loginSuccess(response.data));
  } catch (error: any) {
    const errMsg =
      error?.response?.data?.message ||
      (error instanceof Error ? error.message : "Something went wrong!");
    ToastService.showError(errMsg);
    yield put(loginFailure(errMsg));
  }
}

// Saga to fetch AD login
function* adLoginSaga(
  action: ReturnType<typeof adLoginRequest>
): Generator<any, void, any> {
  try {
    const { azureAccessToken } = action.payload;
    const response = yield call(
      api.post,
      `${API_URLS.AUTH_LOGIN}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${azureAccessToken}`,
        },
      }
    );
    const { token } = response.data;
    if (!token) {
      yield put(loginFailure(response.data));
      return;
    }
    localStorage.setItem("token", token);
    yield put(adLoginSuccess(response?.data));
  } catch (error: any) {
    const errMsg =
      error?.response?.data?.message ||
      (error instanceof Error ? error.message : "Something went wrong!");
    ToastService.showError(errMsg);
    yield put(adLoginFailure(errMsg));
  }
}

// Saga to fetch AD login
function* fetchUserSaga(): Generator<any, void, any> {
  try {
    const response = yield call(api.get, `${API_URLS.USERS}/getuser`);
    yield put(fetchUserSuccess(response?.data));
  } catch (error: any) {
    const errMsg =
      error?.response?.data?.message ||
      (error instanceof Error ? error.message : "Something went wrong!");
    ToastService.showError(errMsg);
    yield put(fetchUserFailure(errMsg));
  }
}

// Saga to fetch AD login
function* fetchUserActivationSaga(
  action: ReturnType<typeof fetchUserActivationRequest>
): Generator<any, void, any> {
  try {
    const { token } = action.payload;
    const response = yield call(
      api.get,
      `${API_URLS.USERS}/invite/validate?token=${token}`
    );

    yield put(fetchUserActivationSuccess(response?.data));
  } catch (error: any) {
    const errMsg =
      error?.response?.data?.message ||
      (error instanceof Error ? error.message : "Something went wrong!");
    ToastService.showError(errMsg);
    yield put(fetchUserActivationFailure(errMsg));
  }
}

// Saga to fetch AD login
function* fetchUserAcceptSaga(
  action: ReturnType<typeof fetchUserAcceptRequest>
): Generator<any, void, any> {
  try {
    const { azureAccessToken, userToken } = action.payload;
    const response = yield call(
      api.post,
      `${API_URLS.USERS}/invite/accept`,
      {
        token: userToken,
      },
      {
        headers: {
          Authorization: `Bearer ${azureAccessToken}`,
        },
      }
    );
    const { token } = response.data;
    if (!token) {
      yield put(fetchUserAcceptSuccess(response.data));
      return;
    }
    localStorage.setItem("token", token);
    yield put(adLoginSuccess(response?.data));
  } catch (error: any) {
    const errMsg =
      error?.response?.data?.message ||
      (error instanceof Error ? error.message : "Something went wrong!");
    ToastService.showError(errMsg);
    yield put(fetchUserAcceptFailure(errMsg));
  }
}

export function* watchAuth() {
  yield takeLatest(loginRequest.type, loginSaga);
  yield takeLatest(adLoginRequest.type, adLoginSaga);
  yield takeLatest(fetchUserRequest.type, fetchUserSaga);
  yield takeLatest(fetchUserActivationRequest.type, fetchUserActivationSaga);
  yield takeLatest(fetchUserAcceptRequest.type, fetchUserAcceptSaga);
}
