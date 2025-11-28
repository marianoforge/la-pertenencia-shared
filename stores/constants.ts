import { WineFilters } from "@/types/wine";

export const INITIAL_WINE_FILTERS: WineFilters = {
  category: undefined,
  region: undefined,
  minPrice: undefined,
  maxPrice: undefined,
  featured: undefined,
  search: undefined,
} as const;

export const CART_NOTIFICATION_DURATION = 3000;

