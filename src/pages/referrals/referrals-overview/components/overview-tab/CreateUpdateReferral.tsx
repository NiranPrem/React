import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "primereact/button";
import type { RootState } from "../../../../../store/store";
import TrashSvg from "../../../../../assets/icons/trash.svg";

import {
  fetchMasterDataRequest,
  fetchMasterJobOpeningRequest,
} from "../../../../../store/reducers/masterDataSlice";
import {
  DropdownField,
  InputTextField,
  PhoneField,
  RichTextField,
} from "../../../../../shared/components/ats-inputs/Inputs";
import "./CreateUpdateReferral.css";
import { useNavigate, useParams } from "react-router-dom";
import {
  addReferralRequest,
  updateReferralRequest,
} from "../../../../../store/reducers/referralSlice";
import { checkDuplicateCandidateRequest } from "../../../../../store/reducers/candidateSlice";
import type { ReferralInterface } from "../../../../../shared/interface/ReferralInterface";
import FileUploadBlock from "../../../../../shared/components/file-list/FileUploadBlock";
import CustomConfirmDialog from "../../../../../shared/components/custom-confirm-dialog/CustomConfirmDialog";
import toastService from "../../../../../services/toastService";
import { useTranslation } from "react-i18next";
import AtsLoader from "../../../../../shared/components/ats-loader/AtsLoader";

