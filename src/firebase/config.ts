/**
 * Single source of truth for the Firebase app.
 *
 * Firebase is optional at runtime: when the VITE_FIREBASE_* variables are
 * missing (local dev, preview builds) the marketplace keeps working on its
 * local cache instead of crashing on `auth/invalid-api-key`.
 */
import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { initializeFirestore, connectFirestoreEmulator, type Firestore } from 'firebase/firestore';

const env = import.meta.env;

export const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY as string | undefined,
  authDomain:
    (env.VITE_FIREBASE_AUTH_DOMAIN as string | undefined) ||
    (env.VITE_FIREBASE_PROJECT_ID ? `${env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com` : undefined),
  projectId: env.VITE_FIREBASE_PROJECT_ID as string | undefined,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET as string | undefined,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID as string | undefined,
  appId: env.VITE_FIREBASE_APP_ID as string | undefined,
  measurementId: env.VITE_FIREBASE_MEASUREMENT_ID as string | undefined,
};

const isPlaceholder = (v?: string) => !v || v.startsWith('MY_') || v.includes('XXXX');

export const isFirebaseConfigured =
  !isPlaceholder(firebaseConfig.apiKey) &&
  !isPlaceholder(firebaseConfig.projectId) &&
  !isPlaceholder(firebaseConfig.appId);

export const useEmulator = env.VITE_USE_EMULATOR === 'true';

let app: FirebaseApp | null = null;
let db: Firestore | null = null;

export function getFirebaseApp(): FirebaseApp | null {
  if (!isFirebaseConfigured && !useEmulator) return null;
  if (!app) {
    app = getApps()[0] ?? initializeApp(firebaseConfig);
  }
  return app;
}

export function getDb(): Firestore | null {
  if (db) return db;
  const fbApp = getFirebaseApp();
  if (!fbApp) return null;
  try {
    // ignoreUndefinedProperties: optional fields (e.g. flagReason: undefined) would otherwise reject writes.
    db = initializeFirestore(fbApp, { ignoreUndefinedProperties: true });
    if (useEmulator) connectFirestoreEmulator(db, 'localhost', 8080);
  } catch (e) {
    console.warn('[firebase] Firestore unavailable:', e);
    db = null;
  }
  return db;
}

if (!isFirebaseConfigured && !useEmulator && import.meta.env.DEV) {
  console.info('[firebase] VITE_FIREBASE_* not set — running in offline demo mode (accounts disabled).');
}
