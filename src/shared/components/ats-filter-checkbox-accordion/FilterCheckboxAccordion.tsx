import { Checkbox } from "primereact/checkbox";
import React, { useState, useEffect } from "react";
import "./FilterCheckboxAccordion.css";

type FilterOption = {
	id: number | string;
	label: string;
};

type FilterCheckboxAccordionProps = {
	options: FilterOption[];
	value: (number | string)[];
	onChange: (checkedValues: (number | string)[]) => void;
};

const ITEMS_PER_PAGE = 10;

const FilterCheckboxAccordion: React.FC<FilterCheckboxAccordionProps> = ({
	options,
	value,
	onChange,
}) => {
	const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

	useEffect(() => {
		setVisibleCount(ITEMS_PER_PAGE);
	}, [options]);

	const handleChange = (id: number | string, checked: boolean) => {
		onChange(checked ? [...value, id] : value.filter((v) => v !== id));
	};

	const handleViewMore = () => {
		setVisibleCount((prev) => prev + ITEMS_PER_PAGE);
	};

	const visibleOptions = options.slice(0, visibleCount);
	const hasMore = visibleCount < options.length;

	return (
		<div className="flex flex-col gap-2">
			{visibleOptions.map((option) => (
				<label
					key={option.id}
					className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer pb-2">
					<Checkbox
						className="filter-checkbox mr-2"
						checked={value.includes(option.id)}
						onChange={(e) => handleChange(option.id, !!e.checked)}
					/>
					<span>{option.label}</span>
				</label>
			))}
			{hasMore && (
				<button
					type="button"
					onClick={handleViewMore}
					className="text-sm text-[#4278F9] hover:text-[#1051e9] font-medium py-2 text-left">
					View More ({options.length - visibleCount} remaining)
				</button>
			)}
		</div>
	);
};

export default FilterCheckboxAccordion;
