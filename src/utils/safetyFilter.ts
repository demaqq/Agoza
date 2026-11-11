// Safety and Compliance Filter for Agoza
// Strictly prohibits harmful items, drugs, narcotics, illicit substances, weapons, and ammunition.

const PROHIBITED_KEYWORDS = [
  // Drugs & Narcotics
  'drug', 'drugs', 'narcotic', 'narcotics', 'cannabis', 'weed', 'marijuana', 
  'hashish', 'cocaine', 'heroin', 'meth', 'amphetamine', 'tramadol', 'khat illegal',
  'opioid', 'pills without prescription', 'shrooms', 'psychedelic', 'ecstasy',
  'ዕጸ-ፋርስ', 'አደንዛዥ', 'መድሃኒት ያለሀኪም',
  
  // Weapons & Harmful Items
  'weapon', 'weapons', 'gun', 'guns', 'pistol', 'rifle', 'firearm', 'firearms',
  'bullet', 'bullets', 'ammunition', 'ammo', 'explosive', 'bomb', 'grenade',
  'knife assault', 'poison', 'toxic chemical', 'cyanide', 'ብረት መሳሪያ', 'ጥይት', 'ቦምብ'
];

export interface SafetyCheckResult {
  isSafe: boolean;
  violationReason?: string;
  matchedKeyword?: string;
}

export const checkSafetyCompliance = (title: string, description: string): SafetyCheckResult => {
  const combinedText = `${title} ${description}`.toLowerCase();

  for (const keyword of PROHIBITED_KEYWORDS) {
    // Regex word boundary or direct inclusion for Ethiopic
    const regex = new RegExp(`(^|\\s|[^a-zA-Z0-9])${keyword}($|\\s|[^a-zA-Z0-9])`, 'i');
    if (regex.test(combinedText) || combinedText.includes(keyword.toLowerCase())) {
      return {
        isSafe: false,
        violationReason: `Safety Policy Violation: The term "${keyword}" references prohibited narcotics, weapons, or harmful substances strictly banned on Agoza.`,
        matchedKeyword: keyword,
      };
    }
  }

  return { isSafe: true };
};
