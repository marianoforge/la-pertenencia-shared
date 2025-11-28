import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Button } from "@heroui/button";
import Image from "next/image";

import { Order } from "@/types/order";
import { formatDate, formatPrice } from "@/lib/formatters";
import {
  getOrderStatusLabel,
  getPaymentMethodLabel,
  formatOrderNumber,
} from "@/lib/adminUtils";

interface OrderDetailModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (orderId: string, status: Order["status"]) => void;
  onDelete: (orderId: string) => void;
}

export const OrderDetailModal: React.FC<OrderDetailModalProps> = ({
  order,
  isOpen,
  onClose,
  onUpdateStatus,
  onDelete,
}) => {
  if (!order) return null;

  return (
    <Modal isOpen={isOpen} size="3xl" onClose={onClose}>
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <h2>Detalle del Pedido {formatOrderNumber(order.orderNumber)}</h2>
        </ModalHeader>

        <ModalBody>
          <div className="space-y-6">
            {/* Información General */}
            <section>
              <h3 className="text-lg font-semibold mb-3">
                Información General
              </h3>
              <dl className="grid grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm text-gray-600">Fecha</dt>
                  <dd className="font-medium">{formatDate(order.createdAt)}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-600">Estado</dt>
                  <dd className="font-medium">
                    {getOrderStatusLabel(order.status)}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-600">Método de Pago</dt>
                  <dd className="font-medium">
                    {getPaymentMethodLabel(order.paymentMethod)}
                  </dd>
                </div>
                {order.mercadoPagoData && (
                  <div>
                    <dt className="text-sm text-gray-600">ID Preferencia</dt>
                    <dd className="font-mono text-xs">
                      {order.mercadoPagoData.preferenceId}
                    </dd>
                  </div>
                )}
              </dl>
            </section>

            {/* Información de Envío */}
            <section>
              <h3 className="text-lg font-semibold mb-3">
                Información de Envío
              </h3>
              <address className="not-italic space-y-2">
                <p>
                  <strong>Dirección:</strong> {order.shippingInfo.address}
                </p>
                <p>
                  <strong>Teléfono:</strong>{" "}
                  <a
                    className="text-indigo-600 hover:underline"
                    href={`tel:${order.shippingInfo.phone}`}
                  >
                    {order.shippingInfo.phone}
                  </a>
                </p>
                <p>
                  <strong>Código Postal:</strong>{" "}
                  {order.shippingInfo.postalCode}
                </p>
              </address>
            </section>

            {/* Items del Pedido */}
            <section>
              <h3 className="text-lg font-semibold mb-3">Items</h3>
              <ul className="space-y-3">
                {order.items.map((item, index) => (
                  <li
                    key={index}
                    className="flex items-center gap-4 p-3 bg-gray-50 rounded"
                  >
                    {item.wine.image && (
                      <div className="relative w-12 h-12 flex-shrink-0">
                        <Image
                          alt={item.wine.marca}
                          className="object-cover rounded"
                          fill
                          src={item.wine.image}
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="font-medium">{item.wine.marca}</p>
                      <p className="text-sm text-gray-600">
                        {item.wine.winery} • {item.wine.vintage}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">
                        Cantidad: {item.quantity}
                      </p>
                      <p className="font-medium">
                        {formatPrice(item.priceAtTimeOfAdd * item.quantity)}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            {/* Resumen de Costos */}
            <section>
              <h3 className="text-lg font-semibold mb-3">Resumen</h3>
              <dl className="space-y-2">
                <div className="flex justify-between">
                  <dt className="text-gray-600">Subtotal:</dt>
                  <dd className="font-medium">
                    {formatPrice(order.totalAmount)}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">Envío:</dt>
                  <dd className="font-medium">
                    {order.shippingCost === 0
                      ? "Gratis"
                      : formatPrice(order.shippingCost)}
                  </dd>
                </div>
                <div className="flex justify-between pt-2 border-t">
                  <dt className="text-lg font-semibold">Total:</dt>
                  <dd className="text-lg font-bold text-indigo-600">
                    {formatPrice(order.finalAmount)}
                  </dd>
                </div>
              </dl>
            </section>

            {/* Cambiar Estado */}
            <section>
              <h3 className="text-lg font-semibold mb-3">Cambiar Estado</h3>
              <div className="flex gap-2 flex-wrap">
                {(
                  ["pending", "processing", "completed", "cancelled"] as const
                ).map((status) => (
                  <Button
                    key={status}
                    color={order.status === status ? "primary" : "default"}
                    size="sm"
                    variant={order.status === status ? "solid" : "bordered"}
                    onClick={() => order.id && onUpdateStatus(order.id, status)}
                  >
                    {getOrderStatusLabel(status)}
                  </Button>
                ))}
              </div>
            </section>
          </div>
        </ModalBody>

        <ModalFooter>
          <Button
            color="danger"
            variant="light"
            onClick={() => order.id && onDelete(order.id)}
          >
            Eliminar Pedido
          </Button>
          <Button color="default" onClick={onClose}>
            Cerrar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
