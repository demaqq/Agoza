export type Currency = 'ETB' | 'USD';

export type Language = 'en' | 'am' | 'ti' | 'om' | 'so';

export type Theme = 'light' | 'dark';

export type CollectibleCategory = 
  | 'all'
  | 'phones-tablets'
  | 'electronics-laptops'
  | 'vehicles-cars'
  | 'fashion-clothes'
  | 'home-furniture'
  | 'agriculture-food'
  | 'property-realestate'
  | 'jobs-services'
  | 'books-cultural'
  | 'art-collectibles';

export type ProductCategory = CollectibleCategory;

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  telegramUsername: string;
  avatar?: string;
  plan: PlanTier;
  createdAt: string;
  verified: boolean;
  isAdmin?: boolean;
}

export type ItemCondition = 
  | 'Brand New'
  | 'Like New'
  | 'Used - Excellent'
  | 'Used - Good'
  | 'Refurbished'
  | 'For Parts';

export type ItemRarity = 
  | 'Common'
  | 'Uncommon'
  | 'Rare'
  | 'Ultra Rare'
  | 'Unique';

export type HistoricalEraPeriod =
  | 'all'
  | 'ancient'
  | 'imperial'
  | 'vintage'
  | 'millennium'
  | 'modern';

export interface SellerReview {
  id: string;
  sellerId: string;
  authorName: string;
  authorAvatar?: string;
  rating: number; // 1 to 5
  date: string;
  comment: string;
  itemTitle?: string;
  verifiedPurchase: boolean;
  recommend: boolean;
}

export interface SellerProfile {
  id: string;
  name: string;
  avatar: string;
  location: string;
  city: string;
  phone: string;
  telegramHandle?: string;
  verifiedKyc: boolean;
  memberSince: string;
  rating: number;
  totalTrades: number;
  reviewsCount?: number;
  trustScore?: number; // e.g. 99 (%)
  badge: 'Verified Trader' | 'Top Seller' | 'Deal Maker' | 'Pro Merchant';
  responseRate: string;
}

export interface Collectible {
  id: string;
  title: string;
  category: CollectibleCategory;
  subcategory?: string;
  priceETB: number;
  condition: ItemCondition;
  era: string; // Specs & Model (e.g. "Model 2024 · 256GB" or "Automatic · 31,000 km")
  eraPeriod?: HistoricalEraPeriod;
  rarity?: ItemRarity;
  brand?: string;
  model?: string;
  origin: string; // e.g. "Bole, Addis Ababa"
  description: string;
  provenance: string; // Warranty, specs, papers or original invoice
  imageUrl: string;
  additionalImages?: string[];
  seller: SellerProfile;
  openToTrade: boolean;
  tradeInterests?: string[];
  safeMeetupSpot: string;
  authenticityGuaranteed: boolean;
  deliveryOption?: 'pickup-only' | 'hub-escrow' | 'city-delivery';
  featured?: boolean;
  likesCount: number;
  viewsCount: number;
  listedAt: string;
  status: 'active' | 'in-escrow' | 'traded' | 'sold';
  moderationStatus?: 'approved' | 'pending' | 'flagged';
  flagReason?: string;
}

export type ProductItem = Collectible;

export interface TradeOffer {
  id: string;
  collectibleId: string;
  collectibleTitle: string;
  buyerName: string;
  buyerAvatar: string;
  buyerLocation: string;
  type: 'cash-offer' | 'swap-trade';
  offerAmountETB?: number;
  offeredItemTitle?: string;
  offeredItemImage?: string;
  cashAdjustmentETB?: number;
  message: string;
  status: 'pending' | 'accepted' | 'declined' | 'countered';
  counterAmountETB?: number;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
  isOfferCard?: boolean;
  offerDetails?: {
    type: 'cash' | 'swap';
    amountETB?: number;
    itemName?: string;
  };
}

export interface ChatThread {
  id: string;
  collectibleId: string;
  collectibleTitle: string;
  collectibleImage: string;
  collectiblePriceETB: number;
  sellerName: string;
  sellerAvatar: string;
  lastMessage: string;
  lastTimestamp: string;
  unreadCount: number;
  messages: ChatMessage[];
}

export interface EscrowTransaction {
  id: string;
  collectibleId: string;
  collectibleTitle: string;
  collectibleImage: string;
  priceETB: number;
  buyerName: string;
  sellerName: string;
  sellerId?: string;
  buyerId?: string;
  paymentMethod?: string;
  handoffMethod: 'safe-hub-meetup' | 'secure-escrow-courier';
  selectedHub: string;
  status: 'funds-in-escrow' | 'inspection-scheduled' | 'handoff-completed' | 'funds-released';
  inspectionCode: string;
  createdAt: string;
}

