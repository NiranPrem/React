import React, { useEffect, useState } from "react";
import { Sidebar } from "primereact/sidebar";
import { Button } from "primereact/button";
import "./EducationSidebar.css";
import closeLogo from "../../../assets/icons/x-close.svg";
import closeWhiteLogo from "../../../assets/icons/close-white-circle.svg";
import VectorSVG from "../../../assets/icons/vector.svg";
import ToastService from "../../../services/toastService";

import { CheckboxField, DateField, InputTextField } from "../ats-inputs/Inputs";
import CustomConfirmDialog from "../custom-confirm-dialog/CustomConfirmDialog";
import TrashSvg from "../../../assets/icons/trash.svg";
import type { EducationData } from "../../interface/CandidateInterface";
import { useTranslation } from "react-i18next";

interface EducationSidebarProps {
  visible: boolean;
  onHide: () => void;
  data?: EducationData[]; // ✅ added optional data prop
  onSaveEdu: (data: EducationData[]) => void;
}

const defaultEducation: EducationData = {
  institute: "",
  major: "",
  degree: "",
  currentlyPursuing: false,
  startDate: "",
  endDate: null,
};

const EducationSidebar: React.FC<EducationSidebarProps> = ({
  visible,
  onHide,
  data,
  onSaveEdu,
}) => {
  const { t } = useTranslation();
  const [education, setEducation] = useState<EducationData[]>([
    { ...defaultEducation },
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
        setEducation(data.map((edu) => ({ ...edu })));
      } else {
        setEducation([{ ...defaultEducation }]);
      }
    }
  }, [visible]); // Only reset when opening the sidebar

  const handleClear = () => {
    setEducation([{ ...defaultEducation }]);
  };

  const handleAdd = () => {
    setEducation((prev) => [...prev, { ...defaultEducation }]);
  };

  const handleSave = () => {
    // 1. Filter out fully empty entries
    const cleanedEducation = education.filter((edu) => {
      return (
        edu.institute?.trim() ||
        edu.major?.trim() ||
        edu.degree?.trim() ||
        edu.startDate ||
        edu.endDate
      );
    });

    // 1a. If nothing was filled at all, don't allow closing
    if (cleanedEducation.length === 0) {
      return;
    }

    // 2. Validate required fields
    const invalidEntries = cleanedEducation.filter((edu) => {
      return (
        !edu.institute?.trim() ||
        !edu.major?.trim() ||
        !edu.degree?.trim() ||
        !edu.startDate ||
        (!edu.currentlyPursuing && !edu.endDate)
      );
    });
    if (invalidEntries.length > 0) {
      ToastService.showWarn(
        "Please fill in all required fields. Completion Date is optional only if 'Currently pursuing' is checked."
      );
      return;
    }
    // 3. Save and close
    onSaveEdu(cleanedEducation);
    onHide();
  };

  const handleFormChange = (
    index: number,
    key: keyof EducationData,
    value: string | boolean | Date | null
  ) => {
    setEducation((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [key]: value,
      };

      if (key === "currentlyPursuing" && value === true) {
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
      className="education !w-[60rem] h-screen shadow-lg flex flex-col bg-white"
      showCloseIcon={false}
    >
      <CustomConfirmDialog
        title={t("candidates.deleteEducationalDetails")}
        subTitle={t("common.addedDetailWillBeDeleted")}
        icon={TrashSvg}
        visible={deleteDialogVisible}
        onHide={() => setDeleteDialogVisible(false)}
        onConfirm={() => {
          if (!deleteTarget) return;
          const updated = education.filter((_, i) => i !== deleteTarget?.index);
          setEducation(updated);
          setDeleteDialogVisible(false);
        }}
      />
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="sticky top-0 z-20 bg-gray-100 px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            {t("candidates.editEducationDetails")}
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

        {/* Education Forms */}
        <div className="overflow-y-auto px-5 pt-5 pb-32 h-full">
          {education.length === 0 && (
            <div className="h-full flex flex-col justify-center items-center text-center">
              <div className="rounded-lg bg-[#F6F6F6] p-5 mb-4">
                <img src={VectorSVG} className="w-5 h-5" alt="close" />
              </div>
              <span className="text-gray-500">{t("common.noDataFound")}</span>
            </div>
          )}
          {education.map((formData, index) => (
            <div
              key={index + "education"}
              className="border border-[#F6F6F6] rounded-lg p-5 mb-6 relative"
            >
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="absolute -top-3 -right-3 cursor-pointer"
                title="Remove this education"
              >
                <img src={closeWhiteLogo} className="w-6 h-6" alt="remove" />
              </button>

              <div className="grid grid-cols-3 gap-4 mb-4">
                <InputTextField
                  label={`${t("candidates.instituteSchool")} *`}
                  placeholder={t("candidates.instituteSchool")}
                  valueKey="institute"
                  formData={formData}
                  setFormData={(data) =>
                    handleFormChange(index, "institute", data.institute)
                  }
                  max={100}
                />
                <InputTextField
                  label={`${t("candidates.majorDepartment")} *`}
                  placeholder={t("candidates.majorDepartment")}
                  valueKey="major"
                  formData={formData}
                  setFormData={(data) =>
                    handleFormChange(index, "major", data.major)
                  }
                  max={100}
                />
                <InputTextField
                  label={`${t("candidates.degree")} *`}
                  placeholder={t("candidates.degree")}
                  valueKey="degree"
                  formData={formData}
                  setFormData={(data) =>
                    handleFormChange(index, "degree", data.degree)
                  }
                  max={100}
                />
              </div>
              <CheckboxField
                label={t("candidates.currentlyPursuing")}
                valueKey="currentlyPursuing"
                formData={formData}
                setFormData={(data) =>
                  handleFormChange(
                    index,
                    "currentlyPursuing",
                    data.currentlyPursuing
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
                  label={`${t("candidates.completionDate")} *`}
                  valueKey="endDate"
                  formData={formData}
                  disabled={formData.currentlyPursuing}
                  setFormData={(data) =>
                    handleFormChange(index, "endDate", data.endDate)
                  }
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
                education.length === 0 ||
                education.some(
                  (edu) =>
                    !edu.institute?.trim() ||
                    !edu.major?.trim() ||
                    !edu.degree?.trim() ||
                    !edu.startDate ||
                    (!edu.currentlyPursuing && !edu.endDate) ||
                    (edu.institute?.length || 0) > 100 ||
                    (edu.major?.length || 0) > 100 ||
                    (edu.degree?.length || 0) > 100
                )
              }
            />
          </div>
        </div>
      </div>
    </Sidebar>
  );
};

export default EducationSidebar;
