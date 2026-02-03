import { useCallback, useEffect, useRef, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Globe } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../../store/store";
import { fetchUserRequest, logout } from "../../../store/reducers/authSlice";
import ToastService from "../../../services/toastService";

// Assets
import relumeLogo from "../../../assets/icons/relume.svg";
import userMenuLogo from "../../../assets/icons/user-menu.svg";
import candidatesLogo from "../../../assets/icons/candidate-menu.svg";
import bellLogo from "../../../assets/icons/bell.svg";
import suiteLogo from "../../../assets/icons/suite-case.svg";
import docLogo from "../../../assets/icons/file.svg";
import powerSvg from "../../../assets/icons/power.svg";
import maskImage from "../../../assets/images/mask.png";
import calenderLogo from "../../../assets/icons/events.svg";
import interviewsLogo from "../../../assets/icons/interviews.svg";
import userLogo from "../../../assets/icons/user-management.svg";

// Components
import ImageWithFallback from "../ats-image-loader/ImageLoader";
import { useTranslation } from "react-i18next";

// Styles
import "./AppLayout.css";
import i18n from "../../../services/i18n";
import NotificationRightSidebar from "../notification/NotificationRightSidebar";
import { fetchUnreadCountRequest } from "../../../store/reducers/notificationSlice";

