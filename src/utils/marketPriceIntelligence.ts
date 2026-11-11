/**
 * Agoza Market Price Intelligence & Competitive Suggestion Engine
 * - Compares items against catalog for identical or similar products
 * - Analyzes condition, materials, and specification differences
 * - Generates competitive price suggestions to prevent buyer overpayment and promote fair trading
 */

import { Collectible, ItemCondition } from '../types';

export interface QualityAnalysis {
  hasQualityDifference: boolean;
  conditionA: string;
  conditionB: string;
  conditionTierDiff: number; // positive if A is better condition
  specDifferenceNotes: string[];
  summary: string;
  isPriceDifferenceJustified: boolean;
  justificationReason: string;
}

export interface MarketSuggestion {
  item: Collectible;
  priceDifferenceETB: number; // positive if other is more expensive, negative if other is cheaper
  percentageDifference: number; // e.g. -15%
  isIdenticalModel: boolean;
  similarityScore: number;
  qualityAnalysis: QualityAnalysis;
  competitivenessStatus: 'cheaper_alternative' | 'more_expensive_alternative' | 'identical_price';
  recommendationText: string;
}

export interface MarketIntelligenceReport {
  targetTitle: string;
  targetPriceETB: number;
  targetCondition: string;
  similarCount: number;
  averageMarketPrice: number;
  lowestPrice: number;
  highestPrice: number;
  pricePosition: 'below-market' | 'fair-market' | 'above-market';
  recommendedCompetitivePrice: number;
  hasPriceDiscrepancy: boolean;
  discrepancyAlert?: string;
  suggestions: MarketSuggestion[];
}

// Condition hierarchy scores (1 to 5)
const CONDITION_TIERS: Record<ItemCondition | string, number> = {
  'Brand New': 5,
  'Like New': 4,
  'Used - Excellent': 3.5,
  'Used - Good': 2.5,
  'Refurbished': 3,
  'For Parts': 1,
};

/**
 * Tokenizes and normalizes text for keyword matching
 */
export const tokenizeText = (text: string): string[] => {
  if (!text) return [];
  const stopWords = new Set([
    'the', 'and', 'for', 'with', 'model', 'edition', 'year', 'original', 'full',
    'options', 'clean', 'duty', 'paid', 'new', 'used', 'black', 'white', 'in', 'at'
  ]);

  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter((word) => word.length > 1 && !stopWords.has(word));
};

/**
 * Calculates similarity between two collectible listings
 */
export const calculateListingSimilarity = (
  itemA: { title: string; category: string; description?: string; era?: string },
  itemB: { title: string; category: string; description?: string; era?: string }
): { isSimilar: boolean; isIdenticalModel: boolean; score: number } => {
  // 1. Category must match or be closely related
  const sameCategory = itemA.category === itemB.category;
  if (!sameCategory) {
    return { isSimilar: false, isIdenticalModel: false, score: 0 };
  }

  const tokensA = tokenizeText(itemA.title);
  const tokensB = tokenizeText(itemB.title);

  if (tokensA.length === 0 || tokensB.length === 0) {
    return { isSimilar: false, isIdenticalModel: false, score: 0 };
  }

  // Calculate Jaccard / token overlap
  let matchCount = 0;
  for (const tA of tokensA) {
    if (tokensB.includes(tA)) {
      matchCount++;
    }
  }

  const overlapScore = (matchCount * 2) / (tokensA.length + tokensB.length);

  // Key model markers detection (e.g. "iphone 15", "rav4", "macbook", "seamaster", "s24")
  const keyModelKeywords = [
    'iphone', 'rav4', 'macbook', 'samsung', 'seamaster', 'jebena', 'cross', 'coin',
    'apartment', 'mercedes', 'playstation', 'ps5', 'toyota', 'vitz', 'corolla'
  ];

  const commonKeyModels = keyModelKeywords.filter(
    (kw) => tokensA.includes(kw) && tokensB.includes(kw)
  );

  const isIdenticalModel = commonKeyModels.length > 0 && overlapScore >= 0.35;
  const isSimilar = overlapScore >= 0.25 || isIdenticalModel;

  return {
    isSimilar,
    isIdenticalModel,
    score: Math.round(overlapScore * 100),
  };
};

/**
 * Analyzes whether price differences between two items are justified by
 * quality, physical condition, storage, year, or materials.
 */
