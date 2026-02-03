import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TrashSvg from "../../../../../assets/icons/trash.svg";
import DownloadSvg from "../../../../../assets/icons/download.svg";
import uploadSvg from "../../../../../assets/icons/upload.svg";
import { useParams } from "react-router-dom";
import {
  deleteCandidateDocumentRequest,
  fetchCandidateDocumentsRequest,
  updateCandidateDocumentRequest,
} from "../../../../../store/reducers/candidateDocumentSlice";
import { ContentType, fileToBase64 } from "../../../../../services/common";
import CustomConfirmDialog from "../../../../../shared/components/custom-confirm-dialog/CustomConfirmDialog";
import type { RootState } from "../../../../../store/store";
import AtsLoader from "../../../../../shared/components/ats-loader/AtsLoader";
import EmptyState from "../../../../../shared/components/empty-state/EmptyState";
import { downloadDocumentById } from "../../../../../services/downloadService";
import type { CandidateInterface } from "../../../../../shared/interface/CandidateInterface";
import type { DocumentInterface } from "../../../../../shared/interface/DocumentInterface";
import { useTranslation } from "react-i18next";
import AtsPaginator from "../../../../../shared/components/ats-pagination/Pagination";

const DocumentsTab = () => {
  const dispatch = useDispatch();
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(10);

  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [fileLoading, setFileLoading] = useState<boolean>(false);
  const { candidateId } = useParams<{ candidateId: string }>();
  const [refreshToken, setRefreshToken] = useState(0);
  const { t } = useTranslation();
  const [deleteTarget, setDeleteTarget] = useState<{
    documentId: number;
  } | null>(null);

  const { documents, loading, totalCount, deleteSuccess, updateSuccess } =
    useSelector((state: RootState) => state.candidateDocuments);

  const { selectedCandidate, loading: candidateLoading } = useSelector(
    (state: RootState) => state.candidates
  );

  // Initialize state for pagination
  const filteredDocuments = documents ?? [];

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Function to fetch paginated documents openings
  // This function is called to fetch documents openings based on the current page and search term
  const fetchPaginatedDocuments = useCallback(
    (firstIndex: number, rowCount: number) => {
      if (!candidateId) return;
      const pageNumber = Math.floor(firstIndex / rowCount) + 1;
      const pageSize = rowCount;
      dispatch(
        fetchCandidateDocumentsRequest({ pageNumber, pageSize, candidateId })
      );
    },
    [dispatch, candidateId]
  );

  // Fetch on mount and when pagination changes
  useEffect(() => {
    fetchPaginatedDocuments(first, rows);
  }, [fetchPaginatedDocuments, first, rows, refreshToken]);

  // Fetch again only when delete / update is successful
  useEffect(() => {
    if (deleteSuccess || updateSuccess) {
      setFirst(0);
      setRefreshToken((prev) => prev + 1);
    }
  }, [deleteSuccess, updateSuccess]);

  // Handle page change
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onPageChange = (e: any) => {
    setFirst(e.first);
    setRows(e.rows);
  };

  // Handle file input change
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = e.target.files ? Array.from(e.target.files) : [];
    if (newFiles.length === 0) return;
    setFileLoading(true); // Start loading
    try {
      const base64Files = await Promise.all(
        newFiles.map(async (file) => {
          const base64 = await fileToBase64(file); // Pure base64 without prefix
          return {
            name: file.name,
            size: file.size,
            format: file.type,
            typeId: 5,
            base64,
          };
        })
      );
      const salaryAnnexure = {
        monthlyInputValue: selectedCandidate?.salaryAnnexure?.monthlyInputValue,
        annualCtcWords: selectedCandidate?.salaryAnnexure?.annualCtcWords,
        basicMonthly: selectedCandidate?.salaryAnnexure?.basicMonthly,
        basicAnnually: selectedCandidate?.salaryAnnexure?.basicAnnually,
        houseRentAllowanceMonthly:
          selectedCandidate?.salaryAnnexure?.houseRentAllowanceMonthly,
        houseRentAllowanceAnnually:
          selectedCandidate?.salaryAnnexure?.houseRentAllowanceAnnually,
        conveyanceAllowanceMonthly:
          selectedCandidate?.salaryAnnexure?.conveyanceAllowanceMonthly,
        conveyanceAllowanceAnnually:
          selectedCandidate?.salaryAnnexure?.conveyanceAllowanceAnnually,
        attireExpensesMonthly:
          selectedCandidate?.salaryAnnexure?.attireExpensesMonthly,
        attireExpensesAnnually:
          selectedCandidate?.salaryAnnexure?.attireExpensesAnnually,
        medicalAllowanceMonthly:
          selectedCandidate?.salaryAnnexure?.medicalAllowanceMonthly,
        medicalAllowanceAnnually:
          selectedCandidate?.salaryAnnexure?.medicalAllowanceAnnually,
        leaveTravelAllowanceMonthly:
          selectedCandidate?.salaryAnnexure?.leaveTravelAllowanceMonthly,
        leaveTravelAllowanceAnnually:
          selectedCandidate?.salaryAnnexure?.leaveTravelAllowanceAnnually,
        profPersuitExpenseMonthly:
          selectedCandidate?.salaryAnnexure?.profPersuitExpenseMonthly,
        profPersuitExpenseAnnually:
          selectedCandidate?.salaryAnnexure?.profPersuitExpenseAnnually,
        statutoryBonusMonthly:
          selectedCandidate?.salaryAnnexure?.statutoryBonusMonthly,
        statutoryBonusAnnually:
          selectedCandidate?.salaryAnnexure?.statutoryBonusAnnually,
        fixedAllowanceMonthly:
          selectedCandidate?.salaryAnnexure?.fixedAllowanceMonthly,
        fixedAllowanceAnnually:
          selectedCandidate?.salaryAnnexure?.fixedAllowanceAnnually,
        totalGrossMonthly: selectedCandidate?.salaryAnnexure?.totalGrossMonthly,
        totalGrossAnnually:
          selectedCandidate?.salaryAnnexure?.totalGrossAnnually,
        gratuityEmployerContributionMonthly:
          selectedCandidate?.salaryAnnexure
            ?.gratuityEmployerContributionMonthly,
        gratuityEmployerContributionAnnually:
          selectedCandidate?.salaryAnnexure
            ?.gratuityEmployerContributionAnnually,
        groupHealthInsuranceEmployerContributionMonthly:
          selectedCandidate?.salaryAnnexure
            ?.groupHealthInsuranceEmployerContributionMonthly,
        groupHealthInsuranceEmployerContributionAnnually:
          selectedCandidate?.salaryAnnexure
            ?.groupHealthInsuranceEmployerContributionAnnually,
        epfEmployerContributionMonthly:
          selectedCandidate?.salaryAnnexure?.epfEmployerContributionMonthly,
        epfEmployerContributionAnnually:
          selectedCandidate?.salaryAnnexure?.epfEmployerContributionAnnually,
        totalRetiralMonthly:
          selectedCandidate?.salaryAnnexure?.totalRetiralMonthly,
        totalRetiralAnnually:
          selectedCandidate?.salaryAnnexure?.totalRetiralAnnually,
        costToCompanyMonthly:
          selectedCandidate?.salaryAnnexure?.costToCompanyMonthly,
        costToCompanyAnnually:
          selectedCandidate?.salaryAnnexure?.costToCompanyAnnually,
      };

      const payload: CandidateInterface = {
        firstName: selectedCandidate?.firstName,
        lastName: selectedCandidate?.lastName,
        email: selectedCandidate?.email,
        mobile: selectedCandidate?.mobile,
        phone: selectedCandidate?.phone,
        fax: selectedCandidate?.fax,
        website: selectedCandidate?.website,
        secondaryEmail: selectedCandidate?.secondaryEmail,
        currencyId: selectedCandidate?.currencyId,
        street: selectedCandidate?.street,
        city: selectedCandidate?.city,
        province: selectedCandidate?.province,
        countryId: selectedCandidate?.countryId,
        postalCode: selectedCandidate?.postalCode,
        experience: selectedCandidate?.experience,
        qualificationId: selectedCandidate?.qualificationId,
        relevantExperience: selectedCandidate?.relevantExperience,
        currentEmployer: selectedCandidate?.currentEmployer,
        currentCtc: selectedCandidate?.currentCtc,
        currentSalary: selectedCandidate?.currentSalary,
        expectedCtc: selectedCandidate?.expectedCtc,
        isAlreadyAnApplicant: selectedCandidate?.isAlreadyAnApplicant,
        currentJobTitle: selectedCandidate?.currentJobTitle,
        noticePeriodDays: selectedCandidate?.noticePeriodDays,
        alternateOffer: selectedCandidate?.alternateOffer,
        currentLocation: selectedCandidate?.currentLocation,
        willingToWorkInTrivandrum: selectedCandidate?.willingToWorkInTrivandrum,
        expectedSalaryId: selectedCandidate?.expectedSalaryId,
        expectedDOJ: selectedCandidate?.expectedDOJ,
        skypeId: selectedCandidate?.skypeId,
        skillSet: selectedCandidate?.skillSet,
        candidateStatusId: selectedCandidate?.candidateStatusId,
        sourceId: selectedCandidate?.sourceId,
        candidateOwnerId: selectedCandidate?.candidateOwnerId,
        emailOptOut: selectedCandidate?.emailOptOut ?? false,
        salaryAnnexure,
        linkedin: selectedCandidate?.linkedin,
        facebook: selectedCandidate?.facebook,
        professionalDetails: selectedCandidate?.professionalDetails,
        educationalDetails: selectedCandidate?.educationalDetails,
        jobOpportunityId: selectedCandidate?.jobOpportunityId,
        documents: base64Files,
        candidateId: selectedCandidate?.candidateId,
      };
      dispatch(updateCandidateDocumentRequest(payload));
      e.target.value = "";
    } catch (error) {
      console.error("Error processing files:", error);
      setFileLoading(false);
    } finally {
      setFileLoading(false); // Stop loading
    }
  };

  // Handle button click to trigger file input
  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  // Handle file download
  const handleDownload = async (document: DocumentInterface) => {
    downloadDocumentById(document);
  };

  const deleteFilesConfirm = (documentId: number) => {
    setDeleteTarget({ documentId });
    setDeleteDialogVisible(true);
  };

  return (
    <div className="w-full px-5 pt-5 bg-white rounded-lg ">
      <CustomConfirmDialog
        title={t("common.deleteDocument")}
        subTitle={t("common.deleteConfirmation")}
        icon={TrashSvg}
        visible={deleteDialogVisible}
        onHide={() => setDeleteDialogVisible(false)}
        onConfirm={() => {
          if (!deleteTarget) return;
          dispatch(
            deleteCandidateDocumentRequest({
              documentFileId: deleteTarget?.documentId,
            })
          );
          setDeleteDialogVisible(false);
        }}
      />
      <div className="flex justify-between items-center mb-5 border-b border-[#F6F6F6] pb-2">
        <h2 className="text-lg font-semibold text-gray-900">
          {t("common.documents")}
        </h2>
        <button
          type="button"
          onClick={handleButtonClick}
          className="rounded-lg hover:bg-[#4279f9e8] px-2 py-1 cursor-pointer bg-[#4278F9] flex items-center gap-2 text-white"
          aria-label="Edit"
        >
          {t("common.upload")}
          <img src={uploadSvg} className="w-5 h-5" alt="upload" />
          <input
            type="file"
            accept=".pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
        </button>
      </div>
      <div className="min-w-[1024px]">
        {(loading || candidateLoading || fileLoading) && <AtsLoader />}
        {!loading && filteredDocuments?.length === 0 && (
          <div style={{ height: "calc(100vh - 384px)", overflowY: "auto" }}>
            <EmptyState />
          </div>
        )}
        {filteredDocuments.length > 0 && (
          <>
            <div className="grid grid-cols-[3fr_2fr_1fr] gap-4 items-center bg-[#F6F6F6] px-8 py-4 rounded-t-[10px]  relative z-20 ">
              <span className="font-medium">{t("common.description")}</span>
              <span className="font-medium">{t("common.type")}</span>
              <span className="flex justify-end px-10 h-full font-medium">
                {t("common.action")}
              </span>
            </div>
            {/* Scrollable Document List */}
            <div
              style={{ height: "calc(100vh - 478px)", overflowY: "auto" }}
              className="border border-[#EFEFEF] rounded-b-[10px] bg-[#F6F6F6] relative z-10"
            >
              <div className="grid grid-cols-1 gap-2 p-5">
                {filteredDocuments.map((doc) => (
                  <div
                    key={doc.documentFileId}
                    className="grid grid-cols-[3fr_2fr_1fr] items-center bg-white rounded-l-[10px] transition duration-200 ease-in-out shadow-md focus:outline-none min-h-16"
                  >
                    <div className="flex items-center gap-5 border-r border-[#EFEFEF] px-4 py-3 min-w-0">
                      <span className="font-semibold text-gray-800 truncate min-w-0 max-w-full">
                        {doc.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-5 border-r border-[#EFEFEF] px-4 py-3 h-full">
                      {ContentType(doc.format)}
                    </div>
                    <div className="flex justify-end gap-2 px-8 py-3 h-full">
                      <button
                        type="button"
                        className="flex items-center gap-2 text-gray-500 hover:text-gray-800 rounded-lg hover:bg-[#F6F6F6] p-2 cursor-pointer"
                        onClick={() => {
                          if (doc.documentFileId !== undefined) {
                            handleDownload(doc);
                          }
                        }}
                      >
                        <img
                          src={DownloadSvg}
                          className="w-5 h-5"
                          alt="Download"
                        />
                      </button>
                      {!doc?.isReferral && (
                        <button
                          type="button"
                          className="flex items-center gap-2 text-gray-500 hover:text-gray-800 rounded-lg hover:bg-[#F6F6F6] p-2 cursor-pointer"
                          onClick={() => {
                            if (doc.documentFileId !== undefined) {
                              deleteFilesConfirm(doc.documentFileId);
                            }
                          }}
                        >
                          <img
                            src={TrashSvg}
                            className="w-6 h-6"
                            alt="Delete"
                          />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Pagination */}
            <AtsPaginator
              first={first}
              rows={rows}
              totalCount={totalCount ?? 0}
              onPageChange={onPageChange}
              hasDocuments={filteredDocuments.length > 0}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default DocumentsTab;
