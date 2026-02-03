import { useSelector } from "react-redux";
import type { RootState } from "../../../../../store/store";
import {
  formatDate,
  skillList,
} from "../../../../../services/common";
import { useTranslation } from "react-i18next";

const DetailsCard = () => {
  const { t } = useTranslation();
  const { selectedJobRequest } = useSelector(
    (state: RootState) => state.jobRequest
  );

  const userDetails = [
    {
      label: t("common.postingTitle"),
      value: selectedJobRequest?.positionTitle ?? t("common.none"),
    },
    {
      label: t("common.jobTitle"),
      value: selectedJobRequest?.jobTitle?.label ?? t("common.none"),
    },
    {
      label: t("request.numberResourcesNeeded"),
      value: selectedJobRequest?.numberOfResources ?? t("common.none"),
    },
    {
      label: t("common.createdDate"),
      value: formatDate(selectedJobRequest?.createdDate, t) ?? t("common.none"),
    },
    {
      label: "Created By",
      value: selectedJobRequest?.requestOwnerName ?? 
             (selectedJobRequest as any)?.createdByName ?? 
             (selectedJobRequest as any)?.createdByUserName ??
             (selectedJobRequest as any)?.ownerName ??
             t("common.none"),
    },
    {
      label:
        selectedJobRequest?.jobRequestStatusId === 2
          ? "Reason for Approval"
          : selectedJobRequest?.jobRequestStatusId === 3
            ? "Reason for Rejection"
            : "Reason",
      value: selectedJobRequest?.reason ?? t("common.none"),
    },
    {
      label: t("common.jobDescription"),
      value: selectedJobRequest?.jobDescription,
    },
    {
      label: t("common.requirements"),
      value: selectedJobRequest?.requirement,
    },
    {
      label: t("common.requiredSkills"),
      value: skillList(selectedJobRequest?.requiredSkills ?? [], t),
    },
  ];
  return (
    <div className="grid md:grid-cols-3 gap-y-5 gap-x-8">
      {userDetails.map((field, idx) => {
        const isRichText = [
          t("common.jobDescription"),
          t("common.requirements"),
        ].includes(field.label);

        return (
          <div
            key={`${idx}-${field.label}`}
            className={isRichText ? "col-span-full" : ""}
          >
            <div className="text-sm text-gray-500 mb-1">{field.label}</div>

            {isRichText ? (
              field.value && typeof field.value === "string" && field.value.trim() !== "" ? (
                <div
                  className="ql-editor !p-0 break-words whitespace-normal"
                  dangerouslySetInnerHTML={{
                    __html: String(field.value),
                  }}
                />
              ) : (
                <div className="text-left text-gray-500">{t("common.none")}</div>
              )
            ) : (
              <div className="max-w truncate pr-5" title={field.value?.toString() || t("common.none")}>
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
