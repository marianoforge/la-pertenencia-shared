import { Order } from "@/types/order";
import { formatDate } from "@/lib/formatters";
import {
  getOrderStatusColor,
  getOrderStatusLabel,
  formatOrderNumber,
} from "@/lib/adminUtils";

interface OrdersTableProps {
  orders: Order[];
  onSelectOrder: (order: Order) => void;
}

export const OrdersTable: React.FC<OrdersTableProps> = ({
  orders,
  onSelectOrder,
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              scope="col"
            >
              Pedido
            </th>
            <th
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              scope="col"
            >
              Fecha
            </th>
            <th
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              scope="col"
            >
              Cliente
            </th>
            <th
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              scope="col"
            >
              Items
            </th>
            <th
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              scope="col"
            >
              Total
            </th>
            <th
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              scope="col"
            >
              Estado
            </th>
            <th className="px-6 py-3 text-right" scope="col">
              <span className="sr-only">Acciones</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {orders.map((order) => (
            <tr
              key={order.id}
              className="hover:bg-gray-50 cursor-pointer"
              onClick={() => onSelectOrder(order)}
            >
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {formatOrderNumber(order.orderNumber)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatDate(order.createdAt, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </td>
              <td className="px-6 py-4 text-sm text-gray-900">
                <div>{order.shippingInfo.phone}</div>
                <div className="text-xs text-gray-500 truncate max-w-xs">
                  {order.shippingInfo.address}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {order.items.length} items
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                ${order.finalAmount.toLocaleString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getOrderStatusColor(order.status)}`}
                >
                  {getOrderStatusLabel(order.status)}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  className="text-indigo-600 hover:text-indigo-900"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectOrder(order);
                  }}
                >
                  Ver
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
