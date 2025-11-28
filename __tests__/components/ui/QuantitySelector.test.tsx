import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { QuantitySelector } from "@/components/ui/QuantitySelector";

describe("QuantitySelector", () => {
  it("should render with initial value", () => {
    const handleChange = jest.fn();
    render(<QuantitySelector value={5} onChange={handleChange} />);
    
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("should increase quantity when plus button is clicked", async () => {
    const handleChange = jest.fn();
    const user = userEvent.setup();
    
    render(<QuantitySelector value={1} onChange={handleChange} />);
    
    const plusButton = screen.getByRole("button", { name: /\+/ });
    await user.click(plusButton);
    
    expect(handleChange).toHaveBeenCalledWith(2);
  });

  it("should decrease quantity when minus button is clicked", async () => {
    const handleChange = jest.fn();
    const user = userEvent.setup();
    
    render(<QuantitySelector value={5} onChange={handleChange} />);
    
    const minusButton = screen.getByRole("button", { name: /-/ });
    await user.click(minusButton);
    
    expect(handleChange).toHaveBeenCalledWith(4);
  });

  it("should not decrease below min value", async () => {
    const handleChange = jest.fn();
    const user = userEvent.setup();
    
    render(<QuantitySelector value={1} min={1} onChange={handleChange} />);
    
    const minusButton = screen.getByRole("button", { name: /-/ });
    expect(minusButton).toBeDisabled();
    
    await user.click(minusButton);
    expect(handleChange).not.toHaveBeenCalled();
  });

  it("should not increase above max value", async () => {
    const handleChange = jest.fn();
    const user = userEvent.setup();
    
    render(<QuantitySelector value={99} max={99} onChange={handleChange} />);
    
    const plusButton = screen.getByRole("button", { name: /\+/ });
    expect(plusButton).toBeDisabled();
    
    await user.click(plusButton);
    expect(handleChange).not.toHaveBeenCalled();
  });

  it("should respect custom min and max values", async () => {
    const handleChange = jest.fn();
    const user = userEvent.setup();
    
    const { rerender } = render(
      <QuantitySelector value={10} min={5} max={15} onChange={handleChange} />
    );
    
    const minusButton = screen.getAllByRole("button").find(
      (btn) => btn.textContent === "-"
    )!;
    
    await user.click(minusButton);
    expect(handleChange).toHaveBeenCalledWith(9);
    
    handleChange.mockClear();
    rerender(
      <QuantitySelector value={15} min={5} max={15} onChange={handleChange} />
    );
    
    const newPlusButton = screen.getAllByRole("button").find(
      (btn) => btn.textContent === "+"
    )!;
    expect(newPlusButton).toBeDisabled();
  });
});

