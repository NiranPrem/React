import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "primereact/button";
import "./CreateUpdateFeedback.css";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

import AtsLoader from "../../../../shared/components/ats-loader/AtsLoader";
import {
  DropdownField,
  RichTextField,
} from "../../../../shared/components/ats-inputs/Inputs";

import { Rating } from "primereact/rating";

import type { RootState } from "../../../../store/store";
import type { FeedbackInterface } from "../../../../shared/interface/InterviewsInterface";
import {
  addFeedbackByInterviewRequest,
  updateFeedbackByInterviewRequest,
} from "../../../../store/reducers/interviewSlice";
import { fetchMasterDataRequest } from "../../../../store/reducers/masterDataSlice";

const CreateUpdateFeedback = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  // Redux state
  const { candidatesInterviewStatus, loading: masterLoading } = useSelector(
    (state: RootState) => state.masterData
  );
  const { feedback, loading } = useSelector(
    (state: RootState) => state.interviews
  );
  const { interviewId } = useParams<{ interviewId: string }>();

  const { user } = useSelector((state: RootState) => state.auth);
  // Form state
  const [formData, setFormData] = useState<FeedbackInterface>({
    interviewId: interviewId ? Number.parseInt(interviewId, 10) : 0,
    rating: 0,
  });

  useEffect(() => {
    if (feedback) {
      setFormData({
        interviewId: feedback.interviewId,
        rating: feedback.rating,
        statusId: feedback.statusId,
        comments: feedback.comments,
        createdBy: feedback.createdBy,
        updatedBy: feedback.updatedBy,
      });
    }
  }, [feedback]);

  // Submit Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: FeedbackInterface = {
      interviewId: formData.interviewId,
      rating: formData.rating,
      statusId: formData.statusId,
      comments: formData.comments,
    };
    if (feedback?.interviewId) {
      payload.createdBy = feedback.createdBy;
      payload.updatedBy = user?.userId ?? 0;
      dispatch(updateFeedbackByInterviewRequest(payload));
    } else {
      payload.createdBy = user?.userId ?? 0;
      payload.updatedBy = user?.userId ?? 0;
      dispatch(addFeedbackByInterviewRequest(payload));
    }
  };

  useEffect(() => {
    if (!candidatesInterviewStatus) {
      dispatch(fetchMasterDataRequest());
    }
  }, [dispatch, candidatesInterviewStatus]);

  // Validation
  const isFormValid = () =>
    formData.interviewId !== undefined &&
    (formData.comments ?? "").trim() !== "" &&
    formData.rating !== 0;

  // Render
  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {(loading || masterLoading) && <AtsLoader />}
      {candidatesInterviewStatus && (
        <>
          <div className="space-y-4 py-5 px-4 bg-white rounded-2xl">
            <h2 className="text-lg font-semibold">Feedback Details</h2>

            {/* Row: Rating + Status */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Rating */}
              <div>
                <label htmlFor="rating" className="block text-black mb-3">
                  Rating *
                </label>
                <Rating
                  id="rating"
                  value={formData.rating}
                  cancel={false}
                  onChange={(e) =>
                    setFormData({ ...formData, rating: e.value ?? 0 })
                  }
                />
              </div>

              {/* Status */}
              <div>
                <DropdownField
                  label="Status *"
                  placeholder="Select Status"
                  valueKey="statusId"
                  options={candidatesInterviewStatus}
                  formData={formData as Record<string, unknown>}
                  setFormData={
                    setFormData as React.Dispatch<
                      React.SetStateAction<Record<string, unknown>>
                    >
                  }
                />
              </div>
            </div>
          </div>

          <div className="space-y-6 py-5 px-4 bg-white rounded-2xl">
            <h2 className="text-lg font-semibold mb-2">Other Information</h2>
            <RichTextField
              label="Comments"
              valueKey="comments"
              formData={formData}
              setFormData={setFormData}
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-center gap-4 mt-4 mb-4">
            <div className="shadow-sm p-4 rounded-2xl flex gap-8 bg-white">
              {/* Clear */}
              <Button
                type="button"
                label={t("common.clear")}
                severity="secondary"
                outlined
                className="!bg-white !border !border-gray-300 !text-gray-700 !rounded-lg"
                onClick={() =>
                  setFormData({
                    rating: 0,
                    statusId: 0,
                    comments: "",
                    createdBy: 0,
                    updatedBy: 0,
                  })
                }
              />

              {/* Submit */}
              <Button
                type="submit"
                label={feedback ? "Update Feedback" : "Submit Feedback"}
                className="!bg-[#007BFF]"
                disabled={loading || !isFormValid()}
              />
            </div>
          </div>
        </>
      )}
    </form>
  );
};

export default CreateUpdateFeedback;
