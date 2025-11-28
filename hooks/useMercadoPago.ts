import { useState } from "react";

import { CartItem } from "../types/cart";

interface MercadoPagoItem {
  id: string;
  title: string;
  description: string;
  quantity: number;
  unit_price: number;
}

interface PayerInfo {
  name?: string;
  surname?: string;
  email?: string;
  phone?: {
    area_code?: string;
    number?: string;
  };
  identification?: {
    type?: string;
    number?: string;
  };
  address?: {
    street_name?: string;
    street_number?: string;
    zip_code?: string;
  };
}

interface CreatePreferenceResponse {
  preferenceId: string;
  initPoint: string;
  isProduction: boolean;
  // Mantener por compatibilidad
  init_point: string;
  sandbox_init_point: string;
}

export const useMercadoPago = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createPreference = async (
    cartItems: CartItem[],
    payerInfo?: PayerInfo,
    shippingCost?: number,
  ): Promise<CreatePreferenceResponse | null> => {
    setLoading(true);
    setError(null);

    try {
      // Transformar items del carrito a formato Mercado Pago
      const items: MercadoPagoItem[] = cartItems.map((item) => ({
        id: item.wine.id,
        title: `${item.wine.marca} - ${item.wine.bodega}`,
        description: `${item.wine.tipo} ${item.wine.vintage} - ${item.wine.region}`,
        quantity: item.quantity,
        unit_price: item.priceAtTimeOfAdd,
      }));

      // Agregar costo de envío como un item si existe
      if (shippingCost && shippingCost > 0) {
        items.push({
          id: "shipping",
          title: "Costo de Envío",
          description: "Envío a domicilio",
          quantity: 1,
          unit_price: shippingCost,
        });
      }

      const response = await fetch("/api/mercadopago/create-preference", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items,
          payer: payerInfo || {},
        }),
      });

      if (!response.ok) {
        throw new Error("Error al crear la preferencia de pago");
      }

      const data: CreatePreferenceResponse = await response.json();

      return data;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error desconocido";

      setError(errorMessage);
      console.error("Error creating preference:", err);

      return null;
    } finally {
      setLoading(false);
    }
  };

  const redirectToCheckout = (initPoint: string) => {
    // Redirigir a Mercado Pago
    window.location.href = initPoint;
  };

  return {
    createPreference,
    redirectToCheckout,
    loading,
    error,
  };
};