export const compareItemQualityAndMaterials = (
  itemA: { title: string; condition: string; description?: string; era?: string; priceETB: number },
  itemB: Collectible
): QualityAnalysis => {
  const tierA = CONDITION_TIERS[itemA.condition] || 3;
  const tierB = CONDITION_TIERS[itemB.condition] || 3;
  const tierDiff = tierA - tierB;

  const specNotes: string[] = [];

  // Check storage specs (e.g. 128GB vs 256GB vs 512GB vs 1TB)
  const extractStorage = (str: string) => {
    const match = str.match(/(\d+)\s*(gb|tb)/i);
    return match ? match[0].toUpperCase() : null;
  };

  const storageA = extractStorage(`${itemA.title} ${itemA.era || ''}`);
  const storageB = extractStorage(`${itemB.title} ${itemB.era || ''}`);

  if (storageA && storageB && storageA !== storageB) {
    specNotes.push(`Storage difference: ${storageA} vs ${storageB}`);
  }

  // Check Year/Model specs
  const extractYear = (str: string) => {
    const match = str.match(/(19\d{2}|20\d{2})/);
    return match ? match[0] : null;
  };

  const yearA = extractYear(`${itemA.title} ${itemA.era || ''}`);
  const yearB = extractYear(`${itemB.title} ${itemB.era || ''}`);

  if (yearA && yearB && yearA !== yearB) {
    specNotes.push(`Model year difference: ${yearA} vs ${yearB}`);
  }

  // Check material warranty/packaging
  const fullDescA = `${itemA.description || ''}`.toLowerCase();
  const fullDescB = `${itemB.description || ''}`.toLowerCase();

  const hasWarrantyA = fullDescA.includes('warranty') || fullDescA.includes('receipt') || fullDescA.includes('sealed');
  const hasWarrantyB = fullDescB.includes('warranty') || fullDescB.includes('receipt') || fullDescB.includes('sealed');

  if (hasWarrantyA && !hasWarrantyB) {
    specNotes.push('Includes original warranty/paperwork/box');
  } else if (!hasWarrantyA && hasWarrantyB) {
    specNotes.push('Alternative includes warranty & box');
  }

  const hasQualityDifference = Math.abs(tierDiff) >= 1 || specNotes.length > 0;
  const priceDiff = itemA.priceETB - itemB.priceETB;

  let isPriceDifferenceJustified = false;
  let justificationReason = '';

  if (Math.abs(priceDiff) < 1000) {
    isPriceDifferenceJustified = true;
    justificationReason = 'Prices are virtually identical and reflect fair current market valuation.';
  } else if (priceDiff > 0) {
    // Item A is more expensive
    if (tierDiff > 0 || (hasWarrantyA && !hasWarrantyB) || specNotes.length > 0) {
      isPriceDifferenceJustified = true;
      justificationReason = `Premium is justified by superior condition (${itemA.condition} vs ${itemB.condition})${
        specNotes.length > 0 ? ` and specs: ${specNotes.join(', ')}` : ''
      }.`;
    } else {
      isPriceDifferenceJustified = false;
      justificationReason = `Same or lower quality/condition (${itemA.condition} vs ${itemB.condition}) despite higher asking price. Item may be overpriced relative to current market deals.`;
    }
  } else {
    // Item A is cheaper
    if (tierDiff < 0) {
      isPriceDifferenceJustified = true;
      justificationReason = `Lower price reflects condition/wear (${itemA.condition} vs ${itemB.condition}).`;
    } else {
      isPriceDifferenceJustified = true;
      justificationReason = 'Highly competitive bargain deal! Excellent value compared to similar listings on Agoza.';
    }
  }

  const summary = hasQualityDifference
    ? `Quality/Material Difference: ${itemA.condition} (${specNotes.join(', ') || 'Standard specs'}) vs ${itemB.condition}`
    : `Identical Quality & Condition: Both items are in ${itemA.condition} condition.`;

  return {
    hasQualityDifference,
    conditionA: itemA.condition,
    conditionB: itemB.condition,
    conditionTierDiff: tierDiff,
    specDifferenceNotes: specNotes,
    summary,
    isPriceDifferenceJustified,
    justificationReason,
  };
};

/**
 * Generates a full competitive market intelligence report for an item
 */
