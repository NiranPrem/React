import { Search, Plus, X } from "lucide-react";
import Filter from "../../../assets/icons/filter.svg";
import { useTranslation } from "react-i18next";
import ToggleSegment from "../ats-toggle/Toggle";
import { useState } from "react";

interface MainPageHeaderProps {
	title: string;
	searchTerm: string;
	setSearchTerm: (value: string) => void;
	onCreate: () => void;
	showToggle?: boolean;
	currentTab?: "0" | "1";
	onTabChange?: (value: string) => void;
	onFilterOpen?: () => void;
}

const MainPageHeader = ({
	title,
	searchTerm,
	setSearchTerm,
	onCreate,
	showToggle = false,
	currentTab = "0",
	onTabChange = () => { },
	onFilterOpen,
}: MainPageHeaderProps) => {
	const { t } = useTranslation();
	const [selectedTab, setSelectedTab] = useState<"0" | "1">(currentTab);

	const handleTabChange = (tab: "0" | "1") => {
		setSelectedTab(tab);
		onTabChange(tab);
	};

	return (
		<div className="flex justify-between items-center px-4 pb-[75px] bg-[#2D4D9A] relative z-10">
			<h1 className="text-xl text-white">{title}</h1>
			<div className="flex items-center gap-5">
				{showToggle && (
					<ToggleSegment
						value={selectedTab}
						onChange={handleTabChange}
						labelOne={"My Referrals"}
						labelTwo={"Job openings"}
					/>
				)}
				<div className="relative">
					<input
						type="text"
						placeholder={t("common.search")}
						aria-label="Search"
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="pr-10 pl-4 py-2 rounded-xl border-[#1B326B] font-light h-[40px] border focus:outline-none text-[#FFFFFF] bg-[#2D4D9A] !placeholder-white placeholder:opacity-80"
					/>
					{searchTerm ? (
						<X
							className="absolute right-3 top-2.5 h-5 w-5 text-white cursor-pointer"
							onClick={() => setSearchTerm("")}
						/>
					) : (
						<Search className="absolute right-3 top-2.5 h-5 w-5 text-white opacity-70" />
					)}
				</div>
				<button
					type="button"
					className="p-3 bg-[#1B326B] flex text-white rounded-lg gap-2 items-center hover:bg-blue-900 cursor-pointer h-[40px]"
					onClick={onFilterOpen}>
					<img src={Filter} alt="filter" className="w-4 h-4" />
				</button>
				<button
					type="button"
					className="w-auto px-3 h-[40px] bg-[#4278F9] flex justify-center text-white rounded-lg gap-2 text-[16px] items-center cursor-pointer tracking-normal hover:bg-[#1051e9]"
					onClick={onCreate}>
					<Plus className="h-4 w-4" /> <span className="font-light">{t("common.add")}</span>
				</button>
			</div>
		</div>
	);
};

export default MainPageHeader;
