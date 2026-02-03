import { ArrowRight, ChevronDown, ChevronUp } from "lucide-react";
import { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import ImageWithFallback from "../../../../../shared/components/ats-image-loader/ImageLoader";
import CalenderLogo from "../../../../../assets/icons/calendar.svg";
import type { JobRequestHistoryInterface } from "../../../../../shared/interface/HistoryInterface";
import type { RootState } from "../../../../../store/store";

const TimelineCard = (data: JobRequestHistoryInterface) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { jobRequestStatus, region } = useSelector(
    (state: RootState) => state.masterData
  );

  const parsedChanges = useMemo(() => {
    if (!data.changesJson) return [];
    const trimmed = data.changesJson.trim();
    if (trimmed === "" || trimmed === "[]" || trimmed === "null") {
      return [];
    }
    try {
      const parsed = JSON.parse(data.changesJson);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : [];
    } catch (e) {
      return [];
    }
  }, [data.changesJson]);

  const hasValidChanges = parsedChanges.length > 0;


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
      {hasValidChanges && (
      <div
        className={`transition-all duration-400 overflow-hidden ${
          isExpanded ? "max-h-full opacity-100 mt-4" : "max-h-0 opacity-0"
        } bg-gray-100 rounded-md text-gray-800 space-y-1`}
      >
        <div className="p-4">
          <ul className="list-disc list-inside space-y-1">
            {parsedChanges.map(
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

                  const stripHtmlTags = (html: string): string => {
                    if (!html || typeof html !== "string") return html;
                    const tmp = document.createElement("DIV");
                    tmp.innerHTML = html;
                    return tmp.textContent || tmp.innerText || "";
                  };

                  const formatValue = (val: unknown, fieldName: string) => {
                    const stringVal = val?.toString() ?? "";
                    
                    if (!stringVal || stringVal.trim() === "") {
                      return "";
                    }

                    const richTextFields = ["requirement", "job description", "description", "benefits", "requirements"];
                    const isRichTextField = richTextFields.some(field => 
                      fieldName.toLowerCase().includes(field)
                    );
                    
                    let processedVal = stringVal;
                    if (isRichTextField && stringVal.includes("<")) {
                      processedVal = stripHtmlTags(stringVal).trim();
                    }

                    if (fieldName.toLowerCase().includes("status")) {
                      const statusId = parseInt(processedVal, 10);
                      if (!isNaN(statusId) && jobRequestStatus && Array.isArray(jobRequestStatus)) {
                        const status = jobRequestStatus.find(
                          (s: any) =>
                            s &&
                            typeof s === "object" &&
                            "value" in s &&
                            (s as any).value === statusId
                        ) as { label?: string; value?: number } | undefined;

                        if (status && status.label) {
                          return status.label;
                        }
                      }

                      if (processedVal.startsWith("Status ")) {
                        const statusFromLabel = parseInt(
                          processedVal.replace("Status ", ""),
                          10
                        );
                        if (!isNaN(statusFromLabel) && jobRequestStatus && Array.isArray(jobRequestStatus)) {
                          const status = jobRequestStatus.find(
                            (s: any) =>
                              s &&
                              typeof s === "object" &&
                              "value" in s &&
                              (s as any).value === statusFromLabel
                          ) as { label?: string; value?: number } | undefined;

                          if (status && status.label) {
                            return status.label;
                          }
                        }
                      }
                    }

                    if (fieldName.toLowerCase().includes("region")) {
                      const regionId = parseInt(processedVal, 10);
                      if (!isNaN(regionId) && region && Array.isArray(region)) {
                        const regionItem = region.find(
                          (r: any) =>
                            r &&
                            typeof r === "object" &&
                            "value" in r &&
                            (r as any).value === regionId
                        ) as { label?: string; value?: number } | undefined;

                        if (regionItem && regionItem.label) {
                          return regionItem.label;
                        }
                      }
                    }

                    return processedVal;
                  };

                  if (isEmpty(change.OldValue) && isEmpty(change.NewValue)) {
                    return null; // Skip this change
                  }

                  const formattedOldValue = change.OldValue ? formatValue(change.OldValue, change.Field) : "";
                  const formattedNewValue = formatValue(change.NewValue, change.Field);

                  if (formattedOldValue === formattedNewValue) {
                    return null;
                  }

                  return (
                    <li
                      key={`${change.Field}-${change.OldValue}-${change.NewValue}-${index}`}
                      className="flex items-center gap-2"
                    >
                      <span>
                        - {change.Field}:{" "}
                        {formattedOldValue ? formattedOldValue : ""}{" "}
                        {formattedOldValue ? "To" : ""}{" "}
                        {formattedNewValue}
                      </span>
                    </li>
                  );
                }
              )}
          </ul>
        </div>
      </div>
      )}

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
          onClick={() => setIsExpanded((prev) => !prev)}
        >
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
