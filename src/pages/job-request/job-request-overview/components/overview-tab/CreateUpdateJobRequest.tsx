import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "primereact/button";
import { Chips } from "primereact/chips";
import type { RootState } from "../../../../../store/store";
import {
    addJobRequestRequest,
    updateJobRequestRequest,
} from "../../../../../store/reducers/jobRequestSlice";
import { fetchMasterDataRequest } from "../../../../../store/reducers/masterDataSlice";
import type { RequestInterface } from "../../../../../shared/interface/RequestInterface";
import {
    DropdownField,
    InputNumberField,
    InputTextField,
    RichTextField,
} from "../../../../../shared/components/ats-inputs/Inputs";
import "./CreateUpdateJobRequest.css";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import AtsLoader from "../../../../../shared/components/ats-loader/AtsLoader";

const CreateUpdateJobRequest = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const INITIAL_FORM_STATE: RequestInterface = {
        createdDate: new Date().toISOString(),
        positionTitle: "",
        jobTitleId: undefined,
        numberOfResources: undefined,
        totalJobExperience: undefined,
        regionId: undefined,
        officeLocationId: undefined,
        jobDescription: "",
        requirement: "",
        requiredSkills: [],
        jobRequestStatusId: undefined,
    };

    const [formData, setFormData] =
        useState<RequestInterface>(INITIAL_FORM_STATE);

    const [chipsKey, setChipsKey] = useState(0);

    const {
        loading: masterDataLoading,
        jobRequestStatus,
        locations,
        jobTitle,
        region,
    } = useSelector((state: RootState) => state.masterData);

    const { selectedJobRequest, loading, success } = useSelector(
        (state: RootState) => state.jobRequest
    );

    const { user } = useSelector((state: RootState) => state.auth);

    const isEditMode = Boolean(selectedJobRequest?.id);
    const GLOBAL_REGION_ID = 1;
    const isGlobalRegionSelected = formData.regionId === GLOBAL_REGION_ID;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const payload: RequestInterface = {
            positionTitle: formData.positionTitle,
            jobTitleId: formData.jobTitleId,
            numberOfResources: typeof formData.numberOfResources === "string"
                ? parseInt(formData.numberOfResources, 10)
                : formData.numberOfResources,
            jobDescription: formData.jobDescription,
            requirement: formData.requirement,
            requiredSkills: formData.requiredSkills,
            createdDate: formData.createdDate,
            jobRequestStatusId: formData.jobRequestStatusId,
            totalJobExperience: formData.totalJobExperience,
            officeLocationId: formData.officeLocationId,
            regionId: formData.regionId,
        };

        if (selectedJobRequest?.id) {
            payload.id = selectedJobRequest.id;
            payload.userId = user?.userId;
            dispatch(updateJobRequestRequest(payload));
        } else {
            if (Array.isArray(jobRequestStatus) && jobRequestStatus.length > 0) {
                if (
                    typeof jobRequestStatus[0] === "object" &&
                    "value" in jobRequestStatus[0]
                ) {
                    payload.jobRequestStatusId = jobRequestStatus[0].value;
                }
            }
            dispatch(addJobRequestRequest(payload));
        }
    };

    const isFormValid = () => {
        const hasRichTextContent = (html: string | undefined): boolean => {
            if (!html || typeof html !== "string") return false;
            const textContent = html.replace(/<[^>]*>/g, "").trim();
            return textContent.length > 0;
        };

        const getTextLength = (html: string | undefined): number => {
            if (!html || typeof html !== "string") return 0;
            const textContent = html.replace(/<[^>]*>/g, "");
            return textContent.length;
        };

        const hasJobDescription = hasRichTextContent(formData.jobDescription);
        const hasRequirement = hasRichTextContent(formData.requirement);
        const hasRequiredSkills = formData.requiredSkills && Array.isArray(formData.requiredSkills) && formData.requiredSkills.length > 0;

        const areAllSkillsWithinLimit = formData.requiredSkills && Array.isArray(formData.requiredSkills)
            ? formData.requiredSkills.every((skill: string) => skill.length <= 500)
            : true;

        const jobDescriptionLength = getTextLength(formData.jobDescription);
        const requirementLength = getTextLength(formData.requirement);
        const isJobDescriptionWithinLimit = jobDescriptionLength <= 1000;
        const isRequirementWithinLimit = requirementLength <= 1000;

        const hasTotalJobExperience = formData.totalJobExperience !== undefined &&
            formData.totalJobExperience !== null &&
            formData.totalJobExperience !== "" &&
            (typeof formData.totalJobExperience === "string" ? formData.totalJobExperience.trim() !== "" : true);

        const numberOfResourcesValue = typeof formData.numberOfResources === "string"
            ? formData.numberOfResources
            : formData.numberOfResources?.toString() || "";
        const hasNumberOfResources = formData.numberOfResources !== undefined &&
            formData.numberOfResources !== null &&
            numberOfResourcesValue.trim() !== "" &&
            /^\d+$/.test(numberOfResourcesValue) &&
            numberOfResourcesValue.length <= 5;

        const hasPositionTitle = formData.positionTitle && formData.positionTitle.trim() !== "";
        const isPositionTitleWithinLimit = formData.positionTitle ? formData.positionTitle.length <= 50 : false;

        const basicFieldsValid =
            hasPositionTitle &&
            isPositionTitleWithinLimit &&
            formData.jobTitleId &&
            hasNumberOfResources &&
            hasTotalJobExperience &&
            formData.regionId &&
            (!isGlobalRegionSelected || formData.officeLocationId);

        return basicFieldsValid && hasJobDescription && hasRequirement && hasRequiredSkills && isJobDescriptionWithinLimit && isRequirementWithinLimit && areAllSkillsWithinLimit;
    };

    useEffect(() => {
        dispatch(fetchMasterDataRequest());
    }, [dispatch]);

    useEffect(() => {
        if (selectedJobRequest) {
            setFormData({
                positionTitle: selectedJobRequest.positionTitle,
                jobTitleId: selectedJobRequest.jobTitle?.value,
                numberOfResources: selectedJobRequest.numberOfResources !== undefined && selectedJobRequest.numberOfResources !== null
                    ? (selectedJobRequest.numberOfResources)
                    : undefined,
                jobDescription: selectedJobRequest.jobDescription,
                requirement: selectedJobRequest.requirement,
                requiredSkills: selectedJobRequest.requiredSkills ?? [],
                createdDate: selectedJobRequest.createdDate,
                jobRequestStatusId: selectedJobRequest.jobRequestStatusId,
                totalJobExperience: selectedJobRequest.totalJobExperience,
                regionId: selectedJobRequest.regionId,
                officeLocationId: selectedJobRequest.officeLocationId,
            });

            // ensure Chips remount on edit load
            setChipsKey((k) => k + 1);
        }
    }, [selectedJobRequest]);

    useEffect(() => {
        if (success && !loading && !selectedJobRequest?.id) {
            navigate(-1);
        }
    }, [success, loading, navigate, selectedJobRequest?.id]);

    useEffect(() => {
        if (!isEditMode && !isGlobalRegionSelected) {
            setFormData((prev) => ({ ...prev, officeLocationId: 0 }));
        }
    }, [formData.regionId, isEditMode, isGlobalRegionSelected]);

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            {loading && masterDataLoading && <AtsLoader />}

            <div className="space-y-6 py-5 px-4 bg-white rounded-2xl">
                <h2 className="text-lg font-semibold mb-2">
                    {t("request.jobRequestInformation")}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <InputTextField
                        label={`${t("common.postingTitle")} *`}
                        placeholder={t("request.postingTitle")}
                        valueKey="positionTitle"
                        formData={formData}
                        setFormData={setFormData}
                        max={50}
                        allowedPattern={/^[a-zA-Z0-9\s!@#$%^&*()_+\-=\[\]{}|;:'",.<>?\/~`]*$/}
                    />

                    <DropdownField
                        label={`${t("common.jobTitle")} *`}
                        placeholder={t("request.jobTitle")}
                        valueKey="jobTitleId"
                        options={jobTitle}
                        formData={formData}
                        setFormData={setFormData}

                    />

                    <InputTextField
                        label={`${t("request.numberResourcesNeeded")} *`}
                        placeholder={t("request.numberOfResources")}
                        valueKey="numberOfResources"
                        formData={formData}
                        setFormData={setFormData}
                        max={5}
                        allowedPattern={/^\d*$/}
                    />

                    <InputTextField
                        label="Required Job Experience *"
                        placeholder={t("request.totalJobExperience")}
                        valueKey="totalJobExperience"
                        formData={formData}
                        setFormData={setFormData}
                        allowedPattern={/^[\d.\-]*$/}
                    />

                    <DropdownField
                        label="Region *"
                        placeholder={t("request.region")}
                        valueKey="regionId"
                        options={region}
                        formData={formData}
                        setFormData={setFormData}

                    />

                    <DropdownField
                        label={`Job Location ${isGlobalRegionSelected ? "*" : ""}`}
                        placeholder={t("request.jobLocation")}
                        valueKey="officeLocationId"
                        options={locations}
                        formData={formData}
                        setFormData={setFormData}
                        disabled={!isGlobalRegionSelected}
                    />
                </div>
            </div>

            <div className="space-y-6 py-5 px-4 bg-white rounded-2xl">
                <h2 className="text-lg font-semibold mb-2">
                    {t("common.descriptionInformation")}
                </h2>

                <RichTextField
                    label={`${t("common.jobDescription")} *`}
                    valueKey="jobDescription"
                    formData={formData}
                    setFormData={setFormData}
                    maxLength={1000}
                />

                <RichTextField
                    label={`${t("common.requirements")} *`}
                    valueKey="requirement"
                    formData={formData}
                    setFormData={setFormData}
                    maxLength={1000}
                />

                <div className="w-full skills-chips-wrapper">
                    <label className="block mb-1">
                        {t("common.requiredSkills")} *
                    </label>

                    <Chips
                        key={chipsKey}
                        placeholder={t("common.addSkillInstruction")}
                        value={formData.requiredSkills}
                        separator=","
                        onChange={(e) => {
                            const newSkills = e.value ?? [];
                            const allowedPattern = /^[a-zA-Z0-9\s!@#$%^&*()_+\-=\[\]{}|;:'",.<>?\/~`]*$/;
                            const validatedSkills = newSkills
                                .map((skill: string) => {
                                    const trimmedSkill = skill.trim();
                                    if (trimmedSkill === "" || !allowedPattern.test(trimmedSkill)) {
                                        return null;
                                    }
                                    return trimmedSkill;
                                })
                                .filter((skill: string | null) => skill !== null) as string[];

                            setFormData({ ...formData, requiredSkills: validatedSkills });
                        }}
                        className="w-full"
                    />
                    {formData.requiredSkills && formData.requiredSkills.some((skill: string) => skill.length > 500) && (
                        <small className="text-red-500 text-xs block mt-1">
                            Each skill must be 500 characters or less. Maximum character limit is 500.
                        </small>
                    )}
                </div>
            </div>

            <div className="flex justify-center gap-4 mt-4 mb-4">
                <div className="shadow-sm p-3 rounded-2xl flex gap-10 bg-white">
                    <Button
                        type="button"
                        label={t("common.clear")}
                        severity="secondary"
                        outlined
                        className="!bg-white !border !border-gray-300 !text-gray-700 !rounded-lg"
                        onClick={() => {
                            setFormData(INITIAL_FORM_STATE);
                            setChipsKey((k) => k + 1);
                        }}
                    />

                    <Button
                        type="submit"
                        label={t("common.save")}
                        className="!bg-[#007BFF]"
                        disabled={loading || !isFormValid()}
                    />
                </div>
            </div>
        </form>
    );
};

export default CreateUpdateJobRequest;
