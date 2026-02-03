import { useNavigate, useParams } from "react-router-dom";
import EmptyState from "../../../../../shared/components/empty-state/EmptyState";
import { useDispatch, useSelector } from "react-redux";
import { useCallback, useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { RootState } from "../../../../../store/store";
import AtsPaginator from "../../../../../shared/components/ats-pagination/Pagination";
import AtsLoader from "../../../../../shared/components/ats-loader/AtsLoader";
import {
  formatDateTime,
  getStatusClasses,
} from "../../../../../services/common";
import { fetchInterviewRequest } from "../../../../../store/reducers/interviewSlice";

const InterviewTab = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(10);

  const { loading, totalCount, interviews } = useSelector(
    (state: RootState) => state.interviews
  );
  const { openingId } = useParams<{ openingId: string }>();

  const jobOpeningId = Number.parseInt(openingId ?? "0");

  const filteredInterviews = interviews ?? [];

  const fetchPaginatedInterview = useCallback(
    (firstIndex: number, rowCount: number) => {
      const pageNumber = Math.floor(firstIndex / rowCount) + 1;
      const pageSize = rowCount;

      if (jobOpeningId) {
        dispatch(
          fetchInterviewRequest({
            pageNumber,
            pageSize,
            jobOpportunityId: jobOpeningId,
            candidateId: 0,
          })
        );
      }
    },
    [dispatch, jobOpeningId]
  );

  // Fetch only when jobOpeningId exists
  useEffect(() => {
    if (jobOpeningId) {
      fetchPaginatedInterview(first, rows);
    }
  }, [fetchPaginatedInterview, first, rows, jobOpeningId]);

  const handlePageChange = (page: string) => {
    navigate(page);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onPageChange = (e: any) => {
    setFirst(e.first);
    setRows(e.rows);
  };

  return (
    <div className="w-full px-5 pt-5 bg-white rounded-lg">
      <div className="flex justify-between items-center mb-5 border-b border-[#F6F6F6] pb-2">
        <h2 className="text-lg font-semibold text-gray-900">Interviews</h2>
        <button
          type="button"
          onClick={() => handlePageChange("create-interviews")}
          className="rounded-lg hover:bg-[#4279f9e8] px-2 py-1 cursor-pointer bg-[#4278F9] flex ju items-center gap-2 text-white"
          aria-label="Edit"
        >
          <Plus className="w-5 h-5" /> Schedule Interview
        </button>
      </div>
      <div className="min-w-[1024px]">
        {loading && <AtsLoader />}
        {!loading && filteredInterviews?.length === 0 && (
          <div style={{ height: "calc(100vh - 384px)", overflowY: "auto" }}>
            <EmptyState />
          </div>
        )}
        {filteredInterviews.length > 0 && (
          <>
            <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_1fr] gap-4 items-center bg-[#F6F6F6] px-8 py-4 rounded-t-[10px] relative z-20 min-w-0">
              <span className="font-medium truncate min-w-0 max-w-full">
                Interview Name
              </span>
              <span className="font-medium truncate min-w-0 max-w-full">
                From
              </span>
              <span className="font-medium truncate min-w-0 max-w-full">
                To
              </span>
              <span className="font-medium truncate min-w-0 max-w-full">
                Candidate Name
              </span>
              <span className="font-medium truncate min-w-0 max-w-full">
                Interview Status
              </span>
              <span className="font-medium truncate min-w-0 max-w-full">
                Feedback
              </span>
              <span className="font-medium truncate min-w-0 max-w-full">
                Reviewed By
              </span>
            </div>

            {/* Scrollable Document List */}
            <div
              style={{ height: "calc(100vh - 478px)", overflowY: "auto" }}
              className="border border-[#EFEFEF] rounded-b-[10px] bg-[#F6F6F6] relative z-10"
            >
              <div className="grid grid-cols-1 gap-2 p-5">
                {filteredInterviews.map((interview) => (
                  <div
                    key={interview.interviewId}
                    className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_1fr] items-center bg-white rounded-l-[10px] transition duration-200 ease-in-out shadow-md hover:bg-gray-100 focus:outline-none min-h-16"
                  >
                    <div className="flex items-center gap-5 border-r border-[#EFEFEF] px-4 py-3 min-w-0">
                      <button
                        type="button"
                        className="font-semibold truncate min-w-0 max-w-full text-[#1A73E8] cursor-pointer"
                        onClick={() =>
                          handlePageChange(
                            "interview-overview/" + interview.interviewId
                          )
                        }
                      >
                        {interview?.interviewName ?? t("common.none")}
                      </button>
                    </div>
                    <div className="flex items-center border-r border-[#EFEFEF] px-4 py-3 min-w-0">
                      <span className="truncate min-w-0 max-w-full">
                        {formatDateTime(interview?.fromDateTime, t) ??
                          t("common.none")}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 border-r border-[#EFEFEF] px-4 py-3 min-w-0">
                      <span className="truncate min-w-0 max-w-full">
                        {formatDateTime(interview?.toDateTime, t) ??
                          t("common.none")}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 border-r border-[#EFEFEF] px-4 py-3 text-[#1A73E8]  min-w-0">
                      <button
                        type="button"
                        className={`truncate min-w-0 max-w-full cursor-pointer`}
                        onClick={() =>
                          handlePageChange(
                            "candidate-overview/" + interview?.candidateId
                          )
                        }
                      >
                        {interview?.candidateDetails?.label ?? t("common.none")}
                      </button>
                    </div>
                    <div className="flex items-center gap-5 border-r border-[#EFEFEF] px-4 py-3 min-w-0">
                      <span
                        className={`text-sm font-medium px-3 py-1 rounded-full truncate min-w-0 max-w-full ${getStatusClasses(
                          interview.interviewStatusDetails?.value ?? 0
                        )}`}
                      >
                        {interview?.interviewStatusDetails?.label ??
                          t("common.none")}
                      </span>
                    </div>
                    <div className="flex items-center gap-5 border-r border-[#EFEFEF] px-4 py-3 min-w-0">
                      <span className="truncate min-w-0 max-w-full">
                        {interview?.feedbackDetails?.label ?? t("common.none")}
                      </span>
                    </div>
                    <div className="flex items-center gap-5 px-4 py-3 min-w-0">
                      <span className="truncate min-w-0 max-w-full">
                        {interview?.reviewedByDetails?.label ?? t("common.none")}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Pagination */}
            <AtsPaginator
              first={first}
              rows={rows}
              totalCount={totalCount ?? 0}
              onPageChange={onPageChange}
              hasDocuments={filteredInterviews.length > 0}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default InterviewTab;
