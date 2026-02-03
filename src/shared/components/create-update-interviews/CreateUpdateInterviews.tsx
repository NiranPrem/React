import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "primereact/button";
import {
    fetchJobDepartmentRequest,
    fetchMasterDataRequest,
    fetchMasterJobOpeningRequest,
    fetchUsersByRoleRequest,
    fetchInterviewCandidatesByJobOpportunityRequest,
    fetchUserDataRequest,
} from "../../../store/reducers/masterDataSlice";
import {
    DateField,
    DropdownField,
    InputTextField,
    RichTextField,
} from "../ats-inputs/Inputs";
import { RadioButton } from "primereact/radiobutton";
import "./CreateUpdateInterviews.css";
import { useNavigate, useParams } from "react-router-dom";
import CustomConfirmDialog from "../custom-confirm-dialog/CustomConfirmDialog";
import TrashSvg from "../../../assets/icons/trash.svg";
import FileUploadBlock from "../file-list/FileUploadBlock";
import type { RootState } from "../../../store/store";
import { useTranslation } from "react-i18next";
import AtsLoader from "../ats-loader/AtsLoader";
import type { InterviewInterface } from "../../interface/InterviewsInterface";
import {
    AutoComplete,
    type AutoCompleteCompleteEvent,
} from "primereact/autocomplete";
import type { Attendees } from "../../interface/EventInterface";
import {
    addInterviewRequest,
    generateLinkRequest,
    updateInterviewRequest,
} from "../../../store/reducers/interviewSlice";
import type { Base64File } from "../../interface/AtsCommonInterface";
import { Calendar } from "primereact/calendar";

