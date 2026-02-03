import { useEffect, useRef, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
	fetchJobOpeningRequest,
	searchJobOpeningRequest,
} from "../../store/reducers/jobOpeningSlice";
import AtsLoader from "../../shared/components/ats-loader/AtsLoader";
import type { RootState } from "../../store/store";
import Briefcase from "../../assets/icons/brief-case.svg";
import User from "../../assets/icons/user.svg";
import EmptyState from "../../shared/components/empty-state/EmptyState";
import { useTranslation } from "react-i18next";
import AtsPaginator from "../../shared/components/ats-pagination/Pagination";
import MainPageHeader from "../../shared/components/main-page-header/MainPageHeader";
import { getStatusClasses } from "../../services/common";
import type { JobInterface } from "../../shared/interface/JobInterface";
import JobOpeningFilterDrawer, {
	type FilterValues,
} from "./job-opening-overview/components/JobOpeningFilterDrawer";


const JobOpening = () => {
	const isFirstRender = useRef(true);
	const isFilterDataLoaded = useRef(false);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { t } = useTranslation();
	const [first, setFirst] = useState(0);
	const [rows, setRows] = useState(15);
	const [searchTerm, setSearchTerm] = useState("");
	const [allPostingTitles, setAllPostingTitles] = useState<any[]>([]);
	const [allCreatedBy, setAllCreatedBy] = useState<any[]>([]);
	const [allStatuses, setAllStatuses] = useState<any[]>([]);
	const [allNumberOfPositions, setAllNumberOfPositions] = useState<any[]>([]);
	const [allNumberOfApplications, setAllNumberOfApplications] = useState<any[]>(
		[]
	);
	const [isFilterOpen, setIsFilterOpen] = useState(false);
	const [allJobOpeningsForFilter, setAllJobOpeningsForFilter] = useState<any[]>(
		[]
	);
	const [activeFilters, setActiveFilters] = useState<FilterValues | null>(null);

	const { jobOpenings, loading, totalCount } = useSelector(
		(state: RootState) => state.jobOpening
	);

	const fetchPaginatedJobs = (firstIndex: number, rowCount: number) => {
		const pageNumber = Math.floor(firstIndex / rowCount) + 1;
		if (searchTerm) {
			dispatch(
				searchJobOpeningRequest({ pageNumber, pageSize: rowCount, searchTerm })
			);
		} else {
			dispatch(fetchJobOpeningRequest({ pageNumber, pageSize: rowCount }));
		}
	};


	const handleFilterOpen = () => {
		setIsFilterOpen(true);
		if (
			!isFilterDataLoaded.current &&
			totalCount &&
			totalCount > rows
		) {
			dispatch(fetchJobOpeningRequest({ pageNumber: 1, pageSize: totalCount }));
			isFilterDataLoaded.current = true;
		}
	};

	useEffect(() => {
		if (jobOpenings && Array.isArray(jobOpenings)) {
			if (jobOpenings.length >= (totalCount || 0)) {
				setAllJobOpeningsForFilter(jobOpenings);
			} else if (allJobOpeningsForFilter.length === 0) {
				setAllJobOpeningsForFilter(jobOpenings);
			}
		}
	}, [jobOpenings, totalCount, allJobOpeningsForFilter.length]);

	const isAnyFilterActive = useMemo(() => {
		if (!activeFilters) return false;
		return (
			activeFilters.postingTitle.length > 0 ||
			activeFilters.createdBy.length > 0 ||
			activeFilters.statuses.length > 0 ||
			activeFilters.numberOfPositions.length > 0 ||
			activeFilters.numberOfApplications.length > 0
		);
	}, [activeFilters]);

	const displayData = useMemo(() => {
		if (!isAnyFilterActive) {
			return jobOpenings ?? [];
		}
		const filtered = allJobOpeningsForFilter.filter((job: any) => {
			const postingTitleMatch =
				activeFilters!.postingTitle.length === 0 ||
				(job.postingTitle &&
					activeFilters!.postingTitle.includes(job.postingTitle));
			const createdByMatch =
				activeFilters!.createdBy.length === 0 ||
				(job.createdBy && activeFilters!.createdBy.includes(job.createdBy));
			const statusMatch =
				activeFilters!.statuses.length === 0 ||
				(job.status &&
					job.status.value &&
					activeFilters!.statuses.includes(job.status.value));
			const positionsMatch =
				activeFilters!.numberOfPositions.length === 0 ||
				(job.numberOfPeople !== undefined &&
					job.numberOfPeople !== null &&
					activeFilters!.numberOfPositions.includes(job.numberOfPeople));
			const applicationsMatch =
				activeFilters!.numberOfApplications.length === 0 ||
				(job.numberOfApplications !== undefined &&
					job.numberOfApplications !== null &&
					activeFilters!.numberOfApplications.includes(
						job.numberOfApplications
					));

			return (
				postingTitleMatch &&
				createdByMatch &&
				statusMatch &&
				positionsMatch &&
				applicationsMatch
			);
		});
		return filtered.slice(first, first + rows);
	}, [
		jobOpenings,
		allJobOpeningsForFilter,
		activeFilters,
		isAnyFilterActive,
		first,
		rows,
	]);

	const filteredJobs = displayData;

	useEffect(() => {
		if (activeFilters) return;
		fetchPaginatedJobs(first, rows);
		if (
			activeFilters &&
			totalCount &&
			totalCount > rows &&
			!isFilterDataLoaded.current
		) {
			dispatch(fetchJobOpeningRequest({ pageNumber: 1, pageSize: totalCount }));
			isFilterDataLoaded.current = true;
		}
	}, [first, rows, activeFilters, dispatch, totalCount]);

	useEffect(() => {
		if (allJobOpeningsForFilter && allJobOpeningsForFilter.length > 0) {
			setAllPostingTitles((prev) => {
				const currentTitles = allJobOpeningsForFilter
					.map((job: any) => job.postingTitle)
					.filter(Boolean)
					.map((title: string) => ({ value: title, label: title }));
				const combined = [...prev, ...currentTitles];
				return Array.from(
					new Map(combined.map((item) => [item?.value, item])).values()
				);
			});
			setAllCreatedBy((prev) => {
				const currentCreatedBy = allJobOpeningsForFilter
					.map((job: any) => job.createdBy)
					.filter(Boolean)
					.map((id: number) => ({ value: id, label: id.toString() }));
				const combined = [...prev, ...currentCreatedBy];
				return Array.from(
					new Map(combined.map((item) => [item?.value, item])).values()
				);
			});
			setAllStatuses((prev) => {
				const currentStatuses = allJobOpeningsForFilter
					.map((job: any) => job.status)
					.filter(Boolean);
				const combined = [...prev, ...currentStatuses];
				return Array.from(
					new Map(combined.map((item) => [item?.value, item])).values()
				);
			});
			setAllNumberOfPositions((prev) => {
				const currentPositions = allJobOpeningsForFilter
					.map((job: any) => job.numberOfPeople)
					.filter((num: any) => num !== undefined && num !== null)
					.map((num: number) => ({ value: num, label: num.toString() }));
				const combined = [...prev, ...currentPositions];
				return Array.from(
					new Map(combined.map((item) => [item?.value, item])).values()
				);
			});
			setAllNumberOfApplications((prev) => {
				const currentApplications = allJobOpeningsForFilter
					.map((job: any) => job.numberOfApplications)
					.filter((num: any) => num !== undefined && num !== null)
					.map((num: number) => ({ value: num, label: num.toString() }));
				const combined = [...prev, ...currentApplications];
				return Array.from(
					new Map(combined.map((item) => [item?.value, item])).values()
				);
			});
		}
	}, [allJobOpeningsForFilter]);

	useEffect(() => {
		if (activeFilters) setFirst(0);
	}, [activeFilters]);

	const uniquePostingTitles = useMemo(
		() => allPostingTitles.map((d: any) => ({ id: d.value, label: d.label })),
		[allPostingTitles]
	);

	const uniqueCreatedBy = useMemo(
		() => allCreatedBy.map((r: any) => ({ id: r.value, label: r.label })),
		[allCreatedBy]
	);

	const uniqueStatuses = useMemo(
		() => allStatuses.map((r: any) => ({ id: r.value, label: r.label })),
		[allStatuses]
	);

	const uniqueNumberOfPositions = useMemo(
		() =>
			allNumberOfPositions.map((r: any) => ({ id: r.value, label: r.label })),
		[allNumberOfPositions]
	);

	const uniqueNumberOfApplications = useMemo(
		() =>
			allNumberOfApplications.map((r: any) => ({
				id: r.value,
				label: r.label,
			})),
		[allNumberOfApplications]
	);

	const handleSearch = () => {
		dispatch(
			searchJobOpeningRequest({ pageNumber: 1, pageSize: rows, searchTerm })
		);
	};

	useEffect(() => {
		if (isFirstRender.current) {
			isFirstRender.current = false;
			return;
		}
		const delayDebounce = setTimeout(() => {
			setFirst(0);
			handleSearch();
		}, 500);
		return () => clearTimeout(delayDebounce);
	}, [searchTerm]);

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
			{/* Header */}
			<div className="min-w-[1024px]">
				<MainPageHeader
					title={t("common.myJobOpenings")}
					searchTerm={searchTerm}
					setSearchTerm={setSearchTerm}
					onCreate={() => handlePageChange("create-job-opening")}
					onFilterOpen={handleFilterOpen}
				/>
				<JobOpeningFilterDrawer
					open={isFilterOpen}
					onClose={() => setIsFilterOpen(false)}
					onApply={(filters) => {
						setActiveFilters(filters);
						setFirst(0);
					}}
					onReset={() => {
						if (isAnyFilterActive) {
							setActiveFilters(null);
							setFirst(0);
						}
						setIsFilterOpen(false);
					}}
					postingTitle={uniquePostingTitles}
					createdBy={uniqueCreatedBy}
					statuses={uniqueStatuses}
					numberOfPositions={uniqueNumberOfPositions}
					numberOfApplications={uniqueNumberOfApplications}
				/>
				{/* Table Header */}
				<div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-4 items-center bg-[#F6F6F6] px-8 py-4 rounded-t-[24px] relative z-20 -mt-[60px] min-w-0">
					<span className="font-medium truncate min-w-0 max-w-full">
						{t("common.postingTitle")}
					</span>
					<span className="font-medium truncate min-w-0 max-w-full">
						{t("common.numberOfPositions")}
					</span>
					<span className="font-medium truncate min-w-0 max-w-full">
						{t("jobOpenings.numberOfApplications")}
					</span>
					<span className="font-medium truncate min-w-0 max-w-full">
						Created by
					</span>
					<span className="font-medium truncate min-w-0 max-w-full">
						{t("jobOpenings.jobOpeningStatus")}
					</span>
				</div>

				{/* Job List */}
				<div
					style={{ height: "calc(100vh - 208px)", overflowY: "auto" }}
					className="border border-[#EFEFEF] rounded-b-[10px] bg-[#F6F6F6] relative z-10">
					<div className="grid grid-cols-1 gap-2 p-5">
						{filteredJobs.length > 0
							? filteredJobs.map((job: JobInterface) => (
								<button
									type="button"
									key={job.jobOpportunityId}
									onClick={() =>
										handlePageChange(
											"opening-overview/" + job.jobOpportunityId
										)
									}
									className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr] items-center bg-white rounded-l-[10px] transition duration-200 ease-in-out shadow-md hover:bg-gray-100 focus:outline-none cursor-pointer min-h-16">
									<div className="flex items-center gap-5 border-r border-[#EFEFEF] px-4 py-3 min-w-0">
										<img
											src={Briefcase}
											className="w-10 h-10 shrink-0"
											alt="Briefcase"
										/>
										<span className="font-semibold text-gray-800 truncate min-w-0 max-w-full">
											{job?.postingTitle ?? t("common.none")}
										</span>
									</div>
									<div className="flex items-center border-r border-[#EFEFEF] px-4 py-3 min-w-0">
										<span className="truncate min-w-0 max-w-full">
											{job.numberOfPeople ?? 0}
										</span>
									</div>
									<div className="flex items-center gap-2 border-r border-[#EFEFEF] px-4 py-3 min-w-0">
										<img src={User} className="w-5 h-5" alt="User" />
										<span className="truncate min-w-0 max-w-full">
											{job.numberOfApplications ?? 0}
										</span>
									</div>
									<div className="flex items-center gap-2 border-r border-[#EFEFEF] px-4 py-3 min-w-0">
										<span className="truncate min-w-0 max-w-full">
											{job?.createdBy ?? t("common.none")}
										</span>
									</div>
									<div className="flex items-center px-5 py-3 min-w-0">
										<span
											className={`text-sm font-medium px-3 py-1 rounded-full truncate min-w-0 max-w-full ${getStatusClasses(
												job.status?.value ?? 0
											)}`}>
											{job?.status?.label ?? t("common.none")}
										</span>
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
						isAnyFilterActive || searchTerm
							? allJobOpeningsForFilter.filter((job: any) => {
								const postingTitleMatch =
									activeFilters!.postingTitle.length === 0 ||
									(job.postingTitle &&
										activeFilters!.postingTitle.includes(job.postingTitle));
								const createdByMatch =
									activeFilters!.createdBy.length === 0 ||
									(job.createdBy &&
										activeFilters!.createdBy.includes(job.createdBy));
								const statusMatch =
									activeFilters!.statuses.length === 0 ||
									(job.status &&
										job.status.value &&
										activeFilters!.statuses.includes(job.status.value));
								const positionsMatch =
									activeFilters!.numberOfPositions.length === 0 ||
									(job.numberOfPeople !== undefined &&
										job.numberOfPeople !== null &&
										activeFilters!.numberOfPositions.includes(
											job.numberOfPeople
										));
								const applicationsMatch =
									activeFilters!.numberOfApplications.length === 0 ||
									(job.numberOfApplications !== undefined &&
										job.numberOfApplications !== null &&
										activeFilters!.numberOfApplications.includes(
											job.numberOfApplications
										));

								return (
									postingTitleMatch &&
									createdByMatch &&
									statusMatch &&
									positionsMatch &&
									applicationsMatch
								);
							}).length
							: totalCount ?? 0
					}
					onPageChange={onPageChange}
					hasDocuments={filteredJobs.length > 0}
				/>
			</div>
		</div>
	);
};

export default JobOpening;
