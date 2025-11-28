import { CartItem } from "./cart";

export interface Order {
  id?: string;
  // Información de los productos
  items: CartItem[];
  totalAmount: number;
  shippingCost: number;
  finalAmount: number;

  // Información del comprador
  shippingInfo: {
    address: string;
    phone: string;
    postalCode: string;
  };

  // Información de Mercado Pago
  mercadoPagoData?: {
    preferenceId: string;
    paymentId?: string;
    paymentStatus?: string;
    paymentType?: string;
  };

  // Información adicional
  orderNumber: string;
  status: "pending" | "processing" | "completed" | "cancelled";
  paymentMethod: "mercadopago" | "custom";
  createdAt: string;
  updatedAt?: string;
}

