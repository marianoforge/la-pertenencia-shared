import { Button } from "@heroui/button";
import Image from "next/image";

import { Wine } from "@/types/wine";
import { formatPrice } from "@/lib/formatters";

interface WinesTableProps {
  wines: Wine[];
  onEdit: (wine: Wine) => void;
  onDelete: (wine: Wine) => void;
}

export const WinesTable: React.FC<WinesTableProps> = ({
  wines,
  onEdit,
  onDelete,
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
              Vino
            </th>
            <th
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              scope="col"
            >
              Bodega
            </th>
            <th
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              scope="col"
            >
              Tipo
            </th>
            <th
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              scope="col"
            >
              Precio
            </th>
            <th
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              scope="col"
            >
              Stock
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
          {wines.map((wine) => (
            <tr key={wine.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center gap-3">
                  {wine.image && (
                    <div className="relative w-10 h-10 flex-shrink-0">
                      <Image
                        alt={wine.marca}
                        className="object-cover rounded"
                        fill
                        src={wine.image}
                      />
                    </div>
                  )}
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {wine.marca}
                    </div>
                    <div className="text-xs text-gray-500">
                      {wine.varietal} • {wine.vintage}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {wine.bodega}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                  {wine.tipo}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                {formatPrice(wine.price)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <span
                  className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    wine.stock === 0
                      ? "bg-red-100 text-red-800"
                      : wine.stock < 10
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-green-100 text-green-800"
                  }`}
                >
                  {wine.stock} unidades
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {wine.featured && (
                  <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                    Destacado
                  </span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex gap-2 justify-end">
                  <Button
                    color="primary"
                    size="sm"
                    variant="light"
                    onPress={() => onEdit(wine)}
                  >
                    Editar
                  </Button>
                  <Button
                    color="danger"
                    size="sm"
                    variant="light"
                    onPress={() => onDelete(wine)}
                  >
                    Eliminar
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
