import { ArrowRight, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import ImageWithFallback from "../../../../../shared/components/ats-image-loader/ImageLoader";
import CalenderLogo from "../../../../../assets/icons/calendar.svg";
import type { ReferralHistoryInterface } from "../../../../../shared/interface/HistoryInterface";

const TimelineCard = (data: ReferralHistoryInterface) => {
	const [isExpanded, setIsExpanded] = useState(false);

	const formattedDate = new Date(data?.timestamp ?? new Date()).toLocaleString(
		"en-IN",
		{
			day: "2-digit",
			month: "2-digit",
			year: "numeric",
			hour: "2-digit",
			minute: "2-digit",
			hour12: true,
		}
	);

	return (
		<div className="rounded-lg border border-[#F6F6F6] bg-white p-4 mb-8">
			{/* Top Row: Status and Timestamp */}
			<div className="flex justify-between items-start">
				<div>
					<p className="font-medium mb-2">{data.shortDescription}</p>
					<h3 className="text-base font-semibold flex items-center gap-2 text-black">
						{data.actionType}
					</h3>
				</div>

				<div className="flex items-center gap-2 text-gray-500">
					<img src={CalenderLogo} alt="calendar" className="w-5 h-5" />
					<span>{formattedDate}</span>
				</div>
			</div>

			{/* Note Section */}
			<div
				className={`transition-all duration-400 overflow-hidden ${isExpanded ? "max-h-full opacity-100 mt-4" : "max-h-0 opacity-0"
					} bg-gray-100 rounded-md text-gray-800 space-y-1`}>
				<div className="p-4">
					{data.changesJson && (
						<ul className="list-disc list-inside space-y-1">
							{JSON.parse(data.changesJson).map(
								(
									change: {
										Field: string;
										OldValue: string;
										NewValue: string;
									},
									index: number
								) => {
									const isEmpty = (val: unknown) =>
										val === null ||
										val === undefined ||
										(typeof val === "string" && val.trim() === "") ||
										(Array.isArray(val) && val.length === 0);

									const stripHtml = (html: string) => {
										if (!html) return "";
										const temp = document.createElement("div");
										temp.innerHTML = html;
										return temp.textContent || temp.innerText || "";
									};

									const formatValue = (val: unknown, fieldName: string) => {
										const strVal = val?.toString() ?? "";
										if (fieldName === "Notes" || fieldName === "notes") {
											return stripHtml(strVal);
										}
										return strVal;
									};

									if (isEmpty(change.OldValue) && isEmpty(change.NewValue)) {
										return null;
									}

									return (
										<li
											key={`${change.Field}-${change.OldValue}-${change.NewValue}-${index}`}
											className="flex items-center gap-2">
											<span>
												- {change.Field}:{" "}
												{change.OldValue && !isEmpty(change.OldValue) ? formatValue(change.OldValue, change.Field) : "None"}{" "}
												{" To "}{" "}
												{change.NewValue && !isEmpty(change.NewValue) ? formatValue(change.NewValue, change.Field) : "None"}
											</span>
										</li>
									);
								}
							)}
						</ul>
					)}
				</div>
			</div>

			{/* Footer: Avatar and Name + Toggle */}
			<div className="flex justify-between items-center mt-3.5">
				<div className="flex items-center gap-2">
					<ImageWithFallback
						src={""}
						alt="User"
						className="w-10 h-10 rounded-full border border-gray-300"
						width={30}
						height={30}
						preview={false}
					/>
					<span className="font-medium">{data?.performedByUserName}</span>
				</div>
				<button
					type="button"
					className="text-gray-400 hover:text-gray-600 rounded-lg hover:bg-[#F6F6F6] p-2 cursor-pointer"
					onClick={() => setIsExpanded((prev) => !prev)}>
					{isExpanded ? (
						<ChevronUp className="w-5 h-5 text-[#333333]" />
					) : (
						<ChevronDown className="w-5 h-5 text-[#333333]" />
					)}
				</button>
			</div>
		</div>
	);
};

export default TimelineCard;
