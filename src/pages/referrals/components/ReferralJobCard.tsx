import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import type { JobInterface } from "../../../shared/interface/JobInterface";
import { getStatusClasses } from "../../../services/common";

const JobCard = ({ job }: { job: JobInterface }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handlePageChange = (page: string) => {
    navigate(page);
  };

  return (
    <button
      type="button"
      className="bg-white rounded-xl shadow-md p-5 flex flex-col gap-4 w-full text-left transition duration-200 ease-in-out hover:bg-gray-100 focus:outline-none cursor-pointer"
      onClick={() =>
        handlePageChange(`job-opening-overview/${job.jobOpportunityId}`)
      }
    >
      {/* Title and openings */}
      <div className="min-w-0">
        <h3 className="text-lg font-semibold text-gray-900 truncate min-w-0 max-w-full">
          {job.postingTitle}
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Number of Openings: {job.numberOfPeople ?? 0}
        </p>
      </div>

      <hr className="border-gray-200" />

      {/* Status and arrow */}
      <div className="flex justify-between items-center min-w-0">
        <span
          className={`text-sm font-medium px-3 py-1 rounded-full truncate min-w-0 max-w-full ${getStatusClasses(
            job.status?.value ?? 0
          )}`}
        >
          {job.status?.label ?? t("common.none")}
        </span>
        <ArrowRight className="w-4 h-4 text-gray-400" />
      </div>
    </button>
  );
};

export default JobCard;
