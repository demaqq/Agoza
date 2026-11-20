/**
 * UI chrome strings (navigation, hero, feed, cards, filters, footer) for every
 * supported language. English is the complete source of truth; other languages
 * may omit keys and fall back to English via `getTranslations()`.
 *
 * Placeholders use `{name}` syntax — fill them with `fmt()`.
 *
 * NOTE: non-English strings should be reviewed by native speakers before launch.
 */
import type { CollectibleCategory, ItemCondition, Language } from '../types';

export interface UiStrings {
  nav: {
    newFeatured: string;
    phonesTech: string;
    vehicles: string;
    fashion: string;
    homeDecor: string;
    swapsBarter: string;
    home: string;
    categories: string;
    chats: string;
    myAds: string;
    admin: string;
    marketplaceFeed: string;
    myAccount: string;
    postAd: string;
  };
  header: {
    search: string;
    ethiopianCities: string;
    selectCity: string;
    alerts: string;
    chat: string;
    settings: string;
    preferences: string;
    theme: string;
    dark: string;
    light: string;
    currency: string;
    language: string;
    seoInspector: string;
    adminModeration: string;
    signIn: string;
    menu: string;
  };
  hero: {
    kicker: string;
    kickerSub: string;
    shopLatest: string;
    postListing: string;
    statListings: string;
    statCities: string;
    statProtected: string;
  };
  feed: {
    listingsAvailable: string;
    feedSubtitle: string;
    activeFilters: string;
    searchChip: string;
    under: string;
    resetAll: string;
    tipTitle: string;
    tip: string;
    noResultsTitle: string;
    noResultsBody: string;
    resetAllFilters: string;
    refreshed: string;
    itemHidden: string;
    bunaBlessing: string;
    handshakeDeal: string;
    gridView: string;
    compactView: string;
    dismiss: string;
  };
  card: {
    view: string;
    save: string;
    savedToast: string;
    removedToast: string;
    removeSaved: string;
    inspect: string;
    pass: string;
    verifiedSeller: string;
    verifiedListing: string;
    newSeller: string;
  };
  filters: {
    browseAll: string;
    allCities: string;
    allConditions: string;
    sortLatest: string;
    sortPriceAsc: string;
    sortPriceDesc: string;
    sortPopular: string;
    reset: string;
    subcategories: string;
    showAll: string;
  };
  conditions: Record<ItemCondition, string>;
  footer: {
    allItems: string;
    plans: string;
    tagline: string;
    safety: string;
    rights: string;
  };
  common: {
    close: string;
  };
  wise: {
    title: string;
    matches: string;
    subtitle: string;
    tailorForMe: string;
    tailored: string;
    myCity: string;
    beans: string;
    preferences: string;
    reset: string;
    budgetCap: string;
    anyBudget: string;
    under: string;
    verifiedOnly: string;
    interests: string;
    safeTitle: string;
    safeBody: string;
    guarantee: string;
  };
  auth: {
    titleSignup: string;
    titleSignin: string;
    subSignup: string;
    subSignin: string;
    tabSignup: string;
    tabSignin: string;
    fullName: string;
    city: string;
    telegram: string;
    telegramHint: string;
    optional: string;
    phone: string;
    email: string;
    password: string;
    trustTitle: string;
    trustBody: string;
    processing: string;
    submitSignup: string;
    submitSignin: string;
    haveAccount: string;
    noAccount: string;
    createAccount: string;
    forgot: string;
    errName: string;
    errEmail: string;
    errPassword: string;
    errPhone: string;
    successSignup: string;
    successSignin: string;
    errResetEmail: string;
    resetSent: string;
  };

  categoryNames: Record<CollectibleCategory, string>;
}

export type DeepPartial<T> = { [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K] };

