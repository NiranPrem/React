import { useTranslation } from "react-i18next";

type DetailField = {
  label: string;
  value: string | number | null | undefined;
};

interface DetailsCardProps {
  details: DetailField[];
}

const DetailsCard = ({ details }: DetailsCardProps) => {
  const { t } = useTranslation();
  return (
    <div className="grid md:grid-cols-3 gap-y-5 gap-x-8">
      {details.map((field, idx) => {
        return (
          <div key={`${idx}-${field.label}`}>
            <div className="text-sm text-gray-500 mb-1">{field.label}</div>
            <div className="max-w truncate pr-5">
              {field.value && field.value !== ""
                ? field.value.toString()
                : t("common.none")}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DetailsCard;
