export interface ComboWine {
  id: string;
  marca: string;
  image: string;
}

export interface Combo {
  id: string;
  name: string;
  description: string[];
  wines: ComboWine[];
  price: number;
  image: string; // Imagen de los vinos del combo
  backgroundImage: string; // Imagen de fondo
  featured: boolean; // Para mostrar en el carousel
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateComboInput {
  name: string;
  wineIds: string[]; // IDs de los vinos seleccionados
  price: number;
  image: string; // Solo la imagen de los vinos, el fondo es fijo
  featured: boolean;
}
