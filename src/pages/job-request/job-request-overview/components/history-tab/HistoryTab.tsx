import { useDispatch, useSelector } from "react-redux";
import { Timeline } from "primereact/timeline";
import "./HistoryTab.css";
import TimelineCard from "./TimeLineCard";
import { useCallback, useEffect } from "react";
import EmptyState from "../../../../../shared/components/empty-state/EmptyState";
import type { JobRequestHistoryInterface } from "../../../../../shared/interface/HistoryInterface";
import type { RootState } from "../../../../../store/store";
import { fetchJobRequestHistoryRequest } from "../../../../../store/reducers/jobRequestHistorySlice";
import AtsLoader from "../../../../../shared/components/ats-loader/AtsLoader";
import { useTranslation } from "react-i18next";

const HistoryTab = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { selectedJobRequest, loading: jobRequestLoading } = useSelector(
    (state: RootState) => state.jobRequest
  );
  const { history, loading } = useSelector(
    (state: RootState) => state.jobRequestHistory
  );
  const fetchPaginatedHistory = useCallback(
    (id: number) => {
      dispatch(fetchJobRequestHistoryRequest({ id }));
    },
    [dispatch]
  );

  // Fetch paginated history on component mount
  useEffect(() => {
    if (selectedJobRequest?.id) {
      fetchPaginatedHistory(selectedJobRequest?.id);
    }
  }, [dispatch, fetchPaginatedHistory, selectedJobRequest?.id]);

  const customizedMarker = () => {
    return (
      <span className="flex w-5 h-5 items-center justify-center text-white rounded-full bg-[#D3D3D3]"></span>
    );
  };

  const customizedContent = (item: JobRequestHistoryInterface) => {
    return <TimelineCard {...item} />;
  };

  return (
    <div className="w-full px-5 pt-5 bg-white rounded-lg ">
      <div className="flex justify-between items-center mb-5 border-b border-[#F6F6F6] pb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          {t("common.timeline")}
        </h2>
      </div>
      {(loading || jobRequestLoading) && <AtsLoader />}
      {!loading && history?.length === 0 && (
        <div style={{ height: "calc(100vh - 388px)", overflowY: "auto" }}>
          <EmptyState />
        </div>
      )}
      {history?.length > 0 && (
        <div style={{ height: "calc(100vh - 388px)", overflowY: "auto" }}>
          <Timeline
            value={history}
            align="left" // <- Timeline aligned left here
            className="customized-timeline"
            marker={customizedMarker}
            content={customizedContent}
          />
        </div>
      )}
    </div>
  );
};

export default HistoryTab;
