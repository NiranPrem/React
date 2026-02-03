import { useTranslation } from "react-i18next";
import EmptyState from "../../../../../shared/components/empty-state/EmptyState";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../../../../store/store";
import { useCallback, useEffect, useState, useRef } from "react";
import AtsLoader from "../../../../../shared/components/ats-loader/AtsLoader";
import { useNavigate, useParams } from "react-router-dom";
import {
	fileToBase64,
	formatDate,
	getStatusClasses,
} from "../../../../../services/common";
import AtsPaginator from "../../../../../shared/components/ats-pagination/Pagination";
import {
	addJobOfferLetterRequest,
	fetchJobOfferLetterRequest,
	fetchJobOfferLetterPreviewByIdRequest,
} from "../../../../../store/reducers/jobOfferLetterSlice";
import EmailComposeModal from "../../../../../shared/components/email-compose-modal/EmailComposeModal";
import { fetchCandidateByJobOpeningRequest } from "../../../../../store/reducers/candidateSlice";

const OffersTab = () => {
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const [first, setFirst] = useState(0);
	const [rows, setRows] = useState(10);
	const [showEmailModal, setShowEmailModal] = useState(false);

	const { user } = useSelector((state: RootState) => state.auth);
	const { loading, totalCount, selectedJobOffer, jobOfferLetterList } =
		useSelector((state: RootState) => state.jobOfferLetter);
	const filteredDocuments = jobOfferLetterList ?? [];

	const { openingId } = useParams<{ openingId: string }>();
	const jobOpeningId = Number.parseInt(openingId ?? "0");

	const fetchPaginatedOfferLetter = useCallback(
		(firstIndex: number, rowCount: number) => {
			const pageNumber = Math.floor(firstIndex / rowCount) + 1;
			const pageSize = rowCount;

			if (jobOpeningId) {
				dispatch(
					fetchJobOfferLetterRequest({
						pageNumber,
						pageSize,
						jobOpportunityId: jobOpeningId,
					})
				);
			}
		},
		[dispatch, jobOpeningId]
	);

	const openModal = () => {
		setShowEmailModal(true);
	};
	const closeModal = () => {
		setShowEmailModal(false);
	};
	const handlePageChange = (page: string) => {
		navigate(page);
	};

	const handleCandidateSelectionChange = (candidateId: string) => {
		dispatch(fetchJobOfferLetterPreviewByIdRequest({ candidateId }));
	};

	const onPageChange = (e: any) => {
		setFirst(e.first);
		setRows(e.rows);
	};

	const handleSendEmail = async (payload: {
		to: string;
		subject: string;
		body: string;
		tentativeJoiningDate?: string;
		expiryDate?: string;
		candidateId?: string;
		signature?: string;
		documents?: File[];
	}) => {
		if (!jobOpeningId || !payload.candidateId) return;
		// Convert File objects to Base64File objects
		const base64Files = payload.documents
			? await Promise.all(
				payload.documents.map(async (file) => {
					const base64 = await fileToBase64(file);
					return {
						name: file.name,
						size: file.size,
						format: file.type,
						typeId: 2, // Type for offer letters
						base64: base64,
					};
				})
			)
			: [];
		dispatch(
			addJobOfferLetterRequest({
				jobOpportunityId: jobOpeningId,
				candidateId: Number(payload.candidateId),
				emailSubject: payload.subject,
				emailBody: payload.body,
				signature: payload.signature,
				tentativeJoiningDate: payload.tentativeJoiningDate,
				responseExpiresOn: payload.expiryDate,
				offerLetterDocuments: base64Files,
			})
		);

		closeModal();
	};

	useEffect(() => {
		if (jobOpeningId) {
			fetchPaginatedOfferLetter(first, rows);
		}
	}, [fetchPaginatedOfferLetter, first, rows, jobOpeningId]);

	useEffect(() => {
		if (jobOpeningId) {
			dispatch(
				fetchCandidateByJobOpeningRequest({
					pageNumber: 0,
					pageSize: 0,
					jobOpportunityId: jobOpeningId,
				})
			);
		}
	}, [dispatch, jobOpeningId]);

	return (
		<div className="w-full px-5 pt-5 bg-white rounded-lg">
			<div className="flex justify-between items-center mb-5 border-b border-[#F6F6F6] pb-2">
				<h2 className="text-lg font-semibold text-gray-900">
					{t("common.offers")}
				</h2>
				{user?.role.includes("HRADMIN") && (
					<button
						type="button"
						onClick={() => openModal()}
						className="rounded-lg hover:bg-[#4279f9e8] px-2 py-1 cursor-pointer bg-[#4278F9] flex ju items-center gap-2 text-white"
						aria-label="Edit">
						Offer Letter
					</button>
				)}
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
						<div className="grid grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr] gap-4 items-center bg-[#F6F6F6] px-8 py-4 rounded-t-[10px] relative z-20 min-w-0">
							<span className="font-medium truncate min-w-0 max-w-full">
								Candidate name
							</span>
							<span className="font-medium truncate min-w-0 max-w-full">
								Tentative Date of joining
							</span>
							<span className="font-medium truncate min-w-0 max-w-full">
								Offer Rollout Date
							</span>
							<span className="font-medium truncate min-w-0 max-w-full">
								Applicant accepted Date
							</span>
							<span className="font-medium truncate min-w-0 max-w-full">
								Joining Date
							</span>
							<span className="font-medium truncate min-w-0 max-w-full">
								Status
							</span>
						</div>
						{/* Scrollable Document List */}
						<div
							style={{ height: "calc(100vh - 478px)", overflowY: "auto" }}
							className="border border-[#EFEFEF] rounded-b-[10px] bg-[#F6F6F6] relative z-10">
							<div className="grid grid-cols-1 gap-2 p-5">
								{filteredDocuments.map((jobOffer) => (
									<div
										key={jobOffer.candidateId}
										className="grid grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr] items-center bg-white rounded-l-[10px] transition duration-200 ease-in-out shadow-md hover:bg-gray-100 focus:outline-none min-h-16">
										<div className="flex items-center gap-5 border-r border-[#EFEFEF] px-4 py-3 min-w-0">
											<button
												type="button"
												className="font-semibold truncate min-w-0 max-w-full text-[#1A73E8] cursor-pointer"
												onClick={() =>
													handlePageChange(
														"candidate-overview/" + jobOffer.candidateId
													)
												}>
												{jobOffer?.candidateName ?? t("common.none")}
											</button>
										</div>
										<div className="flex items-center border-r border-[#EFEFEF] px-4 py-3 min-w-0">
											<span className="truncate min-w-0 max-w-full">
												{formatDate(jobOffer?.tentativeJoiningDate, t) ??
													t("common.none")}
											</span>
										</div>
										<div className="flex items-center gap-2 border-r border-[#EFEFEF] px-4 py-3 min-w-0">
											<span className="truncate min-w-0 max-w-full">
												{formatDate(jobOffer?.offerRolloutDate, t) ??
													t("common.none")}
											</span>
										</div>
										<div className="flex items-center gap-2 border-r border-[#EFEFEF] px-4 py-3 min-w-0">
											<span className="truncate min-w-0 max-w-full">
												{formatDate(jobOffer?.applicantAcceptedDate, t) ??
													t("common.none")}
											</span>
										</div>
										<div className="flex items-center gap-2 border-r border-[#EFEFEF] px-4 py-3 min-w-0">
											<span className="truncate min-w-0 max-w-full">
												{formatDate(jobOffer?.tentativeJoiningDate, t) ??
													t("common.none")}
											</span>
										</div>
										<div className="flex items-center gap-2 border-r border-[#EFEFEF] px-4 py-3 min-w-0">
											<span
												className={`text-sm font-medium px-3 py-1 rounded-full truncate min-w-0 max-w-full ${getStatusClasses(
													jobOffer.status?.value ?? 0
												)}`}>
												{jobOffer?.status?.label ?? t("common.none")}
											</span>
										</div>
									</div>
								))}
							</div>
						</div>
						{/* Pagination */}
						<AtsPaginator
							first={first}
							rows={rows}
							totalCount={totalCount ?? 0}
							onPageChange={onPageChange}
							hasDocuments={filteredDocuments.length > 0}
						/>
					</>
				)}
			</div>
			{showEmailModal && (
				<EmailComposeModal
					open={showEmailModal}
					onClose={closeModal}
					onSend={handleSendEmail}
					senderEmail={import.meta.env.VITE_EMAIL_FROM_ADDRESS}
					isJobOffer
					onCandidateChange={handleCandidateSelectionChange}
					previewData={selectedJobOffer}
				/>
			)}
		</div>
	);
};

export default OffersTab;
