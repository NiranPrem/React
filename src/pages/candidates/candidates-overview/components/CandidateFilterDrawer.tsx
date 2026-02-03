import React, { useState } from "react";
import FilterCheckboxAccordion from "../../../../shared/components/ats-filter-checkbox-accordion/FilterCheckboxAccordion";
import { Accordion, AccordionTab } from "primereact/accordion";

export interface FilterValues {
	postingTitle: (number | string)[];
	sources: (number | string)[];
	createdBy: (number | string)[];
	status: (number | string)[];
}
interface CandidateFilterDrawerProps {
	open: boolean;
	onClose: () => void;
	onApply?: (filters: FilterValues) => void;
	onReset?: () => void;
	title?: string;
	postingTitle: { id: number | string; label: string }[];
	sources: { id: number | string; label: string }[];
	createdBy: { id: number | string; label: string }[];
	status: { id: number | string; label: string }[];
}

const CandidateFilterDrawer = ({
	open,
	onClose,
	onApply,
	onReset,
	title = "Filters",
	postingTitle,
	sources,
	createdBy,
	status,
}: CandidateFilterDrawerProps) => {
	const [selectedFilters, setSelectedFilters] = useState<FilterValues>({
		postingTitle: [],
		sources: [],
		createdBy: [],
		status: [],
	});

	const sections: {
		key: keyof FilterValues;
		title: string;
		options: { id: number | string; label: string }[];
	}[] = [
		{ key: "postingTitle", title: "Posting title", options: postingTitle },
		{ key: "sources", title: "Source", options: sources },
		{
			key: "createdBy",
			title: "Created By",
			options: createdBy,
		},
		{ key: "status", title: "Candidate Status", options: status },
	];

	if (!open) return null;

	const handleReset = () => {
		setSelectedFilters({
			postingTitle: [],
			sources: [],
			createdBy: [],
			status: [],
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
				<div className="flex-1 overflow-y-auto p-4 space-y-4">
					<Accordion
						expandIcon="pi pi-chevron-down"
						collapseIcon="pi pi-chevron-up">
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

export default CandidateFilterDrawer;
