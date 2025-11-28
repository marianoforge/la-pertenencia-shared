/**
 * 📧 Newsletter Subscription Functions
 */

import {
  collection,
  getDocs,
  getDoc,
  doc,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
} from "firebase/firestore";

import { db } from "@/lib/firebase";
import { FirestoreError } from "@/lib/errors";
import { logger } from "@/lib/logger";

const COLLECTION = "suscriptos";

export interface NewsletterSubscription {
  id?: string;
  email: string;
  subscribedAt: string;
  active: boolean;
  unsubscribedAt?: string;
}

// Add newsletter subscription
export const addNewsletterSubscription = async (
  email: string,
): Promise<{ success: boolean; error?: string }> => {
  try {
    const suscriptosCollection = collection(db, COLLECTION);

    // Add new subscription (sin verificar duplicados para evitar problemas de permisos)
    const subscriptionData: Omit<NewsletterSubscription, "id"> = {
      email,
      subscribedAt: new Date().toISOString(),
      active: true,
    };

    await addDoc(suscriptosCollection, subscriptionData);

    return { success: true };
  } catch (error) {
    logger.error("Error adding newsletter subscription", error);
    const errorMessage =
      error instanceof Error ? error.message : "Error al suscribirse";

    return { success: false, error: errorMessage };
  }
};

// Get all newsletter subscriptions
export const getAllNewsletterSubscriptions = async (): Promise<
  NewsletterSubscription[]
> => {
  try {
    const suscriptosCollection = collection(db, COLLECTION);
    const q = query(suscriptosCollection, orderBy("subscribedAt", "desc"));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as NewsletterSubscription[];
  } catch (error) {
    logger.error("Error fetching newsletter subscriptions", error);
    throw new FirestoreError("Failed to fetch newsletter subscriptions", error);
  }
};

// Unsubscribe from newsletter
export const unsubscribeFromNewsletter = async (
  email: string,
): Promise<boolean> => {
  try {
    const suscriptosCollection = collection(db, COLLECTION);
    const q = query(suscriptosCollection, where("email", "==", email));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return false;
    }

    // Update the active status to false
    const subscriptionDoc = snapshot.docs[0];

    await updateDoc(doc(db, COLLECTION, subscriptionDoc.id), {
      active: false,
      unsubscribedAt: new Date().toISOString(),
    });

    return true;
  } catch (error) {
    logger.error("Error unsubscribing from newsletter", error);
    throw new FirestoreError("Failed to unsubscribe from newsletter", error);
  }
};

