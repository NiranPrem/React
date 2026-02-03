import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "primereact/button";
import { Chips } from "primereact/chips";
import type { RootState } from "../../../../../store/store";
import {
	addJobOpeningRequest,
	updateJobOpeningRequest,
} from "../../../../../store/reducers/jobOpeningSlice";
import { fetchMasterDataRequest } from "../../../../../store/reducers/masterDataSlice";
import type { JobInterface } from "../../../../../shared/interface/JobInterface";
import {
	CheckboxField,
	DateField,
	DropdownField,
	InputNumberField,
	InputTextField,
	RichTextField,
} from "../../../../../shared/components/ats-inputs/Inputs";
import "./CreateUpdateJobOpening.css";
import { fetchHiringManagersRequest } from "../../../../../store/reducers/hiringManagerSlice";
import { fetchAssignedRecruitersRequest } from "../../../../../store/reducers/assignedRecruiterSlice";
import { useNavigate, useLocation } from "react-router-dom";
import FileUploadBlock from "../../../../../shared/components/file-list/FileUploadBlock";
import CustomConfirmDialog from "../../../../../shared/components/custom-confirm-dialog/CustomConfirmDialog";
import TrashSvg from "../../../../../assets/icons/trash.svg";
import { useTranslation } from "react-i18next";
import AtsLoader from "../../../../../shared/components/ats-loader/AtsLoader";
import { Dialog } from "primereact/dialog";
import { Checkbox } from "primereact/checkbox";
import type { RequestInterface } from "../../../../../shared/interface/RequestInterface";

