import { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { TabMenu } from "primereact/tabmenu";
import { useDispatch, useSelector } from "react-redux";
import OverviewTab from "./components/overview-tab/OverviewTab";
import DocumentsTab from "./components/documents-tab/DocumentsTab";
import HistoryTab from "./components/history-tab/HistoryTab";
import InterviewsTab from "./components/interviews-tab/InterviewsTab";
import CandidatesTab from "./components/candidates-tab/CandidatesTab";
import OffersTab from "./components/offers-tab/OffersTab";
import HiringsTab from "./components/hirings-tab/HiringsTab";
import type { TabMenuTabChangeEvent } from "primereact/tabmenu";
import "./OpeningOverview.css";
import type { RootState } from "../../../store/store";
import AtsLoader from "../../../shared/components/ats-loader/AtsLoader";
import { useTranslation } from "react-i18next";
import DetailsCarousel from "../../../shared/components/ats-details-carousel/DetailsCarousel";
import { Dropdown, type DropdownChangeEvent } from "primereact/dropdown";
import { fetchMasterDataRequest } from "../../../store/reducers/masterDataSlice";
import { getStatusClasses } from "../../../services/common";
import CustomConfirmDialog from "../../../shared/components/custom-confirm-dialog/CustomConfirmDialog";
import alertIcon from "../../../assets/icons/info.svg";
import closeLogo from "../../../assets/icons/x-close.svg";
import PenSvg from "../../../assets/icons/pen.svg";
import {
	fetchJobOpeningByIdRequest,
	updateJobOpeningStatusRequest,
} from "../../../store/reducers/jobOpeningSlice";

const OpeningOverview = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const items = [
		{ label: t("common.overview") },
		{ label: t("common.documents") },
		{ label: t("common.interviews") },
		{ label: t("common.candidates") },
		{ label: t("common.offers") },
		{ label: t("common.hirings") },
		{ label: t("common.history") },
	];

	const [searchParams, setSearchParams] = useSearchParams();
	const initialTabIndex = Number.parseInt(searchParams.get("tab") ?? "0", 10);

	const [activeIndex, setActiveIndex] = useState(initialTabIndex);
	const [formData, setFormData] = useState<{ jobStatusId: number }>({
		jobStatusId: 0,
	});
	const [statusDialogVisible, setStatusDialogVisible] = useState(false);
	const [isEditingStatus, setIsEditingStatus] = useState(false);

	const { openingId } = useParams<{ openingId: string }>();
	const { editSuccess } = useSelector((state: RootState) => state.jobOpening);
	const { selectedJobOpening, loading } = useSelector(
		(state: RootState) => state.jobOpening
	);

	const { loading: masterDataLoading, status } = useSelector(
		(state: RootState) => state.masterData
	);

	const { loading: hiringManagerLoading } = useSelector(
		(state: RootState) => state.hiringManager
	);

	const { loading: assignedRecruiterLoading } = useSelector(
		(state: RootState) => state.assignedRecruiter
	);

	// Define the tab components to be rendered based on the active index
	const tabComponents = useMemo(
		() => [
			<OverviewTab key="overview" />,
			<DocumentsTab key="documents" />,
			<InterviewsTab key="interviews" />,
			<CandidatesTab key="candidates" />,
			<OffersTab key="offers" />,
			<HiringsTab key="hirings" />,
			<HistoryTab key="history" />,
		],
		[]
	);

	const statusOptions = useMemo(() => {
		if (!status || !Array.isArray(status)) return [];

		const currentStatusId = selectedJobOpening?.statusId;
		const IN_PROGRESS_ID = 1;
		const CLOSED_ID = 2;
		const ON_HOLD_ID = 3;

		return (status as { label?: string; value?: number }[])
			.filter((s) => {
				if (s.value === currentStatusId) return false;
				if (s.value === ON_HOLD_ID || s.value === CLOSED_ID) return true;
				if (
					(currentStatusId === ON_HOLD_ID || currentStatusId === CLOSED_ID) &&
					s.value === IN_PROGRESS_ID
				)
					return true;
				return false;
			})
			.map((s) => ({ label: s.label, value: s.value }));
	}, [status, selectedJobOpening]);

	const handleTabChange = (e: TabMenuTabChangeEvent) => {
		setActiveIndex(e.index);
		setSearchParams({ tab: e.index.toString() }, { replace: true });
	};

	const confirmStatusUpdate = () => {
		if (selectedJobOpening) {
			dispatch(
				updateJobOpeningStatusRequest({
					jobOpportunityId: selectedJobOpening.jobOpportunityId as number,
					statusId: formData.jobStatusId,
				})
			);
		}
	};

	const handleNavigate = () => {
		navigate(-1);
	};

	// This effect is used to fetch the job opening details based on the ID from the URL parameters
	useEffect(() => {
		dispatch(fetchMasterDataRequest());
		if (openingId) {
			dispatch(fetchJobOpeningByIdRequest({ openingId }));
		}
	}, [dispatch, openingId]);

	useEffect(() => {
		if (editSuccess) {
			setStatusDialogVisible(false);
			setIsEditingStatus(false);

			dispatch(fetchJobOpeningByIdRequest({ openingId: openingId ?? "" }));
		}
	}, [editSuccess, dispatch]);

	return (
		<div className="relative w-full text-[#181818] bg-white min-w-[1024px]">
			{(loading ||
				masterDataLoading ||
				hiringManagerLoading ||
				assignedRecruiterLoading) && <AtsLoader />}

			<CustomConfirmDialog
				visible={statusDialogVisible}
				onHide={() => setStatusDialogVisible(false)}
				onConfirm={confirmStatusUpdate}
				title={t("common.confirmStatusChange")}
				subTitle={t("common.areYouSureYouWantToChangeStatus")}
				icon={alertIcon}
			/>

			<div className="flex justify-between items-center p-4 border-b bg-white border-[#EFEFEF]">
				<div className="flex items-center gap-3 min-w-0">
					<h1 className="text-[22px] font-semibold truncate max-w-[400px]">
						{selectedJobOpening?.postingTitle ?? t("jobOpenings.jobOpening")}
					</h1>
					{selectedJobOpening?.status?.label && (
						<span
							className={`text-sm font-medium px-3 py-1 rounded-full truncate ${getStatusClasses(
								Number(selectedJobOpening?.statusId ?? 0)
							)}`}>
							{selectedJobOpening?.status?.label ?? t("common.none")}
						</span>
					)}

					{selectedJobOpening?.statusId !== 0 && (
						<>
							{!isEditingStatus && (
								<button
									type="button"
									onClick={() => setIsEditingStatus(true)}
									className="rounded-lg hover:bg-[#F6F6F6] p-2 cursor-pointer"
									aria-label="Edit">
									<img src={PenSvg} className="w-5 h-5" alt="edit" />
								</button>
							)}

							{isEditingStatus && (
								<Dropdown
									value={formData.jobStatusId}
									options={statusOptions}
									placeholder="Select status"
									onChange={(e: DropdownChangeEvent) => {
										setFormData({
											...formData,
											jobStatusId: e.value as number,
										});
										setStatusDialogVisible(true);
									}}
									onHide={() => setIsEditingStatus(false)}
								/>
							)}
						</>
					)}
				</div>
				<button
					type="button"
					className="rounded-lg hover:bg-[#F6F6F6] p-2 cursor-pointer"
					onClick={handleNavigate}>
					<img src={closeLogo} className="w-7 h-7" alt="close" />
				</button>
			</div>

			{/* Carousel with Arrows */}
			<DetailsCarousel />

			{/* Tabs */}
			<div className="w-full px-5 bg-[#F6F6F6]">
				<TabMenu
					model={items}
					activeIndex={activeIndex}
					onTabChange={handleTabChange}
				/>
				<div
					className="overflow-y-auto"
					style={{ height: "calc(100vh - 300px)" }}>
					{tabComponents[activeIndex] ?? (
						<p>{t("common.noContentAvailable")}</p>
					)}
				</div>
			</div>
		</div>
	);
};

export default OpeningOverview;
