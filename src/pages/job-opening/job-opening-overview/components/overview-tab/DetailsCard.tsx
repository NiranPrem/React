import { useSelector } from "react-redux";
import type { RootState } from "../../../../../store/store";
import {
  formatDate,
  HTMLFormat,
  skillList,
} from "../../../../../services/common";
import { useTranslation } from "react-i18next";

const DetailsCard = () => {
  const { t } = useTranslation();
  const { selectedJobOpening } = useSelector(
    (state: RootState) => state.jobOpening
  );
  const { region } = useSelector((state: RootState) => state.masterData);

  const userDetails = [
    {
      label: t("common.postingTitle"),
      value: selectedJobOpening?.postingTitle ?? t("common.none"),
    },
    {
      label: t("common.jobTitle"),
      value: selectedJobOpening?.jobTitle?.label ?? t("common.none"),
    },
    {
      label: t("jobOpenings.departmentName"),
      value: selectedJobOpening?.department?.label ?? t("common.none"),
    },
    {
      label: t("common.region"),
      value:
        selectedJobOpening?.region?.label ??
        region.find((r) => r.value === selectedJobOpening?.regionId)?.label ??
        t("common.none"),
    },
    {
      label: t("jobOpenings.hiringManager"),
      value: selectedJobOpening?.hiringManager?.label ?? t("common.none"),
    },
    {
      label: t("jobOpenings.assignedRecruiter"),
      value: selectedJobOpening?.assignedRecruiter?.label ?? t("common.none"),
    },
    {
      label: t("jobOpenings.workExperiences"),
      value: selectedJobOpening?.workExperiences ?? t("common.none"),
    },
    {
      label: t("jobOpenings.jobType"),
      value: selectedJobOpening?.jobType?.label ?? t("common.none"),
    },

    {
      label: t("common.numberOfPositions"),
      value: selectedJobOpening?.numberOfPeople ?? t("common.none"),
    },
    {
      label: t("jobOpenings.newRequirementOrReplacement"),
      value: selectedJobOpening?.isReplacement
        ? t("jobOpenings.replacement")
        : t("jobOpenings.newRequirement"),
    },
    {
      label: t("common.createdDate"),
      value: formatDate(selectedJobOpening?.createdDate, t),
    },
    {
      label: t("jobOpenings.dateOpened"),
      value: formatDate(selectedJobOpening?.dateOpened, t),
    },
    {
      label: t("jobOpenings.targetDate"),
      value: formatDate(selectedJobOpening?.targetDate, t),
    },
    {
      label: t("jobOpenings.location"),
      value: selectedJobOpening?.officeLocation?.label ?? t("common.none"),
    },
    {
      label: t("jobOpenings.currency"),
      value: selectedJobOpening?.currencyDetails?.label ?? t("common.none"),
    },
    {
      label: t("jobOpenings.salary"),
      value: selectedJobOpening?.salaryDetails?.label ?? t("common.none"),
    },
    {
      label: t("common.city"),
      value: selectedJobOpening?.addressInfo?.city ?? t("common.none"),
    },
    {
      label: t("common.province"),
      value: selectedJobOpening?.addressInfo?.province ?? t("common.none"),
    },
    {
      label: t("common.country"),
      value:
        selectedJobOpening?.addressInfo?.country?.label ?? t("common.none"),
    },
    {
      label: t("common.postalCode"),
      value: selectedJobOpening?.addressInfo?.postalCode ?? t("common.none"),
    },
    {
      label: t("common.requiredSkills"),
      value: skillList(selectedJobOpening?.requiredSkills ?? [], t),
    },
    {
      label: t("jobOpenings.remoteJob"),
      value: selectedJobOpening?.remoteJob ? t("common.yes") : t("common.no"),
    },
    {
      label: t("common.jobDescription"),
      value: selectedJobOpening?.jobDescription ?? t("common.none"),
    },
    {
      label: t("common.requirements"),
      value: selectedJobOpening?.requirements ?? t("common.none"),
    },
    {
      label: t("jobOpenings.benefits"),
      value: selectedJobOpening?.benefits ?? t("common.none"),
    },
  ];

  return (
    <div className="grid md:grid-cols-3 gap-y-5 gap-x-8">
      {userDetails.map((field, idx) => {
        //  Check if field is one of the rich text descriptions
        const isRichText = [
          t("common.jobDescription"),
          t("common.requirements"),
          t("jobOpenings.benefits"),
        ].includes(field.label);

        return (
          <div
            key={`${idx}-${field.label}`}
            className={isRichText ? "col-span-full" : ""}
          >
            <div className="text-sm text-gray-500 mb-1">{field.label}</div>

            {isRichText ? (
              //  1. Remove truncate class 2. Use dangerouslySetInnerHTML 3. Use ql-editor
              <div
                className="ql-editor !p-0 break-words whitespace-normal"
                dangerouslySetInnerHTML={{
                  __html: field.value?.toString() || t("common.none"),
                }}
              />
            ) : (
              <div className="max-w truncate pr-5">
                {field.value && field.value !== ""
                  ? field.value.toString()
                  : t("common.none")}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default DetailsCard;
