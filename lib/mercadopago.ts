// Configuración de Mercado Pago para el cliente
export const MERCADOPAGO_PUBLIC_KEY =
  process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY_TEST ||
  process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY;

// URLs de retorno
export const getReturnUrls = () => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  return {
    success: `${baseUrl}/payment/success`,
    failure: `${baseUrl}/payment/failure`,
    pending: `${baseUrl}/payment/pending`,
  };
};

// Validar configuración
export const validateMercadoPagoConfig = () => {
  if (!MERCADOPAGO_PUBLIC_KEY) {
    throw new Error("NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY no está configurada");
  }

  return true;
};

// Helper para formatear el precio
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
  }).format(price);
};
