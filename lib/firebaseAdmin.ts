import admin from "firebase-admin";

// Load environment variables if not already loaded
if (!process.env.FIREBASE_PROJECT_ID) {
  try {
    const dotenv = require("dotenv");

    dotenv.config({ path: ".env.local" });
  } catch {
    // dotenv not available, continue
  }
}

// Verificar que las variables de entorno necesarias estén presentes
const requiredEnvVars = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  privateKey: process.env.FIREBASE_PRIVATE_KEY,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
};

// Validar variables de entorno
const missingVars = Object.entries(requiredEnvVars)
  .filter(([, value]) => !value)
  .map(([key]) => key);

if (missingVars.length > 0) {
  console.error("❌ Missing required environment variables:", missingVars);
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

    console.log("✅ Firebase Admin SDK initialized successfully");
  } catch (error) {
    console.error("❌ Error initializing Firebase Admin SDK:", error);
    throw error;
  }
}

export const db = admin.firestore();
export const adminAuth = admin.auth();
export const adminStorage = admin.storage();
