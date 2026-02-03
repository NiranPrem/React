import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface Notification {
	notificationId: number;
	title: string;
	message: string;
	url: string | null;
	isRead: boolean;
	createdAt: string;
}

interface Notifications {
	items: Notification[];
	totalCount: number;
	unreadCount: number;
}

interface NotificationState {
	loading: boolean;
	success: boolean;
	error: string | null;
	totalCount: number;
	unreadCount: number;
	notifications: Notification[];
	selectedNotification: Notification | null;
}

const initialState: NotificationState = {
	loading: false,
	success: false,
	error: null,
	totalCount: 0,
	unreadCount: 0,
	notifications: [],
	selectedNotification: null,
};

const notificationSlice = createSlice({
	name: "notification",
	initialState,
	reducers: {
		// Fetch request
		fetchNotificationRequest: (
			state,
			action: PayloadAction<{
				pageNumber: number;
				pageSize: number;
				unreadOnly?: boolean;
			}>
		) => {
			state.loading = true;
			state.error = null;
		},

		// Fetch success
		fetchNotificationSuccess: (state, action: PayloadAction<Notifications>) => {
			const { items, totalCount, unreadCount } = action.payload;

			const existingIds = new Set(
				state.notifications.map((n) => n.notificationId)
			);
			const newItems = items.filter((n) => !existingIds.has(n.notificationId));

			state.notifications = [...state.notifications, ...newItems];
			state.totalCount = totalCount;
			if (unreadCount !== undefined) {
				state.unreadCount = unreadCount;
			}
			state.loading = false;
			state.error = null;
		},

		// Fetch failure
		fetchNotificationFailure: (state, action: PayloadAction<string>) => {
			state.loading = false;
			state.error = action.payload;
		},

		clearNotifications: (state) => {
			state.notifications = [];
		},

		fetchUnreadCountRequest: (state) => {
			// state.loading = true;
		},
		fetchUnreadCountSuccess: (state, action: PayloadAction<number>) => {
			state.unreadCount = action.payload;
		},
		fetchUnreadCountFailure: (state, action: PayloadAction<string>) => {
			state.error = action.payload;
		},

		markAllAsReadRequest: (state) => {
			state.loading = true;
			state.success = false;
		},
		markAllAsReadSuccess: (state) => {
			state.loading = false;
			state.success = true;
			state.notifications = state.notifications.map((n) => ({
				...n,
				isRead: true,
			}));
			state.unreadCount = 0;
		},
		markAllAsReadFailure: (state, action: PayloadAction<string>) => {
			state.loading = false;
			state.success = false;
			state.error = action.payload;
		},
		markAsReadRequest: (state, action: PayloadAction<number>) => {
			state.loading = true;
		},
		markAsReadSuccess: (state, action: PayloadAction<number>) => {
			state.loading = false;
			const notificationId = action.payload;
			const notification = state.notifications.find(
				(n) => n.notificationId === notificationId
			);
			if (notification && !notification.isRead) {
				notification.isRead = true;
				state.unreadCount = Math.max(0, state.unreadCount - 1);
			}
		},
		markAsReadFailure: (state, action: PayloadAction<string>) => {
			state.loading = false;
			state.error = action.payload;
		},
	},
});

export const {
	fetchNotificationRequest,
	fetchNotificationSuccess,
	fetchNotificationFailure,
	clearNotifications,
	fetchUnreadCountRequest,
	fetchUnreadCountSuccess,
	fetchUnreadCountFailure,
	markAllAsReadRequest,
	markAllAsReadSuccess,
	markAllAsReadFailure,
	markAsReadRequest,
	markAsReadSuccess,
	markAsReadFailure,
} = notificationSlice.actions;

export default notificationSlice.reducer;
