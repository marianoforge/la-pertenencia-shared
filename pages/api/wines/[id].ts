import type { NextApiRequest, NextApiResponse } from "next";

import { UpdateWineInput } from "../../../types/wine";
import { getWineById, updateWine, deleteWine } from "../../../lib/firestore";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { id } = req.query;

  if (typeof id !== "string") {
    return res.status(400).json({ error: "Invalid wine ID" });
  }

  if (req.method === "GET") {
    try {
      const wine = await getWineById(id);

      if (!wine) {
        return res.status(404).json({ error: "Wine not found" });
      }

      res.status(200).json(wine);
    } catch (error) {
      console.error("Error fetching wine:", error);
      res.status(500).json({ error: "Failed to fetch wine" });
    }
  } else if (req.method === "PUT") {
    try {
      const updateData: UpdateWineInput = req.body;

      // Verificar que el vino existe antes de actualizar
      const existingWine = await getWineById(id);

      if (!existingWine) {
        return res.status(404).json({ error: "Wine not found" });
      }

      // Actualizar el vino en Firebase
      const success = await updateWine(id, updateData);

      if (!success) {
        return res.status(500).json({ error: "Failed to update wine" });
      }

      // Obtener el vino actualizado
      const updatedWine = await getWineById(id);

      res.status(200).json(updatedWine);
    } catch (error) {
      console.error("Error updating wine:", error);
      res.status(500).json({ error: "Failed to update wine" });
    }
  } else if (req.method === "DELETE") {
    try {
      // Verificar que el vino existe antes de eliminar
      const existingWine = await getWineById(id);

      if (!existingWine) {
        return res.status(404).json({ error: "Wine not found" });
      }

      // Eliminar el vino de Firebase
      const success = await deleteWine(id);

      if (!success) {
        return res.status(500).json({ error: "Failed to delete wine" });
      }

      res
        .status(200)
        .json({ message: "Wine deleted successfully", wine: existingWine });
    } catch (error) {
      console.error("Error deleting wine:", error);
      res.status(500).json({ error: "Failed to delete wine" });
    }
  } else {
    res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
