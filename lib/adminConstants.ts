export const WINE_TYPES = [
  "Tinto",
  "Blanco",
  "Red",
  "Blend",
  "Rosado",
  "Espumante",
  "Naranjo",
  "Combo",
] as const;

export type WineType = (typeof WINE_TYPES)[number];

export const WINE_VARIETALS = [
  "Malbec",
  "Cabernet Sauvignon",
  "Merlot",
  "Pinot Noir",
  "Cabernet Franc",
  "Syrah",
  "Chardonnay",
  "Sauvignon Blanc",
  "Petit Verdot",
  "Pinot Gris",
  "Bonarda",
  "Criolla",
  "Moscatel",
  "Sangiovese",
  "Torrontés",
  "Otros...",
] as const;

export type WineVarietal = (typeof WINE_VARIETALS)[number];

export const ITEMS_PER_PAGE = 10;

export const DEFAULT_WINE_VALUES = {
  marca: "",
  bodega: "",
  tipo: "Tinto" as WineType,
  varietal: "Malbec" as WineVarietal,
  maridaje: "",
  description: "",
  price: 0,
  cost: 0,
  iva: 0,
  region: "Mendoza",
  vintage: new Date().getFullYear(),
  alcohol: 14.0,
  stock: 0,
  image: "",
  featured: false,
  winery: "La Pertenencia",
};

export const DEFAULT_COMBO_VALUES = {
  name: "",
  selectedWineIds: [] as string[],
  price: 0,
  image: "",
  featured: false,
};

export const DEFAULT_SHIPPING_SETTINGS = {
  shippingEnabled: true,
  shippingCost: 500,
};
