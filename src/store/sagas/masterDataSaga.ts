/* eslint-disable @typescript-eslint/no-explicit-any */
import { takeLatest, put, call } from "redux-saga/effects";
import api from "../../services/api";
import ToastService from "../../services/toastService";
import {
  fetchAllCandidatesFailure,
  fetchAllCandidatesRequest,
  fetchAllCandidatesSuccess,
  fetchAttendeesDataFailure,
  fetchAttendeesDataRequest,
  fetchAttendeesDataSuccess,
  fetchJobDepartmentFailure,
  fetchJobDepartmentRequest,
  fetchJobDepartmentSuccess,
  fetchMasterDataFailure,
  fetchMasterDataRequest,
  fetchMasterDataSuccess,
  fetchMasterJobOpeningFailure,
  fetchMasterJobOpeningRequest,
  fetchMasterJobOpeningSuccess,
  fetchUserDataFailure,
  fetchUserDataRequest,
  fetchUserDataSuccess,
  fetchUsersByRoleRequest,
  fetchUsersByRoleSuccess,
  fetchUsersByRoleFailure,
  fetchInterviewCandidatesByJobOpportunityRequest,
  fetchInterviewCandidatesByJobOpportunitySuccess,
  fetchInterviewCandidatesByJobOpportunityFailure,
} from "../reducers/masterDataSlice";
import { API_URLS } from "../../shared/utils/api-urls";
import type { PayloadAction } from "@reduxjs/toolkit";

// Saga to fetch master data
function* fetchMasterDataSaga(): Generator<any, void, any> {
  try {
    const response = yield call(api.get, `${API_URLS.MASTER_DATA}`);
    yield put(fetchMasterDataSuccess(response?.data));
  } catch (error: any) {
    const errMsg =
      error?.response?.data?.message ||
      (error instanceof Error ? error.message : "Something went wrong!");
    ToastService.showError(errMsg);
    yield put(fetchMasterDataFailure(errMsg));
  }
}

// Saga to fetch candidates per job opportunity id
function* fetchInterviewCandidatesByJobOpportunitySaga(
  action: ReturnType<typeof fetchInterviewCandidatesByJobOpportunityRequest>,
): Generator<any, void, any> {
  try {
    const { jobOpportunityId } = action.payload;
    const response = yield call(
      api.get,
      `${API_URLS.CANDIDATES_BY_JOB_OPPORTUNITY_ID}/${jobOpportunityId}`,
    );
    yield put(fetchInterviewCandidatesByJobOpportunitySuccess(response?.data));
  } catch (error: any) {
    const errMsg =
      error?.response?.data?.message ||
      (error instanceof Error ? error.message : "Something went wrong!");
    ToastService.showError(errMsg);
    yield put(fetchInterviewCandidatesByJobOpportunityFailure(errMsg));
  }
}

// Saga to fetch master data
function* fetchMasterJobOpeningSaga(): Generator<any, void, any> {
  try {
    const response = yield call(
      api.get,
      `${API_URLS.JOB_OPENING}/activeJobs?isActive=true&pageNumber=0&pageSize=0`
    );
    yield put(fetchMasterJobOpeningSuccess(response?.data));
  } catch (error: any) {
    const errMsg =
      error?.response?.data?.message ||
      (error instanceof Error ? error.message : "Something went wrong!");
    ToastService.showError(errMsg);
    yield put(fetchMasterJobOpeningFailure(errMsg));
  }
}

// Saga to fetch user data
function* fetchUserDataSaga(): Generator<any, void, any> {
  try {
    const response = yield call(api.get, `${API_URLS.USERS}/all`);
    yield put(fetchUserDataSuccess(response?.data));
  } catch (error: any) {
    const errMsg =
      error?.response?.data?.message ||
      (error instanceof Error ? error.message : "Something went wrong!");
    ToastService.showError(errMsg);
    yield put(fetchUserDataFailure(errMsg));
  }
}

// Saga to fetch Attendees data
function* fetchAttendeesDataSaga(): Generator<any, void, any> {
  try {
    const response = yield call(api.get, `${API_URLS.USERS}/allattendees`);
    yield put(fetchAttendeesDataSuccess(response?.data));
  } catch (error: any) {
    const errMsg =
      error?.response?.data?.message ||
      (error instanceof Error ? error.message : "Something went wrong!");
    ToastService.showError(errMsg);
    yield put(fetchAttendeesDataFailure(errMsg));
  }
}

// Saga to fetch Attendees data
function* fetchAllCandidatesDataSaga(): Generator<any, void, any> {
  try {
    const response = yield call(
      api.get,
      `${API_URLS.CANDIDATES}/allCandidates`
    );
    yield put(fetchAllCandidatesSuccess(response?.data));
  } catch (error: any) {
    const errMsg =
      error?.response?.data?.message ||
      (error instanceof Error ? error.message : "Something went wrong!");
    ToastService.showError(errMsg);
    yield put(fetchAllCandidatesFailure(errMsg));
  }
}

// Saga to fetch Attendees data
function* fetchJobDepartmentDataSaga(
  action: ReturnType<typeof fetchJobDepartmentRequest>
): Generator<any, void, any> {
  try {
    const { id } = action.payload;
    const response = yield call(
      api.get,
      `${API_URLS.JOB_OPENING}/getJobDepartment?JobOpportunityId=${id}`,
    );
    yield put(fetchJobDepartmentSuccess(response?.data));
  } catch (error: any) {
    const errMsg =
      error?.response?.data?.message ||
      (error instanceof Error ? error.message : "Something went wrong!");
    ToastService.showError(errMsg);
    yield put(fetchJobDepartmentFailure(errMsg));
  }
}

function* fetchUsersByRoleSaga(
  action: PayloadAction<void>
): Generator<any, void, any> {
  try {

    const response = yield call(
      api.get,
      `${API_URLS.USERS_BY_ROLE_INTERVIEWER}`
    );

    yield put(fetchUsersByRoleSuccess(response.data));
  } catch (error: any) {
    const errMsg =
      error?.response?.data?.message ||
      (error instanceof Error ? error.message : "Something went wrong!");

    ToastService.showError(errMsg);
    yield put(fetchUsersByRoleFailure(errMsg));
  }
}

export function* watchMasterData() {
  yield takeLatest(fetchMasterDataRequest.type, fetchMasterDataSaga);
  yield takeLatest(fetchUserDataRequest.type, fetchUserDataSaga);
  yield takeLatest(fetchAttendeesDataRequest.type, fetchAttendeesDataSaga);
  yield takeLatest(
    fetchMasterJobOpeningRequest.type,
    fetchMasterJobOpeningSaga
  );
  yield takeLatest(fetchAllCandidatesRequest.type, fetchAllCandidatesDataSaga);
  yield takeLatest(fetchJobDepartmentRequest.type, fetchJobDepartmentDataSaga);
  yield takeLatest(fetchUsersByRoleRequest.type, fetchUsersByRoleSaga);
  yield takeLatest(
    fetchInterviewCandidatesByJobOpportunityRequest.type,
    fetchInterviewCandidatesByJobOpportunitySaga,
  );
}
