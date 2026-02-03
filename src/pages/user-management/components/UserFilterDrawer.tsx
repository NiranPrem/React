import React, { useState, useEffect, useRef } from "react";
import { Accordion, AccordionTab } from "primereact/accordion";
import FilterCheckboxAccordion from "../../../shared/components/ats-filter-checkbox-accordion/FilterCheckboxAccordion";

export interface FilterValues {
  department: (number | string)[];
  roles: (number | string)[];
  statuses: (number | string)[];
}

interface UserFilterDrawerProps {
  open: boolean;
  onClose: () => void;
  onApply?: (filters: FilterValues) => void;
  onReset?: () => void;
  title?: string;
  initialValues?: FilterValues | null;
  departments: { id: number | string; label: string }[];
  roles: { id: number | string; label: string }[];
  statuses: { id: number | string; label: string }[];
}

const UserFilterDrawer = ({
  open,
  onClose,
  onApply,
  onReset,
  title = "Filters",
  initialValues,
  departments,
  roles,
  statuses,
}: UserFilterDrawerProps) => {
  const [selectedFilters, setSelectedFilters] = useState<FilterValues>({
    department: [],
    roles: [],
    statuses: [],
  });

  const prevOpen = useRef(open);

  useEffect(() => {
    if (open && !prevOpen.current) {
      setSelectedFilters({
        department: initialValues?.department || [],
        roles: initialValues?.roles || [],
        statuses: initialValues?.statuses || [],
      });
    }
    prevOpen.current = open;
  }, [open, initialValues]);

  // RESET BUTTON LOGIC: Disable if no checkboxes are ticked
  const isResetDisabled =
    selectedFilters.department.length === 0 &&
    selectedFilters.roles.length === 0 &&
    selectedFilters.statuses.length === 0;

  const sections: {
    key: keyof FilterValues;
    title: string;
    options: { id: number | string; label: string }[];
  }[] = [
    { key: "department", title: "Department", options: departments },
    { key: "roles", title: "Roles", options: roles },
    { key: "statuses", title: "Status", options: statuses },
  ];

  if (!open) return null;

  const handleReset = () => {
    setSelectedFilters({ department: [], roles: [], statuses: [] });
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

export default UserFilterDrawer;
