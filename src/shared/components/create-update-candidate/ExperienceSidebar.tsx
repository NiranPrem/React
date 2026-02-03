import React, { useEffect, useState } from "react";
import { Sidebar } from "primereact/sidebar";
import { Button } from "primereact/button";
import "./ExperienceSidebar.css";
import closeLogo from "../../../assets/icons/x-close.svg";
import closeWhiteLogo from "../../../assets/icons/close-white-circle.svg";
import VectorSVG from "../../../assets/icons/vector.svg";

import {
  CheckboxField,
  DateField,
  InputTextArea,
  InputTextField,
} from "../ats-inputs/Inputs";
import CustomConfirmDialog from "../custom-confirm-dialog/CustomConfirmDialog";
import TrashSvg from "../../../assets/icons/trash.svg";
import ToastService from "../../../services/toastService";
import type { ExperienceData } from "../../interface/CandidateInterface";
import { useTranslation } from "react-i18next";

interface ExperienceSidebarProps {
  visible: boolean;
  onHide: () => void;
  data?: ExperienceData[]; // ✅ added optional data prop
  onSaveExp: (data: ExperienceData[]) => void;
}

const defaultExperience: ExperienceData = {
  occupationTitle: "",
  company: "",
  summary: "",
  startDate: "",
  endDate: null,
  currentlyWorkingHere: false,
};

