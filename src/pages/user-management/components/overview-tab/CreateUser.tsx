import { useSelector } from "react-redux";
import AtsLoader from "../../../../shared/components/ats-loader/AtsLoader";
import CloseLayout from "../../../../shared/components/close-layout/CloseLayout";
import type { RootState } from "../../../../store/store";
import CreateUpdateUser from "./CreateUpdateUser";

const CreateUser = () => {
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
      <CloseLayout title={"Create User"} />
      {/* Form for creating a new user */}
      <div className="m-5">
        <CreateUpdateUser />
      </div>
    </div>
  );
};

export default CreateUser;