const CreateUpdateReferral = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const { referralId } = useParams<{ referralId: string }>();
  const {
    relationship,
    noticePeriod,
    jobOpenings,
    loading: masterDataLoading,
  } = useSelector((state: RootState) => state.masterData);
  const { selectedReferral, loading, success } = useSelector(
    (state: RootState) => state.referrals
  );
  const { isDuplicateCandidate } = useSelector(
    (state: RootState) => state.candidates
  );

  const [pendingPayload, setPendingPayload] =
    useState<ReferralInterface | null>(null);
  const [isCheckingDuplicate, setIsCheckingDuplicate] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<{
    type: "resumeFile";
    index: number;
  } | null>(null);

  const [isMobileValid, setIsMobileValid] = useState(true);

  useEffect(() => {
    dispatch(fetchMasterDataRequest());
    dispatch(fetchMasterJobOpeningRequest());
  }, [dispatch]);

  const [formData, setFormData] = useState<ReferralInterface>({
    createdDate: new Date().toISOString(),
  });

  useEffect(() => {
    if (selectedReferral) {
      setFormData({
        jobOpportunityId: selectedReferral?.jobOpportunityId,
        firstName: selectedReferral?.firstName,
        lastName: selectedReferral?.lastName,
        email: selectedReferral?.email,
        mobile: selectedReferral?.mobile,
        currentEmployer: selectedReferral?.currentEmployer,
        currentJobTitle: selectedReferral?.currentJobTitle,
        relationshipId: selectedReferral?.relationshipId,
        noticePeriodId: selectedReferral?.noticePeriodId,
        notes: selectedReferral?.notes,
        createdDate: selectedReferral?.createdDate,
        status: selectedReferral?.status,
      });
    }
  }, [selectedReferral]);

  useEffect(() => {
    if (referralId && !selectedReferral?.referralId) {
      setFormData({
        jobOpportunityId: Number.parseInt(referralId),
      });
    }
    if (success && !loading && !selectedReferral?.referralId) {
      navigate(-1);
    }
  }, [
    success,
    loading,
    dispatch,
    navigate,
    selectedReferral?.referralId,
    referralId,
  ]);

  useEffect(() => {
    if (isCheckingDuplicate && isDuplicateCandidate !== null) {
      setIsCheckingDuplicate(false);
      if (isDuplicateCandidate) {
        toastService.showWarn(t("common.candidateAlreadyExists"));
        setPendingPayload(null);
      } else {
        if (pendingPayload) {
          dispatch(addReferralRequest(pendingPayload));
          setPendingPayload(null);
        }
      }
    }
  }, [isDuplicateCandidate, isCheckingDuplicate, pendingPayload, dispatch, t]);

  // Handle form submittion
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    const trimHtml = (html?: string) => {
      if (!html) return undefined;
      let s = html;
      s = s.replace(/^(&nbsp;|\s)+/g, "");
      s = s.replace(/^(<p[^>]*>)(&nbsp;|\s)+/gi, "$1");
      s = s.replace(/(&nbsp;|\s)+$/g, "");
      s = s.replace(/(&nbsp;|\s)+(<\/p>)$/gi, "$2");

      return s.trim();
    };

    const payload: ReferralInterface = {
      jobOpportunityId: formData?.jobOpportunityId,
      firstName: formData?.firstName?.trim(),
      lastName: formData?.lastName?.trim(),
      email: formData?.email,
      mobile: formData?.mobile,
      currentEmployer: formData?.currentEmployer?.trim(),
      currentJobTitle: formData?.currentJobTitle?.trim(),
      relationshipId: formData?.relationshipId,
      noticePeriodId: formData?.noticePeriodId,
      notes: trimHtml(formData?.notes),
      documents: formData?.resumeFile?.[0] ?? undefined,
    };
    if (selectedReferral?.referralId) {
      payload.referralId = selectedReferral.referralId;
      dispatch(updateReferralRequest(payload));
    } else {
      payload.createdDate = formData.createdDate;
      if (payload.jobOpportunityId && payload.email) {
        setPendingPayload(payload);
        dispatch(
          checkDuplicateCandidateRequest({
            jobOpportunityId: payload.jobOpportunityId,
            email: payload.email,
            mobile: payload.mobile ?? "",
          })
        );
        setIsCheckingDuplicate(true);
      } else {
        dispatch(addReferralRequest(payload));
      }
    }
  };

  // Check if form is valid
  const isFormValid = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isEmailValid =
      formData.email &&
      formData.email.length <= 50 &&
      emailRegex.test(formData.email);

    const isFirstNameValid =
      formData.firstName && formData.firstName.length <= 50;
    const isLastNameValid = formData.lastName && formData.lastName.length <= 50;
    const isCurrentEmployerValid =
      !formData.currentEmployer || formData.currentEmployer.length <= 20;
    const isCurrentJobTitleValid =
      !formData.currentJobTitle || formData.currentJobTitle.length <= 20;
    // Helper to strip HTML tags for length check on notes
    const getNotesLength = (html?: string) => {
      if (!html) return 0;
      const textContent = html.replace(/<[^>]*>/g, "");
      return textContent.length;
    };
    const isNotesValid = getNotesLength(formData.notes) <= 500;

    const commonValidations =
      formData.jobOpportunityId &&
      isFirstNameValid &&
      isLastNameValid &&
      isEmailValid &&
      formData.relationshipId &&
      formData.noticePeriodId &&
      isCurrentEmployerValid &&
      isCurrentJobTitleValid &&
      isNotesValid &&
      isMobileValid;

    if (selectedReferral) {
      return commonValidations;
    } else {
      return commonValidations && (formData.resumeFile?.length ?? 0) > 0;
    }
  };

  const resumeConfirm = (index: number) => {
    setDeleteTarget({ type: "resumeFile", index });
    setDeleteDialogVisible(true);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* --- Job Recommendation --- */}
      {(loading || masterDataLoading) && <AtsLoader />}
      <div className="space-y-6 py-5 px-4 bg-white rounded-2xl">
        <h2 className="text-lg font-semibold mb-2">
          {t("referrals.jobRecommendation")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <DropdownField
            label={`${t("referrals.referringJob")} *`}
            placeholder={t("referrals.referringJob")}
            valueKey="jobOpportunityId"
            options={jobOpenings}
            formData={formData}
            setFormData={setFormData}
            required
          />
        </div>
      </div>

      {/* --- Candidate Information --- */}
      <div className="space-y-6 py-5 px-4 bg-white rounded-2xl">
        <h2 className="text-lg font-semibold mb-2">
          {t("referrals.candidateInformation")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InputTextField
            label={`${t("common.firstName")} *`}
            placeholder={t("common.firstName")}
            valueKey="firstName"
            formData={formData}
            setFormData={setFormData}
            required
            max={50}
            allowedPattern={
              /^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?\s]*$/
            }
          />
          <InputTextField
            label={`${t("common.lastName")} *`}
            placeholder={t("common.lastName")}
            valueKey="lastName"
            formData={formData}
            setFormData={setFormData}
            required
            max={50}
            allowedPattern={
              /^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?\s]*$/
            }
          />
          <InputTextField
            label={`${t("common.email")} *`}
            placeholder={t("common.email")}
            valueKey="email"
            formData={formData}
            setFormData={setFormData}
            required
            type="email"
            max={50}
          />
          <PhoneField
            label={t("common.mobile")}
            valueKey="mobile"
            formData={formData}
            setFormData={setFormData}
            setIsValid={setIsMobileValid}
          />
          <InputTextField
            label={t("common.currentEmployer")}
            valueKey="currentEmployer"
            formData={formData}
            setFormData={setFormData}
            max={20}
            allowedPattern={
              /^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?\s]*$/
            }
          />
          <InputTextField
            label={t("common.currentJobTitle")}
            valueKey="currentJobTitle"
            formData={formData}
            setFormData={setFormData}
            max={20}
            allowedPattern={
              /^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?\s]*$/
            }
          />
        </div>
      </div>

      {/* --- Description Section --- */}
      <div className="space-y-6 py-5 px-4 bg-white rounded-2xl">
        <h2 className="text-lg font-semibold mb-2">
          {t("referrals.additionalInformation")}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <DropdownField
            label={`${t("referrals.relationship")} *`}
            placeholder={t("referrals.relationship")}
            valueKey="relationshipId"
            options={relationship}
            formData={formData}
            setFormData={setFormData}
            required
          />
          <DropdownField
            label={`${t("common.noticePeriod")} *`}
            placeholder={t("common.noticePeriod")}
            valueKey="noticePeriodId"
            options={noticePeriod}
            formData={formData}
            setFormData={setFormData}
            required
          />
        </div>
        <RichTextField
          label={t("referrals.notes")}
          valueKey="notes"
          formData={formData}
          setFormData={setFormData}
          maxLength={500}
        />
      </div>

      {/* --- Attachment Section --- */}
      {!selectedReferral?.referralId && (
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
              if (deleteTarget.type === "resumeFile") {
                const updated = [...(formData.resumeFile || [])];
                updated.splice(deleteTarget.index, 1);
                setFormData({ ...formData, resumeFile: updated });
              }
              setDeleteDialogVisible(false);
            }}
          />
          <h2 className="text-lg font-semibold mb-2">
            {t("common.attachmentInformation")}
          </h2>
          <div className="flex flex-col gap-4 items-start">
            {/* Resume Upload */}
            <FileUploadBlock
              label={`${t("common.resume")} *`}
              inputId="resumeFile"
              files={formData.resumeFile || []}
              onFilesChange={(newFiles) => {
                if (newFiles.length > 0) {
                  setFormData((prev) => ({
                    ...prev,
                    resumeFile: [newFiles[0]],
                  })); // ✅ enforce single file
                }
              }}
              onConfirm={(index) => resumeConfirm(index)}
              typeId={7}
              required
              maxFileSize={5 * 1024 * 1024}
              maxFileSizeMessage="Maximum file size allowed is 5 MB."
              maxFileCount={1}
              maxFileCountMessage="File count exceeded."
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
            onClick={() => {
              setFormData({
                firstName: "",
              });
            }}
          />
          <Button
            type="submit"
            label={t("common.save")}
            className="!bg-[#007BFF]"
            disabled={loading || !isFormValid()}
          />
        </div>
      </div>
    </form>
  );
};

export default CreateUpdateReferral;
