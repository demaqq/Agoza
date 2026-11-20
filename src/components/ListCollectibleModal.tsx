import React, { useState, useMemo, useRef } from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { CollectibleCategory, ItemCondition, ItemRarity, HistoricalEraPeriod } from '../types';
import { SAFE_HUBS } from '../data/mockData';
import { checkSafetyCompliance } from '../utils/safetyFilter';
import { ImageWatermark } from './ImageWatermark';
import {
  detectImageRepetition,
  applyAgozaWatermark,
  RepetitionCheckResult,
} from '../utils/imageRepetitionDetector';
import {
  getMarketPriceIntelligence,
  MarketIntelligenceReport,
} from '../utils/marketPriceIntelligence';
import { ETHIOPIAN_CITIES } from '../data/citiesData';
import { CustomCategorySubcategoryPicker } from './CustomCategorySubcategoryPicker';
import { CustomDropdown } from './CustomDropdown';
import {
Plus,
  X,
  Check,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  UploadCloud,
  Camera,
  Trash2,
  RefreshCw,
  AlertCircle,
  Scale,
  TrendingDown,
  Crown,
  Share2,
  Send,
  Radio,
} from 'lucide-react';

const conditionDropdownOptions = [
  { value: 'Brand New', label: 'Brand New', sublabel: 'Sealed in box / Never used' },
  { value: 'Like New', label: 'Like New', sublabel: 'Flawless condition / Barely used' },
  { value: 'Used - Excellent', label: 'Used - Excellent', sublabel: 'Minor cosmetic signs' },
  { value: 'Used - Good', label: 'Used - Good', sublabel: 'Fully functional with normal wear' },
  { value: 'Refurbished', label: 'Refurbished', sublabel: 'Certified restored' },
  { value: 'For Parts', label: 'For Parts', sublabel: 'For parts or relic' },
];

const cityDropdownOptions = ETHIOPIAN_CITIES.filter((c) => c.id !== 'all').map((c) => ({
  value: c.name,
  label: c.name,
  sublabel: `${c.amharic} — ${c.region}`,
}));

const rarityDropdownOptions = [
  { value: 'Common', label: 'Standard Delivery', sublabel: 'Regular safe hub meetup' },
  { value: 'Uncommon', label: 'Fast Handshake', sublabel: 'Ready for same-day inspection' },
  { value: 'Rare', label: 'High Demand', sublabel: 'Fast-moving tech or vehicle' },
  { value: 'Ultra Rare', label: 'Premium Edition', sublabel: 'Sealed / Flagship tier' },
  { value: 'Unique', label: 'Custom / Bespoke', sublabel: 'Custom build / specialized' },
];

const createdDropdownOptions = [
  { value: 'modern', label: '2024 - 2025 (Latest)', sublabel: 'Current model release' },
  { value: 'millennium', label: '2020 - 2023', sublabel: 'Recent generation' },
  { value: 'vintage', label: '2015 - 2019', sublabel: 'Previous generation' },
  { value: 'imperial', label: '2010 - 2014', sublabel: 'Legacy generation' },
  { value: 'ancient', label: 'Pre-2010', sublabel: 'Classic build' },
];

