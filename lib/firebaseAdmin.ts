import admin from "firebase-admin";
import { env } from "@/config/env";
import { logger } from "@/lib/logger";

// Verificar que las variables de entorno necesarias estén presentes
const requiredEnvVars = {
  projectId: env.FIREBASE_PROJECT_ID,
  privateKey: env.FIREBASE_PRIVATE_KEY,
  clientEmail: env.FIREBASE_CLIENT_EMAIL,
};

// Validar variables de entorno (solo para server-side)
const missingVars = Object.entries(requiredEnvVars)
  .filter(([, value]) => !value)
  .map(([key]) => key);

if (missingVars.length > 0) {
  logger.error("Missing required Firebase Admin SDK environment variables", { missingVars });
  throw new Error(
    `Missing Firebase Admin SDK environment variables: ${missingVars.join(", ")}`
  );
}

if (!admin.apps.length) {
  try {
    const credential = admin.credential.cert({
      projectId: requiredEnvVars.projectId!,
      privateKey: requiredEnvVars.privateKey!.replace(/\\n/g, "\n"),
      clientEmail: requiredEnvVars.clientEmail!,
    });

    admin.initializeApp({
      credential,
      projectId: requiredEnvVars.projectId!,
    });

    logger.info("Firebase Admin SDK initialized successfully");
  } catch (error) {
    logger.error("Error initializing Firebase Admin SDK", error);
    throw error;
  }
}

export const db = admin.firestore();
export const adminAuth = admin.auth();
export const adminStorage = admin.storage();
