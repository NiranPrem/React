import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import type { RootState } from "../../../../store/store";
import { HTMLFormatComment } from "../../../../services/common";
import { Rating } from "primereact/rating";

const DetailsCard = () => {
  const { t } = useTranslation();
  const { feedback } = useSelector((state: RootState) => state.interviews);

  return (
    <div className="grid md:grid-cols-2 gap-y-5 gap-x-8">
      {/* Rating */}
      <div>
        <div className="text-sm text-gray-500 mb-1">Rating</div>
        <div className="pr-5">
          <Rating
            disabled
            id="rating"
            value={feedback?.rating ?? 0}
            cancel={false}
            className="pt-2"
          />
        </div>
      </div>

      {/* Status */}
      <div>
        <div className="text-sm text-gray-500 mb-1">Status</div>
        <div className="pr-5">
          {feedback?.statusdetails?.label?.toString() ?? t("common.none")}
        </div>
      </div>

      {/* Comments */}
      <div className="md:col-span-3">
        <div className="text-sm text-gray-500 mb-1">Comments</div>
        <div className="pr-5 whitespace-pre-line">
          {feedback?.comments && feedback.comments !== ""
            ? HTMLFormatComment(feedback.comments)
            : t("common.none")}
        </div>
      </div>
    </div>
  );
};

export default DetailsCard;
