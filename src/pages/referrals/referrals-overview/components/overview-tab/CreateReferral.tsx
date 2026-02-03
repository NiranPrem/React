import CloseLayout from "../../../../../shared/components/close-layout/CloseLayout";
import type { RootState } from "../../../../../store/store";
import { useSelector } from "react-redux";
import CreateUpdateReferral from "./CreateUpdateReferral";
import AtsLoader from "../../../../../shared/components/ats-loader/AtsLoader";
import { useTranslation } from "react-i18next";

const CreateReferral = () => {
  const { t } = useTranslation();
  const { loading: masterDataLoading } = useSelector(
    (state: RootState) => state.masterData
  );
  const { loading: hiringManagerLoading } = useSelector(
    (state: RootState) => state.hiringManager
  );
  const { loading: assignedRecruiterLoading } = useSelector(
    (state: RootState) => state.assignedRecruiter
  );

  return (
    <div
      className="w-full overflow-y-auto bg-[#F6F6F6]"
      style={{ height: "calc(100vh - 64px)" }}
    >
      {(masterDataLoading ||
        hiringManagerLoading ||
        assignedRecruiterLoading) && <AtsLoader />}
      {/* Close page button component */}
      <CloseLayout title={t("referrals.createReferal")} />
      {/* Form for creating a new Referral Request */}
      <div className="m-5">
        <CreateUpdateReferral />
      </div>
    </div>
  );
};

export default CreateReferral;
