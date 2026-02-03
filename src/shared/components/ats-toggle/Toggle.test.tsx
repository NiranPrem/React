import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ToggleSegment from "./Toggle";

describe("ToggleSegment component", () => {
  it("renders both labels", () => {
    render(
      <ToggleSegment
        value="0"
        onChange={() => {}}
        labelOne="Option A"
        labelTwo="Option B"
      />
    );

    expect(screen.getByText("Option A")).toBeInTheDocument();
    expect(screen.getByText("Option B")).toBeInTheDocument();
  });

  it("applies active styles when value = 0", () => {
    render(
      <ToggleSegment
        value="0"
        onChange={() => {}}
        labelOne="Left"
        labelTwo="Right"
      />
    );

    const leftBtn = screen.getByText("Left");
    const rightBtn = screen.getByText("Right");

    expect(leftBtn.className).toContain("bg-[#4278F9]");
    expect(rightBtn.className).not.toContain("bg-[#4278F9]");
  });

  it("applies active styles when value = 1", () => {
    render(
      <ToggleSegment
        value="1"
        onChange={() => {}}
        labelOne="Left"
        labelTwo="Right"
      />
    );

    const leftBtn = screen.getByText("Left");
    const rightBtn = screen.getByText("Right");

    expect(rightBtn.className).toContain("bg-[#4278F9]");
    expect(leftBtn.className).not.toContain("bg-[#4278F9]");
  });

  it("calls onChange('0') when clicking labelOne", () => {
    const mockOnChange = vi.fn();

    render(
      <ToggleSegment
        value="1"
        onChange={mockOnChange}
        labelOne="Left"
        labelTwo="Right"
      />
    );

    fireEvent.click(screen.getByText("Left"));

    expect(mockOnChange).toHaveBeenCalledWith("0");
  });

  it("calls onChange('1') when clicking labelTwo", () => {
    const mockOnChange = vi.fn();

    render(
      <ToggleSegment
        value="0"
        onChange={mockOnChange}
        labelOne="Left"
        labelTwo="Right"
      />
    );

    fireEvent.click(screen.getByText("Right"));

    expect(mockOnChange).toHaveBeenCalledWith("1");
  });
});
