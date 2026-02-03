import { useSelector } from "react-redux";

import { useTranslation } from "react-i18next";
import type { RootState } from "../../../../store/store";
import {
  formatDateTime,
  HTMLFormat,
  labelList,
} from "../../../../services/common";

const DetailsCard = () => {
  const { t } = useTranslation();
  const { selectedInterview } = useSelector(
    (state: RootState) => state.interviews
  );

  const userDetails = [
    {
      label: "Interview Name",
      value: selectedInterview?.interviewName ?? t("common.none"),
    },
    {
      label: "Posting Title",
      value: selectedInterview?.postingTitleDetails?.label ?? t("common.none"),
    },
    {
      label: "Department Name",
      value: selectedInterview?.departmentDetails?.label ?? t("common.none"),
    },
    {
      label: "Candidate Name",
      value: selectedInterview?.candidateDetails?.label ?? t("common.none"),
    },
    {
      label: "Interview Owner",
      value:
        selectedInterview?.interviewOwnerDetails?.label ?? t("common.none"),
    },
    {
      label: "From Date",
      value:
        formatDateTime(selectedInterview?.fromDateTime, t) ?? t("common.none"),
    },
    {
      label: "To Date",
      value:
        formatDateTime(selectedInterview?.toDateTime, t) ?? t("common.none"),
    },
    {
      label: "Interviewers",
      value: labelList(
        (selectedInterview?.interviewers ?? []).map((i) => ({
          label: i?.label ?? "",
        }))
      ),
    },
    {
      label: "Status",
      value:
        selectedInterview?.interviewStatusDetails?.label ?? t("common.none"),
    },
    {
      label: "Comments",
      value: HTMLFormat(selectedInterview?.comments) ?? t("common.none"),
    },
  ];

  return (
    <div className="grid md:grid-cols-3 gap-y-5 gap-x-8">
      {userDetails.map((field, idx) => {
        const isComments = field.label === "Comments";
        return (
          <div
            key={`${idx}-${field.label}`}
            className={isComments ? "md:col-span-3" : ""}
          >
            <div className="text-sm text-gray-500 mb-1">{field.label}</div>

            {isComments ? (
              <div className="pr-5 whitespace-pre-line">
                {field.value && field.value !== ""
                  ? field.value.toString()
                  : t("common.none")}
              </div>
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
