import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { ReferralInterface } from "../../../shared/interface/ReferralInterface";
import { getStatusClasses } from "../../../services/common";
import { Tooltip } from "primereact/tooltip";

const ReferralCard = ({ referral }: { referral: ReferralInterface }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const fullName = `${referral?.firstName ?? ""} ${referral?.lastName ?? ""
    }`.trim();

  // Helper to strip HTML tags
  const getNotesText = (html?: string) => {
    if (!html) return "";
    return html.replace(/<[^>]*>/g, "").trim();
  };

  const notesText = getNotesText(referral.notes);

  return (
    <>
      <Tooltip
        target={`.referral-card-tooltip-${referral.referralId}`}
        position="top"
        style={{ maxWidth: "300px", fontSize: "12px" }}
      />
      <button
        type="button"
        onClick={() => navigate(`referral-overview/${referral.referralId}`)}
        className={`grid grid-cols-[2fr_2fr_1fr] items-center bg-white rounded-l-[10px] transition duration-200 ease-in-out shadow-md hover:bg-gray-100 focus:outline-none cursor-pointer min-h-16 ${notesText ? `referral-card-tooltip-${referral.referralId}` : ""
          }`}
        data-pr-tooltip={notesText}
      >
        <div className="flex items-center gap-5 border-r border-[#EFEFEF] px-4 py-3 min-w-0">
          <span className="font-semibold text-gray-800 truncate min-w-0 max-w-full">
            {fullName || t("common.none")}
          </span>
        </div>
        <div className="flex items-center border-r border-[#EFEFEF] px-4 py-3 min-w-0">
          <span className="truncate min-w-0 max-w-full">
            {referral?.jobOpportunityDetails?.label ?? t("common.none")}
          </span>
        </div>
        <div className="flex items-center px-4 py-3 min-w-0">
          <span
            className={`text-sm font-medium px-3 py-1 rounded-full truncate min-w-0 max-w-full ${getStatusClasses(
              referral.statusDetails?.value ?? 0
            )}`}
          >
            {referral.statusDetails?.label ?? t("common.none")}
          </span>
        </div>
      </button>
    </>
  );
};

export default ReferralCard;
