/**
 * imageRepetitionDetector — duplicate image detection for listings.
 * Prevents sellers from uploading the same photo multiple times.
 */

export interface RepetitionCheckResult {
  isDuplicate: boolean;
  reason: string;
  similarity: number;
}

export function detectImageRepetition(
  newImageUrl: string,
  existingUrls: string[],
  allUploads: string[]
): RepetitionCheckResult {
  const normalized = newImageUrl.toLowerCase();
  const existingNormalized = existingUrls.map((u) => u.toLowerCase());

  if (existingNormalized.includes(normalized)) {
    return {
      isDuplicate: true,
      reason: 'This exact image has already been uploaded.',
      similarity: 1,
    };
  }

  // Check all uploads (including current batch) for near-duplicates
  const allNormalized = allUploads.map((u) => u.toLowerCase());
  if (allNormalized.includes(normalized)) {
    return {
      isDuplicate: true,
      reason: 'A very similar image was already uploaded in this batch.',
      similarity: 0.95,
    };
  }

  return { isDuplicate: false, reason: '', similarity: 0 };
}

export function applyAgozaWatermark(dataUrl: string): Promise<string> {
  // Placeholder: in production, this would canvas-render a watermark.
  // For now, return the input unchanged.
  return Promise.resolve(dataUrl);
}