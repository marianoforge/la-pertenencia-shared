import { Order } from "@/types/order";

export function getOrderStatusColor(status: Order["status"]): string {
  const colors = {
    pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
    processing: "bg-blue-100 text-blue-800 border-blue-300",
    completed: "bg-green-100 text-green-800 border-green-300",
    cancelled: "bg-red-100 text-red-800 border-red-300",
  };
  
  return colors[status] || "bg-gray-100 text-gray-800 border-gray-300";
}

export function getOrderStatusLabel(status: Order["status"]): string {
  const labels = {
    pending: "Pendiente",
    processing: "Procesando",
    completed: "Completado",
    cancelled: "Cancelado",
  };
  
  return labels[status] || status;
}

export function getPaymentMethodLabel(method: Order["paymentMethod"]): string {
  return method === "mercadopago" ? "Mercado Pago" : "Pago Personalizado";
}

export function calculateOrderStats(orders: Order[]) {
  return {
    total: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    processing: orders.filter((o) => o.status === "processing").length,
    completed: orders.filter((o) => o.status === "completed").length,
    cancelled: orders.filter((o) => o.status === "cancelled").length,
    revenue: orders
      .filter((o) => o.status === "completed")
      .reduce((sum, o) => sum + o.finalAmount, 0),
  };
}

export function formatOrderNumber(orderNumber: string | number): string {
  return `#${orderNumber}`;
}

export function confirmDelete(itemName: string): boolean {
  return confirm(
    `¿Estás seguro de que quieres eliminar ${itemName}? Esta acción no se puede deshacer.`
  );
}

