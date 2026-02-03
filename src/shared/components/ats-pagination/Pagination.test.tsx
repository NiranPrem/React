import { render, screen, fireEvent } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, it, expect, vi } from "vitest";
import AtsPaginator from "./Pagination";

// Mock react-i18next
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key, // simply return the translation key
  }),
}));
// Mock PrimeReact components
vi.mock("primereact/paginator", () => {
  interface PaginatorMockProps {
    template: {
      CurrentPageReport?: (p: { first: number; last: number; totalRecords: number }) => ReactNode;
      RowsPerPageDropdown?: (p: { value: number; onChange: (e: unknown) => void }) => ReactNode;
    };
    first: number;
    rows: number;
    totalRecords: number;
    onPageChange: (e: { first: number; rows: number; page: number }) => void;
  }

  return {
    Paginator: ({ template, first, rows, totalRecords, onPageChange }: PaginatorMockProps) => (
      <div data-testid="paginator">
        <button
          data-testid="prev"
          onClick={() =>
            onPageChange({ first: first - rows, rows, page: 0 })
          }
        >
          Prev
        </button>

        {template.CurrentPageReport && (
          <div data-testid="report">
            {template.CurrentPageReport({
              first,
              last: first + rows,
              totalRecords,
            })}
          </div>
        )}

        {template.RowsPerPageDropdown && (
          <div data-testid="rpp">
            {template.RowsPerPageDropdown({
              value: rows,
              onChange: () => {},
            })}
          </div>
        )}
      </div>
    ),
  };
});


// Mock PrimeReact Dropdown
vi.mock("primereact/dropdown", () => ({
  Dropdown: ({ value }: { value?: string | number }) => (
    <select data-testid="dropdown">
      <option>{value}</option>
    </select>
  ),
}));

describe("AtsPaginator Component", () => {
  it("returns null when hasDocuments = false", () => {
    const { container } = render(
      <AtsPaginator
        first={0}
        rows={10}
        totalCount={100}
        onPageChange={() => {}}
        hasDocuments={false}
      />
    );

    expect(container.firstChild).toBeNull();
  });

  it("renders two paginator components when hasDocuments = true", () => {
    render(
      <AtsPaginator
        first={0}
        rows={10}
        totalCount={100}
        onPageChange={() => {}}
        hasDocuments={true}
      />
    );

    expect(screen.getAllByTestId("paginator")).toHaveLength(2);
  });

  it("calls onPageChange when paginator's Prev button is clicked", () => {
    const mockChange = vi.fn();

    render(
      <AtsPaginator
        first={10}
        rows={10}
        totalCount={100}
        onPageChange={mockChange}
        hasDocuments={true}
      />
    );

    fireEvent.click(screen.getAllByTestId("prev")[0]);

    expect(mockChange).toHaveBeenCalledWith({
      first: 0,
      rows: 10,
      page: 0,
    });
  });

  it("renders CurrentPageReport with correct formatted text", () => {
    render(
      <AtsPaginator
        first={0}
        rows={10}
        totalCount={50}
        onPageChange={() => {}}
        hasDocuments={true}
      />
    );

    const report = screen.getAllByTestId("report")[0];
    expect(report.textContent).toContain("0 - 10");
    expect(report.textContent).toContain("common.of");
    expect(report.textContent).toContain("50");
  });

  it("renders RowsPerPageDropdown and passes correct value", () => {
    render(
      <AtsPaginator
        first={0}
        rows={25}
        totalCount={100}
        onPageChange={() => {}}
        hasDocuments={true}
      />
    );

    const dropdown = screen.getAllByTestId("dropdown")[0];
    expect(dropdown.textContent).toBe("25");
  });
});
