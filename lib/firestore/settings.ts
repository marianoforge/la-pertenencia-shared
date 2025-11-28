/**
 * ⚙️ Site Settings Functions
 */

import { doc, getDoc, setDoc } from "firebase/firestore";

import { db } from "@/lib/firebase";
import { FirestoreError } from "@/lib/errors";
import { logger } from "@/lib/logger";

const COLLECTION = "settings";
const DOCUMENT_ID = "site";

export interface SiteSettings {
  shippingEnabled: boolean;
  shippingCost: number;
}

// Get site settings
export const getSiteSettings = async (): Promise<SiteSettings> => {
  try {
    const settingsRef = doc(db, COLLECTION, DOCUMENT_ID);
    const settingsDoc = await getDoc(settingsRef);

    if (settingsDoc.exists()) {
      return settingsDoc.data() as SiteSettings;
    }

    // Return default settings if document doesn't exist
    return {
      shippingEnabled: true,
      shippingCost: 500,
    };
  } catch (error) {
    logger.error("Error fetching site settings", error);
    // Return default settings on error
    return {
      shippingEnabled: true,
      shippingCost: 500,
    };
  }
};

// Update site settings
export const updateSiteSettings = async (
  settings: Partial<SiteSettings>,
): Promise<boolean> => {
  try {
    const settingsRef = doc(db, COLLECTION, DOCUMENT_ID);

    await setDoc(settingsRef, settings, { merge: true });

    return true;
  } catch (error) {
    logger.error("Error updating site settings", error);
    throw new FirestoreError("Failed to update site settings", error);
  }
};

