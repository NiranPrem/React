import React, { useState, useEffect } from "react";
import UploadSvg from "../../../assets/icons/upload-with-gray.svg";
import FileList from "./FileList";
import type { Base64File } from "../../interface/AtsCommonInterface";
import AtsLoader from "../ats-loader/AtsLoader";
import { useTranslation } from "react-i18next";

type FileUploadBlockProps = {
  label: string;
  inputId: string;
  files: Base64File[];
  onFilesChange: (newFiles: Base64File[]) => void;
  onConfirm: (index: number) => void;
  typeId?: number;
  required?: boolean;
  maxFileSize?: number; // bytes
  maxFileSizeMessage?: string;
  maxFileCount?: number;
  maxFileCountMessage?: string;
  showError?: boolean;
};

const FileUploadBlock: React.FC<FileUploadBlockProps> = ({
  label,
  inputId,
  files,
  onFilesChange,
  onConfirm,
  typeId,
  required,
  maxFileSize,
  maxFileSizeMessage,
  maxFileCount,
  maxFileCountMessage,
  showError = false,
}) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // ... (fileToBase64 remains same)

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (typeof reader.result === "string") {
          // Remove the data URL prefix (everything before and including the comma)
          const base64 = reader.result.split(",")[1];
          resolve(base64);
        } else {
          reject(new Error("Failed to read file as base64"));
        }
      };
      reader.onerror = (error) => {
        let message: string;
        if (error instanceof Error) {
          message = error.message;
        } else if (typeof error === "object" && error !== null) {
          message = JSON.stringify(error);
        } else {
          message = String(error);
        }
        reject(new Error(message));
      };
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = e.target.files ? Array.from(e.target.files) : [];
    if (newFiles.length === 0) return;
    setLoading(true); // Start loading
    setError(null); // Clear previous errors

    if (maxFileCount && files.length + newFiles.length > maxFileCount) {
      setError(maxFileCountMessage || "File count exceeded.");
      setLoading(false);
      e.target.value = "";
      return;
    }

    try {
      const validFiles: File[] = [];
      for (const file of newFiles) {
        if (maxFileSize && file.size > maxFileSize) {
          setError(
            maxFileSizeMessage ||
            `Max file size ${maxFileSize / (1024 * 1024)} MB each`
          );
          setLoading(false);
          return; // Stop processing if any file is too large
        }
        validFiles.push(file);
      }

      const base64Files = await Promise.all(
        validFiles.map(async (file) => {
          const base64 = await fileToBase64(file); // Pure base64 without prefix
          return {
            name: file.name,
            size: file.size,
            format: file.type,
            typeId: typeId,
            base64,
          };
        })
      );
      onFilesChange([...files, ...base64Files]);
      e.target.value = "";
    } catch (error) {
      console.error("Error processing files:", error);
      setLoading(false);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  useEffect(() => {
    if (files.length === 0) {
      setError(null);
    }
  }, [files]);

  return (
    <div className="w-full">
      {loading && <AtsLoader />}
      <label htmlFor={inputId} className="block mb-1">
        {label}
      </label>
      <div className="flex gap-2 items-start">
        {/* Upload Box */}
        <div
          className={`border border-dashed rounded-lg p-2 cursor-pointer min-w-[170px] ${showError && required && files.length === 0
            ? "border-red-500"
            : "border-gray-300"
            } hover:border-gray-400`}
        >
          <input
            type="file"
            id={inputId}
            className="hidden"
            multiple
            accept=".pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={handleFileChange}
          />
          <label
            htmlFor={inputId}
            className="flex gap-2 items-center justify-center cursor-pointer text-md font-semibold"
          >
            <img src={UploadSvg} alt="upload icon" className="w-10 h-10" />{" "}
            {t("common.clickToUpload")}
          </label>
        </div>
        {/* File List Chips */}
        {files && files.length > 0 && (
          <FileList File={files} Confirm={onConfirm} />
        )}
      </div>
      {error && (
        <small className="text-red-500 text-xs mt-1 block">{error}</small>
      )}
    </div>
  );
};

export default FileUploadBlock;
