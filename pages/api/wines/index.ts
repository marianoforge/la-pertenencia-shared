import type { NextApiRequest, NextApiResponse } from "next";

import { Wine, CreateWineInput } from "../../../types/wine";
import {
  getAllWines,
  addWine,
  getWineById,
  getWinesByCategory,
  searchWinesByName,
  getFeaturedWines,
} from "../../../lib/firestore";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
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

      res.status(200).json(filteredWines);
    } catch (error) {
      console.error("Error fetching wines:", error);
      res.status(500).json({ error: "Failed to fetch wines" });
    }
  } else if (req.method === "POST") {
    try {
      const wineData: CreateWineInput = req.body;

      // Validar datos requeridos
      if (!wineData.marca || !wineData.winery || !wineData.price) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // Crear vino en Firebase
      const wineId = await addWine(wineData);

      if (!wineId) {
        return res.status(500).json({ error: "Failed to create wine" });
      }

      // Obtener el vino recién creado para devolver con ID
      const newWine = await getWineById(wineId);

      res.status(201).json(newWine);
    } catch (error) {
      console.error("Error creating wine:", error);
      res.status(500).json({ error: "Failed to create wine" });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
