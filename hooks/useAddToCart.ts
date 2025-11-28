import { useState, useCallback } from "react";
import { useCartStore } from "@/stores/useCartStore";
import { Wine } from "@/types/wine";
import { Combo } from "@/types/combo";
import { QUANTITY_LIMITS } from "@/lib/constants";

type CartItem = Wine | Combo;

interface UseAddToCartOptions {
  initialQuantity?: number;
  onSuccess?: (item: CartItem, quantity: number) => void;
}

export function useAddToCart(options: UseAddToCartOptions = {}) {
  const { initialQuantity = QUANTITY_LIMITS.MIN, onSuccess } = options;
  const [quantity, setQuantity] = useState(initialQuantity);
  const { addItem } = useCartStore();

  const increaseQuantity = useCallback((maxStock?: number) => {
    const max = maxStock ?? QUANTITY_LIMITS.MAX;
    setQuantity((prev) => (prev < max ? prev + 1 : prev));
  }, []);

  const decreaseQuantity = useCallback(() => {
    setQuantity((prev) => (prev > QUANTITY_LIMITS.MIN ? prev - 1 : prev));
  }, []);

  const resetQuantity = useCallback(() => {
    setQuantity(initialQuantity);
  }, [initialQuantity]);

  const addToCart = useCallback(
    (item: CartItem) => {
      addItem(item, quantity);
      resetQuantity();
      
      if (onSuccess) {
        onSuccess(item, quantity);
      }
    },
    [addItem, quantity, resetQuantity, onSuccess]
  );

  return {
    quantity,
    setQuantity,
    increaseQuantity,
    decreaseQuantity,
    resetQuantity,
    addToCart,
  };
}

