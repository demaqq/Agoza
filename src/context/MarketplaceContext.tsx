import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Collectible,
  CollectibleCategory,
  Currency,
  Language,
  Theme,
  ItemRarity,
  HistoricalEraPeriod,
  TradeOffer,
  EscrowTransaction,
  ChatThread,
  ChatMessage,
  ActivityItem,
  AlertNotification,
  AlertSettings,
  SellerReview,
  PlanTier,
  SubscriptionPlan,
  SocialBroadcastPayload,
  SocialMarketingSettings,
  UserAccount,
} from '../types';
import { getPlanById } from '../data/plansData';
import { DEFAULT_SOCIAL_SETTINGS, createSocialBroadcastPayload } from '../utils/socialAutoBroadcaster';
import {
  INITIAL_COLLECTIBLES,
  INITIAL_OFFERS,
  INITIAL_ESCROW_ORDERS,
  INITIAL_CHAT_THREADS,
  INITIAL_ACTIVITIES,
  INITIAL_ALERTS,
  INITIAL_REVIEWS,
} from '../data/mockData';
import { TRANSLATIONS, Translations } from '../i18n/translations';
import { checkSafetyCompliance } from '../utils/safetyFilter';
import { aiScreenListing } from '../services/aiSafetyFilter';
import {
  signupUser,
  loginUser,
  logoutUser,
  fetchUserAccount,
  subscribeToAuth,
  computeIsAdmin,
  type FirebaseUserAccount,
} from '../firebase/authLazy';
import {
  saveUserSettings,
  fetchUserSettings,
  subscribeToListings,
  saveListing,
  updateListing,
  deleteListingDoc,
  saveOffer,
  updateOfferStatus as firestoreUpdateOfferStatus,
  saveEscrow,
  updateEscrow,
  saveChatThread,
  addMessageToThread,
  saveReview,
  saveAlert,
} from '../firebase/firestore';

export interface FilterState {
  category: CollectibleCategory;
  subcategory: string;
  searchQuery: string;
  condition: string;
  rarity: ItemRarity | 'all';
  eraPeriod: HistoricalEraPeriod;
  openToTradeOnly: boolean;
  location: string;
  city: string;
  minPrice: number;
  maxPrice: number;
  sortBy: 'latest' | 'price-asc' | 'price-desc' | 'most-popular';
}

interface DuplicateCheckResult {
  isDuplicate: boolean;
  isAllowedWithDifferentImage?: boolean;
  reason?: string;
}

interface MarketplaceContextType {
  collectibles: Collectible[];
  currency: Currency;
  setCurrency: (c: Currency) => void;
  formatPrice: (priceETB: number) => string;
  language: Language;
  setLanguage: (lang: Language) => void;
  theme: Theme;
  toggleTheme: () => void;
  t: Translations;
  selectedCollectible: Collectible | null;
  setSelectedCollectible: (c: Collectible | null) => void;
  watchlist: string[];
  toggleWatchlist: (id: string) => void;
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  resetFilters: () => void;
activeView: 'marketplace' | 'vault' | 'user-dashboard' | 'admin-dashboard' | 'plans';
setActiveView: (view: 'marketplace' | 'vault' | 'user-dashboard' | 'admin-dashboard' | 'plans') => void;
  
  // Modals & Drawers
  isListModalOpen: boolean;
  setIsListModalOpen: (open: boolean) => void;
  isPlansModalOpen: boolean;
  setIsPlansModalOpen: (open: boolean) => void;
  isOfferModalOpen: boolean;
  setIsOfferModalOpen: (open: boolean) => void;
  isSwapModalOpen: boolean;
  setIsSwapModalOpen: (open: boolean) => void;
  isEscrowModalOpen: boolean;
  setIsEscrowModalOpen: (open: boolean) => void;
  isChatOpen: boolean;
  setIsChatOpen: (open: boolean) => void;
  isActivityFeedOpen: boolean;
  setIsActivityFeedOpen: (open: boolean) => void;
  isAlertsOpen: boolean;
  setIsAlertsOpen: (open: boolean) => void;
  isMobileCategoriesOpen: boolean;
  setIsMobileCategoriesOpen: (open: boolean) => void;
  isSearchModalOpen: boolean;
  setIsSearchModalOpen: (open: boolean) => void;
  isQuickBuyOpen: boolean;
  setIsQuickBuyOpen: (open: boolean) => void;
  quickBuyItem: Collectible | null;
  setQuickBuyItem: (item: Collectible | null) => void;
  openQuickBuy: (item: Collectible) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalMode: 'signin' | 'signup';
  setAuthModalMode: (mode: 'signin' | 'signup') => void;
  authReady: boolean;
  activeChatThreadId: string | null;
  setActiveChatThreadId: (id: string | null) => void;

