"use client";

import { useState, useEffect } from "react";
import { Card } from "@heroui/card";

import { Order } from "@/types/order";
import { getAllOrders, deleteOrder, updateOrderStatus } from "@/lib/firestore";
import { calculateOrderStats, confirmDelete } from "@/lib/adminUtils";
import { AdminStats, AdminLoadingState, AdminEmptyState } from "./shared";
import { OrdersTable, OrderFilters, OrderDetailModal } from "./orders";

export default function OrdersAdminPanel() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    const ordersData = await getAllOrders();

    setOrders(ordersData);
    setLoading(false);
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (!confirmDelete("este pedido")) {
      return;
    }

    const success = await deleteOrder(orderId);

    if (success) {
      setOrders(orders.filter((order) => order.id !== orderId));
      setSelectedOrder(null);
      alert("Pedido eliminado exitosamente");
    } else {
      alert("Error al eliminar el pedido");
    }
  };

  const handleUpdateStatus = async (
    orderId: string,
    newStatus: Order["status"]
  ) => {
    const success = await updateOrderStatus(orderId, newStatus);

    if (success) {
      setOrders(
        orders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
      if (selectedOrder?.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
      alert("Estado actualizado exitosamente");
    } else {
      alert("Error al actualizar el estado");
    }
  };

  const filteredOrders =
    filterStatus === "all"
      ? orders
      : orders.filter((order) => order.status === filterStatus);

  const orderStats = calculateOrderStats(orders);

  if (loading) {
    return <AdminLoadingState message="Cargando pedidos..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header con estadísticas */}
      <AdminStats
        stats={[
          { label: "Total", value: orderStats.total },
          {
            label: "Pendientes",
            value: orderStats.pending,
            variant: "warning",
          },
          {
            label: "Procesando",
            value: orderStats.processing,
            variant: "info",
          },
          {
            label: "Completados",
            value: orderStats.completed,
            variant: "success",
          },
          {
            label: "Cancelados",
            value: orderStats.cancelled,
            variant: "danger",
          },
          { label: "Ingresos", value: orderStats.revenue, format: "currency" },
        ]}
      />

      {/* Filtros */}
      <Card className="p-4 shadow-sm">
        <OrderFilters
          selectedStatus={filterStatus}
          onStatusChange={setFilterStatus}
        />
      </Card>

      {/* Lista de pedidos */}
      {filteredOrders.length === 0 ? (
        <AdminEmptyState
          actionLabel="Ver todos los pedidos"
          description="No hay pedidos que coincidan con los filtros seleccionados"
          title="No hay pedidos"
          onAction={() => setFilterStatus("all")}
        />
      ) : (
        <Card className="shadow-sm overflow-hidden">
          <OrdersTable
            orders={filteredOrders}
            onSelectOrder={setSelectedOrder}
          />
        </Card>
      )}

      {/* Modal de detalles */}
      <OrderDetailModal
        isOpen={!!selectedOrder}
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
        onDelete={handleDeleteOrder}
        onUpdateStatus={handleUpdateStatus}
      />
    </div>
  );
}
