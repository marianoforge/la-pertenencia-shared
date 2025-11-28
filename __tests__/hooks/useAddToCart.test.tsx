import { renderHook, act } from "@testing-library/react";

import { useAddToCart } from "@/hooks/useAddToCart";
import { useCartStore } from "@/stores/useCartStore";
import { Wine } from "@/types/wine";

jest.mock("@/stores/useCartStore");

const mockAddItem = jest.fn();
const mockUseCartStore = useCartStore as jest.MockedFunction<typeof useCartStore>;

describe("useAddToCart", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseCartStore.mockReturnValue({
      addItem: mockAddItem,
    } as any);
  });

  it("should initialize with default quantity", () => {
    const { result } = renderHook(() => useAddToCart());
    
    expect(result.current.quantity).toBe(1);
  });

  it("should initialize with custom initial quantity", () => {
    const { result } = renderHook(() => useAddToCart({ initialQuantity: 5 }));
    
    expect(result.current.quantity).toBe(5);
  });

  it("should increase quantity", () => {
    const { result } = renderHook(() => useAddToCart({ initialQuantity: 1 }));
    
    act(() => {
      result.current.increaseQuantity();
    });
    
    expect(result.current.quantity).toBe(2);
  });

  it("should not increase above max stock", () => {
    const { result } = renderHook(() => useAddToCart({ initialQuantity: 5 }));
    
    act(() => {
      result.current.increaseQuantity(5);
    });
    
    expect(result.current.quantity).toBe(5); // Should not exceed max
  });

  it("should decrease quantity", () => {
    const { result } = renderHook(() => useAddToCart({ initialQuantity: 5 }));
    
    act(() => {
      result.current.decreaseQuantity();
    });
    
    expect(result.current.quantity).toBe(4);
  });

  it("should not decrease below minimum", () => {
    const { result } = renderHook(() => useAddToCart({ initialQuantity: 1 }));
    
    act(() => {
      result.current.decreaseQuantity();
    });
    
    expect(result.current.quantity).toBe(1); // Should not go below 1
  });

  it("should reset quantity to initial value", () => {
    const { result } = renderHook(() => useAddToCart({ initialQuantity: 1 }));
    
    act(() => {
      result.current.increaseQuantity();
      result.current.increaseQuantity();
    });
    
    expect(result.current.quantity).toBe(3);
    
    act(() => {
      result.current.resetQuantity();
    });
    
    expect(result.current.quantity).toBe(1);
  });

  it("should add item to cart and reset quantity", () => {
    const mockWine: Wine = {
      id: "1",
      marca: "Test Wine",
      bodega: "Test Bodega",
      tipo: "Tinto",
      varietal: "Malbec",
      price: 1000,
      cost: 500,
      iva: 21,
      stock: 10,
      region: "Mendoza",
      vintage: 2023,
      alcohol: 14,
      image: "/test.jpg",
      featured: false,
      winery: "Test Winery",
      description: "Test description",
      maridaje: "Test maridaje",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const onSuccess = jest.fn();
    const { result } = renderHook(() => useAddToCart({ 
      initialQuantity: 2,
      onSuccess 
    }));
    
    act(() => {
      result.current.addToCart(mockWine);
    });
    
    expect(mockAddItem).toHaveBeenCalledWith(mockWine, 2);
    expect(onSuccess).toHaveBeenCalledWith(mockWine, 2);
    expect(result.current.quantity).toBe(2); // Reset to initial
  });
});

