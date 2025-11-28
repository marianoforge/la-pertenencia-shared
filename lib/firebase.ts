import { initializeApp } from "firebase/app";
import {
  getFirestore,
  initializeFirestore,
  persistentLocalCache,
  Firestore,
} from "firebase/firestore";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { getStorage } from "firebase/storage";
import { env } from "@/config/env";

// Firebase configuration - validated via env.ts
const firebaseConfig = {
  apiKey: env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);

let db: Firestore;

// 🔹 Solo inicializar IndexedDB en el cliente
if (typeof window !== "undefined") {
  try {
    db = initializeFirestore(app, {
      localCache: persistentLocalCache(),
    });
  } catch (error: unknown) {
    if ((error as { code?: string }).code === "failed-precondition") {
      db = getFirestore(app);
    } else {
      throw error;
    }
  }
} else {
  // En el servidor, usa Firestore sin persistencia
  db = getFirestore(app);
}

const auth = getAuth(app);
const storage = getStorage(app);

export { db, auth, storage, GoogleAuthProvider, signInWithEmailAndPassword };
