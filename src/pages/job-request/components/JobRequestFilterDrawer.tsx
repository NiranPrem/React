import React, { useState, useEffect, useRef } from "react";
import { Accordion, AccordionTab } from "primereact/accordion";
import FilterCheckboxAccordion from "../../../shared/components/ats-filter-checkbox-accordion/FilterCheckboxAccordion";

export interface FilterValues {
  requestOwner: (number | string)[];
  jobTitle: (number | string)[];
  numberOfPositions: (number | string)[];
  assignedRecruiter: (number | string)[];
  jobRequestStatus: (number | string)[];
}

interface JobRequestFilterDrawerProps {
  open: boolean;
  onClose: () => void;
  onApply?: (filters: FilterValues) => void;
  onReset?: () => void;
  title?: string;
  initialValues?: FilterValues | null;
  requestOwners: { id: number | string; label: string }[];
  jobTitles: { id: number | string; label: string }[];
  numberOfPositions: { id: number | string; label: string }[];
  assignedRecruiters: { id: number | string; label: string }[];
  jobRequestStatuses: { id: number | string; label: string }[];
}

const JobRequestFilterDrawer = ({
  open,
  onClose,
  onApply,
  onReset,
  title = "Filters",
  initialValues,
  requestOwners,
  jobTitles,
  numberOfPositions,
  assignedRecruiters,
  jobRequestStatuses,
}: JobRequestFilterDrawerProps) => {
  const [selectedFilters, setSelectedFilters] = useState<FilterValues>({
    requestOwner: [],
    jobTitle: [],
    numberOfPositions: [],
    assignedRecruiter: [],
    jobRequestStatus: [],
  });

  const prevOpen = useRef(open);

  useEffect(() => {
    if (open && !prevOpen.current) {
      setSelectedFilters({
        requestOwner: initialValues?.requestOwner || [],
        jobTitle: initialValues?.jobTitle || [],
        numberOfPositions: initialValues?.numberOfPositions || [],
        assignedRecruiter: initialValues?.assignedRecruiter || [],
        jobRequestStatus: initialValues?.jobRequestStatus || [],
      });
    }
    prevOpen.current = open;
  }, [open, initialValues]);

  const sections: {
    key: keyof FilterValues;
    title: string;
    options: { id: number | string; label: string }[];
  }[] = [
    { key: "requestOwner", title: "Request Owner", options: requestOwners },
    { key: "jobTitle", title: "Job Title", options: jobTitles },
    { key: "numberOfPositions", title: "Number of Positions", options: numberOfPositions },
    { key: "assignedRecruiter", title: "Assigned Recruiter", options: assignedRecruiters },
    { key: "jobRequestStatus", title: "Job Request Status", options: jobRequestStatuses },
  ];

  if (!open) return null;

  const handleReset = () => {
    setSelectedFilters({
      requestOwner: [],
      jobTitle: [],
      numberOfPositions: [],
      assignedRecruiter: [],
      jobRequestStatus: [],
    });
    onReset?.();
  };

  const handleApply = () => {
    onApply?.(selectedFilters);
    onClose();
  };

  const handleFilterChange = (
    key: keyof FilterValues,
    value: (number | string)[]
  ) => {
    setSelectedFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="fixed inset-0 bg-black/20" onClick={onClose} />
      <div className="ml-auto h-full w-[360px] bg-[#f8f8f8] shadow-xl flex flex-col relative z-10">
        <div className="flex items-center justify-between px-4 py-3 bg-[#efefef]">
          <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 font-bold"
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
            {sections.map((section) => (
              <AccordionTab key={section.key} header={section.title}>
                <FilterCheckboxAccordion
                  options={section.options}
                  value={selectedFilters[section.key]}
                  onChange={(val) => handleFilterChange(section.key, val)}
                />
              </AccordionTab>
            ))}
          </Accordion>
        </div>

        <div className="px-4 py-3 flex justify-center gap-6 bg-white border-t border-gray-100">
          <button
            onClick={handleReset}
            className="px-6 py-2 rounded-md border border-gray-200 text-gray-700 hover:bg-gray-50"
          >
            Reset
          </button>
          <button
            onClick={handleApply}
            className="px-6 py-2 rounded-md bg-[#4278F9] text-white hover:bg-[#1051e9]"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobRequestFilterDrawer;
