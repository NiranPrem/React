import { useNavigate, useParams } from "react-router-dom";
import EmptyState from "../../../../../shared/components/empty-state/EmptyState";
import { useDispatch, useSelector } from "react-redux";
import { useCallback, useEffect, useState, useRef, useMemo } from "react";
import { fetchCandidateByJobOpeningRequest } from "../../../../../store/reducers/candidateSlice";
import { MoreVertical, Plus } from "lucide-react";
import { Menu } from "primereact/menu";
import { useTranslation } from "react-i18next";
import type { RootState } from "../../../../../store/store";
import AtsPaginator from "../../../../../shared/components/ats-pagination/Pagination";
import AtsLoader from "../../../../../shared/components/ats-loader/AtsLoader";
import {
	formatDateTime,
	getStatusClasses,
} from "../../../../../services/common";
import { resetSelectedInterview } from "../../../../../store/reducers/interviewSlice";

const CandidatesTab = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { t } = useTranslation();
	const [first, setFirst] = useState(0);
	const [rows, setRows] = useState(10);

	const { loading, totalCount, jobOpeningCandidates } = useSelector(
		(state: RootState) => state.candidates
	);
	const { openingId } = useParams<{ openingId: string }>();

	const jobOpportunityId = Number.parseInt(openingId ?? "0");

	const filteredDocuments = jobOpeningCandidates ?? [];

	const fetchPaginatedCandidates = useCallback(
		(firstIndex: number, rowCount: number) => {
			const pageNumber = Math.floor(firstIndex / rowCount) + 1;
			const pageSize = rowCount;

			if (jobOpportunityId) {
				dispatch(
					fetchCandidateByJobOpeningRequest({
						pageNumber,
						pageSize,
						jobOpportunityId,
					})
				);
			}
		},
		[dispatch, jobOpportunityId]
	);

	// Fetch only when jobOpportunityId exists
	useEffect(() => {
		if (jobOpportunityId) {
			fetchPaginatedCandidates(first, rows);
		}
	}, [fetchPaginatedCandidates, first, rows, jobOpportunityId]);

	const handlePageChange = (page: string) => {
		navigate(page);
	};

	const menuRight = useRef<Menu>(null);
	const [menuUser, setMenuUser] = useState<any>(null);

	const menuItems = useMemo(() => [
		{
			label: t("candidates.initiateScreening"),
			command: () => {
				if (menuUser) {
					dispatch(resetSelectedInterview());
					handlePageChange("candidate/" + menuUser.candidateId + "/create-screening");
				}
			},
		},
	], [menuUser, t]);

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const onPageChange = (e: any) => {
		setFirst(e.first);
		setRows(e.rows);
	};

	return (
		<div className="w-full px-5 pt-5 bg-white rounded-lg">
			<div className="flex justify-between items-center mb-5 border-b border-[#F6F6F6] pb-2">
				<h2 className="text-lg font-semibold text-gray-900">
					{t("common.candidates")}
				</h2>
				<button
					type="button"
					onClick={() => handlePageChange("create-candidate")}
					className="rounded-lg hover:bg-[#4279f9e8] px-2 py-1 cursor-pointer bg-[#4278F9] flex items-center gap-2 text-white"
					aria-label="Edit">
					<Plus className="w-5 h-5" /> {t("common.add")}
				</button>
			</div>
			<div className="min-w-[1024px]">
				{loading && <AtsLoader />}
				{!loading && filteredDocuments?.length === 0 && (
					<div style={{ height: "calc(100vh - 384px)", overflowY: "auto" }}>
						<EmptyState />
					</div>
				)}
				{filteredDocuments.length > 0 && (
					<>
						<div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr] gap-4 items-center bg-[#F6F6F6] px-8 py-4 rounded-t-[10px] relative z-20 min-w-0">
							<span className="font-medium truncate min-w-0 max-w-full">
								{t("candidates.candidateName")}
							</span>
							<span className="font-medium truncate min-w-0 max-w-full">
								{t("common.postingTitle")}
							</span>
							<span className="font-medium truncate min-w-0 max-w-full">
								{t("candidates.candidateStage")}
							</span>
							<span className="font-medium truncate min-w-0 max-w-full">
								{t("candidates.modifiedTime")}
							</span>
							<span className="font-medium truncate min-w-0 max-w-full">
								{t("candidates.source")}
							</span>
							<span className="font-medium truncate min-w-0 max-w-full">
								{t("common.createdBy")}
							</span>
							<span className="font-medium truncate min-w-0 max-w-full">
								{t("candidates.candidateStatus")}
							</span>
							<span className="font-medium truncate min-w-0 max-w-full">
								AI Score
							</span>
						</div>

						{/* Scrollable Document List */}
						<div
							style={{ height: "calc(100vh - 478px)", overflowY: "auto" }}
							className="border border-[#EFEFEF] rounded-b-[10px] bg-[#F6F6F6] relative z-10"
							onScroll={(e) => menuRight.current?.hide(e)}
						>
							<div className="grid grid-cols-1 gap-2 p-5">
								{filteredDocuments.map((candidate) => (
									<div
										key={candidate.candidateId}
										onClick={() =>
											handlePageChange(
												"candidate-overview/" + candidate.candidateId
											)
										}
										className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr] items-center bg-white rounded-l-[10px] transition duration-200 ease-in-out shadow-md hover:bg-gray-100 focus:outline-none cursor-pointer min-h-16">
										<div className="flex items-center gap-5 border-r border-[#EFEFEF] px-4 py-3 min-w-0">
											<span className="font-semibold text-gray-800 truncate min-w-0 max-w-full">
												{candidate.firstName ?? t("common.none")}{" "}
												{candidate.lastName ?? ""}
											</span>
										</div>
										<div className="flex items-center gap-5 border-r border-[#EFEFEF] px-4 py-3 min-w-0">
											<span className="truncate min-w-0 max-w-full">
												{candidate?.jobOpportunity?.label ?? t("common.none")}
											</span>
										</div>
										<div className="flex items-center gap-5 border-r border-[#EFEFEF] px-4 py-3 min-w-0">
											<span className="truncate min-w-0 max-w-full">
												{candidate?.candidateStage?.label ?? t("common.none")}
											</span>
										</div>
										<div className="flex items-center gap-5 border-r border-[#EFEFEF] px-4 py-3 min-w-0">
											<span className="truncate min-w-0 max-w-full">
												{formatDateTime(candidate?.updatedDate, t) ??
													t("common.none")}
											</span>
										</div>
										<div className="flex items-center gap-5 border-r border-[#EFEFEF] px-4 py-3 min-w-0">
											<span className="truncate min-w-0 max-w-full">
												{candidate?.sourceDetails?.label ?? t("common.none")}
											</span>
										</div>
										<div className="flex items-center gap-5 border-r border-[#EFEFEF] px-4 py-3 min-w-0">
											<span className="truncate min-w-0 max-w-full">
												{candidate?.candidateOwnerDetails?.label ??
													t("common.none")}
											</span>
										</div>
										<div className="flex items-center gap-5 border-r border-[#EFEFEF] px-4 py-3 min-w-0">
											<span
												className={`text-sm font-medium px-3 py-1 rounded-full truncate min-w-0 max-w-full ${getStatusClasses(
													candidate.candidateStatusDetails?.value ?? 0
												)}`}>
												{candidate?.candidateStatusDetails?.label ??
													t("common.none")}
											</span>
										</div>
										<div className="flex items-center justify-between gap-5 px-4 py-3 min-w-0">
											<span className="truncate min-w-0 max-w-full">
												{candidate?.aiResumeMatchScore != null
													? `${candidate.aiResumeMatchScore}%`
													: "N/A"}
											</span>
											<button
												className="p-1 rounded-full hover:bg-gray-100 menu-toggle-btn cursor-pointer"
												onClick={(event) => {
													event.stopPropagation();
													setMenuUser(candidate);
													menuRight.current?.toggle(event);
												}}
											>
												<MoreVertical size={20} className="text-gray-500" />
											</button>
										</div>
									</div>
								))}
							</div>
						</div>
						<AtsPaginator
							first={first}
							rows={rows}
							totalCount={totalCount ?? 0}
							onPageChange={onPageChange}
							hasDocuments={filteredDocuments.length > 0}
						/>
						<Menu model={menuItems} popup ref={menuRight} appendTo={document.body} />
					</>
				)}
			</div>
		</div>
	);
};

export default CandidatesTab;
