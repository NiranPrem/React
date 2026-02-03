import CloseLayout from "../../../../../shared/components/close-layout/CloseLayout";
import type { RootState } from "../../../../../store/store";
import { useSelector } from "react-redux";
import AtsLoader from "../../../../../shared/components/ats-loader/AtsLoader";
import CreateUpdateJobOpening from "./CreateUpdateJobOpening";
import { useTranslation } from "react-i18next";

const CreateOpening = () => {
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
      <CloseLayout title={t("jobOpenings.createJobOpening")} />
      {/* Form for creating a new job opening */}
      <div className="m-5">
        <CreateUpdateJobOpening />
      </div>
    </div>
  );
};

export default CreateOpening;
