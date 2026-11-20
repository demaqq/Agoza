/**
 * Agoza Firestore persistence layer.
 *
 * Collections:
 *   users/{uid}            — user profile (auth sync source of truth)
 *   listings/{id}          — marketplace listings
 *   offers/{id}            — trade offers
 *   escrow/{id}            — escrow transactions
 *   chats/{threadId}       — chat threads + messages
 *   reviews/{id}           — seller reviews
 *   alerts/{id}            — alert notifications
 *   userSettings/{uid}     — per-user preferences (watchlist, alert settings)
 *
 * Security rules enforce per-user scoping (see firestore.rules).
 */

import {
  collection,
  doc,
  setDoc,
  updateDoc,
  getDoc,
  arrayUnion,
  getDocs,
  query,
  where,
  onSnapshot,
  serverTimestamp,
  type Unsubscribe,
  type QuerySnapshot,
  type DocumentData,
} from 'firebase/firestore';
import { getDb } from './config';
import type { Collectible, TradeOffer, EscrowTransaction, ChatThread, SellerReview, AlertNotification, AlertSettings } from '../types';

const COL = {
  listings: 'listings',
  offers: 'offers',
  escrow: 'escrow',
  chats: 'chats',
  reviews: 'reviews',
  alerts: 'alerts',
  userSettings: 'userSettings',
} as const;

/** Returns Firestore, or null when Firebase isn't configured (offline demo mode). */
function requireDb() {
  return getDb();
}

function snapshotToData<T>(snap: QuerySnapshot): T[] {
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as DocumentData) })) as T[];
}

// ---- Listings ----
export async function saveListing(listing: Collectible): Promise<void> {
  const db = requireDb();
  if (!db) return;
  await setDoc(doc(db, COL.listings, listing.id), {
    ...listing,
    updatedAt: serverTimestamp(),
  }, { merge: true });
}

export async function updateListing(id: string, data: Partial<Collectible>): Promise<void> {
  const db = requireDb();
  if (!db) return;
  await updateDoc(doc(db, COL.listings, id), { ...data, updatedAt: serverTimestamp() });
}

export async function deleteListingDoc(id: string): Promise<void> {
  const db = requireDb();
  if (!db) return;
  await updateDoc(doc(db, COL.listings, id), {
    status: 'deleted',
    moderationStatus: 'deleted',
    deletedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function fetchListings(): Promise<Collectible[]> {
  const db = requireDb();
  if (!db) return [];
  const snap = await getDocs(query(collection(db, COL.listings), where('status', '==', 'active')));
  return snapshotToData<Collectible>(snap);
}

export function subscribeToListings(cb: (items: Collectible[]) => void): Unsubscribe {
  const db = requireDb();
  if (!db) return () => {};
  return onSnapshot(
    query(collection(db, COL.listings), where('status', '==', 'active')),
    (snap) => cb(snapshotToData<Collectible>(snap))
  );
}

// ---- Offers ----
export async function saveOffer(offer: TradeOffer): Promise<void> {
  const db = requireDb();
  if (!db) return;
  await setDoc(doc(db, COL.offers, offer.id), { ...offer, updatedAt: serverTimestamp() });
}

export async function updateOfferStatus(id: string, status: TradeOffer['status'], counterAmount?: number): Promise<void> {
  const db = requireDb();
  if (!db) return;
  const data: DocumentData = { status, updatedAt: serverTimestamp() };
  if (counterAmount !== undefined) data.counterAmountETB = counterAmount;
  await updateDoc(doc(db, COL.offers, id), data);
}

// ---- Escrow ----
export async function saveEscrow(order: EscrowTransaction): Promise<void> {
  const db = requireDb();
  if (!db) return;
  await setDoc(doc(db, COL.escrow, order.id), { ...order, updatedAt: serverTimestamp() });
}

export async function updateEscrow(id: string, data: Partial<EscrowTransaction>): Promise<void> {
  const db = requireDb();
  if (!db) return;
  await updateDoc(doc(db, COL.escrow, id), { ...data, updatedAt: serverTimestamp() });
}

// ---- Chats ----
export async function saveChatThread(thread: ChatThread): Promise<void> {
  const db = requireDb();
  if (!db) return;
  await setDoc(doc(db, COL.chats, thread.id), { ...thread, updatedAt: serverTimestamp() });
}

export async function addMessageToThread(threadId: string, message: ChatThread['messages'][number]): Promise<void> {
  const db = requireDb();
  if (!db) return;
  await updateDoc(doc(db, COL.chats, threadId), {
    messages: arrayUnion(message),
    lastMessage: message.text,
    updatedAt: serverTimestamp(),
  });
}

// ---- Reviews ----
export async function saveReview(review: SellerReview): Promise<void> {
  const db = requireDb();
  if (!db) return;
  await setDoc(doc(db, COL.reviews, review.id), { ...review, updatedAt: serverTimestamp() });
}

// ---- Alerts ----
export async function saveAlert(alert: AlertNotification): Promise<void> {
  const db = requireDb();
  if (!db) return;
  await setDoc(doc(db, COL.alerts, alert.id), { ...alert, updatedAt: serverTimestamp() });
}

// ---- User settings (watchlist, alert settings) ----
export async function saveUserSettings(uid: string, data: { watchlist?: string[]; alertSettings?: AlertSettings }): Promise<void> {
  const db = requireDb();
  if (!db) return;
  await setDoc(doc(db, COL.userSettings, uid), { ...data, updatedAt: serverTimestamp() }, { merge: true });
}

export async function fetchUserSettings(uid: string): Promise<{ watchlist?: string[]; alertSettings?: AlertSettings } | null> {
  const db = requireDb();
  if (!db) return null;
  const snap = await getDoc(doc(db, COL.userSettings, uid));
  return snap.exists() ? (snap.data() as any) : null;
}

export default {
  saveListing, updateListing, deleteListingDoc, fetchListings, subscribeToListings,
  saveOffer, updateOfferStatus, saveEscrow, updateEscrow,
  saveChatThread, addMessageToThread, saveReview, saveAlert,
  saveUserSettings, fetchUserSettings,
};