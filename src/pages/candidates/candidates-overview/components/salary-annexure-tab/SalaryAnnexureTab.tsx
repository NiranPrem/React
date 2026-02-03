import { useEffect, useState } from "react";
import PenSvg from "../../../../../assets/icons/pen.svg";
import closeLogo from "../../../../../assets/icons/x-close.svg";

import DetailsCard from "./DetailsCard";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../../../../store/store";
import CreateUpdateCandidate from "../../../../../shared/components/create-update-candidate/CreateUpdateCandidate";
import { resetCandidateEditState } from "../../../../../store/reducers/candidateSlice";
import { useTranslation } from "react-i18next";

const SalaryAnnexureTab = () => {
  const { t } = useTranslation();
  const [isEdit, setIsEdit] = useState(false);
  const dispatch = useDispatch();
  const { editSuccess, selectedCandidate } = useSelector(
    (state: RootState) => state.candidates
  );

  const annexure = [
    {
      label: t("candidates.monthlyInputValue"),
      value:
        selectedCandidate?.salaryAnnexure?.monthlyInputValue ??
        t("common.none"),
    },
    {
      label: t("candidates.annualCTCWords"),
      value:
        selectedCandidate?.salaryAnnexure?.annualCtcWords ?? t("common.none"),
    },
    {
      label: t("candidates.basicMonthly"),
      value:
        selectedCandidate?.salaryAnnexure?.basicMonthly ?? t("common.none"),
    },
    {
      label: t("candidates.basicAnnually"),
      value:
        selectedCandidate?.salaryAnnexure?.basicAnnually ?? t("common.none"),
    },
    {
      label: t("candidates.houseRentAllowanceMonthly"),
      value:
        selectedCandidate?.salaryAnnexure?.houseRentAllowanceMonthly ??
        t("common.none"),
    },
    {
      label: t("candidates.houseRentAllowanceAnnually"),
      value:
        selectedCandidate?.salaryAnnexure?.houseRentAllowanceAnnually ??
        t("common.none"),
    },
    {
      label: t("candidates.conveyanceAllowanceMonthly"),
      value:
        selectedCandidate?.salaryAnnexure?.conveyanceAllowanceMonthly ??
        t("common.none"),
    },
    {
      label: t("candidates.conveyanceAllowanceAnnually"),
      value:
        selectedCandidate?.salaryAnnexure?.conveyanceAllowanceAnnually ??
        t("common.none"),
    },
    {
      label: t("candidates.attireExpensesMonthly"),
      value:
        selectedCandidate?.salaryAnnexure?.attireExpensesMonthly ??
        t("common.none"),
    },
    {
      label: t("candidates.attireExpensesAnnually"),
      value:
        selectedCandidate?.salaryAnnexure?.attireExpensesAnnually ??
        t("common.none"),
    },
    {
      label: t("candidates.medicalAllowanceMonthly"),
      value:
        selectedCandidate?.salaryAnnexure?.medicalAllowanceMonthly ??
        t("common.none"),
    },
    {
      label: t("candidates.medicalAllowanceAnnually"),
      value:
        selectedCandidate?.salaryAnnexure?.medicalAllowanceAnnually ??
        t("common.none"),
    },
    {
      label: t("candidates.leaveTravelAllowanceMonthly"),
      value:
        selectedCandidate?.salaryAnnexure?.leaveTravelAllowanceMonthly ??
        t("common.none"),
    },
    {
      label: t("candidates.leaveTravelAllowanceAnnually"),
      value:
        selectedCandidate?.salaryAnnexure?.leaveTravelAllowanceAnnually ??
        t("common.none"),
    },
    {
      label: t("candidates.profPersuitExpenseMonthly"),
      value:
        selectedCandidate?.salaryAnnexure?.profPersuitExpenseMonthly ??
        t("common.none"),
    },
    {
      label: t("candidates.profPersuitExpenseAnnually"),
      value:
        selectedCandidate?.salaryAnnexure?.profPersuitExpenseAnnually ??
        t("common.none"),
    },
    {
      label: t("candidates.statutoryBonusMonthly"),
      value:
        selectedCandidate?.salaryAnnexure?.statutoryBonusMonthly ??
        t("common.none"),
    },
    {
      label: t("candidates.statutoryBonusAnnually"),
      value:
        selectedCandidate?.salaryAnnexure?.statutoryBonusAnnually ??
        t("common.none"),
    },
    {
      label: t("candidates.fixedAllowanceMonthly"),
      value:
        selectedCandidate?.salaryAnnexure?.fixedAllowanceMonthly ??
        t("common.none"),
    },
    {
      label: t("candidates.fixedAllowanceAnnually"),
      value:
        selectedCandidate?.salaryAnnexure?.fixedAllowanceAnnually ??
        t("common.none"),
    },
    {
      label: t("candidates.totalGrossMonthly"),
      value:
        selectedCandidate?.salaryAnnexure?.totalGrossMonthly ??
        t("common.none"),
    },
    {
      label: t("candidates.totalGrossAnnually"),
      value:
        selectedCandidate?.salaryAnnexure?.totalGrossAnnually ??
        t("common.none"),
    },
    {
      label: t("candidates.gratuityEmployerContributionMonthly"),
      value:
        selectedCandidate?.salaryAnnexure
          ?.gratuityEmployerContributionMonthly ?? t("common.none"),
    },
    {
      label: t("candidates.gratuityEmployerContributionAnnually"),
      value:
        selectedCandidate?.salaryAnnexure
          ?.gratuityEmployerContributionAnnually ?? t("common.none"),
    },
    {
      label: t("candidates.groupHealthInsuranceEmployerContributionMonthly"),
      value:
        selectedCandidate?.salaryAnnexure
          ?.groupHealthInsuranceEmployerContributionMonthly ?? t("common.none"),
    },
    {
      label: t("candidates.groupHealthInsuranceEmployerContributionAnnually"),
      value:
        selectedCandidate?.salaryAnnexure
          ?.groupHealthInsuranceEmployerContributionAnnually ??
        t("common.none"),
    },
    {
      label: t("candidates.epfEmployerContributionMonthly"),
      value:
        selectedCandidate?.salaryAnnexure?.epfEmployerContributionMonthly ??
        t("common.none"),
    },
    {
      label: t("candidates.epfEmployerContributionAnnually"),
      value:
        selectedCandidate?.salaryAnnexure?.epfEmployerContributionAnnually ??
        t("common.none"),
    },
    {
      label: t("candidates.totalRetiralMonthly"),
      value:
        selectedCandidate?.salaryAnnexure?.totalRetiralMonthly ??
        t("common.none"),
    },
    {
      label: t("candidates.totalRetiralAnnually"),
      value:
        selectedCandidate?.salaryAnnexure?.totalRetiralAnnually ??
        t("common.none"),
    },
    {
      label: t("candidates.costToCompanyMonthly"),
      value:
        selectedCandidate?.salaryAnnexure?.costToCompanyMonthly ??
        t("common.none"),
    },
    {
      label: t("candidates.costToCompanyAnnually"),
      value:
        selectedCandidate?.salaryAnnexure?.costToCompanyAnnually ??
        t("common.none"),
    },
  ];

  const handleEdit = () => {
    dispatch(resetCandidateEditState());
    setIsEdit((prev) => !prev);
  };

  useEffect(() => {
    if (editSuccess) {
      setIsEdit(false);
    }
  }, [editSuccess, dispatch]);

  return (
    <>
      {isEdit && (
        <CreateUpdateCandidate
          visibleSection="salaryAnnexure"
          onClose={() => setIsEdit(false)}
        />
      )}
      {!isEdit && (
        <div className="w-full p-5 bg-white rounded-lg ">
          <div className="flex justify-between items-center mb-5 border-b border-[#F6F6F6] pb-2">
            <h2 className="text-lg font-semibold text-gray-900">
              {t("candidates.salaryAnnexure")}
            </h2>
            <button
              type="button"
              onClick={handleEdit}
              className="rounded-lg hover:bg-[#F6F6F6] p-2 cursor-pointer"
              aria-label="Edit"
            >
              {!isEdit && <img src={PenSvg} className="w-5 h-5" alt="" />}
            </button>
          </div>
          <div style={{ height: "calc(100vh - 405px)", overflowY: "auto" }}>
            <DetailsCard details={annexure} />
          </div>
        </div>
      )}
    </>
  );
};

export default SalaryAnnexureTab;
