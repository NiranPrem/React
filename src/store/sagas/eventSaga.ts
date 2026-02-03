/* eslint-disable @typescript-eslint/no-explicit-any */
import { takeLatest, put, call } from "redux-saga/effects";
import api from "../../services/api";

import ToastService from "../../services/toastService";
import { API_URLS } from "../../shared/utils/api-urls";
import {
  addEventFailure,
  addEventRequest,
  addEventSuccess,
  fetchEventByIdFailure,
  fetchEventByIdRequest,
  fetchEventByIdSuccess,
  fetchEventByIntrerviewerFailure,
  fetchEventByIntrerviewerRequest,
  fetchEventByIntrerviewerSuccess,
  fetchEventFailure,
  fetchEventRequest,
  fetchEventSuccess,
  fetchInterviewerFailure,
  fetchInterviewerRequest,
  fetchInterviewerSuccess,
  updateEventFailure,
  updateEventRequest,
  updateEventSuccess,
} from "../reducers/eventSlice";

// Fetch Event
function* fetchEventSaga(): Generator<any, void, any> {
  try {
    const response = yield call(api.get, `${API_URLS.CALENDAR}/events`);
    yield put(fetchEventSuccess(response?.data));
  } catch (error: any) {
    const errMsg =
      error?.response?.data?.message ||
      (error instanceof Error ? error.message : "Something went wrong!");
    ToastService.showError(errMsg);
    yield put(fetchEventFailure(errMsg));
  }
}

// Fetch Event
function* fetchEventByInterviewerSaga(
  action: ReturnType<typeof fetchEventByIntrerviewerRequest>
): Generator<any, void, any> {
  try {
    const { InterviewerId } = action.payload;
    const response = yield call(
      api.get,
      `${API_URLS.CALENDAR}/events/HiringManager/${InterviewerId}`
    );
    yield put(fetchEventByIntrerviewerSuccess(response?.data));
  } catch (error: any) {
    const errMsg =
      error?.response?.data?.message ||
      (error instanceof Error ? error.message : "Something went wrong!");
    ToastService.showError(errMsg);
    yield put(fetchEventByIntrerviewerFailure(errMsg));
  }
}

// Fetch event Request by ID
function* fetchEventByIdSaga(
  action: ReturnType<typeof fetchEventByIdRequest>
): Generator<any, void, any> {
  try {
    const { EventId } = action.payload;
    const response = yield call(
      api.get,
      `${API_URLS.CALENDAR}/events/${EventId}`
    );
    yield put(fetchEventByIdSuccess(response.data));
  } catch (error: any) {
    const errMsg =
      error?.response?.data?.message ||
      (error instanceof Error ? error.message : "Something went wrong!");
    ToastService.showError(errMsg);
    yield put(fetchEventByIdFailure(errMsg));
  }
}

// Add new Event Request
function* addEventSaga(
  action: ReturnType<typeof addEventRequest>
): Generator<any, void, any> {
  try {
    const event = action.payload;
    const response = yield call(api.post, `${API_URLS.CALENDAR}/events`, event);
    ToastService.showSuccess("Event added successfully!");
    yield put(addEventSuccess(response.data));
  } catch (error: any) {
    const errMsg =
      error?.response?.data?.message ||
      (error instanceof Error ? error.message : "Something went wrong!");
    ToastService.showError(errMsg);
    yield put(addEventFailure(errMsg));
  }
}

// Update existing Event Request
function* updateEventSaga(
  action: ReturnType<typeof updateEventRequest>
): Generator<any, void, any> {
  try {
    const { payload } = action;
    const response = yield call(
      api.put,
      `${API_URLS.CALENDAR}/events`,
      payload
    );
    ToastService.showSuccess("Event updated successfully!");
    yield put(updateEventSuccess(response.data));
  } catch (error: any) {
    const errMsg =
      error?.response?.data?.message ||
      (error instanceof Error ? error.message : "Something went wrong!");
    ToastService.showError(errMsg);
    yield put(updateEventFailure(errMsg));
  }
}

// Fetch Interviewer
function* fetchInterviewerSaga(): Generator<any, void, any> {
  try {
    const response = yield call(api.get, `${API_URLS.CALENDAR}/Interviewers`);
    yield put(fetchInterviewerSuccess(response?.data));
  } catch (error: any) {
    const errMsg =
      error?.response?.data?.message ||
      (error instanceof Error ? error.message : "Something went wrong!");
    ToastService.showError(errMsg);
    yield put(fetchInterviewerFailure(errMsg));
  }
}

// Watch for v Request actions
export function* watchEvents() {
  yield takeLatest(fetchEventRequest.type, fetchEventSaga);
  yield takeLatest(
    fetchEventByIntrerviewerRequest.type,
    fetchEventByInterviewerSaga
  );
  yield takeLatest(fetchEventByIdRequest.type, fetchEventByIdSaga);
  yield takeLatest(addEventRequest.type, addEventSaga);
  yield takeLatest(updateEventRequest.type, updateEventSaga);
  yield takeLatest(fetchInterviewerRequest.type, fetchInterviewerSaga);
}
