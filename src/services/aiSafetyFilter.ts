/**
 * AI-powered listing safety screen.
 *
 * Runs an additional Gemini pass on new listings to catch prohibited
 * items, scam language, and regulated goods that the local keyword
 * filter might miss. The local filter always runs first (fast path);
 * the AI pass is a best-effort secondary gate that never blocks a
 * listing if the AI service is unavailable.
 */

import { geminiJson } from './gemini';

export interface AiSafetyVerdict {
  safe: boolean;
  confidence: number;
  flags: string[];
  reason?: string;
}

const LOCAL_FALLBACK: AiSafetyVerdict = {
  safe: true,
  confidence: 0.5,
  flags: [],
  reason: 'AI screen skipped (service unavailable). Local keyword filter governs.',
};

export async function aiScreenListing(
  title: string,
  description: string
): Promise<AiSafetyVerdict> {
  const prompt = `You are a content safety moderator for an Ethiopian peer-to-peer marketplace (Agoza).
Review this listing title and description and decide whether it should be allowed.

Title: ${title}
Description: ${description}

Return a JSON object with:
- "safe": boolean (true if the listing is allowed)
- "confidence": number 0-1
- "flags": string[] (short tags for any concerns, e.g. "prohibited", "scam-language", "regulated", "spam")
- "reason": string (brief explanation if not safe)

Prohibited categories: drugs/narcotics, weapons/ammunition, explosives, stolen goods, counterfeit currency, human trafficking, hate speech, explicit adult content, items requiring a license the seller cannot hold.`;

  const res = await geminiJson<AiSafetyVerdict>(prompt, {
    temperature: 0.1,
    maxOutputTokens: 512,
  });

  if (!res.success || !res.data) {
    return LOCAL_FALLBACK;
  }

  return {
    safe: Boolean(res.data.safe),
    confidence: Number(res.data.confidence) || 0.5,
    flags: Array.isArray(res.data.flags) ? res.data.flags : [],
    reason: res.data.reason,
  };
}

export default aiScreenListing;