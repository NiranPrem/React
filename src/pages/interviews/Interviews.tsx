import { useEffect, useRef, useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import MainPageHeader from "../../shared/components/main-page-header/MainPageHeader";
import AtsLoader from "../../shared/components/ats-loader/AtsLoader";
import AtsPaginator from "../../shared/components/ats-pagination/Pagination";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import EmptyState from "../../shared/components/empty-state/EmptyState";
import { formatDateTime, getStatusClasses } from "../../services/common";
import {
  fetchInterviewRequest,
  searchInterviewRequest,
} from "../../store/reducers/interviewSlice";
import type { InterviewInterface } from "../../shared/interface/InterviewsInterface";
import InterviewFilterDrawer, {
  type InterviewFilterValues,
} from "../interviews/InterviewFilterDrawer";

const Interviews = () => {
  const isFirstRender = useRef(true);
  const isFilterDataFetched = useRef(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(15);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeFilters, setActiveFilters] =
    useState<InterviewFilterValues | null>(null);
  const [masterFilterOptions, setMasterFilterOptions] = useState<
    InterviewInterface[]
  >([]);

  const { interviews, loading, totalCount } = useSelector(
    (state: RootState) => state.interviews,
  );
  const isAnyFilterActive = useMemo(() => {
    if (!activeFilters) return false;
    return (
      activeFilters.candidate.length > 0 ||
      activeFilters.interviewStatuses.length > 0 ||
      activeFilters.feedbackStatuses.length > 0 || // Added
      activeFilters.reviewedBy.length > 0 ||
      !!activeFilters.fromDate ||
      !!activeFilters.toDate
    );
  }, [activeFilters]);

  const fetchFullDataForFilter = () => {
    if (totalCount && totalCount > 0) {
      dispatch(
        fetchInterviewRequest({
          pageNumber: 1,
          pageSize: totalCount,
          jobOpportunityId: 0,
          candidateId: 0,
        }),
      );
      isFilterDataFetched.current = true;
    }
  };
  // Logic to update master options for the filter drawer
  useEffect(() => {
    if (interviews && Array.isArray(interviews)) {
      const isFullFetch =
        interviews.length >= (totalCount || 0) && totalCount !== 0;
      if (!searchTerm && (isFullFetch || masterFilterOptions.length === 0)) {
        setMasterFilterOptions(interviews);
      }
    }
  }, [interviews, totalCount, searchTerm]);

  // Derive Filter Options
  const uniqueCandidates = useMemo(() => {
    const map = new Map();
    masterFilterOptions.forEach((item) => {
      if (item.candidateDetails)
        map.set(item.candidateId, item.candidateDetails);
    });
    return Array.from(map.values())
      .map((c) => ({ id: c.value, label: c.label }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [masterFilterOptions]);

  const uniqueStatuses = useMemo(() => {
    const map = new Map();
    masterFilterOptions.forEach((item) => {
      if (item.interviewStatusDetails)
        map.set(item.interviewStatusDetails.value, item.interviewStatusDetails);
    });
    return Array.from(map.values())
      .map((s) => ({ id: s.value, label: s.label }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [masterFilterOptions]);

  const uniqueFeedbackStatuses = useMemo(() => {
    const map = new Map();
    masterFilterOptions.forEach((item) => {
      if (item.feedbackDetails)
        map.set(item.feedbackDetails.value, item.feedbackDetails);
    });
    return Array.from(map.values())
      .map((s) => ({ id: s.value, label: s.label }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [masterFilterOptions]);

  const uniqueReviewers = useMemo(() => {
    const map = new Map();
    masterFilterOptions.forEach((item) => {
      // Note: Adjust item.reviewedByDetails based on your exact interface property
      if (item.reviewedByDetails)
        map.set(item.reviewedByDetails.value, item.reviewedByDetails);
    });
    return Array.from(map.values())
      .map((r) => ({ id: r.value, label: r.label }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [masterFilterOptions]);

  // Filter Logic
  const filteredResult = useMemo(() => {
    if (!isAnyFilterActive) return [];
    let data = [...masterFilterOptions];

    data = data.filter((item) => {
      const candidateMatch =
        activeFilters!.candidate.length === 0 ||
        activeFilters!.candidate.includes(item.candidateId ?? 0);
      const statusMatch =
        activeFilters!.interviewStatuses.length === 0 ||
        (item.interviewStatusDetails &&
          activeFilters!.interviewStatuses.includes(
            item.interviewStatusDetails.value ?? 0,
          ));
      // Added Feedback Filter
      const feedbackMatch =
        activeFilters!.feedbackStatuses.length === 0 ||
        (item.feedbackDetails &&
          activeFilters!.feedbackStatuses.includes(
            item.feedbackDetails.value ?? 0,
          ));

      // Added Reviewer Filter
      const reviewerMatch =
        activeFilters!.reviewedBy.length === 0 ||
        (item.reviewedByDetails &&
          activeFilters!.reviewedBy.includes(
            item.reviewedByDetails.value ?? 0,
          ));
      // Date Range Match
      const itemTime = item.fromDateTime
        ? new Date(item.fromDateTime).getTime()
        : 0;
      const fromMatch =
        !activeFilters!.fromDate ||
        itemTime >= new Date(activeFilters!.fromDate).getTime();
      const toMatch =
        !activeFilters!.toDate ||
        itemTime <= new Date(activeFilters!.toDate).getTime();
      return (
        candidateMatch &&
        statusMatch &&
        feedbackMatch &&
        reviewerMatch &&
        fromMatch &&
        toMatch
      );
    });

    if (searchTerm) {
      const low = searchTerm.toLowerCase();
      data = data.filter(
        (i) =>
          i.interviewName?.toLowerCase().includes(low) ||
          i.candidateDetails?.label?.toLowerCase().includes(low),
      );
    }
    return data;
  }, [masterFilterOptions, activeFilters, isAnyFilterActive, searchTerm]);

  const displayData = useMemo(() => {
    if (isAnyFilterActive) return filteredResult.slice(first, first + rows);
    return (interviews || []).slice(0, rows);
  }, [interviews, filteredResult, isAnyFilterActive, first, rows]);

  const filteredInterviews = interviews ?? [];

  const fetchPaginatedInterview = (firstIndex: number, rowCount: number) => {
    if (isAnyFilterActive) return;
    const pageNumber = Math.floor(firstIndex / rowCount) + 1;
    const pageSize = rowCount;
    const jobOpportunityId = 0;
    const candidateId = 0;
    const requestPayload = {
    pageNumber,
    pageSize: rowCount,
    jobOpportunityId: 0,
    candidateId: 0,
    fromDate: activeFilters?.fromDate || null,
    toDate: activeFilters?.toDate || null,
  };
    
    if (searchTerm) {
    // 3. Use the spread operator to add the searchTerm
    dispatch(searchInterviewRequest({ ...requestPayload, searchTerm }));
  } else {
    // 4. Pass the object directly
    dispatch(fetchInterviewRequest(requestPayload));
  }
  };

  useEffect(() => {
    fetchPaginatedInterview(first, rows);
  }, [first, rows]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const delayDebounce = setTimeout(() => {
      setFirst(0); // Reset to first page when searching
      handleSearch();
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  const handleSearch = () => {
    dispatch(
      searchInterviewRequest({
        pageNumber: 1,
        pageSize: rows,
        jobOpportunityId: 0,
        candidateId: 0,
        searchTerm,
      fromDate: activeFilters?.fromDate,
      toDate: activeFilters?.toDate,
      }),
    );
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onPageChange = (e: any) => {
    setFirst(e.first);
    setRows(e.rows);
    // If no filter is active, fetch from API. If filter IS active,
    // displayData's useMemo handles it locally.
    if (!isAnyFilterActive) {
      fetchPaginatedInterview(e.first, e.rows);
    }
  };

  const handlePageChange = (page: string) => {
    navigate(page);
  };

  return (
    <div className="relative w-full h-full bg-[#F6F6F6]">
      {loading && <AtsLoader />}
      {/* Header */}
      <div className="min-w-[1024px]">
        <MainPageHeader
          title={"Interviews"}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onCreate={() => handlePageChange("create-interviews")}
          onFilterOpen={() => {
            setIsFilterOpen(true);
            if (masterFilterOptions.length < (totalCount || 0))
              fetchFullDataForFilter();
          }}
        />
        <InterviewFilterDrawer
          open={isFilterOpen}
          initialValues={activeFilters}
          onClose={() => setIsFilterOpen(false)}
          onApply={(f) => {
            setActiveFilters(f);
            setFirst(0);
            setIsFilterOpen(false);
            fetchPaginatedInterview(0, rows);
          }}
          onReset={() => {
            setActiveFilters(null);
            setFirst(0);
            setIsFilterOpen(false);
            fetchPaginatedInterview(0, rows);
          }}
          candidates={uniqueCandidates}
          interviewStatuses={uniqueStatuses}
          feedbackStatuses={uniqueFeedbackStatuses} // Added
          reviewedBy={uniqueReviewers}
        />
      </div>
      {/* Table Header */}
      <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_1fr] gap-4 items-center bg-[#F6F6F6] px-8 py-4 rounded-t-[24px] relative z-20 -mt-[60px] min-w-0">
        <span className="font-medium truncate min-w-0 max-w-full">
          Interview Name
        </span>
        <span className="font-medium truncate min-w-0 max-w-full">From</span>
        <span className="font-medium truncate min-w-0 max-w-full">To</span>
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

      {/* interview List */}
      <div
        style={{ height: "calc(100vh - 208px)", overflowY: "auto" }}
        className="border border-[#EFEFEF] rounded-b-[10px] bg-[#F6F6F6] relative z-10"
      >
        <div className="grid grid-cols-1 gap-2 p-5">
          {displayData.length > 0
            ? displayData.map((interview: InterviewInterface) => (
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
                          "interview-overview/" + interview.interviewId,
                        )
                      }
                    >
                      {interview?.interviewName ?? t("common.none")}
                    </button>
                  </div>
                  <div className="flex items-center border-r border-[#EFEFEF] px-4 py-3 min-w-0">
                    <span className={`truncate min-w-0 max-w-full`}>
                      {formatDateTime(interview?.fromDateTime, t) ??
                        t("common.none")}
                        
                    </span>
                  </div>
                  <div className="flex items-center gap-2 border-r border-[#EFEFEF] px-4 py-3 min-w-0">
                    <span className={`truncate min-w-0 max-w-full`}>
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
                          interview?.interviewId +
                            "/candidate-overview/" +
                            interview?.candidateId,
                        )
                      }
                    >
                      {interview?.candidateDetails?.label ?? t("common.none")}
                    </button>
                  </div>
                  <div className="flex items-center gap-2 border-r border-[#EFEFEF] px-4 py-3 min-w-0">
                    <span
                      className={`text-sm font-medium px-3 py-1 rounded-full truncate min-w-0 max-w-full ${getStatusClasses(
                        interview.interviewStatusDetails?.value ?? 0,
                      )}`}
                    >
                      {interview?.interviewStatusDetails?.label ??
                        t("common.none")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 border-r border-[#EFEFEF] px-4 py-3 min-w-0">
                    <span className={`truncate min-w-0 max-w-full`}>
                      {interview?.feedbackDetails?.label ?? t("common.none")}
                    </span>
                  </div>
                  <div className="flex items-center px-5 py-3 min-w-0">
                    <span className={`truncate min-w-0 max-w-full`}>
                      {interview?.reviewedByDetails?.label ?? t("common.none")}
                    </span>
                  </div>
                </div>
              ))
            : !loading && <EmptyState />}
        </div>
      </div>
      {/* Pagination */}
      <AtsPaginator
        first={first}
        rows={rows}
        totalCount={isAnyFilterActive ? filteredResult.length : totalCount || 0}
        onPageChange={(e) => {
          setFirst(e.first);
          setRows(e.rows);
        }}
        // Check displayData instead of filteredInterviews
        hasDocuments={displayData.length > 0}
      />
    </div>
  );
};

export default Interviews;
