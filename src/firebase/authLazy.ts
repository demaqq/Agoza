/**
 * Lazy Firebase Auth module.
 *
 * The Auth SDK is loaded on demand so it does not block first paint. It shares
 * the single Firebase app from ./config. When Firebase is not configured, every
 * call resolves gracefully (signed-out state, friendly error) instead of throwing.
 */
import type { Auth, User } from 'firebase/auth';
import type { UserAccount } from '../types';
import { getFirebaseApp, getDb, isFirebaseConfigured, useEmulator } from './config';

type AuthSdk = typeof import('firebase/auth');

export type AuthResult = { success: boolean; error?: string };
export type FirebaseUserAccount = UserAccount & { firebaseUid: string };

const NOT_CONFIGURED_ERROR =
  'Accounts are temporarily unavailable. You can keep browsing — please try again later.';

let sdk: AuthSdk | null = null;
let auth: Auth | null = null;
let loadPromise: Promise<boolean> | null = null;

/** Resolves true when Auth is ready, false when Firebase is unavailable. */
function ensureAuth(): Promise<boolean> {
  if (loadPromise) return loadPromise;
  loadPromise = (async () => {
    const app = getFirebaseApp();
    if (!app) return false;
    try {
      sdk = await import('firebase/auth');
      auth = sdk.getAuth(app);
      if (useEmulator) sdk.connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
      return true;
    } catch (e) {
      console.warn('[firebase] Auth unavailable:', e);
      return false;
    }
  })();
  return loadPromise;
}

export const isAuthAvailable = () => isFirebaseConfigured || useEmulator;

/** Admins are granted server-side via the `isAdmin` field on users/{uid} (see firestore.rules). */
const ADMIN_EMAILS = new Set(['admin@agoza.et', 'moderator@agoza.et']);

export function computeIsAdmin(email?: string | null): boolean {
  return Boolean(email && ADMIN_EMAILS.has(email.toLowerCase()));
}

/** Firestore Timestamps (or anything else) -> YYYY-MM-DD string safe to render. */
function toDateString(value: unknown): string {
  if (!value) return '';
  if (typeof value === 'string') return value;
  const maybeTs = value as { toDate?: () => Date };
  if (typeof maybeTs.toDate === 'function') return maybeTs.toDate().toISOString().split('T')[0];
  return '';
}

export async function signupUser(data: {
  name: string;
  email: string;
  phone: string;
  city: string;
  telegramUsername: string;
  password: string;
}): Promise<AuthResult> {
  if (!(await ensureAuth()) || !sdk || !auth) return { success: false, error: NOT_CONFIGURED_ERROR };
  try {
    const cred = await sdk.createUserWithEmailAndPassword(auth, data.email, data.password);
    await sdk.updateProfile(cred.user, { displayName: data.name });
    sdk.sendEmailVerification(cred.user).catch((e) => console.warn('[auth] verification email failed:', e));

    // Profile doc is best-effort: the account exists even if this write fails.
    const db = getDb();
    if (db) {
      try {
        const { setDoc, doc, serverTimestamp } = await import('firebase/firestore');
        await setDoc(doc(db, 'users', cred.user.uid), {
          id: cred.user.uid,
          name: data.name,
          email: data.email,
          phone: data.phone,
          city: data.city,
          telegramUsername: data.telegramUsername,
          plan: 'free',
          verified: false,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      } catch (e) {
        console.warn('[auth] failed to create profile doc:', e);
      }
    }
    return { success: true };
  } catch (err) {
    return { success: false, error: mapAuthError(err) };
  }
}

export async function loginUser(email: string, password: string): Promise<AuthResult> {
  if (!(await ensureAuth()) || !sdk || !auth) return { success: false, error: NOT_CONFIGURED_ERROR };
  try {
    await sdk.signInWithEmailAndPassword(auth, email, password);
    return { success: true };
  } catch (err) {
    return { success: false, error: mapAuthError(err) };
  }
}

export async function logoutUser(): Promise<void> {
  if (!(await ensureAuth()) || !sdk || !auth) return;
  await sdk.signOut(auth);
}

export async function resetPassword(email: string): Promise<AuthResult> {
  if (!(await ensureAuth()) || !sdk || !auth) return { success: false, error: NOT_CONFIGURED_ERROR };
  try {
    await sdk.sendPasswordResetEmail(auth, email);
    return { success: true };
  } catch (err) {
    return { success: false, error: mapAuthError(err) };
  }
}

export async function fetchUserAccount(uid: string): Promise<FirebaseUserAccount | null> {
  const db = getDb();
  if (!db) return null;
  const { getDoc, doc } = await import('firebase/firestore');
  const snap = await getDoc(doc(db, 'users', uid));
  if (!snap.exists()) return null;
  const data = snap.data();
  return {
    id: uid,
    firebaseUid: uid,
    name: data.name || '',
    email: data.email || '',
    phone: data.phone || '',
    city: data.city || '',
    telegramUsername: data.telegramUsername || '',
    plan: data.plan || 'free',
    createdAt: toDateString(data.createdAt),
    verified: Boolean(data.verified),
    isAdmin: Boolean(data.isAdmin) || computeIsAdmin(data.email),
  };
}

/** Subscribes to auth changes. Calls back with null right away when auth is unavailable. */
export function subscribeToAuth(callback: (user: User | null) => void): () => void {
  let unsubscribe: (() => void) | null = null;
  let cancelled = false;

  ensureAuth().then((ok) => {
    if (cancelled) return;
    if (!ok || !sdk || !auth) {
      callback(null);
      return;
    }
    unsubscribe = sdk.onAuthStateChanged(auth, callback);
  });

  return () => {
    cancelled = true;
    unsubscribe?.();
  };
}

function mapAuthError(err: unknown): string {
  const code = (err as { code?: string })?.code;
  switch (code) {
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Incorrect email/phone or password.';
    case 'auth/email-already-in-use':
      return 'An account with that email already exists.';
    case 'auth/weak-password':
      return 'Password must be at least 6 characters.';
    case 'auth/invalid-email':
      return 'Invalid email address.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your connection.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Try again later.';
    case 'auth/invalid-api-key':
    case 'auth/api-key-not-valid.-please-pass-a-valid-api-key.':
      return NOT_CONFIGURED_ERROR;
    default:
      return (err as { message?: string })?.message || 'Authentication failed.';
  }
}