export const ListCollectibleModal: React.FC = () => {
  const {
    isListModalOpen,
    setIsListModalOpen,
    collectibles,
    addCollectible,
    updateCollectiblePrice,
    checkDuplicateListing,
    formatPrice,
    userPlan,
    setIsPlansModalOpen,
    activePlanDetails,
    socialMarketingSettings,
    setIsSocialModalOpen,
    activeBroadcastPayload,
    currentUser,
    selectedCity,
    t,
  } = useMarketplace();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<CollectibleCategory>('phones-tablets');
  const [subcategory, setSubcategory] = useState<string>('iphones');
  const [city, setCity] = useState<string>(currentUser?.city || selectedCity || 'Addis Ababa');
  const [priceETB, setPriceETB] = useState<number>(45000);
  const [condition, setCondition] = useState<ItemCondition>('Like New');
  const [rarity, setRarity] = useState<ItemRarity>('Common');
  const [eraPeriod, setEraPeriod] = useState<HistoricalEraPeriod>('modern');
  const [era, setEra] = useState('2024 Model (Full Specs)');
  const [origin, setOrigin] = useState('Bole Medhanialem');

  // Authentic Photo Upload
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [repetitionResult, setRepetitionResult] = useState<RepetitionCheckResult | null>(null);

  const [customUrl, setCustomUrl] = useState('');
  const [description, setDescription] = useState('');
  const [provenance, setProvenance] = useState('');
  const [openToTrade, setOpenToTrade] = useState(true);
  const [tradeInterests, setTradeInterests] = useState('Open to phone or laptop swaps with cash balance');
  const [safeMeetupSpot, setSafeMeetupSpot] = useState(SAFE_HUBS[1].name);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Post-listing market price intelligence
  const [marketReport, setMarketReport] = useState<MarketIntelligenceReport | null>(null);
  const [createdItemId, setCreatedItemId] = useState<string | null>(null);
  const [priceUpdatedTo, setPriceUpdatedTo] = useState<number | null>(null);

  // Active primary photo
  const activePhoto = uploadedPhotos.length > 0 ? uploadedPhotos[0] : customUrl;

  // Real-time title & photo combination repetition check
  const duplicateCheck = useMemo(() => {
    return checkDuplicateListing(title, activePhoto);
  }, [title, activePhoto, checkDuplicateListing]);

  // Real-time drug/harmful items safety check
  const safetyCheck = useMemo(() => {
    return checkSafetyCompliance(title, description);
  }, [title, description]);

  if (!isListModalOpen) return null;

  // Handle local image file upload & apply Agoza Watermark
  const handleFiles = async (files: FileList | File[]) => {
    const fileList = Array.from(files).filter((file) => file.type.startsWith('image/'));
    if (fileList.length === 0) return;

    const maxPhotos = activePlanDetails.maxPhotosPerListing;
    if (uploadedPhotos.length >= maxPhotos) {
      setErrorMessage(
        `Photo limit reached: You have uploaded ${uploadedPhotos.length} / ${maxPhotos} photos allowed on your ${activePlanDetails.name}. Upgrade to Starter (699 Br/mo) for 4 photos, or Pro (1,499 Br/mo) for 10 photos!`
      );
      return;
    }

    const availableSlots = maxPhotos - uploadedPhotos.length;
    const batchToProcess = fileList.slice(0, availableSlots);

    if (fileList.length > availableSlots) {
      setErrorMessage(
        `Your ${activePlanDetails.name} allows up to ${maxPhotos} photos. Processing first ${availableSlots} photos. Upgrade to Starter (699 Br/mo) or Pro (1,499 Br/mo) for higher limits.`
      );
    } else {
      setErrorMessage(null);
    }

    setIsProcessingImage(true);

    try {
      const processedBatch: string[] = [];

      for (const file of batchToProcess) {
        // Read file as base64 data URL
        const rawDataUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

        // 1. Burn the official "አጎዛ Agoza" watermark onto the canvas
        const watermarkedUrl = await applyAgozaWatermark(rawDataUrl);

        // 2. Check repetition against marketplace catalog and current uploads
        const repCheck = await detectImageRepetition(
          watermarkedUrl,
          collectibles.map((c) => c.imageUrl),
          [...uploadedPhotos, ...processedBatch]
        );

        setRepetitionResult(repCheck);

        if (repCheck.isDuplicate) {
          setErrorMessage(repCheck.reason || 'Duplicate photo detected.');
        }

        processedBatch.push(watermarkedUrl);
      }

      setUploadedPhotos((prev) => [...prev, ...processedBatch]);
    } catch (err) {
      console.error('Failed to process image:', err);
      setErrorMessage('Failed to read and process the image file. Please try another image.');
    } finally {
      setIsProcessingImage(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleRemovePhoto = (index: number) => {
    setUploadedPhotos((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      if (updated.length === 0) {
        setRepetitionResult(null);
      }
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // 1. Photo presence check
    if (!activePhoto) {
      setErrorMessage('Please upload at least one photo of your item to proceed.');
      return;
    }

    // 2. Safety Filter Check
    if (!safetyCheck.isSafe) {
      setErrorMessage(safetyCheck.violationReason || t.prohibitedItemWarning);
      return;
    }

    // 3. Image Repetition check validation
    if (repetitionResult?.isDuplicate) {
      setErrorMessage(
        repetitionResult.reason ||
          'Duplicate photo detected. Agoza policy requires unique, authentic photos taken by the seller.'
      );
      return;
    }

    // 4. Title / Image combination duplication check
    if (duplicateCheck.isDuplicate) {
      setErrorMessage(t.duplicateWarning);
      return;
    }

    const additionalImages = uploadedPhotos.length > 1 ? uploadedPhotos.slice(1) : undefined;

    const res = await addCollectible({
      title,
      category,
      subcategory: subcategory || undefined,
      priceETB: Number(priceETB),
      condition,
      rarity,
      eraPeriod,
      era,
      origin: `${origin}, ${city}`,
      description,
      provenance: provenance || 'Authentic item with valid paperwork / original receipt.',
      imageUrl: activePhoto,
      additionalImages,
      openToTrade,
      tradeInterests: tradeInterests
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      safeMeetupSpot,
      authenticityGuaranteed: true,
      seller: {
        id: currentUser ? currentUser.id : 'usr-me',
        name: currentUser ? currentUser.name : 'You (Trader)',
        avatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        location: `${origin}, ${city}`,
        city: city || 'Addis Ababa',
        phone: currentUser ? currentUser.phone : '+251 91 199 8877',
        telegramHandle: currentUser?.telegramUsername || '@trader_ethiopia',
        verifiedKyc: true,
        memberSince: '2024',
        rating: 5.0,
        totalTrades: 16,
        badge: 'Verified Trader',
        responseRate: 'Under 10 mins',
      },
    });

    if (!res.success) {
      setErrorMessage(res.error || t.duplicateWarning);
      return;
    }

    // Run Market Price Intelligence & find competitive suggestions
    const intel = getMarketPriceIntelligence(
      {
        title,
        category,
        priceETB: Number(priceETB),
        condition,
        description,
        era,
      },
      collectibles
    );

    setMarketReport(intel);
    setCreatedItemId(res.id || null);
    setIsSuccess(true);

    // If no similar items exist at different prices, close automatically after 1.5s
    if (intel.similarCount === 0) {
      setTimeout(() => {
        setIsSuccess(false);
        setIsListModalOpen(false);
      }, 1500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#1a1009] border border-slate-200 dark:border-[#262939] rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col transition-colors">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-[#212433] bg-slate-50 dark:bg-[#0e1017]">
          <div className="flex items-center gap-2">
            <Plus className="w-5 h-5 text-[#1b5e20] dark:text-[#c5a059]" />
            <h3 className="font-cinzel text-base font-bold text-slate-900 dark:text-[#f5f6f8]">
              {t.listCollectible} (Agoza | አጎዛ)
            </h3>
          </div>
          <button
            onClick={() => setIsListModalOpen(false)}
            className="p-1.5 rounded-xl bg-white dark:bg-[#251810] text-slate-600 dark:text-[#8e94a6] hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-[#2a2d3e] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <div className="overflow-y-auto flex-1 p-6">
          {!isSuccess ? (
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              {/* Drug & Weapon Policy Alert */}
              {!safetyCheck.isSafe && (
                <div className="p-3.5 rounded-2xl bg-red-100 dark:bg-red-950/70 border border-red-300 dark:border-red-800 text-red-800 dark:text-red-200 text-xs flex items-start gap-2.5 shadow-sm">
                  <ShieldAlert className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block mb-0.5">Safety Compliance Violation</span>
                    <span>{safetyCheck.violationReason}</span>
                  </div>
                </div>
              )}

              {/* Repetition Alert Banner (if duplicate photo detected) */}
              {repetitionResult?.isDuplicate && (
                <div className="p-3.5 rounded-2xl bg-amber-100 dark:bg-amber-950/70 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs flex items-start gap-2.5 shadow-sm animate-pulse">
                  <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block mb-0.5">Repetition Detected (Duplicate Photo)</span>
                    <span className="text-[11px] block">{repetitionResult.reason}</span>
                    <span className="text-[10px] text-amber-800 dark:text-amber-300/80 mt-1 block">
                      To protect marketplace trust and prevent duplicate ads, please upload an authentic, distinct photo of your item.
                    </span>
                  </div>
                </div>
              )}

              {/* Unique Photo Verified Banner */}
              {repetitionResult && !repetitionResult.isDuplicate && (
                <div className="p-3 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs flex items-center justify-between gap-2 shadow-xs">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span className="font-medium">
                      ✓ Photo uploaded and verified.
                    </span>
                  </div>
                </div>
              )}

              {errorMessage && !repetitionResult?.isDuplicate && (
                <div className="p-3 rounded-2xl bg-red-100 dark:bg-red-950/60 border border-red-300 dark:border-red-800 text-red-800 dark:text-red-300 text-xs flex items-center gap-2 shadow-xs">
                  <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-[#8b91a4] uppercase tracking-wider mb-1.5">
                  Listing Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Toyota RAV4 2022 Hybrid AWD or iPhone 15 Pro 256GB"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-[#171924] border border-slate-200 dark:border-[#282b3c] rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-[#f2f3f6] focus:outline-none focus:border-[#1b5e20] dark:focus:border-[#c5a059]"
                  required
                />
              </div>

              {/* Professional Category & Subcategory Suite */}
              <CustomCategorySubcategoryPicker
                selectedCategory={category}
                selectedSubcategory={subcategory}
                onCategoryChange={(newCat) => setCategory(newCat)}
                onSubcategoryChange={(newSub) => setSubcategory(newSub)}
                label="Category & Subcategory (የእቃው ዘርፍና ንዑስ ዘርፍ) *"
              />

              {/* Condition, City, Rarity & Era Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <CustomDropdown
                  label="Condition (ሁኔታ) *"
                  value={condition}
                  onChange={(val) => setCondition(val as ItemCondition)}
                  options={conditionDropdownOptions}
                />

                <CustomDropdown
                  label="City in Ethiopia (ከተማ) *"
                  value={city}
                  onChange={(val) => setCity(val)}
                  options={cityDropdownOptions}
                  searchable={true}
                />

                <CustomDropdown
                  label="Rarity (ደረጃ) *"
                  value={rarity}
                  onChange={(val) => setRarity(val as ItemRarity)}
                  options={rarityDropdownOptions}
                />

                <CustomDropdown
                  label="Created (የተሰራበት / ዕድሜ) *"
                  value={eraPeriod}
                  onChange={(val) => setEraPeriod(val as HistoricalEraPeriod)}
                  options={createdDropdownOptions}
                />
              </div>

              {/* Price & Specs / Subcity */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-[#8b91a4] uppercase tracking-wider mb-1.5">
                    Price in ETB (Birr) *
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min={100}
                      value={priceETB}
                      onChange={(e) => setPriceETB(Number(e.target.value))}
                      className="w-full bg-slate-50 dark:bg-[#171924] border border-slate-200 dark:border-[#282b3c] rounded-xl px-4 py-2.5 text-sm font-mono font-bold text-slate-900 dark:text-[#f5f6f8] focus:outline-none focus:border-[#1b5e20] dark:focus:border-[#c5a059]"
                      required
                    />
                    <div className="absolute right-3 top-2.5 text-xs text-slate-400 font-mono">
                      ≈ {formatPrice(priceETB)}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-[#8b91a4] uppercase tracking-wider mb-1.5">
                    Subcity / Area / Specs *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Bole Medhanialem or Piazza Churchill"
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-[#171924] border border-slate-200 dark:border-[#282b3c] rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-[#f2f3f6] focus:outline-none focus:border-[#1b5e20] dark:focus:border-[#c5a059]"
                    required
                  />
                </div>
              </div>

              {/* ========================================================= */}
              {/* PHOTO UPLOAD & WATERMARK & REPETITION DETECTION SECTION */}
              {/* ========================================================= */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#151722] border border-slate-200 dark:border-[#272b3c] space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider">
                      Item Photos (የእቃው ፎቶዎች) *
                    </label>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      Upload authentic photos of your actual item (Drag & drop, device file, or camera).
                    </span>
                  </div>
                </div>

                {/* Plan Photo Quota Bar */}
                <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-xl bg-slate-100 dark:bg-[#151725] border border-slate-200 dark:border-[#272b3f] text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      Active Plan: <strong className="text-slate-900 dark:text-white font-mono">{activePlanDetails.name}</strong>
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 font-bold">
                      {uploadedPhotos.length} / {activePlanDetails.maxPhotosPerListing} Photos Used
                    </span>
                  </div>

                  {userPlan !== 'pro' && (
                    <button
                      type="button"
                      onClick={() => setIsPlansModalOpen(true)}
                      className="text-[11px] font-bold text-amber-600 dark:text-amber-400 hover:underline cursor-pointer flex items-center gap-1 ml-auto"
                    >
                      <Crown className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      <span>{userPlan === 'free' ? 'Upgrade to Starter (699 Br) for 4 photos' : 'Upgrade to Pro (1,499 Br) for 10 photos'}</span>
                    </button>
                  )}
                </div>

                {/* Direct Authentic Photo Upload Zone */}
                <div className="space-y-3">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => e.target.files && handleFiles(e.target.files)}
                    className="hidden"
                    id="item-photo-upload"
                  />

                  {/* Drag and Drop Box */}
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                      isDragging
                        ? 'border-[#1b5e20] dark:border-[#d4a373] bg-[#1b5e20]/10 dark:bg-[#d4a373]/10 scale-101'
                        : 'border-slate-300 dark:border-[#4d3424] hover:border-[#1b5e20] dark:hover:border-[#d4a373] bg-white dark:bg-[#20150d]'
                    }`}
                  >
                    {isProcessingImage ? (
                      <div className="flex flex-col items-center justify-center py-4 space-y-2">
                        <RefreshCw className="w-8 h-8 text-[#1b5e20] dark:text-[#d4a373] animate-spin" />
                        <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                          Uploading & Watermarking...
                        </span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <div className="w-12 h-12 rounded-2xl bg-[#1b5e20]/10 dark:bg-[#d4a373]/15 flex items-center justify-center text-[#1b5e20] dark:text-[#d4a373]">
                          <UploadCloud className="w-6 h-6 stroke-[2]" />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-slate-800 dark:text-white block">
                            Click to choose photo from device or drag & drop here
                          </span>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400">
                            Supports JPG, PNG, WEBP (Camera capture supported on mobile)
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Uploaded Photos Preview List */}
                  {uploadedPhotos.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                        <span>
                          Uploaded Photos ({uploadedPhotos.length})
                        </span>
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="text-[11px] text-[#1b5e20] dark:text-[#d4a373] hover:underline cursor-pointer"
                        >
                          + Add another angle
                        </button>
                      </div>

                      {/* Primary Photo Preview with Watermark */}
                      <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-[#4d3424] bg-black">
                        <ImageWatermark
                          src={uploadedPhotos[0]}
                          alt="Uploaded collectible"
                          aspectRatio="aspect-[16/9]"
                          size="md"
                          allowZoom={true}
                          showOverlayPattern={true}
                          watermarkLabel="አጎዛ Agoza"
                          itemTitle={title || 'New Listing Photo'}
                        />
                        <div className="absolute top-2.5 left-2.5 bg-black/75 backdrop-blur-xs text-white text-[10px] px-2 py-0.5 rounded-md font-semibold">
                          Primary Photo Preview
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemovePhoto(0)}
                          className="absolute top-2.5 right-2.5 p-1.5 rounded-lg bg-red-600/85 hover:bg-red-700 text-white cursor-pointer transition-colors shadow"
                          title="Remove photo"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Additional Thumbnails */}
                      {uploadedPhotos.length > 1 && (
                        <div className="grid grid-cols-4 gap-2 pt-1">
                          {uploadedPhotos.slice(1).map((photo, index) => (
                            <div
                              key={index + 1}
                              className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-[#4d3424] aspect-square group"
                            >
                              <img src={photo} alt="" className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => handleRemovePhoto(index + 1)}
                                  className="p-1 rounded bg-red-600 text-white"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Optional Direct URL input for web link */}
                  <div className="pt-1">
                    <input
                      type="url"
                      placeholder="Or paste direct image URL (https://...)"
                      value={customUrl}
                      onChange={(e) => {
                        setCustomUrl(e.target.value);
                        setRepetitionResult(null);
                      }}
                      className="w-full bg-white dark:bg-[#20150d] border border-slate-200 dark:border-[#4d3424] rounded-xl px-4 py-2 text-xs text-slate-900 dark:text-[#fbf5ef] focus:outline-none focus:border-[#1b5e20] dark:focus:border-[#d4a373]"
                    />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-[#8b91a4] uppercase tracking-wider mb-1.5">
                  Item Details & Features *
                </label>
                <textarea
                  rows={3}
                  placeholder="Detail condition, included accessories, warranty, battery health, customs duty status..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-[#171924] border border-slate-200 dark:border-[#282b3c] rounded-xl p-3 text-xs text-slate-900 dark:text-[#f2f3f6] focus:outline-none focus:border-[#1b5e20] dark:focus:border-[#c5a059] resize-none"
                  required
                />
              </div>

              {/* Barter Toggle */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#161926] border border-slate-200 dark:border-[#272b3d] space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="openToTrade"
                      checked={openToTrade}
                      onChange={(e) => setOpenToTrade(e.target.checked)}
                      className="w-4 h-4 accent-[#1b5e20] dark:accent-[#c5a059] cursor-pointer"
                    />
                    <label htmlFor="openToTrade" className="text-xs font-bold text-slate-900 dark:text-[#f1f2f6] cursor-pointer">
                      {t.openToSwaps} (Accept trade-ins & exchange)
                    </label>
                  </div>
                </div>
              </div>

              {/* Designated Safe Hub */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-[#8b91a4] uppercase tracking-wider mb-1.5">
                  Designated Safe Meetup Hub *
                </label>
                <select
                  value={safeMeetupSpot}
                  onChange={(e) => setSafeMeetupSpot(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-[#171924] border border-slate-200 dark:border-[#282b3c] rounded-xl px-3 py-2.5 text-xs text-slate-900 dark:text-[#f2f3f6] focus:outline-none focus:border-[#1b5e20] dark:focus:border-[#c5a059]"
                >
                  {SAFE_HUBS.map((hub) => (
                    <option key={hub.id} value={hub.name}>
                      {hub.name} ({hub.city} - {hub.area})
                    </option>
                  ))}
                </select>
              </div>

              {/* Free Social Auto-Marketing Guarantee Banner */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-[#0088cc]/10 via-[#e1306c]/10 to-[#1877f2]/10 border border-[#0088cc]/30 dark:border-[#0088cc]/20 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Send className="w-4 h-4 text-[#0088cc]" />
                    <strong className="text-slate-900 dark:text-white text-xs">
                      🚀 Automated Social Media Marketing (Included Free)
                    </strong>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                    265k+ Audience Reach
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                  No marketing hustle: When you publish, Agoza automatically broadcasts this listing to our official <strong>Telegram Channel (54k+)</strong>, <strong>Telegram Supergroup (28k+)</strong>, <strong>Instagram</strong>, <strong>Facebook</strong>, <strong>TikTok</strong>, and <strong>Pinterest</strong>!
                </p>
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={
                    duplicateCheck.isDuplicate ||
                    repetitionResult?.isDuplicate ||
                    !safetyCheck.isSafe ||
                    isProcessingImage
                  }
                  className={`w-full py-3 px-4 text-xs font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 min-h-[44px] ${
                    duplicateCheck.isDuplicate ||
                    repetitionResult?.isDuplicate ||
                    !safetyCheck.isSafe ||
                    isProcessingImage
                      ? 'bg-slate-300 dark:bg-[#292c3a] text-slate-500 cursor-not-allowed'
                      : 'bg-[#1b5e20] hover:bg-[#25732b] dark:bg-[#c5a059] dark:hover:bg-[#d6b068] text-white dark:text-[#1e130c] cursor-pointer active:scale-98'
                  }`}
                >
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                  <span>
                    {!safetyCheck.isSafe
                      ? 'Prohibited Item (Remove Banned Keywords to Proceed)'
                      : repetitionResult?.isDuplicate
                      ? 'Duplicate Photo Detected (Upload Unique Photo to Proceed)'
                      : duplicateCheck.isDuplicate
                      ? 'Duplicate Item Blocked (Change Photo to Proceed)'
                      : isProcessingImage
                      ? 'Uploading photo...'
                      : 'Publish & Auto-Broadcast to Telegram & Socials'}
                  </span>
                </button>
              </div>
            </form>
          ) : marketReport && marketReport.similarCount > 0 ? (
            /* Competitive Market Intelligence & Price Suggestions Screen */
            <div className="py-4 space-y-4">
              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-emerald-100 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  <Check className="w-6 h-6 stroke-[2.5]" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">
                    Ad Published Successfully!
                  </h4>
                  <p className="text-xs text-emerald-800 dark:text-emerald-300">
                    Your listing is active and auto-syndicated to Agoza's Telegram Channel, Instagram, Facebook, TikTok, and Pinterest.
                  </p>
                </div>
              </div>

              {/* Social Syndication Delivery Live Pill */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-[#0088cc]/15 via-[#e1306c]/15 to-[#1877f2]/15 border border-[#0088cc]/30 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Radio className="w-4 h-4 text-[#0088cc] animate-pulse" />
                    <strong className="text-slate-900 dark:text-white">
                      📢 Auto-Broadcasted to 5 Official Channels
                    </strong>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsSocialModalOpen(true)}
                    className="px-2.5 py-1 bg-[#0088cc] hover:bg-[#0077b5] text-white rounded-lg font-bold text-[11px] flex items-center gap-1 cursor-pointer shadow-xs"
                  >
                    <Share2 className="w-3 h-3" />
                    <span>View Social Previews</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 text-[11px] font-mono">
                  <span className="flex items-center gap-1 text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Telegram (54k+)
                  </span>
                  <span className="flex items-center gap-1 text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Group (28k+)
                  </span>
                  <span className="flex items-center gap-1 text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Instagram (36k+)
                  </span>
                  <span className="flex items-center gap-1 text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Facebook (82k+)
                  </span>
                  <span className="flex items-center gap-1 text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> TikTok (45k+)
                  </span>
                  <span className="flex items-center gap-1 text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Pinterest (18k+)
                  </span>
                </div>
              </div>

              {/* Price Suggestion & Transparency Banner */}
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-[#161826] border border-amber-300 dark:border-[#2f334a] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Scale className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                    <h5 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                      Competitive Market Price Review & Suggestions
                    </h5>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-lg bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-200">
                    {marketReport.similarCount} Similar Items Found
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  To keep the marketplace competitive and ensure buyers aren't overcharged, Agoza analyzes similar items and evaluates whether price differences are justified by materials and condition quality:
                </p>

                {/* Market Benchmark Range */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-3 bg-white dark:bg-[#0f111a] rounded-xl border border-slate-200 dark:border-[#262a3d] text-xs font-mono">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Your Listing</span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {formatPrice(priceUpdatedTo || priceETB)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Lowest on Agoza</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      {formatPrice(marketReport.lowestPrice)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Market Average</span>
                    <span className="font-bold text-slate-700 dark:text-slate-300">
                      {formatPrice(marketReport.averageMarketPrice)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Suggested Competitive</span>
                    <span className="font-bold text-[#1b5e20] dark:text-[#c5a059]">
                      {formatPrice(marketReport.recommendedCompetitivePrice)}
                    </span>
                  </div>
                </div>

                {/* Similar Listings Comparison */}
                <div className="space-y-2.5">
                  <span className="text-[11px] uppercase font-bold text-slate-700 dark:text-slate-300 tracking-wider block">
                    Similar / Identical Listings on Agoza:
                  </span>

                  {marketReport.suggestions.map((sugg) => (
                    <div
                      key={sugg.item.id}
                      className="p-3 rounded-xl bg-white dark:bg-[#12141e] border border-slate-200 dark:border-[#26293c] text-xs space-y-2"
                    >
                      <div className="flex items-start gap-3">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-amber-400/50 bg-black">
                          <img src={sugg.item.imageUrl} alt="" className="w-full h-full object-cover" />
                          <div className="absolute bottom-0 inset-x-0 bg-black/80 text-[7px] font-serif text-amber-300 text-center font-bold">
                            አጎዛ
                          </div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h6 className="font-bold text-slate-900 dark:text-white truncate">
                              {sugg.item.title}
                            </h6>
                            <span className="font-mono font-bold text-[#1b5e20] dark:text-[#c5a059] ml-2">
                              {formatPrice(sugg.item.priceETB)}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                            <span>Condition: {sugg.item.condition}</span>
                            <span>·</span>
                            <span
                              className={`font-mono font-bold ${
                                sugg.priceDifferenceETB < 0
                                  ? 'text-emerald-600 dark:text-emerald-400'
                                  : 'text-slate-600 dark:text-slate-400'
                              }`}
                            >
                              {sugg.priceDifferenceETB < 0
                                ? `${formatPrice(Math.abs(sugg.priceDifferenceETB))} lower (-${Math.abs(sugg.percentageDifference)}%)`
                                : `${formatPrice(sugg.priceDifferenceETB)} higher (+${sugg.percentageDifference}%)`}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Material Quality Explanation */}
                      <div className="p-2 rounded-lg bg-slate-50 dark:bg-[#181b28] border border-slate-100 dark:border-[#272b3c] text-[11px]">
                        <span className="font-semibold text-amber-700 dark:text-amber-400 block mb-0.5">
                          {sugg.qualityAnalysis.hasQualityDifference
                            ? '⚖️ Material & Quality Note (Price Justification):'
                            : '⚖️ Condition Match:'}
                        </span>
                        <p className="text-slate-600 dark:text-slate-300 leading-snug">
                          {sugg.qualityAnalysis.justificationReason}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Price Adjustment Suggestion & Actions */}
                {priceUpdatedTo ? (
                  <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Listing price updated to competitive rate of {formatPrice(priceUpdatedTo)}!</span>
                  </div>
                ) : marketReport.hasPriceDiscrepancy ? (
                  <div className="p-3 rounded-xl bg-amber-100/90 dark:bg-amber-950/70 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs space-y-2">
                    <div className="flex items-center gap-2 font-bold">
                      <TrendingDown className="w-4 h-4 text-amber-600" />
                      <span>Recommended Price Adjustment:</span>
                    </div>
                    <p className="text-[11px] leading-relaxed">
                      An identical model is currently available on Agoza at a lower price. You can update your price to match the competitive rate ({formatPrice(marketReport.recommendedCompetitivePrice)}) to attract buyers faster.
                    </p>
                    <div className="flex items-center gap-2 pt-1">
                      {createdItemId && (
                        <button
                          type="button"
                          onClick={() => {
                            updateCollectiblePrice(createdItemId, marketReport.recommendedCompetitivePrice);
                            setPriceUpdatedTo(marketReport.recommendedCompetitivePrice);
                          }}
                          className="py-2 px-3 bg-[#1b5e20] hover:bg-[#25732b] dark:bg-[#c5a059] dark:hover:bg-[#d6b068] text-white dark:text-[#1e130c] font-bold text-xs rounded-xl shadow cursor-pointer transition-all"
                        >
                          Update to Competitive Price ({formatPrice(marketReport.recommendedCompetitivePrice)})
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => setIsListModalOpen(false)}
                        className="py-2 px-3 bg-white dark:bg-[#251810] text-slate-700 dark:text-slate-300 font-semibold text-xs rounded-xl border border-slate-300 dark:border-[#2f3346] hover:bg-slate-50 cursor-pointer"
                      >
                        Keep My Asking Price ({formatPrice(priceETB)})
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>

              {/* Close CTA */}
              <button
                type="button"
                onClick={() => setIsListModalOpen(false)}
                className="w-full py-3 bg-slate-900 hover:bg-black dark:bg-[#c5a059] dark:hover:bg-[#d6b068] text-white dark:text-[#1e130c] font-bold text-xs rounded-xl shadow cursor-pointer transition-colors"
              >
                Done & View in Marketplace
              </button>
            </div>
          ) : (
            /* Standard Success Confirmation (when no similar items found) */
            <div className="text-center py-12 space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-600 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                <Check className="w-7 h-7 stroke-[2.5]" />
              </div>
              <h4 className="font-cinzel text-lg font-bold text-slate-900 dark:text-[#f5f6f8]">
                Ad Published Successfully!
              </h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Your ad is live for thousands of buyers across Ethiopia.
              </p>
              <button
                type="button"
                onClick={() => setIsListModalOpen(false)}
                className="mt-2 py-2 px-6 bg-[#1b5e20] dark:bg-[#c5a059] text-white dark:text-[#1e130c] font-bold text-xs rounded-xl cursor-pointer"
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