const CreateUpdateInterviews = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const {
        departments,
        users,
        jobOpenings,
        loading: masterDataLoading,
        departmentId,
        interviewCandidates,
    } = useSelector((state: RootState) => state.masterData);
    const { selectedInterview, loading, success, generatedMeetingLink } =
        useSelector((state: RootState) => state.interviews);

    const updateForm = useCallback(
        (key: keyof InterviewInterface, value: unknown) =>
            setFormData((prev) => ({ ...prev, [key]: value })),
        []
    );

    const { user } = useSelector((state: RootState) => state.auth);

    const { openingId, candidateId } = useParams<{
        openingId: string;
        candidateId: string;
    }>();

    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<{
        type: "otherFiles";
        index: number;
    } | null>(null);
    const [selectedInterviewer, setSelectedInterviewer] = useState<Attendees[]>(
        []
    );
    const [selectedOptAttendees, setOptAttendees] = useState<Attendees[]>([]);
    const [filteredInterviewer, setFilteredInterviewer] = useState<Attendees[]>(
        []
    );
    const [formData, setFormData] = useState<InterviewInterface>({
        postingTitleId: openingId ? Number(openingId) : undefined,
        candidateId: candidateId ? Number(candidateId) : undefined,
        interviewOwnerId: user?.userId,
    });
    const [commentsError, setCommentsError] = useState<string | null>(null);
    const [attachmentError, setAttachmentError] = useState<string | null>(null);
    const [isPostingTitleChanged, setIsPostingTitleChanged] = useState(false);

    const isCandidateDisabled = useMemo(() => {
        if (!formData.postingTitleId) return true;
        return !isPostingTitleChanged;
    }, [formData.postingTitleId, isPostingTitleChanged]);

    const [dateError, setDateError] = useState<string | null>(null);
    const [optionalAttendees, setOptionalAttendees] = useState<Attendees[]>([]);
    const [interviewMode, setInterviewMode] = useState<"ONLINE" | "OFFLINE">(
        "OFFLINE"
    );

    const MAX_FILES = 5;
    const MAX_FILE_SIZE_MB = 5;

    const validateAttachments = (files?: Base64File[]) => {
        if (!files || files.length === 0) return null;
        if (files.length > MAX_FILES) {
            return `Maximum ${MAX_FILES} attachments allowed`;
        }
        const oversizedFile = files.find(
            (file) => file.size > MAX_FILE_SIZE_MB * 1024 * 1024
        );
        if (oversizedFile) {
            return `Each file size must be less than ${MAX_FILE_SIZE_MB} MB`;
        }
        return null;
    };

    const isEndAfterStart = (
        fromDate?: string | Date,
        fromTime?: string,
        toDate?: string | Date,
        toTime?: string
    ) => {
        if (!fromDate || !fromTime || !toDate || !toTime) return true;
        const [fh, fm] = fromTime.split(":").map(Number);
        const [th, tm] = toTime.split(":").map(Number);
        const start = new Date(fromDate);
        start.setHours(fh, fm, 0, 0);
        const end = new Date(toDate);
        end.setHours(th, tm, 0, 0);
        return end > start;
    };

    useEffect(() => {
        if (
            formData.fromDate &&
            formData.fromTime &&
            formData.toDate &&
            formData.toTime
        ) {
            if (
                isEndAfterStart(
                    formData.fromDate,
                    formData.fromTime,
                    formData.toDate,
                    formData.toTime
                ) === false
            ) {
                setDateError("To date & time must be greater than From date & time");
            } else {
                setDateError(null);
            }
        }
    }, [formData.fromDate, formData.fromTime, formData.toDate, formData.toTime]);

    const TIME_OPTIONS = useMemo(
        () =>
            Array.from({ length: 48 }, (_, i) => {
                const hour = Math.floor(i / 2);
                const minute = i % 2 === 0 ? "00" : "30";
                const timeString = `${String(hour).padStart(2, "0")}:${minute}`;
                return { label: timeString, value: timeString };
            }),
        []
    );

    const isPastTime = (date?: string | Date, time?: string) => {
        if (!date || !time) return false;
        const now = new Date();
        const selected = new Date(date);
        const [h, m] = time.split(":").map(Number);
        selected.setHours(h, m, 0, 0);
        return selected < now;
    };

    const fromTimeOptions = useMemo(() => {
        return TIME_OPTIONS.filter((t) => !isPastTime(formData.fromDate, t.value));
    }, [TIME_OPTIONS, formData.fromDate]);

    const toTimeOptions = useMemo(() => {
        return TIME_OPTIONS.filter((t) => {
            if (
                formData.fromDate &&
                formData.toDate &&
                new Date(formData.fromDate).toDateString() ===
                new Date(formData.toDate).toDateString() &&
                formData.fromTime
            ) {
                return t.value > formData.fromTime;
            }
            return !isPastTime(formData.toDate, t.value);
        });
    }, [TIME_OPTIONS, formData.fromDate, formData.toDate, formData.fromTime]);

    const normalizedUsers = useMemo<Attendees[]>(
        () =>
            Array.isArray(users)
                ? users.map((u: any) => ({
                    code: u.value,
                    name: u.label,
                    email: u.email,
                }))
                : [],
        [users]
    );

    useEffect(() => {
        dispatch(fetchMasterDataRequest());
        dispatch(fetchUserDataRequest());
        dispatch(fetchUsersByRoleRequest());
        dispatch(fetchMasterJobOpeningRequest());
    }, [dispatch]);

    useEffect(() => {
        if (!formData.postingTitleId) return;
        dispatch(
            fetchInterviewCandidatesByJobOpportunityRequest({
                jobOpportunityId: Number(formData.postingTitleId),
            })
        );
        if (!selectedInterview?.candidateId) {
            setFormData((prev) => ({
                ...prev,
                candidateId: undefined,
            }));
        }
    }, [dispatch, formData.postingTitleId, selectedInterview?.candidateId]);

    const formatTime = (date?: Date | string): string => {
        if (!date) return "00:00";
        const d = new Date(date);
        return `${String(d.getHours()).padStart(2, "0")}:${String(
            d.getMinutes()
        ).padStart(2, "0")}`;
    };

    const getPlainTextLength = (html?: string) => {
        if (!html) return 0;
        const div = document.createElement("div");
        div.innerHTML = html;
        return div.innerText.length;
    };

    useEffect(() => {
        if (selectedInterview) {
            setFormData({
                departmentId: selectedInterview.departmentId,
                interviewName: selectedInterview.interviewName,
                postingTitleId: selectedInterview.postingTitleId,
                candidateId: selectedInterview.candidateId,
                interviewOwnerId: selectedInterview.interviewOwnerId,
                fromDate: selectedInterview.fromDateTime,
                toDate: selectedInterview.toDateTime,
                fromTime: formatTime(selectedInterview.fromDateTime),
                toTime: formatTime(selectedInterview.toDateTime),
                comments: selectedInterview.comments,
                location: selectedInterview.location,
                meetingLink: selectedInterview.meetingLink,
                interviewId: selectedInterview.interviewId,
                jobOpportunityId: selectedInterview.jobOpportunityId,
                interviewType: selectedInterview.interviewType,
            });
        }
    }, [selectedInterview]);

    useEffect(() => {
        if (selectedInterview?.interviewers?.length) {
            const prefilledInterviewers = selectedInterview.interviewers.map((i) => ({
                code: i.value,
                name: i.label,
                email: (i as any).email || "",
            }));
            setSelectedInterviewer(prefilledInterviewers);
            updateForm("interviewerIds", prefilledInterviewers);
        }
    }, [selectedInterview, updateForm]);

    useEffect(() => {
        if (selectedInterview?.optionalAttendees?.length) {
            const prefilledOptionalAttendees =
                selectedInterview.optionalAttendees.map((i) => ({
                    code: i.value,
                    name: i.label,
                    email: (i as any).email || "",
                }));
            setOptionalAttendees(prefilledOptionalAttendees);
            updateForm(
                "optionalAttendeesIds",
                prefilledOptionalAttendees.map((a) => a.code)
            );
        }
    }, [selectedInterview, updateForm]);

    useEffect(() => {
        if (formData.postingTitleId) {
            dispatch(
                fetchJobDepartmentRequest({ id: Number(formData.postingTitleId) })
            );
        }
    }, [dispatch, formData.postingTitleId]);

    useEffect(() => {
        if (departmentId && formData.postingTitleId) {
            setFormData((prev) => ({
                ...prev,
                departmentId: Number(departmentId),
            }));
        }
    }, [departmentId, formData.postingTitleId]);

    useEffect(() => {
        if (success && !loading && !selectedInterview?.candidateId) {
            navigate(-1);
        }
    }, [success, loading, selectedInterview?.candidateId, navigate]);

    useEffect(() => {
        const length = getPlainTextLength(formData.comments);
        if (length > 500) {
            setCommentsError("Comments cannot exceed 500 characters");
        } else {
            setCommentsError(null);
        }
    }, [formData.comments]);

    const otherFilesConfirm = (index: number) => {
        setDeleteTarget({ type: "otherFiles", index });
        setDeleteDialogVisible(true);
    };

    const searchInterviewer = useCallback(
        (event: AutoCompleteCompleteEvent) => {
            const query = event.query.trim().toLowerCase();
            const filtered =
                query.length === 0
                    ? [...normalizedUsers]
                    : normalizedUsers.filter((a) =>
                        a.name?.toLowerCase().includes(query)
                    );
            setFilteredInterviewer(filtered);
        },
        [normalizedUsers]
    );

    const handleInterviewerChange = useCallback(
        (e: { value: Attendees[] }) => {
            const newSelected = e.value || [];
            setSelectedInterviewer(newSelected);
            updateForm(
                "interviewerIds",
                newSelected.map((i) => i.code)
            );
        },
        [updateForm]
    );

    const handleOptionalAttendeesChange = useCallback(
        (e: { value: Attendees[] }) => {
            const newSelected = e.value || [];
            setOptionalAttendees(newSelected);
            updateForm(
                "optionalAttendeesIds",
                newSelected.map((i) => i.code)
            );
        },
        [updateForm]
    );

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (dateError) {
            console.error(dateError);
            return;
        }
        if (formData.interviewName && formData.interviewName.length > 50) {
            console.error("Interview Name cannot exceed 50 characters");
            return;
        }
        if (formData.location && formData.location.length > 50) {
            console.error("Interview Location cannot exceed 50 characters");
            return;
        }

        if (
            !formData.fromDate ||
            !formData.toDate ||
            !formData.fromTime ||
            !formData.toTime
        ) {
            console.error("Missing required date/time fields");
            return;
        }
        if (getPlainTextLength(formData.comments) > 500) {
            console.error("Comments exceed 500 characters");
            return;
        }
        const attachmentValidationError = validateAttachments(formData.otherFiles);
        if (attachmentValidationError) {
            console.error(attachmentValidationError);
            setAttachmentError(attachmentValidationError);
            return;
        }

        const [startHour, startMinute] = formData.fromTime.split(":").map(Number);
        const [endHour, endMinute] = formData.toTime.split(":").map(Number);
        const start = new Date(formData.fromDate);
        start.setHours(startHour, startMinute, 0, 0);
        const end = new Date(formData.toDate);
        end.setHours(endHour, endMinute, 0, 0);

        const interviewerIds: number[] = (
            (formData.interviewerIds ?? []) as (number | Attendees)[]
        )
            .map((item) => (typeof item === "number" ? item : item.code))
            .filter((id): id is number => typeof id === "number");

        const optionalAttendeesIds: number[] = (
            (formData.optionalAttendeesIds ?? []) as (number | Attendees)[]
        )
            .map((item) => (typeof item === "number" ? item : item.code))
            .filter((id): id is number => typeof id === "number");
        const payload: InterviewInterface = {
            interviewName: formData.interviewName,
            postingTitleId: formData.postingTitleId,
            candidateId: formData.candidateId,
            fromDate: start.toISOString(),
            toDate: end.toISOString(),
            interviewOwnerId: formData.interviewOwnerId,
            comments: formData.comments,
            interviewerIds,
            optionalAttendeesIds,
            openingId: openingId ? Number(openingId) : undefined,
            departmentId: formData.departmentId,
            location: formData.location || "",
            meetingLink: formData.meetingLink,
            interviewId: formData.interviewId,
            jobOpportunityId: formData.jobOpportunityId,
            interviewType: formData.interviewType,
        };

        if (selectedInterview?.candidateId) {
            payload.interviewId = selectedInterview.interviewId;
            dispatch(updateInterviewRequest(payload));
        } else {
            dispatch(
                addInterviewRequest({
                    ...payload,
                    documents: [...(formData.otherFiles ?? [])],
                })
            );
        }
    };

    const isFormValid = useMemo(
        () =>
            !!(
                formData.interviewName &&
                formData.postingTitleId &&
                formData.candidateId &&
                formData.fromDate &&
                formData.fromTime &&
                formData.toDate &&
                formData.toTime &&
                formData.interviewerIds?.length &&
                !dateError &&
                !commentsError
            ),
        [formData, dateError, commentsError]
    );

    useEffect(() => {
        if (generatedMeetingLink && interviewMode === "ONLINE") {
            updateForm("meetingLink", generatedMeetingLink);
        }
    }, [generatedMeetingLink, interviewMode, updateForm]);

    // UPDATED ITEM TEMPLATE: FORCES EMAIL TO THE DOWN SIDE
    const userItemTemplate = (item: Attendees) => {
        return (
            <div className="flex align-items-center gap-3 py-2">
                {/* Avatar Circle - flex-shrink-0 ensures it stays a perfect circle */}
                <div
                    className="flex align-items-center justify-content-center"
                    style={{
                        minWidth: "32px",
                        width: "32px",
                        height: "32px",
                        backgroundColor: "#f0f2f5",
                        borderRadius: "50%",
                        flexShrink: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <i
                        className="pi pi-user text-600"
                        style={{
                            fontSize: "16px",
                            lineHeight: 1,
                            display: "block",
                        }}
                    />
                </div>

                {/* Text Container - display flex and flex-column with no extra margins */}
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                    }}
                >
                    <span
                        style={{
                            fontWeight: "600",
                            fontSize: "14px",
                            color: "#333",
                            lineHeight: "1.2",
                            display: "block",
                        }}
                    >
                        {item.name}
                    </span>
                    <span
                        style={{
                            fontSize: "12px",
                            color: "#666",
                            display: "block",
                            lineHeight: "1.2",
                            marginTop: "2px",
                        }}
                    >
                        {item.email}
                    </span>
                </div>
            </div>
        );
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            {(loading || masterDataLoading) && <AtsLoader />}

            <div className="space-y-4 py-5 px-4 bg-white rounded-2xl">
                <h2 className="text-lg font-semibold mb-2">Interview Information</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <InputTextField
                        label="Interview Name"
                        placeholder="Interview Name"
                        valueKey="interviewName"
                        formData={formData}
                        setFormData={setFormData}
                        required
                        max={50}
                    />

                    <DropdownField
                        label="Posting Title"
                        valueKey="postingTitleId"
                        options={jobOpenings}
                        formData={formData}
                        setFormData={(updater) => {
                            setIsPostingTitleChanged(true);
                            setFormData(updater);
                        }}
                        required
                    />

                    <DropdownField
                        label="Department Name"
                        valueKey="departmentId"
                        options={departments}
                        formData={formData}
                        setFormData={setFormData}
                        disabled
                    />

                    <DropdownField
                        label="Candidate Name"
                        valueKey="candidateId"
                        options={interviewCandidates}
                        formData={formData}
                        setFormData={setFormData}
                        disabled={isCandidateDisabled}
                        required
                    />

                    <DropdownField
                        label="Interview Owner"
                        valueKey="interviewOwnerId"
                        options={users}
                        formData={formData}
                        setFormData={setFormData}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <DateField
                            label="From"
                            valueKey="fromDate"
                            formData={formData}
                            setFormData={setFormData}
                            required
                            minDate={new Date()}
                        />
                        <DropdownField
                            label="From Time"
                            valueKey="fromTime"
                            options={fromTimeOptions}
                            formData={formData}
                            setFormData={setFormData}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <DateField
                            label="To"
                            valueKey="toDate"
                            formData={formData}
                            setFormData={setFormData}
                            required
                            minDate={
                                formData.fromDate ? new Date(formData.fromDate) : new Date()
                            }
                        />
                        <DropdownField
                            label="To Time"
                            valueKey="toTime"
                            options={toTimeOptions}
                            formData={formData}
                            setFormData={setFormData}
                            required
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 mt-3">
                    <div className="card p-fluid">
                        <label htmlFor="interviews" className="block text-black mb-1">
                            Interviewer(s) *
                        </label>
                        <AutoComplete
                            id="interviews"
                            field="name"
                            placeholder="Search interviewer"
                            multiple
                            value={selectedInterviewer}
                            suggestions={filteredInterviewer}
                            completeMethod={searchInterviewer}
                            onChange={handleInterviewerChange}
                            itemTemplate={userItemTemplate}
                            appendTo="self"
                            forceSelection
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 mt-3">
                    <div className="card p-fluid">
                        <label className="block text-black mb-1">Optional Attendees</label>
                        <AutoComplete
                            id="optional-attendees"
                            field="name"
                            placeholder="Search optional attendees"
                            multiple
                            value={optionalAttendees}
                            suggestions={filteredInterviewer}
                            completeMethod={searchInterviewer}
                            onChange={handleOptionalAttendeesChange}
                            itemTemplate={userItemTemplate}
                            appendTo="self"
                            forceSelection
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 mt-3">
                    <label className="block text-black mb-1">Interview Mode</label>
                    <div className="flex gap-6">
                        <div className="flex items-center gap-2">
                            <RadioButton
                                inputId="modeOffline"
                                name="interviewMode"
                                value="OFFLINE"
                                onChange={() => {
                                    setInterviewMode("OFFLINE");
                                    updateForm("interviewType", "OFFLINE");
                                    updateForm("meetingLink", undefined);
                                }}
                                checked={interviewMode === "OFFLINE"}
                            />
                            <label htmlFor="modeOffline" className="cursor-pointer">
                                Face to Face
                            </label>
                        </div>
                        <div className="flex items-center gap-2">
                            <RadioButton
                                inputId="modeOnline"
                                name="interviewMode"
                                value="ONLINE"
                                onChange={(e) => {
                                    if (interviewMode === "ONLINE") return;
                                    setInterviewMode("ONLINE");
                                    updateForm("interviewType", "ONLINE");
                                    updateForm("location", undefined);
                                    dispatch(
                                        generateLinkRequest({
                                            subject: formData.interviewName ?? "Interview",
                                            startTime: new Date().toISOString(),
                                            endTime: new Date(Date.now() + 30 * 60000).toISOString(),
                                            attendeeEmails: [],
                                        } as any)
                                    );
                                }}
                                checked={interviewMode === "ONLINE"}
                            />
                            <label htmlFor="modeOnline" className="cursor-pointer">
                                Online
                            </label>
                        </div>
                    </div>
                </div>
                {interviewMode === "ONLINE" && (
                    <InputTextField
                        label="Teams Meeting Link"
                        valueKey="meetingLink"
                        formData={formData}
                        setFormData={setFormData}
                        disabled={false}
                    />
                )}
                {interviewMode === "OFFLINE" && (
                    <InputTextField
                        label="Interview Location"
                        valueKey="location"
                        formData={formData}
                        setFormData={setFormData}
                        max={50}
                    />
                )}
            </div>
            <div className="space-y-6 py-5 px-4 bg-white rounded-2xl">
                <h2 className="text-lg font-semibold mb-2">Other Information</h2>
                <RichTextField
                    label="Comments"
                    valueKey="comments"
                    formData={formData}
                    setFormData={setFormData}
                />
                {commentsError && (
                    <p className="text-red-500 text-sm mt-1">{commentsError}</p>
                )}
            </div>
            {!selectedInterview?.candidateId && (
                <div className="space-y-4 py-5 px-4 bg-white rounded-2xl">
                    <CustomConfirmDialog
                        title={t("common.deleteAttachment")}
                        subTitle={t("common.addedDetailWillBeDeleted")}
                        icon={TrashSvg}
                        visible={deleteDialogVisible}
                        onHide={() => setDeleteDialogVisible(false)}
                        onConfirm={() => {
                            if (!deleteTarget) return;
                            const updated = [...(formData.otherFiles || [])];
                            updated.splice(deleteTarget.index, 1);
                            updateForm("otherFiles", updated);
                            setDeleteDialogVisible(false);
                        }}
                    />
                    <h2 className="text-lg font-semibold mb-2">
                        {t("common.attachmentInformation")}
                    </h2>
                    <FileUploadBlock
                        label={t("common.others")}
                        inputId="otherUpload"
                        files={formData.otherFiles || []}
                        onFilesChange={(newFiles) => {
                            const error = validateAttachments(newFiles);
                            if (error) {
                                setAttachmentError(error);
                                return; // ⛔ block invalid update
                            }
                            setAttachmentError(null);
                            updateForm("otherFiles", newFiles);
                        }}
                        onConfirm={otherFilesConfirm}
                        typeId={6}
                    />
                    {attachmentError && (
                        <p className="text-red-500 text-sm mt-1">{attachmentError}</p>
                    )}
                </div>
            )}
            <div className="flex justify-center gap-4 mt-4 mb-4">
                <div className="shadow-sm p-3 rounded-2xl flex gap-10 bg-white">
                    <Button
                        type="button"
                        label={t("common.clear")}
                        severity="secondary"
                        outlined
                        className="!bg-white !border !border-gray-300 !text-gray-700 !rounded-lg"
                        onClick={() => {
                            setFormData({
                                interviewName: "",
                                postingTitleId: openingId ? Number(openingId) : undefined,
                                candidateId: candidateId ? Number(candidateId) : undefined,
                                interviewOwnerId: user?.userId,
                                fromDate: "",
                                toDate: "",
                                fromTime: "",
                                toTime: "",
                                comments: "",
                            });
                            setSelectedInterviewer([]);
                            setOptionalAttendees([]);
                        }}
                    />
                    <Button
                        type="submit"
                        label={t("common.save")}
                        className="!bg-[#007BFF]"
                        disabled={loading || !isFormValid}
                    />
                </div>
            </div>
        </form>
    );
};

export default CreateUpdateInterviews;
