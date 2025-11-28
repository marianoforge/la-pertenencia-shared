import { useQuery } from "@tanstack/react-query";

import { getAllWines } from "@/lib/firestore";

export interface FilterOptions {
  bodegas: string[];
  marcas: string[];
  tipos: string[];
  varietales: string[];
}

export const useWineFilterOptions = () => {
  return useQuery<FilterOptions>({
    queryKey: ["wine-filter-options"],
    queryFn: async (): Promise<FilterOptions> => {
      try {
        const wines = await getAllWines();

        // Extraer valores únicos para cada filtro usando los campos correctos
        const bodegas = Array.from(
          new Set(wines.map((wine) => wine.bodega).filter(Boolean)),
        ).sort();
        const marcas = Array.from(
          new Set(wines.map((wine) => wine.marca).filter(Boolean)),
        ).sort();
        const tipos = Array.from(
          new Set(wines.map((wine) => wine.tipo).filter(Boolean)),
        ).sort();
        const varietales = Array.from(
          new Set(wines.map((wine) => wine.varietal).filter(Boolean)),
        ).sort();

        return {
          bodegas,
          marcas,
          tipos,
          varietales,
        };
      } catch (error) {
        console.error("Error fetching wine filter options:", error);

        return {
          bodegas: [],
          marcas: [],
          tipos: [],
          varietales: [],
        };
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
  });
};