const en: UiStrings = {
  nav: {
    newFeatured: 'New & Featured',
    phonesTech: 'Phones & Tech',
    vehicles: 'Vehicles',
    fashion: 'Fashion',
    homeDecor: 'Home & Decor',
    swapsBarter: 'Swaps & Barter',
    home: 'Home',
    categories: 'Categories',
    chats: 'Chats',
    myAds: 'My Ads',
    admin: 'Admin',
    marketplaceFeed: 'Marketplace',
    myAccount: 'My Account',
    postAd: 'Post an ad',
  },
  header: {
    search: 'Search',
    ethiopianCities: 'Ethiopian cities',
    selectCity: 'Select your city',
    alerts: 'Alerts & notifications',
    chat: 'Messages',
    settings: 'Settings',
    preferences: 'Preferences',
    theme: 'Theme',
    dark: 'Dark',
    light: 'Light',
    currency: 'Currency',
    language: 'Language',
    seoInspector: 'SEO meta inspector',
    adminModeration: 'Admin moderation',
    signIn: 'Sign in',
    menu: 'Menu',
  },
  hero: {
    kicker: 'Verified sellers',
    kickerSub: 'Safe in-person exchange',
    shopLatest: 'Browse listings',
    postListing: 'Post a free ad',
    statListings: 'Active listings',
    statCities: 'Cities covered',
    statProtected: 'Buyer protection',
  },
  feed: {
    listingsAvailable: '{count} listings available',
    feedSubtitle: 'Protected by verified exchange hubs and payment escrow',
    activeFilters: 'Active filters:',
    searchChip: 'Search: "{q}"',
    under: 'Under {price}',
    resetAll: 'Reset all',
    tipTitle: 'Tip:',
    tip: 'Swipe a card right to save it · Long-press for a quick look',
    noResultsTitle: 'No matching items found',
    noResultsBody: 'No listings match your filters. Try a different search or clear the filters.',
    resetAllFilters: 'Reset all filters',
    refreshed: 'Feed refreshed',
    itemHidden: 'Item hidden from your feed',
    bunaBlessing: 'Buna Blessing',
    handshakeDeal: 'Handshake Deal',
    gridView: 'Grid view',
    compactView: 'Compact view',
    dismiss: 'Dismiss',
  },
  card: {
    view: 'View',
    save: 'Save',
    savedToast: 'Saved to watchlist',
    removedToast: 'Removed from saved',
    removeSaved: 'Remove from saved',
    inspect: 'Quick look',
    pass: 'Pass',
    verifiedSeller: "Verified",
    verifiedListing: "Guaranteed",
    newSeller: 'New seller',
  },
  filters: {
    browseAll: 'Browse all',
    allCities: 'All Ethiopia',
    allConditions: 'All conditions',
    sortLatest: 'Newest first',
    sortPriceAsc: 'Price: low to high',
    sortPriceDesc: 'Price: high to low',
    sortPopular: 'Most popular',
    reset: 'Reset',
    subcategories: '{name} subcategories',
    showAll: 'All {name}',
  },
  conditions: {
    'Brand New': 'Brand New',
    'Like New': 'Like New',
    'Used - Excellent': 'Used - Excellent',
    'Used - Good': 'Used - Good',
    Refurbished: 'Refurbished',
    'For Parts': 'For Parts',
  },
  footer: {
    allItems: 'All items',
    plans: 'Plans & pricing',
    tagline: 'Phones, electronics, vehicles, fashion, real estate and more — traded safely across Ethiopia.',
    safety: 'Verified handoffs · Safe exchange hubs in Addis Ababa & regional cities · Telebirr & CBE protection',
    rights: 'All rights reserved.',
  },
  common: {
    close: 'Close',
  },
  wise: {
    title: "For You",
    matches: "{count} matches",
    subtitle: "Tailor the marketplace to your city, budget and interests",
    tailorForMe: "Tailor for me",
    tailored: "Tailored for you",
    myCity: "My city:",
    beans: "{count} beans",
    preferences: "Preferences",
    reset: "Reset preferences",
    budgetCap: "Budget cap:",
    anyBudget: "Any budget",
    under: "Under {price}",
    verifiedOnly: "Verified sellers only",
    interests: "Interests:",
    safeTitle: "Safe handoff:",
    safeBody: "Inspect the item in person before funds are released. Telebirr & CBE supported.",
    guarantee: "Buyer protection on every deal",
  },
  auth: {
    titleSignup: "Create your account",
    titleSignin: "Welcome back",
    subSignup: "Join verified Ethiopian buyers and sellers",
    subSignin: "Sign in to manage your ads, offers and deals",
    tabSignup: "Sign up",
    tabSignin: "Sign in",
    fullName: "Full name",
    city: "Your city",
    telegram: "Telegram username",
    telegramHint: "Get instant alerts for offers and swaps on Telegram.",
    optional: "optional",
    phone: "Phone number",
    email: "Email address",
    password: "Password",
    trustTitle: "Agoza trust & buyer protection",
    trustBody: "By creating an account you agree to trade responsibly and meet at designated safe exchange hubs.",
    processing: "Processing…",
    submitSignup: "Create account",
    submitSignin: "Sign in",
    haveAccount: "Already have an account?",
    noAccount: "Don't have an account yet?",
    createAccount: "Create a free account",
    forgot: "Forgot password?",
    errName: "Please enter your full name.",
    errEmail: "Please enter a valid email address.",
    errPassword: "Password must be at least 6 characters.",
    errPhone: "Please enter your phone number (+251…).",
    successSignup: "Account created! Check your email to verify, then sign in.",
    successSignin: "Signed in successfully!",
    errResetEmail: "Enter your email above to reset your password.",
    resetSent: "Password reset link sent to your email.",
  },
  categoryNames: {
    all: 'All Items',
    'art-collectibles': 'Decor & Crafts',
    'phones-tablets': 'Phones & Tablets',
    'electronics-laptops': 'Electronics & Tech',
    'vehicles-cars': 'Vehicles & Auto',
    'property-realestate': 'Real Estate',
    'fashion-clothes': 'Fashion & Habesha Kemis',
    'home-furniture': 'Home & Living',
    'agriculture-food': 'Agriculture & Coffee',
    'books-cultural': 'Books & Heritage',
    'jobs-services': 'Services & Trades',
  },
};

