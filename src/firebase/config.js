import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import {
  FIREBASE_ENV_READY,
  firebaseConfig,
  missingFirebaseEnvKeys,
} from "@/config/env";

let firebaseInitError = null;
let app = null;
let auth = null;
let db = null;
let storage = null;

try {
  if (!FIREBASE_ENV_READY) {
    throw new Error(
      `Missing Firebase environment variables: ${missingFirebaseEnvKeys.join(", ")}`,
    );
  }

  app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
} catch (error) {
  firebaseInitError =
    error instanceof Error ? error : new Error("Failed to initialize Firebase");
  console.error("Firebase initialization failed:", firebaseInitError);
}

export { app, auth, db, storage, firebaseInitError };
