import { renderHook, act } from "@testing-library/react";

import { useCartStore } from "@/stores/useCartStore";
import { Wine } from "@/types/wine";

const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

describe("useCartStore", () => {
  beforeEach(() => {
    localStorageMock.clear();
    const { result } = renderHook(() => useCartStore());
    act(() => {
      result.current.clearCart();
    });
  });

  const createMockWine = (overrides?: Partial<Wine>): Wine => ({
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
    ...overrides,
  });

  it("should initialize with empty cart", () => {
    const { result } = renderHook(() => useCartStore());
    
    expect(result.current.items).toEqual([]);
    expect(result.current.totalItems).toBe(0);
    expect(result.current.totalAmount).toBe(0);
  });

  it("should add item to cart", () => {
    const { result } = renderHook(() => useCartStore());
    const wine = createMockWine();
    
    act(() => {
      result.current.addItem(wine, 2);
    });
    
    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].wine.id).toBe("1");
    expect(result.current.items[0].quantity).toBe(2);
    expect(result.current.totalItems).toBe(2);
  });

  it("should calculate final price with IVA", () => {
    const { result } = renderHook(() => useCartStore());
    const wine = createMockWine({ price: 1000, iva: 21 });
    
    act(() => {
      result.current.addItem(wine, 1);
    });
    
    expect(result.current.items[0].priceAtTimeOfAdd).toBe(1210);
    expect(result.current.totalAmount).toBe(1210);
  });

  it("should update quantity when adding same item", () => {
    const { result } = renderHook(() => useCartStore());
    const wine = createMockWine();
    
    act(() => {
      result.current.addItem(wine, 1);
      result.current.addItem(wine, 2);
    });
    
    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].quantity).toBe(3);
    expect(result.current.totalItems).toBe(3);
  });

  it("should remove item from cart", () => {
    const { result } = renderHook(() => useCartStore());
    const wine = createMockWine();
    
    act(() => {
      result.current.addItem(wine, 1);
      result.current.removeItem("1");
    });
    
    expect(result.current.items).toHaveLength(0);
    expect(result.current.totalItems).toBe(0);
  });

  it("should update item quantity", () => {
    const { result } = renderHook(() => useCartStore());
    const wine = createMockWine();
    
    act(() => {
      result.current.addItem(wine, 1);
      result.current.updateQuantity("1", 5);
    });
    
    expect(result.current.items[0].quantity).toBe(5);
    expect(result.current.totalItems).toBe(5);
  });

  it("should remove item when quantity is set to 0", () => {
    const { result } = renderHook(() => useCartStore());
    const wine = createMockWine();
    
    act(() => {
      result.current.addItem(wine, 1);
      result.current.updateQuantity("1", 0);
    });
    
    expect(result.current.items).toHaveLength(0);
  });

  it("should clear cart", () => {
    const { result } = renderHook(() => useCartStore());
    const wine1 = createMockWine({ id: "1" });
    const wine2 = createMockWine({ id: "2" });
    
    act(() => {
      result.current.addItem(wine1, 1);
      result.current.addItem(wine2, 2);
      result.current.clearCart();
    });
    
    expect(result.current.items).toHaveLength(0);
    expect(result.current.totalItems).toBe(0);
    expect(result.current.totalAmount).toBe(0);
  });

  it("should get item quantity", () => {
    const { result } = renderHook(() => useCartStore());
    const wine = createMockWine();
    
    act(() => {
      result.current.addItem(wine, 3);
    });
    
    expect(result.current.getItemQuantity("1")).toBe(3);
    expect(result.current.getItemQuantity("2")).toBe(0);
  });

  it("should toggle cart", () => {
    const { result } = renderHook(() => useCartStore());
    
    expect(result.current.isOpen).toBe(false);
    
    act(() => {
      result.current.toggleCart();
    });
    
    expect(result.current.isOpen).toBe(true);
    
    act(() => {
      result.current.toggleCart();
    });
    
    expect(result.current.isOpen).toBe(false);
  });

  it("should set shipping info", () => {
    const { result } = renderHook(() => useCartStore());
    
    act(() => {
      result.current.setShippingInfo({
        address: "Test Address 123",
        phone: "1234567890",
        postalCode: "1234",
      });
    });
    
    expect(result.current.shippingInfo.address).toBe("Test Address 123");
    expect(result.current.shippingInfo.phone).toBe("1234567890");
    expect(result.current.shippingInfo.postalCode).toBe("1234");
  });

  it("should show notification when adding item", () => {
    const { result } = renderHook(() => useCartStore());
    const wine = createMockWine({ marca: "Test Wine" });
    
    act(() => {
      result.current.addItem(wine, 2);
    });
    
    expect(result.current.showNotification).toBe(true);
    expect(result.current.notificationMessage).toContain("Test Wine");
    expect(result.current.notificationMessage).toContain("2");
  });
});

