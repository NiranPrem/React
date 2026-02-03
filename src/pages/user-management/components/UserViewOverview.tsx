import { useEffect, useState, useMemo } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { TabMenu } from "primereact/tabmenu";
import { useDispatch, useSelector } from "react-redux";
import type { TabMenuTabChangeEvent } from "primereact/tabmenu";

import "./UserViewOverview.css";
import type { RootState } from "../../../store/store";
import CloseLayout from "../../../shared/components/close-layout/CloseLayout";
import AtsLoader from "../../../shared/components/ats-loader/AtsLoader";
import { useTranslation } from "react-i18next";
import DetailsCarousel from "../../../shared/components/ats-details-carousel/DetailsCarousel";
import OverviewTab from "./overview-tab/OverviewTab";
import { fetchUserManagementByIdRequest } from "../../../store/reducers/userManagementSlice";

const UserViewOverview = () => {
  const { t } = useTranslation();
  const items = [{ label: t("common.overview") }];
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTabIndex = Number.parseInt(searchParams.get("tab") ?? "0", 10);
  const [activeIndex, setActiveIndex] = useState(initialTabIndex);

  const handleTabChange = (e: TabMenuTabChangeEvent) => {
    setActiveIndex(e.index);
    setSearchParams({ tab: e.index.toString() }, { replace: true });
  };

  const dispatch = useDispatch();
  const { employeeId } = useParams<{ employeeId: string }>();
  const { selectedUserManagement, loading } = useSelector(
    (state: RootState) => state.userManagement
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

  useEffect(() => {
    if (employeeId) {
      dispatch(fetchUserManagementByIdRequest({ employeeId }));
    }
  }, [dispatch, employeeId]);

  const tabComponents = useMemo(() => [<OverviewTab key="overview" />], []);

  return (
    <div className="relative w-full text-[#181818] bg-white min-w-[1024px] overflow-hidden">
      {(loading ||
        masterDataLoading ||
        hiringManagerLoading ||
        assignedRecruiterLoading) && <AtsLoader />}

      <CloseLayout
        title={selectedUserManagement?.employeeName ?? "User Overview"}
      />

      {/* Carousel commented out to hide statistics section */}
      {/* <DetailsCarousel /> */}

      <div className="w-full px-5 bg-[#F6F6F6]">
        <TabMenu
          model={items}
          activeIndex={activeIndex}
          onTabChange={handleTabChange}
        />
        {/* Adjusted height to prevent outer scrollbar since carousel is hidden */}
        <div
          className="overflow-hidden"
        >
          {tabComponents[activeIndex] ?? (
            <p>{t("common.noContentAvailable")}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserViewOverview;
