import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Button } from "@/components/ui/Button";

describe("Button", () => {
  it("should render button with children", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole("button", { name: /click me/i })).toBeInTheDocument();
  });

  it("should apply primary variant by default", () => {
    render(<Button>Test</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("bg-amber-300");
  });

  it("should apply secondary variant", () => {
    render(<Button variant="secondary">Test</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("bg-neutral-900");
  });

  it("should apply outline variant", () => {
    render(<Button variant="outline">Test</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("bg-white");
  });

  it("should handle click events", async () => {
    const handleClick = jest.fn();
    const user = userEvent.setup();
    
    render(<Button onClick={handleClick}>Click me</Button>);
    const button = screen.getByRole("button");
    
    await user.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("should be disabled when disabled prop is true", () => {
    render(<Button disabled>Disabled</Button>);
    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
  });

  it("should apply custom className", () => {
    render(<Button className="custom-class">Test</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("custom-class");
  });

  it("should apply size classes", () => {
    const { rerender } = render(<Button size="sm">Small</Button>);
    expect(screen.getByRole("button")).toHaveClass("text-sm");

    rerender(<Button size="lg">Large</Button>);
    expect(screen.getByRole("button")).toHaveClass("text-lg");
  });
});

