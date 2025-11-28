


import { db as adminDb } from "@/lib/firebaseAdmin";
import { Wine } from "@/types/wine";


const COLLECTIONS = {
  WINES: "wines",
  ORDERS: "orders",
  USERS: "users",
  CATEGORIES: "categories",
} as const;


export const reduceWineStockServerSide = async (
  wineId: string,
  quantity: number,
): Promise<{ success: boolean; newStock?: number; error?: string }> => {
  try {
    const wineDoc = adminDb.collection(COLLECTIONS.WINES).doc(wineId);

    
    const result = await adminDb.runTransaction(async (transaction) => {
      const wineSnapshot = await transaction.get(wineDoc);

      if (!wineSnapshot.exists) {
        throw new Error(`Wine with ID ${wineId} not found`);
      }

      const wineData = wineSnapshot.data() as Wine;
      const currentStock = wineData.stock || 0;

      if (currentStock < quantity) {
        throw new Error(
          `Insufficient stock. Available: ${currentStock}, Requested: ${quantity}`,
        );
      }

      const newStock = currentStock - quantity;

      
      transaction.update(wineDoc, {
        stock: newStock,
        updatedAt: new Date().toISOString(),
      });

      return newStock;
    });

    console.log(
      `✅ [SERVER] Stock reduced for wine ${wineId}: ${quantity} units. New stock: ${result}`,
    );

    return { success: true, newStock: result };
  } catch (error) {
    console.error("❌ [SERVER] Error reducing wine stock:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    return { success: false, error: errorMessage };
  }
};
