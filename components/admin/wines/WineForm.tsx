import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Switch } from "@heroui/switch";

import { Wine } from "@/types/wine";
import { ImageUploader } from "../shared";
import { WINE_TYPES, WINE_VARIETALS } from "@/lib/adminConstants";
import { calculateWineProfit, numberToInputString } from "@/lib/adminHelpers";

interface WineFormProps {
  wine: Partial<Wine>;
  errors: Record<string, string>;
  uploading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onChange: (field: string, value: any) => void;
  onFileSelect: (file: File) => void;
  onCancel: () => void;
}

export const WineForm: React.FC<WineFormProps> = ({
  wine,
  errors,
  uploading,
  onSubmit,
  onChange,
  onFileSelect,
  onCancel,
}) => {
  // Calcular ganancia usando helper
  const { profit, profitPercentage, priceWithTax } = calculateWineProfit(
    wine.price || 0,
    wine.cost || 0,
    wine.iva || 0
  );

  return (
    <form className="space-y-6" onSubmit={onSubmit}>
      {/* Información Básica */}
      <section>
        <h3 className="text-lg font-semibold mb-4">Información Básica</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            errorMessage={errors.marca}
            isInvalid={!!errors.marca}
            label="Marca"
            placeholder="Ejemplo: Catena Zapata"
            required
            value={wine.marca || ""}
            onChange={(e) => onChange("marca", e.target.value)}
          />

          <Input
            errorMessage={errors.bodega}
            isInvalid={!!errors.bodega}
            label="Bodega"
            placeholder="Ejemplo: Bodega Catena Zapata"
            required
            value={wine.bodega || ""}
            onChange={(e) => onChange("bodega", e.target.value)}
          />

          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="tipo">
              Tipo de Vino
            </label>
            <select
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              id="tipo"
              value={wine.tipo || ""}
              onChange={(e) => onChange("tipo", e.target.value)}
            >
              {WINE_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              className="block text-sm font-medium mb-1"
              htmlFor="varietal"
            >
              Varietal
            </label>
            <select
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              id="varietal"
              value={wine.varietal || ""}
              onChange={(e) => onChange("varietal", e.target.value)}
            >
              {WINE_VARIETALS.map((varietal) => (
                <option key={varietal} value={varietal}>
                  {varietal}
                </option>
              ))}
            </select>
          </div>

          <Input
            errorMessage={errors.region}
            isInvalid={!!errors.region}
            label="Región"
            placeholder="Ejemplo: Mendoza"
            required
            value={wine.region || ""}
            onChange={(e) => onChange("region", e.target.value)}
          />

          <Input
            errorMessage={errors.vintage}
            isInvalid={!!errors.vintage}
            label="Año (Vintage)"
            max={new Date().getFullYear() + 1}
            min={1900}
            required
            type="number"
            value={numberToInputString(wine.vintage)}
            onChange={(e) => onChange("vintage", parseInt(e.target.value))}
          />

          <Input
            errorMessage={errors.alcohol}
            isInvalid={!!errors.alcohol}
            label="Graduación Alcohólica (%)"
            max={20}
            min={0}
            required
            step="0.1"
            type="number"
            value={numberToInputString(wine.alcohol)}
            onChange={(e) => onChange("alcohol", parseFloat(e.target.value))}
          />

          <Input
            label="Winery (nombre corto)"
            placeholder="Ejemplo: Catena"
            value={wine.winery || ""}
            onChange={(e) => onChange("winery", e.target.value)}
          />
        </div>
      </section>

      {/* Descripción y Maridaje */}
      <section>
        <h3 className="text-lg font-semibold mb-4">Descripción y Maridaje</h3>
        <div className="space-y-4">
          <div>
            <label
              className="block text-sm font-medium mb-1"
              htmlFor="description"
            >
              Descripción
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              id="description"
              placeholder="Describe las características del vino..."
              rows={3}
              value={wine.description || ""}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                onChange("description", e.target.value)
              }
            />
            {errors.description && (
              <p className="text-red-600 text-sm mt-1">{errors.description}</p>
            )}
          </div>

          <div>
            <label
              className="block text-sm font-medium mb-1"
              htmlFor="maridaje"
            >
              Maridaje
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              id="maridaje"
              placeholder="¿Con qué acompaña mejor este vino?"
              rows={2}
              value={wine.maridaje || ""}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                onChange("maridaje", e.target.value)
              }
            />
          </div>
        </div>
      </section>

      {/* Precios y Costos */}
      <section>
        <h3 className="text-lg font-semibold mb-4">Precios y Costos</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            errorMessage={errors.price}
            isInvalid={!!errors.price}
            label="Precio de Venta"
            min={0}
            placeholder="0.00"
            required
            startContent="$"
            step="0.01"
            type="number"
            value={numberToInputString(wine.price)}
            onChange={(e) => onChange("price", parseFloat(e.target.value))}
          />

          <Input
            errorMessage={errors.cost}
            isInvalid={!!errors.cost}
            label="Costo"
            min={0}
            placeholder="0.00"
            required
            startContent="$"
            step="0.01"
            type="number"
            value={numberToInputString(wine.cost)}
            onChange={(e) => onChange("cost", parseFloat(e.target.value))}
          />

          <Input
            errorMessage={errors.iva}
            isInvalid={!!errors.iva}
            label="IVA (%)"
            max={50}
            min={0}
            placeholder="21"
            required
            step="0.1"
            type="number"
            value={numberToInputString(wine.iva)}
            onChange={(e) => onChange("iva", parseFloat(e.target.value))}
          />
        </div>

        {/* Cálculo de Ganancia */}
        {wine.price && wine.cost && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <h4 className="text-sm font-semibold text-blue-900 mb-2">
              Análisis de Rentabilidad
            </h4>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-blue-700">Ganancia:</p>
                <p className="font-bold text-blue-900">${profit.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-blue-700">Margen:</p>
                <p className="font-bold text-blue-900">
                  {profitPercentage.toFixed(2)}%
                </p>
              </div>
              <div>
                <p className="text-blue-700">Precio con IVA:</p>
                <p className="font-bold text-blue-900">
                  ${priceWithTax.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Stock */}
      <section>
        <h3 className="text-lg font-semibold mb-4">Inventario</h3>
        <Input
          errorMessage={errors.stock}
          isInvalid={!!errors.stock}
          label="Stock Disponible"
          min={0}
          placeholder="0"
          required
          type="number"
          value={numberToInputString(wine.stock)}
          onChange={(e) => onChange("stock", parseInt(e.target.value))}
        />
      </section>

      {/* Imagen */}
      <section>
        <h3 className="text-lg font-semibold mb-4">Imagen</h3>
        <ImageUploader
          currentImage={wine.image}
          label="Imagen del Vino"
          onFileSelect={onFileSelect}
        />
      </section>

      {/* Destacado */}
      <section>
        <Switch
          isSelected={wine.featured || false}
          onValueChange={(checked) => onChange("featured", checked)}
        >
          Destacar este vino en la página principal
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
            : wine.id
              ? "Actualizar Vino"
              : "Crear Vino"}
        </Button>
      </div>
    </form>
  );
};
