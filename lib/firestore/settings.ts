

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


export const getSiteSettings = async (): Promise<SiteSettings> => {
  try {
    const settingsRef = doc(db, COLLECTION, DOCUMENT_ID);
    const settingsDoc = await getDoc(settingsRef);

    if (settingsDoc.exists()) {
      return settingsDoc.data() as SiteSettings;
    }

    
    return {
      shippingEnabled: true,
      shippingCost: 500,
    };
  } catch (error) {
    logger.error("Error fetching site settings", error);
    
    return {
      shippingEnabled: true,
      shippingCost: 500,
    };
  }
};


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