const am: DeepPartial<UiStrings> = {
  nav: {
    newFeatured: 'አዲስ እና ተመራጭ',
    phonesTech: 'ስልክ እና ቴክ',
    vehicles: 'ተሽከርካሪዎች',
    fashion: 'ፋሽን',
    homeDecor: 'ቤት እና ማስጌጫ',
    swapsBarter: 'ልውውጥ',
    home: 'መነሻ',
    categories: 'ምድቦች',
    chats: 'መልዕክቶች',
    myAds: 'ማስታወቂያዎቼ',
    admin: 'አስተዳዳሪ',
    marketplaceFeed: 'ገበያ',
    myAccount: 'የእኔ መለያ',
    postAd: 'ማስታወቂያ ይለጥፉ',
  },
  header: {
    search: 'ፈልግ',
    ethiopianCities: 'የኢትዮጵያ ከተሞች',
    selectCity: 'ከተማዎን ይምረጡ',
    alerts: 'ማሳወቂያዎች',
    chat: 'መልዕክቶች',
    settings: 'ቅንብሮች',
    preferences: 'ምርጫዎች',
    theme: 'ገጽታ',
    dark: 'ጨለማ',
    light: 'ብርሃን',
    currency: 'ገንዘብ',
    language: 'ቋንቋ',
    seoInspector: 'የSEO መመርመሪያ',
    adminModeration: 'የአስተዳዳሪ ቁጥጥር',
    signIn: 'ይግቡ',
    menu: 'ማውጫ',
  },
  hero: {
    kicker: 'የተረጋገጡ ሻጮች',
    kickerSub: 'ደህንነቱ የተጠበቀ ፊት ለፊት ልውውጥ',
    shopLatest: 'ማስታወቂያዎችን ያስሱ',
    postListing: 'በነፃ ይለጥፉ',
    statListings: 'ንቁ ማስታወቂያዎች',
    statCities: 'ከተሞች',
    statProtected: 'የገዢ ጥበቃ',
  },
  feed: {
    listingsAvailable: '{count} ማስታወቂያዎች ይገኛሉ',
    feedSubtitle: 'በተረጋገጡ የልውውጥ ማዕከላት እና በክፍያ ዋስትና የተጠበቀ',
    activeFilters: 'ንቁ ማጣሪያዎች፦',
    searchChip: 'ፍለጋ፦ "{q}"',
    under: 'ከ{price} በታች',
    resetAll: 'ሁሉንም አፅዳ',
    tipTitle: 'ጠቃሚ ምክር፦',
    tip: 'ለማስቀመጥ ካርዱን ወደ ቀኝ ያንሸራትቱ · ለፈጣን እይታ ረጅም ይጫኑ',
    noResultsTitle: 'ምንም ተዛማጅ ዕቃ አልተገኘም',
    noResultsBody: 'ከማጣሪያዎችዎ ጋር የሚዛመድ ማስታወቂያ የለም። ሌላ ቃል ይሞክሩ ወይም ማጣሪያዎችን ያፅዱ።',
    resetAllFilters: 'ሁሉንም ማጣሪያዎች አፅዳ',
    refreshed: 'ገበያው ታድሷል',
    itemHidden: 'ዕቃው ከዝርዝርዎ ተደብቋል',
    bunaBlessing: 'የቡና ምርቃት',
    handshakeDeal: 'የስምምነት እጅ መጨባበጥ',
    gridView: 'የፍርግርግ እይታ',
    compactView: 'የታመቀ እይታ',
    dismiss: 'ዝጋ',
  },
  card: {
    view: 'ይመልከቱ',
    save: 'አስቀምጥ',
    savedToast: 'ተቀምጧል',
    removedToast: 'ከተቀመጡት ተወግዷል',
    removeSaved: 'ከተቀመጡት አስወግድ',
    inspect: 'ፈጣን እይታ',
    pass: 'እለፍ',
    verifiedSeller: "የተረጋገጠ",
    verifiedListing: "ዋስትና ያለው",
    newSeller: 'አዲስ ሻጭ',
  },
  filters: {
    browseAll: 'ሁሉንም ያስሱ',
    allCities: 'መላው ኢትዮጵያ',
    allConditions: 'ሁሉም ሁኔታዎች',
    sortLatest: 'አዲሶቹ መጀመሪያ',
    sortPriceAsc: 'ዋጋ፦ ከዝቅተኛ ወደ ከፍተኛ',
    sortPriceDesc: 'ዋጋ፦ ከከፍተኛ ወደ ዝቅተኛ',
    sortPopular: 'በጣም ተወዳጅ',
    reset: 'አፅዳ',
    subcategories: 'የ{name} ንዑስ ምድቦች',
    showAll: 'ሁሉም {name}',
  },
  conditions: {
    'Brand New': 'አዲስ',
    'Like New': 'እንደ አዲስ',
    'Used - Excellent': 'ያገለገለ - በጣም ጥሩ',
    'Used - Good': 'ያገለገለ - ጥሩ',
    Refurbished: 'የታደሰ',
    'For Parts': 'ለመለዋወጫ',
  },
  footer: {
    allItems: 'ሁሉም ዕቃዎች',
    plans: 'ዕቅዶች እና ዋጋ',
    tagline: 'ስልኮች፣ ኤሌክትሮኒክስ፣ ተሽከርካሪዎች፣ ፋሽን፣ ቤቶች እና ሌሎችም — በመላው ኢትዮጵያ በደህንነት ይገበያዩ።',
    safety: 'የተረጋገጠ ርክክብ · በአዲስ አበባ እና በክልል ከተሞች የሚገኙ ደህንነታቸው የተጠበቀ የልውውጥ ማዕከላት · የቴሌብር እና የንግድ ባንክ ጥበቃ',
    rights: 'መብቱ በህግ የተጠበቀ ነው።',
  },
  common: { close: 'ዝጋ' },
  wise: {
    title: "ለእርስዎ",
    matches: "{count} ተዛማጆች",
    subtitle: "ገበያውን በከተማዎ፣ በበጀትዎ እና በፍላጎትዎ ያስተካክሉ",
    tailorForMe: "ለእኔ አስተካክል",
    tailored: "ለእርስዎ ተስተካክሏል",
    myCity: "ከተማዬ፦",
    beans: "{count} ፍሬዎች",
    preferences: "ምርጫዎች",
    reset: "ምርጫዎችን አፅዳ",
    budgetCap: "የበጀት ገደብ፦",
    anyBudget: "ማንኛውም በጀት",
    under: "ከ{price} በታች",
    verifiedOnly: "የተረጋገጡ ሻጮች ብቻ",
    interests: "ፍላጎቶች፦",
    safeTitle: "ደህንነቱ የተጠበቀ ርክክብ፦",
    safeBody: "ገንዘቡ ከመለቀቁ በፊት ዕቃውን በአካል ይመርምሩ። ቴሌብር እና የንግድ ባንክ ይደገፋሉ።",
    guarantee: "በሁሉም ግብይት የገዢ ጥበቃ",
  },
  auth: {
    titleSignup: "መለያ ይፍጠሩ",
    titleSignin: "እንኳን ደህና መጡ",
    subSignup: "ከተረጋገጡ የኢትዮጵያ ገዢዎችና ሻጮች ጋር ይቀላቀሉ",
    subSignin: "ማስታወቂያዎችዎን፣ ቅናሾችዎንና ስምምነቶችዎን ለማስተዳደር ይግቡ",
    tabSignup: "ይመዝገቡ",
    tabSignin: "ይግቡ",
    fullName: "ሙሉ ስም",
    city: "ከተማዎ",
    telegram: "የቴሌግራም ስም",
    telegramHint: "ስለ ቅናሾችና ልውውጦች ፈጣን ማሳወቂያ በቴሌግራም ያግኙ።",
    optional: "አማራጭ",
    phone: "ስልክ ቁጥር",
    email: "ኢሜይል አድራሻ",
    password: "የይለፍ ቃል",
    trustTitle: "የአጎዛ እምነት እና የገዢ ጥበቃ",
    trustBody: "መለያ በመፍጠር በኃላፊነት ለመገበያየትና በተወሰኑ ደህንነታቸው የተጠበቀ የልውውጥ ማዕከላት ለመገናኘት ተስማምተዋል።",
    processing: "በሂደት ላይ…",
    submitSignup: "መለያ ይፍጠሩ",
    submitSignin: "ይግቡ",
    haveAccount: "መለያ አለዎት?",
    noAccount: "እስካሁን መለያ የለዎትም?",
    createAccount: "በነፃ መለያ ይፍጠሩ",
    forgot: "የይለፍ ቃል ረሱ?",
    errName: "እባክዎ ሙሉ ስምዎን ያስገቡ።",
    errEmail: "እባክዎ ትክክለኛ ኢሜይል ያስገቡ።",
    errPassword: "የይለፍ ቃል ቢያንስ 6 ቁምፊዎች መሆን አለበት።",
    errPhone: "እባክዎ ስልክ ቁጥርዎን ያስገቡ (+251…)።",
    successSignup: "መለያዎ ተፈጥሯል! ኢሜይልዎን አረጋግጠው ይግቡ።",
    successSignin: "በተሳካ ሁኔታ ገብተዋል!",
    errResetEmail: "የይለፍ ቃል ለመቀየር ከላይ ኢሜይልዎን ያስገቡ።",
    resetSent: "የይለፍ ቃል መቀየሪያ ሊንክ ወደ ኢሜይልዎ ተልኳል።",
  },
  categoryNames: {
    all: 'ሁሉም ዕቃዎች',
    'art-collectibles': 'ማስጌጫ እና እደ-ጥበብ',
    'phones-tablets': 'ስልኮች እና ታብሌቶች',
    'electronics-laptops': 'ላፕቶፕ እና ኤሌክትሮኒክስ',
    'vehicles-cars': 'ተሽከርካሪዎች',
    'property-realestate': 'ሪል እስቴት እና ቤቶች',
    'fashion-clothes': 'ፋሽን እና የሀበሻ ልብስ',
    'home-furniture': 'የቤት እቃዎች',
    'agriculture-food': 'ግብርና እና ቡና',
    'books-cultural': 'መጻሕፍት እና ቅርስ',
    'jobs-services': 'አገልግሎቶች',
  },
};

