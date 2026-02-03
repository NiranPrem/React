import { useEffect, useState, useMemo } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { TabMenu } from "primereact/tabmenu";
import { useDispatch, useSelector } from "react-redux";
import type { TabMenuTabChangeEvent } from "primereact/tabmenu";

import "./InterviewOverview.css";
import type { RootState } from "../../../store/store";
import CloseLayout from "../../../shared/components/close-layout/CloseLayout";
import AtsLoader from "../../../shared/components/ats-loader/AtsLoader";
import { useTranslation } from "react-i18next";
import DetailsCarousel from "../../../shared/components/ats-details-carousel/DetailsCarousel";
import OverviewTab from "./overview-tab/OverviewTab";
import DocumentsTab from "./documents-tab/DocumentsTab";
import { fetchInterviewByIdRequest } from "../../../store/reducers/interviewSlice";
import FeedbackTab from "./feedback-tab/FeedbackTab";
import HistoryTab from "./history-tab/HistoryTab";

const InterViewOverview = () => {
  const { t } = useTranslation();

  const items = [
    { label: t("common.overview") },
    { label: t("common.documents") },
    { label: t("common.feedback") },
    { label: t("common.history") },
  ];

  const [searchParams, setSearchParams] = useSearchParams();
  const initialTabIndex = Number.parseInt(searchParams.get("tab") ?? "0", 10);
  const [activeIndex, setActiveIndex] = useState(initialTabIndex);

  const handleTabChange = (e: TabMenuTabChangeEvent) => {
    setActiveIndex(e.index);
    setSearchParams({ tab: e.index.toString() }, { replace: true });
  };

  const dispatch = useDispatch();
  const { interviewId } = useParams<{ interviewId: string }>();
  const { selectedInterview, loading } = useSelector(
    (state: RootState) => state.interviews
  );

  const { loading: masterDataLoading } = useSelector(
    (state: RootState) => state.masterData
  );

  const { loading: hiringManagerLoading } = useSelector(
    (state: RootState) => state.hiringManager
  );

  const { loading: assignedRecruiterLoading } = useSelector(
    (state: RootState) => state.assignedRecruiter
  );

  // This effect is used to fetch the interview details based on the ID from the URL parameters
  useEffect(() => {
    if (interviewId) {
      dispatch(fetchInterviewByIdRequest({ interviewId }));
    }
  }, [dispatch, interviewId]);

  useEffect(() => {
    console.log("interviewId", interviewId);
  }, [interviewId]);

  // Define the tab components to be rendered based on the active index
  const tabComponents = useMemo(
    () => [
      <OverviewTab key="overview" />,
      <DocumentsTab key="documents" />,
      <FeedbackTab key="feedback" />,
      <HistoryTab key="history" />,
    ],
    []
  );

  return (
    <div className="relative w-full text-[#181818] bg-white min-w-[1024px]">
      {(loading ||
        masterDataLoading ||
        hiringManagerLoading ||
        assignedRecruiterLoading) && <AtsLoader />}

      <CloseLayout
        title={selectedInterview?.interviewName ?? "Interview Overview"}
      />

      {/* Carousel with Arrows */}
      <DetailsCarousel />

      {/* Tabs */}
      <div className="w-full px-5 bg-[#F6F6F6]">
        <TabMenu
          model={items}
          activeIndex={activeIndex}
          onTabChange={handleTabChange}
        />
        <div
          className="overflow-y-auto"
          style={{ height: "calc(100vh - 300px)" }}
        >
          {tabComponents[activeIndex] ?? (
            <p>{t("common.noContentAvailable")}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default InterViewOverview;
