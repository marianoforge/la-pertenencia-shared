/**
 * Utilidades de paginación para Firestore
 */

import {
  collection,
  query,
  getDocs,
  orderBy,
  limit,
  startAfter,
  QueryDocumentSnapshot,
  DocumentData,
  QueryConstraint,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { FirestoreError } from "@/lib/errors";
import { logger } from "@/lib/logger";

export interface PaginatedResult<T> {
  items: T[];
  lastDoc: QueryDocumentSnapshot<DocumentData> | null;
  hasMore: boolean;
}

export interface PaginationOptions {
  pageSize?: number;
  orderByField?: string;
  orderDirection?: "asc" | "desc";
  lastDoc?: QueryDocumentSnapshot<DocumentData> | null;
}

/**
 * Obtiene una página de documentos de una colección
 */
export async function getPaginated<T>(
  collectionName: string,
  options: PaginationOptions = {}
): Promise<PaginatedResult<T>> {
  try {
    const {
      pageSize = 20,
      orderByField = "createdAt",
      orderDirection = "desc",
      lastDoc = null,
    } = options;

    const collectionRef = collection(db, collectionName);
    const constraints: QueryConstraint[] = [
      orderBy(orderByField, orderDirection),
      limit(pageSize + 1), // +1 para verificar si hay más páginas
    ];

    if (lastDoc) {
      constraints.push(startAfter(lastDoc));
    }

    const q = query(collectionRef, ...constraints);
    const snapshot = await getDocs(q);

    const docs = snapshot.docs;
    const hasMore = docs.length > pageSize;
    const items = docs
      .slice(0, pageSize)
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as T[];

    const newLastDoc = items.length > 0 ? docs[items.length - 1] : null;

    return {
      items,
      lastDoc: newLastDoc,
      hasMore,
    };
  } catch (error) {
    logger.error(`Error fetching paginated ${collectionName}`, error);
    throw new FirestoreError(`Failed to fetch paginated ${collectionName}`, error);
  }
}

