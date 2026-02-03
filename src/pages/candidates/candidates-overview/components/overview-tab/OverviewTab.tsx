import { useEffect, useState } from "react";
import PenSvg from "../../../../../assets/icons/pen.svg";
import closeLogo from "../../../../../assets/icons/x-close.svg";

import DetailsCard from "./DetailsCard";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../../../../store/store";
import CreateUpdateCandidate from "../../../../../shared/components/create-update-candidate/CreateUpdateCandidate";
import {
  fetchCandidateByIdRequest,
  resetCandidateEditState,
} from "../../../../../store/reducers/candidateSlice";
import Cards from "./Cards";
import { formatDate } from "../../../../../services/common";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

const OverviewTab = () => {
  const { t } = useTranslation();
  const [isEdit, setIsEdit] = useState(false);
  const dispatch = useDispatch();
  const { editSuccess, selectedCandidate } = useSelector(
    (state: RootState) => state.candidates
  );

  const basicInfo = [
    {
      label: t("common.firstName"),
      value: selectedCandidate?.firstName ?? t("common.none"),
    },
    {
      label: t("common.lastName"),
      value: selectedCandidate?.lastName ?? t("common.none"),
    },
    {
      label: t("common.postingTitle"),
      value: selectedCandidate?.jobOpportunity?.label ?? t("common.none"),
    },
    {
      label: t("common.email"),
      value: selectedCandidate?.email ?? t("common.none"),
    },
    {
      label: t("common.mobile"),
      value: selectedCandidate?.mobile ?? t("common.none"),
    },
    {
      label: t("common.phone"),
      value: selectedCandidate?.phone ?? t("common.none"),
    },
    {
      label: t("common.website"),
      value: selectedCandidate?.website ?? t("common.none"),
    },
    {
      label: t("common.secondaryEmail"),
      value: selectedCandidate?.secondaryEmail ?? t("common.none"),
    },
    {
      label: t("common.currency"),
      value: selectedCandidate?.currencyDetails?.label ?? t("common.none"),
    },
  ];

  const addressInfo = [
    {
      label: t("common.street"),
      value: selectedCandidate?.street ?? t("common.none"),
    },
    {
      label: t("common.city"),
      value: selectedCandidate?.city ?? t("common.none"),
    },
    {
      label: t("common.province"),
      value: selectedCandidate?.province ?? t("common.none"),
    },
    {
      label: t("common.country"),
      value: selectedCandidate?.countryDetails?.label ?? t("common.none"),
    },
    {
      label: t("common.postalCode"),
      value: selectedCandidate?.postalCode ?? t("common.none"),
    },
    {
      label: t("common.fax"),
      value: selectedCandidate?.fax ?? t("common.none"),
    },
  ];

  const professionalInfo = [
    {
      label: t("candidates.experienceInYears"),
      value:
        selectedCandidate?.experience != null
          ? String(selectedCandidate.experience)
          : t("common.none"),
    },
    {
      label: t("candidates.highQualificationHeld"),
      value: selectedCandidate?.qualificationDetails?.label ?? t("common.none"),
    },
    {
      label: t("candidates.relevantExperienceYear"),
      value:
        selectedCandidate?.relevantExperience != null
          ? String(selectedCandidate.relevantExperience)
          : t("common.none"),
    },
    {
      label: t("common.currentEmployer"),
      value: selectedCandidate?.currentEmployer ?? t("common.none"),
    },
    {
      label: t("candidates.currentCTC"),
      value:
        selectedCandidate?.currentCtc != null
          ? String(selectedCandidate.currentCtc)
          : t("common.none"),
    },
    {
      label: t("candidates.currentSalary"),
      value:
        selectedCandidate?.currentSalary != null
          ? String(selectedCandidate.currentSalary)
          : t("common.none"),
    },
    {
      label: t("candidates.expectedCTC"),
      value:
        selectedCandidate?.expectedCtc != null
          ? String(selectedCandidate.expectedCtc)
          : t("common.none"),
    },
    {
      label: t("candidates.appliedToPITLast6Months"),
      value: selectedCandidate?.isAlreadyAnApplicant
        ? t("common.yes")
        : t("common.no"),
    },
    {
      label: t("common.currentJobTitle"),
      value: selectedCandidate?.currentJobTitle ?? t("common.none"),
    },
    {
      label: t("common.noticePeriod"),
      value:
        selectedCandidate?.noticePeriodDays != null
          ? String(selectedCandidate.noticePeriodDays)
          : t("common.none"),
    },
    {
      label: t("candidates.alternateOffer"),
      value: selectedCandidate?.alternateOffer ?? t("common.none"),
    },
    {
      label: t("candidates.currentLocation"),
      value: selectedCandidate?.currentLocation ?? t("common.none"),
    },
    {
      label: t("candidates.okayForTrivandrum"),
      value: selectedCandidate?.isOkayForTrivandrum
        ? t("common.yes")
        : t("common.no"),
    },
    {
      label: t("candidates.expectedSalary"),
      value: selectedCandidate?.expectedSalaryDetails
        ? selectedCandidate.expectedSalaryDetails.label
        : t("common.none"),
    },
    {
      label: t("candidates.expectedJoiningDate"),
      value: selectedCandidate?.expectedDOJ
        ? new Date(selectedCandidate.expectedDOJ).toLocaleDateString()
        : t("common.none"),
    },
    {
      label: t("candidates.skypeId"),
      value: selectedCandidate?.skypeId ?? t("common.none"),
    },
    {
      label: t("common.requiredSkills"),
      value: Array.isArray(selectedCandidate?.skillSet)
        ? selectedCandidate.skillSet.join(", ")
        : selectedCandidate?.skillSet ?? t("common.none"),
    },
  ];

  const otherInfo = [
    {
      label: t("candidates.candidateStatus"),
      value:
        selectedCandidate?.candidateStatusDetails?.label ?? t("common.none"),
    },
    {
      label: t("candidates.source"),
      value: selectedCandidate?.sourceDetails?.label ?? t("common.none"),
    },
    {
      label: t("candidates.candidateOwner"),
      value:
        selectedCandidate?.candidateOwnerDetails?.label ?? t("common.none"),
    },
  ];

  const socialLinks = [
    {
      label: "LinkedIn",
      value: selectedCandidate?.linkedin ?? t("common.none"),
    },
    {
      label: "Facebook",
      value: selectedCandidate?.facebook ?? t("common.none"),
    },
  ];
  const { candidateId } = useParams<{ candidateId: string }>();

  const handleEdit = () => {
    dispatch(resetCandidateEditState());
    setIsEdit((prev) => !prev);
  };

  useEffect(() => {
    if (editSuccess) {
      setIsEdit(false);
      dispatch(
        fetchCandidateByIdRequest({ candidateId: candidateId as string })
      );
    }
  }, [editSuccess, dispatch]);

  const Field = ({
    label,
    value,
  }: {
    label: string;
    value: React.ReactNode;
  }) => (
    <div>
      <div className="text-sm text-gray-500 mb-1">{label}</div>
      <div className="max-w truncate pr-5">{value ?? t("common.none")}</div>
    </div>
  );

  return (
    <>
      {isEdit && (
        <CreateUpdateCandidate
          visibleSection="basicInfo"
          onClose={handleEdit}
        />
      )}
      {!isEdit && (
        <div className="w-full p-5 bg-white rounded-lg ">
          <div className="flex justify-between items-center mb-5 border-b border-[#F6F6F6] pb-2">
            <h2 className="text-lg font-semibold text-gray-900">
              {t("common.basicInfo")}
            </h2>
            <button
              type="button"
              onClick={handleEdit}
              className="rounded-lg hover:bg-[#F6F6F6] p-2 cursor-pointer"
              aria-label="Edit"
            >
              {!isEdit && <img src={PenSvg} className="w-5 h-5" alt="pen" />}
            </button>
          </div>
          <div style={{ height: "calc(100vh - 405px)", overflowY: "auto" }}>
            <div className="mb-8">
              <DetailsCard details={basicInfo} />
            </div>
            <Cards
              details={addressInfo}
              title={t("common.addressInformation")}
            />
            <Cards
              details={professionalInfo}
              title={t("candidates.professionalDetails")}
            />
            <Cards details={otherInfo} title={t("candidates.otherInfo")} />
            {selectedCandidate?.educationalDetails &&
              selectedCandidate?.educationalDetails?.length > 0 && (
                <div className="flex justify-between items-center mb-5 border-b border-[#F6F6F6] pb-2">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {t("candidates.educationDetails")}
                  </h2>
                </div>
              )}
            <div className="mb-8">
              {selectedCandidate?.educationalDetails?.map((field, idx) => {
                const startDate = formatDate(field?.startDate ?? undefined, t);
                const endDate = formatDate(field?.endDate ?? undefined, t);
                return (
                  <div
                    key={`${idx}-${field.institute}-${field.degree}`}
                    className="grid grid-cols-1 md:grid-cols-3 gap-y-5 gap-x-8 mb-5"
                  >
                    <Field
                      label={t("candidates.instituteSchool")}
                      value={field.institute}
                    />
                    <Field
                      label={t("candidates.majorDepartment")}
                      value={field.major}
                    />
                    <Field
                      label={t("candidates.degree")}
                      value={field.degree}
                    />
                    <Field
                      label={t("candidates.currentlyPursuing")}
                      value={
                        field.currentlyPursuing
                          ? t("common.yes")
                          : t("common.no")
                      }
                    />
                    <Field
                      label={t("candidates.startDate")}
                      value={startDate}
                    />
                    <Field
                      label={t("candidates.completionDate")}
                      value={endDate}
                    />
                  </div>
                );
              })}
            </div>
            {selectedCandidate?.professionalDetails &&
              selectedCandidate?.professionalDetails?.length > 0 && (
                <div className="flex justify-between items-center mb-5 border-b border-[#F6F6F6] pb-2">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {t("candidates.experienceDetails")}
                  </h2>
                </div>
              )}
            <div className="mb-8">
              {selectedCandidate?.professionalDetails?.map((field, idx) => {
                const startDate = formatDate(field?.startDate ?? undefined, t);
                const endDate = formatDate(field?.endDate ?? undefined, t);
                return (
                  <div
                    key={`${idx}-${field.institute}-${field.degree}`}
                    className="grid grid-cols-1 md:grid-cols-3 gap-y-5 gap-x-8 mb-5"
                  >
                    <Field
                      label={t("candidates.occupationTitle")}
                      value={field.occupationTitle}
                    />
                    <Field
                      label={t("candidates.company")}
                      value={field.company}
                    />
                    <Field
                      label={t("candidates.summary")}
                      value={field.summary}
                    />
                    <Field
                      label={t("candidates.currentlyWorkHere")}
                      value={
                        field.currentlyWorkingHere
                          ? t("common.yes")
                          : t("common.no")
                      }
                    />
                    <Field
                      label={t("candidates.startDate")}
                      value={startDate}
                    />
                    <Field label={t("candidates.endDate")} value={endDate} />
                  </div>
                );
              })}
            </div>

            <Cards details={socialLinks} title={t("candidates.socialLinks")} />
          </div>
        </div>
      )}
    </>
  );
};

export default OverviewTab;
