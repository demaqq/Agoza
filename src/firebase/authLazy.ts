/**
 * Lazy Firebase Auth module.
 *
 * Firebase Auth is lazy-loaded so it does not block the initial page load.
 * All functions return Promises and resolve once the Firebase Auth SDK is ready.
 */

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

let firebaseAuthModule: any = null;
let firebaseApp: any = null;
let firebaseDb: any = null;
let firebaseStorage: any = null;
let authPromise: Promise<void> | null = null;

async function ensureFirebaseLoaded(): Promise<void> {
  if (authPromise) return authPromise;
  authPromise = (async () => {
    const { initializeApp } = await import('firebase/app');
    const {
      getAuth,
      createUserWithEmailAndPassword,
      signInWithEmailAndPassword,
      signOut,
      sendEmailVerification,
      sendPasswordResetEmail,
      updateProfile,
      onAuthStateChanged,
    } = await import('firebase/auth');
    const { getFirestore } = await import('firebase/firestore');
    const { getStorage } = await import('firebase/storage');

    firebaseApp = initializeApp(firebaseConfig);
    const auth = getAuth(firebaseApp);
    firebaseAuthModule = {
      getAuth,
      createUserWithEmailAndPassword,
      signInWithEmailAndPassword,
      signOut,
      sendEmailVerification,
      sendPasswordResetEmail,
      updateProfile,
      onAuthStateChanged,
      auth,
    };
    firebaseDb = getFirestore(firebaseApp);
    firebaseStorage = getStorage(firebaseApp);
  })();
  return authPromise;
}

export async function signupUser(data: {
  name: string;
  email: string;
  phone: string;
  city: string;
  telegramUsername: string;
  password: string;
}): Promise<{ success: boolean; error?: string }> {
  await ensureFirebaseLoaded();
  try {
    const cred = await firebaseAuthModule.createUserWithEmailAndPassword(
      firebaseAuthModule.auth,
      data.email,
      data.password
    );
    await firebaseAuthModule.updateProfile(cred.user, { displayName: data.name });
    await firebaseAuthModule.sendEmailVerification(cred.user);

    const { setDoc, doc, serverTimestamp } = await import('firebase/firestore');
    const account: any = {
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
    await setDoc(doc(firebaseDb, 'users', cred.user.uid), {
      ...account,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return { success: true };
  } catch (err: any) {
    return { success: false, error: mapAuthError(err) };
  }
}

export async function loginUser(email: string, password: string): Promise<{ success: boolean; error?: string }> {
  await ensureFirebaseLoaded();
  try {
    await firebaseAuthModule.signInWithEmailAndPassword(firebaseAuthModule.auth, email, password);
    return { success: true };
  } catch (err: any) {
    return { success: false, error: mapAuthError(err) };
  }
}

export async function logoutUser(): Promise<void> {
  await ensureFirebaseLoaded();
  await firebaseAuthModule.signOut(firebaseAuthModule.auth);
}

export async function resetPassword(email: string): Promise<{ success: boolean; error?: string }> {
  await ensureFirebaseLoaded();
  try {
    await firebaseAuthModule.sendPasswordResetEmail(firebaseAuthModule.auth, email);
    return { success: true };
  } catch (err: any) {
    return { success: false, error: mapAuthError(err) };
  }
}

export async function fetchUserAccount(uid: string): Promise<any> {
  await ensureFirebaseLoaded();
  const { getDoc, doc } = await import('firebase/firestore');
  const snap = await getDoc(doc(firebaseDb, 'users', uid));
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
    plan: (data.plan as any) || 'free',
    createdAt: data.createdAt || '',
    verified: Boolean(data.verified),
    isAdmin: Boolean(data.isAdmin) || computeIsAdmin(data.email),
  };
}

export function subscribeToAuth(callback: (user: any) => void): () => void {
  let unsubscribe: (() => void) | null = null;

  ensureFirebaseLoaded().then(() => {
    unsubscribe = firebaseAuthModule.onAuthStateChanged(firebaseAuthModule.auth, (fbUser: any) => {
      callback(fbUser);
    });
  });

  return () => {
    if (unsubscribe) unsubscribe();
  };
}

export function computeIsAdmin(email?: string | null): boolean {
  const ADMIN_EMAILS = new Set([
    'admin@anza.et',
    'kirtasnetwork@gmail.com',
    'moderator@anza.et',
  ]);
  return Boolean(email && ADMIN_EMAILS.has(email));
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

export type FirebaseUserAccount = {
  id: string;
  firebaseUid: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  telegramUsername: string;
  plan: string;
  createdAt: string;
  verified: boolean;
  isAdmin: boolean;
};

export { firebaseAuthModule as auth };
export { firebaseAuthModule as firebaseAuth };
