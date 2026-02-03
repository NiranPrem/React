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
  DropdownField,
  InputTextField,
  RichTextField,
} from "../ats-inputs/Inputs";
import "./CreateUpdateScreening.css";
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
  updateInterviewRequest,
} from "../../../store/reducers/interviewSlice";
import type { Base64File } from "../../interface/AtsCommonInterface";

const CreateUpdateScreening = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    departments,
    users,
    interviewers,
    jobOpenings,
    loading: masterDataLoading,
    departmentId,
    interviewCandidates,
  } = useSelector((state: RootState) => state.masterData);

  const { selectedInterview, loading, success } =
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
  const [filteredInterviewer, setFilteredInterviewer] = useState<Attendees[]>(
    []
  );
  const [filteredOptionalAttendees, setFilteredOptionalAttendees] = useState<
    Attendees[]
  >([]);
  const [formData, setFormData] = useState<InterviewInterface>({
    postingTitleId: openingId ? Number(openingId) : undefined,
    candidateId: candidateId ? Number(candidateId) : undefined,
    interviewOwnerId: user?.userId,
  });
  const [commentsError, setCommentsError] = useState<string | null>(null);
  const [attachmentError, setAttachmentError] = useState<string | null>(null);
  const [isPostingTitleChanged, setIsPostingTitleChanged] = useState(false);

  const isCandidateDisabled = useMemo(() => {
    // Always disabled until posting title exists
    if (!formData.postingTitleId) return true;

    // Enabled ONLY if posting title was changed/selected by user
    return !isPostingTitleChanged;
  }, [formData.postingTitleId, isPostingTitleChanged]);

  // ⭐ ADDED: Validation State
  const [optionalAttendees, setOptionalAttendees] = useState<Attendees[]>([]);
  const MAX_FILES = 5;
  const MAX_FILE_SIZE_MB = 5;

  const validateAttachments = (files?: Base64File[]) => {
    // ✅ Attachments NOT mandatory
    if (!files || files.length === 0) return null;
    if (files.length > MAX_FILES) {
      return `Maximum ${MAX_FILES} attachments allowed`;
    }
    const oversizedFile = files.find(
      (file) => file.size > MAX_FILE_SIZE_MB * 1024 * 1024,
    );
    if (oversizedFile) {
      return `Each file size must be less than ${MAX_FILE_SIZE_MB} MB`;
    }
    return null;
  };

  const normalizedInterviewers = useMemo<Attendees[]>(
    () =>
      Array.isArray(interviewers)
        ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
        interviewers.map((u: any) => ({ code: u.value, name: u.label }))
        : [],
    [interviewers],
  );

  const normalizedUsers = useMemo<Attendees[]>(
    () =>
      Array.isArray(users)
        ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
        users.map((u: any) => ({ code: u.value, name: u.label }))
        : [],
    [users],
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
      }),
    );
  }, [dispatch, formData.postingTitleId]);

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
        comments: selectedInterview.comments,
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
        }));
      setOptionalAttendees(prefilledOptionalAttendees);
      updateForm(
        "optionalAttendeesIds",
        prefilledOptionalAttendees.map((a) => a.code),
      );
    }
  }, [selectedInterview, updateForm]);

  useEffect(() => {
    if (user?.userId && !selectedInterview) {
      setFormData((prev) => ({
        ...prev,
        interviewOwnerId: user?.userId,
      }));
    }

  }, [user?.userId]);


  useEffect(() => {
    if (formData.postingTitleId) {
      dispatch(
        fetchJobDepartmentRequest({ id: Number(formData.postingTitleId) }),
      );
    }
  }, [dispatch, formData.postingTitleId]);

  useEffect(() => {
    if (departmentId && formData.postingTitleId && !selectedInterview) {
      setFormData((prev) => ({
        ...prev,
        departmentId: Number(departmentId),
        interviewName: "Screening"
      }));
    }
  }, [departmentId, formData.postingTitleId]);

  useEffect(() => {
    if (success && !loading) {
      navigate(-1);
    }
  }, [success, loading, navigate]);

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
          ? [...normalizedInterviewers]
          : normalizedInterviewers.filter((a) =>
            a.name?.toLowerCase().startsWith(query),
          );
      setFilteredInterviewer(filtered);
    },
    [normalizedInterviewers],
  );

  const searchOptionalAttendees = useCallback(
    (event: AutoCompleteCompleteEvent) => {
      const query = event.query.trim().toLowerCase();
      const alreadySelectedIds = selectedInterviewer.map((i) => i.code);

      const availableUsers = normalizedUsers.filter(
        (u) => !alreadySelectedIds.includes(u.code)
      );

      const filtered =
        query.length === 0
          ? availableUsers
          : availableUsers.filter((a) =>
            a.name?.toLowerCase().includes(query)
          );
      setFilteredOptionalAttendees(filtered);
    },
    [normalizedUsers, selectedInterviewer]
  );

  const handleInterviewerChange = useCallback(
    (e: { value: Attendees[] }) => {
      const newSelected = e.value || [];
      setSelectedInterviewer(newSelected);
      updateForm(
        "interviewerIds",
        newSelected.map((i) => i.code),
      );
    },
    [updateForm],
  );

  const handleOptionalAttendeesChange = useCallback(
    (e: { value: Attendees[] }) => {
      const newSelected = e.value || [];
      setOptionalAttendees(newSelected);
      updateForm(
        "optionalAttendeesIds",
        newSelected.map((i) => i.code),
      );
    },
    [updateForm],
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // ⭐ ADDED: Block submission if invalid
    if (formData.interviewName && formData.interviewName.length > 50) {
      console.error("Name cannot exceed 50 characters");
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
      interviewOwnerId: formData.interviewOwnerId,
      comments: formData.comments,
      interviewerIds,
      optionalAttendeesIds,
      openingId: openingId ? Number(openingId) : undefined,
      departmentId: formData.departmentId,
      jobOpportunityId: formData.jobOpportunityId,
      interviewType: formData.interviewType,
      isScreening: true,
    };

    if (selectedInterview?.candidateId) {
      payload.interviewId = selectedInterview.interviewId;
      dispatch(updateInterviewRequest(payload));
    } else {
      dispatch(
        addInterviewRequest({
          ...payload,
          documents: [...(formData.otherFiles ?? [])],
        }),
      );
    }

  };

  const isFormValid = useMemo(
    () =>
      !!(
        formData.interviewName &&
        formData.postingTitleId &&
        formData.candidateId &&
        formData.interviewerIds?.length &&
        !commentsError
      ),
    [formData, commentsError],
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {(loading || masterDataLoading) && <AtsLoader />}

      <div className="space-y-4 py-5 px-4 bg-white rounded-2xl">
        <h2 className="text-lg font-semibold mb-2">Screening Information</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InputTextField
            label="Name"
            placeholder="Name"
            valueKey="interviewName"
            formData={formData}
            setFormData={setFormData}
            required
            max={50}
            disabled
          />

          <DropdownField
            label="Posting Title"
            valueKey="postingTitleId"
            options={jobOpenings}
            formData={formData}
            setFormData={(updater) => {
              setIsPostingTitleChanged(true); // ✅ user action
              setFormData(updater);
            }}
            required
            disabled
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
        </div>

        <div className="grid grid-cols-1">
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
              appendTo="self"
              forceSelection
            />
          </div>
        </div>

        {/* NEW: Optional Attendees */}
        <div className="grid grid-cols-1 mt-3">
          <div className="card p-fluid">
            <label className="block text-black mb-1">Optional Attendees</label>
            <AutoComplete
              id="interviews"
              field="name"
              placeholder="Search optional attendees"
              multiple
              value={optionalAttendees}
              suggestions={filteredOptionalAttendees}
              completeMethod={searchOptionalAttendees}
              onChange={handleOptionalAttendeesChange}
              appendTo="self"
              forceSelection
            />
          </div>
        </div>
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
            typeId={8}
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
                comments: "",
                interviewerIds: [],
                optionalAttendeesIds: [],
              });
              setSelectedInterviewer([]);
              setOptionalAttendees([]);
              setCommentsError(null);
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

export default CreateUpdateScreening;
