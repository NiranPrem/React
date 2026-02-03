import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "primereact/button";
import ToastService from "../../../services/toastService";
import {
  fetchMasterDataRequest,
  fetchMasterJobOpeningRequest,
  fetchUserDataRequest,
} from "../../../store/reducers/masterDataSlice";
import VectorSVG from "../../../assets/icons/vector.svg";

import {
  CheckboxField,
  DateField,
  DropdownField,
  InputNumberField,
  InputTextField,
  PhoneField,
} from "../ats-inputs/Inputs";
import "./CreateUpdateCandidate.css";
import { Chips } from "primereact/chips";
import PenSvg from "../../../assets/icons/pen.svg";
import EducationCard from "./EducationCard";
import ExperienceCard from "./ExperienceCard";
import {
  addCandidateRequest,
  updateCandidateRequest,
  checkDuplicateCandidateRequest,
} from "../../../store/reducers/candidateSlice";
import { useNavigate, useParams } from "react-router-dom";
import CustomConfirmDialog from "../custom-confirm-dialog/CustomConfirmDialog";
import TrashSvg from "../../../assets/icons/trash.svg";
import closeLogo from "../../../assets/icons/x-close.svg";
import type {
  CandidateInterface,
  EducationData,
  ExperienceData,
} from "../../interface/CandidateInterface";
import FileUploadBlock from "../file-list/FileUploadBlock";
import type { RootState } from "../../../store/store.ts";
import EducationSidebar from "./EducationSidebar.tsx";
import ExperienceSidebar from "./ExperienceSidebar.tsx";
import { useTranslation } from "react-i18next";
import AtsLoader from "../ats-loader/AtsLoader.tsx";

interface CreateUpdateCandidateProps {
  visibleSection?: "all" | "salaryAnnexure" | "basicInfo";
  onClose?: () => void;
}

