import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "primereact/button";
import "./CreateUpdateUser.css";
import { useTranslation } from "react-i18next";
import { fetchMasterDataRequest } from "../../../../store/reducers/masterDataSlice.ts";
import { useNavigate, useParams } from "react-router-dom";
import {
  addUserManagementRequest,
  updateUserManagementRequest,
} from "../../../../store/reducers/userManagementSlice.ts";
import AtsLoader from "../../../../shared/components/ats-loader/AtsLoader.tsx";
import {
  DropdownField,
  InputTextField,
} from "../../../../shared/components/ats-inputs/Inputs.tsx";
import type { UserManagementInterface } from "../../../../shared/interface/UserManagementInterface.ts";
import type { RootState } from "../../../../store/store.ts";
import type { Attendees } from "../../../../shared/interface/EventInterface.ts";
import Select from "react-select";
import ToggleSegment from "../../../../shared/components/ats-toggle/Toggle.tsx";

const CreateUpdateUser = () => {
  const { t } = useTranslation();
  const { employeeId } = useParams<{ employeeId: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    departments,
    roles,
    loading: masterDataLoading,
  } = useSelector((state: RootState) => state.masterData);

  const { selectedUserManagement, loading, success } = useSelector(
    (state: RootState) => state.userManagement
  );

  const [selectedRoles, setSelectedRoles] = useState<Attendees[]>([]);
  const [originalData, setOriginalData] = useState<UserManagementInterface>();

  const [formData, setFormData] = useState<UserManagementInterface>({
    fullName: "",
    email: "",
    departmentId: undefined,
    roleIds: [],
    statusId: 2,
  });

  const [errors, setErrors] = useState<{ fullName?: string }>({});

  const handleStatusChange = (value: "0" | "1") => {
    updateForm("statusId", value === "0" ? 2 : 3);
  };

  useEffect(() => {
    dispatch(fetchMasterDataRequest());
  }, [dispatch]);

  useEffect(() => {
    if (selectedUserManagement) {
      const mappedValues: UserManagementInterface = {
        fullName: selectedUserManagement.employeeName,
        email: selectedUserManagement.emailId,
        departmentId: selectedUserManagement.department?.value,
        roleIds: (
          selectedUserManagement.roles?.map((r) => r.value) ?? []
        ).filter((v): v is number => typeof v === "number"),
        statusId: selectedUserManagement.userStatus?.value,
      };

      setFormData(mappedValues);
      setOriginalData(mappedValues);

      setSelectedRoles(
        selectedUserManagement.roles?.map((r) => ({
          code: r.value,
          name: r.label,
        })) ?? []
      );
    }
  }, [selectedUserManagement]);

  const getUpdatedFields = (
    original: UserManagementInterface,
    updated: UserManagementInterface
  ) => {
    const changed: Partial<UserManagementInterface> = {};
    Object.keys(updated).forEach((key) => {
      const k = key as keyof UserManagementInterface;
      if (JSON.stringify(original[k]) !== JSON.stringify(updated[k])) {
        changed[k] = updated[k];
      }
    });
    return changed;
  };

  useEffect(() => {
    if (success && !loading && !selectedUserManagement?.employeeId) {
      navigate(-1);
    }
  }, [success, loading, navigate, selectedUserManagement?.employeeId]);

  const updateForm = useCallback(
    (key: keyof UserManagementInterface, value: unknown) => {
      setFormData((prev) => ({ ...prev, [key]: value }));
      if (key === "fullName") {
        setErrors((prev) => ({ ...prev, fullName: undefined }));
      }
    },
    []
  );

  const normalizedRoles = useMemo<Attendees[]>(
    () =>
      Array.isArray(roles)
        ? roles.map((r: any) => ({ code: r.value, name: r.label }))
        : [],
    [roles]
  );

  const handleRolesChange = (selectedOptions: readonly Attendees[] | null) => {
    const newSelected = selectedOptions ? [...selectedOptions] : [];
    setSelectedRoles(newSelected);
    updateForm(
      "roleIds",
      newSelected.map((r) => r.code)
    );
  };

  const getAddedRoles = (original: number[], updated: number[]) => {
    return updated.filter((id) => !original.includes(id));
  };

  const getRemovedRoles = (original: number[], updated: number[]) => {
    return original.filter((id) => !updated.includes(id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName || formData.fullName.trim().length === 0) {
      setErrors({ fullName: "Employee name is required" });
      return;
    }

    if (formData.fullName.length > 100) {
      setErrors({ fullName: "Employee name must be 100 characters or less" });
      return;
    }

    const roleIds = (formData.roleIds ?? []).filter(
      (id): id is number => typeof id === "number"
    );

    const normalizedForm: UserManagementInterface = {
      ...formData,
      roleIds,
    };

    if (selectedUserManagement?.employeeId) {
      const originalRoles = originalData?.roleIds ?? [];
      const addedRoles = getAddedRoles(originalRoles, roleIds);
      const removedRoles = getRemovedRoles(originalRoles, roleIds);
      const changedFields = getUpdatedFields(
        originalData ?? {},
        normalizedForm
      );
      const payload = {
        ...changedFields,
        roleIds: [...addedRoles, ...removedRoles],
      };
      dispatch(
        updateUserManagementRequest({
          payload,
          employeeId: String(selectedUserManagement.employeeId),
        })
      );
      return;
    }

    dispatch(addUserManagementRequest(normalizedForm));
  };

  const isFormValid = () => {
    return (
      formData.fullName &&
      formData.fullName.trim().length > 0 &&
      formData.fullName.length <= 100 &&
      formData.email &&
      formData.departmentId &&
      formData.roleIds &&
      formData.roleIds.length > 0
    );
  };

  return (
    /* Changed space-y-5 to space-y-2 to reduce height */
    <form onSubmit={handleSubmit} className="space-y-2 pb-2">
      {(loading || masterDataLoading) && <AtsLoader />}

      <div className="space-y-4 py-5 px-4 bg-white rounded-2xl">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">User Information</h2>
          {employeeId && (
            <ToggleSegment
              value={formData.statusId === 3 ? "1" : "0"}
              onChange={handleStatusChange}
              labelOne="Active"
              labelTwo="Inactive"
            />
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <InputTextField
              label="Employee Name *"
              placeholder="Employee Name"
              valueKey="fullName"
              formData={formData}
              setFormData={setFormData}
              max={100}
              disabled={Boolean(employeeId)}
            />
            {errors.fullName && (
              <span className="text-red-500 text-sm">{errors.fullName}</span>
            )}
          </div>

          <InputTextField
            label={`${t("common.email")} *`}
            placeholder={t("common.email")}
            valueKey="email"
            formData={formData}
            setFormData={setFormData}
            type="email"
            disabled={Boolean(employeeId)}
            max={50}
          />

          <DropdownField
            label="Department Name *"
            placeholder="Department"
            valueKey="departmentId"
            options={departments}
            formData={formData}
            setFormData={setFormData}
          />
        </div>

        <div>
          <label className="block text-black mb-1">Role(s) *</label>
          <Select
            isMulti
            value={selectedRoles}
            onChange={handleRolesChange}
            options={normalizedRoles}
            getOptionLabel={(o) => o.name ?? ""}
            getOptionValue={(o) => String(o.code)}
            placeholder="Select roles"
          />
        </div>
      </div>

      {/* Removed mb-4 and mt-4 to prevent unwanted bottom scroll */}
      <div className="flex justify-center gap-4 pt-2">
        <Button
          type="submit"
          label={selectedUserManagement ? "Update" : "Send Invitation"}
          className="!bg-[#007BFF] px-10 py-2"
          disabled={loading || !isFormValid()}
        />
      </div>
    </form>
  );
};

export default CreateUpdateUser;
