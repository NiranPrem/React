import { useEffect, useRef, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import EmptyState from "../../shared/components/empty-state/EmptyState";
import {
  fetchCandidateRequest,
  searchCandidateRequest,
} from "../../store/reducers/candidateSlice";
import type { CandidateInterface } from "../../shared/interface/CandidateInterface";
import AtsLoader from "../../shared/components/ats-loader/AtsLoader";
import { useTranslation } from "react-i18next";
import AtsPaginator from "../../shared/components/ats-pagination/Pagination";
import { formatDate, getStatusClasses } from "../../services/common";
import MainPageHeader from "../../shared/components/main-page-header/MainPageHeader";
import CandidateFilterDrawer, {
  type FilterValues,
} from "./candidates-overview/components/CandidateFilterDrawer";


const Candidates = () => {
  const isFirstRender = useRef(true);
  const isFilterDataLoaded = useRef(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(15);
  const [searchTerm, setSearchTerm] = useState("");
  const [allPostingTitle, setAllPostingTitle] = useState<any[]>([]);
  const [allSource, setAllSource] = useState<any[]>([]);
  const [allCreatedBy, setAllCreatedBy] = useState<any[]>([]);
  const [allStatus, setAllStatus] = useState<any[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [allCandidatesForFilter, setAllCandidatesForFilter] = useState<any[]>(
    []
  );
  const [activeFilters, setActiveFilters] = useState<FilterValues | null>(null);

  const { candidates, loading, totalCount } = useSelector(
    (state: RootState) => state.candidates
  );

  const fetchPaginatedCandidates = (firstIndex: number, rowCount: number) => {
    const pageNumber = Math.floor(firstIndex / rowCount) + 1;
    if (searchTerm) {
      dispatch(
        searchCandidateRequest({ pageNumber, pageSize: rowCount, searchTerm })
      );
    } else {
      dispatch(fetchCandidateRequest({ pageNumber, pageSize: rowCount }));
    }
  };

  const handleFilterOpen = () => {
    setIsFilterOpen(true);
    if (
      !isFilterDataLoaded.current &&
      totalCount &&
      totalCount > rows
    ) {
      dispatch(fetchCandidateRequest({ pageNumber: 1, pageSize: totalCount }));
      isFilterDataLoaded.current = true;
    }
  };

  useEffect(() => {
    if (candidates && Array.isArray(candidates) && !searchTerm) {
      if (candidates.length >= (totalCount || 0)) {
        setAllCandidatesForFilter(candidates);
      } else if (allCandidatesForFilter.length === 0) {
        setAllCandidatesForFilter(candidates);
      }
    }
  }, [candidates, totalCount, allCandidatesForFilter.length]);

  const isAnyFilterActive = useMemo(() => {
    if (!activeFilters) return false;
    return (
      activeFilters.postingTitle.length > 0 ||
      activeFilters.sources.length > 0 ||
      activeFilters.createdBy.length > 0 ||
      activeFilters.status.length > 0
    );
  }, [activeFilters]);

  const displayData = useMemo(() => {
    let sourceData = [];
    if (!isAnyFilterActive) {
      sourceData = candidates ?? [];
      if (!searchTerm) return sourceData;
    } else {
      sourceData = allCandidatesForFilter;
    }

    const filtered = sourceData.filter((candidate: any) => {
      const searchTermLower = searchTerm.toLowerCase();
      const searchMatch =
        !searchTerm ||
        (candidate.firstName &&
          candidate.firstName.toLowerCase().includes(searchTermLower)) ||
        (candidate.lastName &&
          candidate.lastName.toLowerCase().includes(searchTermLower)) ||
        (candidate.jobOpportunity &&
          candidate.jobOpportunity.label &&
          candidate.jobOpportunity.label.toLowerCase().includes(searchTermLower)) ||
        (candidate.createdBy &&
          candidate.createdBy.toLowerCase().includes(searchTermLower)) ||
        (candidate.candidateStatusDetails &&
          candidate.candidateStatusDetails.label &&
          candidate.candidateStatusDetails.label
            .toLowerCase()
            .includes(searchTermLower));

      const postingTitleMatch =
        !isAnyFilterActive ||
        activeFilters!.postingTitle.length === 0 ||
        (candidate.jobOpportunity &&
          candidate.jobOpportunity.value &&
          activeFilters!.postingTitle.includes(candidate.jobOpportunity.value));
      const sourceMatch =
        !isAnyFilterActive ||
        activeFilters!.sources.length === 0 ||
        (candidate.sourceDetails &&
          candidate.sourceDetails.value &&
          activeFilters!.sources.includes(candidate.sourceDetails.value));
      const createdByMatch =
        !isAnyFilterActive ||
        activeFilters!.createdBy.length === 0 ||
        (candidate.createdBy &&
          activeFilters!.createdBy.includes(candidate.createdBy));
      const statusMatch =
        !isAnyFilterActive ||
        activeFilters!.status.length === 0 ||
        (candidate.candidateStatusDetails &&
          candidate.candidateStatusDetails.value &&
          activeFilters!.status.includes(
            candidate.candidateStatusDetails.value
          ));

      return (
        searchMatch &&
        postingTitleMatch &&
        sourceMatch &&
        createdByMatch &&
        statusMatch
      );
    });
    return isAnyFilterActive || searchTerm
      ? filtered.slice(first, first + rows)
      : filtered;
  }, [
    candidates,
    allCandidatesForFilter,
    activeFilters,
    isAnyFilterActive,
    first,
    rows,
    searchTerm,
  ]);

  const filteredCandidate = displayData;

  useEffect(() => {
    if (!activeFilters) {
      fetchPaginatedCandidates(first, rows);
    }
    if (
      activeFilters &&
      totalCount &&
      totalCount > rows &&
      !isFilterDataLoaded.current
    ) {
      dispatch(fetchCandidateRequest({ pageNumber: 1, pageSize: totalCount }));
      isFilterDataLoaded.current = true;
    }
  }, [first, rows, activeFilters, dispatch]);

  useEffect(() => {
    if (allCandidatesForFilter && allCandidatesForFilter.length > 0) {
      setAllPostingTitle((prev) => {
        const currentPostingTitles = allCandidatesForFilter
          .map((c: any) => c.jobOpportunity)
          .filter(Boolean);
        const combined = [...prev, ...currentPostingTitles];
        return Array.from(
          new Map(combined.map((item) => [item?.value, item])).values()
        );
      });
      setAllSource((prev) => {
        const currentSources = allCandidatesForFilter
          .map((c: any) => c.sourceDetails)
          .filter(Boolean);
        const combined = [...prev, ...currentSources];
        return Array.from(
          new Map(combined.map((item) => [item?.value, item])).values()
        );
      });
      setAllCreatedBy((prev) => {
        const currentCreatedBy = allCandidatesForFilter
          .map((c: any) => c.createdBy)
          .filter(Boolean)
          .map((name: string) => ({ value: name, label: name }));
        const combined = [...prev, ...currentCreatedBy];
        return Array.from(
          new Map(combined.map((item) => [item?.value, item])).values()
        );
      });
      setAllStatus((prev) => {
        const currentStatuses = allCandidatesForFilter
          .map((c: any) => c.candidateStatusDetails)
          .filter(Boolean);
        const combined = [...prev, ...currentStatuses];
        return Array.from(
          new Map(combined.map((item) => [item?.value, item])).values()
        );
      });
    }
  }, [allCandidatesForFilter]);

  useEffect(() => {
    if (activeFilters) setFirst(0);
  }, [activeFilters]);

  const uniquePostingTitle = useMemo(
    () => allPostingTitle.map((d: any) => ({ id: d.value, label: d.label })),
    [allPostingTitle]
  );

  const uniqueSource = useMemo(
    () => allSource.map((r: any) => ({ id: r.value, label: r.label })),
    [allSource]
  );

  const uniqueCreatedBy = useMemo(
    () => allCreatedBy.map((r: any) => ({ id: r.value, label: r.label })),
    [allCreatedBy]
  );

  const uniqueStatus = useMemo(
    () => allStatus.map((r: any) => ({ id: r.value, label: r.label })),
    [allStatus]
  );

  const handleSearch = () => {
    dispatch(
      searchCandidateRequest({ pageNumber: 1, pageSize: rows, searchTerm })
    );
  };
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const delayDebounce = setTimeout(() => {
      setFirst(0);
      handleSearch();
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  const onPageChange = (e: any) => {
    setFirst(e.first);
    setRows(e.rows);
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
          title={t("common.candidates")}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onCreate={() => handlePageChange("create-candidate")}
          onFilterOpen={handleFilterOpen}
        />
        <CandidateFilterDrawer
          open={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
          onApply={(filters) => {
            setActiveFilters(filters);
            setFirst(0);
          }}
          onReset={() => {
            if (isAnyFilterActive) {
              setActiveFilters(null);
              setFirst(0);
            }
            setIsFilterOpen(false);
          }}
          postingTitle={uniquePostingTitle}
          sources={uniqueSource}
          createdBy={uniqueCreatedBy}
          status={uniqueStatus}
        />
        {/* Table Header */}
        <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr] gap-4 items-center bg-[#F6F6F6] px-8 py-4 rounded-t-[24px] relative z-20 -mt-[60px] min-w-0">
          <span className="font-medium truncate min-w-0 max-w-full">
            {t("candidates.candidateName")}
          </span>
          <span className="font-medium truncate min-w-0 max-w-full">
            {t("common.postingTitle")}
          </span>
          <span className="font-medium truncate min-w-0 max-w-full">
            {t("candidates.source")}
          </span>
          <span className="font-medium truncate min-w-0 max-w-full">
            {t("common.createdBy")}
          </span>
          <span className="font-medium truncate min-w-0 max-w-full">
            {t("candidates.createdDate")}
          </span>
          <span className="font-medium truncate min-w-0 max-w-full">
            {t("candidates.candidateStatus")}
          </span>
        </div>

        {/* Candidate List */}
        <div
          style={{ height: "calc(100vh - 208px)", overflowY: "auto" }}
          className="border border-[#EFEFEF] rounded-b-[10px] bg-[#F6F6F6] relative z-10"
        >
          <div className="grid grid-cols-1 gap-2 p-5">
            {filteredCandidate.length > 0
              ? filteredCandidate.map((candidate: CandidateInterface) => (
                <button
                  type="button"
                  key={candidate.candidateId}
                  onClick={() =>
                    handlePageChange(
                      "candidate-overview/" + candidate.candidateId
                    )
                  }
                  className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr] items-center bg-white rounded-l-[10px] transition duration-200 ease-in-out shadow-md hover:bg-gray-100 focus:outline-none cursor-pointer min-h-16"
                >
                  <div className="flex items-center gap-5 border-r border-[#EFEFEF] px-4 py-3 min-w-0">
                    <span className="font-semibold text-gray-800 truncate min-w-0 max-w-full">
                      {candidate.firstName ?? t("common.none")}{" "}
                      {candidate.lastName ?? ""}
                    </span>
                  </div>
                  <div className="flex items-center gap-5 border-r border-[#EFEFEF] px-4 py-3 min-w-0">
                    <span className="truncate min-w-0 max-w-full">
                      {candidate?.jobOpportunity?.label ?? t("common.none")}
                    </span>
                  </div>
                  <div className="flex items-center gap-5 border-r border-[#EFEFEF] px-4 py-3 min-w-0">
                    <span className="truncate min-w-0 max-w-full">
                      {candidate?.sourceDetails?.label ?? t("common.none")}
                    </span>
                  </div>
                  <div className="flex items-center gap-5 border-r border-[#EFEFEF] px-4 py-3 min-w-0">
                    <span className="truncate min-w-0 max-w-full">
                      {candidate?.createdBy ?? t("common.none")}
                    </span>
                  </div>
                  <div className="flex items-center gap-5 border-r border-[#EFEFEF] px-4 py-3 min-w-0">
                    <span className="truncate min-w-0 max-w-full">
                      {formatDate(candidate?.updatedDate, t) ??
                        t("common.none")}
                    </span>
                  </div>
                  <div className="flex items-center gap-5 px-4 py-3 min-w-0">
                    <span
                      className={`text-sm font-medium px-3 py-1 rounded-full truncate min-w-0 max-w-full ${getStatusClasses(
                        candidate.candidateStatusDetails?.value ?? 0
                      )}`}
                    >
                      {candidate?.candidateStatusDetails?.label ??
                        t("common.none")}
                    </span>
                  </div>
                </button>
              ))
              : !loading && (
                <EmptyState />
              )}
          </div>
        </div>
        <AtsPaginator
          first={first}
          rows={rows}
          totalCount={
            isAnyFilterActive || searchTerm
              ? allCandidatesForFilter.filter((candidate: any) => {
                const searchTermLower = searchTerm.toLowerCase();
                const searchMatch =
                  !searchTerm ||
                  (candidate.firstName &&
                    candidate.firstName
                      .toLowerCase()
                      .includes(searchTermLower)) ||
                  (candidate.lastName &&
                    candidate.lastName
                      .toLowerCase()
                      .includes(searchTermLower)) ||
                  (candidate.jobOpportunity &&
                    candidate.jobOpportunity.label &&
                    candidate.jobOpportunity.label
                      .toLowerCase()
                      .includes(searchTermLower)) ||
                  (candidate.createdBy &&
                    candidate.createdBy
                      .toLowerCase()
                      .includes(searchTermLower)) ||
                  (candidate.candidateStatusDetails &&
                    candidate.candidateStatusDetails.label &&
                    candidate.candidateStatusDetails.label
                      .toLowerCase()
                      .includes(searchTermLower));

                const postingTitleMatch =
                  !isAnyFilterActive ||
                  activeFilters!.postingTitle.length === 0 ||
                  (candidate.jobOpportunity &&
                    candidate.jobOpportunity.value &&
                    activeFilters!.postingTitle.includes(
                      candidate.jobOpportunity.value
                    ));
                const sourceMatch =
                  !isAnyFilterActive ||
                  activeFilters!.sources.length === 0 ||
                  (candidate.sourceDetails &&
                    candidate.sourceDetails.value &&
                    activeFilters!.sources.includes(
                      candidate.sourceDetails.value
                    ));
                const createdByMatch =
                  !isAnyFilterActive ||
                  activeFilters!.createdBy.length === 0 ||
                  (candidate.createdBy &&
                    activeFilters!.createdBy.includes(candidate.createdBy));
                const statusMatch =
                  !isAnyFilterActive ||
                  activeFilters!.status.length === 0 ||
                  (candidate.candidateStatusDetails &&
                    candidate.candidateStatusDetails.value &&
                    activeFilters!.status.includes(
                      candidate.candidateStatusDetails.value
                    ));

                return (
                  searchMatch &&
                  postingTitleMatch &&
                  sourceMatch &&
                  createdByMatch &&
                  statusMatch
                );
              }).length
              : totalCount ?? 0
          }
          onPageChange={onPageChange}
          hasDocuments={filteredCandidate.length > 0}
        />
      </div>
    </div>
  );
};

export default Candidates;
