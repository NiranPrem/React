import { useTranslation } from "react-i18next";
import BuildingSVG from "../../../assets/icons/building.svg";
import { formatDate } from "../../../services/common";
import type { EducationData } from "../../interface/CandidateInterface";

const EducationCard = ({ education }: { education: EducationData }) => {
  const { t } = useTranslation();
  return (
    <div className="w-full gap-5">
      {/* Left Side: Icon + Degree Info */}
      <div className="flex items-start gap-4">
        <div className="bg-gray-100 rounded-md">
          <img src={BuildingSVG} className="w-10 h-10" alt="build" />
        </div>
        <div>
          <h4 className="font-semibold text-gray-900">{education.degree}</h4>
          <p className="text-gray-500">{education.major}</p>
        </div>
      </div>

      {/* Right Side: Institute + Dates */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-5">
        <div>
          <p className="text-gray-500 mb-1">
            {t("candidates.nameOfInstitute")}
          </p>
          <p className="text-gray-800 font-medium">{education.institute}</p>
        </div>
        <div>
          <p className="text-gray-500 mb-1">{t("candidates.startDate")}</p>
          <p className="text-gray-800 font-medium">
            {formatDate(education.startDate, t)}
          </p>
        </div>
        <div>
          <p className="text-gray-500 mb-1">{t("candidates.completionDate")}</p>
          <p className="text-gray-800 font-medium">
            {formatDate(education.endDate ?? undefined, t)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default EducationCard;
