import React, { useState, useEffect, useRef } from "react";
import { Accordion, AccordionTab } from "primereact/accordion";
import FilterCheckboxAccordion from "../../shared/components/ats-filter-checkbox-accordion/FilterCheckboxAccordion";

export interface InterviewFilterValues {
  candidate: (number | string)[];
  interviewStatuses: (number | string)[];
  feedbackStatuses: (number | string)[];
  reviewedBy: (number | string)[];
  fromDate: string | null; // Added
  toDate: string | null; // Added
}

interface InterviewFilterDrawerProps {
  open: boolean;
  onClose: () => void;
  onApply?: (filters: InterviewFilterValues) => void;
  onReset?: () => void;
  title?: string;
  initialValues?: InterviewFilterValues | null;
  candidates: { id: number | string; label: string }[];
  interviewStatuses: { id: number | string; label: string }[];
  feedbackStatuses: { id: number | string; label: string }[];
  reviewedBy: { id: number | string; label: string }[];
}

const InterviewFilterDrawer = ({
  open,
  onClose,
  onApply,
  onReset,
  title = "Filters",
  initialValues,
  candidates,
  interviewStatuses,
  feedbackStatuses,
  reviewedBy,
}: InterviewFilterDrawerProps) => {
  const [selectedFilters, setSelectedFilters] = useState<InterviewFilterValues>(
    {
      candidate: [],
      interviewStatuses: [],
      feedbackStatuses: [], // Added
      reviewedBy: [], // Added
      fromDate: null,
      toDate: null,
    },
  );

  const prevOpen = useRef(open);

  useEffect(() => {
    if (open && !prevOpen.current) {
      setSelectedFilters({
        candidate: initialValues?.candidate || [],
        interviewStatuses: initialValues?.interviewStatuses || [],
        feedbackStatuses: initialValues?.feedbackStatuses || [],
        reviewedBy: initialValues?.reviewedBy || [],
        fromDate: initialValues?.fromDate || null,
        toDate: initialValues?.toDate || null,
      });
    }
    prevOpen.current = open;
  }, [open, initialValues]);

  // RESET BUTTON LOGIC: Disable if no checkboxes are ticked
  const isResetDisabled =
    selectedFilters.candidate.length === 0 &&
    selectedFilters.interviewStatuses.length === 0 &&
    selectedFilters.feedbackStatuses.length === 0 &&
    selectedFilters.reviewedBy.length === 0 &&
    !selectedFilters.fromDate &&
    !selectedFilters.toDate;

  const sections: {
    key: keyof InterviewFilterValues;
    title: string;
    options: { id: number | string; label: string }[];
  }[] = [
    { key: "candidate", title: "Candidate", options: candidates },
    {
      key: "interviewStatuses",
      title: "Interview Status",
      options: interviewStatuses,
    },
    { key: "feedbackStatuses", title: "Feedback", options: feedbackStatuses }, // Added
    { key: "reviewedBy", title: "Reviewed By", options: reviewedBy }, // Added
  ];

  if (!open) return null;

  const handleReset = () => {
    setSelectedFilters({
      candidate: [],
      interviewStatuses: [],
      feedbackStatuses: [],
      reviewedBy: [],
      fromDate: null,
      toDate: null,
    });
    onReset?.();
  };

  const handleApply = () => {
    onApply?.(selectedFilters);
    onClose();
  };

  const handleFilterChange = (
    key: keyof InterviewFilterValues,
    value: (number | string)[],
  ) => {
    setSelectedFilters((prev) => ({ ...prev, [key]: [...value] }));
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="fixed inset-0 bg-black/20" onClick={onClose} />
      <div className="ml-auto h-full w-[360px] bg-[#f8f8f8] shadow-xl flex flex-col relative z-10">
        <div className="flex items-center justify-between px-4 py-3 bg-[#efefef]">
          <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 font-bold p-2"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <Accordion
            multiple
            expandIcon="pi pi-chevron-down"
            collapseIcon="pi pi-chevron-up"
          >
            {/* New Date Range Accordion Tab */}
            <AccordionTab header="Date Range">
              <div className="flex flex-col gap-4 py-2">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-gray-500 uppercase">
                    From
                  </label>
                  <input
                    type="datetime-local"
                    className="w-full p-2 border border-gray-200 rounded focus:outline-none focus:border-blue-500"
                    value={selectedFilters.fromDate || ""}
                    onChange={(e) =>
                      setSelectedFilters((prev) => ({
                        ...prev,
                        fromDate: e.target.value || null,
                      }))
                    }
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-gray-500 uppercase">
                    To
                  </label>
                  <input
                    type="datetime-local"
                    className="w-full p-2 border border-gray-200 rounded focus:outline-none focus:border-blue-500"
                    value={selectedFilters.toDate || ""}
                    onChange={(e) =>
                      setSelectedFilters((prev) => ({
                        ...prev,
                        toDate: e.target.value || null,
                      }))
                    }
                  />
                </div>
              </div>
            </AccordionTab>
            {sections.map((section) => (
              <AccordionTab key={section.key} header={section.title}>
                <FilterCheckboxAccordion
                  options={section.options}
                  value={selectedFilters[section.key] as (number | string)[]}
                  onChange={(val) => handleFilterChange(section.key, val)}
                />
              </AccordionTab>
            ))}
          </Accordion>
        </div>

        <div className="px-4 py-3 flex justify-center gap-6 bg-white border-t border-gray-100">
          <button
            type="button"
            onClick={handleReset}
            disabled={isResetDisabled}
            className={`px-6 py-2 rounded-md border border-gray-200 text-gray-700 transition-colors 
              ${
                isResetDisabled
                  ? "opacity-40 cursor-not-allowed bg-gray-50"
                  : "hover:bg-gray-50 cursor-pointer"
              }`}
          >
            Reset
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="px-6 py-2 rounded-md bg-[#4278F9] text-white hover:bg-[#1051e9] cursor-pointer"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

export default InterviewFilterDrawer;
