export interface EthiopianCity {
  id: string;
  name: string;
  amharic: string;
  region: string;
  popular?: boolean;
}

export const ETHIOPIAN_CITIES: EthiopianCity[] = [
  { id: 'all', name: 'All Ethiopia', amharic: 'መላው ኢትዮጵያ', region: 'National', popular: true },
  { id: 'Addis Ababa', name: 'Addis Ababa', amharic: 'አዲስ አበባ', region: 'Charter City', popular: true },
  { id: 'Dire Dawa', name: 'Dire Dawa', amharic: 'ድሬዳዋ', region: 'Charter City', popular: true },
  { id: 'Bahir Dar', name: 'Bahir Dar', amharic: 'ባሕር ዳር', region: 'Amhara', popular: true },
  { id: 'Hawassa', name: 'Hawassa', amharic: 'ሐዋሳ', region: 'Sidama', popular: true },
  { id: 'Mekelle', name: 'Mekelle', amharic: 'መቀሌ', region: 'Tigray', popular: true },
  { id: 'Adama', name: 'Adama (Nazret)', amharic: 'አዳማ', region: 'Oromia', popular: true },
  { id: 'Gondar', name: 'Gondar', amharic: 'ጎንደር', region: 'Amhara', popular: true },
  { id: 'Jimma', name: 'Jimma', amharic: 'ጅማ', region: 'Oromia', popular: true },
  { id: 'Bishoftu', name: 'Bishoftu (Debre Zeyit)', amharic: 'ቢሾፍቱ', region: 'Oromia', popular: true },
  { id: 'Harar', name: 'Harar', amharic: 'ሐረር', region: 'Harari', popular: true },
  { id: 'Dessie', name: 'Dessie', amharic: 'ደሴ', region: 'Amhara' },
  { id: 'Jigjiga', name: 'Jigjiga', amharic: 'ጅግጅጋ', region: 'Somali' },
  { id: 'Arba Minch', name: 'Arba Minch', amharic: 'አርባ ምንጭ', region: 'South Ethiopia' },
  { id: 'Shashemene', name: 'Shashemene', amharic: 'ሻሸመኔ', region: 'Oromia' },
  { id: 'Debre Birhan', name: 'Debre Birhan', amharic: 'ደብረ ብርሃን', region: 'Amhara' },
  { id: 'Dilla', name: 'Dilla', amharic: 'ዲላ', region: 'Gedeo' },
  { id: 'Nekemte', name: 'Nekemte', amharic: 'ነቀምቴ', region: 'Oromia' },
  { id: 'Asosa', name: 'Asosa', amharic: 'አሶሳ', region: 'Benishangul-Gumuz' },
  { id: 'Gambela', name: 'Gambela', amharic: 'ጋምቤላ', region: 'Gambela' },
  { id: 'Semera', name: 'Semera', amharic: 'ሰመራ', region: 'Afar' },
];
