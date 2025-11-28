export const SORT_OPTIONS = [
  { value: "relevance", label: "Más relevantes" },
  { value: "price-asc", label: "Precio: menor a mayor" },
  { value: "price-desc", label: "Precio: mayor a menor" },
  { value: "name-asc", label: "Nombre: A-Z" },
  { value: "name-desc", label: "Nombre: Z-A" },
  { value: "name", label: "Nombre A-Z" },
  { value: "newest", label: "Más recientes" },
] as const;

export const REGION_OPTIONS = [
  { value: "", label: "Todas las bodegas" },
  { value: "mendoza", label: "Mendoza" },
  { value: "san-juan", label: "San Juan" },
  { value: "salta", label: "Salta" },
  { value: "rio-negro", label: "Río Negro" },
] as const;

export const BRAND_OPTIONS = [
  { value: "", label: "Todas las marcas" },
  { value: "la-pertenencia", label: "La Pertenencia" },
  { value: "premium", label: "Premium" },
  { value: "reserva", label: "Reserva" },
] as const;

export const WINE_TYPE_OPTIONS = [
  { value: "", label: "Todos los tipos" },
  { value: "Tinto", label: "Tinto" },
  { value: "Blanco", label: "Blanco" },
  { value: "Red", label: "Red" },
  { value: "Blend", label: "Blend" },
  { value: "Rosado", label: "Rosado" },
  { value: "Espumante", label: "Espumante" },
  { value: "Naranjo", label: "Naranjo" },
] as const;

export const VARIETAL_OPTIONS = [
  { value: "", label: "Todos los varietales" },
  { value: "Malbec", label: "Malbec" },
  { value: "Cabernet Sauvignon", label: "Cabernet Sauvignon" },
  { value: "Merlot", label: "Merlot" },
  { value: "Pinot Noir", label: "Pinot Noir" },
  { value: "Cabernet Franc", label: "Cabernet Franc" },
  { value: "Syrah", label: "Syrah" },
  { value: "Chardonnay", label: "Chardonnay" },
  { value: "Sauvignon Blanc", label: "Sauvignon Blanc" },
  { value: "Petit Verdot", label: "Petit Verdot" },
  { value: "Pinot Gris", label: "Pinot Gris" },
  { value: "Bonarda", label: "Bonarda" },
  { value: "Criolla", label: "Criolla" },
  { value: "Moscatel", label: "Moscatel" },
  { value: "Sangiovese", label: "Sangiovese" },
  { value: "Torrontés", label: "Torrontés" },
  { value: "Otros...", label: "Otros..." },
] as const;

export const COLOR_OPTIONS = [
  "Tinto",
  "Blanco",
  "Rosado",
] as const;

export const SPARKLING_OPTIONS = [
  "Sí",
  "No",
] as const;