const ti: DeepPartial<UiStrings> = {
  nav: {
    newFeatured: 'ሓድሽን ፍሉይን',
    phonesTech: 'ተሌፎንን ቴክኖሎጂን',
    vehicles: 'ተሽከርከርቲ',
    fashion: 'ፋሽን',
    homeDecor: 'ገዛን መስለጢን',
    swapsBarter: 'ምልውዋጥ',
    home: 'መበገሲ',
    categories: 'ምድባት',
    chats: 'መልእኽትታት',
    myAds: 'መወዓውዒታተይ',
    admin: 'ኣመሓዳሪ',
    marketplaceFeed: 'ዕዳጋ',
    myAccount: 'ሕሳበይ',
    postAd: 'መወዓውዒ ለጥፍ',
  },
  header: {
    search: 'ድለ',
    ethiopianCities: 'ከተማታት ኢትዮጵያ',
    selectCity: 'ከተማኻ ምረጽ',
    alerts: 'መዘኻኸሪታት',
    chat: 'መልእኽትታት',
    settings: 'ቅጥዒታት',
    preferences: 'ምርጫታት',
    theme: 'ገጽታ',
    dark: 'ጸልማት',
    light: 'ብርሃን',
    currency: 'ባጤራ',
    language: 'ቋንቋ',
    seoInspector: 'መመርመሪ SEO',
    adminModeration: 'ቁጽጽር ኣመሓዳሪ',
    signIn: 'እቶ',
    menu: 'ዝርዝር',
  },
  hero: {
    kicker: 'ዝተረጋገጹ ሸየጥቲ',
    kickerSub: 'ውሑስ ገጽ-ንገጽ ምልውዋጥ',
    shopLatest: 'መወዓውዒታት ርአ',
    postListing: 'ብነጻ ለጥፍ',
    statListings: 'ንጡፋት መወዓውዒታት',
    statCities: 'ከተማታት',
    statProtected: 'ሓለዋ ዓዳጊ',
  },
  feed: {
    listingsAvailable: '{count} መወዓውዒታት ይርከቡ',
    feedSubtitle: 'ብዝተረጋገጹ ማእከላት ምልውዋጥን ውሕስነት ክፍሊትን ዝተሓለወ',
    activeFilters: 'ንጡፋት መጻረዪታት፦',
    searchChip: 'ድለያ፦ "{q}"',
    under: 'ትሕቲ {price}',
    resetAll: 'ኩሉ ኣጽሪ',
    tipTitle: 'ምኽሪ፦',
    tip: 'ንምዕቃብ ካርድ ናብ የማን ኣንሸራትት · ንቕልጡፍ ምርኣይ ነዊሕ ጠውቕ',
    noResultsTitle: 'ዝሰማማዕ ኣቕሓ ኣይተረኽበን',
    noResultsBody: 'ምስ መጻረዪታትካ ዝሰማማዕ መወዓውዒ የለን። ካልእ ቃል ፈትን ወይ መጻረዪታት ኣጽሪ።',
    resetAllFilters: 'ኩሉ መጻረዪታት ኣጽሪ',
    refreshed: 'ዕዳጋ ተሓዲሱ',
    itemHidden: 'እቲ ኣቕሓ ካብ ዝርዝርካ ተሓቢኡ',
    bunaBlessing: 'ምርቓ ቡን',
    handshakeDeal: 'ስምምዕ ብኢድ',
    gridView: 'ርሻታዊ ምርኣይ',
    compactView: 'ጽቡብ ምርኣይ',
    dismiss: 'ዕጸው',
  },
  card: {
    view: 'ርአ',
    save: 'ዓቕብ',
    savedToast: 'ተዓቂቡ',
    removedToast: 'ካብ ዝተዓቀቡ ተኣልዩ',
    removeSaved: 'ካብ ዝተዓቀቡ ኣልግስ',
    inspect: 'ቅልጡፍ ምርኣይ',
    pass: 'ሕለፍ',
    verifiedSeller: "ዝተረጋገጸ",
    verifiedListing: "ውሕስነት ዘለዎ",
    newSeller: 'ሓድሽ ሸያጢ',
  },
  filters: {
    browseAll: 'ኩሉ ርአ',
    allCities: 'ኩላ ኢትዮጵያ',
    allConditions: 'ኩሉ ኩነታት',
    sortLatest: 'ሓደስቲ ቅድሚት',
    sortPriceAsc: 'ዋጋ፦ ካብ ትሑት ናብ ልዑል',
    sortPriceDesc: 'ዋጋ፦ ካብ ልዑል ናብ ትሑት',
    sortPopular: 'ዝያዳ ዝተፈተዉ',
    reset: 'ኣጽሪ',
    subcategories: 'ንኡሳን ምድባት {name}',
    showAll: 'ኩሉ {name}',
  },
  conditions: {
    'Brand New': 'ሓድሽ',
    'Like New': 'ከም ሓድሽ',
    'Used - Excellent': 'ዝተጠቕመሉ - ብጣዕሚ ጽቡቕ',
    'Used - Good': 'ዝተጠቕመሉ - ጽቡቕ',
    Refurbished: 'ዝተሓደሰ',
    'For Parts': 'ንመለዋወጢ',
  },
  footer: {
    allItems: 'ኩሉ ኣቑሑ',
    plans: 'መደባትን ዋጋን',
    tagline: 'ተሌፎናት፣ ኤሌክትሮኒክስ፣ ተሽከርከርቲ፣ ፋሽን፣ ገዛውቲን ካልእን — ኣብ መላእ ኢትዮጵያ ብውሕስነት ተዓደጉ።',
    safety: 'ዝተረጋገጸ ምርካብ · ኣብ ኣዲስ ኣበባን ከተማታት ክልላትን ዝርከቡ ውሑሳት ማእከላት ምልውዋጥ · ሓለዋ ቴሌብርን ንግዲ ባንክን',
    rights: 'ኩሉ መሰላት ዝተሓለወ እዩ።',
  },
  common: { close: 'ዕጸው' },
  wise: {
    title: "ንዓኻ",
    matches: "{count} ዝሰማምዑ",
    subtitle: "ዕዳጋ ብመሰረት ከተማኻ፣ በጀትካን ድሌትካን ኣመዓራርዮ",
    tailorForMe: "ንዓይ ኣመዓራርዮ",
    tailored: "ንዓኻ ተመዓራርዩ",
    myCity: "ከተማይ፦",
    beans: "{count} ፍረታት",
    preferences: "ምርጫታት",
    reset: "ምርጫታት ኣጽሪ",
    budgetCap: "ደረት በጀት፦",
    anyBudget: "ዝኾነ በጀት",
    under: "ትሕቲ {price}",
    verifiedOnly: "ዝተረጋገጹ ሸየጥቲ ጥራሕ",
    interests: "ድሌታት፦",
    safeTitle: "ውሑስ ምርካብ፦",
    safeBody: "ገንዘብ ቅድሚ ምልቃቑ ነቲ ኣቕሓ ብኣካል መርምሮ። ቴሌብርን ንግዲ ባንክን ይድገፉ።",
    guarantee: "ኣብ ኩሉ ዕዳጋ ሓለዋ ዓዳጊ",
  },
  auth: {
    titleSignup: "ሕሳብ ፍጠር",
    titleSignin: "እንቋዕ ብደሓን መጻእካ",
    subSignup: "ምስ ዝተረጋገጹ ዓደግትን ሸየጥትን ኢትዮጵያ ተጸንበር",
    subSignin: "መወዓውዒታትካ፣ ዋጋታትካን ስምምዓትካን ንምምሕዳር እቶ",
    tabSignup: "ተመዝገብ",
    tabSignin: "እቶ",
    fullName: "ምሉእ ስም",
    city: "ከተማኻ",
    telegram: "ስም ቴሌግራም",
    telegramHint: "ብዛዕባ ዋጋታትን ምልውዋጥን ቅልጡፍ መዘኻኸሪ ብቴሌግራም ርከብ።",
    optional: "ኣማራጺ",
    phone: "ቁጽሪ ተሌፎን",
    email: "ኢመይል",
    password: "መሕለፊ ቃል",
    trustTitle: "እምነት ኣጎዛን ሓለዋ ዓዳጊን",
    trustBody: "ሕሳብ ብምፍጣርካ ብሓላፍነት ክትዕደግን ኣብ ዝተወሰኑ ውሑሳት ማእከላት ክትራኸብን ተሰማሚዕካ ኣለኻ።",
    processing: "ኣብ መስርሕ…",
    submitSignup: "ሕሳብ ፍጠር",
    submitSignin: "እቶ",
    haveAccount: "ሕሳብ ኣለካ ድዩ?",
    noAccount: "ገና ሕሳብ የብልካን?",
    createAccount: "ብነጻ ሕሳብ ፍጠር",
    forgot: "መሕለፊ ቃል ረሲዕካ?",
    errName: "በጃኻ ምሉእ ስምካ ኣእቱ።",
    errEmail: "በጃኻ ቅኑዕ ኢመይል ኣእቱ።",
    errPassword: "መሕለፊ ቃል እንተወሓደ 6 ፊደላት ክኸውን ኣለዎ።",
    errPhone: "በጃኻ ቁጽሪ ተሌፎንካ ኣእቱ (+251…)።",
    successSignup: "ሕሳብ ተፈጢሩ! ኢመይልካ ኣረጋግጽ፣ ድሕሪኡ እቶ።",
    successSignin: "ብዓወት ኣቲኻ!",
    errResetEmail: "መሕለፊ ቃል ንምቕያር ኣብ ላዕሊ ኢመይልካ ኣእቱ።",
    resetSent: "መቐየሪ መሕለፊ ቃል ናብ ኢመይልካ ተላኢኹ።",
  },
  categoryNames: {
    all: 'ኩሉ ኣቑሑ',
    'art-collectibles': 'መስለጢን ኢደ-ጥበብን',
    'phones-tablets': 'ተሌፎናትን ታብለትን',
    'electronics-laptops': 'ኤሌክትሮኒክስን ላፕቶፕን',
    'vehicles-cars': 'ተሽከርከርቲ',
    'property-realestate': 'ገዛውትን ንብረትን',
    'fashion-clothes': 'ፋሽንን ክዳን ሃበሻን',
    'home-furniture': 'ኣቑሑ ገዛ',
    'agriculture-food': 'ሕርሻን ቡንን',
    'books-cultural': 'መጻሕፍትን ውርስን',
    'jobs-services': 'ኣገልግሎታት',
  },
};

