import { render, screen } from "@testing-library/react";
import CloseLayout from "../close-layout/CloseLayout";
import { describe, it, expect } from "vitest";
import { MemoryRouter } from "react-router-dom";

describe("CloseLayout component", () => {
  it("renders the close button", () => {
    render(
      <MemoryRouter>
        <CloseLayout />
      </MemoryRouter>
    );
    expect(screen.getByRole("button")).toBeInTheDocument();
  });
});