const CreateUpdateJobOpening = () => {
	const { t } = useTranslation();
	const dropdownOptions = {
		requirementTypes: [
			{ label: t("common.new"), value: false },
			{ label: t("common.replacement"), value: true },
		],
	};
	const dispatch = useDispatch();
	const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
	const [deleteTarget, setDeleteTarget] = useState<{
		type: "jobSummary" | "otherFiles";
		index: number;
	} | null>(null);

	const {
		country,
		currency,
		departments,
		region,
		jobTitle,
		jobType,
		locations,
		salary,
		status,
		loading: masterDataLoading,
	} = useSelector((state: RootState) => state.masterData);
	const { hiringManagers, loading: hiringManagerLoading } = useSelector(
		(state: RootState) => state.hiringManager
	);
	const { assignedRecruiters, loading: assignedRecruiterLoading } = useSelector(
		(state: RootState) => state.assignedRecruiter
	);
	const { selectedJobOpening, loading, success } = useSelector(
		(state: RootState) => state.jobOpening
	);

	const [publishDialogVisible, setPublishDialogVisible] = useState(false);
	const [submitted, setSubmitted] = useState(false);
	const [selectedItems, setSelectedItems] = useState<number[]>([]);

	const publishOptions = [
		{ label: "Pits", value: 1 },
		{ label: "Linkedin", value: 2 },
		{ label: "Facebook", value: 3 },
		{ label: "Indeed", value: 4 },
		{ label: "Glassdoor", value: 5 },
		{ label: "Other", value: 6 },
	];

	const navigate = useNavigate();
	const location = useLocation();

	useEffect(() => {
		dispatch(fetchMasterDataRequest());
		dispatch(fetchHiringManagersRequest());
		dispatch(fetchAssignedRecruitersRequest());
	}, [dispatch]);

	const requirementTypes = dropdownOptions.requirementTypes.map((type) => ({
		label: type.label,
		value: type.value,
	}));

	const [formData, setFormData] = useState<JobInterface>({
		createdDate: new Date().toISOString(),
		expectedConclusionDate: new Date().toISOString(),
	});
	// Prefill form from job request if navigating from job request page
	useEffect(() => {
		const locationState = location.state as {
			fromJobRequest?: boolean;
			jobRequestData?: RequestInterface;
		} | null;
		if (
			locationState?.fromJobRequest &&
			locationState?.jobRequestData &&
			!selectedJobOpening
		) {
			const jobRequest = locationState.jobRequestData;
			setFormData({
				postingTitle: jobRequest?.positionTitle,
				jobTitleId: jobRequest?.jobTitleId ?? jobRequest?.jobTitle?.value,
				numberOfPeople: jobRequest?.numberOfResources,
				jobDescription: jobRequest?.jobDescription,
				requirements: jobRequest?.requirement,
				requiredSkills: jobRequest?.requiredSkills,
				jobRequestId: jobRequest?.id,
				createdDate: new Date().toISOString(),
				workExperiences: jobRequest?.totalJobExperience?.toString(),
				assignedRecruiterId: jobRequest?.recruiterUserId ?? undefined,
				regionId: jobRequest?.regionId,
				officeLocationId: jobRequest?.officeLocationId,
				hiringManagerId: jobRequest?.userId,
			});
		}
	}, [location.state, selectedJobOpening]);

	useEffect(() => {
		if (selectedJobOpening) {
			setFormData({
				postingTitle: selectedJobOpening?.postingTitle,
				jobTitleId: selectedJobOpening?.jobTitle?.value,
				departmentId: selectedJobOpening?.department?.value,
				regionId: selectedJobOpening?.region?.value,
				hiringManagerId: selectedJobOpening?.hiringManager?.value,
				assignedRecruiterId: selectedJobOpening?.assignedRecruiter?.value,
				workExperiences: selectedJobOpening?.workExperiences,
				jobTypeId: selectedJobOpening?.jobType?.value,
				statusId: selectedJobOpening?.status?.value,
				numberOfPeople: selectedJobOpening?.numberOfPeople,
				isReplacement: selectedJobOpening?.isReplacement,
				dateOpened: selectedJobOpening.dateOpened,
				targetDate: selectedJobOpening?.targetDate,
				officeLocationId: selectedJobOpening?.officeLocation?.value,
				currencyId: selectedJobOpening?.currencyDetails?.value,
				salaryId: selectedJobOpening?.salaryDetails?.value,
				remoteJob: selectedJobOpening?.remoteJob,
				city: selectedJobOpening?.addressInfo?.city,
				province: selectedJobOpening?.addressInfo?.province,
				countryId: selectedJobOpening?.addressInfo?.country?.value,
				postalCode: selectedJobOpening?.addressInfo?.postalCode,
				jobDescription: selectedJobOpening?.jobDescription,
				requirements: selectedJobOpening?.requirements,
				requiredSkills: selectedJobOpening?.requiredSkills,
				benefits: selectedJobOpening?.benefits,
				jobSummaryFile: selectedJobOpening?.jobSummaryFile,
				otherFiles: selectedJobOpening?.otherFiles,
				createdDate: selectedJobOpening?.createdDate,
				expectedConclusionDate: selectedJobOpening?.expectedConclusionDate,
				isPublished: selectedJobOpening?.isPublished,
			});
		}
	}, [selectedJobOpening]);

	useEffect(() => {
		if (success && !loading && !selectedJobOpening?.jobOpportunityId) {
			navigate(-1);
		}
		setPublishDialogVisible(false);
	}, [
		success,
		loading,
		dispatch,
		navigate,
		selectedJobOpening?.jobOpportunityId,
	]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setSubmitted(true);
		if (!isFormValid()) return;
		handleCreateUpdate(false);
	};

	const handleCreateUpdate = (publishStatus: boolean) => {
		if (!formData) return;
		const payload: JobInterface = {
			postingTitle: formData?.postingTitle,
			jobTitleId: formData?.jobTitleId,
			departmentId: formData?.departmentId,
			regionId: formData?.regionId,
			hiringManagerId: formData?.hiringManagerId,
			assignedRecruiterId: formData?.assignedRecruiterId,
			workExperiences: formData?.workExperiences,
			jobTypeId: formData?.jobTypeId,
			statusId: publishStatus ? 1 : formData?.statusId,
			numberOfPeople: formData?.numberOfPeople,
			isReplacement: formData?.isReplacement,
			dateOpened: formData?.dateOpened,
			targetDate: formData?.targetDate,
			officeLocationId: formData?.officeLocationId,
			currencyId: formData?.currencyId,
			salaryId: formData?.salaryId,
			remoteJob: formData?.remoteJob,
			jobDescription: formData?.jobDescription,
			requirements: formData?.requirements,
			requiredSkills: formData?.requiredSkills,
			benefits: formData?.benefits,
			expectedConclusionDate: formData?.expectedConclusionDate,
			jobRequestId: formData?.jobRequestId,
			addressInfo: {
				id: selectedJobOpening?.addressInfo?.id ?? 0,
				city: formData?.city as string | undefined,
				province: formData?.province as string | undefined,
				countryId: formData?.countryId as number | undefined,
				postalCode: formData?.postalCode as number | undefined,
			},
			publishPlatforms: selectedItems,
			isPublished: publishStatus ? publishStatus : formData?.isPublished,
		};
		if (selectedJobOpening?.jobOpportunityId) {
			payload.jobOpportunityId = selectedJobOpening.jobOpportunityId;
			dispatch(updateJobOpeningRequest(payload));
		} else {
			payload.createdDate = formData.createdDate;
			payload.documents = [
				...(formData.jobSummaryFile ?? []),
				...(formData.otherFiles ?? []),
			];
			dispatch(addJobOpeningRequest(payload));
		}
	};

	const isFormValid = () => {
		return (
			formData.postingTitle &&
			formData.jobTitleId &&
			formData.departmentId &&
			formData.regionId
		);
	};

	const jobSummaryConfirm = (index: number) => {
		setDeleteTarget({ type: "jobSummary", index });
		setDeleteDialogVisible(true);
	};

	const otherFilesConfirm = (index: number) => {
		setDeleteTarget({ type: "otherFiles", index });
		setDeleteDialogVisible(true);
	};

	const handlePublishConfirm = () => {
		setSubmitted(true);
		if (selectedItems.length === 0) {
			return;
		}
		if (!isFormValid()) return;
		handleCreateUpdate(true);
		// Additional logic for publishing can be added here
	};

	return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Dialog
        header="Choose Publishing platforms"
        visible={publishDialogVisible}
        style={{ width: "35rem" }}
        modal
        onHide={() => setPublishDialogVisible(false)}
        closeOnEscape
        draggable={false}
      >
        <div className="flex flex-col overflow-y-auto max-h-[500px] gap-4">
          {publishOptions.map((option) => (
            <div key={option.value} className="flex items-center gap-2">
              <Checkbox
                inputId={option.value.toString()}
                name="publishDepartments"
                value={option.value}
                onChange={(e) => {
                  const { checked, value } = e;
                  if (checked) {
                    setSelectedItems([...selectedItems, value]);
                  } else {
                    setSelectedItems(
                      selectedItems.filter((item) => item !== value)
                    );
                  }
                }}
                checked={selectedItems.includes(option.value)}
              />
              <label
                htmlFor={option.value.toString()}
                className="ml-2 cursor-pointer"
              >
                {option.label}
              </label>
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-3 mt-4">
          <Button
            type="button"
            label="Cancel"
            severity="secondary"
            onClick={() => setPublishDialogVisible(false)}
          />
          <Button
            type="button"
            label="Publish"
            icon="pi pi-check"
            disabled={selectedItems.length === 0}
            onClick={() => handlePublishConfirm()}
          />
        </div>
      </Dialog>

      {(loading ||
        hiringManagerLoading ||
        assignedRecruiterLoading ||
        masterDataLoading) && <AtsLoader />}
      {/* --- Job Opening Information --- */}
      <div className="space-y-6 py-5 px-4 bg-white rounded-2xl">
        <h2 className="text-lg font-semibold mb-2">
          {t("jobOpenings.jobOpeningInformation")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InputTextField
            label={t("common.postingTitle")}
            placeholder={t("common.postingTitle")}
            valueKey="postingTitle"
            formData={formData}
            max={50}
            allowedPattern={/^.{0,50}$/}
            setFormData={setFormData}
            required
            showError={submitted}
          />
          <DropdownField
            label={t("common.jobTitle")}
            placeholder={t("common.jobTitle")}
            valueKey="jobTitleId"
            options={jobTitle}
            formData={formData}
            setFormData={setFormData}
            required
            showError={submitted}
          />
          <DropdownField
            label={t("jobOpenings.departmentName")}
            placeholder={t("jobOpenings.departmentName")}
            valueKey="departmentId"
            options={departments}
            formData={formData}
            setFormData={setFormData}
            required
            showError={submitted}
          />
          <DropdownField
            label={t("common.region")}
            placeholder={t("common.region")}
            valueKey="regionId"
            options={region}
            formData={formData}
            setFormData={setFormData}
            required
            showError={submitted}
          />
          <DropdownField
            label={t("jobOpenings.hiringManager")}
            valueKey="hiringManagerId"
            options={hiringManagers}
            formData={formData}
            setFormData={setFormData}
          />
          <DropdownField
            label={t("jobOpenings.assignedRecruiter")}
            valueKey="assignedRecruiterId"
            options={assignedRecruiters}
            formData={formData}
            setFormData={setFormData}
          />
          <InputTextField
            label={t("jobOpenings.workExperiences")}
            valueKey="workExperiences"
            formData={formData}
            setFormData={setFormData}
            allowedPattern={/^[\d.\-]*$/}
            max={5}
            required
            showError={submitted}
          />
          <DropdownField
            label={t("jobOpenings.jobType")}
            valueKey="jobTypeId"
            options={jobType}
            formData={formData}
            setFormData={setFormData}
          />
          {/* Job Opening Status - hidden */}
          {/* 
                    <DropdownField
                      label={t("jobOpenings.jobOpeningStatus")}
                       valueKey="statusId"
                       options={status}
                       formData={formData}
                        setFormData={setFormData}
                      /> 
                     */}
          <InputNumberField
            label={t("common.numberOfPositions")}
            valueKey="numberOfPeople"
            formData={formData}
            min={1}
            maxLength={4}
            setFormData={setFormData}
          />
          <DropdownField
            label={t("jobOpenings.whetherNewRequirementOrReplacement")}
            valueKey="isReplacement"
            options={requirementTypes}
            formData={formData}
            setFormData={setFormData}
          />
          <DateField
            label={t("jobOpenings.dateOpened")}
            valueKey="dateOpened"
            formData={formData}
            setFormData={setFormData}
            minDate={new Date()}
          />
          <DateField
            label={t("jobOpenings.targetDate")}
            valueKey="targetDate"
            formData={formData}
            setFormData={setFormData}
            minDate={
              formData.dateOpened ? new Date(formData.dateOpened) : new Date()
            }
          />
          <DropdownField
            label={t("jobOpenings.location")}
            valueKey="officeLocationId"
            options={locations}
            formData={formData}
            setFormData={setFormData}
          />
          <DropdownField
            label={t("jobOpenings.currency")}
            valueKey="currencyId"
            options={currency}
            formData={formData}
            setFormData={setFormData}
          />
          <DropdownField
            label={t("jobOpenings.salary")}
            valueKey="salaryId"
            options={salary}
            formData={formData}
            setFormData={setFormData}
          />
        </div>
      </div>
      {/* --- Address Information --- */}
      <div className="space-y-6 py-5 px-4 bg-white rounded-2xl">
        <h2 className="text-lg font-semibold mb-2">
          {t("common.addressInformation")}
        </h2>
        <CheckboxField
          label={t("jobOpenings.remoteJob")}
          valueKey="remoteJob"
          formData={formData}
          setFormData={setFormData}
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InputTextField
            label={t("common.city")}
            valueKey="city"
            formData={formData}
            max={100}
            allowedPattern={/^.{0,100}$/}
            setFormData={setFormData}
          />
          <InputTextField
            label={t("common.province")}
            valueKey="province"
            formData={formData}
            max={100}
            allowedPattern={/^.{0,100}$/}
            setFormData={setFormData}
          />
          <DropdownField
            label={t("common.country")}
            valueKey="countryId"
            options={country}
            formData={formData}
            setFormData={setFormData}
          />
          <InputNumberField
            label={t("common.postalCode")}
            valueKey="postalCode"
            formData={formData}
            maxLength={999999999999}
            setFormData={setFormData}
          />
        </div>
      </div>
      {/* --- Description Section --- */}
      <div className="space-y-6 py-5 px-4 bg-white rounded-2xl">
        <h2 className="text-lg font-semibold mb-2">
          {t("common.descriptionInformation")}
        </h2>
        <RichTextField
          label={t("common.jobDescription")}
          valueKey="jobDescription"
          maxLength={1000}
          formData={formData}
          setFormData={setFormData}
          required
          showError={submitted}
        />
        <RichTextField
          label={t("common.requirements")}
          valueKey="requirements"
          maxLength={1000}
          formData={formData}
          setFormData={setFormData}
          required
          showError={submitted}
        />
        <div className="w-full skills-chips-wrapper">
          <label
            htmlFor="requiredSkillsChips"
            className="block text-gray-500 mb-1 required"
          >
            {t("common.requiredSkills")}
          </label>
          <Chips
            id="requiredSkillsChips"
            placeholder={t("common.addSkillInstruction")}
            value={formData.requiredSkills ?? undefined}
            separator=","
            onChange={(e) => {
              const joined = (e.value ?? []).join(",");
              if (joined.length <= 500) {
                setFormData({ ...formData, requiredSkills: e.value ?? [] });
              }
            }}
            className={`w-full ${
              submitted &&
              (!formData.requiredSkills || formData.requiredSkills.length === 0)
                ? "p-invalid"
                : ""
            }`}
          />
          {submitted &&
            (!formData.requiredSkills ||
              formData.requiredSkills.length === 0) && (
              <small className="text-red-500 text-xs">
                This field is required.
              </small>
            )}
        </div>
        <RichTextField
          label={t("jobOpenings.benefits")}
          valueKey="benefits"
          maxLength={500}
          formData={formData}
          setFormData={setFormData}
          required
          showError={submitted}
        />
      </div>
      {/* --- Attachment Section --- */}
      {!selectedJobOpening?.jobOpportunityId && (
        <div className="space-y-4 py-5 px-4 bg-white rounded-2xl">
          {/* <ConfirmDialog /> */}
          <CustomConfirmDialog
            title={t("common.deleteAttachment")}
            subTitle={t("common.addedDetailWillBeDeleted")}
            icon={TrashSvg}
            visible={deleteDialogVisible}
            onHide={() => setDeleteDialogVisible(false)}
            onConfirm={() => {
              if (!deleteTarget) return;
              if (deleteTarget.type === "jobSummary") {
                const updated = [...(formData.jobSummaryFile || [])];
                updated.splice(deleteTarget.index, 1);
                setFormData({ ...formData, jobSummaryFile: updated });
              } else {
                const updated = [...(formData.otherFiles || [])];
                updated.splice(deleteTarget.index, 1);
                setFormData({ ...formData, otherFiles: updated });
              }
              setDeleteDialogVisible(false);
            }}
          />
          <h2 className="text-lg font-semibold mb-2">
            {t("common.attachmentInformation")}
          </h2>
          <div className="flex flex-col gap-4 items-start">
            {/* Job Summary Upload */}
            <FileUploadBlock
              label={t("jobOpenings.jobSummary")}
              inputId="jobSummaryUpload"
              files={formData.jobSummaryFile || []}
              typeId={1}
              onFilesChange={(newFiles) => {
                setFormData((prev) => ({
                  ...prev,
                  jobSummaryFile: newFiles,
                }));
              }}
              onConfirm={(index) => jobSummaryConfirm(index)}
              required
              maxFileSize={5 * 1024 * 1024}
              maxFileSizeMessage="Maximum file size allowed is 5 MB per file."
              maxFileCount={2}
              maxFileCountMessage="You can upload a maximum of 2 files."
            />
            {/* Others Upload */}
            <FileUploadBlock
              label={t("common.others")}
              inputId="otherUpload"
              files={formData.otherFiles || []}
              typeId={2}
              onFilesChange={(newFiles) => {
                setFormData((prev) => ({
                  ...prev,
                  otherFiles: newFiles,
                }));
              }}
              onConfirm={(index) => otherFilesConfirm(index)}
              maxFileSize={5 * 1024 * 1024}
              maxFileSizeMessage="Maximum file size allowed is 5 MB per file."
              maxFileCount={5}
              maxFileCountMessage="You can upload a maximum of 5 files."
            />
          </div>
        </div>
      )}
      {/* --- Buttons --- */}
      <div className="flex justify-center gap-4 mt-4 mb-4">
        <div className="shadow-sm p-3 rounded-2xl flex gap-10 bg-white">
          <Button
            type="button"
            label={t("common.clear")}
            severity="secondary"
            outlined
            className="!bg-white !border !border-gray-300 !text-gray-700 !rounded-lg"
            onClick={() =>
              setFormData({
                postingTitle: "",
              })
            }
          />
          <Button
            type="submit"
            severity="contrast"
            label={selectedJobOpening ? "Update" : "Save as Draft"}
            disabled={loading}
          />
          <Button
            type="button"
            label={"Publish"}
            className="!bg-[#007BFF]"
            disabled={loading}
            onClick={() => setPublishDialogVisible(true)}
          />
        </div>
      </div>
    </form>
  );
};

export default CreateUpdateJobOpening;
