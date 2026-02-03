import { useEffect, useState, useMemo } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { TabMenu } from "primereact/tabmenu";
import { useDispatch, useSelector } from "react-redux";
import OverviewTab from "./components/overview-tab/OverviewTab";
import HistoryTab from "./components/history-tab/HistoryTab";
import type { TabMenuTabChangeEvent } from "primereact/tabmenu";

import "./ReferralOverview.css";
import type { RootState } from "../../../store/store";
import CloseLayout from "../../../shared/components/close-layout/CloseLayout";
import { fetchReferralByIdRequest } from "../../../store/reducers/referralSlice";
import AtsLoader from "../../../shared/components/ats-loader/AtsLoader";
import { useTranslation } from "react-i18next";
import DetailsCarousel from "../../../shared/components/ats-details-carousel/DetailsCarousel";
import ResumeTab from "./components/resume-tab/ResumeTab";

const ReferralOverview = () => {
  const { t } = useTranslation();

  const items = [
    { label: t("common.overview") },
    { label: t("common.resume") },
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
  const { referralId } = useParams<{ referralId: string }>();
  const { selectedReferral, loading } = useSelector(
    (state: RootState) => state.referrals
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

  // Fetch rewquest by ID when component mounts or rewquestId changes
  useEffect(() => {
    if (referralId) {
      dispatch(fetchReferralByIdRequest({ referralId }));
    }
  }, [dispatch, referralId]);

  // Define the tab components to be rendered based on the active index
  const tabComponents = useMemo(
    () => [
      <OverviewTab key="overview" />,
      <ResumeTab key="resume" />,
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
        title={
          selectedReferral?.firstName
            ? `${selectedReferral.firstName} ${selectedReferral.lastName ?? ""}`
            : t("common.referrals")
        }
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

export default ReferralOverview;
