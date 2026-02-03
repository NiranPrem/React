import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DownloadSvg from "../../../../../assets/icons/download.svg";
import type { RootState } from "../../../../../store/store";
import EmptyState from "../../../../../shared/components/empty-state/EmptyState";
import uploadSvg from "../../../../../assets/icons/upload.svg";
import { useParams } from "react-router-dom";
import { ContentType, fileToBase64 } from "../../../../../services/common";
import { downloadDocumentById } from "../../../../../services/downloadService";
import type { DocumentInterface } from "../../../../../shared/interface/DocumentInterface";
import AtsLoader from "../../../../../shared/components/ats-loader/AtsLoader";
import { useTranslation } from "react-i18next";
import AtsPaginator from "../../../../../shared/components/ats-pagination/Pagination";
import {
  fetchReferralResumeRequest,
  updateReferralResumeRequest,
} from "../../../../../store/reducers/referralResumeSlice";
import type { ReferralInterface } from "../../../../../shared/interface/ReferralInterface";

const ResumeTab = () => {
  const dispatch = useDispatch();
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(10);
  const { t } = useTranslation();
  const [fileLoading, setFileLoading] = useState<boolean>(false);
  const { referralId } = useParams<{ referralId: string }>();
  const [refreshToken, setRefreshToken] = useState(0);
  const { resumes, loading, totalCount, updateSuccess } = useSelector(
    (state: RootState) => state.referralResumes
  );

  const { selectedReferral, loading: referralLoading } = useSelector(
    (state: RootState) => state.referrals
  );

  // Initialize state for pagination
  const filteredResume = resumes ?? [];

  const fileInputRef = useRef<HTMLInputElement>(null);

  // This function is called to fetch Resume openings based on the current page and search term
  const fetchPaginatedResume = useCallback(
    (firstIndex: number, rowCount: number) => {
      if (!referralId) return;
      const pageNumber = Math.floor(firstIndex / rowCount) + 1;
      const pageSize = rowCount;
      dispatch(
        fetchReferralResumeRequest({ pageNumber, pageSize, referralId })
      );
    },
    [dispatch, referralId]
  );

  // Fetch on mount and when pagination changes
  useEffect(() => {
    fetchPaginatedResume(first, rows);
  }, [fetchPaginatedResume, first, rows, refreshToken]);

  // Fetch again only when delete / update is successful
  useEffect(() => {
    if (updateSuccess) {
      setFirst(0);
      setRefreshToken((prev) => prev + 1);
    }
  }, [updateSuccess]);

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
            typeId: 7,
            base64,
          };
        })
      );
      const payload: ReferralInterface = {
        jobOpportunityId: selectedReferral?.jobOpportunityId,
        firstName: selectedReferral?.firstName,
        lastName: selectedReferral?.lastName,
        email: selectedReferral?.email,
        mobile: selectedReferral?.mobile,
        currentEmployer: selectedReferral?.currentEmployer,
        currentJobTitle: selectedReferral?.currentJobTitle,
        relationshipId: selectedReferral?.relationshipId,
        noticePeriodId: selectedReferral?.noticePeriodId,
        notes: selectedReferral?.notes,
        createdDate: selectedReferral?.createdDate,
        documents: base64Files[0],
        referralId: selectedReferral?.referralId,
      };
      dispatch(updateReferralResumeRequest(payload));
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

  return (
    <div className="w-full px-5 pt-5 bg-white rounded-lg ">
      <div className="flex justify-between items-center mb-5 border-b border-[#F6F6F6] pb-2">
        <h2 className="text-lg font-semibold text-gray-900">
          {t("common.resume")}
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
        {(loading || referralLoading || fileLoading) && <AtsLoader />}
        {!loading && filteredResume?.length === 0 && (
          <div style={{ height: "calc(100vh - 384px)", overflowY: "auto" }}>
            <EmptyState />
          </div>
        )}
        {filteredResume.length > 0 && (
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
                {filteredResume.map((doc: DocumentInterface) => (
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
              hasDocuments={filteredResume.length > 0}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default ResumeTab;
