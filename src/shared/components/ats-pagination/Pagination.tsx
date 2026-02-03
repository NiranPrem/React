import { useRef } from "react";
import { Dropdown } from "primereact/dropdown";
import { Paginator } from "primereact/paginator";
import type { PaginatorPageChangeEvent } from "primereact/paginator";
import { dropdownOptions } from "../../../services/common";
import { useTranslation } from "react-i18next";

interface DocumentsPaginatorProps {
  first: number;
  rows: number;
  totalCount: number;
  onPageChange: (e: PaginatorPageChangeEvent) => void;
  hasDocuments: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const RowsPerPageDropdown = (options: any) => {
  const { t } = useTranslation();
  return (
    <span className="mx-2 text-gray-700">
      {t("common.resultPerPage")}
      <Dropdown
        value={options.value}
        options={dropdownOptions}
        onChange={options.onChange}
        className="inline-block"
      />
    </span>
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CurrentPageReport = (options: any) => {
  const { t } = useTranslation();
  return (
    <span className="text-gray-700 text-sm w-[140px] text-center">
      {options.first} - {options.last} {t("common.of")} {options.totalRecords}
    </span>
  );
};

const paginatorTemplate1 = {
  RowsPerPageDropdown,
  CurrentPageReport,
};

// Pagination for listing
const AtsPaginator = ({
  first,
  rows,
  totalCount,
  onPageChange,
  hasDocuments,
}: DocumentsPaginatorProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const handlePageChange = (e: PaginatorPageChangeEvent) => {
    onPageChange(e);

    window.scrollTo({ top: 0, behavior: "auto" });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    const main = document.querySelector("main");
    if (main) main.scrollTop = 0;

    if (containerRef.current) {
      let element: HTMLElement | null = containerRef.current.parentElement;
      while (element) {
        const style = window.getComputedStyle(element);
        if (style.overflowY === "auto" || style.overflowY === "scroll") {
          element.scrollTop = 0;
          break;
        }
        element = element.parentElement;
      }

      const parent = containerRef.current.parentElement;
      if (parent) {
        Array.from(parent.children).forEach((child) => {
          if (child instanceof HTMLElement && child !== containerRef.current) {
            const style = window.getComputedStyle(child);
            if (style.overflowY === "auto" || style.overflowY === "scroll") {
              child.scrollTop = 0;
            }
          }
        });
      }
    }
  };

  return (
    <div ref={containerRef} className="pages flex justify-between items-center">
      <Paginator
        template={{
          layout: "PrevPageLink PageLinks NextPageLink CurrentPageReport",
          CurrentPageReport: paginatorTemplate1.CurrentPageReport,
        }}
        first={first}
        rows={rows}
        totalRecords={totalCount}
        onPageChange={handlePageChange}
      />
      <Paginator
        template={{
          layout: "RowsPerPageDropdown CurrentPageReport",
          RowsPerPageDropdown: paginatorTemplate1.RowsPerPageDropdown,
        }}
        first={first}
        rows={rows}
        totalRecords={totalCount}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default AtsPaginator;
