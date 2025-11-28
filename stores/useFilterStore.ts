import { create } from "zustand";

import { WineFilters } from "@/types/wine";
import { INITIAL_WINE_FILTERS } from "./constants";

interface FilterState {
  isOpen: boolean;
  filters: WineFilters;
  sortBy: string;

  // Actions
  toggleFilters: () => void;
  closeFilters: () => void;
  updateFilters: (newFilters: WineFilters) => void;
  updateSort: (sortBy: string) => void;
  clearFilters: () => void;
}

export const useFilterStore = create<FilterState>((set, get) => ({
  isOpen: false,
  filters: INITIAL_WINE_FILTERS,
  sortBy: "relevance",

  toggleFilters: () => set((state) => ({ isOpen: !state.isOpen })),
  closeFilters: () => set({ isOpen: false }),

  updateFilters: (newFilters: WineFilters) =>
    set({ filters: { ...get().filters, ...newFilters } }),

  updateSort: (sortBy: string) => set({ sortBy }),

  clearFilters: () => set({ filters: INITIAL_WINE_FILTERS }),
}));
