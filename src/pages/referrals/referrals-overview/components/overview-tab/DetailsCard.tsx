import { useSelector } from "react-redux";
import type { RootState } from "../../../../../store/store";
import { formatDate, HTMLFormat } from "../../../../../services/common";
import { useTranslation } from "react-i18next";
import { Tooltip } from "primereact/tooltip";

const DetailsCard = () => {
  const { t } = useTranslation();
  const { selectedReferral } = useSelector(
    (state: RootState) => state.referrals
  );

  const userDetails = [
    {
      label: t("referrals.referringJob"),
      value: selectedReferral?.jobOpportunityDetails?.label ?? t("common.none"),
    },
    {
      label: t("common.firstName"),
      value: selectedReferral?.firstName ?? t("common.none"),
    },
    {
      label: t("common.lastName"),
      value: selectedReferral?.lastName ?? t("common.none"),
    },
    {
      label: t("common.email"),
      value: selectedReferral?.email ?? t("common.none"),
    },
    {
      label: t("common.mobile"),
      value: selectedReferral?.mobile ?? t("common.none"),
    },
    {
      label: t("common.currentEmployer"),
      value: selectedReferral?.currentEmployer ?? t("common.none"),
    },
    {
      label: t("common.currentJobTitle"),
      value: selectedReferral?.currentJobTitle ?? t("common.none"),
    },
    {
      label: t("referrals.relationship"),
      value: selectedReferral?.relationship?.label ?? t("common.none"),
    },
    {
      label: t("common.noticePeriod"),
      value: selectedReferral?.noticePeriod?.label ?? t("common.none"),
    },
    {
      label: t("referrals.notes"),
      value: HTMLFormat(selectedReferral?.notes) ?? t("common.none"),
    },
    {
      label: t("referrals.status"),
      value: selectedReferral?.statusDetails?.label ?? t("common.none"),
    },
    {
      label: t("common.createdDate"),
      value: formatDate(selectedReferral?.createdDate, t) ?? t("common.none"),
    },
  ];
  return (
    <div className="grid md:grid-cols-3 gap-y-5 gap-x-8">
      {userDetails.map((field, idx) => {
        const isNotes = field.label === t("referrals.notes");
        return (
          <div key={`${idx}-${field.label}`}>
            <div className="text-sm text-gray-500 mb-1">{field.label}</div>
            <div
              className={`max-w overflow-hidden text-ellipsis whitespace-pre pr-5 ${isNotes ? "details-tooltip-target" : ""}`}
              data-pr-tooltip={isNotes ? field.value?.toString() : undefined}
            >
              {field.value && field.value !== ""
                ? field.value.toString()
                : t("common.none")}
            </div>
          </div>
        );
      })}
      <Tooltip
        target=".details-tooltip-target"
        mouseTrack
        mouseTrackTop={10}
        style={{ maxWidth: "300px", whiteSpace: "pre-wrap" }}
      />
    </div>
  );
};

export default DetailsCard;
