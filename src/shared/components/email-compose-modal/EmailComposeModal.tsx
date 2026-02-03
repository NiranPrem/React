import { useEffect, useState } from "react";
import {
	DateField,
	DropdownField,
	InputTextField,
	RichTextField,
} from "../ats-inputs/Inputs";
import { Button } from "primereact/button";
import CustomConfirmDialog from "../custom-confirm-dialog/CustomConfirmDialog";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store/store";
import { formatDate, formatDay } from "../../../services/common";
import { useRef } from "react";
import xClose from "../../../assets/icons/x-close.svg";

interface EmailComposeModalProps {
	open: boolean;
	onClose: () => void;
	onSend: (payload: {
		to: string;
		subject: string;
		body: string;
		tentativeJoiningDate?: string;
		expiryDate?: string;
		candidateId?: string;
		documents?: File[];
		signature?: string;
	}) => void;
	senderEmail: string;
	isJobOffer?: boolean;
	isInterview?: boolean;
	onUploadClick?: () => void;
	onCandidateChange?: (candidateId: string) => void;
	previewData?: any;
}

const EmailComposeModal = ({
	open,
	onClose,
	onSend,
	senderEmail,
	isJobOffer,
	isInterview,
	onCandidateChange,
	previewData,
}: EmailComposeModalProps) => {
	const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

	const { jobOpeningCandidates } = useSelector(
		(state: RootState) => state.candidates
	);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const prevCandidateIdRef = useRef<string | null>(null);
	const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
	const [previewTemplate, setPreviewTemplate] = useState("");

	const [interviewFormData, setInterviewFormData] = useState<
		Record<string, any>
	>({
		to: "",
		subject: "",
		body: "",
	});
	const [offerFormData, setOfferFormData] = useState<Record<string, any>>({
		to: "",
		subject: "",
		body: "",
		tentativeJoiningDate: "",
		expiryDate: "",
		candidateId: "",
		signature: "",
		documents: [],
	});
	const { loading: offerLoading } = useSelector(
		(state: RootState) => state.jobOfferLetter
	);
	const { loading: interviewLoading } = useSelector(
		(state: RootState) => state.interviews
	);
	const isLoading = isJobOffer ? offerLoading : interviewLoading;
	const candidateOptions = (jobOpeningCandidates ?? []).map((c: any) => ({
		label: `${c.firstName ?? ""} ${c.lastName ?? ""}`.trim() || "Unknown",
		value: c.candidateId,
		email: c.email,
	}));

	if (!open) return null;

	useEffect(() => {
		if (!isJobOffer) return;

		setPreviewTemplate(previewData?.data || "");
	}, [previewData, isJobOffer]);

	const dateReplacement = (
		template: string,
		joiningDate?: string,
		expiryDate?: string
	): string => {
		let updatedBody = template;
		if (joiningDate) {
			updatedBody = updatedBody.replace(
				/{{DATE_OF_JOIN}}/g,
				formatDate(joiningDate)
			);
			updatedBody = updatedBody.replace(
				/{{DAY_OF_JOIN}}/g,
				formatDay(joiningDate)
			);
		}
		if (expiryDate) {
			updatedBody = updatedBody.replace(
				/{{RESPOND_EXPRIY_DATE}}/g,
				formatDate(expiryDate)
			);

			updatedBody = updatedBody.replace(
				/{{RESPOND_EXPRIY_DAY}}/g,
				formatDay(expiryDate)
			);
		}
		return updatedBody;
	};

	useEffect(() => {
		if (!isJobOffer || !previewTemplate) return;
		const updatedBody = dateReplacement(
			previewTemplate,
			offerFormData.tentativeJoiningDate,
			offerFormData.expiryDate
		);
		setOfferFormData((prev) => ({
			...prev,
			body: updatedBody,
		}));
	}, [
		previewTemplate,
		offerFormData.tentativeJoiningDate,
		offerFormData.expiryDate,
		isJobOffer,
	]);

	const handleSendForInterview = () => {
		onSend({
			to: interviewFormData.to,
			subject: interviewFormData.subject,
			body: interviewFormData.body,
		});
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files ? Array.from(e.target.files) : [];
		if (files.length > 0) {
			setOfferFormData((prev) => ({
				...prev,
				documents: [...(prev.documents || []), ...files],
			}));
		}
		// Reset input value to allow selecting same file again
		e.target.value = "";
	};

	const removeFile = (index: number) => {
		setOfferFormData((prev) => ({
			...prev,
			documents: (prev.documents || []).filter(
				(_: File, i: number) => i !== index
			),
		}));
	};

	const handleSendForOfferLetter = () => {
		onSend({
			to: offerFormData.to,
			subject: offerFormData.subject,
			body: offerFormData.body,
			tentativeJoiningDate: offerFormData.tentativeJoiningDate,
			expiryDate: offerFormData.expiryDate,
			candidateId: offerFormData.candidateId,
			signature: offerFormData.signature,
			documents: offerFormData.documents,
		});
	};

	return (
		<div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
			{isJobOffer ? (
				<CustomConfirmDialog
					subTitle={"Are you sure you dont want to save this email?"}
					visible={deleteDialogVisible}
					onHide={() => setDeleteDialogVisible(false)}
					isConfirmationModal
					onConfirm={() => {
						setDeleteDialogVisible(false);
						onClose();
					}}
				/>
			) : null}
			<div
				style={{ width: "750px", height: "80vh" }}
				className="bg-white rounded-lg p-5 overflow-y-auto relative">
				<button
					type="button"
					onClick={onClose}
					className="absolute top-5 right-5 p-2 rounded-lg hover:bg-gray-100 cursor-pointer">
					<img src={xClose} className="w-5 h-5" alt="close" />
				</button>
				{/* Tentative Date of Joining */}
				{isJobOffer && (
					<>
						<h2 className="text-lg font-semibold mb-4 mt-2">Offer Letter</h2>
						<div className="grid grid-cols-2 gap-4">
							<DateField
								label="Tentative Date of Joining *"
								valueKey="tentativeJoiningDate"
								formData={offerFormData}
								setFormData={setOfferFormData}
							/>
							<DateField
								label="Expiry Date *"
								valueKey="expiryDate"
								formData={offerFormData}
								setFormData={setOfferFormData}
							/>
						</div>
					</>
				)}
				<h1 className="text-lg font-semibold mb-4 mt-2">Compose Email</h1>
				<div className="space-y-4">
					{/* FROM */}
					<InputTextField
						label="From"
						valueKey="from"
						formData={{ from: senderEmail }}
						setFormData={() => { }}
						disabled
					/>
					{/* Candidate Name */}
					{isJobOffer && (
						<DropdownField
							label="Candidate Name *"
							placeholder="candidate"
							valueKey="candidateId"
							options={candidateOptions}
							formData={offerFormData}
							setFormData={(updatedData) => {
								const candidateId = updatedData.candidateId;
								const selectedCandidate = candidateOptions.find(
									(c) => String(c.value) === String(candidateId)
								);
								setOfferFormData({
									...updatedData,
									to: selectedCandidate?.email ?? "",
								});
								if (
									candidateId &&
									onCandidateChange &&
									prevCandidateIdRef.current !== String(candidateId)
								) {
									prevCandidateIdRef.current = String(candidateId);
									onCandidateChange(String(candidateId));
								}
							}}
						/>
					)}
					{/* TO */}
					<InputTextField
						label="To *"
						placeholder="to"
						valueKey="to"
						type="email"
						formData={isJobOffer ? offerFormData : interviewFormData}
						setFormData={isJobOffer ? setOfferFormData : setInterviewFormData}
						disabled={isJobOffer}
					/>
					{/* SUBJECT */}
					<InputTextField
						label="Subject *"
						placeholder="subject"
						valueKey="subject"
						formData={isJobOffer ? offerFormData : interviewFormData}
						setFormData={isJobOffer ? setOfferFormData : setInterviewFormData}
					/>
					{/* BODY */}
					{isInterview && (
						<RichTextField
							label="Body"
							valueKey="body"
							formData={interviewFormData}
							setFormData={setInterviewFormData}
						/>
					)}
					{/* BODY */}
					{isJobOffer && (
						<RichTextField
							label="Body *"
							valueKey="body"
							formData={offerFormData}
							setFormData={setOfferFormData}
						/>
					)}
					{/* Documents Upload */}
					{isJobOffer && (
						<>
							<label className="block text-black mb-1">Documents</label>
							<button
								type="button"
								onClick={() => fileInputRef.current?.click()}
								className="rounded-lg hover:bg-[#4279f9e8] px-3 py-2 cursor-pointer bg-[#4278F9] flex items-center gap-2 text-white text-sm w-fit">
								Upload Documents
							</button>
							<div className="flex flex-wrap gap-2 mb-2">
								{(offerFormData.documents || []).map(
									(file: File, index: number) => (
										<div
											key={`${file.name}-${index}`}
											className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full text-sm border border-gray-200">
											<span className="truncate max-w-[200px]">
												{file.name}
											</span>
											<button
												type="button"
												onClick={() => removeFile(index)}
												className="text-red-500 hover:text-red-700 font-bold">
												&times;
											</button>
										</div>
									)
								)}
							</div>
							<input
								type="file"
								ref={fileInputRef}
								onChange={handleFileChange}
								className="hidden"
								multiple
								accept=".pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
							/>
						</>
					)}
					{isJobOffer && (
						<RichTextField
							label="Signature"
							valueKey="signature"
							formData={offerFormData}
							setFormData={setOfferFormData}
						/>
					)}
				</div>
				<div className="flex justify-end gap-3 mt-6">
					<Button
						type="button"
						label="Cancel"
						severity="secondary"
						onClick={() =>
							isJobOffer ? setDeleteDialogVisible(true) : onClose()
						}
					/>
					<Button
						type="button"
						label="Send"
						disabled={
							isJobOffer
								? !offerFormData.to ||
								!offerFormData.tentativeJoiningDate ||
								!offerFormData.expiryDate ||
								!EMAIL_REGEX.test(offerFormData.to) ||
								!offerFormData.subject ||
								!offerFormData.body ||
								!offerFormData.candidateId ||
								isLoading
								: !interviewFormData.to ||
								!EMAIL_REGEX.test(interviewFormData.to) ||
								!interviewFormData.subject ||
								!interviewFormData.body ||
								isLoading
						}
						onClick={
							isJobOffer ? handleSendForOfferLetter : handleSendForInterview
						}
					/>
				</div>
			</div>
		</div>
	);
};

export default EmailComposeModal;
