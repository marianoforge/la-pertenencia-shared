import { NextApiRequest, NextApiResponse } from "next";

import { reduceWineStockServerSide } from "@/lib/firestore-server";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método no permitido" });
  }

  try {
    const { items } = req.body;

    if (!items || !Array.isArray(items)) {
      return res.status(400).json({
        message:
          "Se requiere un array de items: [{ wine_id: string, quantity: number }]",
      });
    }

    console.log("🧪 SIMULANDO WEBHOOK - Reduciendo stock para items:", items);

    const results = [];

    // Procesar cada item para reducir stock
    for (const item of items) {
      const result = await reduceWineStockServerSide(
        item.wine_id,
        item.quantity,
      );

      if (result.success) {
        console.log(
          `✅ Stock reduced for wine ${item.wine_id}: ${item.quantity} units. New stock: ${result.newStock}`,
        );
        results.push({
          wine_id: item.wine_id,
          success: true,
          quantity_reduced: item.quantity,
          new_stock: result.newStock,
        });
      } else {
        console.error(
          `❌ Failed to reduce stock for wine ${item.wine_id}: ${result.error}`,
        );
        results.push({
          wine_id: item.wine_id,
          success: false,
          error: result.error,
        });
      }
    }

    res.status(200).json({
      message: "Stock reduction test completed",
      results: results,
    });
  } catch (error) {
    console.error("Error in test webhook:", error);
    res.status(500).json({
      message: "Error processing test webhook",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
