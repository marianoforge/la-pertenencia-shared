import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ShippingForm } from "@/components/cart/ShippingForm";
import { ShippingInfo } from "@/types/cart";

describe("ShippingForm", () => {
  const mockShippingInfo: ShippingInfo = {
    address: "",
    phone: "",
    postalCode: "",
  };

  const mockOnShippingInfoChange = jest.fn();
  const mockOnPostalCodeChange = jest.fn();
  const mockOnCalculateShipping = jest.fn();

  beforeEach(() => {
    mockOnShippingInfoChange.mockClear();
    mockOnPostalCodeChange.mockClear();
    mockOnCalculateShipping.mockClear();
  });

  it("should render all form fields", () => {
    render(
      <ShippingForm
        shippingInfo={mockShippingInfo}
        postalCode=""
        onShippingInfoChange={mockOnShippingInfoChange}
        onPostalCodeChange={mockOnPostalCodeChange}
        onCalculateShipping={mockOnCalculateShipping}
      />,
    );

    expect(screen.getByLabelText(/dirección/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/teléfono/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/código postal/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /calcular envío/i })).toBeInTheDocument();
  });

  it("should display current shipping info values", () => {
    const shippingInfo: ShippingInfo = {
      address: "Test Address 123",
      phone: "+54 9 11 1234-5678",
      postalCode: "C1234ABC",
    };

    render(
      <ShippingForm
        shippingInfo={shippingInfo}
        postalCode="C1234ABC"
        onShippingInfoChange={mockOnShippingInfoChange}
        onPostalCodeChange={mockOnPostalCodeChange}
        onCalculateShipping={mockOnCalculateShipping}
      />,
    );

    expect(screen.getByDisplayValue("Test Address 123")).toBeInTheDocument();
    expect(screen.getByDisplayValue("+54 9 11 1234-5678")).toBeInTheDocument();
    expect(screen.getByDisplayValue("C1234ABC")).toBeInTheDocument();
  });

  it("should call onShippingInfoChange when address changes", async () => {
    const user = userEvent.setup();
    render(
      <ShippingForm
        shippingInfo={mockShippingInfo}
        postalCode=""
        onShippingInfoChange={mockOnShippingInfoChange}
        onPostalCodeChange={mockOnPostalCodeChange}
        onCalculateShipping={mockOnCalculateShipping}
      />,
    );

    const addressInput = screen.getByLabelText(/dirección/i);
    await user.type(addressInput, "New Address");

    expect(mockOnShippingInfoChange).toHaveBeenCalled();
    const allAddresses = mockOnShippingInfoChange.mock.calls
      .map((call) => call[0]?.address)
      .filter(Boolean);
    expect(allAddresses.join("")).toContain("New Address");
  });

  it("should call onShippingInfoChange when phone changes", async () => {
    const user = userEvent.setup();
    render(
      <ShippingForm
        shippingInfo={mockShippingInfo}
        postalCode=""
        onShippingInfoChange={mockOnShippingInfoChange}
        onPostalCodeChange={mockOnPostalCodeChange}
        onCalculateShipping={mockOnCalculateShipping}
      />,
    );

    const phoneInput = screen.getByLabelText(/teléfono/i);
    await user.type(phoneInput, "+54 9 11 1234-5678");

    expect(mockOnShippingInfoChange).toHaveBeenCalled();
    const allPhones = mockOnShippingInfoChange.mock.calls
      .map((call) => call[0]?.phone)
      .filter(Boolean);
    expect(allPhones.join("")).toContain("+54 9 11 1234-5678");
  });

  it("should call onPostalCodeChange when postal code changes", async () => {
    const user = userEvent.setup();
    render(
      <ShippingForm
        shippingInfo={mockShippingInfo}
        postalCode=""
        onShippingInfoChange={mockOnShippingInfoChange}
        onPostalCodeChange={mockOnPostalCodeChange}
        onCalculateShipping={mockOnCalculateShipping}
      />,
    );

    const postalCodeInput = screen.getByLabelText(/código postal/i);
    await user.type(postalCodeInput, "C1234");

    expect(mockOnPostalCodeChange).toHaveBeenCalled();
    const allPostalCodes = mockOnPostalCodeChange.mock.calls
      .map((call) => call[0])
      .filter(Boolean);
    expect(allPostalCodes.join("")).toContain("C1234");
  });

  it("should call onCalculateShipping when calculate button is clicked", async () => {
    const user = userEvent.setup();
    render(
      <ShippingForm
        shippingInfo={mockShippingInfo}
        postalCode="C1234"
        onShippingInfoChange={mockOnShippingInfoChange}
        onPostalCodeChange={mockOnPostalCodeChange}
        onCalculateShipping={mockOnCalculateShipping}
      />,
    );

    const calculateButton = screen.getByRole("button", { name: /calcular envío/i });
    await user.click(calculateButton);

    expect(mockOnCalculateShipping).toHaveBeenCalledTimes(1);
  });

  it("should mark all fields as required", () => {
    render(
      <ShippingForm
        shippingInfo={mockShippingInfo}
        postalCode=""
        onShippingInfoChange={mockOnShippingInfoChange}
        onPostalCodeChange={mockOnPostalCodeChange}
        onCalculateShipping={mockOnCalculateShipping}
      />,
    );

    const addressInput = screen.getByLabelText(/dirección/i);
    const phoneInput = screen.getByLabelText(/teléfono/i);
    const postalCodeInput = screen.getByLabelText(/código postal/i);

    expect(addressInput).toBeRequired();
    expect(phoneInput).toBeRequired();
    expect(postalCodeInput).toBeRequired();
  });
});

