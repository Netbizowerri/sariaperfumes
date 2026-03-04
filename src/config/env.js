const rawEnv = {
  FIREBASE_API_KEY: import.meta.env.VITE_FIREBASE_API_KEY,
  FIREBASE_AUTH_DOMAIN: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  FIREBASE_PROJECT_ID: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  FIREBASE_STORAGE_BUCKET: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  FIREBASE_MESSAGING_SENDER_ID: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  FIREBASE_APP_ID: import.meta.env.VITE_FIREBASE_APP_ID,
};

const requiredEntries = Object.entries(rawEnv);

export const missingFirebaseEnvKeys = requiredEntries
  .filter(([, value]) => typeof value !== "string" || value.trim().length === 0)
  .map(([key]) => key);

export const FIREBASE_ENV_READY = missingFirebaseEnvKeys.length === 0;

export const firebaseConfig = {
  apiKey: rawEnv.FIREBASE_API_KEY || "",
  authDomain: rawEnv.FIREBASE_AUTH_DOMAIN || "",
  projectId: rawEnv.FIREBASE_PROJECT_ID || "",
  storageBucket: rawEnv.FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: rawEnv.FIREBASE_MESSAGING_SENDER_ID || "",
  appId: rawEnv.FIREBASE_APP_ID || "",
};

export const env = { ...rawEnv };
