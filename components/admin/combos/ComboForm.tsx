import { useState } from "react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Switch } from "@heroui/switch";
import { Checkbox } from "@heroui/checkbox";

import { Combo } from "@/types/combo";
import { Wine } from "@/types/wine";
import { ImageUploader } from "../shared";

interface ComboFormProps {
  combo: Partial<Combo> & { selectedWineIds?: string[] };
  wines: Wine[];
  errors: Record<string, string>;
  uploading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onChange: (field: string, value: any) => void;
  onFileSelect: (file: File) => void;
  onBgFileSelect: (file: File) => void;
  onCancel: () => void;
}

export const ComboForm: React.FC<ComboFormProps> = ({
  combo,
  wines,
  errors,
  uploading,
  onSubmit,
  onChange,
  onFileSelect,
  onBgFileSelect,
  onCancel,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const selectedWineIds = combo.selectedWineIds || [];
  const selectedWines = wines.filter((w) => selectedWineIds.includes(w.id));

  // Calcular precio sugerido basado en vinos seleccionados
  const suggestedPrice = selectedWines.reduce(
    (sum, wine) => sum + wine.price,
    0
  );
  const discount =
    suggestedPrice > 0 && combo.price
      ? ((suggestedPrice - combo.price) / suggestedPrice) * 100
      : 0;

  // Filtrar vinos por búsqueda
  const filteredWines = wines.filter(
    (wine) =>
      wine.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wine.bodega.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wine.varietal.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleWine = (wineId: string) => {
    const newSelectedIds = selectedWineIds.includes(wineId)
      ? selectedWineIds.filter((id) => id !== wineId)
      : [...selectedWineIds, wineId];
    onChange("selectedWineIds", newSelectedIds);
  };

  return (
    <form className="space-y-6" onSubmit={onSubmit}>
      {/* Información Básica */}
      <section>
        <h3 className="text-lg font-semibold mb-4">Información del Combo</h3>
        <div className="space-y-4">
          <Input
            errorMessage={errors.name}
            isInvalid={!!errors.name}
            label="Nombre del Combo"
            placeholder="Ejemplo: Selección Premium"
            required
            value={combo.name || ""}
            onChange={(e) => onChange("name", e.target.value)}
          />

          <Input
            errorMessage={errors.price}
            isInvalid={!!errors.price}
            label="Precio del Combo"
            min={0}
            placeholder="0.00"
            required
            startContent="$"
            step="0.01"
            type="number"
            value={combo.price?.toString() || ""}
            onChange={(e) => onChange("price", parseFloat(e.target.value))}
          />

          {suggestedPrice > 0 && (
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="text-sm font-semibold text-blue-900 mb-2">
                Análisis de Precio
              </h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-blue-700">Precio individual vinos:</p>
                  <p className="font-bold text-blue-900">
                    ${suggestedPrice.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-blue-700">Descuento:</p>
                  <p
                    className={`font-bold ${discount > 0 ? "text-green-900" : "text-red-900"}`}
                  >
                    {discount > 0 ? "-" : "+"}
                    {Math.abs(discount).toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Selección de Vinos */}
      <section>
        <h3 className="text-lg font-semibold mb-4">
          Vinos del Combo ({selectedWines.length})
        </h3>

        {errors.wines && (
          <p className="text-red-600 text-sm mb-2">{errors.wines}</p>
        )}

        <Input
          className="mb-4"
          placeholder="Buscar vinos..."
          type="search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="border rounded-lg max-h-96 overflow-y-auto">
          {filteredWines.map((wine) => (
            <div
              key={wine.id}
              className="flex items-center gap-3 p-3 hover:bg-gray-50 border-b last:border-b-0"
            >
              <Checkbox
                isSelected={selectedWineIds.includes(wine.id)}
                onValueChange={() => handleToggleWine(wine.id)}
              />

              <div className="flex-1">
                <div className="font-medium text-gray-900">{wine.marca}</div>
                <div className="text-sm text-gray-600">
                  {wine.bodega} • {wine.varietal} • {wine.vintage}
                </div>
              </div>

              <div className="text-right">
                <div className="font-semibold text-gray-900">
                  ${wine.price.toLocaleString()}
                </div>
                <div className="text-xs text-gray-500">Stock: {wine.stock}</div>
              </div>
            </div>
          ))}

          {filteredWines.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              No se encontraron vinos
            </div>
          )}
        </div>
      </section>

      {/* Imágenes */}
      <section>
        <h3 className="text-lg font-semibold mb-4">Imágenes</h3>
        <div className="space-y-4">
          <ImageUploader
            currentImage={combo.image}
            label="Imagen Principal del Combo"
            onFileSelect={onFileSelect}
          />

          <ImageUploader
            currentImage={combo.backgroundImage}
            label="Imagen de Fondo (opcional)"
            onFileSelect={onBgFileSelect}
          />
        </div>
      </section>

      {/* Destacado */}
      <section>
        <Switch
          isSelected={combo.featured || false}
          onValueChange={(checked) => onChange("featured", checked)}
        >
          Destacar este combo en la página principal
        </Switch>
      </section>

      {/* Botones */}
      <div className="flex gap-3 justify-end border-t pt-4">
        <Button color="default" variant="light" onPress={onCancel}>
          Cancelar
        </Button>
        <Button color="primary" isLoading={uploading} type="submit">
          {uploading
            ? "Guardando..."
            : combo.id
              ? "Actualizar Combo"
              : "Crear Combo"}
        </Button>
      </div>
    </form>
  );
};
