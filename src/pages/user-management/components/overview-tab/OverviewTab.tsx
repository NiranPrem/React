import { useEffect, useState } from "react";
import PenSvg from "../../../../assets/icons/pen.svg";
import closeLogo from "../../../../assets/icons/x-close.svg";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import type { RootState } from "../../../../store/store";
import { resetInterviewEditState } from "../../../../store/reducers/interviewSlice";
import CreateUpdateUser from "./CreateUpdateUser";
import DetailsCard from "./DetailsCard";

const OverviewTab = () => {
  const { t } = useTranslation();
  const [isEdit, setIsEdit] = useState(false);
  const dispatch = useDispatch();
  const { editSuccess } = useSelector(
    (state: RootState) => state.userManagement
  );

  const handleEdit = () => {
    dispatch(resetInterviewEditState());
    setIsEdit((prev) => !prev);
  };

  useEffect(() => {
    if (editSuccess) setIsEdit(false);
  }, [editSuccess]);

  return (
    <>
      {isEdit ? (
        <div className="w-full bg-[#F6F6F6] rounded-lg">
          {/* Height adjusted to calc(100vh - 220px) to keep Update button visible */}
          <div
            style={{ height: "calc(100vh - 220px)", overflowY: "auto" }}
            className="pr-1 custom-scrollbar"
          >
            <div className="flex justify-between items-center p-3 bg-white mb-5 sticky top-0 z-10">
              <h1 className="text-[18px] font-semibold">Update User Details</h1>
              <button
                type="button"
                className="p-2 cursor-pointer hover:bg-gray-100 rounded-full"
                onClick={handleEdit}
              >
                <img src={closeLogo} className="w-5 h-5" alt="close" />
              </button>
            </div>
            <CreateUpdateUser />
          </div>
        </div>
      ) : (
        <div className="w-full p-5 bg-white rounded-lg">
          <div className="flex justify-between items-center mb-5 border-b border-[#F6F6F6] pb-2">
            <h2 className="text-lg font-semibold text-gray-900">
              {t("common.basicInfo")}
            </h2>
            <button
              type="button"
              onClick={handleEdit}
              className="p-2 cursor-pointer hover:bg-gray-100 rounded-full"
            >
              <img src={PenSvg} className="w-5 h-5" alt="pen" />
            </button>
          </div>
          <div style={{ height: "calc(100vh - 280px)", overflowY: "auto" }}>
            <DetailsCard />
          </div>
        </div>
      )}
    </>
  );
};

export default OverviewTab;
