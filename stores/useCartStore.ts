import { create } from "zustand";
import { persist } from "zustand/middleware";

import { Wine } from "@/types/wine";
import { CartItem, CartState, CartActions, ShippingInfo } from "@/types/cart";
import { CART_NOTIFICATION_DURATION } from "./constants";

interface CartStore extends CartState, CartActions {
  showNotification: boolean;
  notificationMessage: string;
  setNotification: (message: string) => void;
  hideNotification: () => void;
}

const calculateFinalPrice = (wine: Wine): number => {
  return wine.price + (wine.price * wine.iva) / 100;
};

const calculateCartTotals = (items: CartItem[]) => {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = items.reduce(
    (sum, item) => sum + item.priceAtTimeOfAdd * item.quantity,
    0
  );
  
  return { totalItems, totalAmount };
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      totalItems: 0,
      totalAmount: 0,
      shippingInfo: {
        address: "",
        phone: "",
        postalCode: "",
      },
      showNotification: false,
      notificationMessage: "",

      addItem: (wine: Wine, quantity = 1) => {
        const currentItems = get().items;
        const existingItemIndex = currentItems.findIndex(
          (item) => item.wine.id === wine.id,
        );
        const finalPrice = calculateFinalPrice(wine);

        let newItems: CartItem[];

        if (existingItemIndex >= 0) {
          newItems = currentItems.map((item, index) =>
            index === existingItemIndex
              ? { ...item, quantity: item.quantity + quantity }
              : item,
          );
        } else {
          const newItem: CartItem = {
            wine,
            quantity,
            priceAtTimeOfAdd: finalPrice,
          };

          newItems = [...currentItems, newItem];
        }

        const { totalItems, totalAmount } = calculateCartTotals(newItems);

        const message = `✅ ${wine.marca} agregado al carrito (${quantity})`;

        set({
          items: newItems,
          totalItems,
          totalAmount,
          showNotification: true,
          notificationMessage: message,
        });

        setTimeout(() => {
          get().hideNotification();
        }, CART_NOTIFICATION_DURATION);
      },

      removeItem: (wineId: string) => {
        const currentItems = get().items;
        const newItems = currentItems.filter((item) => item.wine.id !== wineId);
        const { totalItems, totalAmount } = calculateCartTotals(newItems);

        set({ items: newItems, totalItems, totalAmount });
      },

      updateQuantity: (wineId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(wineId);
          return;
        }

        const currentItems = get().items;
        const newItems = currentItems.map((item) =>
          item.wine.id === wineId ? { ...item, quantity } : item
        );
        const { totalItems, totalAmount } = calculateCartTotals(newItems);

        set({ items: newItems, totalItems, totalAmount });
      },

      clearCart: () => {
        set({
          items: [],
          totalItems: 0,
          totalAmount: 0,
        });
      },

      toggleCart: () => {
        set((state) => ({ isOpen: !state.isOpen }));
      },

      getItemQuantity: (wineId: string) => {
        const item = get().items.find((item) => item.wine.id === wineId);

        return item ? item.quantity : 0;
      },

      setShippingInfo: (info: Partial<ShippingInfo>) => {
        set((state) => ({
          shippingInfo: {
            ...state.shippingInfo,
            ...info,
          },
        }));
      },

      setNotification: (message: string) => {
        set({ showNotification: true, notificationMessage: message });
      },

      hideNotification: () => {
        set({ showNotification: false, notificationMessage: "" });
      },
    }),
    {
      name: "cart-storage",
      partialize: (state) => ({
        items: state.items,
        totalItems: state.totalItems,
        totalAmount: state.totalAmount,
        shippingInfo: state.shippingInfo,
      }),
    },
  ),
);