const CreateUpdateCandidate = ({
  visibleSection = "all",
  onClose,
}: CreateUpdateCandidateProps) => {
  const { t } = useTranslation();
  const dropdownOptions = {
    yesOrNo: [
      { label: t("common.no"), value: false },
      { label: t("common.yes"), value: true },
    ],
  };
  const [isExperienceSidebarOpen, setIsExperienceSidebarOpen] = useState(false);
  const [isEducationSidebarOpen, setIsEducationSidebarOpen] = useState(false);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [educationalDetails, setEducationalDetails] = useState<EducationData[]>(
    []
  );
  const [pendingPayload, setPendingPayload] =
    useState<CandidateInterface | null>(null);
  const [isCheckingDuplicate, setIsCheckingDuplicate] = useState(false);
  const { openingId } = useParams<{ openingId: string }>();
  const [professionalDetails, setProfessionalDetails] = useState<
    ExperienceData[]
  >([]);
  const [deleteTarget, setDeleteTarget] = useState<{
    type: "otherFiles" | "contractUpload" | "coverLetterUpload" | "resumeFile";
    index: number;
  } | null>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    country,
    currency,
    qualification,
    salary,
    candidateStatus,
    source,
    users,
    jobOpenings,
    loading: masterDataLoading,
  } = useSelector((state: RootState) => state.masterData);
  const { selectedCandidate, loading, success, isDuplicateCandidate } =
    useSelector((state: RootState) => state.candidates);

  const yesOrNo = dropdownOptions.yesOrNo.map((type) => ({
    label: type.label,
    value: type.value,
  }));

  const filteredSource = Array.isArray(source)
    ? source.filter((item: any) => item.id !== 7 && item.value !== 7)
    : [];


  const [formData, setFormData] = useState<CandidateInterface>({
    createdDate: new Date().toISOString(),
    updatedDate: new Date().toISOString(),
  });

  const [errors, setErrors] = useState<{ secondaryEmail?: string }>({});
  const [isMobileValid, setIsMobileValid] = useState(true);
  const [isPhoneValid, setIsPhoneValid] = useState(true);

  useEffect(() => {
    if (openingId) {
      setFormData((prev) => ({
        ...prev,
        jobOpportunityId: Number.parseInt(openingId),
      }));
    }
    if (selectedCandidate) {
      setFormData({
        firstName: selectedCandidate?.firstName,
        lastName: selectedCandidate?.lastName,
        email: selectedCandidate?.email,
        mobile: selectedCandidate?.mobile,
        phone: selectedCandidate?.phone,
        fax: selectedCandidate?.fax,
        website: selectedCandidate?.website,
        secondaryEmail: selectedCandidate?.secondaryEmail,
        currencyId: selectedCandidate?.currencyId,
        street: selectedCandidate?.street,
        city: selectedCandidate?.city,
        province: selectedCandidate?.province,
        countryId: selectedCandidate?.countryId,
        postalCode: selectedCandidate?.postalCode,
        experience: selectedCandidate?.experience,
        qualificationId: selectedCandidate?.qualificationId,
        relevantExperience: selectedCandidate?.relevantExperience,
        currentEmployer: selectedCandidate?.currentEmployer,
        currentCtc: selectedCandidate?.currentCtc,
        currentSalary: selectedCandidate?.currentSalary,
        expectedCtc: selectedCandidate?.expectedCtc,
        isAlreadyAnApplicant: selectedCandidate?.isAlreadyAnApplicant,
        currentJobTitle: selectedCandidate?.currentJobTitle,
        noticePeriodDays: selectedCandidate?.noticePeriodDays,
        alternateOffer: selectedCandidate?.alternateOffer,
        currentLocation: selectedCandidate?.currentLocation,
        willingToWorkInTrivandrum: selectedCandidate?.willingToWorkInTrivandrum,
        expectedSalaryId: selectedCandidate?.expectedSalaryId,
        expectedDOJ: selectedCandidate?.expectedDOJ,
        skypeId: selectedCandidate?.skypeId,
        skillSet: selectedCandidate?.skillSet ?? [],
        jobOpportunityId: selectedCandidate?.jobOpportunityId,
        candidateStatusId: selectedCandidate?.candidateStatusId,
        sourceId: selectedCandidate?.sourceId,
        candidateOwnerId: selectedCandidate?.candidateOwnerId,
        emailOptOut: selectedCandidate?.emailOptOut ?? false,
        monthlyInputValue: selectedCandidate?.salaryAnnexure?.monthlyInputValue,
        annualCtcWords: selectedCandidate?.salaryAnnexure?.annualCtcWords,
        basicMonthly: selectedCandidate?.salaryAnnexure?.basicMonthly,
        basicAnnually: selectedCandidate?.salaryAnnexure?.basicAnnually,
        houseRentAllowanceMonthly:
          selectedCandidate?.salaryAnnexure?.houseRentAllowanceMonthly,
        houseRentAllowanceAnnually:
          selectedCandidate?.salaryAnnexure?.houseRentAllowanceAnnually,
        conveyanceAllowanceMonthly:
          selectedCandidate?.salaryAnnexure?.conveyanceAllowanceMonthly,
        conveyanceAllowanceAnnually:
          selectedCandidate?.salaryAnnexure?.conveyanceAllowanceAnnually,
        attireExpensesMonthly:
          selectedCandidate?.salaryAnnexure?.attireExpensesMonthly,
        attireExpensesAnnually:
          selectedCandidate?.salaryAnnexure?.attireExpensesAnnually,
        medicalAllowanceMonthly:
          selectedCandidate?.salaryAnnexure?.medicalAllowanceMonthly,
        medicalAllowanceAnnually:
          selectedCandidate?.salaryAnnexure?.medicalAllowanceAnnually,
        leaveTravelAllowanceMonthly:
          selectedCandidate?.salaryAnnexure?.leaveTravelAllowanceMonthly,
        leaveTravelAllowanceAnnually:
          selectedCandidate?.salaryAnnexure?.leaveTravelAllowanceAnnually,
        profPersuitExpenseMonthly:
          selectedCandidate?.salaryAnnexure?.profPersuitExpenseMonthly,
        profPersuitExpenseAnnually:
          selectedCandidate?.salaryAnnexure?.profPersuitExpenseAnnually,
        statutoryBonusMonthly:
          selectedCandidate?.salaryAnnexure?.statutoryBonusMonthly,
        statutoryBonusAnnually:
          selectedCandidate?.salaryAnnexure?.statutoryBonusAnnually,
        fixedAllowanceMonthly:
          selectedCandidate?.salaryAnnexure?.fixedAllowanceMonthly,
        fixedAllowanceAnnually:
          selectedCandidate?.salaryAnnexure?.fixedAllowanceAnnually,
        totalGrossMonthly: selectedCandidate?.salaryAnnexure?.totalGrossMonthly,
        totalGrossAnnually:
          selectedCandidate?.salaryAnnexure?.totalGrossAnnually,
        gratuityEmployerContributionMonthly:
          selectedCandidate?.salaryAnnexure
            ?.gratuityEmployerContributionMonthly,
        gratuityEmployerContributionAnnually:
          selectedCandidate?.salaryAnnexure
            ?.gratuityEmployerContributionAnnually,
        groupHealthInsuranceEmployerContributionMonthly:
          selectedCandidate?.salaryAnnexure
            ?.groupHealthInsuranceEmployerContributionMonthly,
        groupHealthInsuranceEmployerContributionAnnually:
          selectedCandidate?.salaryAnnexure
            ?.groupHealthInsuranceEmployerContributionAnnually,
        epfEmployerContributionMonthly:
          selectedCandidate?.salaryAnnexure?.epfEmployerContributionMonthly,
        epfEmployerContributionAnnually:
          selectedCandidate?.salaryAnnexure?.epfEmployerContributionAnnually,
        totalRetiralMonthly:
          selectedCandidate?.salaryAnnexure?.totalRetiralMonthly,
        totalRetiralAnnually:
          selectedCandidate?.salaryAnnexure?.totalRetiralAnnually,
        costToCompanyMonthly:
          selectedCandidate?.salaryAnnexure?.costToCompanyMonthly,
        costToCompanyAnnually:
          selectedCandidate?.salaryAnnexure?.costToCompanyAnnually,
        createdDate: selectedCandidate?.createdDate,
        updatedDate: selectedCandidate?.updatedDate,
        linkedin: selectedCandidate?.linkedin,
        facebook: selectedCandidate?.facebook,
        resumeFile: selectedCandidate?.resumeFile,
        coverLetterUpload: selectedCandidate?.coverLetterUpload,
        contractUpload: selectedCandidate?.contractUpload,
        otherFiles: selectedCandidate?.otherFiles,
      });
      setProfessionalDetails(selectedCandidate?.professionalDetails ?? []);
      setEducationalDetails(selectedCandidate?.educationalDetails ?? []);
    }
  }, [selectedCandidate, openingId]);

  useEffect(() => {
    dispatch(fetchMasterDataRequest());
    dispatch(fetchUserDataRequest());
    dispatch(fetchMasterJobOpeningRequest());
  }, [dispatch, openingId]);

  useEffect(() => {
    if (success && !loading && !selectedCandidate?.candidateId) {
      navigate(-1);
    }
  }, [success, loading, dispatch, navigate, selectedCandidate?.candidateId]);

  useEffect(() => {
    if (isCheckingDuplicate && isDuplicateCandidate !== null) {
      setIsCheckingDuplicate(false);
      if (isDuplicateCandidate) {
        ToastService.showWarn(t("common.candidateAlreadyExists"));
        setPendingPayload(null);
      } else {
        if (pendingPayload) {
          dispatch(addCandidateRequest(pendingPayload));
          setPendingPayload(null);
        }
      }
    }
  }, [isDuplicateCandidate, isCheckingDuplicate, pendingPayload, dispatch]);

  useEffect(() => {
    if (
      formData.email &&
      formData.secondaryEmail &&
      formData.email === formData.secondaryEmail
    ) {
      setErrors((prev) => ({
        ...prev,
        secondaryEmail: t("common.secondaryEmailCannotBeSameAsEmail"),
      }));
    } else {
      setErrors((prev) => {
        if (prev.secondaryEmail) {
          const { secondaryEmail, ...rest } = prev;
          return rest;
        }
        return prev;
      });
    }
  }, [formData.email, formData.secondaryEmail, t]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    const newErrors: { secondaryEmail?: string } = {};
    if (
      formData.email &&
      formData.secondaryEmail &&
      formData.email === formData.secondaryEmail
    ) {
      newErrors.secondaryEmail = t("common.secondaryEmailCannotBeSameAsEmail");
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    const salaryAnnexure = {
      monthlyInputValue: formData?.monthlyInputValue,
      annualCtcWords: formData?.annualCtcWords,
      basicMonthly: formData?.basicMonthly,
      basicAnnually: formData?.basicMonthly
        ? Number(formData.basicMonthly) * 12
        : undefined,
      houseRentAllowanceMonthly: formData?.houseRentAllowanceMonthly,
      houseRentAllowanceAnnually: formData?.houseRentAllowanceMonthly
        ? Number(formData.houseRentAllowanceMonthly) * 12
        : undefined,
      conveyanceAllowanceMonthly: formData?.conveyanceAllowanceMonthly,
      conveyanceAllowanceAnnually: formData?.conveyanceAllowanceMonthly
        ? Number(formData.conveyanceAllowanceMonthly) * 12
        : undefined,
      attireExpensesMonthly: formData?.attireExpensesMonthly,
      attireExpensesAnnually: formData?.attireExpensesMonthly
        ? Number(formData.attireExpensesMonthly) * 12
        : undefined,
      medicalAllowanceMonthly: formData?.medicalAllowanceMonthly,
      medicalAllowanceAnnually: formData?.medicalAllowanceMonthly
        ? Number(formData.medicalAllowanceMonthly) * 12
        : undefined,
      leaveTravelAllowanceMonthly: formData?.leaveTravelAllowanceMonthly,
      leaveTravelAllowanceAnnually: formData?.leaveTravelAllowanceMonthly
        ? Number(formData.leaveTravelAllowanceMonthly) * 12
        : undefined,
      profPersuitExpenseMonthly: formData?.profPersuitExpenseMonthly,
      profPersuitExpenseAnnually: formData?.profPersuitExpenseMonthly
        ? Number(formData.profPersuitExpenseMonthly) * 12
        : undefined,
      statutoryBonusMonthly: formData?.statutoryBonusMonthly,
      statutoryBonusAnnually: formData?.statutoryBonusMonthly
        ? Number(formData.statutoryBonusMonthly) * 12
        : undefined,
      fixedAllowanceMonthly: formData?.fixedAllowanceMonthly,
      fixedAllowanceAnnually: formData?.fixedAllowanceMonthly
        ? Number(formData.fixedAllowanceMonthly) * 12
        : undefined,
      totalGrossMonthly: formData?.totalGrossMonthly,
      totalGrossAnnually: formData?.totalGrossMonthly
        ? Number(formData.totalGrossMonthly) * 12
        : undefined,
      gratuityEmployerContributionMonthly:
        formData?.gratuityEmployerContributionMonthly,
      gratuityEmployerContributionAnnually:
        formData?.gratuityEmployerContributionMonthly
          ? Number(formData.gratuityEmployerContributionMonthly) * 12
          : undefined,
      groupHealthInsuranceEmployerContributionMonthly:
        formData?.groupHealthInsuranceEmployerContributionMonthly,
      groupHealthInsuranceEmployerContributionAnnually:
        formData?.groupHealthInsuranceEmployerContributionMonthly
          ? Number(formData.groupHealthInsuranceEmployerContributionMonthly) *
          12
          : undefined,
      epfEmployerContributionMonthly: formData?.epfEmployerContributionMonthly,
      epfEmployerContributionAnnually: formData?.epfEmployerContributionMonthly
        ? Number(formData.epfEmployerContributionMonthly) * 12
        : undefined,
      totalRetiralMonthly: formData?.totalRetiralMonthly,
      totalRetiralAnnually: formData?.totalRetiralMonthly
        ? Number(formData.totalRetiralMonthly) * 12
        : undefined,
      costToCompanyMonthly: formData?.costToCompanyMonthly,
      costToCompanyAnnually: formData?.costToCompanyMonthly
        ? Number(formData.costToCompanyMonthly) * 12
        : undefined,
    };

    const payload: CandidateInterface = {
      firstName: formData?.firstName,
      lastName: formData?.lastName,
      email: formData?.email,
      mobile: formData?.mobile,
      phone: formData?.phone,
      fax: formData?.fax,
      website: formData?.website,
      secondaryEmail: formData?.secondaryEmail,
      currencyId: formData?.currencyId,
      street: formData?.street,
      city: formData?.city,
      province: formData?.province,
      countryId: formData?.countryId,
      postalCode: formData?.postalCode,
      experience: formData?.experience,
      qualificationId: formData?.qualificationId,
      relevantExperience: formData?.relevantExperience,
      currentEmployer: formData?.currentEmployer,
      currentCtc: formData?.currentCtc,
      currentSalary: formData?.currentSalary,
      expectedCtc: formData?.expectedCtc,
      isAlreadyAnApplicant: formData?.isAlreadyAnApplicant,
      currentJobTitle: formData?.currentJobTitle,
      noticePeriodDays: formData?.noticePeriodDays,
      alternateOffer: formData?.alternateOffer,
      currentLocation: formData?.currentLocation,
      willingToWorkInTrivandrum: formData?.willingToWorkInTrivandrum,
      expectedSalaryId: formData?.expectedSalaryId,
      expectedDOJ: formData?.expectedDOJ,
      skypeId: formData?.skypeId,
      skillSet: formData?.skillSet ?? [],
      candidateStatusId: formData?.candidateStatusId,
      sourceId: formData?.sourceId,
      candidateOwnerId: formData?.candidateOwnerId,
      emailOptOut: formData?.emailOptOut ?? false,
      salaryAnnexure,
      linkedin: formData?.linkedin,
      facebook: formData?.facebook,
      professionalDetails: professionalDetails,
      educationalDetails: educationalDetails,
      updatedDate: formData?.updatedDate,
      jobOpportunityId: formData?.jobOpportunityId,
    };
    if (selectedCandidate?.candidateId) {
      payload.candidateId = selectedCandidate.candidateId;
      dispatch(updateCandidateRequest(payload));
    } else {
      payload.createdDate = formData?.createdDate;
      payload.documents = [
        ...(formData.resumeFile ?? []),
        ...(formData.coverLetterUpload ?? []),
        ...(formData.contractUpload ?? []),
        ...(formData.otherFiles ?? []),
      ];
      setPendingPayload(payload);
      if (payload.jobOpportunityId && payload.email) {
        dispatch(
          checkDuplicateCandidateRequest({
            jobOpportunityId: payload.jobOpportunityId,
            email: payload.email,
            mobile: payload.mobile ?? "",
          })
        );
        setIsCheckingDuplicate(true);
      } else {
        // Fallback if missing required fields for check, though form validation should prevent this
        dispatch(addCandidateRequest(payload));
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      const target = e.target as HTMLElement;

      // Allow Enter for Textarea and Rich Text Editors
      if (
        target.tagName === "TEXTAREA" ||
        target.contentEditable === "true" ||
        target.closest(".ql-editor")
      ) {
        return;
      }

      // For everything else (Inputs, Chips, Buttons), prevent default form submission
      e.preventDefault();
    }
  };

  const FieldLimits: Record<string, number> = {
    firstName: 50,
    lastName: 50,
    email: 50,
    website: 100,
    street: 100,
    city: 100,
    province: 100,
    postalCode: 12,
    fax: 20,
    experience: 2,
    relevantExperience: 2,
    currentEmployer: 100,
    currentCtc: 10,
    currentSalary: 10,
    expectedCtc: 10,
    currentJobTitle: 20,
    noticePeriodDays: 3,
    alternateOffer: 100,
    currentLocation: 20,
    skypeId: 20,
    monthlyInputValue: 10,
    annualCtcWords: 100,
    basicMonthly: 10,
    houseRentAllowanceMonthly: 10,
    conveyanceAllowanceMonthly: 10,
    attireExpensesMonthly: 10,
    medicalAllowanceMonthly: 10,
    leaveTravelAllowanceMonthly: 10,
    profPersuitExpenseMonthly: 10,
    statutoryBonusMonthly: 10,
    fixedAllowanceMonthly: 10,
    totalGrossMonthly: 10,
    gratuityEmployerContributionMonthly: 10,
    groupHealthInsuranceEmployerContributionMonthly: 10,
    epfEmployerContributionMonthly: 10,
    totalRetiralMonthly: 10,
    costToCompanyMonthly: 10,
    linkedin: 100,
    facebook: 100,
    secondaryEmail: 50,
  };

  const isFormValid = () => {
    // Check if there are any inline errors
    if (Object.values(errors).some((error) => error)) {
      return false;
    }

    // Check max length validation
    for (const key in FieldLimits) {
      if (Object.prototype.hasOwnProperty.call(FieldLimits, key)) {
        const value = formData[key as keyof CandidateInterface];
        if (value && String(value).length > FieldLimits[key]) {
          return false;
        }
      }
    }

    if (selectedCandidate) {
      return (
        formData.firstName &&
        formData.lastName &&
        formData.email &&
        isMobileValid &&
        isPhoneValid
      );
    } else {
      return (
        formData.firstName &&
        formData.lastName &&
        formData.email &&
        formData.candidateStatusId &&
        formData.sourceId &&
        formData.resumeFile &&
        formData.resumeFile?.length > 0 &&
        isMobileValid &&
        isPhoneValid
      );
    }
  };

  const resumeConfirm = (index: number) => {
    setDeleteTarget({ type: "resumeFile", index });
    setDeleteDialogVisible(true);
  };

  const coverLetterUploadConfirm = (index: number) => {
    setDeleteTarget({ type: "coverLetterUpload", index });
    setDeleteDialogVisible(true);
  };

  const contractUploadConfirm = (index: number) => {
    setDeleteTarget({ type: "contractUpload", index });
    setDeleteDialogVisible(true);
  };

  const otherFilesConfirm = (index: number) => {
    setDeleteTarget({ type: "otherFiles", index });
    setDeleteDialogVisible(true);
  };

  const showBasicDetails =
    visibleSection === "all" || visibleSection === "basicInfo";
  const showSalaryDetails =
    visibleSection === "all" || visibleSection === "salaryAnnexure";

  return (
    <form
      onSubmit={handleSubmit}
      onKeyDown={handleKeyDown}
      className="space-y-5"
    >
      {loading && masterDataLoading && <AtsLoader />}
      <ExperienceSidebar
        visible={isExperienceSidebarOpen}
        onHide={() => setIsExperienceSidebarOpen(false)}
        data={professionalDetails}
        onSaveExp={(updatedExperienceList) => {
          setProfessionalDetails(updatedExperienceList);
        }}
      />
      <EducationSidebar
        visible={isEducationSidebarOpen}
        onHide={() => setIsEducationSidebarOpen(false)}
        data={educationalDetails}
        onSaveEdu={(updatedEducationList) => {
          setEducationalDetails(updatedEducationList);
        }}
      />

      {showBasicDetails && (
        <>
          {/* --- Basic Info --- */}
          <div className="space-y-6 py-5 px-4 bg-white rounded-2xl">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold">
                {visibleSection === "basicInfo"
                  ? `Edit ${t("common.basicInfo")}`
                  : t("common.basicInfo")}
              </h2>
              {visibleSection === "basicInfo" && onClose && (
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-lg hover:bg-[#F6F6F6] p-2 cursor-pointer"
                >
                  <img src={closeLogo} className="w-5 h-5" alt="close" />
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <InputTextField
                label={`${t("common.firstName")} *`}
                placeholder={t("common.firstName")}
                valueKey="firstName"
                formData={formData}
                setFormData={setFormData}
                max={50}
              />
              <InputTextField
                label={`${t("common.lastName")} *`}
                placeholder={t("common.lastName")}
                valueKey="lastName"
                formData={formData}
                setFormData={setFormData}
                max={50}
              />
              {!openingId && (
                <DropdownField
                  label={`${t("common.postingTitle")} *`}
                  placeholder={t("common.postingTitle")}
                  valueKey="jobOpportunityId"
                  options={jobOpenings}
                  formData={formData}
                  setFormData={setFormData}
                />
              )}
              <InputTextField
                label={`${t("common.email")} *`}
                placeholder={t("common.email")}
                valueKey="email"
                formData={formData}
                setFormData={setFormData}
                max={50}
                type="email"
              />
              <PhoneField
                label={t("common.mobile")}
                valueKey="mobile"
                formData={formData}
                setFormData={setFormData}
                setIsValid={setIsMobileValid}
              />
              <PhoneField
                label={t("common.phone")}
                valueKey="phone"
                formData={formData}
                setFormData={setFormData}
                setIsValid={setIsPhoneValid}
              />
              <InputTextField
                label={t("common.website")}
                valueKey="website"
                formData={formData}
                setFormData={setFormData}
                max={100}
              />
              <InputTextField
                label={t("common.secondaryEmail")}
                valueKey="secondaryEmail"
                formData={formData}
                setFormData={setFormData}
                type="email"
                max={50}
                errorMessage={errors.secondaryEmail}
              />
              <DropdownField
                label={t("common.currency")}
                valueKey="currencyId"
                options={currency}
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <InputTextField
                label={t("common.street")}
                valueKey="street"
                formData={formData}
                setFormData={setFormData}
                max={100}
              />
              <InputTextField
                label={t("common.city")}
                valueKey="city"
                formData={formData}
                setFormData={setFormData}
                max={100}
              />
              <InputTextField
                label={t("common.province")}
                valueKey="province"
                formData={formData}
                setFormData={setFormData}
                max={100}
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
                setFormData={setFormData}
                maxLength={12}
              />
              <InputTextField
                label={t("common.fax")}
                valueKey="fax"
                formData={formData}
                setFormData={setFormData}
                max={20}
              />
            </div>
          </div>
          {/* --- Professional Details Section --- */}
          <div className="space-y-6 py-5 px-4 bg-white rounded-2xl">
            <h2 className="text-lg font-semibold mb-2">
              {t("candidates.professionalDetails")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <InputNumberField
                label={t("candidates.experienceInYears")}
                valueKey="experience"
                formData={formData}
                setFormData={setFormData}
                maxLength={2}
              />
              <DropdownField
                label={t("candidates.highQualificationHeld")}
                valueKey="qualificationId"
                options={qualification}
                formData={formData}
                setFormData={setFormData}
              />
              <InputNumberField
                label={t("candidates.relevantExperienceYear")}
                valueKey="relevantExperience"
                formData={formData}
                setFormData={setFormData}
                maxLength={2}
              />
              <InputTextField
                label={t("common.currentEmployer")}
                valueKey="currentEmployer"
                formData={formData}
                setFormData={setFormData}
                max={100}
              />
              <InputNumberField
                label={t("candidates.currentCTC")}
                valueKey="currentCtc"
                formData={formData}
                setFormData={setFormData}
                maxLength={10}
              />
              <InputNumberField
                label={t("candidates.currentSalary")}
                valueKey="currentSalary"
                formData={formData}
                setFormData={setFormData}
                maxLength={10}
              />
              <InputNumberField
                label={t("candidates.expectedCTC")}
                valueKey="expectedCtc"
                formData={formData}
                setFormData={setFormData}
                maxLength={10}
              />
              <DropdownField
                label={t("candidates.appliedToPITLast6Months")}
                valueKey="isAlreadyAnApplicant"
                options={yesOrNo}
                formData={formData}
                setFormData={setFormData}
              />
              <InputTextField
                label={t("common.currentJobTitle")}
                valueKey="currentJobTitle"
                formData={formData}
                setFormData={setFormData}
                max={20}
              />
              <InputNumberField
                label={t("common.noticePeriod")}
                valueKey="noticePeriodDays"
                formData={formData}
                setFormData={setFormData}
                maxLength={3}
              />
              <InputTextField
                label={t("candidates.alternateOffer")}
                valueKey="alternateOffer"
                formData={formData}
                setFormData={setFormData}
                max={100}
              />
              <InputTextField
                label={t("candidates.currentLocation")}
                valueKey="currentLocation"
                formData={formData}
                setFormData={setFormData}
                max={20}
              />
              <DropdownField
                label={t("candidates.okayForTrivandrum")}
                valueKey="willingToWorkInTrivandrum"
                options={yesOrNo}
                formData={formData}
                setFormData={setFormData}
              />
              <DropdownField
                label={t("candidates.expectedSalary")}
                valueKey="expectedSalaryId"
                options={salary}
                formData={formData}
                setFormData={setFormData}
              />
              <DateField
                label={t("candidates.expectedJoiningDate")}
                valueKey="expectedDOJ"
                formData={formData}
                setFormData={setFormData}
              />
              <InputTextField
                label={t("candidates.skypeId")}
                valueKey="skypeId"
                formData={formData}
                setFormData={setFormData}
                max={20}
              />
            </div>
            <div className="w-full skills-candidate-wrapper">
              <label htmlFor="requiredSkillsChips" className="block mb-1">
                {t("common.requiredSkills")}
              </label>
              <Chips
                id="requiredSkillsChips"
                placeholder={t("common.addSkillInstruction")}
                value={formData.skillSet ?? undefined}
                separator=","
                onChange={(e) => {
                  const newSkills = e.value ?? [];
                  const totalLength = newSkills.join(",").length;
                  if (totalLength <= 500) {
                    setFormData({ ...formData, skillSet: newSkills });
                  }
                }}
                className="w-full"
                max={500}
              />
            </div>
          </div>
          {/* --- Other Info Section --- */}
          <div className="space-y-6 py-5 px-4 bg-white rounded-2xl">
            <h2 className="text-lg font-semibold mb-2">
              {t("candidates.otherInfo")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <DropdownField
                label={`${t("candidates.candidateStatus")} *`}
                valueKey="candidateStatusId"
                options={candidateStatus}
                formData={formData}
                setFormData={setFormData}
              />
              <DropdownField
                label={`${t("candidates.source")} *`}
                valueKey="sourceId"
                options={filteredSource}
                formData={formData}
                setFormData={setFormData}
                disabled={formData.sourceId === 7}
              />
              <DropdownField
                label={t("candidates.candidateOwner")}
                valueKey="candidateOwnerId"
                options={users}
                formData={formData}
                setFormData={setFormData}
              />
              <CheckboxField
                label={t("candidates.emailOptOut")}
                valueKey="emailOptOut"
                formData={formData}
                setFormData={setFormData}
              />
            </div>
          </div>
          {/* --- Education Details --- */}
          <div className="space-y-5 py-5 px-4 bg-white rounded-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">
                {t("candidates.educationDetails")}
              </h2>
              <button
                type="button"
                className="rounded-lg hover:bg-[#F6F6F6] p-2 cursor-pointer"
                onClick={() => setIsEducationSidebarOpen(true)}
              >
                <img src={PenSvg} className="w-5 h-5" alt="close" />
              </button>
            </div>
            {educationalDetails.length === 0 && (
              <>
                <div className="flex justify-center items-center">
                  <div className="rounded-lg bg-[#F6F6F6] p-5 ">
                    <img src={VectorSVG} className="w-5 h-5" alt="close" />
                  </div>
                </div>
                <div className="flex justify-center items-center">
                  <span className="text-gray-500">
                    {t("common.noContentAvailable")}
                  </span>
                </div>
              </>
            )}
            {educationalDetails.length > 0 &&
              educationalDetails.map((education, index) => (
                <div
                  key={index + education?.major}
                  className="border-b border-gray-100 last:border-b-0"
                >
                  <EducationCard education={education} />
                </div>
              ))}
          </div>
          {/* --- Experience Details --- */}
          <div className="space-y-5 py-5 px-4 bg-white rounded-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">
                {t("candidates.experienceDetails")}
              </h2>
              <button
                type="button"
                className="rounded-lg hover:bg-[#F6F6F6] p-2 cursor-pointer"
                onClick={() => setIsExperienceSidebarOpen(true)}
              >
                <img src={PenSvg} className="w-5 h-5" alt="close" />
              </button>
            </div>
            {professionalDetails.length === 0 && (
              <>
                <div className="flex justify-center items-center">
                  <div className="rounded-lg bg-[#F6F6F6] p-5 ">
                    <img src={VectorSVG} className="w-5 h-5" alt="close" />
                  </div>
                </div>
                <div className="flex justify-center items-center">
                  <span className="text-gray-500">
                    {t("common.noContentAvailable")}
                  </span>
                </div>
              </>
            )}
            {professionalDetails.length > 0 &&
              professionalDetails.map((experience, index) => (
                <div
                  key={index + experience?.company}
                  className="border-b border-gray-100 last:border-b-0"
                >
                  <ExperienceCard experience={experience} />
                </div>
              ))}
          </div>
        </>
      )}
      {showSalaryDetails && (
        <>
          {/* --- Salary Annexure --- */}
          <div className="space-y-6 py-5 px-4 bg-white rounded-2xl">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold">
                {visibleSection === "salaryAnnexure"
                  ? `Edit ${t("candidates.salaryAnnexure")}`
                  : t("candidates.salaryAnnexure")}
              </h2>
              {visibleSection === "salaryAnnexure" && onClose && (
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-lg hover:bg-[#F6F6F6] p-2 cursor-pointer"
                >
                  <img src={closeLogo} className="w-5 h-5" alt="close" />
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <InputNumberField
                label={t("candidates.monthlyInputValue")}
                valueKey="monthlyInputValue"
                formData={formData}
                setFormData={setFormData}
                maxLength={10}
              />
              <InputTextField
                label={t("candidates.annualCTCWords")}
                valueKey="annualCtcWords"
                formData={formData}
                setFormData={setFormData}
                max={100}
              />
              <InputNumberField
                label={t("candidates.basicMonthly")}
                valueKey="basicMonthly"
                formData={formData}
                setFormData={setFormData}
                maxLength={10}
              />
              <InputNumberField
                label={t("candidates.basicAnnually")}
                valueKey="basicAnnually"
                setFormData={setFormData}
                disabled={true}
                formData={{
                  ...formData,
                  basicAnnually: formData.basicMonthly
                    ? formData.basicMonthly * 12
                    : undefined,
                }}
              />
              <InputNumberField
                label={t("candidates.houseRentAllowanceMonthly")}
                valueKey="houseRentAllowanceMonthly"
                formData={formData}
                setFormData={setFormData}
                maxLength={10}
              />
              <InputNumberField
                label={t("candidates.houseRentAllowanceAnnually")}
                valueKey="houseRentAllowanceAnnually"
                setFormData={setFormData}
                disabled={true}
                formData={{
                  ...formData,
                  houseRentAllowanceAnnually: formData.houseRentAllowanceMonthly
                    ? formData.houseRentAllowanceMonthly * 12
                    : undefined,
                }}
              />
              <InputNumberField
                label={t("candidates.conveyanceAllowanceMonthly")}
                valueKey="conveyanceAllowanceMonthly"
                formData={formData}
                setFormData={setFormData}
                maxLength={10}
              />
              <InputNumberField
                label={t("candidates.conveyanceAllowanceAnnually")}
                valueKey="conveyanceAllowanceAnnually"
                setFormData={setFormData}
                disabled={true}
                formData={{
                  ...formData,
                  conveyanceAllowanceAnnually:
                    formData.conveyanceAllowanceMonthly
                      ? formData.conveyanceAllowanceMonthly * 12
                      : undefined,
                }}
              />
              <InputNumberField
                label={t("candidates.attireExpensesMonthly")}
                valueKey="attireExpensesMonthly"
                formData={formData}
                setFormData={setFormData}
                maxLength={10}
              />
              <InputNumberField
                label={t("candidates.attireExpensesAnnually")}
                valueKey="attireExpensesAnnually"
                setFormData={setFormData}
                disabled={true}
                formData={{
                  ...formData,
                  attireExpensesAnnually: formData.attireExpensesMonthly
                    ? formData.attireExpensesMonthly * 12
                    : undefined,
                }}
              />
              <InputNumberField
                label={t("candidates.medicalAllowanceMonthly")}
                valueKey="medicalAllowanceMonthly"
                formData={formData}
                setFormData={setFormData}
                maxLength={10}
              />
              <InputNumberField
                label={t("candidates.medicalAllowanceAnnually")}
                valueKey="medicalAllowanceAnnually"
                setFormData={setFormData}
                disabled={true}
                formData={{
                  ...formData,
                  medicalAllowanceAnnually: formData.medicalAllowanceMonthly
                    ? formData.medicalAllowanceMonthly * 12
                    : undefined,
                }}
              />
              <InputNumberField
                label={t("candidates.leaveTravelAllowanceMonthly")}
                valueKey="leaveTravelAllowanceMonthly"
                formData={formData}
                setFormData={setFormData}
                maxLength={10}
              />
              <InputNumberField
                label={t("candidates.leaveTravelAllowanceAnnually")}
                valueKey="leaveTravelAllowanceAnnually"
                setFormData={setFormData}
                disabled={true}
                formData={{
                  ...formData,
                  leaveTravelAllowanceAnnually:
                    formData.leaveTravelAllowanceMonthly
                      ? formData.leaveTravelAllowanceMonthly * 12
                      : undefined,
                }}
              />
              <InputNumberField
                label={t("candidates.profPersuitExpenseMonthly")}
                valueKey="profPersuitExpenseMonthly"
                formData={formData}
                setFormData={setFormData}
                maxLength={10}
              />
              <InputNumberField
                label={t("candidates.profPersuitExpenseAnnually")}
                valueKey="profPersuitExpenseAnnually"
                setFormData={setFormData}
                disabled={true}
                formData={{
                  ...formData,
                  profPersuitExpenseAnnually: formData.profPersuitExpenseMonthly
                    ? formData.profPersuitExpenseMonthly * 12
                    : undefined,
                }}
              />
              <InputNumberField
                label={t("candidates.statutoryBonusMonthly")}
                valueKey="statutoryBonusMonthly"
                formData={formData}
                setFormData={setFormData}
                maxLength={10}
              />
              <InputNumberField
                label={t("candidates.statutoryBonusAnnually")}
                valueKey="statutoryBonusAnnually"
                setFormData={setFormData}
                disabled={true}
                formData={{
                  ...formData,
                  statutoryBonusAnnually: formData.statutoryBonusMonthly
                    ? formData.statutoryBonusMonthly * 12
                    : undefined,
                }}
              />
              <InputNumberField
                label={t("candidates.fixedAllowanceMonthly")}
                valueKey="fixedAllowanceMonthly"
                formData={formData}
                setFormData={setFormData}
                maxLength={10}
              />
              <InputNumberField
                label={t("candidates.fixedAllowanceAnnually")}
                valueKey="fixedAllowanceAnnually"
                setFormData={setFormData}
                disabled={true}
                formData={{
                  ...formData,
                  fixedAllowanceAnnually: formData.fixedAllowanceMonthly
                    ? formData.fixedAllowanceMonthly * 12
                    : undefined,
                }}
              />
              <InputNumberField
                label={t("candidates.totalGrossMonthly")}
                valueKey="totalGrossMonthly"
                formData={formData}
                setFormData={setFormData}
                maxLength={10}
              />
              <InputNumberField
                label={t("candidates.totalGrossAnnually")}
                valueKey="totalGrossAnnually"
                setFormData={setFormData}
                disabled={true}
                formData={{
                  ...formData,
                  totalGrossAnnually: formData.totalGrossMonthly
                    ? formData.totalGrossMonthly * 12
                    : undefined,
                }}
              />
              <InputNumberField
                label={t("candidates.gratuityEmployerContributionMonthly")}
                valueKey="gratuityEmployerContributionMonthly"
                formData={formData}
                setFormData={setFormData}
                maxLength={10}
              />
              <InputNumberField
                label={t("candidates.gratuityEmployerContributionAnnually")}
                valueKey="gratuityEmployerContributionAnnually"
                setFormData={setFormData}
                disabled={true}
                formData={{
                  ...formData,
                  gratuityEmployerContributionAnnually:
                    formData.gratuityEmployerContributionMonthly
                      ? formData.gratuityEmployerContributionMonthly * 12
                      : undefined,
                }}
              />
              <InputNumberField
                label={t(
                  "candidates.groupHealthInsuranceEmployerContributionMonthly"
                )}
                valueKey="groupHealthInsuranceEmployerContributionMonthly"
                formData={formData}
                setFormData={setFormData}
                maxLength={10}
              />
              <InputNumberField
                label={t(
                  "candidates.groupHealthInsuranceEmployerContributionAnnually"
                )}
                valueKey="groupHealthInsuranceEmployerContributionAnnually"
                setFormData={setFormData}
                disabled={true}
                formData={{
                  ...formData,
                  groupHealthInsuranceEmployerContributionAnnually:
                    formData.groupHealthInsuranceEmployerContributionMonthly
                      ? formData.groupHealthInsuranceEmployerContributionMonthly *
                      12
                      : undefined,
                }}
              />
              <InputNumberField
                label={t("candidates.epfEmployerContributionMonthly")}
                valueKey="epfEmployerContributionMonthly"
                formData={formData}
                setFormData={setFormData}
                maxLength={10}
              />
              <InputNumberField
                label={t("candidates.epfEmployerContributionAnnually")}
                valueKey="epfEmployerContributionAnnually"
                setFormData={setFormData}
                disabled={true}
                formData={{
                  ...formData,
                  epfEmployerContributionAnnually:
                    formData.epfEmployerContributionMonthly
                      ? formData.epfEmployerContributionMonthly * 12
                      : undefined,
                }}
              />
              <InputNumberField
                label={t("candidates.totalRetiralMonthly")}
                valueKey="totalRetiralMonthly"
                formData={formData}
                setFormData={setFormData}
                maxLength={10}
              />
              <InputNumberField
                label={t("candidates.totalRetiralAnnually")}
                valueKey="totalRetiralAnnually"
                setFormData={setFormData}
                disabled={true}
                formData={{
                  ...formData,
                  totalRetiralAnnually: formData.totalRetiralMonthly
                    ? formData.totalRetiralMonthly * 12
                    : undefined,
                }}
              />
              <InputNumberField
                label={t("candidates.costToCompanyMonthly")}
                valueKey="costToCompanyMonthly"
                formData={formData}
                setFormData={setFormData}
                maxLength={10}
              />
              <InputNumberField
                label={t("candidates.costToCompanyAnnually")}
                valueKey="costToCompanyAnnually"
                setFormData={setFormData}
                disabled={true}
                formData={{
                  ...formData,
                  costToCompanyAnnually: formData.costToCompanyMonthly
                    ? formData.costToCompanyMonthly * 12
                    : undefined,
                }}
              />
            </div>
          </div>
        </>
      )}
      {showBasicDetails && (
        <>
          <div className="space-y-6 py-5 px-4 bg-white rounded-2xl">
            <h2 className="text-lg font-semibold mb-2">
              {t("candidates.socialLinks")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <InputTextField
                label="Linkedin"
                valueKey="linkedin"
                formData={formData}
                setFormData={setFormData}
                max={100}
              />
              <InputTextField
                label="Facebook"
                valueKey="facebook"
                formData={formData}
                setFormData={setFormData}
                max={100}
              />
            </div>
          </div>
        </>
      )}
      {/* --- Attachment Section --- */}
      {!selectedCandidate?.candidateId && (
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
              } else if (deleteTarget.type === "coverLetterUpload") {
                const updated = [...(formData.coverLetterUpload || [])];
                updated.splice(deleteTarget.index, 1);
                setFormData({ ...formData, coverLetterUpload: updated });
              } else if (deleteTarget.type === "contractUpload") {
                const updated = [...(formData.contractUpload || [])];
                updated.splice(deleteTarget.index, 1);
                setFormData({ ...formData, contractUpload: updated });
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
            {/* Cover Letter Upload */}
            <FileUploadBlock
              label={t("candidates.coverLetter")}
              inputId="coverLetterUpload"
              files={formData.coverLetterUpload || []}
              onFilesChange={(newFiles) => {
                if (newFiles.length > 0) {
                  setFormData((prev) => ({
                    ...prev,
                    coverLetterUpload: [newFiles[0]],
                  })); // ✅ enforce single file
                }
              }}
              onConfirm={(index) => coverLetterUploadConfirm(index)}
              typeId={7}
              required
              maxFileSize={5 * 1024 * 1024}
              maxFileSizeMessage="Maximum file size allowed is 5 MB."
              maxFileCount={1}
              maxFileCountMessage="File count exceeded."
            />
            {/* Contract Upload */}
            <FileUploadBlock
              label={t("candidates.contract")}
              inputId="contractUpload"
              files={formData.contractUpload || []}
              onFilesChange={(newFiles) => {
                if (newFiles.length > 0) {
                  setFormData((prev) => ({
                    ...prev,
                    contractUpload: [newFiles[0]],
                  })); // ✅ enforce single file
                }
              }}
              onConfirm={(index) => contractUploadConfirm(index)}
              typeId={7}
              required
              maxFileSize={5 * 1024 * 1024}
              maxFileSizeMessage="Maximum file size allowed is 5 MB."
              maxFileCount={1}
              maxFileCountMessage="File count exceeded."
            />
            {/* Other Files Upload */}
            <FileUploadBlock
              label={t("common.others")}
              inputId="otherFiles"
              files={formData.otherFiles || []}
              onFilesChange={(newFiles) => {
                if (newFiles.length > 0) {
                  setFormData((prev) => ({
                    ...prev,
                    otherFiles: [newFiles[0]],
                  })); // ✅ enforce single file
                }
              }}
              onConfirm={(index) => otherFilesConfirm(index)}
              typeId={7}
              required
              maxFileSize={5 * 1024 * 1024}
              maxFileSizeMessage="Maximum file size allowed is 5 MB."
              maxFileCount={5}
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
            onClick={() =>
              setFormData({
                firstName: "",
              })
            }
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

export default CreateUpdateCandidate;
