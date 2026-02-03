import { useEffect, useState } from "react";
import PenSvg from "../../../../../assets/icons/pen.svg";
import closeLogo from "../../../../../assets/icons/x-close.svg";

import DetailsCard from "./DetailsCard";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../../../../store/store";
import { resetReferralEditState } from "../../../../../store/reducers/referralSlice";
import CreateUpdateReferral from "./CreateUpdateReferral";
import { useTranslation } from "react-i18next";

const OverviewTab = () => {
  const { t } = useTranslation();
  const [isEdit, setIsEdit] = useState(false);
  const dispatch = useDispatch();
  const { editSuccess } = useSelector((state: RootState) => state.referrals);
  const handleEdit = () => {
    dispatch(resetReferralEditState());
    setIsEdit((prev) => !prev);
  };

  useEffect(() => {
    if (editSuccess) {
      setIsEdit(false);
    }
  }, [editSuccess, dispatch]);

  return (
    <>
      {isEdit && (
        <div className="w-full bg-[#F6F6F6] rounded-lg ">
          <div
            style={{ height: "calc(100vh - 313px)", overflowY: "auto" }}
            className="pr-1"
          >
            <div className="flex justify-between items-center p-3 bg-white mb-5">
              <h1 className="text-[18px] font-semibold">
                {t("referrals.updateReferral")}
              </h1>
              <button
                type="button"
                className="rounded-lg hover:bg-[#F6F6F6] p-2 cursor-pointer"
                onClick={handleEdit}
              >
                <img src={closeLogo} className="w-5 h-5" alt="close" />
              </button>
            </div>
            <CreateUpdateReferral />
          </div>
        </div>
      )}
      {!isEdit && (
        <div className="w-full p-5 bg-white rounded-lg ">
          <div className="flex justify-between items-center mb-5 border-b border-[#F6F6F6] pb-2">
            <h2 className="text-lg font-semibold text-gray-900">
              {t("common.basicInfo")}
            </h2>
            <button
              type="button"
              onClick={handleEdit}
              className="rounded-lg hover:bg-[#F6F6F6] p-2 cursor-pointer"
              aria-label="Edit"
            >
              {!isEdit && <img src={PenSvg} className="w-5 h-5" alt="pen" />}
            </button>
          </div>
          <div style={{ height: "calc(100vh - 405px)", overflowY: "auto" }}>
            <DetailsCard />
          </div>
        </div>
      )}
    </>
  );
};

export default OverviewTab;
