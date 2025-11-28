"use client";

import { useState } from "react";
import { Card } from "@heroui/card";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Spinner } from "@heroui/spinner";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

import { useWines, useWinesByCategory, useSearchWines } from "@/hooks/useWines";
import { WineFilters } from "@/types/wine";

export default function WineList() {
  const [filters, setFilters] = useState<WineFilters>({});
  const [searchTerm, setSearchTerm] = useState("");

  // Usar los hooks de TanStack Query
  const { data: wines = [], isLoading, error, refetch } = useWines(filters);

  // Hook de búsqueda (solo se ejecuta si hay término de búsqueda)
  const { data: searchResults = [], isLoading: searchLoading } =
    useSearchWines(searchTerm);

  // Usar el hook de categoría si está seleccionada
  const { data: categoryWines = [], isLoading: categoryLoading } =
    useWinesByCategory(filters.category || "");

  const handleFilterChange = (key: keyof WineFilters, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value === "" ? undefined : value,
    }));
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    // Limpiar otros filtros cuando buscamos
    if (value) {
      setFilters({});
    }
  };

  const clearFilters = () => {
    setFilters({});
    setSearchTerm("");
  };

  // Determinar qué datos mostrar
  const displayWines = searchTerm
    ? searchResults
    : filters.category
      ? categoryWines
      : wines;

  const isLoadingAny = isLoading || searchLoading || categoryLoading;

  if (error) {
    return (
      <Card className="p-8 text-center">
        <h3 className="text-xl font-bold text-red-600 mb-4">
          Error al cargar vinos
        </h3>
        <p className="text-gray-600 mb-4">
          {error.message || "Ocurrió un error inesperado"}
        </p>
        <Button color="primary" onPress={() => refetch()}>
          Reintentar
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">🍷 Filtros</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Búsqueda */}
          <Input
            isClearable
            label="Buscar vinos"
            placeholder="Nombre, descripción, región..."
            startContent={<span>🔍</span>}
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            onClear={() => setSearchTerm("")}
          />

          {/* Categoría */}
          <div>
            <label
              className="block text-sm font-medium mb-1"
              htmlFor="category-select"
            >
              Tipo
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              id="category-select"
              value={filters.category || ""}
              onChange={(e) => handleFilterChange("category", e.target.value)}
            >
              <option value="">Todos</option>
              <option value="Tinto">Tinto</option>
              <option value="Blanco">Blanco</option>
              <option value="Red">Red</option>
              <option value="Blend">Blend</option>
              <option value="Rosado">Rosado</option>
              <option value="Espumante">Espumante</option>
              <option value="Naranjo">Naranjo</option>
            </select>
          </div>

          {/* Región */}
          <Input
            label="Región"
            placeholder="Ej: Mendoza"
            value={filters.region || ""}
            onChange={(e) => handleFilterChange("region", e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {/* Precio mínimo */}
          <Input
            label="Precio mínimo"
            placeholder="0"
            startContent={<span className="text-gray-500">$</span>}
            type="number"
            value={filters.minPrice?.toString() || ""}
            onChange={(e) =>
              handleFilterChange(
                "minPrice",
                e.target.value ? Number(e.target.value) : undefined,
              )
            }
          />

          {/* Precio máximo */}
          <Input
            label="Precio máximo"
            placeholder="10000"
            startContent={<span className="text-gray-500">$</span>}
            type="number"
            value={filters.maxPrice?.toString() || ""}
            onChange={(e) =>
              handleFilterChange(
                "maxPrice",
                e.target.value ? Number(e.target.value) : undefined,
              )
            }
          />

          {/* Solo destacados */}
          <div className="flex items-center space-x-2 mt-6">
            <input
              checked={filters.featured || false}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              id="featured"
              type="checkbox"
              onChange={(e) =>
                handleFilterChange("featured", e.target.checked || undefined)
              }
            />
            <label
              className="text-sm font-medium text-gray-700"
              htmlFor="featured"
            >
              Solo vinos destacados
            </label>
          </div>
        </div>

        <div className="flex justify-between items-center mt-4">
          <Button color="default" variant="bordered" onPress={clearFilters}>
            Limpiar filtros
          </Button>

          <div className="text-sm text-gray-600">
            {isLoadingAny ? (
              <span className="flex items-center">
                <Spinner className="mr-2" size="sm" />
                Cargando...
              </span>
            ) : (
              `${displayWines.length} vino${displayWines.length !== 1 ? "s" : ""} encontrado${displayWines.length !== 1 ? "s" : ""}`
            )}
          </div>
        </div>
      </Card>

      {/* Lista de vinos */}
      {isLoadingAny ? (
        <SkeletonTheme baseColor="#f3f3f3" highlightColor="#e0e0e0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} className="p-4">
                <Skeleton className="rounded-lg mb-4" height={200} />
                <Skeleton className="mb-2" height={20} />
                <Skeleton className="mb-3" height={16} width="80%" />
                <Skeleton className="mb-4" height={24} width="60%" />
                <Skeleton className="rounded" height={36} />
              </Card>
            ))}
          </div>
        </SkeletonTheme>
      ) : displayWines.length === 0 ? (
        <Card className="p-8 text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No se encontraron vinos
          </h3>
          <p className="text-gray-600">
            {searchTerm || Object.keys(filters).length > 0
              ? "Intenta cambiar los filtros o términos de búsqueda"
              : "No hay vinos disponibles en este momento"}
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayWines.map((wine) => (
            <Card key={wine.id} className="overflow-hidden">
              <div className="aspect-square">
                <img
                  alt={wine.marca}
                  className="w-full h-full object-cover"
                  src={wine.image}
                />
              </div>

              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {wine.marca}
                  </h3>
                  {wine.featured && (
                    <span className="text-yellow-500 text-lg">⭐</span>
                  )}
                </div>

                <p className="text-sm text-gray-600 mb-2">
                  {wine.tipo} • {wine.region} • {wine.vintage}
                </p>

                <p className="text-sm text-gray-700 mb-3 line-clamp-2">
                  {wine.description}
                </p>

                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-xl font-bold text-gray-900">
                      ${wine.price}
                    </span>
                    <span className="text-sm text-gray-500 ml-2">
                      {wine.alcohol}% vol
                    </span>
                  </div>

                  <div className="text-sm text-gray-600">
                    Stock: {wine.stock}
                  </div>
                </div>

                <Button
                  className="w-full mt-3"
                  color="primary"
                  isDisabled={wine.stock <= 0}
                >
                  {wine.stock > 0 ? "Agregar al carrito" : "Sin stock"}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
