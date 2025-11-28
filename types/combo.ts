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
  image: string; 
  backgroundImage: string; 
  featured: boolean; 
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateComboInput {
  name: string;
  wineIds: string[]; 
  price: number;
  image: string; 
  featured: boolean;
}
