import { CartItem } from "./cart";

export interface Order {
  id?: string;
  
  items: CartItem[];
  totalAmount: number;
  shippingCost: number;
  finalAmount: number;

  
  shippingInfo: {
    address: string;
    phone: string;
    postalCode: string;
  };

  
  mercadoPagoData?: {
    preferenceId: string;
    paymentId?: string;
    paymentStatus?: string;
    paymentType?: string;
  };

  
  orderNumber: string;
  status: "pending" | "processing" | "completed" | "cancelled";
  paymentMethod: "mercadopago" | "custom";
  createdAt: string;
  updatedAt?: string;
}

