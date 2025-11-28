import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { useState } from "react";

interface WineFiltersProps {
  searchQuery: string;
  selectedCategory: string;
  selectedRegion: string;
  priceRange: { min: number; max: number };
  onSearchChange: (query: string) => void;
  onCategoryChange: (category: string) => void;
  onRegionChange: (region: string) => void;
  onPriceRangeChange: (range: { min: number; max: number }) => void;
  onClearFilters: () => void;
}

const WineFilters = ({
  searchQuery,
  selectedCategory,
  selectedRegion,
  priceRange,
  onSearchChange,
  onCategoryChange,
  onRegionChange,
  onPriceRangeChange,
  onClearFilters,
}: WineFiltersProps) => {
  const [minPrice, setMinPrice] = useState(priceRange.min.toString());
  const [maxPrice, setMaxPrice] = useState(priceRange.max.toString());

  const categories = [
    { value: "", label: "Todos los tipos" },
    { value: "Tinto", label: "Tinto" },
    { value: "Blanco", label: "Blanco" },
    { value: "Red", label: "Red" },
    { value: "Blend", label: "Blend" },
    { value: "Rosado", label: "Rosado" },
    { value: "Espumante", label: "Espumante" },
    { value: "Naranjo", label: "Naranjo" },
  ];

  const regions = [
    { value: "", label: "Todas las regiones" },
    { value: "Mendoza", label: "Mendoza" },
    { value: "Patagonia", label: "Patagonia" },
    { value: "San Juan", label: "San Juan" },
    { value: "Cafayate", label: "Cafayate" },
  ];

  const handlePriceChange = () => {
    const min = parseFloat(minPrice) || 0;
    const max = parseFloat(maxPrice) || 999999;

    onPriceRangeChange({ min, max });
  };

  const hasActiveFilters =
    selectedCategory ||
    selectedRegion ||
    searchQuery ||
    priceRange.min > 0 ||
    priceRange.max < 999999;

  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-8">
      <div className="flex flex-col lg:flex-row gap-4 items-end">
        {/* Búsqueda */}
        <div className="flex-1 lg:max-w-md">
          <Input
            placeholder="Buscar vinos..."
            startContent={<span className="text-gray-400">🔍</span>}
            value={searchQuery}
            variant="bordered"
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        {/* Categoría */}
        <div className="w-full lg:w-48">
          <select
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none"
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
          >
            {categories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>

        {/* Región */}
        <div className="w-full lg:w-48">
          <select
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none"
            value={selectedRegion}
            onChange={(e) => onRegionChange(e.target.value)}
          >
            {regions.map((region) => (
              <option key={region.value} value={region.value}>
                {region.label}
              </option>
            ))}
          </select>
        </div>

        {/* Rango de precio */}
        <div className="flex gap-2 items-center w-full lg:w-auto">
          <Input
            className="w-24"
            placeholder="Min"
            startContent={<span className="text-gray-400 text-sm">$</span>}
            type="number"
            value={minPrice}
            variant="bordered"
            onBlur={handlePriceChange}
            onChange={(e) => setMinPrice(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handlePriceChange()}
          />
          <span className="text-gray-400">-</span>
          <Input
            className="w-24"
            placeholder="Max"
            startContent={<span className="text-gray-400 text-sm">$</span>}
            type="number"
            value={maxPrice}
            variant="bordered"
            onBlur={handlePriceChange}
            onChange={(e) => setMaxPrice(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handlePriceChange()}
          />
        </div>

        {/* Botón limpiar filtros */}
        {hasActiveFilters && (
          <Button
            className="whitespace-nowrap"
            color="danger"
            variant="light"
            onClick={onClearFilters}
          >
            Limpiar filtros
          </Button>
        )}
      </div>
    </div>
  );
};

export default WineFilters;
