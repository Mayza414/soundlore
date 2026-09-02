export const genreGradients: Record<string, string> = {
  'MPB': 'from-emerald-950 via-emerald-900/60 to-emerald-700/20',
  'Rock': 'from-blue-950 via-slate-900/60 to-blue-700/20',
  'Pop': 'from-purple-950 via-fuchsia-900/50 to-purple-700/20',
  'Samba': 'from-rose-950 via-red-900/50 to-rose-700/20',
  'Jazz': 'from-amber-950 via-orange-900/50 to-amber-700/20',
  'Eletrônica': 'from-cyan-950 via-slate-900/60 to-cyan-700/20',
};

export const genreAccent: Record<string, string> = {
  'MPB': '#10b981',
  'Rock': '#3b82f6',
  'Pop': '#c084fc',
  'Samba': '#fb7185',
  'Jazz': '#f59e0b',
  'Eletrônica': '#22d3ee',
};

export const genreTagline: Record<string, string> = {
  'MPB': 'Raízes Brasileiras',
  'Rock': 'Distorção e Atitude',
  'Pop': 'Hinos Contemporâneos',
  'Samba': 'Raízes do Samba',
  'Jazz': 'Improviso e Sofisticação',
  'Eletrônica': 'Síntese Digital',
};

export const genreDescription: Record<string, string> = {
  'MPB': 'A síntese poética e musical do Brasil. Um catálogo de compositores que transformaram influências populares em erudição.',
  'Rock': 'Guitarras, energia e rebeldia. Da era de ouro às vertentes alternativas que redefiniram o gênero.',
  'Pop': 'Melodias que cruzam gerações. Produção impecável a serviço de hinos que ficam na memória.',
  'Samba': 'A batida original que ecoa pelos morros e vielas. Mergulhe na essência pura e sem filtros dos mestres pioneiros.',
  'Jazz': 'Improviso, sofisticação harmônica e a liberdade de reinventar a cada nota.',
  'Eletrônica': 'Paisagens sonoras sintéticas. Onde a tecnologia encontra a emoção.',
};

const fallbackGradients = [
  'from-emerald-950 via-emerald-900/60 to-emerald-700/20',
  'from-blue-950 via-slate-900/60 to-blue-700/20',
  'from-purple-950 via-fuchsia-900/50 to-purple-700/20',
  'from-rose-950 via-red-900/50 to-rose-700/20',
];

export function getGenreGradient(name: string, index: number): string {
  return genreGradients[name] || fallbackGradients[index % fallbackGradients.length];
}

export function getGenreAccent(name: string): string {
  return genreAccent[name] || '#c0c1ff';
}

export function getGenreTagline(name: string): string {
  return genreTagline[name] || `Catálogo ${name}`;
}

export function getGenreDescription(name: string): string {
  return genreDescription[name] || `Explore o universo sonoro de ${name} e descubra as histórias por trás de cada faixa.`;
}