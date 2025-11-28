import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CartItem } from "@/components/cart/CartItem";
import { CartItem as CartItemType } from "@/types/cart";
import { Wine } from "@/types/wine";

const mockWine: Wine = {
  id: "wine1",
  marca: "Test Wine",
  bodega: "Test Winery",
  price: 1000,
  iva: 21,
  stock: 10,
  image: "/test.jpg",
  tipo: "Tinto",
  varietal: "Malbec",
  region: "Mendoza",
  vintage: 2020,
  alcohol: 14,
  featured: false,
  description: "A test wine",
  maridaje: "Red meats",
  cost: 500,
  winery: "Test Winery",
  createdAt: "2023-01-01",
  updatedAt: "2023-01-01",
};

const mockCartItem: CartItemType = {
  wine: mockWine,
  quantity: 2,
  priceAtTimeOfAdd: 1210,
};

describe("CartItem", () => {
  const mockUpdateQuantity = jest.fn();
  const mockRemove = jest.fn();

  beforeEach(() => {
    mockUpdateQuantity.mockClear();
    mockRemove.mockClear();
  });

  it("should render wine information", () => {
    render(
      <CartItem
        item={mockCartItem}
        onUpdateQuantity={mockUpdateQuantity}
        onRemove={mockRemove}
      />,
    );

    expect(screen.getByText("Test Wine")).toBeInTheDocument();
    expect(screen.getByText(/Test Winery.*2020/)).toBeInTheDocument();
  });

  it("should display quantity", () => {
    render(
      <CartItem
        item={mockCartItem}
        onUpdateQuantity={mockUpdateQuantity}
        onRemove={mockRemove}
      />,
    );

    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("should call onUpdateQuantity when increasing quantity", async () => {
    const user = userEvent.setup();
    render(
      <CartItem
        item={mockCartItem}
        onUpdateQuantity={mockUpdateQuantity}
        onRemove={mockRemove}
      />,
    );

    const plusButton = screen.getAllByRole("button").find(
      (btn) => btn.textContent === "+",
    );
    expect(plusButton).toBeInTheDocument();

    await user.click(plusButton!);
    expect(mockUpdateQuantity).toHaveBeenCalledWith("wine1", 3);
  });

  it("should call onUpdateQuantity when decreasing quantity", async () => {
    const user = userEvent.setup();
    render(
      <CartItem
        item={mockCartItem}
        onUpdateQuantity={mockUpdateQuantity}
        onRemove={mockRemove}
      />,
    );

    const minusButton = screen.getAllByRole("button").find(
      (btn) => btn.textContent === "-",
    );
    expect(minusButton).toBeInTheDocument();

    await user.click(minusButton!);
    expect(mockUpdateQuantity).toHaveBeenCalledWith("wine1", 1);
  });

  it("should disable minus button when quantity is 1", () => {
    const singleItem: CartItemType = {
      ...mockCartItem,
      quantity: 1,
    };

    render(
      <CartItem
        item={singleItem}
        onUpdateQuantity={mockUpdateQuantity}
        onRemove={mockRemove}
      />,
    );

    const minusButton = screen.getAllByRole("button").find(
      (btn) => btn.textContent === "-",
    );
    expect(minusButton).toBeDisabled();
  });

  it("should disable plus button when quantity equals stock", () => {
    const maxStockItem: CartItemType = {
      ...mockCartItem,
      quantity: 10,
    };

    render(
      <CartItem
        item={maxStockItem}
        onUpdateQuantity={mockUpdateQuantity}
        onRemove={mockRemove}
      />,
    );

    const plusButton = screen.getAllByRole("button").find(
      (btn) => btn.textContent === "+",
    );
    expect(plusButton).toBeDisabled();
  });

  it("should call onRemove when remove button is clicked", async () => {
    const user = userEvent.setup();
    render(
      <CartItem
        item={mockCartItem}
        onUpdateQuantity={mockUpdateQuantity}
        onRemove={mockRemove}
      />,
    );

    const removeButton = screen.getByLabelText("Eliminar item");
    await user.click(removeButton);

    expect(mockRemove).toHaveBeenCalledWith("wine1");
  });

  it("should display total price correctly", () => {
    render(
      <CartItem
        item={mockCartItem}
        onUpdateQuantity={mockUpdateQuantity}
        onRemove={mockRemove}
      />,
    );

    const totalPrice = 1210 * 2;
    expect(screen.getByText(/\$\s?2\.420/)).toBeInTheDocument();
  });

  it("should display placeholder SVG when wine image is not available", () => {
    const itemWithoutImage: CartItemType = {
      ...mockCartItem,
      wine: { ...mockWine, image: "" },
    };

    render(
      <CartItem
        item={itemWithoutImage}
        onUpdateQuantity={mockUpdateQuantity}
        onRemove={mockRemove}
      />,
    );

    const svg = document.querySelector("svg");
    expect(svg).toBeInTheDocument();
    expect(screen.getByText("Test Wine")).toBeInTheDocument();
  });
});

