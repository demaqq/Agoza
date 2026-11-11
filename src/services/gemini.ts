/**
 * Agoza AI Service — lightweight Gemini REST client.
 *
 * Uses fetch() to call the Gemini API directly, avoiding the heavy
 * @google/genai SDK (~12 MB). All AI features work the same way.
 *
 * The API key is injected at build time via VITE_GEMINI_API_KEY and
 * is NEVER committed to source control.
 */

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;
const BASE_URL = 'https://generativelanguage.googleapis.com/v1beta';

export interface GeminiChatOptions {
  model?: string;
  systemPrompt?: string;
  temperature?: number;
  maxOutputTokens?: number;
}

export interface GeminiResult<T = string> {
  success: boolean;
  data?: T;
  error?: string;
  cached?: boolean;
}

const FALLBACK_TTL_MS = 5 * 60 * 1000;
const cache = new Map<string, { value: string; expires: number }>();

function readCache<T>(key: string): T | undefined {
  const hit = cache.get(key);
  if (!hit || hit.expires < Date.now()) {
    if (hit) cache.delete(key);
    return undefined;
  }
  return JSON.parse(hit.value) as T;
}

function writeCache<T>(key: string, value: T, ttlMs = FALLBACK_TTL_MS): void {
  cache.set(key, { value: JSON.stringify(value), expires: Date.now() + ttlMs });
}

function cacheKey(prompt: string, opts: GeminiChatOptions): string {
  return `gemini:${opts.model || 'default'}:${opts.temperature ?? 0.7}:${prompt}`;
}

async function geminiRequest(
  model: string,
  contents: any[],
  opts: GeminiChatOptions
): Promise<string> {
  if (!API_KEY) throw new Error('VITE_GEMINI_API_KEY not set');

  const url = `${BASE_URL}/models/${model}:generateContent?key=${API_KEY}`;
  const body: any = {
    contents,
    generationConfig: {
      temperature: opts.temperature ?? 0.7,
      maxOutputTokens: opts.maxOutputTokens ?? 1024,
    },
  };
  if (opts.systemPrompt) {
    body.systemInstruction = { parts: [{ text: opts.systemPrompt }] };
  }

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Gemini API error (${res.status}): ${errText}`);
  }

  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  return text;
}

/**
 * Low-level chat completion. Returns text on success.
 */
export async function geminiChat(
  prompt: string,
  opts: GeminiChatOptions = {}
): Promise<GeminiResult<string>> {
  if (!API_KEY) {
    return { success: false, error: 'AI service not configured (missing API key).' };
  }

  const key = cacheKey(prompt, opts);
  const cached = readCache<string>(key);
  if (cached) return { success: true, data: cached, cached: true };

  try {
    const text = await geminiRequest(
      opts.model || 'gemini-2.5-flash',
      [{ role: 'user', parts: [{ text: prompt }] }],
      opts
    );
    if (!text) {
      return { success: false, error: 'Empty response from Gemini.' };
    }
    writeCache(key, text);
    return { success: true, data: text };
  } catch (err: any) {
    console.error('[gemini] chat error:', err);
    return { success: false, error: err?.message || 'Gemini request failed.' };
  }
}

/**
 * Structured JSON output helper — asks Gemini for a JSON object and parses it.
 */
export async function geminiJson<T>(
  prompt: string,
  opts: GeminiChatOptions = {}
): Promise<GeminiResult<T>> {
  const fullPrompt = `${prompt}\n\nRespond with a single valid JSON object only. No markdown, no prose outside the JSON.`;
  const res = await geminiChat(fullPrompt, {
    ...opts,
    temperature: opts.temperature ?? 0.2,
    maxOutputTokens: opts.maxOutputTokens ?? 2048,
  });
  if (!res.success || !res.data) return { success: false, error: res.error };

  try {
    const cleaned = res.data
      .replace(/^```(?:json)?/i, '')
      .replace(/```$/i, '')
      .trim();
    return { success: true, data: JSON.parse(cleaned) as T };
  } catch (err: any) {
    return { success: false, error: `Failed to parse AI response as JSON: ${err?.message || err}` };
  }
}

export default { geminiChat, geminiJson };
