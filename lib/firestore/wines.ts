/**
 * 🍷 Wine Management Functions
 */

import {
  collection,
  getDocs,
  getDoc,
  doc,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  runTransaction,
  QuerySnapshot,
  DocumentSnapshot,
  QueryDocumentSnapshot,
} from "firebase/firestore";

import { db } from "@/lib/firebase";
import { deleteImageByUrl } from "@/lib/storage";
import { Wine } from "@/types/wine";
import { FirestoreError, WineNotFoundError } from "@/lib/errors";
import { logger } from "@/lib/logger";
import { getPaginated, PaginatedResult, PaginationOptions } from "./pagination";

const COLLECTION = "wines";

// Helper function to generate custom wine ID: marca-varietal-uid
export const generateWineId = (marca: string, varietal: string): string => {
  const cleanMarca = marca
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .replace(/[^a-z0-9]/g, "-") // Replace non-alphanumeric with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single
    .replace(/^-|-$/g, ""); // Remove leading/trailing hyphens

  const cleanVarietal = varietal
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  const uid = Date.now().toString(36) + Math.random().toString(36).substr(2, 5);

  return `${cleanMarca}-${cleanVarietal}-${uid}`;
};

// Get all wines (mantiene compatibilidad, pero considera usar getWinesPaginated)
export const getAllWines = async (): Promise<Wine[]> => {
  try {
    const winesCollection = collection(db, COLLECTION);
    const snapshot: QuerySnapshot = await getDocs(winesCollection);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Wine[];
  } catch (error) {
    logger.error("Error fetching wines from Firestore", error);
    throw new FirestoreError("Failed to fetch wines", error);
  }
};

// Get wines with pagination (recomendado para grandes volúmenes)
export const getWinesPaginated = async (
  options: PaginationOptions = {}
): Promise<PaginatedResult<Wine>> => {
  return getPaginated<Wine>(COLLECTION, {
    pageSize: 20,
    orderByField: "createdAt",
    orderDirection: "desc",
    ...options,
  });
};

// Get wine by ID
export const getWineById = async (id: string): Promise<Wine> => {
  try {
    if (!id || id === "undefined") {
      throw new WineNotFoundError(id);
    }

    const wineDoc = doc(db, COLLECTION, id);
    const snapshot: DocumentSnapshot = await getDoc(wineDoc);

    if (!snapshot.exists()) {
      throw new WineNotFoundError(id);
    }

    return {
      id: snapshot.id,
      ...snapshot.data(),
    } as Wine;
  } catch (error) {
    if (error instanceof WineNotFoundError) {
      throw error;
    }
    logger.error("Error fetching wine by ID", error);
    throw new FirestoreError("Failed to fetch wine", error);
  }
};

// Get wines by category (using tipo field)
export const getWinesByCategory = async (category: string): Promise<Wine[]> => {
  try {
    const winesCollection = collection(db, COLLECTION);
    const q = query(
      winesCollection,
      where("tipo", "==", category),
      orderBy("marca"),
    );
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Wine[];
  } catch (error) {
    logger.error("Error fetching wines by category", error);
    throw new FirestoreError("Failed to fetch wines by category", error);
  }
};

// Get featured wines
export const getFeaturedWines = async (): Promise<Wine[]> => {
  try {
    const winesCollection = collection(db, COLLECTION);
    const q = query(
      winesCollection,
      where("featured", "==", true),
      orderBy("marca"),
      limit(6),
    );
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Wine[];
  } catch (error) {
    logger.error("Error fetching featured wines", error);
    throw new FirestoreError("Failed to fetch featured wines", error);
  }
};

// Add new wine with custom ID format: marca-varietal-uid
export const addWine = async (
  wineData: Omit<Wine, "id" | "createdAt" | "updatedAt">,
): Promise<string> => {
  try {
    const customId = generateWineId(wineData.marca, wineData.varietal);
    const wineDocRef = doc(db, COLLECTION, customId);
    const now = new Date().toISOString();

    await setDoc(wineDocRef, {
      ...wineData,
      createdAt: now,
      updatedAt: now,
    });

    return customId;
  } catch (error) {
    logger.error("Error adding wine", error);
    throw new FirestoreError("Failed to add wine", error);
  }
};

// Update wine
export const updateWine = async (
  id: string,
  wineData: Partial<Wine>,
): Promise<boolean> => {
  try {
    const wineDoc = doc(db, COLLECTION, id);

    await updateDoc(wineDoc, {
      ...wineData,
      updatedAt: new Date().toISOString(),
    });

    return true;
  } catch (error) {
    logger.error("Error updating wine", error);
    throw new FirestoreError("Failed to update wine", error);
  }
};

// Delete wine and associated image from Storage
export const deleteWine = async (id: string): Promise<boolean> => {
  try {
    const wineDoc = doc(db, COLLECTION, id);

    // Get wine data to retrieve image URL
    const wineSnapshot = await getDoc(wineDoc);

    if (!wineSnapshot.exists()) {
      return false;
    }

    const wineData = wineSnapshot.data() as Wine;

    // Delete wine document
    await deleteDoc(wineDoc);

    // Delete associated image from Storage if it exists and is not a placeholder
    if (
      wineData.image &&
      wineData.image.includes("firebasestorage.googleapis.com")
    ) {
      try {
        await deleteImageByUrl(wineData.image);
      } catch (error) {
        logger.warn("Failed to delete wine image from storage", error);
        // Continue even if image deletion fails
      }
    }

    return true;
  } catch (error) {
    logger.error("Error deleting wine", error);
    throw new FirestoreError("Failed to delete wine", error);
  }
};

// Reduce wine stock (transactional to prevent race conditions)
export const reduceWineStock = async (
  wineId: string,
  quantity: number,
): Promise<{ success: boolean; newStock?: number; error?: string }> => {
  try {
    const wineDoc = doc(db, COLLECTION, wineId);

    const result = await runTransaction(db, async (transaction) => {
      const wineSnapshot = await transaction.get(wineDoc);

      if (!wineSnapshot.exists()) {
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

      // Update the wine document with new stock
      transaction.update(wineDoc, {
        stock: newStock,
        updatedAt: new Date().toISOString(),
      });

      return newStock;
    });

    return { success: true, newStock: result };
  } catch (error) {
    logger.error("Error reducing wine stock", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    return { success: false, error: errorMessage };
  }
};

// Search wines by name
export const searchWinesByName = async (
  searchTerm: string,
): Promise<Wine[]> => {
  try {
    const winesCollection = collection(db, COLLECTION);
    const snapshot = await getDocs(winesCollection);

    const allWines = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Wine[];

    // Client-side filtering for name search (Firestore doesn't support full-text search)
    return allWines.filter(
      (wine) =>
        wine.marca?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        wine.bodega?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        wine.description?.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  } catch (error) {
    logger.error("Error searching wines", error);
    throw new FirestoreError("Failed to search wines", error);
  }
};

// Migration function to import initial wine data
export const migrateWineData = async (
  wines: Omit<Wine, "id">[],
): Promise<boolean> => {
  try {
    const winesCollection = collection(db, COLLECTION);

    for (const wine of wines) {
      await addDoc(winesCollection, wine);
    }

    logger.info("Wine data migration completed");
    return true;
  } catch (error) {
    logger.error("Error migrating wine data", error);
    throw new FirestoreError("Failed to migrate wine data", error);
  }
};

