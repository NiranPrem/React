import { useEffect, useState } from "react";
import PenSvg from "../../../../../assets/icons/pen.svg";
import closeLogo from "../../../../../assets/icons/x-close.svg";

import DetailsCard from "./DetailsCard";
import { useDispatch, useSelector } from "react-redux";
import {
	resetJobRequestEditState,
	updateJobRequestRequest,
	fetchJobRequestByIdRequest,
} from "../../../../../store/reducers/jobRequestSlice";
import type { RootState } from "../../../../../store/store";
import CreateUpdateJobRequest from "./CreateUpdateJobRequest";
import { useTranslation } from "react-i18next";
import { fetchAssignedRecruitersRequest } from "../../../../../store/reducers/assignedRecruiterSlice";
import {
	DropdownField,
	InputTextArea,
} from "../../../../../shared/components/ats-inputs/Inputs";
import { useNavigate, useParams } from "react-router-dom";
import type { RequestInterface } from "../../../../../shared/interface/RequestInterface";

const OverviewTab = () => {
	const { t } = useTranslation();
	const [isEdit, setIsEdit] = useState(false);
	const [showApprovePopover, setShowApprovePopover] = useState(false);
	const [showRejectPopover, setShowRejectPopover] = useState(false);
	const [approveForm, setApproveForm] = useState<{
		assignedRecruiterId: number;
		reason: string;
	}>({ assignedRecruiterId: 0, reason: "" });
	const [rejectForm, setRejectForm] = useState<{ reason: string }>({
		reason: "",
	});
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { editSuccess, selectedJobRequest } = useSelector(
		(state: RootState) => state.jobRequest
	);
	const { id } = useParams<{ id: string }>();
	const { assignedRecruiters } = useSelector(
		(state: RootState) => state.assignedRecruiter
	);
	const { user } = useSelector((state: RootState) => state.auth);

	const resetForms = () => {
		setApproveForm({
			assignedRecruiterId: 0,
			reason: "",
		});
		setRejectForm({ reason: "" });
	};

	const toggleApprovePopover = () => {
		setShowApprovePopover((prev) => !prev);
		setShowRejectPopover(false);
	};

	const toggleRejectPopover = () => {
		setShowRejectPopover((prev) => !prev);
		setShowApprovePopover(false);
	};

	const closePopovers = () => {
		setShowApprovePopover(false);
		setShowRejectPopover(false);
		resetForms();
	};

	const handleCreateJobOpening = () => {
		if (selectedJobRequest) {
			navigate("/jobs/create-job-opening", {
				state: {
					fromJobRequest: true,
					jobRequestData: selectedJobRequest,
				},
			});
		}
	};

	const showApproveRejectActions = selectedJobRequest?.jobRequestStatusId === 1;

	const showJobOpening = selectedJobRequest?.jobRequestStatusId === 2;

	const handleEdit = () => {
		dispatch(resetJobRequestEditState());
		setIsEdit((prev) => !prev);
	};

	const handleSubmit = (statusId: number) => {
		if (!selectedJobRequest) return;
		const payload: RequestInterface = {
			positionTitle: selectedJobRequest?.positionTitle,
			jobTitleId: selectedJobRequest?.jobTitleId,
			numberOfResources: selectedJobRequest?.numberOfResources,
			totalJobExperience: selectedJobRequest?.totalJobExperience,
			officeLocationId: selectedJobRequest?.officeLocationId,
			regionId: selectedJobRequest?.regionId,
			jobDescription: selectedJobRequest?.jobDescription,
			requirement: selectedJobRequest?.requirement,
			requiredSkills: selectedJobRequest.requiredSkills,
			createdDate: selectedJobRequest?.createdDate,
			jobRequestStatusId: statusId,
		};
		if (selectedJobRequest?.id) {
			payload.userId = user?.userId;
			payload.id = selectedJobRequest.id;
			if (statusId === 2) {
				payload.recruiterUserId = approveForm.assignedRecruiterId;
				payload.reason = approveForm.reason;
			}
			if (statusId === 3) {
				payload.recruiterUserId = null;
				payload.reason = rejectForm.reason;
			}
			if (statusId !== 2 && statusId !== 3) {
				payload.recruiterUserId = null;
				payload.reason = null;
			}
			dispatch(updateJobRequestRequest(payload));
			closePopovers();
		}
	};

	useEffect(() => {
		dispatch(fetchAssignedRecruitersRequest());
	}, [dispatch]);

	useEffect(() => {
		if (editSuccess) {
			setIsEdit(false);
			closePopovers();
			if (id) {
				dispatch(fetchJobRequestByIdRequest({ id }));
			}
		}
	}, [editSuccess, dispatch, id]);

	return (
		<>
			{isEdit && (
				<div className="w-full bg-[#F6F6F6] rounded-lg ">
					<div
						style={{ height: "calc(100vh - 315px)", overflowY: "auto" }}
						className="pr-1">
						<div className="flex justify-between items-center p-3 bg-white mb-5">
							<h1 className="text-[18px] font-semibold">
								{t("request.updateJobRequest")}
							</h1>
							<button
								type="button"
								className="rounded-lg hover:bg-[#F6F6F6] p-2 cursor-pointer"
								onClick={handleEdit}>
								<img src={closeLogo} className="w-5 h-5" alt="close" />
							</button>
						</div>
						<CreateUpdateJobRequest />
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
							{user?.role.includes("HRADMIN") && showApproveRejectActions && (
								<>
									<div className="relative">
										<button
											type="button"
											onClick={toggleApprovePopover}
											className="rounded-lg hover:bg-[#4279f9e8] px-3 py-1 cursor-pointer bg-[#4278F9] flex items-center gap-2 text-white"
											aria-label="Approve">
											Approve
										</button>
										{showApprovePopover && (
											<div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
												<div className="p-4 space-y-3">
													<DropdownField
														label={t("Assign Recruiter *")}
														valueKey="assignedRecruiterId"
														options={assignedRecruiters}
														formData={approveForm}
														setFormData={setApproveForm}
													/>
													<InputTextArea
														label="Reason"
														valueKey="reason"
														formData={approveForm}
														setFormData={setApproveForm}
													/>
													<div className="flex justify-end gap-2 pt-2">
														<button
															type="button"
															onClick={closePopovers}
															className="px-3 py-1 rounded-md border border-gray-200 text-gray-700 hover:bg-gray-50">
															{t("common.cancel")}
														</button>
														<button
															type="button"
															disabled={!approveForm.assignedRecruiterId}
															onClick={() => handleSubmit(2)}
															className={`px-3 py-1 rounded-md text-white ${approveForm.assignedRecruiterId
																? "bg-[#4278F9] hover:bg-[#3366d3]"
																: "bg-gray-300 cursor-not-allowed"
																}`}>
															Approve
														</button>
													</div>
												</div>
											</div>
										)}
									</div>
									<div className="relative">
										<button
											type="button"
											onClick={toggleRejectPopover}
											className="rounded-lg hover:bg-[#ef4444e6] px-3 py-1 cursor-pointer bg-[#ef4444] flex items-center gap-2 text-white"
											aria-label="Reject">
											Reject
										</button>
										{showRejectPopover && (
											<div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
												<div className="p-4 space-y-3">
													<InputTextArea
														label="Reason *"
														valueKey="reason"
														formData={rejectForm}
														setFormData={setRejectForm}
														required
													/>
													{!rejectForm.reason.trim() && (
														<p className="text-xs text-red-500">
															This field is required
														</p>
													)}
													<div className="flex justify-end gap-2 pt-2">
														<button
															type="button"
															onClick={closePopovers}
															className="px-3 py-1 rounded-md border border-gray-200 text-gray-700 hover:bg-gray-50">
															{t("common.cancel")}
														</button>
														<button
															type="button"
															disabled={!rejectForm.reason.trim()}
															onClick={() => handleSubmit(3)}
															className={`px-3 py-1 rounded-md text-white ${rejectForm.reason.trim()
																? "bg-[#ef4444] hover:bg-[#d43333]"
																: "bg-gray-300 cursor-not-allowed"
																}`}>
															Reject
														</button>
													</div>
												</div>
											</div>
										)}
									</div>
								</>
							)}
							{user?.role.includes("RECRUITER") && showJobOpening && (
								<button
									type="button"
									onClick={handleCreateJobOpening}
									className="rounded-lg hover:bg-[#10b981e6] px-3 py-1 cursor-pointer bg-[#10b981] flex items-center gap-2 text-white"
									aria-label="Create Job Opening">
									+ {t("jobOpenings.jobOpening")}
								</button>
							)}
							{showApproveRejectActions && (
								<button
									type="button"
									onClick={handleEdit}
									className="rounded-lg hover:bg-[#F6F6F6] p-2 cursor-pointer"
									aria-label="Edit">
									{!isEdit && <img src={PenSvg} className="w-5 h-5" alt="pen" />}
								</button>
							)}
						</div>
					</div>
					<div style={{ height: "calc(100vh - 405px)", overflowY: "auto" }}>
						<DetailsCard />
					</div>
				</div>
			)}
		</>
	);
};

export default OverviewTab;
