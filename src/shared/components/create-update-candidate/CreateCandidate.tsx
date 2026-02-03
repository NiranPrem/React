import CloseLayout from "../close-layout/CloseLayout";
import { useSelector } from "react-redux";
import AtsLoader from "../ats-loader/AtsLoader";
import CreateUpdateCandidate from "./CreateUpdateCandidate";
import type { RootState } from "../../../store/store";
import { useTranslation } from "react-i18next";

const CreateCandidate = () => {
  const { t } = useTranslation();
  const { loading: masterDataLoading } = useSelector(
    (state: RootState) => state.masterData
  );
  const { loading: candidatesLoading } = useSelector(
    (state: RootState) => state.candidates
  );

  return (
    <div
      className="w-full overflow-y-auto bg-[#F6F6F6]"
      style={{ height: "calc(100vh - 64px)" }}
    >
      {(masterDataLoading || candidatesLoading) && <AtsLoader />}
      {/* Close page button component */}
      <CloseLayout title={t("candidates.createCandidate")} />
      {/* Form for creating a new job opening */}
      <div className="m-5">
        <CreateUpdateCandidate />
      </div>
    </div>
  );
};

export default CreateCandidate;
