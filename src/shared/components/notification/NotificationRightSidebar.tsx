import React, { useEffect, useRef, useState } from "react";
import { Sidebar } from "primereact/sidebar";
import { useNavigate } from "react-router-dom";
import EmptyState from "../empty-state/EmptyState";
import { useDispatch, useSelector } from "react-redux";
import {
	fetchNotificationRequest,
	clearNotifications,
	markAllAsReadRequest,
	markAsReadRequest,
  fetchUnreadCountRequest,
} from "../../../store/reducers/notificationSlice";
import type { RootState } from "../../../store/store";
import bellIcon from "../../../assets/icons/bell.svg";
import closeLogo from "../../../assets/icons/x-close.svg";
import "./NotificationRightSidebar.css";
import AtsLoader from "../ats-loader/AtsLoader";

interface NotificationSidebarProps {
	visible: boolean;
	onHide: () => void;
}

const NotificationRightSidebar: React.FC<NotificationSidebarProps> = ({
	visible,
	onHide,
}) => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const scrollRef = useRef<HTMLDivElement>(null);
	const [pageNumber, setPageNumber] = useState(1);
	const [activeTab, setActiveTab] = useState("all");
	const pageSize = 15;

	const {
		notifications = [],
		totalCount = 0,
		loading: notificationsLoading,success,
	} = useSelector((state: RootState) => state.notifications);

	const hasMore = notifications.length < totalCount;

	const fetchNotifications = (page: number, isUnread: boolean) => {
		dispatch(
			fetchNotificationRequest({
				pageNumber: page,
				pageSize,
				unreadOnly: isUnread,
			})
		);
	};

	const handleTabChange = (tab: string) => {
		if (activeTab === tab) return;
		setActiveTab(tab);
		const isUnread = tab === "unread";
		dispatch(clearNotifications());
		setPageNumber(1);
		fetchNotifications(1, isUnread);
	};

	const handleMarkAllAsRead = () => {
		dispatch(markAllAsReadRequest());
	};

	useEffect(() => {
		if (visible && notifications.length === 0) {
			dispatch(clearNotifications());
			setPageNumber(1);
			fetchNotifications(1, activeTab === "unread");
		}
	}, [visible]);

  useEffect(() => {
    dispatch(fetchUnreadCountRequest());
  },[success]);

	const handleScroll = () => {
		const el = scrollRef.current;
		if (!el || notificationsLoading || !hasMore) return;
		const bottom = el.scrollHeight - el.scrollTop - el.clientHeight;
		if (bottom < 100) {
			const nextPage = pageNumber + 1;
			setPageNumber(nextPage);
			fetchNotifications(nextPage, activeTab === "unread");
		}
	};

	return (
		<Sidebar
			position="right"
			visible={visible}
			onHide={onHide}
			className="notification !w-[35rem] h-screen shadow-lg flex flex-col"
			showCloseIcon={false}>
			<div className="flex items-center justify-between p-3 !bg-[#F6F6F6]">
				<h2 className="text-xl font-semibold">Notifications</h2>
				<button
					type="button"
					className="rounded-lg hover:bg-[#FFFFFF] p-2 cursor-pointer"
					onClick={onHide}>
					<img src={closeLogo} className="w-5 h-5" alt="close" />
				</button>
			</div>
			<div className="px-4">
				<div className="flex items-center justify-between pb-0 pt-2 border-b border-[#F2F4F7]">
					<div className="flex gap-6">
						<button
							className={`pb-2 text-sm font-medium transition-colors ${
								activeTab === "all"
									? "text-[#344054] border-b-2 border-[#155EEF]"
									: "text-[#667085]"
							}`}
							onClick={() => handleTabChange("all")}>
							All
						</button>
						<button
							className={`pb-2 text-sm font-medium transition-colors ${
								activeTab === "unread"
									? "text-[#344054] border-b-2 border-[#155EEF]"
									: "text-[#667085]"
							}`}
							onClick={() => handleTabChange("unread")}>
							Unread
						</button>
					</div>
					<button
						className="text-sm font-medium text-[#2D4F9F] pb-2 "
						onClick={handleMarkAllAsRead}>
						Mark all as read
					</button>
				</div>
			</div>
			<div
				ref={scrollRef}
				onScroll={handleScroll}
				className="overflow-y-auto p-4 flex-1"
				style={{ maxHeight: "calc(100vh - 95px)", marginBottom: "1rem" }}>
				{(() => {
					const displayNotifications =
						activeTab === "unread"
							? notifications.filter((n) => n.isRead === false)
							: notifications;

					return displayNotifications.length > 0
						? displayNotifications.map((notification, index) => (
								<div
									key={
										notification.notificationId ??
										`notification-${index}-${Math.random()}`
									}
									className={`py-4 border-b border-[#F2F4F7] last:border-0 ${
										notification.isRead ? "bg-white" : "bg-blue-50/30"
									}`}>
									<div className="flex gap-3">
										<div className="flex-shrink-0 w-10 h-10 bg-[#EFF4FF] rounded-xl flex items-center justify-center">
											<img
												src={bellIcon}
												alt="bell"
												className="w-5 h-5"
												style={{
													filter:
														"invert(44%) sepia(77%) saturate(2926%) hue-rotate(205deg) brightness(101%) contrast(96%)",
												}}
											/>
										</div>
										<div className="flex-1">
											<h4
												className={`text-[14px] mb-1 ${
													!notification.isRead
														? "font-bold text-[#101828]"
														: "font-semibold text-[#101828]"
												}`}>
												{notification.title ?? "Notification"}
											</h4>
											<p className="text-[14px] text-[#475467] leading-tight">
												{notification.message ?? "No details available."}
											</p>
											<div className="flex justify-between items-center mt-2">
												<button
													className="text-[12px] font-medium text-[#2D4F9F]"
													onClick={() => {
														if (notification.url) {
															dispatch(
																markAsReadRequest(notification.notificationId)
															);
															navigate(notification.url, {
																state: { notificationData: notification },
															});
															onHide();
														}
													}}>
													View Details
												</button>
												{notification.createdAt && (
													<span className="text-[12px] text-[#98A2B3]">
														{new Date(
															notification.createdAt
														).toLocaleDateString() +
															" " +
															new Date(
																notification.createdAt
															).toLocaleTimeString([], {
																hour: "2-digit",
																minute: "2-digit",
															})}
													</span>
												)}
											</div>
										</div>
									</div>
								</div>
						  ))
						: !notificationsLoading && <EmptyState />;
				})()}
				{notificationsLoading && (
					<div className="text-center text-sm text-gray-500 py-4">
						<AtsLoader />
					</div>
				)}
			</div>
		</Sidebar>
	);
};

export default NotificationRightSidebar;
