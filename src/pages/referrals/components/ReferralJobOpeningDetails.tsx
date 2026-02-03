import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import AtsLoader from "../../../shared/components/ats-loader/AtsLoader";
import type { RootState } from "../../../store/store";
import closeLogo from "../../../assets/icons/x-close.svg";
import { useTranslation } from "react-i18next";
import "quill/dist/quill.snow.css";
import "./ReferralJobOpeningDetails.css";
import { fetchReferralJobOpeningByIdRequest } from "../../../store/reducers/referralJobOpeningSlice";
import toastService from "../../../services/toastService";

const ReferralJobOpeningDetails = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { openingId } = useParams<{ openingId: string }>();
  const { selectedJobOpening, loading } = useSelector(
    (state: RootState) => state.referralJobOpening
  );

  useEffect(() => {
    if (openingId) {
      dispatch(fetchReferralJobOpeningByIdRequest({ openingId }));
    }
  }, [dispatch, openingId]);

  const handlePageChange = (page: string) => {
    navigate(page);
  };

  return (
    <div
      className="w-full overflow-y-auto bg-[#F6F6F6]"
      style={{ height: "calc(100vh - 64px)" }}
    >
      {loading && <AtsLoader />}
      {/* Close page button component */}
      <div className="flex justify-between items-center p-4 border-b gap-2 bg-white border-[#EFEFEF]">
        <div className="flex items-center gap-3">
          <h1 className="text-[22px] font-semibold truncate max-w-[calc(100vw-400px)]">
            {selectedJobOpening?.postingTitle || "None"}
          </h1>
          <button
            type="button"
            className="rounded-4xl py-1 px-3 border border-[#002E99] text-[#002E99]"
          >
            {selectedJobOpening?.numberOfPeople || "0"} Openings
          </button>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="px-2 py-1.5 bg-[#4278F9] flex text-white rounded-lg gap-1 items-center cursor-pointer text-lg font-small hover:bg-[#1051e9]"
            onClick={() => {
              if (selectedJobOpening?.statusId !== 1) {
                toastService.showError(
                  "The status of the job opening has been changed please contact the HR for more information."
                );
                return;
              }
              handlePageChange(
                `/referrals/job-opening-overview/${selectedJobOpening?.jobOpportunityId}/create-referral`
              );
            }}
          >
            Refer
          </button>
          <button
            type="button"
            className="rounded-lg hover:bg-[#F6F6F6] p-2 cursor-pointer"
            onClick={() => handlePageChange(`/referrals?tab=1`)}
          >
            <img src={closeLogo} className="w-7 h-7" alt="close" />
          </button>
        </div>
      </div>
      {/* Form for creating a new job opening */}
      <div className="m-5">
        <div className=" py-4 px-4 bg-white rounded-2xl">
          <div className="mb-3">
            <h2 className="text-lg font-semibold mb-3">
              {t("common.jobDescription")}
            </h2>
            {selectedJobOpening?.jobDescription ? (
              <div
                className="ql-editor text-left"
                dangerouslySetInnerHTML={{
                  __html: selectedJobOpening.jobDescription,
                }}
              ></div>
            ) : (
              <div className="text-left text-gray-500">None</div>
            )}
          </div>

          <div className="mb-3">
            <h2 className="text-lg font-semibold mb-3">Skill set</h2>
            <div className="text-left flex flex-wrap gap-2">
              {selectedJobOpening?.requiredSkills &&
                selectedJobOpening?.requiredSkills?.length > 0 ? (
                selectedJobOpening.requiredSkills.map(
                  (skill: string, index: number) => (
                    <span
                      key={index}
                      className="inline-block px-3 py-1 bg-gray-100 text-gray-900 rounded-lg text-sm"
                    >
                      {skill}
                    </span>
                  )
                )
              ) : (
                <span className="text-gray-500">None</span>
              )}
            </div>
          </div>

          <div className="mb-3">
            <h2 className="text-lg font-semibold mb-3">
              Roles and Responsibilities
            </h2>
            {selectedJobOpening?.requirements ? (
              <div
                className="ql-editor text-left"
                dangerouslySetInnerHTML={{
                  __html: selectedJobOpening.requirements,
                }}
              ></div>
            ) : (
              <div className="text-left text-gray-500">None</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferralJobOpeningDetails;
