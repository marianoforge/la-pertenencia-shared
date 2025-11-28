"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "@/lib/firebase";
import { Combo, CreateComboInput } from "@/types/combo";
import { QUERY_CONFIG } from "@/lib/constants";

const combosCollection = collection(db, "combos");

export const getCombos = async (): Promise<Combo[]> => {
  try {
    const q = query(combosCollection, orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt:
        doc.data().createdAt?.toDate?.()?.toISOString() ||
        new Date().toISOString(),
      updatedAt:
        doc.data().updatedAt?.toDate?.()?.toISOString() ||
        new Date().toISOString(),
    })) as Combo[];
  } catch (error) {
    console.error("Error fetching combos:", error);
    throw error;
  }
};

export const getFeaturedCombos = async (): Promise<Combo[]> => {
  try {
    const q = query(
      combosCollection,
      where("featured", "==", true),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt:
        doc.data().createdAt?.toDate?.()?.toISOString() ||
        new Date().toISOString(),
      updatedAt:
        doc.data().updatedAt?.toDate?.()?.toISOString() ||
        new Date().toISOString(),
    })) as Combo[];
  } catch (error) {
    console.error("Error fetching featured combos:", error);
    throw error;
  }
};

export const getCombo = async (id: string): Promise<Combo | null> => {
  try {
    const docRef = doc(db, "combos", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
        createdAt:
          docSnap.data().createdAt?.toDate?.()?.toISOString() ||
          new Date().toISOString(),
        updatedAt:
          docSnap.data().updatedAt?.toDate?.()?.toISOString() ||
          new Date().toISOString(),
      } as Combo;
    }

    return null;
  } catch (error) {
    console.error("Error fetching combo:", error);
    throw error;
  }
};

export const createCombo = async (
  comboData: CreateComboInput & { wines: any[] }
): Promise<Combo> => {
  try {
    const docRef = await addDoc(combosCollection, {
      ...comboData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    const newCombo = await getCombo(docRef.id);
    if (!newCombo) {
      throw new Error("Error retrieving created combo");
    }

    return newCombo;
  } catch (error) {
    console.error("Error creating combo:", error);
    throw error;
  }
};

export const updateCombo = async (
  id: string,
  comboData: Partial<Combo>
): Promise<Combo> => {
  try {
    const docRef = doc(db, "combos", id);
    await updateDoc(docRef, {
      ...comboData,
      updatedAt: serverTimestamp(),
    });

    const updatedCombo = await getCombo(id);
    if (!updatedCombo) {
      throw new Error("Error retrieving updated combo");
    }

    return updatedCombo;
  } catch (error) {
    console.error("Error updating combo:", error);
    throw error;
  }
};

export const deleteCombo = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, "combos", id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting combo:", error);
    throw error;
  }
};

// Hooks de React Query

// Hook para obtener todos los combos
export const useCombos = () => {
  return useQuery({
    queryKey: ["combos"],
    queryFn: getCombos,
    staleTime: QUERY_CONFIG.STALE_TIME.LONG,
  });
};

export const useFeaturedCombos = () => {
  return useQuery({
    queryKey: ["combos", "featured"],
    queryFn: getFeaturedCombos,
    staleTime: QUERY_CONFIG.STALE_TIME.LONG,
  });
};

export const useCombo = (id: string) => {
  return useQuery({
    queryKey: ["combo", id],
    queryFn: () => getCombo(id),
    enabled: !!id,
  });
};

export function useCreateCombo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCombo,
    onSuccess: (newCombo) => {
      queryClient.invalidateQueries({ queryKey: ["combos"] });
      queryClient.setQueryData(["combo", newCombo.id], newCombo);

      console.log("Combo created successfully:", newCombo.name);
    },
    onError: (error) => {
      console.error("Error creating combo:", error);
    },
  });
}

export function useUpdateCombo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...data }: { id: string } & Partial<Combo>) =>
      updateCombo(id, data),
    onSuccess: (updatedCombo) => {
      // Invalidar queries de combos
      queryClient.invalidateQueries({ queryKey: ["combos"] });

      // Actualizar el combo específico en el cache
      queryClient.setQueryData(["combo", updatedCombo.id], updatedCombo);

      console.log("Combo updated successfully:", updatedCombo.name);
    },
    onError: (error) => {
      console.error("Error updating combo:", error);
    },
  });
}

export function useDeleteCombo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCombo,
    onSuccess: (_, deletedId) => {
      queryClient.invalidateQueries({ queryKey: ["combos"] });
      queryClient.removeQueries({ queryKey: ["combo", deletedId] });

      console.log("Combo deleted successfully");
    },
    onError: (error) => {
      console.error("Error deleting combo:", error);
    },
  });
}