const om: DeepPartial<UiStrings> = {
  nav: {
    newFeatured: 'Haaraa fi Filatamoo',
    phonesTech: 'Bilbila fi Teeknoo',
    vehicles: 'Konkolaataa',
    fashion: 'Faashinii',
    homeDecor: 'Mana fi Miidhagina',
    swapsBarter: 'Jijjiirraa',
    home: 'Jalqaba',
    categories: 'Ramaddii',
    chats: 'Ergaawwan',
    myAds: 'Beeksisa Koo',
    admin: 'Bulchaa',
    marketplaceFeed: 'Gabaa',
    myAccount: 'Herrega Koo',
    postAd: 'Beeksisa maxxansi',
  },
  header: {
    search: 'Barbaadi',
    ethiopianCities: 'Magaalota Itoophiyaa',
    selectCity: 'Magaalaa kee filadhu',
    alerts: 'Beeksisawwan',
    chat: 'Ergaawwan',
    settings: "Qindaa'ina",
    preferences: 'Filannoowwan',
    theme: 'Bifa',
    dark: 'Dukkana',
    light: 'Ifa',
    currency: 'Maallaqa',
    language: 'Afaan',
    seoInspector: 'Qorataa SEO',
    adminModeration: "To'annoo Bulchaa",
    signIn: 'Seeni',
    menu: 'Baafata',
  },
  hero: {
    kicker: "Gurgurtoota mirkanaa'an",
    kickerSub: 'Jijjiirraa fuula-fuulatti nageenya qabu',
    shopLatest: 'Beeksisota ilaali',
    postListing: 'Bilisaan maxxansi',
    statListings: 'Beeksisota hojii irra jiran',
    statCities: 'Magaalota',
    statProtected: 'Eegumsa bitaa',
  },
  feed: {
    listingsAvailable: 'Beeksisota {count} ni argamu',
    feedSubtitle: "Wiirtuuwwan jijjiirraa mirkanaa'aniin fi wabii kaffaltiitiin kan eegame",
    activeFilters: 'Calaltuuwwan hojii irra jiran:',
    searchChip: 'Barbaacha: "{q}"',
    under: '{price} gadi',
    resetAll: 'Hunda haqi',
    tipTitle: 'Gorsa:',
    tip: "Olkaa'uuf kaardii gara mirgaatti harkisi · Ilaalcha ariifataaf yeroo dheeraa tuqi",
    noResultsTitle: 'Meeshaan walsimu hin argamne',
    noResultsBody: 'Beeksisni calaltuu kee waliin walsimu hin jiru. Jecha biraa yaali ykn calaltuuwwan haqi.',
    resetAllFilters: 'Calaltuuwwan hunda haqi',
    refreshed: 'Gabaan haaromfameera',
    itemHidden: 'Meeshaan sun tarree kee irraa dhokfameera',
    bunaBlessing: 'Eebba Buna',
    handshakeDeal: 'Waliigaltee Harkaa',
    gridView: "Mul'ata giriidii",
    compactView: "Mul'ata gabaabaa",
    dismiss: 'Cufi',
  },
  card: {
    view: 'Ilaali',
    save: "Olkaa'i",
    savedToast: "Olkaa'ameera",
    removedToast: "Kan olkaa'aman irraa haqameera",
    removeSaved: "Kan olkaa'aman irraa haqi",
    inspect: 'Ilaalcha ariifataa',
    pass: 'Darbi',
    verifiedSeller: "Mirkanaa'e",
    verifiedListing: "Wabii qabu",
    newSeller: 'Gurgurtaa haaraa',
  },
  filters: {
    browseAll: 'Hunda ilaali',
    allCities: 'Itoophiyaa Guutuu',
    allConditions: 'Haala hunda',
    sortLatest: 'Haaraa dura',
    sortPriceAsc: 'Gatii: gadii gara olii',
    sortPriceDesc: 'Gatii: olii gara gadii',
    sortPopular: "Kan baay'ee jaallatame",
    reset: 'Haqi',
    subcategories: 'Ramaddii xixiqqoo {name}',
    showAll: '{name} hunda',
  },
  conditions: {
    'Brand New': 'Haaraa',
    'Like New': 'Akka haaraa',
    'Used - Excellent': "Kan tajaajile - baay'ee gaarii",
    'Used - Good': 'Kan tajaajile - gaarii',
    Refurbished: 'Kan haaromfame',
    'For Parts': 'Meeshaa jijjiirraaf qofa',
  },
  footer: {
    allItems: 'Meeshaalee hunda',
    plans: 'Karoora fi gatii',
    tagline: 'Bilbila, elektirooniksii, konkolaataa, faashinii, manneen fi kan biroo — Itoophiyaa guutuu keessatti nageenyaan daldalaa.',
    safety: "Walitti kennuu mirkanaa'e · Wiirtuuwwan jijjiirraa nageenya qaban Finfinnee fi magaalota naannoo keessatti · Eegumsa Telebirr fi CBE",
    rights: 'Mirgi hundi seeraan eegamaadha.',
  },
  common: { close: 'Cufi' },
  wise: {
    title: "Siif",
    matches: "Kan walsiman {count}",
    subtitle: "Gabaa magaalaa, baajata fi fedhii keetiin qindeessi",
    tailorForMe: "Anaaf qindeessi",
    tailored: "Siif qindaa'eera",
    myCity: "Magaalaa koo:",
    beans: "Firii {count}",
    preferences: "Filannoowwan",
    reset: "Filannoowwan haqi",
    budgetCap: "Daangaa baajataa:",
    anyBudget: "Baajata kamiyyuu",
    under: "{price} gadi",
    verifiedOnly: "Gurgurtoota mirkanaa'an qofa",
    interests: "Fedhii:",
    safeTitle: "Walitti kennuu nageenya qabu:",
    safeBody: "Maallaqni osoo hin gadhiifamin dura meeshaa qaamaan ilaali. Telebirr fi CBE ni deeggaramu.",
    guarantee: "Daldala hunda irratti eegumsa bitaa",
  },
  auth: {
    titleSignup: "Herrega uumi",
    titleSignin: "Baga nagaan deebitan",
    subSignup: "Bitootaa fi gurgurtoota Itoophiyaa mirkanaa'an waliin makamaa",
    subSignin: "Beeksisa, gatii fi waliigaltee kee bulchuuf seeni",
    tabSignup: "Galmaa'i",
    tabSignin: "Seeni",
    fullName: "Maqaa guutuu",
    city: "Magaalaa kee",
    telegram: "Maqaa Telegram",
    telegramHint: "Gatii fi jijjiirraa irratti beeksisa ariifataa Telegram irratti argadhu.",
    optional: "dirqama miti",
    phone: "Lakkoofsa bilbilaa",
    email: "Teessoo imeelii",
    password: "Jecha icciitii",
    trustTitle: "Amanamummaa Agoza fi eegumsa bitaa",
    trustBody: "Herrega uumuudhaan itti gaafatamummaan daldaluu fi wiirtuuwwan jijjiirraa nageenya qaban irratti wal arguuf walii galteetta.",
    processing: "Hojjechaa jira…",
    submitSignup: "Herrega uumi",
    submitSignin: "Seeni",
    haveAccount: "Herrega qabdaa?",
    noAccount: "Ammallee herrega hin qabduu?",
    createAccount: "Bilisaan herrega uumi",
    forgot: "Jecha icciitii irraanfattee?",
    errName: "Maaloo maqaa kee guutuu galchi.",
    errEmail: "Maaloo imeelii sirrii galchi.",
    errPassword: "Jechi icciitii yoo xiqqaate qubee 6 qabaachuu qaba.",
    errPhone: "Maaloo lakkoofsa bilbilaa kee galchi (+251…).",
    successSignup: "Herregni uumameera! Imeelii kee mirkaneessiitii seeni.",
    successSignin: "Milkaa'inaan seenteetta!",
    errResetEmail: "Jecha icciitii jijjiiruuf imeelii kee olitti galchi.",
    resetSent: "Liinkiin jecha icciitii jijjiiru imeelii keetti ergameera.",
  },
  categoryNames: {
    all: 'Meeshaalee Hunda',
    'art-collectibles': 'Miidhagina fi Ogummaa Harkaa',
    'phones-tablets': 'Bilbila fi Taabileetii',
    'electronics-laptops': 'Elektirooniksii fi Laaptooppii',
    'vehicles-cars': 'Konkolaataa',
    'property-realestate': 'Manneen fi Qabeenya',
    'fashion-clothes': 'Faashinii fi Uffata Aadaa',
    'home-furniture': 'Meeshaalee Manaa',
    'agriculture-food': 'Qonna fi Buna',
    'books-cultural': 'Kitaabota fi Hambaa',
    'jobs-services': 'Tajaajila',
  },
};

