import { useState } from "react";
import { useMercadoPago } from "./useMercadoPago";
import { useCartStore } from "@/stores/useCartStore";
import { createOrder } from "@/lib/firestore";
import { CartItem } from "@/types/cart";

interface CheckoutOptions {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export function useCheckout(options: CheckoutOptions = {}) {
  const { onSuccess, onError } = options;
  const [isProcessing, setIsProcessing] = useState(false);
  
  const { clearCart, toggleCart } = useCartStore();
  const {
    createPreference,
    redirectToCheckout,
    loading: mpLoading,
    error: mpError,
  } = useMercadoPago();

  const parsePhoneNumber = (phone: string) => {
    const phoneNumber = phone.replace(/\D/g, "");
    const areaCode = phoneNumber.substring(0, 2) || "11";
    const number = phoneNumber.substring(2) || phoneNumber;
    return { areaCode, number };
  };

  const processMercadoPagoCheckout = async (
    items: CartItem[],
    totalAmount: number,
    shippingInfo: { address: string; phone: string; postalCode: string },
    shippingCost: number
  ) => {
    if (items.length === 0) return;

    setIsProcessing(true);

    try {
      const { areaCode, number } = parsePhoneNumber(shippingInfo.phone);

      const payerInfo = {
        phone: { area_code: areaCode, number },
        address: {
          street_name: shippingInfo.address,
          zip_code: shippingInfo.postalCode,
        },
      };

      const preference = await createPreference(items, payerInfo, shippingCost);

      if (!preference) {
        throw new Error("No se pudo crear la preferencia de pago");
      }

      const orderResult = await createOrder({
        items,
        totalAmount,
        shippingCost,
        finalAmount: totalAmount + shippingCost,
        shippingInfo,
        mercadoPagoData: { preferenceId: preference.preferenceId },
        status: "pending",
        paymentMethod: "mercadopago",
      });

      if (orderResult.success) {
        redirectToCheckout(preference.initPoint);
        if (onSuccess) onSuccess();
      } else {
        throw new Error("No se pudo guardar la orden");
      }
    } catch (error) {
      const errorMessage = "Error al procesar el pago con MercadoPago";
      if (onError) onError(errorMessage);
      console.error(errorMessage, error);
    } finally {
      setIsProcessing(false);
    }
  };

  const processCustomCheckout = async (
    items: CartItem[],
    totalAmount: number,
    shippingInfo: { address: string; phone: string; postalCode: string },
    shippingCost: number
  ) => {
    setIsProcessing(true);

    try {
      const orderResult = await createOrder({
        items,
        totalAmount,
        shippingCost,
        finalAmount: totalAmount + shippingCost,
        shippingInfo,
        status: "pending",
        paymentMethod: "custom",
      });

      if (orderResult.success) {
        alert(
          `¡Pedido realizado con éxito! Número de orden: ${orderResult.orderNumber}. Te contactaremos pronto.`
        );
        clearCart();
        toggleCart();
        if (onSuccess) onSuccess();
      } else {
        throw new Error("No se pudo procesar el pedido");
      }
    } catch (error) {
      const errorMessage = "Error al procesar el pedido";
      if (onError) onError(errorMessage);
      console.error(errorMessage, error);
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    isProcessing,
    mpLoading,
    mpError,
    processMercadoPagoCheckout,
    processCustomCheckout,
  };
}

