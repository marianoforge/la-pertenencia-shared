import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Input } from "@/components/ui/Input";

describe("Input", () => {
  it("should render input without label", () => {
    render(<Input />);
    const input = screen.getByRole("textbox");
    expect(input).toBeInTheDocument();
  });

  it("should render input with label", () => {
    render(<Input label="Email" />);
    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("should handle user input", async () => {
    const user = userEvent.setup();
    render(<Input />);
    
    const input = screen.getByRole("textbox");
    await user.type(input, "test@example.com");
    
    expect(input).toHaveValue("test@example.com");
  });

  it("should apply default variant styles", () => {
    render(<Input />);
    const input = screen.getByRole("textbox");
    expect(input).toHaveClass("bg-white", "border-neutral-400");
  });

  it("should apply newsletter variant styles", () => {
    render(<Input variant="newsletter" />);
    const input = screen.getByRole("textbox");
    expect(input).toHaveClass("bg-transparent", "border-b");
    expect(input).toHaveClass("text-white");
  });

  it("should accept placeholder", () => {
    render(<Input placeholder="Enter email" />);
    expect(screen.getByPlaceholderText("Enter email")).toBeInTheDocument();
  });

  it("should be disabled when disabled prop is true", () => {
    render(<Input disabled />);
    const input = screen.getByRole("textbox");
    expect(input).toBeDisabled();
  });

  it("should apply custom className", () => {
    render(<Input className="custom-class" />);
    const input = screen.getByRole("textbox");
    expect(input.closest("div")).toHaveClass("custom-class");
  });
});