const so: DeepPartial<UiStrings> = {
  nav: {
    newFeatured: 'Cusub & La Doortay',
    phonesTech: 'Taleefan & Teknoolaji',
    vehicles: 'Gaadiid',
    fashion: 'Moodo',
    homeDecor: 'Guri & Qurxin',
    swapsBarter: 'Isdhaafsi',
    home: 'Bogga Hore',
    categories: 'Qaybaha',
    chats: 'Fariimaha',
    myAds: 'Xayeysiisyadayda',
    admin: 'Maamul',
    marketplaceFeed: 'Suuqa',
    myAccount: 'Akoonkayga',
    postAd: 'Dhig xayeysiis',
  },
  header: {
    search: 'Raadi',
    ethiopianCities: 'Magaalooyinka Itoobiya',
    selectCity: 'Dooro magaaladaada',
    alerts: 'Ogeysiisyada',
    chat: 'Fariimaha',
    settings: 'Dejinta',
    preferences: 'Doorashooyinka',
    theme: 'Muuqaal',
    dark: 'Mugdi',
    light: 'Iftiin',
    currency: 'Lacagta',
    language: 'Luqadda',
    seoInspector: 'Kormeeraha SEO',
    adminModeration: 'Kormeerka Maamulka',
    signIn: 'Gal',
    menu: 'Liiska',
  },
  hero: {
    kicker: 'Iibiyeyaal la xaqiijiyey',
    kickerSub: 'Is-weydaarsi ammaan ah oo fool-ka-fool ah',
    shopLatest: 'Daawo xayeysiisyada',
    postListing: 'Dhig bilaash',
    statListings: 'Xayeysiisyo firfircoon',
    statCities: 'Magaalooyin',
    statProtected: 'Ilaalinta iibsadaha',
  },
  feed: {
    listingsAvailable: '{count} xayeysiis ayaa diyaar ah',
    feedSubtitle: 'Waxaa ilaaliya xarumo is-weydaarsi oo la xaqiijiyey iyo damaanad lacag bixin',
    activeFilters: 'Shaandheyaasha firfircoon:',
    searchChip: 'Raadin: "{q}"',
    under: 'Ka hooseeya {price}',
    resetAll: 'Tirtir dhammaan',
    tipTitle: 'Talo:',
    tip: 'Kaadhka u jiid dhanka midig si aad u keydiso · Riix muddo dheer si aad u eegto',
    noResultsTitle: 'Alaab ku habboon lama helin',
    noResultsBody: 'Ma jiro xayeysiis ku habboon shaandheyaashaada. Isku day eray kale ama tirtir shaandheyaasha.',
    resetAllFilters: 'Tirtir dhammaan shaandheyaasha',
    refreshed: 'Suuqa waa la cusbooneysiiyey',
    itemHidden: 'Alaabtaas waa laga qariyey liiskaaga',
    bunaBlessing: 'Ducada Bunka',
    handshakeDeal: 'Heshiiska Gacan-qaadka',
    gridView: 'Muuqaal shabakad',
    compactView: 'Muuqaal kooban',
    dismiss: 'Xir',
  },
  card: {
    view: 'Eeg',
    save: 'Keydi',
    savedToast: 'Waa la keydiyey',
    removedToast: 'Waa laga saaray kuwa la keydiyey',
    removeSaved: 'Ka saar kuwa la keydiyey',
    inspect: 'Eegid degdeg ah',
    pass: 'Dhaaf',
    verifiedSeller: "La xaqiijiyey",
    verifiedListing: "Damaanad leh",
    newSeller: 'Iibiye cusub',
  },
  filters: {
    browseAll: 'Daawo dhammaan',
    allCities: 'Itoobiya Oo Dhan',
    allConditions: 'Xaalad kasta',
    sortLatest: 'Kuwa ugu cusub',
    sortPriceAsc: 'Qiimaha: hoos ilaa sare',
    sortPriceDesc: 'Qiimaha: sare ilaa hoos',
    sortPopular: 'Kuwa ugu caansan',
    reset: 'Tirtir',
    subcategories: 'Qaybaha hoose ee {name}',
    showAll: 'Dhammaan {name}',
  },
  conditions: {
    'Brand New': 'Cusub',
    'Like New': 'Sida cusub',
    'Used - Excellent': 'La isticmaalay - aad u fiican',
    'Used - Good': 'La isticmaalay - fiican',
    Refurbished: 'Dib loo hagaajiyey',
    'For Parts': 'Qaybo ahaan kaliya',
  },
  footer: {
    allItems: 'Dhammaan alaabta',
    plans: 'Qorshayaasha & qiimaha',
    tagline: 'Taleefanno, elektaroonig, gaadiid, moodo, guryo iyo wax kale — si ammaan ah ugu ganacsada Itoobiya oo dhan.',
    safety: 'Gacan-gelin la xaqiijiyey · Xarumo is-weydaarsi oo ammaan ah oo ku yaal Addis Ababa iyo magaalooyinka gobollada · Ilaalinta Telebirr & CBE',
    rights: 'Xuquuqda oo dhan way dhowran tahay.',
  },
  common: { close: 'Xir' },
  wise: {
    title: "Adiga",
    matches: "{count} ku habboon",
    subtitle: "U habee suuqa magaaladaada, miisaaniyaddaada iyo xiisahaaga",
    tailorForMe: "Ii habee",
    tailored: "Adiga laguu habeeyey",
    myCity: "Magaaladayda:",
    beans: "{count} miro",
    preferences: "Doorashooyinka",
    reset: "Tirtir doorashooyinka",
    budgetCap: "Xadka miisaaniyadda:",
    anyBudget: "Miisaaniyad kasta",
    under: "Ka hooseeya {price}",
    verifiedOnly: "Iibiyeyaal la xaqiijiyey kaliya",
    interests: "Xiisaha:",
    safeTitle: "Gacan-gelin ammaan ah:",
    safeBody: "Alaabta si toos ah u baar ka hor inta aan lacagta la sii dayn. Telebirr & CBE waa la taageeraa.",
    guarantee: "Ilaalinta iibsadaha heshiis kasta",
  },
  auth: {
    titleSignup: "Samee akoon",
    titleSignin: "Ku soo dhowow",
    subSignup: "Ku biir iibsadayaasha iyo iibiyeyaasha Itoobiya ee la xaqiijiyey",
    subSignin: "Gal si aad u maamusho xayeysiisyadaada, dalabyada iyo heshiisyada",
    tabSignup: "Is diiwaangeli",
    tabSignin: "Gal",
    fullName: "Magaca oo buuxa",
    city: "Magaaladaada",
    telegram: "Magaca Telegram",
    telegramHint: "Hel ogeysiisyo degdeg ah oo ku saabsan dalabyada iyo isdhaafsiga Telegram.",
    optional: "ikhtiyaari",
    phone: "Lambarka taleefanka",
    email: "Cinwaanka iimaylka",
    password: "Furaha sirta",
    trustTitle: "Kalsoonida Agoza & ilaalinta iibsadaha",
    trustBody: "Markaad akoon samaysato waxaad oggolaatay inaad si mas'uuliyad leh u ganacsato oo aad ku kulanto xarumaha is-weydaarsiga ammaanka ah.",
    processing: "Waa la socodsiinayaa…",
    submitSignup: "Samee akoon",
    submitSignin: "Gal",
    haveAccount: "Akoon ma leedahay?",
    noAccount: "Weli akoon ma lihid?",
    createAccount: "Samee akoon bilaash ah",
    forgot: "Ma ilowday furaha sirta?",
    errName: "Fadlan geli magacaaga oo buuxa.",
    errEmail: "Fadlan geli iimayl sax ah.",
    errPassword: "Furaha sirtu waa inuu ahaadaa ugu yaraan 6 xaraf.",
    errPhone: "Fadlan geli lambarkaaga taleefanka (+251…).",
    successSignup: "Akoonka waa la sameeyey! Xaqiiji iimaylkaaga, kadibna gal.",
    successSignin: "Si guul leh ayaad u gashay!",
    errResetEmail: "Geli iimaylkaaga kor si aad u bedesho furaha sirta.",
    resetSent: "Xiriirka bedelka furaha sirta waxaa loo diray iimaylkaaga.",
  },
  categoryNames: {
    all: 'Dhammaan Alaabta',
    'art-collectibles': 'Qurxin & Farshaxan',
    'phones-tablets': 'Taleefanno & Tablet',
    'electronics-laptops': 'Elektaroonig & Laptop',
    'vehicles-cars': 'Gaadiid',
    'property-realestate': 'Guryo & Hanti',
    'fashion-clothes': 'Moodo & Dhar Dhaqameed',
    'home-furniture': 'Alaabta Guriga',
    'agriculture-food': 'Beeraha & Bunka',
    'books-cultural': 'Buugaag & Dhaxal',
    'jobs-services': 'Adeegyo',
  },
};

export const UI_STRINGS: { en: UiStrings } & Record<Exclude<Language, 'en'>, DeepPartial<UiStrings>> = {
  en,
  am,
  ti,
  om,
  so,
};

/** Deep-merges `override` onto `base`, ignoring missing/empty values. */
export function deepMerge<T>(base: T, override?: DeepPartial<T>): T {
  if (!override) return base;
  const out: any = Array.isArray(base) ? [...(base as any)] : { ...(base as any) };
  for (const key of Object.keys(override) as (keyof T)[]) {
    const val = (override as any)[key];
    if (val === undefined || val === null || val === '') continue;
    const baseVal = (base as any)[key];
    out[key] =
      typeof val === 'object' && !Array.isArray(val) && baseVal && typeof baseVal === 'object'
        ? deepMerge(baseVal, val)
        : val;
  }
  return out;
}

/** Fills `{name}` placeholders: fmt('Under {price}', { price: '5,000 Br' }). */
export function fmt(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, k) => (k in vars ? String(vars[k]) : `{${k}}`));
}
