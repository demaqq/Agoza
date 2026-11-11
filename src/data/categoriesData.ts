import { CollectibleCategory } from '../types';

export interface SubCategoryItem {
  id: string;
  name: string;
  amharic: string;
  icon?: string;
}

export interface CategoryDefinition {
  id: CollectibleCategory;
  name: string;
  amharic: string;
  iconName: string;
  badgeColor: string;
  subcategories: SubCategoryItem[];
}

export const CATEGORIES_WITH_SUBCATEGORIES: CategoryDefinition[] = [
  {
    id: 'all',
    name: 'All Items',
    amharic: 'ሁሉም ዕቃዎች',
    iconName: 'Sparkles',
    badgeColor: 'text-amber-500 bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800',
    subcategories: [],
  },
  {
    id: 'art-collectibles',
    name: 'Decor & Crafts',
    amharic: 'የቤት ማስጌጫ እና እደ-ጥበብ',
    iconName: 'Palette',
    badgeColor: 'text-amber-600 bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800',
    subcategories: [
      { id: 'traditional-paintings', name: 'Canvas & Contemporary Art', amharic: 'ዘመናዊ የሸራ ስዕሎች' },
      { id: 'woodcraft-sculptures', name: 'Handcrafted Wood Decor & Carvings', amharic: 'የእንጨት ቅርጻቅርጽ እና ጌጣጌጥ' },
      { id: 'mesob-baskets', name: 'Handwoven Mesob & Baskets', amharic: 'ባህላዊ መሶብ እና ቅርጫቶች' },
      { id: 'pottery-ceramics', name: 'Clay Pottery & Jebena Sets', amharic: 'የሸክላ ስራዎች እና የጀበና እቃዎች' },
      { id: 'horn-bone-crafts', name: 'Carved Horn & Leather Crafts', amharic: 'የቀንድ እና የቆዳ እደ-ጥበብ' },
    ],
  },
  {
    id: 'phones-tablets',
    name: 'Phones & Tablets',
    amharic: 'ስልኮች እና ታብሌቶች',
    iconName: 'Smartphone',
    badgeColor: 'text-blue-500 bg-blue-50 dark:bg-blue-950/40 border-blue-300 dark:border-blue-800',
    subcategories: [
      { id: 'iphones', name: 'Apple iPhone (Pro, Max, Base)', amharic: 'አፕል አይፎን' },
      { id: 'samsung-galaxy', name: 'Samsung Galaxy (S-Series, Z-Fold, A)', amharic: 'ሳምሰንግ ጋላክሲ' },
      { id: 'google-pixel-xiaomi', name: 'Google Pixel, Xiaomi & Redmi', amharic: 'ጉግል ፒክሰል እና ሻዎሚ' },
      { id: 'tecno-infinix', name: 'Tecno, Infinix & Budget Smart', amharic: 'ቴክኖ እና ኢንፊኒክስ' },
      { id: 'ipads-tablets', name: 'Apple iPad & Android Tablets', amharic: 'ታብሌቶች እና አይፓድ' },
      { id: 'smartwatches', name: 'Apple Watch, Galaxy Watch & Bands', amharic: 'ስማርት ሰዓቶች' },
      { id: 'airpods-audio', name: 'AirPods, Galaxy Buds & Earphones', amharic: 'ኤርፖድ እና ገመድ አልባ የጆሮ ማዳመጫ' },
      { id: 'phone-accessories', name: 'Chargers, Cases & Powerbanks', amharic: 'የስልክ መለዋወጫዎች እና ፓወር ባንክ' },
    ],
  },
  {
    id: 'electronics-laptops',
    name: 'Electronics & Tech',
    amharic: 'ላፕቶፕ እና ኤሌክትሮኒክስ',
    iconName: 'Laptop',
    badgeColor: 'text-purple-500 bg-purple-50 dark:bg-purple-950/40 border-purple-300 dark:border-purple-800',
    subcategories: [
      { id: 'laptops-macbooks', name: 'Apple MacBook (M1/M2/M3) & Laptops', amharic: 'ላፕቶፖች እና ማክቡክ' },
      { id: 'desktop-pcs', name: 'Desktop Workstations & Gaming PCs', amharic: 'ዴስክቶፕ ኮምፒውተሮች' },
      { id: 'cameras-drones', name: 'Sony, Canon, Nikon & DJI Drones', amharic: 'ካሜራዎች እና ድሮን' },
      { id: 'tvs-audio', name: 'Smart 4K/8K TVs, Soundbars & JBL', amharic: 'ስማርት ቴሌቪዥን እና ስፒከሮች' },
      { id: 'gaming-consoles', name: 'PlayStation 5, Xbox Series X & Gear', amharic: 'የጨዋታ ኮንሶሎች' },
      { id: 'solar-power-backup', name: 'Solar Inverters, Batteries & Panels', amharic: 'የሶላር ሲስተም እና ኢንቨርተር' },
      { id: 'printers-office', name: 'Printers, Scanners & Network Gear', amharic: 'ፕሪንተር እና የቢሮ ኤሌክትሮኒክስ' },
    ],
  },
  {
    id: 'vehicles-cars',
    name: 'Vehicles & Auto',
    amharic: 'ተሽከርካሪዎች እና መኪና',
    iconName: 'Car',
    badgeColor: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800',
    subcategories: [
      { id: 'cars-suvs', name: 'Toyota RAV4, V8 Land Cruiser & SUVs', amharic: 'የግል መኪናዎች እና SUV' },
      { id: 'sedans-compact', name: 'Toyota Corolla, Yaris, Vitz & Sedans', amharic: 'አነስተኛ የከተማ መኪናዎች' },
      { id: 'electric-hybrid', name: 'Electric Vehicles (EV), ID.4 & Hybrids', amharic: 'የኤሌክትሪክ እና ሃይብሪድ መኪኖች' },
      { id: 'commercial-trucks', name: 'Pickups, Isuzu, Sino Trucks & Vans', amharic: 'የጭነት መኪናዎች እና ቫኖች' },
      { id: 'motorcycles-bajaj', name: 'Motorcycles, TVS Bajaj & Scooters', amharic: 'ሞተር ሳይክል እና ባጃጅ' },
      { id: 'auto-parts', name: 'Engines, Tires, Batteries & Spare Parts', amharic: 'የመኪና መለዋወጫዎች እና ጎማ' },
    ],
  },
  {
    id: 'property-realestate',
    name: 'Real Estate & Property',
    amharic: 'ሪል እስቴት እና ቤቶች',
    iconName: 'Home',
    badgeColor: 'text-rose-500 bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800',
    subcategories: [
      { id: 'apartments-rent', name: 'Apartments for Rent (Bole, CMC, Kazanchis)', amharic: 'የሚከራዩ አፓርታማዎች' },
      { id: 'houses-sale', name: 'Villas, G+2 Luxury Homes & Condos', amharic: 'የሚሸጡ ቪላዎች እና ቤቶች' },
      { id: 'furnished-rentals', name: 'Furnished Guest Houses & Short Lets', amharic: 'የተሟሉ አፓርታማዎችና ቪላዎች' },
      { id: 'commercial-offices', name: 'Commercial Spaces, Shops & Offices', amharic: 'የንግድ ቤቶች እና ቢሮዎች' },
      { id: 'land-plots', name: 'Investment Land & Residential Plots', amharic: 'መሬት እና ቦታዎች' },
      { id: 'warehouses', name: 'Warehouses & Industrial Sheds', amharic: 'መጋዘኖች እና ፋብሪካዎች' },
    ],
  },
  {
    id: 'fashion-clothes',
    name: 'Fashion & Habesha Kemis',
    amharic: 'ፋሽን እና የሀበሻ ልብስ',
    iconName: 'Shirt',
    badgeColor: 'text-pink-500 bg-pink-50 dark:bg-pink-950/40 border-pink-300 dark:border-pink-800',
    subcategories: [
      { id: 'habesha-kemis', name: 'Handmade Habesha Kemis & Tibeb Dresses', amharic: 'የሀበሻ ቀሚስ እና ጥበብ' },
      { id: 'traditional-kuta-gabi', name: 'Traditional Kuta, Netela & Warm Gabi', amharic: 'ኩታ፣ ነጠላ እና ጋቢ' },
      { id: 'gold-silver-jewelry', name: '21k/18k Pure Gold & Silver Jewelry', amharic: 'የወርቅና የብር ጌጣጌጥ' },
      { id: 'amber-necklaces', name: 'Traditional Amber (ዕምባር) & Coral Beads', amharic: 'የዕምባር እና የኮራል ጌጦች' },
      { id: 'luxury-watches', name: 'Rolex, Omega & Luxury Timepieces', amharic: 'የእጅ ሰዓቶች' },
      { id: 'mens-fashion', name: 'Men Suits, Jackets & Designer Outerwear', amharic: 'የወንዶች ልብስ እና ሱፍ' },
      { id: 'shoes-leather', name: 'Pure Ethiopian Leather Bags & Boots', amharic: 'የቆዳ ቦርሳዎችና ጫማዎች' },
    ],
  },
  {
    id: 'home-furniture',
    name: 'Home & Living',
    amharic: 'የቤት እቃዎች እና ፈርኒቸር',
    iconName: 'Armchair',
    badgeColor: 'text-orange-500 bg-orange-50 dark:bg-orange-950/40 border-orange-300 dark:border-orange-800',
    subcategories: [
      { id: 'sofas-living', name: 'Modern Living Room Sofas & L-Couches', amharic: 'የሳሎን ሶፋዎች' },
      { id: 'coffee-ceremony', name: 'Clay Jebena, Rekebot & Coffee Sets', amharic: 'የጀበና እና ረከቦት የቡና እቃዎች' },
      { id: 'dining-bedroom', name: 'Solid Wood Dining Tables & Bed Sets', amharic: 'የመመገቢያ እና የመኝታ እቃዎች' },
      { id: 'kitchen-appliances', name: 'Stoves, Refrigerators & Kitchenware', amharic: 'የወጥ ቤት እቃዎች እና ፍሪጅ' },
      { id: 'rugs-carpets', name: 'Hand-Woven Tibeb Rugs & Curtains', amharic: 'ምንጣፎች እና መጋረጃዎች' },
      { id: 'office-furniture', name: 'Office Desks, Chairs & Safe Vaults', amharic: 'የቢሮ ጠረጴዛዎች እና ካዝና' },
    ],
  },
  {
    id: 'agriculture-food',
    name: 'Agriculture & Coffee',
    amharic: 'ግብርና እና ቡና',
    iconName: 'Wheat',
    badgeColor: 'text-lime-600 bg-lime-50 dark:bg-lime-950/40 border-lime-300 dark:border-lime-800',
    subcategories: [
      { id: 'specialty-coffee', name: 'Yirgacheffe, Sidama & Harar Coffee Beans', amharic: 'የይርጋጨፌ እና የሲዳማ ቡና' },
      { id: 'honey-spices', name: 'Organic White Honey, Teff & Spices', amharic: 'ማር፣ ጤፍ እና ቅመማ ቅመሞች' },
      { id: 'farm-machinery', name: 'Water Pumps, Solar Irrigation & Tractors', amharic: 'የግብርና ማሽነሪዎች' },
      { id: 'livestock-dairy', name: 'Dairy Cattle, Sheep, Goats & Poultry', amharic: 'የእርሻ እንስሳት እና ዶሮ' },
      { id: 'seeds-fertilizers', name: 'Certified Crop Seeds & Agro Inputs', amharic: 'የሰብል ዘሮች እና ማዳበሪያ' },
    ],
  },
  {
    id: 'books-cultural',
    name: 'Books & Heritage Media',
    amharic: 'መጽሐፍት እና ታሪካዊ ሰነዶች',
    iconName: 'BookOpen',
    badgeColor: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 border-indigo-300 dark:border-indigo-800',
    subcategories: [
      { id: 'rare-books-geez', name: 'Rare Books & Historic Ge\'ez Manuscripts', amharic: 'ብርቅዬ መጻሕፍት እና የግዕዝ ሰነዶች' },
      { id: 'instruments', name: 'Traditional Music (Masenqo, Krar, Begena)', amharic: 'የባህል ሙዚቃ መሳሪያዎች (ማሲንቆ፣ ክራር)' },
      { id: 'vintage-vinyl', name: 'Vintage Ethiopian Jazz & Vinyl Records', amharic: 'የቀድሞ የኢትዮጵያ ጃዝ ቪኒል' },
      { id: 'history-philosophy', name: 'Ethiopian History, Politics & Philosophy', amharic: 'የታሪክ እና የፍልስፍና መጻሕፍት' },
      { id: 'cultural-games', name: 'Traditional Games (Gebeta / ገበጣ)', amharic: 'ባህላዊ የገበጣ ጨዋታዎች' },
    ],
  },
  {
    id: 'jobs-services',
    name: 'Services & Trades',
    amharic: 'አገልግሎቶች',
    iconName: 'Briefcase',
    badgeColor: 'text-cyan-500 bg-cyan-50 dark:bg-cyan-950/40 border-cyan-300 dark:border-cyan-800',
    subcategories: [
      { id: 'art-appraisal', name: 'Art Authentication & Gem Testing', amharic: 'የእቃ ትክክለኛነት ማረጋገጫ' },
      { id: 'safe-courier', name: 'Safe Hub Verified Delivery & Logistics', amharic: 'ደህንነቱ የተጠበቀ የማድረስ አገልግሎት' },
      { id: 'tech-repair', name: 'Device Repair & Software Services', amharic: 'የኤሌክትሮኒክስ ጥገና' },
      { id: 'car-inspection', name: 'Vehicle Valuation & Mechanical Check', amharic: 'የመኪና ምርመራ እና ግመታ' },
      { id: 'legal-translation', name: 'Translation & Legal Document Services', amharic: 'የትርጉም እና የውል ሰነድ' },
    ],
  },
];

export const getCategoryById = (id: string): CategoryDefinition => {
  return CATEGORIES_WITH_SUBCATEGORIES.find((c) => c.id === id) || CATEGORIES_WITH_SUBCATEGORIES[0];
};