export default function AppLayout() {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const location = useLocation();

	const [isNotificationSidebarOpen, setIsNotificationSidebarOpen] =
		useState(false);
	const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
	const [isLangDropdownOpen, setLangDropdownOpen] = useState(false);

	const { user } = useSelector((state: RootState) => state.auth);
	const { totalCount } = useSelector((state: RootState) => state.notifications);
	const { unreadCount } = useSelector(
		(state: RootState) => state.notifications
	);
	const profileDropdownRef = useRef<HTMLDivElement>(null);
	const langDropdownRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!user) {
			dispatch(fetchUserRequest());
		}
		dispatch(fetchUnreadCountRequest());
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	// Close dropdowns when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				profileDropdownRef.current &&
				!profileDropdownRef.current.contains(event.target as Node)
			) {
				setIsProfileDropdownOpen(false);
			}
			if (
				langDropdownRef.current &&
				!langDropdownRef.current.contains(event.target as Node)
			) {
				setLangDropdownOpen(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const handleLogout = () => {
		dispatch(logout());
		setIsProfileDropdownOpen(false);
		setLangDropdownOpen(false);
		localStorage.removeItem("token");
		localStorage.removeItem("refreshToken");
		ToastService.showSuccess("Logged out successfully!");
		navigate("/login");
	};

	const handlePageChange = useCallback(
		(page: string) => {
			navigate(page);
		},
		[navigate]
	);

	const changeLanguage = (lng: string) => {
		i18n.changeLanguage(lng);
		setLangDropdownOpen(false);
	};

	const isActive = (path: string) => {
		const current = location.pathname.split("/")[1]; // get first segment
		const target = path.split("/")[1];
		return current === target
			? "bg-[#4278F9] text-white"
			: "hover:bg-[#193984]";
	};

	const dropdownPanelStyles = {
		backgroundImage: `url(${maskImage})`,
		backgroundRepeat: "no-repeat",
		backgroundPosition: "right",
	};

	const navItems = [
		{
			key: "jobs",
			path: "/jobs",
			label: t("common.myJobOpenings"),
			icon: userMenuLogo,
		},
		{
			key: "candidates",
			path: "/candidates",
			label: t("common.candidates"),
			icon: candidatesLogo,
		},
		{
			key: "requests",
			path: "/requests",
			label: t("common.myJobRequests"),
			icon: suiteLogo,
		},
		{
			key: "referrals",
			path: "/referrals",
			label: t("common.referrals"),
			icon: docLogo,
		},
		{
			key: "events",
			path: "/events",
			label: t("common.myCalendar"),
			icon: calenderLogo,
		},
		{
			key: "interviews",
			path: "/interviews",
			label: "Interviews",
			icon: interviewsLogo,
		},
		{
			key: "users",
			path: "/users",
			label: "User Management",
			icon: userLogo,
		},
	];

	// Determine visible items based on role
	const getNavItemsByRole = (role?: string) => {
		switch (role) {
			case "BUSINESSUNITHEAD":
				return ["requests"];
			case "HRADMIN":
				return [
					"jobs",
					"candidates",
					"requests",
					"events",
					"referrals",
					"interviews",
					"users",
				];
			case "RECRUITER":
				return ["jobs", "candidates", "requests", "events"];
			case "INTERVIEWS":
				return ["interviews"];
			case "CANDIDATE":
				return [];
			case "EMPLOYEE":
				return ["referrals"];
			default:
				return [];
		}
	};

	// ✅ Fix for when user.role is an array (like ["Admin"])
	const userRoles = Array.isArray(user?.role) ? user.role : [user?.role];

	// Filter items dynamically based on any matching role
	const visibleNavItems = navItems.filter((item) =>
		userRoles.some((r) => getNavItemsByRole(r).includes(item.key))
	);

	return (
		<div className="min-h-screen transition-all flex">
			<NotificationRightSidebar
				visible={isNotificationSidebarOpen}
				onHide={() => setIsNotificationSidebarOpen(false)}
			/>

			{/* Left Sidebar */}
			<div className="bg-[#122248] p-0 w-18 flex flex-col items-center gap-4">
				<nav className="flex flex-col items-center">
					<div title="ATS" className="flex items-center py-6">
						<img
							src={relumeLogo}
							className="w-8 h-8"
							alt="logo"
							loading="lazy"
						/>
					</div>
					{visibleNavItems.map(({ path, icon, label }) => (
						<div key={path} className="relative group w-full">
							<button
								type="button"
								onClick={() => handlePageChange(path)}
								className={`w-full transition-all duration-200 flex flex-col items-center py-2 justify-center cursor-pointer ${isActive(
									path
								)}`}
								aria-label={label}>
								<img
									src={icon}
									className="w-8 h-8"
									alt={`${label} icon`}
									loading="lazy"
								/>
								<span className="text-[10px] text-center mt-1 font-small leading-tight text-white w-18 truncate px-2 pt-1">
									{label}
								</span>
							</button>

							{/* Tooltip */}
							<span
								className="absolute left-full ml-2 top-1/2 -translate-y-1/2 whitespace-nowrap bg-black text-white text-sm px-5 py-3 rounded-2xl shadow-md opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-200 z-30
  before:content-[''] before:absolute before:top-1/2 before:-left-2 before:-translate-y-1/2 before:border-y-8 before:border-r-8 before:border-y-transparent before:border-r-black">
								{label}
							</span>
						</div>
					))}
				</nav>
			</div>

			{/* Main Layout */}
			<div className="flex flex-col flex-1">
				{/* Header */}
				<header className="p-4 bg-[#2D4D9A] flex items-center justify-between text-white">
					<div className="text-xl text-white">ATS</div>
					<div className="flex items-center gap-3">
						{/* Notifications */}
						<button
							type="button"
							onClick={() => setIsNotificationSidebarOpen(true)}
							className="bg-[#1B326B] hover:bg-blue-900 flex items-center justify-center rounded-xl px-2 py-1 gap-1 cursor-pointer h-"
							title="Notifications"
							aria-label="Notifications">
							<img
								src={bellLogo}
								className="w-5 h-5"
								alt="Notifications"
								loading="lazy"
							/>
							{unreadCount > 0 && (
								<span className="bg-[#B80000] text-white text-[10px] rounded-lg px-2 py-1 flex items-center justify-center text-center">
									{unreadCount > 99 ? "99+" : unreadCount}
								</span>
							)}
						</button>
						{/* Language Selector */}
						{/* <div className="relative" ref={langDropdownRef}>
              <button
                type="button"
                title="Language Selector"
                className="flex items-center cursor-pointer"
                aria-label="Language Selector"
              onClick={() => setLangDropdownOpen((prev) => !prev)}
              >
                <Globe className="w-7 h-7" />
              </button>
              {isLangDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-64 bg-white shadow-md z-50 text-black rounded-lg"
                  style={dropdownPanelStyles}
                >
                  <button
                    type="button"
                    className={`w-full flex items-center gap-5 text-md font-normal cursor-pointer p-4 rounded-t-lg bg-white hover:bg-[#F6F6F6] ${i18n.language === "en"
                      ? "bg-[#F6F6F6] font-semibold text-[#4278F9]"
                      : ""
                      }`}
                    onClick={() => changeLanguage("en")}
                  >
                    {t("common.english")}
                  </button>
                  <button
                    type="button"
                    className={`w-full flex items-center gap-5 text-md font-normal cursor-pointer p-4 rounded-b-lg bg-white hover:bg-[#F6F6F6] ${i18n.language === "de"
                      ? "bg-[#F6F6F6] font-semibold text-[#4278F9]"
                      : ""
                      }`}
                    onClick={() => changeLanguage("de")}
                  >
                    {t("common.german")}
                  </button>
                </div>
              )}
            </div> */}

						{/* Profile Dropdown */}
						<div className="relative" ref={profileDropdownRef}>
							<button
								type="button"
								className="flex items-center"
								title="Profile Dropdown"
								aria-label="Profile Dropdown"
								onClick={() => setIsProfileDropdownOpen((prev) => !prev)}>
								<ImageWithFallback
									src={user?.profileImage}
									alt="Profile"
									className="w-10 h-10 rounded-full border border-gray-300 cursor-pointer"
									width={30}
									height={30}
									preview={false}
								/>
							</button>
							{isProfileDropdownOpen && (
								<div
									className="absolute right-0 mt-2 w-max min-w-[250px] bg-white shadow-md rounded-lg z-50 text-black"
									style={dropdownPanelStyles}>
									<div className="flex items-center gap-3 p-4">
										<ImageWithFallback
											src={user?.profileImage}
											alt="Profile"
											className="w-10 h-10 rounded-full border border-gray-300"
											width={40}
											height={40}
											preview={false}
										/>
										<div>
											<p className="font-semibold">
												{user?.name ? user.name : "None"}
											</p>
											<p className="text-sm text-gray-500">Entity XYZ</p>
										</div>
									</div>
									<button
										type="button"
										onClick={handleLogout}
										className="w-full flex items-center gap-5 text-base font-normal hover:bg-[#bfdbfe] cursor-pointer px-5 py-6 rounded-b-lg bg-white">
										<img
											src={powerSvg}
											className="w-6 h-6"
											alt="Logout"
											loading="lazy"
										/>{" "}
										Logout
									</button>
								</div>
							)}
						</div>
					</div>
				</header>

				{/* Main Content */}
				<main className="flex-1 overflow-auto">
					<Outlet />
				</main>
			</div>
		</div>
	);
}