export interface ActivityItem {
  id: string;
  type: 'escrow' | 'swap' | 'offer' | 'listing' | 'inspection';
  actorName: string;
  actionText: string;
  targetTitle: string;
  location?: string;
  amountETB?: number;
  timestamp: string;
  iconType: 'shield' | 'refresh' | 'tag' | 'plus' | 'check';
}

export interface AlertNotification {
  id: string;
  channel: 'sms' | 'email' | 'system';
  recipient: string;
  title: string;
  body: string;
  timestamp: string;
  status: 'delivered' | 'read';
  metadata?: {
    orderId?: string;
    code?: string;
    amountETB?: number;
  };
}

export interface AlertSettings {
  enableSms: boolean;
  enableEmail: boolean;
  phoneNumber: string;
  emailAddress: string;
  notifyOnOffers: boolean;
  notifyOnEscrow: boolean;
  notifyOnSwaps: boolean;
}

export type PlanTier = 'free' | 'starter' | 'pro';

export interface PlanFeature {
  text: string;
  included: boolean;
  highlight?: boolean;
}

export interface SubscriptionPlan {
  id: PlanTier;
  name: string;
  nameAmharic: string;
  priceETB: number; // 0 for Free, 699 for Starter, 1499 for Pro
  billingPeriod: string; // 'per month' / 'በወር'
  headline: string;
  badge: string;
  popular?: boolean;
  maxListings: number | 'Unlimited';
  maxPhotosPerListing: number;
  commissionEscrowRate: number; // in percentage e.g. 2.5%, 1.5%, 0%
  visibilityBoost: string;
  supportLevel: string;
  features: PlanFeature[];
}

export type SocialPlatformId =
  | 'telegram-channel'
  | 'telegram-group'
  | 'instagram'
  | 'facebook'
  | 'tiktok'
  | 'pinterest';

export interface SocialBroadcastStatus {
  platform: SocialPlatformId;
  platformName: string;
  accountHandle: string;
  status: 'queued' | 'publishing' | 'published' | 'failed';
  postUrl?: string;
  postId?: string;
  publishedAt?: string;
  reachEstimate?: string;
  errorMessage?: string;
}

export interface SocialBroadcastPayload {
  id: string;
  itemId: string;
  itemTitle: string;
  itemPriceETB: number;
  category: string;
  condition: string;
  origin: string;
  safeHub: string;
  imageUrl: string;
  captionAmharic: string;
  captionEnglish: string;
  hashtags: string[];
  canonicalUrl: string;
  telegramFormattedText: string;
  platforms: SocialBroadcastStatus[];
  totalEstimatedReach: string;
  createdAt: string;
}

export interface SocialMarketingSettings {
  autoBroadcastEnabled: boolean;
  telegramChannelEnabled: boolean;
  telegramChannelHandle: string;
  telegramGroupEnabled: boolean;
  telegramGroupHandle: string;
  instagramEnabled: boolean;
  instagramHandle: string;
  facebookEnabled: boolean;
  facebookPageName: string;
  tiktokEnabled: boolean;
  tiktokHandle: string;
  pinterestEnabled: boolean;
  pinterestBoard: string;
  includeAmharicCaption: boolean;
  includePriceInCaption: boolean;
  includeWatermarkGuarantee: boolean;
  includeSafeHubTag: boolean;
}

export interface CoffeeBlessing {
  id: string;
  sellerId: string;
  sellerName: string;
  buyerName: string;
  itemTitle: string;
  blessingAmharic: string;
  blessingEnglish: string;
  beansAwarded: number;
  timestamp: string;
}

export interface CustomerDealAgreement {
  id: string;
  collectibleId: string;
  collectibleTitle: string;
  collectibleImage: string;
  sellerName: string;
  buyerName: string;
  agreedPriceETB: number;
  originalPriceETB: number;
  safeHub: string;
  contractHash: string;
  timestamp: string;
  status: 'sealed' | 'escrow_pending' | 'completed';
}

export interface LoyaltyPerk {
  id: string;
  title: string;
  titleAmharic: string;
  beanCost: number;
  description: string;
  type: 'fee_discount' | 'priority_inspection' | 'spotlight_boost' | 'heritage_badge';
}
