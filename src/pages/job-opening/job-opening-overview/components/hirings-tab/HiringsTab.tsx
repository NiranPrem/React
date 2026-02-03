import { useTranslation } from "react-i18next";
import EmptyState from "../../../../../shared/components/empty-state/EmptyState";

const HiringsTab = () => {
  const { t } = useTranslation();

  return (
    <div className="w-full px-5 pt-5 bg-white rounded-lg ">
      <div className="flex justify-between items-center mb-5 border-b border-[#F6F6F6] pb-4">
        <h2 className="text-lg font-semibold text-gray-900">{t("common.hirings")}</h2>
      </div>
      <div style={{ height: "calc(100vh - 388px)", overflowY: "auto" }}>
        <EmptyState />
      </div>
    </div>
  );
};

export default HiringsTab;
