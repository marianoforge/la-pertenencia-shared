import React from "react";
import { render, screen } from "@testing-library/react";
import { PriceDisplay } from "@/components/ui/PriceDisplay";

describe("PriceDisplay", () => {
  it("should render price with default size", () => {
    render(<PriceDisplay price={1000} />);
    expect(screen.getByText(/\$\s?1\.000/)).toBeInTheDocument();
  });

  it("should render price with small size", () => {
    const { container } = render(<PriceDisplay price={1000} size="sm" />);
    expect(container.firstChild).toHaveClass("text-xl");
  });

  it("should render price with medium size", () => {
    const { container } = render(<PriceDisplay price={1000} size="md" />);
    expect(container.firstChild).toHaveClass("text-2xl");
  });

  it("should render price with large size", () => {
    const { container } = render(<PriceDisplay price={1000} size="lg" />);
    expect(container.firstChild).toHaveClass("text-3xl");
  });

  it("should apply custom className", () => {
    const { container } = render(
      <PriceDisplay price={1000} className="custom-class" />,
    );
    expect(container.firstChild).toHaveClass("custom-class");
  });

  it("should format large prices correctly", () => {
    render(<PriceDisplay price={1234567} />);
    expect(screen.getByText(/\$\s?1\.234\.567/)).toBeInTheDocument();
  });

  it("should handle zero price", () => {
    render(<PriceDisplay price={0} />);
    expect(screen.getByText(/\$\s?0/)).toBeInTheDocument();
  });
});

