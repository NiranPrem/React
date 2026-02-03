import { useSelector } from "react-redux";

import { useTranslation } from "react-i18next";
import type { RootState } from "../../../../store/store";

const DetailsCard = () => {
  const { t } = useTranslation();
  const { selectedUserManagement } = useSelector(
    (state: RootState) => state.userManagement
  );

  const userDetails = [
    {
      label: "Employer Name",
      value: selectedUserManagement?.employeeName ?? t("common.none"),
    },
    {
      label: "Department",
      value: selectedUserManagement?.department?.label ?? t("common.none"),
    },
    {
      label: "Employee ID",
      value: selectedUserManagement?.employeeId ?? t("common.none"),
    },
    {
      label: "Email",
      value: selectedUserManagement?.emailId ?? t("common.none"),
    },
    {
      label: "Roles",
      value: ((selectedUserManagement?.roles ?? []).map((r) => r.label).join(", ")) || t("common.none"),
    },
    {
      label: "Status",
      value: selectedUserManagement?.userStatus?.label ?? t("common.none"),
    },

  ];

  return (
    <div className="grid md:grid-cols-3 gap-y-5 gap-x-8">
      {userDetails.map((field, idx) => {
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
