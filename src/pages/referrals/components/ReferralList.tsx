import EmptyState from "../../../shared/components/empty-state/EmptyState";
import AtsPaginator from "../../../shared/components/ats-pagination/Pagination";
import ReferralCard from "./ReferralCard";
import AtsLoader from "../../../shared/components/ats-loader/AtsLoader";
import { useTranslation } from "react-i18next";
import type { ReferralInterface } from "../../../shared/interface/ReferralInterface";

interface Props {
  referrals: ReferralInterface[];
  loading: boolean;
  totalCount: number;
  first: number;
  rows: number;
  onPageChange: (e: { first: number; rows: number }) => void;
}

const ReferralList = ({
  referrals,
  loading,
  totalCount,
  first,
  rows,
  onPageChange,
}: Props) => {
  const { t } = useTranslation();

  return (
    <div>
      {loading && <AtsLoader />}
      {/* Table Header */}
      <div className="grid grid-cols-[2fr_2fr_1fr] gap-4 items-center bg-[#F6F6F6] px-8 py-4 rounded-t-[24px] relative z-20 -mt-[60px] min-w-0">
        <span className="font-medium truncate min-w-0 max-w-full">
          {t("referrals.candiateName")}
        </span>
        <span className="font-medium truncate min-w-0 max-w-full">
          {t("referrals.jobPostingTitle")}
        </span>
        <span className="font-medium truncate min-w-0 max-w-full">
          {t("referrals.status")}
        </span>
      </div>

      {/* List Body */}
      <div
        style={{ height: "calc(100vh - 208px)", overflowY: "auto" }}
        className="border border-[#EFEFEF] rounded-b-[10px] bg-[#F6F6F6] relative z-10"
      >
        <div className="grid grid-cols-1 gap-2 p-5">
          {referrals && referrals.length > 0
            ? referrals.map((ref) => (
              <ReferralCard key={ref.referralId} referral={ref} />
            ))
            : !loading && <EmptyState />}
        </div>
      </div>

      <AtsPaginator
        first={first}
        rows={rows}
        totalCount={totalCount}
        onPageChange={onPageChange}
        hasDocuments={referrals && referrals.length > 0}
      />
    </div>
  );
};

export default ReferralList;
