/* eslint-disable @typescript-eslint/no-explicit-any */
import { takeLatest, put, call } from "redux-saga/effects";
import api from "../../services/api";
import {
  fetchUserManagementRequest,
  fetchUserManagementSuccess,
  fetchUserManagementFailure,
  fetchUserManagementByIdRequest,
  fetchUserManagementByIdSuccess,
  fetchUserManagementByIdFailure,
  addUserManagementRequest,
  addUserManagementSuccess,
  addUserManagementFailure,
  updateUserManagementRequest,
  updateUserManagementSuccess,
  updateUserManagementFailure,
  searchUserManagementSuccess,
  searchUserManagementFailure,
  searchUserManagementRequest,
  addUserRevokeRequest,
  addUserRevokeSuccess,
  addUserRevokeFailure,
  addUserResendRequest,
  addUserResendSuccess,
  addUserResendFailure,
} from "../reducers/userManagementSlice";
import ToastService from "../../services/toastService";
import { API_URLS } from "../../shared/utils/api-urls";

// Define the payload interface for fetching user management
interface FetchUserManagementPayload {
  pageNumber: number;
  pageSize: number;
  searchTerm?: string;
}

// Fetch user management with pagination and optional search term
function* fetchUserManagementSaga(action: {
  type: string;
  payload: FetchUserManagementPayload;
}): Generator<any, void, any> {
  try {
    if (!action.payload) {
      throw new Error("Missing payload for fetching user management");
    }
    const response = yield call(
      api.get,
      `${API_URLS.USERS}/list?pageNumber=${action.payload.pageNumber}&pageSize=${action.payload.pageSize}`
    );
    yield put(fetchUserManagementSuccess(response?.data));
  } catch (error: any) {
    const errMsg =
      error?.response?.data?.message ||
      (error instanceof Error ? error.message : "Something went wrong!");
    ToastService.showError(errMsg);
    yield put(fetchUserManagementFailure(errMsg));
  }
}

// Search user management with pagination and optional search term
function* searchUserManagementSaga(action: {
  type: string;
  payload: FetchUserManagementPayload;
}): Generator<any, void, any> {
  try {
    if (!action.payload) {
      throw new Error("Missing payload for fetching user management");
    }
    const response = yield call(
      api.get,
      `${API_URLS.USERS}/list?pageNumber=${action.payload.pageNumber}&pageSize=${action.payload.pageSize}&searchTerm=${action.payload.searchTerm}`
    );
    yield put(searchUserManagementSuccess(response?.data));
  } catch (error: any) {
    const errMsg =
      error?.response?.data?.message ||
      (error instanceof Error ? error.message : "Something went wrong!");
    ToastService.showError(errMsg);
    yield put(searchUserManagementFailure(errMsg));
  }
}

// Fetch user management by ID
function* fetchUserManagementByIdSaga(
  action: ReturnType<typeof fetchUserManagementByIdRequest>
): Generator<any, void, any> {
  try {
    const { employeeId } = action.payload;
    const response = yield call(api.get, `${API_URLS.USERS}/${employeeId}`);
    yield put(fetchUserManagementByIdSuccess(response.data));
  } catch (error: any) {
    const errMsg =
      error?.response?.data?.message ||
      (error instanceof Error ? error.message : "Something went wrong!");
    ToastService.showError(errMsg);
    yield put(fetchUserManagementByIdFailure(errMsg));
  }
}

// Add new user management
function* addUserManagementSaga(
  action: ReturnType<typeof addUserManagementRequest>
): Generator<any, void, any> {
  try {
    const userManagement = action.payload;
    const response = yield call(
      api.post,
      `${API_URLS.USERS}/invite`,
      userManagement
    );
    ToastService.showSuccess("User management added successfully!");
    yield put(addUserManagementSuccess(response.data));
  } catch (error: any) {
    const errMsg =
      error?.response?.data?.message ||
      (error instanceof Error ? error.message : "Something went wrong!");
    ToastService.showError(errMsg);
    yield put(addUserManagementFailure(errMsg));
  }
}

// Add new user management
function* revokeUserSaga(
  action: ReturnType<typeof addUserRevokeRequest>
): Generator<any, void, any> {
  try {
    const { employeeId } = action.payload;
    const response = yield call(
      api.post,
      `${API_URLS.USERS}/invite/${employeeId}/revoke`,
      {}
    );
    ToastService.showSuccess("User revoked successfully!");
    yield put(addUserRevokeSuccess(response.data));
  } catch (error: any) {
    const errMsg =
      error?.response?.data?.message ||
      (error instanceof Error ? error.message : "Something went wrong!");
    ToastService.showError(errMsg);
    yield put(addUserRevokeFailure(errMsg));
  }
}

function* resendUserSaga(
  action: ReturnType<typeof addUserResendRequest>
): Generator<any, void, any> {
  try {
    const { employeeId } = action.payload;
    const response = yield call(
      api.post,
      `${API_URLS.USERS}/invite/${employeeId}/resend`,
      {}
    );
    ToastService.showSuccess("User resend successfully!");
    yield put(addUserResendSuccess(response.data));
  } catch (error: any) {
    const errMsg =
      error?.response?.data?.message ||
      (error instanceof Error ? error.message : "Something went wrong!");
    ToastService.showError(errMsg);
    yield put(addUserResendFailure(errMsg));
  }
}

// Update existing user management
function* updateUserManagementSaga(
  action: ReturnType<typeof updateUserManagementRequest>
): Generator<any, void, any> {
  try {
    const { payload } = action;
    const response = yield call(
      api.put,
      `${API_URLS.USERS}/${payload.employeeId}/update`,
      payload.payload
    );
    ToastService.showSuccess("User managementupdated successfully!");
    yield put(updateUserManagementSuccess(response.data));
  } catch (error: any) {
    const errMsg =
      error?.response?.data?.message ||
      (error instanceof Error ? error.message : "Something went wrong!");
    ToastService.showError(errMsg);
    yield put(updateUserManagementFailure(errMsg));
  }
}

// Watch for user management actions
export function* watchUserManagement() {
  yield takeLatest(fetchUserManagementRequest.type, fetchUserManagementSaga);
  yield takeLatest(
    fetchUserManagementByIdRequest.type,
    fetchUserManagementByIdSaga
  );
  yield takeLatest(addUserManagementRequest.type, addUserManagementSaga);
  yield takeLatest(updateUserManagementRequest.type, updateUserManagementSaga);
  yield takeLatest(searchUserManagementRequest.type, searchUserManagementSaga);
  yield takeLatest(addUserRevokeRequest.type, revokeUserSaga);
  yield takeLatest(addUserResendRequest.type, resendUserSaga);
}
