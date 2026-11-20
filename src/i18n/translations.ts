import { Language } from '../types';
import { UI_STRINGS, deepMerge, type UiStrings, type DeepPartial } from './ui';

export { fmt } from './ui';

export interface BaseTranslations {
  appName: string;
  appTagline: string;
  navTreasures: string;
  navVault: string;
  navActivity: string;
  navUserDashboard: string;
  navAdminDashboard: string;
  listCollectible: string;
  heroHeadline: string;
  heroSubtitle: string;
  searchPlaceholder: string;
  allRegions: string;
  escrowProtectedBadge: string;
  openToSwaps: string;
  filterSwapsOnly: string;
  listingPrice: string;
  makeOffer: string;
  viewAndBuy: string;
  conditionGrade: string;
  buyWithEscrow: string;
  proposeSwap: string;
  directChat: string;
  showContact: string;
  inspectionCode: string;
  myVaultTitle: string;
  escrowOrders: string;
  bargainsAndSwaps: string;
  savedWatchlist: string;
  myListings: string;
  liveActivityFeed: string;
  alertCenter: string;
  smsNotifications: string;
  emailNotifications: string;
  duplicateWarning: string;
  duplicateImageAllowedNote: string;
  prohibitedItemWarning: string;
  rarityFilter: string;
  historicalEra: string;
  physicalCondition: string;
  advancedFilters: string;
  instantSearch: string;
  resetFilters: string;
  rarityLevels: {
    all: string;
    common: string;
    uncommon: string;
    rare: string;
    ultraRare: string;
    unique: string;
  };
  eraPeriods: {
    all: string;
    ancient: string;
    imperial: string;
    vintage: string;
    millennium: string;
    modern: string;
  };
  categories: {
    all: string;
    art?: string;
    phones: string;
    electronics: string;
    vehicles: string;
    property: string;
    fashion: string;
    home: string;
    agriculture: string;
    books?: string;
    jobs: string;
  };
}

export type Translations = BaseTranslations & UiStrings;

