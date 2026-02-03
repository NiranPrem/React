import { useEffect, useState } from "react";
import PenSvg from "../../../../assets/icons/pen.svg";
import closeLogo from "../../../../assets/icons/x-close.svg";

import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../../../store/store";
import {
  fetchFeedbackByInterviewIdRequest,
  resetInterviewEditState,
} from "../../../../store/reducers/interviewSlice";
import CreateUpdateFeedback from "./CreateUpdateFeedback";
import DetailsCard from "./DetailsCard";
import { useParams } from "react-router-dom";
import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";

const FeedbackTab = () => {
  const [isEdit, setIsEdit] = useState(false);
  const dispatch = useDispatch();
  const { editSuccess, feedback, loading, success, selectedInterview } = useSelector(
    (state: RootState) => state.interviews
  );
  const { interviewId } = useParams<{ interviewId: string }>();
  const { t } = useTranslation();
  const { user } = useSelector((state: RootState) => state.auth);
  const isMatched = selectedInterview?.interviewers?.some(item => item.value === user?.userId);

  const handleEdit = () => {
    dispatch(resetInterviewEditState());
    setIsEdit((prev) => !prev);
  };

  useEffect(() => {
    if (interviewId) {
      dispatch(fetchFeedbackByInterviewIdRequest({ interviewId }));
    }
  }, [dispatch, interviewId]);

  useEffect(() => {
    if (editSuccess || success) {
      setIsEdit(false);
    }
  }, [editSuccess, success, dispatch]);

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
                {feedback ? "Update Feedback" : "Create Feedback"}
              </h1>
              <button
                type="button"
                className="rounded-lg hover:bg-[#F6F6F6] p-2 cursor-pointer"
                onClick={handleEdit}
              >
                <img src={closeLogo} className="w-5 h-5" alt="close" />
              </button>
            </div>
            <CreateUpdateFeedback />
          </div>
        </div>
      )}
      {!isEdit && (
        <div className="w-full p-5 bg-white rounded-lg ">
          <div className="flex justify-between items-center mb-5 border-b border-[#F6F6F6] pb-2">
            <h2 className="text-lg font-semibold text-gray-900">
              Feedback Info
            </h2>
            {feedback && !loading && isMatched && (
              <button
                type="button"
                onClick={handleEdit}
                className="rounded-lg hover:bg-[#F6F6F6] p-2 cursor-pointer"
                aria-label="Edit"
              >
                {!isEdit && <img src={PenSvg} className="w-5 h-5" alt="pen" />}
              </button>
            )}
            {!feedback && !loading && isMatched && (
              <button
                type="button"
                onClick={handleEdit}
                className="rounded-lg hover:bg-[#4279f9e8] px-2 py-1 cursor-pointer bg-[#4278F9] flex items-center gap-2 text-white"
                aria-label="Add"
              >
                <Plus className="h-5 w-5" /> {t("common.add")}
              </button>
            )}
          </div>
          <div style={{ height: "calc(100vh - 398px )", overflowY: "auto" }}>
            <DetailsCard />
          </div>
        </div>
      )}
    </>
  );
};

export default FeedbackTab;
