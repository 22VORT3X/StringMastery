export const INSTRUMENTS = [
  { id: 'violin', label: 'Violin', range: 'G3 – E5' },
  { id: 'viola', label: 'Viola', range: 'C3 – A4' },
  { id: 'cello', label: 'Cello', range: 'C2 – A3' },
  { id: 'bass', label: 'Bass', range: 'E1 – G2' },
] as const;

export type InstrumentId = 'violin' | 'viola' | 'cello' | 'bass';