const ExperienceSidebar: React.FC<ExperienceSidebarProps> = ({
  visible,
  onHide,
  data, // ✅ added
  onSaveExp,
}) => {
  const { t } = useTranslation();
  const [experiences, setExperiences] = useState<ExperienceData[]>([
    { ...defaultExperience },
  ]);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{
    index: number;
  } | null>(null);

  // ✅ Prefill if `data` is passed
  useEffect(() => {
    if (visible) {
      if (data?.length) {
        // Deep clone the array to allow local modification without mutating parents
        setExperiences(data.map((exp) => ({ ...exp })));
      } else {
        setExperiences([{ ...defaultExperience }]);
      }
    }
  }, [visible]); // Only reset when opening the sidebar

  const handleClear = () => {
    setExperiences([{ ...defaultExperience }]);
  };

  const handleAdd = () => {
    setExperiences((prev) => [...prev, { ...defaultExperience }]);
  };

  const handleSave = () => {
    // 1. Filter out fully empty entries
    const validExperiences = experiences.filter((exp) => {
      return (
        exp.occupationTitle?.trim() ||
        exp.company?.trim() ||
        exp.startDate ||
        exp.endDate
      );
    });

    if (validExperiences.length === 0) {
      return;
    }
    // 2. Validate required fields
    const invalidEntries = validExperiences.filter((exp) => {
      return (
        !exp.occupationTitle?.trim() ||
        !exp.company?.trim() ||
        !exp.startDate ||
        (!exp.currentlyWorkingHere && !exp.endDate)
      );
    });
    if (invalidEntries.length > 0) {
      ToastService.showWarn(
        "Please fill in all required fields. End Date is optional only if 'I Currently Work Here' is checked."
      );
      return;
    }
    // 3. Save and close
    onSaveExp(validExperiences);
    onHide();
  };

  const handleFormChange = (
    index: number,
    key: keyof ExperienceData,
    value: string | boolean | Date | null
  ) => {
    setExperiences((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [key]: value,
      };

      if (key === "currentlyWorkingHere" && value === true) {
        updated[index].endDate = null;
      }

      return updated;
    });
  };

  const handleRemove = (index: number) => {
    setDeleteTarget({ index });
    setDeleteDialogVisible(true);
  };

  return (
    <Sidebar
      position="right"
      visible={visible}
      onHide={onHide}
      className="experience !w-[60rem] h-screen shadow-lg flex flex-col bg-white"
      showCloseIcon={false}
    >
      <CustomConfirmDialog
        title={t("candidates.deleteExperienceDetails")}
        subTitle={t("common.addedDetailWillBeDeleted")}
        icon={TrashSvg}
        visible={deleteDialogVisible}
        onHide={() => setDeleteDialogVisible(false)}
        onConfirm={() => {
          if (!deleteTarget) return;
          const updated = experiences.filter(
            (_, i) => i !== deleteTarget?.index
          );
          setExperiences(updated);
          setDeleteDialogVisible(false);
        }}
      />
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="sticky top-0 z-20 bg-gray-100 px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            {t("candidates.editExperienceDetails")}
          </h2>
          <button
            type="button"
            className="rounded-lg hover:bg-[#FFFFFF] p-2 cursor-pointer"
            onClick={() => {
              onHide();
              handleClear();
            }}
          >
            <img src={closeLogo} className="w-5 h-5" alt="close" />
          </button>
        </div>

        {/* Experience Forms */}
        <div className="overflow-y-auto px-5 pt-5 pb-32 h-full">
          {experiences.length === 0 && (
            <div className="h-full flex flex-col justify-center items-center text-center">
              <div className="rounded-lg bg-[#F6F6F6] p-5 mb-4">
                <img src={VectorSVG} className="w-5 h-5" alt="close" />
              </div>
              <span className="text-gray-500">{t("common.noDataFound")}</span>
            </div>
          )}
          {experiences.map((formData, index) => (
            <div
              key={index + "experience"}
              className="border border-[#F6F6F6] rounded-lg p-5 mb-6 relative"
            >
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="absolute -top-3 -right-3 cursor-pointer"
                title="Remove this experience"
              >
                <img src={closeWhiteLogo} className="w-6 h-6" alt="remove" />
              </button>

              <div className="grid grid-cols-3 gap-4 mb-4">
                <InputTextField
                  label={`${t("candidates.occupationTitle")} *`}
                  placeholder={t("candidates.occupationTitle")}
                  valueKey="occupationTitle"
                  formData={formData}
                  setFormData={(data) =>
                    handleFormChange(
                      index,
                      "occupationTitle",
                      data.occupationTitle
                    )
                  }
                  max={100}
                />
                <InputTextField
                  label={`${t("candidates.company")} *`}
                  placeholder={t("candidates.company")}
                  valueKey="company"
                  formData={formData}
                  setFormData={(data) =>
                    handleFormChange(index, "company", data.company)
                  }
                  max={100}
                />
              </div>

              <InputTextArea
                label={t("candidates.summary")}
                valueKey="summary"
                formData={formData}
                setFormData={(data) =>
                  handleFormChange(index, "summary", data.summary)
                }
                maxLength={500}
              />

              <CheckboxField
                label={t("candidates.currentlyWorkHere")}
                valueKey="currentlyWorkingHere"
                formData={formData}
                setFormData={(data) =>
                  handleFormChange(
                    index,
                    "currentlyWorkingHere",
                    data.currentlyWorkingHere
                  )
                }
              />

              <div className="grid grid-cols-2 gap-4 mb-4">
                <DateField
                  label={`${t("candidates.startDate")} *`}
                  valueKey="startDate"
                  formData={formData}
                  setFormData={(data) =>
                    handleFormChange(index, "startDate", data.startDate)
                  }
                />
                <DateField
                  label={`${t("candidates.endDate")} *`}
                  valueKey="endDate"
                  formData={formData}
                  setFormData={(data) =>
                    handleFormChange(index, "endDate", data.endDate)
                  }
                  disabled={formData.currentlyWorkingHere}
                  minDate={
                    formData.startDate
                      ? new Date(
                        new Date(formData.startDate).getTime() +
                        24 * 60 * 60 * 1000
                      )
                      : undefined
                  }
                />
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Buttons */}
        <div className="flex justify-center gap-4 mt-4 mb-4 absolute bottom-4 left-0 right-0">
          <div className="shadow-sm p-3 rounded-2xl flex gap-10 bg-white">
            <Button
              type="button"
              label={t("common.clear")}
              severity="secondary"
              outlined
              className="!bg-white !border !border-gray-300 !text-gray-700 !rounded-lg"
              onClick={handleClear}
            />
            <Button
              icon="pi pi-plus"
              type="button"
              label={t("common.add")}
              className="!bg-[#07A3A2] !text-white !border !border-[#07A3A2] !rounded-lg"
              onClick={handleAdd}
            />
            <Button
              type="submit"
              label={t("common.save")}
              className="!bg-[#007BFF]"
              onClick={handleSave}
              disabled={
                experiences.length === 0 ||
                experiences.some(
                  (exp) =>
                    !exp.occupationTitle?.trim() ||
                    !exp.company?.trim() ||
                    !exp.startDate ||
                    (!exp.currentlyWorkingHere && !exp.endDate) ||
                    (exp.occupationTitle?.length || 0) > 100 ||
                    (exp.company?.length || 0) > 100 ||
                    (exp.summary?.length || 0) > 500
                )
              }
            />
          </div>
        </div>
      </div>
    </Sidebar>
  );
};

export default ExperienceSidebar;
