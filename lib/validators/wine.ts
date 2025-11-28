/**
 * Validación de vinos con Zod
 */

import { z } from 'zod';

export const wineTypeSchema = z.enum([
  "Tinto",
  "Blanco",
  "Rosado",
  "Espumante",
  "Naranjo",
  "Combo",
]);

export const createWineSchema = z.object({
  marca: z.string().min(1, "La marca es requerida").trim(),
  bodega: z.string().min(1, "La bodega es requerida").trim(),
  tipo: wineTypeSchema,
  varietal: z.string().min(1, "El varietal es requerido").trim(),
  maridaje: z.string().optional(),
  description: z.string().optional(),
  price: z.number().positive("El precio debe ser mayor a 0"),
  cost: z.number().positive("El costo debe ser mayor a 0"),
  iva: z.number().min(0).max(50, "El IVA debe estar entre 0% y 50%"),
  stock: z.number().int().min(0, "El stock no puede ser negativo"),
  region: z.string().min(1, "La región es requerida").trim(),
  vintage: z.number()
    .int()
    .min(1900, "El año debe ser válido")
    .max(new Date().getFullYear() + 1, "El año no puede ser futuro"),
  alcohol: z.number()
    .positive("El alcohol debe ser mayor a 0")
    .max(20, "El alcohol debe estar entre 0 y 20%"),
  image: z.string().url("La imagen debe ser una URL válida").or(z.literal("")),
  featured: z.boolean(),
  winery: z.string().min(1, "La bodega es requerida").trim(),
  boxSize: z.number().int().positive().optional(),
});

export const updateWineSchema = createWineSchema.partial().extend({
  id: z.string().min(1),
});

export type CreateWineInput = z.infer<typeof createWineSchema>;
export type UpdateWineInput = z.infer<typeof updateWineSchema>;

