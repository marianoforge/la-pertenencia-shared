import type { NextApiRequest, NextApiResponse } from "next";

import { Wine } from "../../../types/wine";
import {
  getAllWines,
  addWine,
  getWineById,
  getWinesByCategory,
  searchWinesByName,
  getFeaturedWines,
} from "../../../lib/firestore";
import { createWineSchema } from "../../../lib/validators/wine";
import { sendSuccess, sendError, ApiResponse } from "../../../lib/apiHelpers";
import { ValidationError } from "../../../lib/errors";
import { logger } from "../../../lib/logger";
import { apiRateLimit } from "../../../lib/rateLimit";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<Wine[] | Wine>>,
) {
  // Rate limiting
  const rateLimitResult = apiRateLimit(req);
  if (!rateLimitResult.success) {
    return res.status(429).json({
      success: false,
      error: rateLimitResult.message || "Too many requests",
    });
  }

  if (req.method === "GET") {
    try {
      const { category, region, minPrice, maxPrice, featured, search } =
        req.query;

      let wines: Wine[];

      // Optimizar consultas usando funciones específicas de Firebase
      if (search) {
        wines = await searchWinesByName(String(search));
      } else if (category && category !== "all") {
        wines = await getWinesByCategory(String(category));
      } else if (featured === "true") {
        wines = await getFeaturedWines();
      } else {
        wines = await getAllWines();
      }

      // Aplicar filtros adicionales localmente
      let filteredWines = wines;

      if (region && region !== "all") {
        filteredWines = filteredWines.filter((wine) => wine.region === region);
      }

      if (minPrice) {
        filteredWines = filteredWines.filter(
          (wine) => wine.price >= Number(minPrice),
        );
      }

      if (maxPrice) {
        filteredWines = filteredWines.filter(
          (wine) => wine.price <= Number(maxPrice),
        );
      }

      return sendSuccess(res, filteredWines);
    } catch (error) {
      return sendError(res, error, "Failed to fetch wines");
    }
  } else if (req.method === "POST") {
    try {
      // Validar con Zod
      const validationResult = createWineSchema.safeParse(req.body);

      if (!validationResult.success) {
        throw new ValidationError(
          "Invalid wine data",
          validationResult.error.errors
        );
      }

      const wineData = validationResult.data;

      // Crear vino en Firebase
      const wineId = await addWine(wineData);

      // Obtener el vino recién creado para devolver con ID
      const newWine = await getWineById(wineId);

      return sendSuccess(res, newWine, 201);
    } catch (error) {
      return sendError(res, error, "Failed to create wine");
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).json({
      success: false,
      error: `Method ${req.method} Not Allowed`,
    });
  }
}