export const getMarketPriceIntelligence = (
  targetItem: {
    id?: string;
    title: string;
    category: string;
    priceETB: number;
    condition: string;
    description?: string;
    era?: string;
  },
  catalog: Collectible[]
): MarketIntelligenceReport => {
  const suggestions: MarketSuggestion[] = [];

  for (const item of catalog) {
    // Don't compare with self
    if (targetItem.id && item.id === targetItem.id) continue;

    const { isSimilar, isIdenticalModel, score } = calculateListingSimilarity(
      targetItem,
      item
    );

    if (isSimilar) {
      const priceDifferenceETB = item.priceETB - targetItem.priceETB;
      const percentageDifference = targetItem.priceETB > 0
        ? Math.round((priceDifferenceETB / targetItem.priceETB) * 100)
        : 0;

      const qualityAnalysis = compareItemQualityAndMaterials(targetItem, item);

      let competitivenessStatus: 'cheaper_alternative' | 'more_expensive_alternative' | 'identical_price' =
        'identical_price';
      if (priceDifferenceETB < 0) {
        competitivenessStatus = 'cheaper_alternative';
      } else if (priceDifferenceETB > 0) {
        competitivenessStatus = 'more_expensive_alternative';
      }

      let recommendationText = '';
      if (competitivenessStatus === 'cheaper_alternative') {
        if (!qualityAnalysis.hasQualityDifference) {
          recommendationText = `⚠️ Alternative available for ${Math.abs(priceDifferenceETB).toLocaleString()} Br less (${Math.abs(percentageDifference)}% lower). To be competitive, consider matching this price unless your item has unlisted accessories.`;
        } else {
          recommendationText = `A cheaper option exists (${item.priceETB.toLocaleString()} Br), but your higher price is justified by: ${qualityAnalysis.conditionA} vs ${qualityAnalysis.conditionB}.`;
        }
      } else if (competitivenessStatus === 'more_expensive_alternative') {
        recommendationText = `Your price is ${Math.abs(priceDifferenceETB).toLocaleString()} Br lower than this listing. Great competitive advantage!`;
      } else {
        recommendationText = 'Exact market price match. Highly competitive fair value.';
      }

      suggestions.push({
        item,
        priceDifferenceETB,
        percentageDifference,
        isIdenticalModel,
        similarityScore: score,
        qualityAnalysis,
        competitivenessStatus,
        recommendationText,
      });
    }
  }

  // Sort: Identical models first, then closest price differences
  suggestions.sort((a, b) => {
    if (a.isIdenticalModel && !b.isIdenticalModel) return -1;
    if (!a.isIdenticalModel && b.isIdenticalModel) return 1;
    return a.similarityScore - b.similarityScore;
  });

  if (suggestions.length === 0) {
    return {
      targetTitle: targetItem.title,
      targetPriceETB: targetItem.priceETB,
      targetCondition: targetItem.condition,
      similarCount: 0,
      averageMarketPrice: targetItem.priceETB,
      lowestPrice: targetItem.priceETB,
      highestPrice: targetItem.priceETB,
      pricePosition: 'fair-market',
      recommendedCompetitivePrice: targetItem.priceETB,
      hasPriceDiscrepancy: false,
      suggestions: [],
    };
  }

  const allPrices = [targetItem.priceETB, ...suggestions.map((s) => s.item.priceETB)];
  const lowestPrice = Math.min(...allPrices);
  const highestPrice = Math.max(...allPrices);
  const averageMarketPrice = Math.round(
    allPrices.reduce((sum, p) => sum + p, 0) / allPrices.length
  );

  let pricePosition: 'below-market' | 'fair-market' | 'above-market' = 'fair-market';
  if (targetItem.priceETB < averageMarketPrice * 0.9) {
    pricePosition = 'below-market';
  } else if (targetItem.priceETB > averageMarketPrice * 1.1) {
    pricePosition = 'above-market';
  }

  // Calculate recommended competitive price
  // If identical models exist at lower price without quality gap, suggest matching or slightly beating them
  const cheaperIdentical = suggestions.find(
    (s) => s.isIdenticalModel && s.priceDifferenceETB < 0 && !s.qualityAnalysis.hasQualityDifference
  );

  const recommendedCompetitivePrice = cheaperIdentical
    ? cheaperIdentical.item.priceETB
    : averageMarketPrice;

  const hasPriceDiscrepancy = Boolean(cheaperIdentical);
  const discrepancyAlert = cheaperIdentical
    ? `Market Alert: An identical model in the same condition is currently listed for ${cheaperIdentical.item.priceETB.toLocaleString()} Br (${Math.abs(cheaperIdentical.percentageDifference)}% lower).`
    : undefined;

  return {
    targetTitle: targetItem.title,
    targetPriceETB: targetItem.priceETB,
    targetCondition: targetItem.condition,
    similarCount: suggestions.length,
    averageMarketPrice,
    lowestPrice,
    highestPrice,
    pricePosition,
    recommendedCompetitivePrice,
    hasPriceDiscrepancy,
    discrepancyAlert,
    suggestions,
  };
};