const BASE: { en: BaseTranslations } & Record<Exclude<Language, 'en'>, DeepPartial<BaseTranslations>> = {
  en: {
    appName: 'Agoza',
    appTagline: 'Ethiopia\'s Trusted Peer-to-Peer Marketplace',
    navTreasures: 'Explore Marketplace',
    navVault: 'My Vault',
    navActivity: 'Live Activity',
    navUserDashboard: 'My Dashboard',
    navAdminDashboard: 'Admin Panel',
    listCollectible: '+ Post Ad Free',
    heroHeadline: 'Buy, Sell & Swap Anything Across Ethiopia',
    heroSubtitle: 'Ethiopia\'s premier verified marketplace for smartphones, vehicles, electronics, apartments, fashion, and home goods. Transact safely with buyer protection and safe meetup lounges.',
    searchPlaceholder: 'What are you looking for? (e.g. iPhone 15, Toyota RAV4, 2-Bed Bole Apartment)...',
    allRegions: 'All Ethiopia',
    escrowProtectedBadge: '100% Verified Protected',
    openToSwaps: 'Open to Swap',
    filterSwapsOnly: 'Swaps & Barter Only',
    listingPrice: 'Price',
    makeOffer: 'Make Offer',
    viewAndBuy: 'View & Contact',
    conditionGrade: 'Condition',
    buyWithEscrow: 'Buy with Buyer Safeguard',
    proposeSwap: 'Propose Item Swap',
    directChat: 'Direct Chat',
    showContact: 'Show Phone Number',
    inspectionCode: 'Private Inspection Code',
    myVaultTitle: 'Seller & Buyer Dashboard',
    escrowOrders: 'Verified Deals',
    bargainsAndSwaps: 'Offers & Swaps',
    savedWatchlist: 'Saved Items',
    myListings: 'My Active Ads',
    liveActivityFeed: 'Community Activity Feed',
    alertCenter: 'SMS & Email Alerts',
    smsNotifications: 'SMS Notifications',
    emailNotifications: 'Email Notifications',
    duplicateWarning: 'Duplicate Ad Blocked: You cannot post the exact same ad with an identical photo.',
    duplicateImageAllowedNote: 'Requirement: You cannot re-list the exact same item with identical photo. Please provide a new photo of your item to proceed.',
    prohibitedItemWarning: 'Safety Policy Violation: Drugs, narcotics, weapons, and harmful items are strictly prohibited on Agoza.',
    rarityFilter: 'Rarity',
    historicalEra: 'Model Year',
    physicalCondition: 'Physical Condition',
    advancedFilters: 'Advanced Filters',
    instantSearch: 'Instant Search',
    resetFilters: 'Reset All',
    rarityLevels: {
      all: 'All Availability',
      common: 'Standard',
      uncommon: 'Selected',
      rare: 'High Demand',
      ultraRare: 'Premium',
      unique: 'Custom / Bespoke',
    },
    eraPeriods: {
      all: 'All Years / Models',
      ancient: 'Pre-2015',
      imperial: '2015-2019',
      vintage: '2020-2021',
      millennium: '2022-2023',
      modern: '2024-2025 (Latest)',
    },
    categories: {
      all: 'All Categories',
      phones: 'Phones & Tablets',
      electronics: 'Electronics & Laptops',
      vehicles: 'Cars & Vehicles',
      property: 'Property & Real Estate',
      fashion: 'Fashion & Clothes',
      home: 'Home & Furniture',
      agriculture: 'Agri & Food',
      jobs: 'Jobs & Services',
    },
  },
  am: {
    appName: 'አጎዛ (Agoza)',
    appTagline: 'የኢትዮጵያ የታመነ የዕቃዎች መገበያያ',
    navTreasures: 'ገበያውን ያስሱ',
    navVault: 'የእኔ ካዝና',
    navActivity: 'የቀጥታ እንቅስቃሴ',
    navUserDashboard: 'የተጠቃሚ ዳሽቦርድ',
    navAdminDashboard: 'አስተዳዳሪ (Admin)',
    listCollectible: '+ በነፃ ይለጥፉ',
    heroHeadline: 'በመላው ኢትዮጵያ ማንኛውንም እቃ ይግዙ፣ ይሽጡ፣ ይለዋወጡ',
    heroSubtitle: 'ሞባይል ስልኮች፣ መኪኖች፣ ላፕቶፖች፣ የቤት እቃዎች፣ አልባሳት እና አፓርታማዎችን በደህነነት እና በተረጋገጠ የግብይት ዋስትና የሚገበያዩበት መድረክ።',
    searchPlaceholder: 'ምን መግዛት ይፈልጋሉ? (ለምሳሌ፦ አይፎን 15፣ ቶዮታ ራቭ4፣ ቦሌ አፓርታማ)...',
    allRegions: 'መላው ኢትዮጵያ',
    escrowProtectedBadge: '100% የተረጋገጠ ጥበቃ',
    openToSwaps: 'ለልውውጥ ክፍት',
    filterSwapsOnly: 'ልውውጦችን ብቻ አሳይ',
    listingPrice: 'ዋጋ',
    makeOffer: 'ዋጋ ይደራደሩ',
    viewAndBuy: 'ይመልከቱና ያግኙ',
    conditionGrade: 'ደረጃ',
    buyWithEscrow: 'በዋስትና ጥበቃ ይግዙ',
    proposeSwap: 'የዕቃ በዕቃ ልውውጥ ያቅርቡ',
    directChat: 'በቀጥታ ይወያዩ',
    showContact: 'ስልክ ቁጥር አሳይ',
    inspectionCode: 'የምስጢር ፍተሻ ኮድ',
    myVaultTitle: 'የእኔ ማስታወቂያዎች እና ካዝና',
    escrowOrders: 'የተረጋገጡ ትዕዛዞች',
    bargainsAndSwaps: 'ድርድሮች እና ልውውጦች',
    savedWatchlist: 'የተቀመጡ እቃዎች',
    myListings: 'የእኔ ንቁ ማስታወቂያዎች',
    liveActivityFeed: 'የቀጥታ እንቅስቃሴ',
    alertCenter: 'የኤስኤምኤስ እና ኢሜይል ማሳወቂያዎች',
    smsNotifications: 'የኤስኤምኤስ (SMS) ማሳወቂያ',
    emailNotifications: 'የኢሜይል ማሳወቂያ',
    duplicateWarning: 'ተመሳሳይ ማስታወቂያ ተከልክሏል፡ ተመሳሳይ እቃ በአንድ ዓይነት ፎቶ መለጠፍ አይቻልም።',
    duplicateImageAllowedNote: 'ማሳሰቢያ፡ የተለየ አዲስ ፎቶ በማስገባት ማስታወቂያዎን መለጠፍ ይችላሉ።',
    prohibitedItemWarning: 'የህግ ጥሰት ተገኝቷል፡ አደንዛዥ እጾች፣ የጦር መሳሪያዎች እና አደገኛ እቃዎች በአጎዛ ላይ በጥብቅ የተከለከሉ ናቸው።',
    rarityFilter: 'የብርቅነት ደረጃ',
    historicalEra: 'የተመረተበት ዓመት',
    physicalCondition: 'የዕቃው ሁኔታ',
    advancedFilters: 'ተጨማሪ ማጣሪያዎች',
    instantSearch: 'ፈጣን ፍለጋ',
    resetFilters: 'ሁሉንም አፅዳ',
    rarityLevels: {
      all: 'ሁሉም ደረጃዎች',
      common: 'መደበኛ (Standard)',
      uncommon: 'ተፈላጊ (Selected)',
      rare: 'ከፍተኛ ተፈላጊ (High Demand)',
      ultraRare: 'ፕሪሚየም (Premium)',
      unique: 'ብቸኛ / ተወዳዳሪ የሌለው (Bespoke)',
    },
    eraPeriods: {
      all: 'ሁሉም ሞዴሎች',
      ancient: 'ከ2015 በፊት',
      imperial: '2015-2019',
      vintage: '2020-2021',
      millennium: '2022-2023',
      modern: '2024-2025 (አዲስ)',
    },
    categories: {
      all: 'ሁሉም ምድቦች',
      phones: 'ስልኮችና ታብሌቶች',
      electronics: 'ኤሌክትሮኒክስና ላፕቶፕ',
      vehicles: 'መኪኖችና ተሽከርካሪዎች',
      property: 'ቤቶችና አፓርታማዎች',
      fashion: 'አልባሳትና ጫማዎች',
      home: 'የቤት እቃዎችና ሶፋ',
      agriculture: 'ግብርናና ምግቦች',
      jobs: 'ስራዎችና አገልግሎቶች',
    },
  },
  ti: {
    appName: 'ኣጎዛ (Agoza)',
    appTagline: 'ናይ ኢትዮጵያ ውሑስ ናይ ዕዳጋ መድረኽ',
    navTreasures: 'ዕዳጋ ዞር በሉ',
    navVault: 'ናተይ ካዝና',
    navActivity: 'ቀጥታዊ ምንቅስቓስ',
    navUserDashboard: 'ዳሽቦርድ ተጠቃሚ',
    navAdminDashboard: 'ኣመሓዳሪ (Admin)',
    listCollectible: '+ ብነጻ መዝግቡ',
    heroHeadline: 'ኣብ መላእ ኢትዮጵያ ዝኾነ ንብረት ይግዝኡ፣ ይሽጡን ይለዋወጡን',
    heroSubtitle: 'ሞባይል፣ መካይን፣ ላፕቶፕ፣ ናይ ገዛ ኣቑሑትን ኣፓርታማታትን ብውሑስ ናይ ዓዳጊ ውሕስነት ዝሽጠሉን ዝለዋወጥሉን መድረኽ።',
    searchPlaceholder: 'እንታይ ክትገዝኡ ትደልዩ? (ንኣብነት፡ ኣይፎን፣ ቶዮታ፣ ቦሌ ኣፓርታማ)...',
    allRegions: 'መላእ ኢትዮጵያ',
    escrowProtectedBadge: '100% ዝተረጋገጸ ውሕስነት',
    openToSwaps: 'ንዕቃ ብዕቃ ድሉው',
    filterSwapsOnly: 'ምልውዋጥ ጥራሕ',
    listingPrice: 'ዋጋ',
    makeOffer: 'ዋጋ ተደራደር',
    viewAndBuy: 'ርኣይን ርኸብን',
    conditionGrade: 'ደረጃ',
    buyWithEscrow: 'ብውሕስነት ዓድግ',
    proposeSwap: 'ዕቃ ብዕቃ ኣቕርብ',
    directChat: 'ብቐጥታ ተዘራረብ',
    showContact: 'ቁጽሪ ስልኪ ኣርእይ',
    inspectionCode: 'ናይ ፍተሻ ኮድ',
    myVaultTitle: 'ናተይ ምልክታታትን ካዝናን',
    escrowOrders: 'ዝተረጋገጹ ትእዛዛት',
    bargainsAndSwaps: 'ድርድራትን ምልውዋጣትን',
    savedWatchlist: 'ዝተዓቀቡ',
    myListings: 'ዝተዘርግሑ ምልክታታተይ',
    liveActivityFeed: 'ቀጥታዊ ምንቅስቓስ',
    alertCenter: 'ምልክታታት SMS/Email',
    smsNotifications: 'ናይ SMS መልእኽቲ',
    emailNotifications: 'ናይ ኢመይል መልእኽቲ',
    duplicateWarning: 'ተመሳሳሊ ምልክታ ተኸልኪሉ፡ ብተመሳሳሊ ፎቶ ደጊምካ ምልጣፍ ኣይፍቀድን።',
    duplicateImageAllowedNote: 'መተሓሳሰቢ፡ ሓድሽ ፎቶ ብምእታው ምልክታኹም ክትልጥፉ ትኽእሉ ኢኹም።',
    prohibitedItemWarning: 'ክልኩል ነገር ተረኺቡ፡ ዕጸ-ፋርስ፣ ኣጽዋርን ጐዳእቲ ነገራትን ምሉእ ብምሉእ ዝተኸልከሉ እዮም።',
    rarityFilter: 'ደረጃ ሳሕቲ',
    historicalEra: 'ዝተሰርሐሉ ዓመት',
    physicalCondition: 'ኩነታት ንብረት',
    advancedFilters: 'ተወሳኺ መጻረዪ',
    instantSearch: 'ቅልጡፍ ምድላይ',
    resetFilters: 'ኩሉ ኣጽሪ',
    rarityLevels: {
      all: 'ኩሎም ደረጃታት',
      common: 'ልሙድ',
      uncommon: 'ሳሕቲ',
      rare: 'ብሉጽ ሳሕቲ',
      ultraRare: 'ኣዝዩ ሳሕቲ',
      unique: 'ፍሉይ / መዳርግቲ ዘይብሉ',
    },
    eraPeriods: {
      all: 'ኩሎም ሞዴላት',
      ancient: 'ቅድሚ 2015',
      imperial: '2015-2019',
      vintage: '2020-2021',
      millennium: '2022-2023',
      modern: '2024-2025 (ሓድሽ)',
    },
    categories: {
      all: 'ኩሎም ዓይነታት',
      phones: 'ተሌፎናትን ታብሌትን',
      electronics: 'ኤሌክትሮኒክስን ላፕቶፕን',
      vehicles: 'መካይንን ተሽከርከርትን',
      property: 'ኣባይትን ኣፓርታማን',
      fashion: 'ክዳውንትን ሳእነን',
      home: 'ኣቑሑት ገዛን ሶፋን',
      agriculture: 'ሕርሻን መግብን',
      jobs: 'ስራሕን ኣገልግሎትን',
    },
  },
  om: {
    appName: 'Agoza (አጎዛ)',
    appTagline: 'Gabaa Nageenya Qabu Kan Itoophiyaa',
    navTreasures: 'Gabaa Sakatta\'aa',
    navVault: 'Kuwannaa Kiyya',
    navActivity: 'Sochii Kallattii',
    navUserDashboard: 'Daashboordii Fayyadamaa',
    navAdminDashboard: 'Koreen Bulchiinsaa',
    listCollectible: '+ Bilisaan Galmeessi',
    heroHeadline: 'Itoophiyaa Guutuutti Wanta Barbaaddan Bitaa, Gurguraa, Jijjiirraa',
    heroSubtitle: 'Bilbila, konkolaataa, elektirooniksii, uffata fi manneen eegumsa amansiisaa Agoza waliin bitaa, gurguraa.',
    searchPlaceholder: 'Maal barbaaddu? (fakkeenyaaf: iPhone 15, Toyota RAV4, Manneen Boolee)...',
    allRegions: 'Itoophiyaa Guutuu',
    escrowProtectedBadge: '100% Eegumsa Mirkanaa\'aa',
    openToSwaps: 'Jijjiirraaf Banaadha',
    filterSwapsOnly: 'Jijjiirraa Qofa',
    listingPrice: 'Gatii',
    makeOffer: 'Gatii Dubbadhu',
    viewAndBuy: 'Ilaali fi Argadhu',
    conditionGrade: 'Sadarkaa',
    buyWithEscrow: 'Eegumsaan Biti',
    proposeSwap: 'Jijjiirraa Dhiyeessi',
    directChat: 'Kallattiin Haasa\'i',
    showContact: 'Lakk. Bilbilaa Agarsiisi',
    inspectionCode: 'Koodii Iccitii',
    myVaultTitle: 'Daashboordii fi Kuwannaa Kiyya',
    escrowOrders: 'Ajajawwan Mirkanaa\'an',
    bargainsAndSwaps: 'Jijjiirraa fi Falmii',
    savedWatchlist: 'Kan Olkaawwaman',
    myListings: 'Beeksisa Kiyya',
    liveActivityFeed: 'Sochii Kallattii',
    alertCenter: 'Beeksisa SMS/Email',
    smsNotifications: 'Ergaa SMS',
    emailNotifications: 'Ergaa Imeelii',
    duplicateWarning: 'Beeksisni walfakkaataan dhowwameera: Suuraa walfakkaataan beeksisa lammata baasuun hin danda\'amu.',
    duplicateImageAllowedNote: 'Hubachiisa: Suuraa haaraa kaasuun beeksisa keessan baasuu dandeessu.',
    prohibitedItemWarning: 'Dhowwaa Seeraa: Qorichi sammuu adoochu, meeshaan waraanaa fi wantoonni miidhaa geessisan Agoza irratti dhorkaadha.',
    rarityFilter: 'Sadarkaa Qaalii',
    historicalEra: 'Bara Hojjetame',
    physicalCondition: 'Haala Qabatamaa',
    advancedFilters: 'Filtara Dabalataa',
    instantSearch: 'Barbaacha Ariifachiisaa',
    resetFilters: 'Hunda Haqi',
    rarityLevels: {
      all: 'Sadarkaa Hunda',
      common: 'Waliigalaa',
      uncommon: 'Darbee Darbee',
      rare: 'Qaalii',
      ultraRare: 'Baay\'ee Qaalii',
      unique: 'Addaa / Qophaa',
    },
    eraPeriods: {
      all: 'Moodeela Hunda',
      ancient: '2015 Dura',
      imperial: '2015-2019',
      vintage: '2020-2021',
      millennium: '2022-2023',
      modern: '2024-2025 (Haaraa)',
    },
    categories: {
      all: 'Gosa Hunda',
      phones: 'Bilbila fi Taabileetii',
      electronics: 'Elektirooniksii fi Laaptooppii',
      vehicles: 'Konkolaattota',
      property: 'Manneen fi Lafa',
      fashion: 'Uffata fi Kophee',
      home: 'Meeshaa Manaa fi Soofaa',
      agriculture: 'Qonnaa fi Midhaan',
      jobs: 'Hojii fi Tajaajila',
    },
  },
  so: {
    appName: 'Agoza (አጎዛ)',
    appTagline: 'Suuqa Nabdoon Ee Itoobiya',
    navTreasures: 'Baadh Suuqa',
    navVault: 'Qasnaddayda',
    navActivity: 'Dhaqdhaqaaqa Tooska ah',
    navUserDashboard: 'Dashboardka Isticmaalaha',
    navAdminDashboard: 'Maamulka (Admin)',
    listCollectible: '+ Dhig Xayeysiis Bilaash',
    heroHeadline: 'Wax kasta ka Iibso, Iibi, oo ku Isdhaafso Guud ahaan Itoobiya',
    heroSubtitle: 'Taleefannada casriga ah, baabuurta, elektaroonigga, dharka, iyo guryaha adoo adeegsanaya ilaalinta la aamminsan yahay ee Agoza.',
    searchPlaceholder: 'Maxaad raadinaysaa? (tusaale: iPhone 15, Toyota RAV4, Guri Bole)...',
    allRegions: 'Itoobiya Oo Dhan',
    escrowProtectedBadge: '100% Waxaa Ilaaliya Amniga',
    openToSwaps: 'U Furan Isdhaafsi',
    filterSwapsOnly: 'Isdhaafsi Kaliya',
    listingPrice: 'Qiimaha',
    makeOffer: 'Gorgortan Samee',
    viewAndBuy: 'Fiiri oo Xiriir',
    conditionGrade: 'Heerka',
    buyWithEscrow: 'Ku Iibso Damaanad',
    proposeSwap: 'U Bandhig Isdhaafsi',
    directChat: 'La Sheekayso',
    showContact: 'Muuji Taleefanka',
    inspectionCode: 'Koodhka Kormeerka',
    myVaultTitle: 'Qasnadda & Xayeysiisyadayda',
    escrowOrders: 'Dalabaadka Mirkanaaday',
    bargainsAndSwaps: 'Gorgortanka & Isdhaafsiga',
    savedWatchlist: 'Alaabta La Keydiyey',
    myListings: 'Xayeysiisyadayda Firfircoon',
    liveActivityFeed: 'Dhaqdhaqaaqa Tooska ah',
    alertCenter: 'Digniinaha SMS & Email',
    smsNotifications: 'Fariimaha SMS',
    emailNotifications: 'Fariimaha Email',
    duplicateWarning: 'Xayeysiis isku mid ah waa la diiday: Sawir isku mid ah laba jeer laguma dhejin karo.',
    duplicateImageAllowedNote: 'Xusuusin: Waxaad dhejin kartaa sawir cusub si aad u sii waddo.',
    prohibitedItemWarning: 'Digniin Nabadgelyo: Daroogada, hubka, iyo alaabta halista ah si adag ayaa looga mamnuucay Agoza.',
    rarityFilter: 'Heerka Dhif-ahaanshaha',
    historicalEra: 'Sanadka la sameeyey',
    physicalCondition: 'Xaaladda Shayga',
    advancedFilters: 'Shaandheyn Sare',
    instantSearch: 'Raadinta Degdegga ah',
    resetFilters: 'Dib u Deji Dhammaan',
    rarityLevels: {
      all: 'Dhammaan Heerarka',
      common: 'Caadi',
      uncommon: 'Dhif ah',
      rare: 'Aad u Dhif ah',
      ultraRare: 'Aad iyo Aad u Qaali ah',
      unique: 'Kaliya / Aan Nooc Kale Lahayn',
    },
    eraPeriods: {
      all: 'Dhammaan Moodeelada',
      ancient: 'Kahor 2015',
      imperial: '2015-2019',
      vintage: '2020-2021',
      millennium: '2022-2023',
      modern: '2024-2025 (Cusub)',
    },
    categories: {
      all: 'Dhammaan Noocyada',
      phones: 'Telefoonnada & Kaniiniyada',
      electronics: 'Elektaroonigga & Laptop-yada',
      vehicles: 'Baabuurta & Gaadiidka',
      property: 'Guryaha & Dhulka',
      fashion: 'Dharka & Kabaha',
      home: 'Qalabka Guriga & Fadhiga',
      agriculture: 'Beeraha & Cuntada',
      jobs: 'Shaqooyinka & Adeegyada',
    },
  },
};

const cache = new Map<Language, Translations>();

/** Full translation table for `lang`, with English filling any missing keys. */
export function getTranslations(lang: Language): Translations {
  const hit = cache.get(lang);
  if (hit) return hit;
  const enFull: Translations = { ...BASE.en, ...UI_STRINGS.en };
  const result =
    lang === 'en'
      ? enFull
      : deepMerge(enFull, { ...(BASE[lang] as DeepPartial<BaseTranslations>), ...(UI_STRINGS[lang] as DeepPartial<UiStrings>) } as DeepPartial<Translations>);
  cache.set(lang, result);
  return result;
}

/** BCP-47 tags for <html lang> and Intl formatting. */
export const LANGUAGE_LOCALES: Record<Language, string> = {
  en: 'en-ET',
  am: 'am-ET',
  ti: 'ti-ET',
  om: 'om-ET',
  so: 'so-ET',
};
