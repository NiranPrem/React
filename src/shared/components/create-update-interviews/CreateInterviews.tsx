import CloseLayout from "../close-layout/CloseLayout";
import { useSelector } from "react-redux";
import AtsLoader from "../ats-loader/AtsLoader";
import CreateUpdateInterviews from "./CreateUpdateInterviews";
import type { RootState } from "../../../store/store";

const CreateInterviews = () => {
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
      <CloseLayout title={"Create Interview"} />
      {/* Form for creating a new interview */}
      <div className="m-5">
        <CreateUpdateInterviews />
      </div>
    </div>
  );
};

export default CreateInterviews;
