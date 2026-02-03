import CloseLayout from "../close-layout/CloseLayout";
import { useSelector } from "react-redux";
import AtsLoader from "../ats-loader/AtsLoader";
import CreateUpdateScreening from "./CreateUpdateScreening";
import type { RootState } from "../../../store/store";

const CreateScreening = () => {
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
      <CloseLayout title={"Screening"} />
      {/* Form for creating a new screening */}
      <div className="m-5">
        <CreateUpdateScreening />
      </div>
    </div>
  );
};

export default CreateScreening;
