import { useEffect, useState } from "react";
import PenSvg from "../../../../assets/icons/pen.svg";
import closeLogo from "../../../../assets/icons/x-close.svg";

import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import type { RootState } from "../../../../store/store";
import {
	interviewDecisionRequest,
	resetInterviewEditState,
} from "../../../../store/reducers/interviewSlice";
import CreateUpdateInterviews from "../../../../shared/components/create-update-interviews/CreateUpdateInterviews";
import DetailsCard from "./DetailsCard";
import EmailComposeModal from "../../../../shared/components/email-compose-modal/EmailComposeModal";
import CreateUpdateScreening from "../../../../shared/components/create-update-screening/CreateUpdateScreening";
import DetailsCardScreening from "./DetailsCardScreening";

const OverviewTab = () => {
	const { t } = useTranslation();
	const [isEdit, setIsEdit] = useState(false);
	const [showEmailModal, setShowEmailModal] = useState(false);
	const [decisionType, setDecisionType] = useState<"ACCEPT" | "REJECT" | null>(
		null
	);
	const dispatch = useDispatch();
	const { editSuccess } = useSelector((state: RootState) => state.interviews);
	const { user } = useSelector((state: RootState) => state.auth);
	const { selectedInterview, success: decisionSuccess } = useSelector(
		(state: RootState) => state.interviews
	);

	const openDecisionModal = (type: "ACCEPT" | "REJECT") => {
		setDecisionType(type);
		setShowEmailModal(true);
	};

	const closeDecisionModal = () => {
		setShowEmailModal(false);
		setDecisionType(null);
	};

	const handleEdit = () => {
		dispatch(resetInterviewEditState());
		setIsEdit((prev) => !prev);
	};

	const handleSendEmail = (emailData: {
		to: string;
		subject: string;
		body: string;
	}) => {
		if (!decisionType) return;

		if (!selectedInterview?.interviewId) {
			return;
		}

		const fromEmail = import.meta.env.VITE_EMAIL_FROM_ADDRESS;

		dispatch(
			interviewDecisionRequest({
				interviewId: selectedInterview.interviewId,
				status: decisionType,
				comments: "",
				emailDetails: {
					to: emailData.to,
					fromEmail,
					subject: emailData.subject,
					body: emailData.body,
				},
			})
		);

		closeDecisionModal();
	};

	useEffect(() => {
		if (editSuccess) {
			setIsEdit(false);
		}
	}, [editSuccess, dispatch]);

	return (
		<>
			{isEdit && (
				<div className="w-full bg-[#F6F6F6] rounded-lg ">
					<div
						style={{ height: "calc(100vh - 313px)", overflowY: "auto" }}
						className="pr-1">
						<div className="flex justify-between items-center p-3 bg-white mb-5">
							<h1 className="text-[18px] font-semibold">{selectedInterview?.isScreening ? "Update Screening" : "Update Interview"}</h1>
							<button
								type="button"
								className="rounded-lg hover:bg-[#F6F6F6] p-2 cursor-pointer"
								onClick={handleEdit}>
								<img src={closeLogo} className="w-5 h-5" alt="close" />
							</button>
						</div>
						{selectedInterview?.isScreening && (
							<CreateUpdateScreening />
						)}
						{!selectedInterview?.isScreening && (
							<CreateUpdateInterviews />
						)}
					</div>
				</div>
			)}
			{!isEdit && (
				<div className="w-full p-5 bg-white rounded-lg ">
					<div className="flex justify-between items-center mb-5 border-b border-[#F6F6F6] pb-2">
						<h2 className="text-lg font-semibold text-gray-900">
							{t("common.basicInfo")}
						</h2>
						<div className="flex items-center gap-3">
							{user?.role.includes("HRADMIN") &&
								user?.role.includes("RECRUITER") &&
								!decisionSuccess && (
									<>
										<button
											type="button"
											onClick={() => openDecisionModal("ACCEPT")}
											className="rounded-lg px-3 py-1 bg-[#4278F9] text-white">
											Accept
										</button>

										<button
											type="button"
											onClick={() => openDecisionModal("REJECT")}
											className="rounded-lg px-3 py-1 bg-[#ef4444] text-white">
											Reject
										</button>
									</>
								)}
							{user?.role.includes("HRADMIN") && (
								<button
									type="button"
									onClick={handleEdit}
									className="rounded-lg hover:bg-[#F6F6F6] p-2 cursor-pointer"
									aria-label="Edit">
									{!isEdit && (
										<img src={PenSvg} className="w-5 h-5" alt="pen" />
									)}
								</button>
							)}
						</div>
					</div>
					<div style={{ height: "calc(100vh - 405px)", overflowY: "auto" }}>
						{selectedInterview?.isScreening ? (
							<DetailsCardScreening />
						) : (
							<DetailsCard />
						)}
					</div>
				</div>
			)}
			<EmailComposeModal
				open={showEmailModal}
				onClose={closeDecisionModal}
				onSend={handleSendEmail}
				senderEmail={import.meta.env.VITE_EMAIL_FROM_ADDRESS}
				key={decisionType}
				isInterview
			/>
		</>
	);
};

export default OverviewTab;
