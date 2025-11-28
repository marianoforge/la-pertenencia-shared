import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AddToCartButton } from "@/components/ui/AddToCartButton";

describe("AddToCartButton", () => {
  const mockOnClick = jest.fn();

  beforeEach(() => {
    mockOnClick.mockClear();
  });

  it("should render with default text", () => {
    render(<AddToCartButton onClick={mockOnClick} />);
    expect(screen.getByText("agregar")).toBeInTheDocument();
  });

  it("should call onClick when clicked", async () => {
    const user = userEvent.setup();
    render(<AddToCartButton onClick={mockOnClick} />);

    const button = screen.getByRole("button");
    await user.click(button);

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it("should be disabled when disabled prop is true", () => {
    render(<AddToCartButton onClick={mockOnClick} disabled />);
    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
  });

  it("should show 'agotado' text when isOutOfStock is true", () => {
    render(<AddToCartButton onClick={mockOnClick} isOutOfStock />);
    expect(screen.getByText("agotado")).toBeInTheDocument();
    expect(screen.queryByText("agregar")).not.toBeInTheDocument();
  });

  it("should be disabled when isOutOfStock is true", () => {
    render(<AddToCartButton onClick={mockOnClick} isOutOfStock />);
    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
  });

  it("should apply custom className", () => {
    const { container } = render(
      <AddToCartButton onClick={mockOnClick} className="custom-class" />,
    );
    expect(container.firstChild).toHaveClass("custom-class");
  });

  it("should render with small size", () => {
    const { container } = render(
      <AddToCartButton onClick={mockOnClick} size="sm" />,
    );
    expect(container.firstChild).toHaveClass("px-3");
  });

  it("should render with medium size by default", () => {
    const { container } = render(<AddToCartButton onClick={mockOnClick} />);
    expect(container.firstChild).toHaveClass("px-4");
  });

  it("should render with large size", () => {
    const { container } = render(
      <AddToCartButton onClick={mockOnClick} size="lg" />,
    );
    expect(container.firstChild).toHaveClass("px-6");
  });
});

