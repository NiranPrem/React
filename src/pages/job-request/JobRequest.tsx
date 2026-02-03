import { useEffect, useRef, useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import AtsLoader from "../../shared/components/ats-loader/AtsLoader";
import type { RootState } from "../../store/store";
import Briefcase from "../../assets/icons/brief-case.svg";
import EmptyState from "../../shared/components/empty-state/EmptyState";
import {
	fetchJobRequestRequest,
	searchJobRequestRequest,
} from "../../store/reducers/jobRequestSlice";
import { fetchMasterDataRequest } from "../../store/reducers/masterDataSlice";
import type { RequestInterface } from "../../shared/interface/RequestInterface";
import { useTranslation } from "react-i18next";
import AtsPaginator from "../../shared/components/ats-pagination/Pagination";
import MainPageHeader from "../../shared/components/main-page-header/MainPageHeader";
import { getStatusClasses } from "../../services/common";
import JobRequestFilterDrawer, {
	type FilterValues,
} from "./components/JobRequestFilterDrawer";

const STORAGE_KEY = "jobRequestFilters";
const TAB_KEY = "JR_ACTIVE_TABS";

const JobRequest = () => {
	const isFirstRender = useRef(true);
	const isFilterDataFetched = useRef(false);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const location = useLocation();
	const { t } = useTranslation();

	const [first, setFirst] = useState(0);
	const [rows, setRows] = useState(15);
	const [searchTerm, setSearchTerm] = useState("");
	const [isFilterOpen, setIsFilterOpen] = useState(false);
	const [activeFilters, setActiveFilters] = useState<FilterValues | null>(() => {
		const saved = sessionStorage.getItem(STORAGE_KEY);
		return saved ? JSON.parse(saved) : null;
	});
	const [allJobRequestsForFilter, setAllJobRequestsForFilter] = useState<RequestInterface[]>([]);

	const { jobRequests, loading, totalCount } = useSelector(
		(state: RootState) => state.jobRequest
	);
	const { jobRequestStatus } = useSelector(
		(state: RootState) => state.masterData
	);

	const fetchPaginatedJobRequests = (firstIndex: number, rowCount: number) => {
		const pageNumber = Math.floor(firstIndex / rowCount) + 1;
		const pageSize = rowCount;
		if (searchTerm) {
			dispatch(searchJobRequestRequest({ pageNumber, pageSize, searchTerm }));
		} else {
			dispatch(fetchJobRequestRequest({ pageNumber, pageSize }));
		}
	};

	const isAnyFilterActive = useMemo(() => {
		if (!activeFilters) return false;
		return (
			activeFilters.requestOwner.length > 0 ||
			activeFilters.jobTitle.length > 0 ||
			activeFilters.numberOfPositions.length > 0 ||
			activeFilters.assignedRecruiter.length > 0 ||
			activeFilters.jobRequestStatus.length > 0
		);
	}, [activeFilters]);

	const handleFilterOpen = () => {
		setIsFilterOpen(true);
		if (!isFilterDataFetched.current && totalCount && totalCount > rows) {
			dispatch(fetchJobRequestRequest({ pageNumber: 1, pageSize: totalCount }));
			isFilterDataFetched.current = true;
		}
	};

	useEffect(() => {
		if (jobRequests && Array.isArray(jobRequests)) {
			if (jobRequests.length >= (totalCount || 0)) {
				setAllJobRequestsForFilter(jobRequests);
			} else if (allJobRequestsForFilter.length === 0) {
				setAllJobRequestsForFilter(jobRequests);
			}
		}
	}, [jobRequests, totalCount, allJobRequestsForFilter.length]);

	useEffect(() => {
		return () => {
			const nextPath = window.location.pathname;
			if (!nextPath.includes("request-overview")) {
				sessionStorage.removeItem(STORAGE_KEY);
			}
		};
	}, [location]);

	useEffect(() => {
		if (activeFilters) {
			sessionStorage.setItem(STORAGE_KEY, JSON.stringify(activeFilters));
		} else {
			sessionStorage.removeItem(STORAGE_KEY);
		}
	}, [activeFilters]);

	useEffect(() => {
		const tabId = Date.now();

		const tabs = JSON.parse(localStorage.getItem(TAB_KEY) || "[]");
		tabs.push(tabId);
		localStorage.setItem(TAB_KEY, JSON.stringify(tabs));

		const handleUnload = () => {
			const navEntry = performance.getEntriesByType("navigation")[0] as any;
			const isReload = navEntry?.type === "reload";

			const currentTabs = JSON.parse(localStorage.getItem(TAB_KEY) || "[]");
			const updatedTabs = currentTabs.filter((id: number) => id !== tabId);

			if (isReload) {
				sessionStorage.removeItem(STORAGE_KEY);
			}

			if (!isReload && updatedTabs.length === 0) {
				sessionStorage.removeItem(STORAGE_KEY);
				localStorage.removeItem(TAB_KEY);
			} else {
				localStorage.setItem(TAB_KEY, JSON.stringify(updatedTabs));
			}
		};

		window.addEventListener("unload", handleUnload);

		return () => {
			window.removeEventListener("unload", handleUnload);
		};
	}, []);

	const uniqueRequestOwners = useMemo(() => {
		const owners = allJobRequestsForFilter
			.map((r) => r.requestOwnerName)
			.filter((name): name is string => Boolean(name));
		const uniqueMap = new Map();
		owners.forEach((name) => uniqueMap.set(name, name));
		return Array.from(uniqueMap.values()).map((name: string) => ({
			id: name,
			label: name,
		}));
	}, [allJobRequestsForFilter]);

	const uniqueJobTitles = useMemo(() => {
		const titles = allJobRequestsForFilter
			.map((r) => r.jobTitle)
			.filter((title): title is NonNullable<typeof title> => title !== null && title !== undefined && title.value !== undefined);
		const uniqueMap = new Map();
		titles.forEach((t) => uniqueMap.set(t.value, t));
		return Array.from(uniqueMap.values()).map((t: any) => ({
			id: t.value,
			label: t.label,
		}));
	}, [allJobRequestsForFilter]);

	const uniqueNumberOfPositions = useMemo(() => {
		const positions = allJobRequestsForFilter
			.map((r) => r.numberOfResources)
			.filter((pos): pos is number => pos !== undefined && pos !== null);
		const uniqueMap = new Map();
		positions.forEach((pos) => uniqueMap.set(pos, pos));
		return Array.from(uniqueMap.values())
			.sort((a, b) => a - b)
			.map((pos: number) => ({
				id: pos,
				label: pos.toString(),
			}));
	}, [allJobRequestsForFilter]);

	const uniqueAssignedRecruiters = useMemo(() => {
		const recruiters = allJobRequestsForFilter
			.map((r) => r.assignedRecruiterName)
			.filter((name): name is string => Boolean(name));
		const uniqueMap = new Map();
		recruiters.forEach((name) => uniqueMap.set(name, name));
		return Array.from(uniqueMap.values()).map((name: string) => ({
			id: name,
			label: name,
		}));
	}, [allJobRequestsForFilter]);

	const uniqueJobRequestStatuses = useMemo(() => {
		if (jobRequestStatus && Array.isArray(jobRequestStatus)) {
			return jobRequestStatus.map((status: any) => ({
				id: status.value,
				label: status.label,
			}));
		}
		const statuses = allJobRequestsForFilter
			.map((r) => r.jobRequestStatus)
			.filter((status): status is NonNullable<typeof status> => status !== null && status !== undefined && status.value !== undefined);
		const uniqueMap = new Map();
		statuses.forEach((s) => uniqueMap.set(s.value, s));
		return Array.from(uniqueMap.values()).map((s: any) => ({
			id: s.value,
			label: s.label,
		}));
	}, [allJobRequestsForFilter, jobRequestStatus]);

	const displayData = useMemo(() => {
		if (!isAnyFilterActive) {
			return jobRequests ?? [];
		}
		const filtered = allJobRequestsForFilter.filter((r: RequestInterface) => {
			const ownerMatch =
				activeFilters!.requestOwner.length === 0 ||
				(r.requestOwnerName && activeFilters!.requestOwner.includes(r.requestOwnerName));
			const jobTitleMatch =
				activeFilters!.jobTitle.length === 0 ||
				(r.jobTitle && r.jobTitle.value !== undefined && activeFilters!.jobTitle.includes(r.jobTitle.value));
			const positionsMatch =
				activeFilters!.numberOfPositions.length === 0 ||
				(r.numberOfResources !== undefined &&
					r.numberOfResources !== null &&
					activeFilters!.numberOfPositions.includes(r.numberOfResources));
			const recruiterMatch =
				activeFilters!.assignedRecruiter.length === 0 ||
				(r.assignedRecruiterName &&
					activeFilters!.assignedRecruiter.includes(r.assignedRecruiterName));
			const statusMatch =
				activeFilters!.jobRequestStatus.length === 0 ||
				(r.jobRequestStatusId &&
					activeFilters!.jobRequestStatus.includes(r.jobRequestStatusId));
			return ownerMatch && jobTitleMatch && positionsMatch && recruiterMatch && statusMatch;
		});
		return filtered.slice(first, first + rows);
	}, [
		jobRequests,
		allJobRequestsForFilter,
		activeFilters,
		isAnyFilterActive,
		first,
		rows,
	]);

	const filteredJobRequests = displayData;

	useEffect(() => {
		dispatch(fetchMasterDataRequest());
		fetchPaginatedJobRequests(first, rows);
		if (activeFilters && totalCount && totalCount > rows && !isFilterDataFetched.current) {
			dispatch(fetchJobRequestRequest({ pageNumber: 1, pageSize: totalCount }));
			isFilterDataFetched.current = true;
		}
	}, [first, rows, dispatch, activeFilters, totalCount]);

	useEffect(() => {
		if (isFirstRender.current) {
			isFirstRender.current = false;
			if (searchTerm) {
				handleSearch();
			}
			return;
		}
		const delayDebounce = setTimeout(() => {
			setFirst(0); // Reset pagination when searching
			handleSearch();
		}, 500);
		return () => clearTimeout(delayDebounce);
	}, [searchTerm]);

	const handleSearch = () => {
		dispatch(
			searchJobRequestRequest({ pageNumber: 1, pageSize: rows, searchTerm })
		);
	};

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const onPageChange = (e: any) => {
		setFirst(e.first);
		setRows(e.rows);
	};

	const handlePageChange = (page: string) => {
		navigate(page);
	};

	return (
		<div className="relative w-full h-full bg-[#F6F6F6]">
			{loading && <AtsLoader />}
			<div className="min-w-[1024px]">
				{/* Header */}
				<MainPageHeader
					title={t("common.myJobRequests")}
					searchTerm={searchTerm}
					setSearchTerm={setSearchTerm}
					onCreate={() => handlePageChange("create-request")}
					onFilterOpen={handleFilterOpen}
				/>

				{/* Table Header */}
				<div className="grid grid-cols-[1fr_2fr_1fr_1fr_1fr_1.5fr_1fr] gap-4 items-center bg-[#F6F6F6] px-8 py-4 rounded-t-[24px] relative z-20 -mt-[60px] min-w-0">
					<span className="font-medium truncate min-w-0 max-w-full">
						Request Owner
					</span>
					<span className="font-medium truncate min-w-0 max-w-full">
						{t("common.postingTitle")}
					</span>
					<span className="font-medium truncate min-w-0 max-w-full">
						{t("common.jobTitle")}
					</span>
					<span className="font-medium truncate min-w-0 max-w-full">
						{t("common.numberOfPositions")}
					</span>
					<span className="font-medium truncate min-w-0 max-w-full">
						Assigned Recruiter
					</span>
					<span className="font-medium truncate min-w-0 max-w-full">
						Associated Job Opening
					</span>
					<span className="font-medium truncate min-w-0 max-w-full">
						{t("request.jobRequestsStatus")}
					</span>
				</div>


				{/* request List */}
				<div
					style={{ height: "calc(100vh - 208px)", overflowY: "auto" }}
					className={`border border-[#EFEFEF] ${!loading && filteredJobRequests.length > 0 ? "rounded-b-[10px]" : ""} bg-[#F6F6F6] relative z-10`}>
					<div className="grid grid-cols-1 gap-2 p-5">
						{filteredJobRequests.length > 0
							? filteredJobRequests.map((request: RequestInterface) => (
								<button
									type="button"
									key={`req-${request.id}-${request.positionTitle}`}
									onClick={() =>
										handlePageChange(`request-overview/${request.id}`)
									}
									className="grid grid-cols-[1fr_2fr_1fr_1fr_1fr_1.5fr_1fr] items-center bg-white rounded-l-[10px] transition duration-200 ease-in-out shadow-md hover:bg-gray-100 focus:outline-none cursor-pointer min-h-16">
									<div className="flex items-center border-r border-[#EFEFEF] px-4 py-3 min-w-0">
										<span className="truncate min-w-0 max-w-full">
											{request.requestOwnerName ?? t("common.none")}
										</span>
									</div>
									<div className="flex items-center gap-5 border-r border-[#EFEFEF] px-4 py-3 min-w-0">
										<img
											src={Briefcase}
											className="w-10 h-10 shrink-0"
											alt="Briefcase"
										/>
										<span className="font-semibold text-gray-800 truncate min-w-0 max-w-full">
											{request.positionTitle ?? t("common.none")}
										</span>
									</div>
									<div className="flex items-center border-r border-[#EFEFEF] px-4 py-3 min-w-0">
										<span className="truncate min-w-0 max-w-full">
											{request.jobTitle?.label ?? t("common.none")}
										</span>
									</div>
									<div className="flex items-center border-r border-[#EFEFEF] px-4 py-3 min-w-0">
										<span className="truncate min-w-0 max-w-full">
											{request.numberOfResources ?? t("common.none")}
										</span>
									</div>
									<div className="flex items-center border-r border-[#EFEFEF] px-4 py-3 min-w-0">
										<span className="truncate min-w-0 max-w-full">
											{request.assignedRecruiterName ?? t("common.none")}
										</span>
									</div>
									<div className="flex items-center border-r border-[#EFEFEF] px-4 py-3 min-w-0">
										<span className="truncate min-w-0 max-w-full">
											{request.jobOpeningPostingTitle ?? (request.jobOpportunityId ? request.positionTitle : null) ?? t("common.none")}
										</span>
									</div>
									<div className="flex items-center px-4 py-3 min-w-0 relative group">
										<span
											className={`text-sm font-medium px-3 py-1 rounded-full truncate min-w-0 max-w-full ${getStatusClasses(
												request.jobRequestStatusId ?? 0
											)}`}
										>
											{request.jobRequestStatus?.label ?? t("common.none")}
										</span>
										{request.jobRequestStatus?.label && (
											<div
												className="hidden group-hover:flex items-center absolute left-1/2 -translate-x-1/2 top-full mt-2 bg-white text-black text-xs px-4 py-2 rounded-2xl shadow-md z-30 whitespace-nowrap
													before:content-[''] before:absolute before:-top-2 before:left-1/2 before:-translate-x-1/2 before:border-l-8 before:border-r-8 before:border-b-8 before:border-l-transparent before:border-r-transparent before:border-b-white"
											>
												{request.jobRequestStatus.label}
											</div>
										)}
									</div>
								</button>
							))
							: !loading && (
								<EmptyState />
							)}
					</div>
				</div>
				{/* Pagination */}
				<AtsPaginator
					first={first}
					rows={rows}
					totalCount={
						isAnyFilterActive
							? allJobRequestsForFilter.filter((r: RequestInterface) => {
								const ownerMatch =
									activeFilters!.requestOwner.length === 0 ||
									(r.requestOwnerName &&
										activeFilters!.requestOwner.includes(r.requestOwnerName));
								const jobTitleMatch =
									activeFilters!.jobTitle.length === 0 ||
									(r.jobTitle && r.jobTitle.value !== undefined && activeFilters!.jobTitle.includes(r.jobTitle.value));
								const positionsMatch =
									activeFilters!.numberOfPositions.length === 0 ||
									(r.numberOfResources !== undefined &&
										r.numberOfResources !== null &&
										activeFilters!.numberOfPositions.includes(r.numberOfResources));
								const recruiterMatch =
									activeFilters!.assignedRecruiter.length === 0 ||
									(r.assignedRecruiterName &&
										activeFilters!.assignedRecruiter.includes(r.assignedRecruiterName));
								const statusMatch =
									activeFilters!.jobRequestStatus.length === 0 ||
									(r.jobRequestStatusId &&
										activeFilters!.jobRequestStatus.includes(r.jobRequestStatusId));
								return ownerMatch && jobTitleMatch && positionsMatch && recruiterMatch && statusMatch;
							}).length
							: totalCount || 0
					}
					onPageChange={onPageChange}
					hasDocuments={filteredJobRequests.length > 0}
				/>
			</div>

			<JobRequestFilterDrawer
				open={isFilterOpen}
				initialValues={activeFilters}
				onClose={() => setIsFilterOpen(false)}
				onApply={(filters) => {
					setActiveFilters(filters);
					setFirst(0);
				}}
				onReset={() => {
					setActiveFilters(null);
					setFirst(0);
					setIsFilterOpen(false);
				}}
				requestOwners={uniqueRequestOwners}
				jobTitles={uniqueJobTitles}
				numberOfPositions={uniqueNumberOfPositions}
				assignedRecruiters={uniqueAssignedRecruiters}
				jobRequestStatuses={uniqueJobRequestStatuses}
			/>
		</div>
	);
};

export default JobRequest;
