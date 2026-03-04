import type { FirebaseApp } from "firebase/app";
import type { Auth } from "firebase/auth";
import type { Firestore } from "firebase/firestore";
import type { FirebaseStorage } from "firebase/storage";

export const app: FirebaseApp | null;
export const auth: Auth | null;
export const db: Firestore | null;
export const storage: FirebaseStorage | null;
export const firebaseInitError: Error | null;
