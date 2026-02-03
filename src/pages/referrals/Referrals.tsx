import { useEffect, useRef, useState, useMemo } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import MainPageHeader from "../../shared/components/main-page-header/MainPageHeader";
import ReferralList from "./components/ReferralList";
import ReferralJobOpenings from "./components/ReferralJobOpenings";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import {
  fetchReferralRequest,
  searchReferralRequest,
} from "../../store/reducers/referralSlice";
import {
  fetchReferralActiveJobOpeningDetailsRequest,
} from "../../store/reducers/referralJobOpeningSlice";
import ReferralFilterDrawer, {
  type FilterValues,
} from "./components/ReferralFilterDrawer";
import type { ReferralInterface } from "../../shared/interface/ReferralInterface";
import type { JobInterface } from "../../shared/interface/JobInterface";

const Referrals = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const location = useLocation();

  const [searchParams, setSearchParams] = useSearchParams();
  const tabFromUrl = searchParams.get("tab");
  const [tab, setTab] = useState<string>(tabFromUrl ?? "0");

  const [searchTerm, setSearchTerm] = useState("");
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(15);

  const isFirstRender = useRef(true);
  const isFilterDataFetched = useRef(false);
  const isJobFilterDataFetched = useRef(false);

  // Filter State
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [allReferralsForFilter, setAllReferralsForFilter] = useState<ReferralInterface[]>([]);
  const [allJobsForFilter, setAllJobsForFilter] = useState<JobInterface[]>([]);

  // Persistence
  const [activeFilters, setActiveFilters] = useState<FilterValues | null>(
    () => {
      const saved = sessionStorage.getItem("referralFilters");
      return saved ? JSON.parse(saved) : null;
    }
  );

  const { referrals, loading, totalCount, editSuccess } = useSelector(
    (state: RootState) => state.referrals
  );

  const { jobOpenings, loading: jobLoading, totalCount: jobTotalCount } = useSelector(
    (state: RootState) => state.referralJobOpening
  );

  const handlePageChange = (page: string) => navigate(page);

  const handleTabChange = (value: string) => {
    setTab(value);
    setSearchTerm("");
    setFirst(0);
    setSearchParams({ tab: value });
  };

  useEffect(() => {
    return () => {
      const nextPath = window.location.pathname;
      const isStayingInReferrals = nextPath.includes("referrals");
      const isCreateMode = nextPath.includes("create-referral");
      const isOverviewMode = nextPath.includes("referral-overview");

      if (!isStayingInReferrals || isCreateMode) {
        if (!isOverviewMode) {
          sessionStorage.removeItem("referralFilters");
        }
      }
    };
  }, [location]);

  useEffect(() => {
    if (activeFilters) {
      sessionStorage.setItem("referralFilters", JSON.stringify(activeFilters));
    }

    if (activeFilters && Object.keys(activeFilters).length === 0) {
      sessionStorage.removeItem("referralFilters");
    }
  }, [activeFilters]);
  const TAB_KEY = "REF_ACTIVE_TABS";

  useEffect(() => {
    const tabId = Date.now();
    const tabs = JSON.parse(localStorage.getItem(TAB_KEY) || "[]");
    tabs.push(tabId);
    localStorage.setItem(TAB_KEY, JSON.stringify(tabs));

    const handleUnload = () => {
      const navEntry = performance.getEntriesByType("navigation")[0] as any;
      const isReload = navEntry?.type === "reload";

      const currentTabs = JSON.parse(localStorage.getItem(TAB_KEY) || "[]");
      const updatedTabs = currentTabs.filter((id: number) => id !== tabId);

      // Clear on refresh
      if (isReload) {
        sessionStorage.removeItem("referralFilters");
      }

      if (!isReload && updatedTabs.length === 0) {
        localStorage.removeItem(TAB_KEY);
        sessionStorage.removeItem("referralFilters");
      } else {
        localStorage.setItem(TAB_KEY, JSON.stringify(updatedTabs));
      }
    };

    window.addEventListener("unload", handleUnload);
    return () => window.removeEventListener("unload", handleUnload);
  }, []);

  // Tab synchronization
  useEffect(() => {
    if (tabFromUrl && tabFromUrl !== tab) {
      setTab(tabFromUrl);
      setSearchTerm("");
      setFirst(0);
    }
  }, [tabFromUrl]);

  const prevTabRef = useRef(tab);

  useEffect(() => {
    if (prevTabRef.current !== tab) {
      setActiveFilters({});
      sessionStorage.removeItem("referralFilters");
    }
    isFilterDataFetched.current = false;
    isJobFilterDataFetched.current = false;

    prevTabRef.current = tab;
  }, [tab]);

  // -- FILTER LOGIC HELPERS --

  const isReferralFilterActive = useMemo(() => {
    if (!activeFilters) return false;
    return (
      (activeFilters.jobPostings && activeFilters.jobPostings.length > 0) ||
      (activeFilters.statuses && activeFilters.statuses.length > 0)
    );
  }, [activeFilters]);

  const isJobFilterActive = useMemo(() => {
    if (!activeFilters) return false;
    return (
      activeFilters.numberOfOpenings && activeFilters.numberOfOpenings.length > 0
    );
  }, [activeFilters]);

  // -- DATA FETCHING --

  const fetchGridData = () => {
    const pageNumber = Math.floor(first / rows) + 1;
    if (tab === "0") {
      if (searchTerm) {
        dispatch(searchReferralRequest({ pageNumber, pageSize: rows, searchTerm }));
      } else {
        dispatch(fetchReferralRequest({ pageNumber, pageSize: rows }));
      }
    } else {
      // Job Openings Fetch
      dispatch(fetchReferralActiveJobOpeningDetailsRequest({
        pageNumber,
        pageSize: rows,
        searchTerm
      }));
    }
  };

  const globalTotalCount = useRef(0);
  const globalJobTotalCount = useRef(0);

  useEffect(() => {
    if (!searchTerm && (totalCount ?? 0) > 0) {
      globalTotalCount.current = Math.max(globalTotalCount.current, totalCount || 0);
    }
    if (!searchTerm && (jobTotalCount ?? 0) > 0) {
      globalJobTotalCount.current = Math.max(globalJobTotalCount.current, jobTotalCount || 0);
    }
  }, [totalCount, jobTotalCount, searchTerm]);

  const fetchFullDataForFilter = () => {
    const countToFetch = totalCount || globalTotalCount.current;
    if (tab === "0") {
      if (!isFilterDataFetched.current && countToFetch > rows) {
        dispatch(fetchReferralRequest({ pageNumber: 1, pageSize: countToFetch }));
        isFilterDataFetched.current = true;
      }
    } else {
      const jobCountToFetch = jobTotalCount || globalJobTotalCount.current;
      if (!isJobFilterDataFetched.current && jobCountToFetch > rows) {
        dispatch(fetchReferralActiveJobOpeningDetailsRequest({
          pageNumber: 1,
          pageSize: jobCountToFetch,
          searchTerm: ""
        }));
        isJobFilterDataFetched.current = true;
      }
    }
  };

  const handleFilterOpen = () => {
    setIsFilterOpen(true);
    fetchFullDataForFilter();
  };

  // Debounced Search
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const delay = setTimeout(() => {
      setFirst(0); // Reset page on search
      fetchGridData();
    }, 500);
    return () => clearTimeout(delay);
  }, [searchTerm]);

  useEffect(() => {
    fetchGridData();
  }, [first, rows, editSuccess, tab]);
  useEffect(() => {
    if (searchTerm) return;

    if (tab === "0") {
      if (totalCount === 0 && globalTotalCount.current > 0) return;

      if (referrals && Array.isArray(referrals)) {
        const isFullSet = referrals.length >= (totalCount || 0);
        const isGlobalSet = referrals.length >= globalTotalCount.current;
        if (isFullSet || isGlobalSet || allReferralsForFilter.length === 0) {
          setAllReferralsForFilter(referrals);
        }
      }
    } else {
      // Same stale check for Job Openings
      if (jobTotalCount === 0 && globalJobTotalCount.current > 0) return;

      if (jobOpenings && Array.isArray(jobOpenings)) {
        const isFullSet = jobOpenings.length >= (jobTotalCount || 0);
        const isGlobalSet = jobOpenings.length >= globalJobTotalCount.current;
        if (isFullSet || isGlobalSet || allJobsForFilter.length === 0) {
          setAllJobsForFilter(jobOpenings);
        }
      }
    }
  }, [referrals, totalCount, jobOpenings, jobTotalCount, tab, searchTerm]);

  useEffect(() => {
    if (tab === "0" && isReferralFilterActive && !isFilterDataFetched.current && totalCount) {
      fetchFullDataForFilter();
    } else if (tab === "1" && isJobFilterActive && !isJobFilterDataFetched.current && jobTotalCount) {
      fetchFullDataForFilter();
    }
  }, [totalCount, isReferralFilterActive, jobTotalCount, isJobFilterActive, tab]);


  // -- FILTER OPTIONS --

  const uniqueJobPostings = useMemo(() => {
    const jobs = allReferralsForFilter
      .map((r) => r.jobOpportunityDetails)
      .filter((j) => j && j.value !== undefined);
    const uniqueMap = new Map();
    jobs.forEach((j) => uniqueMap.set(j?.value, j));
    return Array.from(uniqueMap.values()).map((j: any) => ({
      id: j.value,
      label: j.label,
    }));
  }, [allReferralsForFilter]);

  const availableStatuses = useMemo(() => {
    const statuses = allReferralsForFilter
      .map((r) => r.statusDetails)
      .filter((s) => s && s.value !== undefined);
    const uniqueMap = new Map();
    statuses.forEach((s) => uniqueMap.set(s?.value, s));
    return Array.from(uniqueMap.values()).map((s: any) => ({
      id: s.value,
      label: s.label,
    }));
  }, [allReferralsForFilter]);

  const uniqueNumberOfOpenings = useMemo(() => {
    const nums = allJobsForFilter
      .map((j) => j.numberOfPeople)
      .filter((n) => n !== undefined && n !== null);
    const unique = Array.from(new Set(nums)).sort((a, b) => (a as number) - (b as number));
    return unique.map((n) => ({
      id: n as number,
      label: String(n)
    }));
  }, [allJobsForFilter]);

  // -- FILTERING --

  const referralFilteredResult = useMemo(() => {
    const sourceData = searchTerm ? (referrals || []) : allReferralsForFilter;
    if (!isReferralFilterActive && !searchTerm) return [];

    return sourceData.filter((r) => {
      const jobMatch =
        !activeFilters?.jobPostings || activeFilters.jobPostings.length === 0 ||
        (r.jobOpportunityDetails &&
          r.jobOpportunityDetails.value !== undefined &&
          activeFilters.jobPostings.includes(r.jobOpportunityDetails.value));
      const statusMatch =
        !activeFilters?.statuses || activeFilters.statuses.length === 0 ||
        (r.statusDetails &&
          r.statusDetails.value !== undefined &&
          activeFilters.statuses.includes(r.statusDetails.value));
      return jobMatch && statusMatch;
    });
  }, [allReferralsForFilter, activeFilters, isReferralFilterActive, referrals, searchTerm]);

  const jobOpeningFilteredResult = useMemo(() => {
    const sourceData = searchTerm ? (jobOpenings || []) : allJobsForFilter;

    if (!isJobFilterActive && !searchTerm) return [];

    return sourceData.filter((j) => {
      const numMatch =
        !activeFilters?.numberOfOpenings || activeFilters?.numberOfOpenings.length === 0 ||
        (j.numberOfPeople !== undefined && activeFilters.numberOfOpenings.includes(j.numberOfPeople));
      return numMatch;
    });
  }, [allJobsForFilter, activeFilters, isJobFilterActive, jobOpenings, searchTerm]);

  const displayReferrals = useMemo(() => {
    if (searchTerm) {
      return referralFilteredResult;
    }
    if (isReferralFilterActive) {
      return referralFilteredResult.slice(first, first + rows);
    }
    if (referrals && totalCount && referrals.length === totalCount && totalCount > rows) {
      return referrals.slice(first, first + rows);
    }
    return referrals || [];
  }, [referrals, referralFilteredResult, isReferralFilterActive, first, rows, totalCount, searchTerm]);

  const displayJobOpenings = useMemo(() => {
    if (searchTerm) {
      return jobOpeningFilteredResult;
    }
    if (isJobFilterActive) {
      return jobOpeningFilteredResult.slice(first, first + rows);
    }
    if (jobOpenings && jobTotalCount && jobOpenings.length === jobTotalCount && jobTotalCount > rows) {
      return jobOpenings.slice(first, first + rows);
    }
    return jobOpenings || [];
  }, [jobOpenings, jobOpeningFilteredResult, isJobFilterActive, first, rows, jobTotalCount, searchTerm]);

  const onPageChange = (e: any) => {
    setFirst(e.first);
    setRows(e.rows);
  };

  // Sections for Drawer
  const filterSections = useMemo(() => {
    if (tab === "0") {
      return [
        { key: "jobPostings" as keyof FilterValues, title: "Job Posting", options: uniqueJobPostings },
        { key: "statuses" as keyof FilterValues, title: "Status", options: availableStatuses },
      ];
    } else {
      return [
        { key: "numberOfOpenings" as keyof FilterValues, title: "Number of Openings", options: uniqueNumberOfOpenings }
      ];
    }
  }, [tab, uniqueJobPostings, availableStatuses, uniqueNumberOfOpenings]);

  return (
    <div className="relative w-full h-full bg-[#F6F6F6]">
      <div className="min-w-[1024px]">
        <MainPageHeader
          title={tab === "0" ? t("common.referrals") : t("common.jobOpenings")}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onCreate={() => handlePageChange("create-referral")}
          showToggle={true}
          currentTab={tab as "0" | "1"}
          onTabChange={handleTabChange}
          onFilterOpen={handleFilterOpen}
        />

        <ReferralFilterDrawer
          open={isFilterOpen}
          initialValues={activeFilters}
          onClose={() => setIsFilterOpen(false)}
          onApply={(filters) => {
            setActiveFilters(filters);
            setFirst(0);
          }}
          onReset={() => {
            setActiveFilters({});
            setFirst(0);
            sessionStorage.removeItem("referralFilters");
            setIsFilterOpen(false);
          }}
          sections={filterSections}
        />

        {tab === "0" ? (
          <ReferralList
            referrals={displayReferrals}
            loading={loading}
            totalCount={isReferralFilterActive ? referralFilteredResult.length : totalCount || 0}
            first={first}
            rows={rows}
            onPageChange={onPageChange}
          />
        ) : (
          <ReferralJobOpenings
            jobOpenings={displayJobOpenings}
            loading={jobLoading}
            totalCount={isJobFilterActive ? jobOpeningFilteredResult.length : jobTotalCount || 0}
            first={first}
            rows={rows}
            onPageChange={onPageChange}
          />
        )}
      </div>
    </div>
  );
};

export default Referrals;
