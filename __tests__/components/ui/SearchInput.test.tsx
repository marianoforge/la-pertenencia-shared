import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SearchInput } from "@/components/ui/SearchInput";

describe("SearchInput", () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it("should render with default placeholder", () => {
    render(<SearchInput value="" onChange={mockOnChange} />);
    expect(screen.getByPlaceholderText("Buscar vinos...")).toBeInTheDocument();
  });

  it("should render with custom placeholder", () => {
    render(
      <SearchInput
        value=""
        onChange={mockOnChange}
        placeholder="Custom placeholder"
      />,
    );
    expect(screen.getByPlaceholderText("Custom placeholder")).toBeInTheDocument();
  });

  it("should display current value", () => {
    render(<SearchInput value="test search" onChange={mockOnChange} />);
    expect(screen.getByDisplayValue("test search")).toBeInTheDocument();
  });

  it("should call onChange when user types", async () => {
    const user = userEvent.setup();
    render(<SearchInput value="" onChange={mockOnChange} />);

    const input = screen.getByRole("searchbox");
    await user.type(input, "test");

    expect(mockOnChange).toHaveBeenCalled();
    expect(mockOnChange).toHaveBeenLastCalledWith("t");
  });

  it("should apply custom className", () => {
    const { container } = render(
      <SearchInput value="" onChange={mockOnChange} className="custom-class" />,
    );
    expect(container.firstChild).toHaveClass("custom-class");
  });

  it("should have search input type", () => {
    render(<SearchInput value="" onChange={mockOnChange} />);
    const input = screen.getByRole("searchbox");
    expect(input).toHaveAttribute("type", "search");
  });
});