  // User Authentication & Location
  currentUser: UserAccount | null;
  signup: (data: Omit<UserAccount, 'id' | 'plan' | 'createdAt' | 'verified'> & { password: string }) => Promise<{ success: boolean; error?: string }>;
  login: (emailOrPhone: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void> | void;
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  isAdmin: boolean;

  // Subscription Plans
  userPlan: PlanTier;
  setUserPlan: (plan: PlanTier) => void;
  activePlanDetails: SubscriptionPlan;
  subscribeToPlan: (planId: PlanTier, paymentMethod?: string) => { success: boolean; message: string };

  // Social Auto-Broadcasting & Omnichannel Syndication
  socialMarketingSettings: SocialMarketingSettings;
  updateSocialMarketingSettings: (settings: Partial<SocialMarketingSettings>) => void;
  socialBroadcasts: SocialBroadcastPayload[];
  broadcastListingToSocials: (item: Collectible) => SocialBroadcastPayload;
  isSocialModalOpen: boolean;
  setIsSocialModalOpen: (open: boolean) => void;
  activeBroadcastPayload: SocialBroadcastPayload | null;
  setActiveBroadcastPayload: (payload: SocialBroadcastPayload | null) => void;
  
  // Repetition & Safety Handlers
  checkDuplicateListing: (title: string, imageUrl: string) => DuplicateCheckResult;
  checkImageDuplicate: (imageUrl: string) => { isDuplicate: boolean; matchedItemTitle?: string };

  // Reviews & Seller Trust
  reviews: SellerReview[];
  addReview: (review: Omit<SellerReview, 'id' | 'date'>) => void;
  getSellerReviews: (sellerId: string) => SellerReview[];
  getSellerTrustScore: (sellerId: string) => {
    score: number;
    reviewCount: number;
    positivePercent: number;
    breakdown: {
      accuracy: number;
      escrow: number;
      communication: number;
      authenticity: number;
    };
  };

  // Data actions
  addCollectible: (item: Omit<Collectible, 'id' | 'likesCount' | 'viewsCount' | 'listedAt' | 'status'>) => Promise<{ success: boolean; id?: string; error?: string; broadcastPayload?: SocialBroadcastPayload | null }>;
  updateCollectiblePrice: (id: string, newPriceETB: number) => void;
  submitOffer: (offer: Omit<TradeOffer, 'id' | 'status' | 'createdAt'>) => void;
  updateOfferStatus: (offerId: string, status: 'accepted' | 'declined' | 'countered', counterAmount?: number) => void;
  createEscrowOrder: (order: Omit<EscrowTransaction, 'id' | 'createdAt' | 'status' | 'inspectionCode'>) => string;
  completeEscrowInspection: (orderId: string) => void;
  sendMessage: (threadId: string, text: string, offerDetails?: ChatMessage['offerDetails']) => void;
  openChatForCollectible: (item: Collectible) => void;

  // Admin moderation actions
  approveListing: (id: string) => void;
  rejectListing: (id: string, reason: string) => void;
  flagListing: (id: string, reason: string) => void;
  deleteListing: (id: string) => void;
  markAsSold: (id: string) => void;
  
  // Alerts and Activity Feed
  activityFeed: ActivityItem[];
  alertNotifications: AlertNotification[];
  alertSettings: AlertSettings;
  updateAlertSettings: (newSettings: Partial<AlertSettings>) => void;
  sendAlert: (channel: 'sms' | 'email', title: string, body: string, metadata?: AlertNotification['metadata']) => void;

  // Collections
  tradeOffers: TradeOffer[];
  escrowOrders: EscrowTransaction[];
  chatThreads: ChatThread[];
  userListings: Collectible[];
}

const ETB_TO_USD_RATE = 135;

const ADMIN_EMAILS = new Set([
  'admin@agoza.et',
  'kirtasnetwork@gmail.com',
  'moderator@agoza.et',
]);

const defaultFilters: FilterState = {
  category: 'all',
  subcategory: 'all',
  searchQuery: '',
  condition: 'all',
  rarity: 'all',
  eraPeriod: 'all',
  openToTradeOnly: false,
  location: 'all',
  city: 'all',
  minPrice: 0,
  maxPrice: 10000000,
  sortBy: 'latest',
};

const MarketplaceContext = createContext<MarketplaceContextType | undefined>(undefined);

export const MarketplaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [collectibles, setCollectibles] = useState<Collectible[]>(() => {
    try {
      // Purge old relic versions
      localStorage.removeItem('agoza_collectibles');
      localStorage.removeItem('agoza_collectibles_v2');
      localStorage.removeItem('agoza_collectibles_v3');
      localStorage.removeItem('agoza_collectibles_v4');
      localStorage.removeItem('agoza_collectibles_v5');

      const saved = localStorage.getItem('agoza_ecommerce_v6');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Ensure no legacy relic IDs like ad-art-01 exist in cache
        const hasRelics = parsed.some((item: any) =>
          item.id?.startsWith('ad-art') ||
          item.title?.toLowerCase().includes('axumite') ||
          item.title?.toLowerCase().includes('lalibela cross')
        );
        if (!hasRelics && Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to parse cached items:', e);
    }
    // Always seed fresh modern P2P ecommerce items
    localStorage.setItem('agoza_ecommerce_v6', JSON.stringify(INITIAL_COLLECTIBLES));
    return INITIAL_COLLECTIBLES;
  });

  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [authReady, setAuthReady] = useState(false);

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup'>('signup');
  const [selectedCity, setSelectedCity] = useState<string>(() => {
    return localStorage.getItem('agoza_selected_city') || 'Addis Ababa';
  });

  // Persist local preferences (theme, currency, language, city) regardless of auth
  useEffect(() => {
    localStorage.setItem('agoza_selected_city', selectedCity);
  }, [selectedCity]);

  // Bootstrap Firebase auth state and sync user profile from Firestore
  useEffect(() => {
    let cancelled = false;
    const unsub = subscribeToAuth(async (fbUser) => {
      if (cancelled) return;
      if (!fbUser) {
        setCurrentUser(null);
        setAuthReady(true);
        return;
      }
      try {
        const profile = await fetchUserAccount(fbUser.uid);
        if (profile && !cancelled) {
          setCurrentUser(profile);
        } else if (!cancelled) {
          // Fallback: build a minimal account from the Firebase user itself
          setCurrentUser({
            id: fbUser.uid,
            name: fbUser.displayName || 'Trader',
            email: fbUser.email || '',
            phone: (fbUser as any).phoneNumber || '',
            city: selectedCity || 'Addis Ababa',
            telegramUsername: '',
            plan: 'free',
            createdAt: new Date().toISOString().split('T')[0],
            verified: fbUser.emailVerified,
            isAdmin: computeIsAdmin(fbUser.email),
          });
        }
      } catch (e) {
        console.warn('Failed to fetch user profile:', e);
      }
      if (!cancelled) setAuthReady(true);
    });
    return () => {
      cancelled = true;
      unsub();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const signup = async (data: Omit<UserAccount, 'id' | 'plan' | 'createdAt' | 'verified'> & { password: string }) => {
    const result = await signupUser({
      name: data.name,
      email: data.email,
      phone: data.phone,
      city: data.city,
      telegramUsername: data.telegramUsername,
      password: data.password,
    });
    if (result.success) {
      setIsAuthModalOpen(false);
    }
    return result;
  };

  const login = async (emailOrPhone: string, password: string) => {
    const email = emailOrPhone.includes('@') ? emailOrPhone : `${emailOrPhone}@trader.et`;
    const result = await loginUser(email, password);
    if (result.success) {
      setIsAuthModalOpen(false);
    }
    return result;
  };

  const logout = async () => {
    await logoutUser();
    setCurrentUser(null);
  };

  const [currency, setCurrency] = useState<Currency>(() => {
    return (localStorage.getItem('agoza_currency') as Currency) || 'ETB';
  });

  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem('agoza_language') as Language) || 'en';
  });

  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('agoza_theme');
    return (saved as Theme) || 'dark';
  });

  const [watchlist, setWatchlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('agoza_watchlist');
    return saved ? JSON.parse(saved) : ['ad-01', 'ad-02'];
  });

  const [tradeOffers, setTradeOffers] = useState<TradeOffer[]>(() => {
    const saved = localStorage.getItem('agoza_offers');
    return saved ? JSON.parse(saved) : INITIAL_OFFERS;
  });

  const [escrowOrders, setEscrowOrders] = useState<EscrowTransaction[]>(() => {
    const saved = localStorage.getItem('agoza_escrow');
    return saved ? JSON.parse(saved) : INITIAL_ESCROW_ORDERS;
  });

  const [chatThreads, setChatThreads] = useState<ChatThread[]>(() => {
    const saved = localStorage.getItem('agoza_chats_v2');
    return saved ? JSON.parse(saved) : INITIAL_CHAT_THREADS;
  });

  const [activityFeed, setActivityFeed] = useState<ActivityItem[]>(() => {
    const saved = localStorage.getItem('agoza_activity');
    return saved ? JSON.parse(saved) : INITIAL_ACTIVITIES;
  });

  const [alertNotifications, setAlertNotifications] = useState<AlertNotification[]>(() => {
    const saved = localStorage.getItem('agoza_alerts');
    return saved ? JSON.parse(saved) : INITIAL_ALERTS;
  });

  const [alertSettings, setAlertSettings] = useState<AlertSettings>(() => {
    const saved = localStorage.getItem('agoza_alert_settings');
    return saved
      ? JSON.parse(saved)
      : {
          enableSms: true,
          enableEmail: true,
          phoneNumber: '+251 91 199 8877',
          emailAddress: 'kirtasnetwork@gmail.com',
          notifyOnOffers: true,
          notifyOnEscrow: true,
          notifyOnSwaps: true,
        };
  });

  const [reviews, setReviews] = useState<SellerReview[]>(() => {
    const saved = localStorage.getItem('agoza_reviews');
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  useEffect(() => {
    localStorage.setItem('agoza_reviews', JSON.stringify(reviews));
  }, [reviews]);

  const addReview = (review: Omit<SellerReview, 'id' | 'date'>) => {
    const newReview: SellerReview = {
      ...review,
      id: `rev-${Date.now()}`,
      date: 'Just now',
    };
    setReviews((prev) => [newReview, ...prev]);
  };

  const getSellerReviews = (sellerId: string): SellerReview[] => {
    return reviews.filter((r) => r.sellerId === sellerId);
  };

  const getSellerTrustScore = (sellerId: string) => {
    const sellerReviews = getSellerReviews(sellerId);
    if (sellerReviews.length === 0) {
      return {
        score: 98,
        reviewCount: 0,
        positivePercent: 99,
        breakdown: {
          accuracy: 4.9,
          escrow: 5.0,
          communication: 4.8,
          authenticity: 5.0,
        },
      };
    }

    const avgRating =
      sellerReviews.reduce((sum, r) => sum + r.rating, 0) / sellerReviews.length;
    const positiveCount = sellerReviews.filter((r) => r.rating >= 4 || r.recommend).length;
    const positivePercent = Math.round((positiveCount / sellerReviews.length) * 100);
    const score = Math.min(100, Math.round(avgRating * 20));

    return {
      score,
      reviewCount: sellerReviews.length,
      positivePercent,
      breakdown: {
        accuracy: +(avgRating * 0.98).toFixed(1),
        escrow: 5.0,
        communication: +(avgRating * 0.96).toFixed(1),
        authenticity: +avgRating.toFixed(1),
      },
    };
  };

  // Sync user-specific preferences (watchlist + alert settings) to Firestore
  useEffect(() => {
    if (!currentUser || !authReady) return;
    let cancelled = false;
    const uid = currentUser.id;
    const timer = setTimeout(async () => {
      try {
        await saveUserSettings(uid, { watchlist, alertSettings });
      } catch (e) {
        console.warn('[firestore] failed to sync user settings:', e);
      }
      if (cancelled) return;
    }, 800);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, authReady, watchlist, alertSettings]);

  // Pull user settings from Firestore on login (cross-device sync)
  useEffect(() => {
    if (!currentUser || !authReady) return;
    let cancelled = false;
    (async () => {
      try {
        const settings = await fetchUserSettings(currentUser.id);
        if (settings && !cancelled) {
          if (settings.watchlist) setWatchlist(settings.watchlist);
          if (settings.alertSettings) setAlertSettings(settings.alertSettings);
        }
      } catch (e) {
        console.warn('[firestore] failed to fetch user settings:', e);
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser?.id, authReady]);

  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [activeView, setActiveView] = useState<'marketplace' | 'vault' | 'user-dashboard' | 'admin-dashboard' | 'plans'>('marketplace');
  const [selectedCollectible, setSelectedCollectible] = useState<Collectible | null>(null);

  // Modals & Drawers
  const [isListModalOpen, setIsListModalOpen] = useState(false);
  const [isPlansModalOpen, setIsPlansModalOpen] = useState(false);
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [isSwapModalOpen, setIsSwapModalOpen] = useState(false);
  const [isEscrowModalOpen, setIsEscrowModalOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isActivityFeedOpen, setIsActivityFeedOpen] = useState(false);
  const [isAlertsOpen, setIsAlertsOpen] = useState(false);
  const [isMobileCategoriesOpen, setIsMobileCategoriesOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isQuickBuyOpen, setIsQuickBuyOpen] = useState(false);
  const [quickBuyItem, setQuickBuyItem] = useState<Collectible | null>(null);

  const openQuickBuy = (item: Collectible) => {
    setQuickBuyItem(item);
    setIsQuickBuyOpen(true);
  };
  const [activeChatThreadId, setActiveChatThreadId] = useState<string | null>(null);

  // User Subscription Plan State
  const [userPlan, setUserPlan] = useState<PlanTier>(() => {
    const saved = localStorage.getItem('agoza_user_plan');
    if (saved === 'starter' || saved === 'pro' || saved === 'free') {
      return saved as PlanTier;
    }
    return 'free';
  });

  useEffect(() => {
    localStorage.setItem('agoza_user_plan', userPlan);
  }, [userPlan]);

  const activePlanDetails = getPlanById(userPlan);

  // Social Auto-Broadcasting & Omnichannel Marketing State
  const [socialMarketingSettings, setSocialMarketingSettings] = useState<SocialMarketingSettings>(() => {
    const saved = localStorage.getItem('agoza_social_settings');
    return saved ? JSON.parse(saved) : DEFAULT_SOCIAL_SETTINGS;
  });

  const [socialBroadcasts, setSocialBroadcasts] = useState<SocialBroadcastPayload[]>(() => {
    const saved = localStorage.getItem('agoza_social_broadcasts');
    return saved ? JSON.parse(saved) : [];
  });

  const [isSocialModalOpen, setIsSocialModalOpen] = useState(false);
  const [activeBroadcastPayload, setActiveBroadcastPayload] = useState<SocialBroadcastPayload | null>(null);

  useEffect(() => {
    localStorage.setItem('agoza_social_settings', JSON.stringify(socialMarketingSettings));
  }, [socialMarketingSettings]);

  useEffect(() => {
    localStorage.setItem('agoza_social_broadcasts', JSON.stringify(socialBroadcasts));
  }, [socialBroadcasts]);

  const updateSocialMarketingSettings = (newSettings: Partial<SocialMarketingSettings>) => {
    setSocialMarketingSettings((prev) => ({ ...prev, ...newSettings }));
  };

  // Sync theme with HTML class
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('agoza_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Deep-link: Read ?item=id from URL on initial load and sync when selectedCollectible changes
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const itemId = params.get('item');
      if (itemId && !selectedCollectible) {
        const found = collectibles.find((c) => c.id === itemId);
        if (found) {
          setSelectedCollectible(found);
        }
      }
    } catch (e) {
      console.warn('URL params parsing skipped:', e);
    }
  }, [collectibles]);

  useEffect(() => {
    try {
      const url = new URL(window.location.href);
      if (selectedCollectible) {
        url.searchParams.set('item', selectedCollectible.id);
      } else {
        url.searchParams.delete('item');
      }
      window.history.replaceState({}, '', url.toString());
    } catch (e) {
      console.warn('URL history sync skipped:', e);
    }
  }, [selectedCollectible]);

  // Persistence
  useEffect(() => {
    localStorage.setItem('agoza_ecommerce_v6', JSON.stringify(collectibles));
  }, [collectibles]);

  useEffect(() => {
    localStorage.setItem('agoza_currency', currency);
  }, [currency]);

  useEffect(() => {
    localStorage.setItem('agoza_language', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('agoza_watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  useEffect(() => {
    localStorage.setItem('agoza_offers', JSON.stringify(tradeOffers));
  }, [tradeOffers]);

  useEffect(() => {
    localStorage.setItem('agoza_escrow', JSON.stringify(escrowOrders));
  }, [escrowOrders]);

  useEffect(() => {
    localStorage.setItem('agoza_chats_v2', JSON.stringify(chatThreads));
  }, [chatThreads]);

  useEffect(() => {
    localStorage.setItem('agoza_activity', JSON.stringify(activityFeed));
  }, [activityFeed]);

  useEffect(() => {
    localStorage.setItem('agoza_alerts', JSON.stringify(alertNotifications));
  }, [alertNotifications]);

  useEffect(() => {
    localStorage.setItem('agoza_alert_settings', JSON.stringify(alertSettings));
  }, [alertSettings]);

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const formatPrice = (priceETB: number) => {
    if (currency === 'USD') {
      const usd = Math.round(priceETB / ETB_TO_USD_RATE);
      return `$${usd.toLocaleString()}`;
    }
    return `${priceETB.toLocaleString()} Br`;
  };

  const toggleWatchlist = (id: string) => {
    setWatchlist((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      setCollectibles((cols) =>
        cols.map((c) => (c.id === id ? { ...c, likesCount: c.likesCount + (prev.includes(id) ? -1 : 1) } : c))
      );
      return next;
    });
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
  };

  // Repetition Handler: Same item cannot be posted with the same photo,
  // but CAN be posted if a different image is used.
  const checkDuplicateListing = (title: string, imageUrl: string): DuplicateCheckResult => {
    const cleanTitle = title.trim().toLowerCase();
    const cleanImg = imageUrl.trim();

    if (!cleanTitle) return { isDuplicate: false };

    const matchingItem = collectibles.find((c) => {
      const existingTitle = c.title.trim().toLowerCase();
      return existingTitle === cleanTitle;
    });

    if (matchingItem) {
      if (matchingItem.imageUrl.trim() === cleanImg) {
        return {
          isDuplicate: true,
          reason: t.duplicateWarning,
        };
      } else {
        return {
          isDuplicate: false,
          isAllowedWithDifferentImage: true,
          reason: 'Photo verified: Distinct photo detected for this item. Approved to post.',
        };
      }
    }

    return { isDuplicate: false };
  };

  const checkImageDuplicate = (imageUrl: string): { isDuplicate: boolean; matchedItemTitle?: string } => {
    if (!imageUrl) return { isDuplicate: false };
    const cleanImg = imageUrl.trim();
    const match = collectibles.find(
      (c) => c.imageUrl.trim() === cleanImg || c.additionalImages?.some((img) => img.trim() === cleanImg)
    );
    if (match) {
      return {
        isDuplicate: true,
        matchedItemTitle: match.title,
      };
    }
    return { isDuplicate: false };
  };

  const updateAlertSettings = (newSettings: Partial<AlertSettings>) => {
    setAlertSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const sendAlert = (
    channel: 'sms' | 'email',
    title: string,
    body: string,
    metadata?: AlertNotification['metadata']
  ) => {
    const recipient = channel === 'sms' ? alertSettings.phoneNumber : alertSettings.emailAddress;
    const newAlert: AlertNotification = {
      id: `alt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      channel,
      recipient,
      title,
      body,
      timestamp: 'Just now',
      status: 'delivered',
      metadata,
    };
    setAlertNotifications((prev) => [newAlert, ...prev]);
  };

  const subscribeToPlan = (planId: PlanTier, paymentMethod: string = 'Telebirr') => {
    const targetPlan = getPlanById(planId);
    setUserPlan(planId);

    // Activity feed
    const activity: ActivityItem = {
      id: `act-${Date.now()}`,
      type: 'listing',
      actorName: 'You (Trader)',
      actionText: `subscribed to ${targetPlan.name} (${targetPlan.priceETB === 0 ? 'Free' : formatPrice(targetPlan.priceETB) + '/mo'})`,
      targetTitle: `${targetPlan.name} Membership`,
      location: 'Addis Ababa',
      timestamp: 'Just now',
      iconType: 'shield',
    };
    setActivityFeed((prev) => [activity, ...prev]);

    // Send Alert Notification
    if (alertSettings.enableSms) {
      sendAlert(
        'sms',
        `Agoza Plan Activated: ${targetPlan.name}`,
        `Your subscription to ${targetPlan.name} is confirmed via ${paymentMethod}. Active perks: ${targetPlan.visibilityBoost}, ${targetPlan.badge} privileges.`,
        { amountETB: targetPlan.priceETB }
      );
    }
    if (alertSettings.enableEmail) {
      sendAlert(
        'email',
        `Subscription Receipt: ${targetPlan.name}`,
        `Thank you for subscribing to Agoza ${targetPlan.name} via ${paymentMethod}. You now enjoy ${targetPlan.maxListings} listings, ${targetPlan.maxPhotosPerListing} photos, and ${targetPlan.commissionEscrowRate}% protection fees.`,
        { amountETB: targetPlan.priceETB }
      );
    }

    return {
      success: true,
      message: `Successfully upgraded to ${targetPlan.name}!`,
    };
  };

  const broadcastListingToSocials = (item: Collectible): SocialBroadcastPayload => {
    const payload = createSocialBroadcastPayload(
      item,
      formatPrice(item.priceETB),
      socialMarketingSettings
    );
    setSocialBroadcasts((prev) => [payload, ...prev.filter((p) => p.itemId !== item.id)]);
    setActiveBroadcastPayload(payload);

    // Push to Activity Feed
    const activity: ActivityItem = {
      id: `act-${Date.now()}`,
      type: 'listing',
      actorName: 'Agoza Marketing Bot',
      actionText: `auto-broadcasted "${item.title}" to Telegram (54k), Instagram (36k), Facebook (82k), TikTok (45k), Pinterest (18k)`,
      targetTitle: item.title,
      location: item.origin,
      timestamp: 'Just now',
      iconType: 'tag',
    };
    setActivityFeed((prev) => [activity, ...prev]);

    return payload;
  };

  const addCollectible = async (
    item: Omit<Collectible, 'id' | 'likesCount' | 'viewsCount' | 'listedAt' | 'status'>
  ) => {
    // 1. Prohibited Items / Harmful Items / Drug Safety Check (local fast path)
    const safetyCheck = checkSafetyCompliance(item.title, item.description);
    if (!safetyCheck.isSafe) {
      return { success: false, error: safetyCheck.violationReason || t.prohibitedItemWarning };
    }

    // 1b. AI-powered safety screen (best-effort secondary gate)
    try {
      const aiVerdict = await aiScreenListing(item.title, item.description);
      if (!aiVerdict.safe && aiVerdict.confidence >= 0.8) {
        return {
          success: false,
          error: aiVerdict.reason || 'Listing rejected by AI safety screen.',
        };
      }
    } catch (e) {
      // AI screen failure is non-fatal; local filter governs.
      console.warn('[aiSafety] screen skipped:', e);
    }

    // 2. Repetition & Duplicate Image Check
    const dupCheck = checkDuplicateListing(item.title, item.imageUrl);
    if (dupCheck.isDuplicate) {
      return { success: false, error: dupCheck.reason || t.duplicateWarning };
    }

    const newItem: Collectible = {
      ...item,
      id: `ad-${Date.now()}`,
      likesCount: 1,
      viewsCount: 1,
      listedAt: 'Just now',
      status: 'active',
      moderationStatus: 'approved',
    };
    setCollectibles((prev) => [newItem, ...prev]);

    // Persist to Firestore (best-effort; offline cache keeps UI responsive)
    try {
      await saveListing(newItem);
    } catch (e) {
      console.warn('[firestore] failed to persist listing:', e);
    }

    // Push to Activity Feed
    const activity: ActivityItem = {
      id: `act-${Date.now()}`,
      type: 'listing',
      actorName: 'You (Trader)',
      actionText: 'posted new classified ad',
      targetTitle: item.title,
      location: item.seller.location,
      timestamp: 'Just now',
      iconType: 'plus',
    };
    setActivityFeed((prev) => [activity, ...prev]);

    // 3. Automated Social Omnichannel Syndication (Telegram, IG, FB, TikTok, Pinterest)
    let broadcastPayload: SocialBroadcastPayload | null = null;
    if (socialMarketingSettings.autoBroadcastEnabled) {
      broadcastPayload = broadcastListingToSocials(newItem);
    }

    // Alert dispatch
    if (alertSettings.enableSms) {
      sendAlert(
        'sms',
        'Agoza Ad Published & Marketed',
        `Your listing "${item.title}" is live on Agoza Marketplace (${formatPrice(item.priceETB)}) and auto-broadcasted to official Telegram & Social channels.`
      );
    }
    if (alertSettings.enableEmail) {
      sendAlert(
        'email',
        'Listing Live & Social Syndication Active: ' + item.title,
        `Congratulations! Your item is live on Agoza Ethiopia and automatically syndicated to our 265,000+ social subscriber base across Telegram, Instagram, Facebook, TikTok, and Pinterest.`
      );
    }

    return { success: true, id: newItem.id, broadcastPayload };
  };

  const updateCollectiblePrice = (id: string, newPriceETB: number) => {
    setCollectibles((prev) =>
      prev.map((c) => (c.id === id ? { ...c, priceETB: newPriceETB } : c))
    );
  };

  const submitOffer = (offer: Omit<TradeOffer, 'id' | 'status' | 'createdAt'>) => {
    const newOffer: TradeOffer = {
      ...offer,
      id: `off-${Date.now()}`,
      status: 'pending',
      createdAt: 'Just now',
    };
    setTradeOffers((prev) => [newOffer, ...prev]);

    const targetCol = collectibles.find((c) => c.id === offer.collectibleId);
    if (targetCol) {
      const offerText =
        offer.type === 'cash-offer'
          ? `Cash Offer: ${formatPrice(offer.offerAmountETB || 0)}`
          : `Swap Proposal: Offered "${offer.offeredItemTitle}" + ${formatPrice(offer.cashAdjustmentETB || 0)}`;

      const activity: ActivityItem = {
        id: `act-${Date.now()}`,
        type: offer.type === 'cash-offer' ? 'offer' : 'swap',
        actorName: offer.buyerName,
        actionText: offer.type === 'cash-offer' ? `submitted offer of ${formatPrice(offer.offerAmountETB || 0)} for` : `proposed swap for`,
        targetTitle: targetCol.title,
        amountETB: offer.offerAmountETB,
        timestamp: 'Just now',
        iconType: offer.type === 'cash-offer' ? 'tag' : 'refresh',
      };
      setActivityFeed((prev) => [activity, ...prev]);

      if (alertSettings.enableSms && alertSettings.notifyOnOffers) {
        sendAlert('sms', 'Agoza Offer Sent', `Offer of ${formatPrice(offer.offerAmountETB || targetCol.priceETB)} transmitted to ${targetCol.seller.name}.`);
      }
      if (alertSettings.enableEmail && alertSettings.notifyOnOffers) {
        sendAlert('email', 'Offer Confirmation', `Your offer on "${targetCol.title}" is pending seller review.`);
      }

      const existingThread = chatThreads.find((t) => t.collectibleId === targetCol.id);
      if (existingThread) {
        sendMessage(existingThread.id, `${offerText}. "${offer.message}"`, {
          type: offer.type === 'cash-offer' ? 'cash' : 'swap',
          amountETB: offer.offerAmountETB,
          itemName: offer.offeredItemTitle,
        });
      } else {
        const newThread: ChatThread = {
          id: `chat-${targetCol.id}`,
          collectibleId: targetCol.id,
          collectibleTitle: targetCol.title,
          collectibleImage: targetCol.imageUrl,
          collectiblePriceETB: targetCol.priceETB,
          sellerName: targetCol.seller.name,
          sellerAvatar: targetCol.seller.avatar,
          lastMessage: offerText,
          lastTimestamp: 'Just now',
          unreadCount: 0,
          messages: [
            {
              id: `m-${Date.now()}`,
              senderId: 'buyer-me',
              senderName: 'You',
              text: `${offerText}. "${offer.message}"`,
              timestamp: 'Just now',
              isOfferCard: true,
              offerDetails: {
                type: offer.type === 'cash-offer' ? 'cash' : 'swap',
                amountETB: offer.offerAmountETB,
                itemName: offer.offeredItemTitle,
              },
            },
          ],
        };
        setChatThreads((prev) => [newThread, ...prev]);
        setActiveChatThreadId(newThread.id);
      }
    }
  };

  const updateOfferStatus = (offerId: string, status: 'accepted' | 'declined' | 'countered', counterAmount?: number) => {
    setTradeOffers((prev) =>
      prev.map((off) =>
        off.id === offerId
          ? {
              ...off,
              status,
              ...(counterAmount ? { counterAmountETB: counterAmount } : {}),
            }
          : off
      )
    );

    const offer = tradeOffers.find((o) => o.id === offerId);
    if (offer && alertSettings.enableSms) {
      sendAlert('sms', `Agoza Offer ${status.toUpperCase()}`, `The offer on "${offer.collectibleTitle}" was marked as ${status}.`);
    }

    // Persist to Firestore (best-effort)
    try {
      firestoreUpdateOfferStatus(offerId, status, counterAmount);
    } catch (e) {
      console.warn('[firestore] failed to persist offer status:', e);
    }
  };

  const createEscrowOrder = (
    order: Omit<EscrowTransaction, 'id' | 'createdAt' | 'status' | 'inspectionCode'>
  ): string => {
    const code = `AGOZA-${Math.floor(1000 + Math.random() * 9000)}-SEC`;
    const newOrder: EscrowTransaction = {
      ...order,
      id: `esc-${Date.now()}`,
      status: 'funds-in-escrow',
      inspectionCode: code,
      createdAt: 'Just now',
    };
    setEscrowOrders((prev) => [newOrder, ...prev]);

    setCollectibles((prev) =>
      prev.map((c) => (c.id === order.collectibleId ? { ...c, status: 'in-escrow' } : c))
    );

    const activity: ActivityItem = {
      id: `act-${Date.now()}`,
      type: 'escrow',
      actorName: 'You (Buyer)',
      actionText: `deposited ${formatPrice(order.priceETB)} in safe buyer protection for`,
      targetTitle: order.collectibleTitle,
      location: order.selectedHub,
      amountETB: order.priceETB,
      timestamp: 'Just now',
      iconType: 'shield',
    };
    setActivityFeed((prev) => [activity, ...prev]);

    if (alertSettings.enableSms && alertSettings.notifyOnEscrow) {
      sendAlert(
        'sms',
        'Agoza Safe Deposit Locked',
        `Funds (${formatPrice(order.priceETB)}) are safely held in trust. Private Inspection Code: ${code}. Meet at ${order.selectedHub}.`,
        { orderId: newOrder.id, code, amountETB: order.priceETB }
      );
    }
    if (alertSettings.enableEmail && alertSettings.notifyOnEscrow) {
      sendAlert(
        'email',
        `Buyer Protection Confirmation [${code}]`,
        `Your payment for "${order.collectibleTitle}" is safely protected in Agoza Vault. Provide code ${code} ONLY after in-person inspection.`,
        { orderId: newOrder.id, code, amountETB: order.priceETB }
      );
    }

    return newOrder.id;
  };

  const completeEscrowInspection = (orderId: string) => {
    const order = escrowOrders.find((o) => o.id === orderId);
    setEscrowOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          return { ...ord, status: 'funds-released' };
        }
        return ord;
      })
    );

    // Persist to Firestore (best-effort)
    try {
      updateEscrow(orderId, { status: 'funds-released' });
    } catch (e) {
      console.warn('[firestore] failed to persist escrow completion:', e);
    }

    if (order) {
      const activity: ActivityItem = {
        id: `act-${Date.now()}`,
        type: 'inspection',
        actorName: 'You (Buyer)',
        actionText: 'verified inspection & released protected payment for',
        targetTitle: order.collectibleTitle,
        location: order.selectedHub,
        amountETB: order.priceETB,
        timestamp: 'Just now',
        iconType: 'check',
      };
      setActivityFeed((prev) => [activity, ...prev]);

      if (alertSettings.enableSms) {
        sendAlert(
          'sms',
          'Agoza Safe Payment Released',
          `Inspection verified! ${formatPrice(order.priceETB)} transferred to ${order.sellerName}. Transaction complete.`
        );
      }
    }
  };

  const sendMessage = (threadId: string, text: string, offerDetails?: ChatMessage['offerDetails']) => {
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: 'buyer-me',
      senderName: 'You',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isOfferCard: Boolean(offerDetails),
      offerDetails,
    };

    setChatThreads((prev) =>
      prev.map((thread) => {
        if (thread.id === threadId) {
          return {
            ...thread,
            lastMessage: text,
            lastTimestamp: 'Just now',
            messages: [...thread.messages, newMsg],
          };
        }
        return thread;
      })
    );

    setTimeout(() => {
      const responses = [
        "Selam! Yes, the item is available with complete papers. Can you meet at Bole Morning Star Hub?",
        "Amesegenalehu! That's a fair proposal. Let's arrange safe hub handoff so both sides are secured.",
        "Yes, original customs clearance and warranty are ready. What time works best for you?",
        "Thank you for contacting! Feel free to call or WhatsApp me at my verified number.",
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];

      setChatThreads((prev) =>
        prev.map((thread) => {
          if (thread.id === threadId) {
            const replyMsg: ChatMessage = {
              id: `msg-${Date.now() + 1}`,
              senderId: 'seller',
              senderName: thread.sellerName,
              text: randomResponse,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            };
            return {
              ...thread,
              lastMessage: randomResponse,
              lastTimestamp: 'Just now',
              messages: [...thread.messages, replyMsg],
            };
          }
          return thread;
        })
      );
    }, 1200);
  };

  const openChatForCollectible = (item: Collectible) => {
    let thread = chatThreads.find((t) => t.collectibleId === item.id);
    if (!thread) {
      thread = {
        id: `chat-${item.id}`,
        collectibleId: item.id,
        collectibleTitle: item.title,
        collectibleImage: item.imageUrl,
        collectiblePriceETB: item.priceETB,
        sellerName: item.seller.name,
        sellerAvatar: item.seller.avatar,
        lastMessage: 'Conversation started',
        lastTimestamp: 'Just now',
        unreadCount: 0,
        messages: [
          {
            id: `m-init-${Date.now()}`,
            senderId: item.seller.id,
            senderName: item.seller.name,
            text: `Selam! Thanks for inquiring about "${item.title}". I'm available for questions, price bargaining, or safe hub inspection.`,
            timestamp: 'Just now',
          },
        ],
      };
      setChatThreads((prev) => [thread!, ...prev]);
    }
    setActiveChatThreadId(thread.id);
    setIsChatOpen(true);
  };

  // Admin moderation actions
  const approveListing = (id: string) => {
    setCollectibles((prev) =>
      prev.map((c) => (c.id === id ? { ...c, moderationStatus: 'approved', flagReason: undefined } : c))
    );
    try { updateListing(id, { moderationStatus: 'approved', flagReason: undefined }); } catch (e) { console.warn('[firestore] approveListing:', e); }
  };

  const rejectListing = (id: string, reason: string) => {
    setCollectibles((prev) =>
      prev.map((c) => (c.id === id ? { ...c, moderationStatus: 'flagged', flagReason: reason } : c))
    );
    try { updateListing(id, { moderationStatus: 'flagged', flagReason: reason }); } catch (e) { console.warn('[firestore] rejectListing:', e); }
  };

  const flagListing = (id: string, reason: string) => {
    setCollectibles((prev) =>
      prev.map((c) => (c.id === id ? { ...c, moderationStatus: 'flagged', flagReason: reason } : c))
    );
    try { updateListing(id, { moderationStatus: 'flagged', flagReason: reason }); } catch (e) { console.warn('[firestore] flagListing:', e); }
  };

  const deleteListing = (id: string) => {
    setCollectibles((prev) => prev.filter((c) => c.id !== id));
    try { deleteListingDoc(id); } catch (e) { console.warn('[firestore] deleteListing:', e); }
  };

  const markAsSold = (id: string) => {
    setCollectibles((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: 'sold' } : c))
    );
    try { updateListing(id, { status: 'sold' }); } catch (e) { console.warn('[firestore] markAsSold:', e); }
  };

  const userListings = collectibles.filter(
    (c) => c.seller.id === 'usr-me' || c.seller.name.includes('You')
  );

  const isAdmin = Boolean(currentUser?.isAdmin);

  return (
    <MarketplaceContext.Provider
      value={{
        collectibles,
        currency,
        setCurrency,
        formatPrice,
        language,
        setLanguage,
        theme,
        toggleTheme,
        t,
        selectedCollectible,
        setSelectedCollectible,
        watchlist,
        toggleWatchlist,
        filters,
        setFilters,
        resetFilters,
        activeView,
        setActiveView,
        isListModalOpen,
        setIsListModalOpen,
        isPlansModalOpen,
        setIsPlansModalOpen,
        userPlan,
        setUserPlan,
        activePlanDetails,
        subscribeToPlan,
        socialMarketingSettings,
        updateSocialMarketingSettings,
        socialBroadcasts,
        broadcastListingToSocials,
        isSocialModalOpen,
        setIsSocialModalOpen,
        activeBroadcastPayload,
        setActiveBroadcastPayload,
        isOfferModalOpen,
        setIsOfferModalOpen,
        isSwapModalOpen,
        setIsSwapModalOpen,
        isEscrowModalOpen,
        setIsEscrowModalOpen,
        isChatOpen,
        setIsChatOpen,
        isActivityFeedOpen,
        setIsActivityFeedOpen,
        isAlertsOpen,
        setIsAlertsOpen,
        isMobileCategoriesOpen,
        setIsMobileCategoriesOpen,
        isSearchModalOpen,
        setIsSearchModalOpen,
        isQuickBuyOpen,
        setIsQuickBuyOpen,
        quickBuyItem,
        setQuickBuyItem,
        openQuickBuy,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalMode,
        setAuthModalMode,
        authReady,
        activeChatThreadId,
        setActiveChatThreadId,
        currentUser,
        signup,
        login,
        logout,
        selectedCity,
        setSelectedCity,
        isAdmin,
        checkDuplicateListing,
        checkImageDuplicate,
        reviews,
        addReview,
        getSellerReviews,
        getSellerTrustScore,
        addCollectible,
        updateCollectiblePrice,
        submitOffer,
        updateOfferStatus,
        createEscrowOrder,
        completeEscrowInspection,
        sendMessage,
        openChatForCollectible,
        approveListing,
        rejectListing,
        flagListing,
        deleteListing,
        markAsSold,
        activityFeed,
        alertNotifications,
        alertSettings,
        updateAlertSettings,
        sendAlert,
        tradeOffers,
        escrowOrders,
        chatThreads,
        userListings,
      }}
    >
      {children}
    </MarketplaceContext.Provider>
  );
};

export const useMarketplace = () => {
  const context = useContext(MarketplaceContext);
  if (!context) {
    throw new Error('useMarketplace must be used within a MarketplaceProvider');
  }
  return context;
};
