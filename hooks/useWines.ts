import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import {
  Wine,
  CreateWineInput,
  UpdateWineInput,
  WineFilters,
} from "@/types/wine";
import {
  getAllWines,
  getWineById,
  addWine,
  updateWine as updateWineFirebase,
  deleteWine as deleteWineFirebase,
  getWinesByCategory,
  searchWinesByName,
} from "@/lib/firestore";
import { QUERY_CONFIG } from "@/lib/constants";

function applyFilters(wines: any[], filters?: WineFilters): any[] {
  if (!filters) return wines;

  return wines.filter((wine) => {
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesMarca = wine.marca?.toLowerCase().includes(searchLower);
      const matchesBodega = wine.bodega?.toLowerCase().includes(searchLower);
      const matchesDescription = wine.description
        ?.toLowerCase()
        .includes(searchLower);
      const matchesRegion = wine.region?.toLowerCase().includes(searchLower);

      if (
        !matchesMarca &&
        !matchesBodega &&
        !matchesDescription &&
        !matchesRegion
      ) {
        return false;
      }
    }

    if (filters.category && filters.category !== "all") {
      if (wine.tipo !== filters.category) return false;
    }

    if (filters.region && filters.region !== "all") {
      if (wine.region !== filters.region) return false;
    }

    if (filters.bodega && filters.bodega !== "all") {
      if (wine.bodega !== filters.bodega) return false;
    }

    if (filters.marca && filters.marca !== "all") {
      if (wine.marca !== filters.marca) return false;
    }

    if (filters.varietal && filters.varietal !== "all") {
      if (wine.varietal !== filters.varietal) return false;
    }

    if (filters.minPrice !== undefined && wine.price < filters.minPrice) {
      return false;
    }
    if (filters.maxPrice !== undefined && wine.price > filters.maxPrice) {
      return false;
    }

    if (filters.featured && !wine.featured) {
      return false;
    }

    return true;
  });
}

async function fetchWines(filters?: WineFilters): Promise<Wine[]> {
  try {
    let wines: any[];

    if (filters?.category && filters.category !== "all") {
      wines = await getWinesByCategory(filters.category);
    }
    else if (filters?.search) {
      wines = await searchWinesByName(filters.search);
    }
    else {
      wines = await getAllWines();
    }

    return applyFilters(wines, filters) as Wine[];
  } catch (error) {
    console.error("Error fetching wines:", error);
    throw new Error("Failed to fetch wines from Firebase");
  }
}

async function fetchWineById(id: string): Promise<Wine> {
  try {
    if (!id || id === "undefined") {
      throw new Error("Invalid wine ID");
    }

    const wine = await getWineById(id);

    if (!wine) {
      console.warn(`Wine with ID "${id}" not found in Firestore`);
      throw new Error("Wine not found");
    }

    return wine as Wine;
  } catch (error) {
    console.error("Error fetching wine by ID:", error);
    throw error;
  }
}

async function createWine(wineData: CreateWineInput): Promise<Wine> {
  try {
    const wineId = await addWine(wineData);

    if (!wineId) {
      throw new Error("Failed to create wine");
    }

    // Obtener el vino recién creado
    const newWine = await getWineById(wineId);

    if (!newWine) {
      throw new Error("Failed to fetch created wine");
    }

    return newWine as Wine;
  } catch (error) {
    console.error("Error creating wine:", error);
    throw new Error("Failed to create wine in Firebase");
  }
}

async function updateWine(wineData: UpdateWineInput): Promise<Wine> {
  try {
    const success = await updateWineFirebase(wineData.id, wineData);

    if (!success) {
      throw new Error("Failed to update wine");
    }

    const updatedWine = await getWineById(wineData.id);

    if (!updatedWine) {
      throw new Error("Failed to fetch updated wine");
    }

    return updatedWine as Wine;
  } catch (error) {
    console.error("Error updating wine:", error);
    throw new Error("Failed to update wine in Firebase");
  }
}

async function deleteWine(id: string): Promise<void> {
  try {
    const success = await deleteWineFirebase(id);

    if (!success) {
      throw new Error("Failed to delete wine");
    }
  } catch (error) {
    console.error("Error deleting wine:", error);
    throw new Error("Failed to delete wine from Firebase");
  }
}

export function useWines(filters?: WineFilters) {
  return useQuery({
    queryKey: ["wines", filters],
    queryFn: () => fetchWines(filters),
    staleTime: QUERY_CONFIG.STALE_TIME.MEDIUM,
    retry: QUERY_CONFIG.RETRY.DEFAULT,
    retryDelay: QUERY_CONFIG.RETRY_DELAY,
  });
}

export const useWine = (id: string) => {
  return useQuery({
    queryKey: ["wine", id],
    queryFn: () => fetchWineById(id),
    enabled: !!id && id !== "undefined",
    staleTime: QUERY_CONFIG.STALE_TIME.MEDIUM,
    retry: QUERY_CONFIG.RETRY.SHORT,
    retryDelay: QUERY_CONFIG.RETRY_DELAY,
  });
};

export function useCreateWine() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createWine,
    onSuccess: (newWine) => {
      queryClient.invalidateQueries({ queryKey: ["wines"] });
      queryClient.setQueryData(["wine", newWine.id], newWine);

      console.log("Wine created successfully:", newWine.marca);
    },
    onError: (error) => {
      console.error("Error creating wine:", error);
    },
  });
}

export function useUpdateWine() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateWine,
    onSuccess: (updatedWine) => {
      queryClient.invalidateQueries({ queryKey: ["wines"] });
      queryClient.setQueryData(["wine", updatedWine.id], updatedWine);

      console.log("Wine updated successfully:", updatedWine.marca);
    },
    onError: (error) => {
      console.error("Error updating wine:", error);
    },
  });
}

export function useDeleteWine() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteWine,
    onSuccess: (_, deletedId) => {
      queryClient.invalidateQueries({ queryKey: ["wines"] });
      queryClient.removeQueries({ queryKey: ["wine", deletedId] });

      console.log("Wine deleted successfully");
    },
    onError: (error) => {
      console.error("Error deleting wine:", error);
    },
  });
}

export function useWinesByCategory(category: string) {
  return useQuery({
    queryKey: ["wines", "category", category],
    queryFn: () => getWinesByCategory(category),
    enabled: !!category && category !== "all",
    staleTime: QUERY_CONFIG.STALE_TIME.LONG,
  });
}

export function useSearchWines(searchTerm: string) {
  return useQuery({
    queryKey: ["wines", "search", searchTerm],
    queryFn: () => searchWinesByName(searchTerm),
    enabled: !!searchTerm && searchTerm.length >= 2,
    staleTime: QUERY_CONFIG.STALE_TIME.SHORT,
  });
}
