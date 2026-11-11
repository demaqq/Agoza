import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
  type User,
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './config';
import type { UserAccount, PlanTier } from '../types';

export interface AuthResult {
  success: boolean;
  error?: string;
}

export interface FirebaseUserAccount extends UserAccount {
  firebaseUid: string;
}

const ADMIN_EMAILS = new Set([
  'admin@agoza.et',
  'kirtasnetwork@gmail.com',
  'moderator@agoza.et',
]);

export function computeIsAdmin(email?: string | null): boolean {
  return Boolean(email && ADMIN_EMAILS.has(email));
}

export async function signupUser(data: {
  name: string;
  email: string;
  phone: string;
  city: string;
  telegramUsername: string;
  password: string;
}): Promise<AuthResult> {
  try {
    const cred = await createUserWithEmailAndPassword(auth, data.email, data.password);
    await updateProfile(cred.user, { displayName: data.name });
    await sendEmailVerification(cred.user);

    const account: FirebaseUserAccount = {
      id: cred.user.uid,
      firebaseUid: cred.user.uid,
      name: data.name,
      email: data.email,
      phone: data.phone,
      city: data.city,
      telegramUsername: data.telegramUsername,
      plan: 'free',
      createdAt: new Date().toISOString().split('T')[0],
      verified: false,
      isAdmin: computeIsAdmin(data.email),
    };

    await setDoc(doc(db, 'users', cred.user.uid), {
      ...account,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return { success: true };
  } catch (err: any) {
    return { success: false, error: mapAuthError(err) };
  }
}

export async function loginUser(email: string, password: string): Promise<AuthResult> {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    return { success: true };
  } catch (err: any) {
    return { success: false, error: mapAuthError(err) };
  }
}

export async function logoutUser(): Promise<void> {
  await signOut(auth);
}

export async function resetPassword(email: string): Promise<AuthResult> {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true };
  } catch (err: any) {
    return { success: false, error: mapAuthError(err) };
  }
}

export async function fetchUserAccount(uid: string): Promise<FirebaseUserAccount | null> {
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
    plan: (data.plan as PlanTier) || 'free',
    createdAt: data.createdAt || '',
    verified: Boolean(data.verified),
    isAdmin: Boolean(data.isAdmin) || computeIsAdmin(data.email),
  };
}

export async function updateUserPlan(uid: string, plan: PlanTier): Promise<void> {
  await updateDoc(doc(db, 'users', uid), { plan, updatedAt: serverTimestamp() });
}

export function subscribeToAuth(
  callback: (user: User | null) => void
): () => void {
  return onAuthStateChanged(auth, callback);
}

function mapAuthError(err: any): string {
  switch (err.code) {
    case 'auth/user-not-found':
      return 'No account found with that email.';
    case 'auth/wrong-password':
      return 'Incorrect password.';
    case 'auth/email-already-in-use':
      return 'An account with that email already exists.';
    case 'auth/weak-password':
      return 'Password must be at least 6 characters.';
    case 'auth/invalid-email':
      return 'Invalid email address.';
    case 'auth/network-failed':
      return 'Network error. Please check your connection.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Try again later.';
    default:
      return err.message || 'Authentication failed.';
  }
}