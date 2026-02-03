import { render, screen, fireEvent } from "@testing-library/react";
import CloseLayout from "./CloseLayout";
import { describe, it, expect, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";

// Mock useNavigate
const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("CloseLayout component", () => {
  it("renders with default title", () => {
    render(
      <MemoryRouter>
        <CloseLayout />
      </MemoryRouter>
    );
    expect(screen.getByText("No data found.")).toBeInTheDocument();
  });

  it("renders with custom title", () => {
    render(
      <MemoryRouter>
        <CloseLayout title="Custom Title" />
      </MemoryRouter>
    );
    expect(screen.getByText("Custom Title")).toBeInTheDocument();
  });

  it("calls navigate(-1) when close button is clicked & close = -1", () => {
    render(
      <MemoryRouter>
        <CloseLayout />
      </MemoryRouter>
    );

    const button = screen.getByRole("button");
    fireEvent.click(button);

    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  it("calls navigate with string path when close is a string", () => {
    render(
      <MemoryRouter>
        <CloseLayout close="/home" />
      </MemoryRouter>
    );

    const button = screen.getByRole("button");
    fireEvent.click(button);

    expect(mockNavigate).toHaveBeenCalledWith("/home");
  });
});
