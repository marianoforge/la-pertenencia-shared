import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Dropdown } from "@/components/ui/Dropdown";

const mockOptions = [
  { value: "option1", label: "Option 1" },
  { value: "option2", label: "Option 2" },
  { value: "option3", label: "Option 3" },
];

describe("Dropdown", () => {
  const mockOnToggle = jest.fn();
  const mockOnChange = jest.fn();

  beforeEach(() => {
    mockOnToggle.mockClear();
    mockOnChange.mockClear();
  });

  it("should render with label", () => {
    render(
      <Dropdown
        label="Test Label"
        options={mockOptions}
        value=""
        isOpen={false}
        onToggle={mockOnToggle}
        onChange={mockOnChange}
      />,
    );

    expect(screen.getByText("Test Label")).toBeInTheDocument();
  });

  it("should display selected option label", () => {
    render(
      <Dropdown
        label="Test Label"
        options={mockOptions}
        value="option2"
        isOpen={false}
        onToggle={mockOnToggle}
        onChange={mockOnChange}
      />,
    );

    expect(screen.getByText("Option 2")).toBeInTheDocument();
  });

  it("should display placeholder when no value is selected", () => {
    render(
      <Dropdown
        label="Test Label"
        options={mockOptions}
        value=""
        isOpen={false}
        onToggle={mockOnToggle}
        onChange={mockOnChange}
        placeholder="Select an option"
      />,
    );

    expect(screen.getByText("Select an option")).toBeInTheDocument();
  });

  it("should call onToggle when button is clicked", async () => {
    const user = userEvent.setup();
    render(
      <Dropdown
        label="Test Label"
        options={mockOptions}
        value=""
        isOpen={false}
        onToggle={mockOnToggle}
        onChange={mockOnChange}
      />,
    );

    const button = screen.getByRole("button");
    await user.click(button);

    expect(mockOnToggle).toHaveBeenCalledTimes(1);
  });

  it("should display options when isOpen is true", () => {
    render(
      <Dropdown
        label="Test Label"
        options={mockOptions}
        value=""
        isOpen={true}
        onToggle={mockOnToggle}
        onChange={mockOnChange}
      />,
    );

    expect(screen.getByText("Option 1")).toBeInTheDocument();
    expect(screen.getByText("Option 2")).toBeInTheDocument();
    expect(screen.getByText("Option 3")).toBeInTheDocument();
  });

  it("should not display options when isOpen is false", () => {
    render(
      <Dropdown
        label="Test Label"
        options={mockOptions}
        value=""
        isOpen={false}
        onToggle={mockOnToggle}
        onChange={mockOnChange}
      />,
    );

    const options = screen.queryAllByText(/Option \d/);
    expect(options.length).toBe(0);
  });

  it("should call onChange and onToggle when option is clicked", async () => {
    const user = userEvent.setup();
    render(
      <Dropdown
        label="Test Label"
        options={mockOptions}
        value=""
        isOpen={true}
        onToggle={mockOnToggle}
        onChange={mockOnChange}
      />,
    );

    const option2 = screen.getByText("Option 2");
    await user.click(option2);

    expect(mockOnChange).toHaveBeenCalledWith("option2");
    expect(mockOnToggle).toHaveBeenCalledTimes(1);
  });

  it("should close dropdown when clicking outside", async () => {
    const user = userEvent.setup();
    render(
      <div>
        <div data-testid="outside">Outside</div>
        <Dropdown
          label="Test Label"
          options={mockOptions}
          value=""
          isOpen={true}
          onToggle={mockOnToggle}
          onChange={mockOnChange}
        />
      </div>,
    );

    const outside = screen.getByTestId("outside");
    await user.click(outside);

    expect(mockOnToggle).toHaveBeenCalled();
  });
});

