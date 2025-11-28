import { Button } from "@heroui/button";
import Image from "next/image";

import { Combo } from "@/types/combo";
import { formatPrice } from "@/lib/formatters";

interface CombosTableProps {
  combos: Combo[];
  onEdit: (combo: Combo) => void;
  onDelete: (combo: Combo) => void;
}

export const CombosTable: React.FC<CombosTableProps> = ({
  combos,
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
              Combo
            </th>
            <th
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              scope="col"
            >
              Vinos
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
              Descuento
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
          {combos.map((combo) => {
            // No podemos calcular el precio individual sin los datos completos de los vinos
            // Por ahora mostramos solo el precio del combo
            const discount = 0; // Placeholder - necesitaríamos los vinos completos para calcularlo

            return (
              <tr key={combo.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    {combo.image && (
                      <div className="relative w-10 h-10 flex-shrink-0">
                        <Image
                          alt={combo.name}
                          className="object-cover rounded"
                          fill
                          src={combo.image}
                        />
                      </div>
                    )}
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {combo.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        ID: {combo.id}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">
                    {combo.wines.length} vinos
                  </div>
                  <div className="text-xs text-gray-500 max-w-xs truncate">
                    {combo.wines.map((w) => w.marca).join(", ")}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                  {formatPrice(combo.price)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      discount > 0
                        ? "bg-green-100 text-green-800"
                        : discount < 0
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {discount > 0 ? "-" : discount < 0 ? "+" : ""}
                    {Math.abs(discount).toFixed(1)}%
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {combo.featured && (
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
                      onPress={() => onEdit(combo)}
                    >
                      Editar
                    </Button>
                    <Button
                      color="danger"
                      size="sm"
                      variant="light"
                      onPress={() => onDelete(combo)}
                    >
                      Eliminar
                    </Button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
