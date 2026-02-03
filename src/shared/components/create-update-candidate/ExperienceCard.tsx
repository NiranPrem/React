import { formatDate } from "../../../services/common";
import BuildingSVG from "../../../assets/icons/building.svg";
import type { ExperienceData } from "../../interface/CandidateInterface";
import { useTranslation } from "react-i18next";

const ExperienceCard = ({ experience }: { experience: ExperienceData }) => {
  const { t } = useTranslation();
  return (
    <div className="w-full gap-5">
      {/* Right Side: Institute + Dates */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-start gap-4">
          <div className="bg-gray-100 rounded-md">
            <img src={BuildingSVG} className="w-10 h-10" alt="build" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">{experience.occupationTitle}</h4>
            <p className="text-gray-500">{experience.company}</p>
          </div>
        </div>
        <div>
          <p className="text-gray-500 mb-1">{t("candidates.startDate")}</p>
          <p className="text-gray-800 font-medium">
            {formatDate(experience.startDate, t)}
          </p>
        </div>
        <div>
          <p className="text-gray-500 mb-1">{t("candidates.completionDate")}</p>
          <p className="text-gray-800 font-medium">
            {formatDate(experience.endDate ?? undefined, t)}
          </p>
        </div>
      </div>
      <div className="flex items-start gap-4 py-5">
        <p className="text-gray-500">{experience.summary}</p>
      </div>
    </div>
  );
};

export default ExperienceCard;
