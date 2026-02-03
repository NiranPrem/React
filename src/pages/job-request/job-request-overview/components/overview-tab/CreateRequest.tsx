import CloseLayout from "../../../../../shared/components/close-layout/CloseLayout";
import type { RootState } from "../../../../../store/store";
import { useSelector } from "react-redux";
import CreateUpdateJobRequest from "./CreateUpdateJobRequest";
import AtsLoader from "../../../../../shared/components/ats-loader/AtsLoader";
import { useTranslation } from "react-i18next";

const CreateRequest = () => {
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
      <CloseLayout title={t("request.createJobRequest")}/>
      {/* Form for creating a new job Request */}
      <div className="m-5">
        <CreateUpdateJobRequest />
      </div>
    </div>
  );
};

export default CreateRequest;
