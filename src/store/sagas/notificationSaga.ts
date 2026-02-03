/* eslint-disable @typescript-eslint/no-explicit-any */
import { takeLatest, put, call } from "redux-saga/effects";
import api from "../../services/api";
import {
	fetchNotificationRequest,
	fetchNotificationSuccess,
	fetchNotificationFailure,
	markAllAsReadSuccess,
	fetchUnreadCountRequest,
	markAllAsReadFailure,
	markAllAsReadRequest,
	markAsReadRequest,
	markAsReadSuccess,
	markAsReadFailure,
	fetchUnreadCountSuccess,
	fetchUnreadCountFailure,
} from "../reducers/notificationSlice";
import ToastService from "../../services/toastService";
import { API_URLS } from "../../shared/utils/api-urls";

interface FetchNotificationPayload {
	pageNumber: number;
	pageSize: number;
	unreadOnly?: boolean;
}

// Fetch notifications saga
function* fetchNotificationSaga(action: {
	type: string;
	payload: FetchNotificationPayload;
}): Generator<any, void, any> {
	try {
		if (!action.payload) {
			throw new Error("Missing payload for fetching notification");
		}
		const { pageNumber, pageSize, unreadOnly = false } = action.payload;
		const response = yield call(
			api.get,
			`${API_URLS.NOTIFICATIONS}?pageNumber=${pageNumber}&pageSize=${pageSize}&unreadOnly=${unreadOnly}`
		);
		yield put(fetchNotificationSuccess(response?.data));
	} catch (error: any) {
		const errMsg =
			error?.response?.data?.message ||
			(error instanceof Error ? error.message : "Something went wrong!");
		ToastService.showError(errMsg);
		yield put(fetchNotificationFailure(errMsg));
	}
}

// Fetch unread count saga
function* fetchUnreadCountSaga(): Generator<any, void, any> {
	try {
		const response = yield call(
			api.get,
			`${API_URLS.NOTIFICATIONS}/unread-count`
		);

		if (response?.data?.unreadCount !== undefined) {
			yield put(fetchUnreadCountSuccess(response.data.unreadCount));
		} else {
			yield put(fetchUnreadCountFailure("Invalid response format"));
		}
	} catch (error: any) {
		console.error("Failed to fetch unread count", error);
	}
}

// Mark All As Read Saga
function* markAllAsReadSaga(): Generator<any, void, any> {
	try {
		yield call(api.post, `${API_URLS.NOTIFICATIONS}/mark-all-as-read`);
		yield put(markAllAsReadSuccess());
	} catch (error: any) {
		const errMsg =
			error?.response?.data?.message || "Failed to mark all as read";
		ToastService.showError(errMsg);
		yield put(markAllAsReadFailure(errMsg));
	}
}
function* markAsReadSaga(action: {
	type: string;
	payload: number;
}): Generator<any, void, any> {
	try {
		const notificationId = action.payload;
		yield call(
			api.post,
			`${API_URLS.NOTIFICATIONS}/${notificationId}/mark-as-read`
		);
		yield put(markAsReadSuccess(notificationId));
	} catch (error: any) {
		const errMsg =
			error?.response?.data?.message || "Failed to mark notification as read";
		yield put(markAsReadFailure(errMsg));
	}
}

export function* watchNotification() {
	yield takeLatest(fetchNotificationRequest.type, fetchNotificationSaga);
	yield takeLatest(fetchUnreadCountRequest.type, fetchUnreadCountSaga);
	yield takeLatest(markAllAsReadRequest.type, markAllAsReadSaga);
	yield takeLatest(markAsReadRequest.type, markAsReadSaga);
}
