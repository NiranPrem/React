import React, { useState } from "react";
import FilterCheckboxAccordion from "../../../../shared/components/ats-filter-checkbox-accordion/FilterCheckboxAccordion";
import { Accordion, AccordionTab } from "primereact/accordion";

export interface FilterValues {
	postingTitle: (string | number)[];
	createdBy: (string | number)[];
	statuses: (string | number)[];
	numberOfPositions: (string | number)[];
	numberOfApplications: (string | number)[];
}

interface JobOpeningFilterDrawerProps {
	open: boolean;
	onClose: () => void;
	onApply?: (filters: FilterValues) => void;
	onReset?: () => void;
	title?: string;
	postingTitle: { id: string | number; label: string }[];
	createdBy: { id: string | number; label: string }[];
	statuses: { id: number; label: string }[];
	numberOfPositions: { id: number; label: string }[];
	numberOfApplications: { id: number; label: string }[];
}

const JobOpeningFilterDrawer = ({
	open,
	onClose,
	onApply,
	onReset,
	title = "Filters",
	postingTitle,
	createdBy,
	statuses,
	numberOfPositions,
	numberOfApplications,
}: JobOpeningFilterDrawerProps) => {
	const [selectedFilters, setSelectedFilters] = useState<FilterValues>({
		postingTitle: [],
		createdBy: [],
		statuses: [],
		numberOfPositions: [],
		numberOfApplications: [],
	});

	if (!open) return null;

	const handleReset = () => {
		setSelectedFilters({
			postingTitle: [],
			createdBy: [],
			statuses: [],
			numberOfPositions: [],
			numberOfApplications: [],
		});
		onReset?.();
	};

	const handleApply = () => {
		onApply?.(selectedFilters);
		onClose();
	};

	const handleFilterChange = (key: keyof FilterValues, value: any) => {
		setSelectedFilters((prev) => ({ ...prev, [key]: value }));
	};

	return (
		<div className="fixed inset-0 z-50 flex">
			<div className="fixed inset-0 bg-black/20" onClick={onClose} />
			<div className="ml-auto h-full w-[360px] bg-[#f8f8f8] shadow-xl flex flex-col relative z-10">
				{/* Header */}
				<div className="flex items-center justify-between px-4 py-3 bg-[#efefef]">
					<h2 className="text-lg font-semibold text-gray-800">{title}</h2>
					<button
						onClick={onClose}
						className="text-gray-500 hover:text-gray-800">
						✕
					</button>
				</div>

				{/* Body */}
				<div className="flex-1 overflow-y-auto p-4 space-y-6">
					<Accordion
						expandIcon="pi pi-chevron-down"
						collapseIcon="pi pi-chevron-up">
						<AccordionTab header="Posting title">
							<FilterCheckboxAccordion
								options={postingTitle as any}
								value={selectedFilters.postingTitle as any}
								onChange={(val) => handleFilterChange("postingTitle", val)}
							/>
						</AccordionTab>
						<AccordionTab header="Number of position">
							<FilterCheckboxAccordion
								options={numberOfPositions}
								value={selectedFilters.numberOfPositions}
								onChange={(val) => handleFilterChange("numberOfPositions", val)}
							/>
						</AccordionTab>
						<AccordionTab header="Number of application">
							<FilterCheckboxAccordion
								options={numberOfApplications}
								value={selectedFilters.numberOfApplications}
								onChange={(val) =>
									handleFilterChange("numberOfApplications", val)
								}
							/>
						</AccordionTab>
						<AccordionTab header="Created By">
							<FilterCheckboxAccordion
								options={createdBy}
								value={selectedFilters.createdBy}
								onChange={(val) => handleFilterChange("createdBy", val)}
							/>
						</AccordionTab>
						<AccordionTab header="Job Opening Status">
							<FilterCheckboxAccordion
								options={statuses}
								value={selectedFilters.statuses}
								onChange={(val) => handleFilterChange("statuses", val)}
							/>
						</AccordionTab>
					</Accordion>
				</div>

				{/* Footer */}
				<div className="px-4 py-3 flex justify-center gap-6 bg-white rounded-[2px] -mt-2">
					<button
						onClick={handleReset}
						className="px-3 py-2 rounded-md border border-gray-200 text-gray-700 hover:bg-gray-50">
						Reset
					</button>

					<button
						onClick={handleApply}
						className="px-3 py-2 rounded-md border border-gray-200 bg-[#4278F9] text-white hover:bg-[#1051e9]">
						Apply
					</button>
				</div>
			</div>
		</div>
	);
};

export default JobOpeningFilterDrawer;
