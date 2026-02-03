import { useEffect, useState, useMemo } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { TabMenu } from "primereact/tabmenu";
import { useDispatch, useSelector } from "react-redux";
import OverviewTab from "./components/overview-tab/OverviewTab";
import HistoryTab from "./components/history-tab/HistoryTab";
import type { TabMenuTabChangeEvent } from "primereact/tabmenu";

import "./CandidateOverview.css";
import type { RootState } from "../../../store/store";
import CloseLayout from "../../../shared/components/close-layout/CloseLayout";
import AtsLoader from "../../../shared/components/ats-loader/AtsLoader";
import { fetchCandidateByIdRequest } from "../../../store/reducers/candidateSlice";
import DocumentsTab from "./components/documents-tab/DocumentsTab";
import SalaryAnnexureTab from "./components/salary-annexure-tab/SalaryAnnexureTab";
import { useTranslation } from "react-i18next";
import DetailsCarousel from "../../../shared/components/ats-details-carousel/DetailsCarousel";
import ResumeTab from "./components/resume-tab/ResumeTab";
import InterviewTab from "./components/interviews-tab/InterviewsTab";

const CandidateOverview = () => {
  const { t } = useTranslation();

  const items = [
    { label: t("candidates.basicDetails") },
    { label: t("candidates.salary") },
    { label: t("common.interviews") },
    { label: t("common.resume") },
    { label: t("common.documents") },
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
  const { candidateId } = useParams<{ candidateId: string }>();
  const { selectedCandidate, loading } = useSelector(
    (state: RootState) => state.candidates
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

  // Fetch candidate by ID when component mounts or candidateId changes
  useEffect(() => {
    if (candidateId) {
      dispatch(fetchCandidateByIdRequest({ candidateId }));
    }
  }, [dispatch, candidateId]);

  // Define the tab components to be rendered based on the active index
  const tabComponents = useMemo(
    () => [
      <OverviewTab key="basic" />,
      <SalaryAnnexureTab key="salary-annexure" />,
      <InterviewTab key="interview" />,
      <ResumeTab key="resume" />,
      <DocumentsTab key="documents" />,
      <HistoryTab key="history" />,
    ],
    []
  );

  const selectedCandidateFullName = useMemo(() => {
    return `${selectedCandidate?.firstName || ""} ${selectedCandidate?.lastName || ""
      }`.trim();
  }, [selectedCandidate]);

  return (
    <div className="relative w-full text-[#181818] bg-white min-w-[1024px]">
      {(loading ||
        masterDataLoading ||
        hiringManagerLoading ||
        assignedRecruiterLoading) && <AtsLoader />}

      <CloseLayout
        title={selectedCandidateFullName || t("common.candidates")}
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

export default CandidateOverview;
