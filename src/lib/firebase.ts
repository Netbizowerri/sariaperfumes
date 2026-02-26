import { getApp, getApps, initializeApp } from "firebase/app";
import { Auth, getAuth } from "firebase/auth";
import { Firestore, getFirestore } from "firebase/firestore";
import { FirebaseStorage, getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBarxQiknkQzMio9wisTzo09D0S-wfdShg",
  authDomain: "saria-db.firebaseapp.com",
  projectId: "saria-db",
  storageBucket: "saria-db.firebasestorage.app",
  messagingSenderId: "386945282267",
  appId: "1:386945282267:web:3c5c83da14ea7fa2561cfe",
};

let firebaseInitError: Error | null = null;
let app: ReturnType<typeof initializeApp> | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let storage: FirebaseStorage | null = null;

try {
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
