export interface StringNote {
  note: string
  frequency: number
  instrument: string
  stringName: string
}

export const STRING_TUNINGS: Record<string, StringNote[]> = {
  violin: [
    { note: 'G3', frequency: 196.0, instrument: 'violin', stringName: 'G' },
    { note: 'D4', frequency: 293.66, instrument: 'violin', stringName: 'D' },
    { note: 'A4', frequency: 440.0, instrument: 'violin', stringName: 'A' },
    { note: 'E5', frequency: 659.25, instrument: 'violin', stringName: 'E' },
  ],
  viola: [
    { note: 'C3', frequency: 130.81, instrument: 'viola', stringName: 'C' },
    { note: 'G3', frequency: 196.0, instrument: 'viola', stringName: 'G' },
    { note: 'D4', frequency: 293.66, instrument: 'viola', stringName: 'D' },
    { note: 'A4', frequency: 440.0, instrument: 'viola', stringName: 'A' },
  ],
  cello: [
    { note: 'C2', frequency: 65.41, instrument: 'cello', stringName: 'C' },
    { note: 'G2', frequency: 98.0, instrument: 'cello', stringName: 'G' },
    { note: 'D3', frequency: 146.83, instrument: 'cello', stringName: 'D' },
    { note: 'A3', frequency: 220.0, instrument: 'cello', stringName: 'A' },
  ],
  bass: [
    { note: 'E1', frequency: 41.2, instrument: 'bass', stringName: 'E' },
    { note: 'A1', frequency: 55.0, instrument: 'bass', stringName: 'A' },
    { note: 'D2', frequency: 73.42, instrument: 'bass', stringName: 'D' },
    { note: 'G2', frequency: 98.0, instrument: 'bass', stringName: 'G' },
  ],
}

export function detectPitch(buffer: Float32Array<ArrayBuffer>, sampleRate: number): number | null {
  const SIZE = buffer.length
  let bestOffset = -1
  let bestCorrelation = 0
  let rms = 0

  for (let i = 0; i < SIZE; i++) {
    rms += buffer[i] * buffer[i]
  }
  rms = Math.sqrt(rms / SIZE)

  if (rms < 0.01) return null

  let lastCorrelation = 1
  for (let offset = 0; offset < SIZE / 2; offset++) {
    let correlation = 0
    for (let i = 0; i < SIZE / 2; i++) {
      correlation += Math.abs(buffer[i] - buffer[i + offset])
    }
    correlation = 1 - correlation / (SIZE / 2)

    if (correlation > 0.9 && correlation > lastCorrelation) {
      bestCorrelation = correlation
      bestOffset = offset
    }
    lastCorrelation = correlation
  }

  if (bestCorrelation > 0.01 && bestOffset > 0) {
    return sampleRate / bestOffset
  }

  return null
}

export function getClosestNote(frequency: number, instrument: string): {
  note: StringNote
  cents: number
  inTune: boolean
} | null {
  const strings = STRING_TUNINGS[instrument]
  if (!strings) return null

  let closest: StringNote | null = null
  let minDist = Infinity

  const allNotes = getAllChromaticNotes(strings[0].frequency * 0.5, strings[strings.length - 1].frequency * 2)

  for (const n of allNotes) {
    const dist = Math.abs(n.frequency - frequency)
    if (dist < minDist) {
      minDist = dist
      closest = n
    }
  }

  if (!closest) return null

  const cents = 1200 * Math.log2(frequency / closest.frequency)
  return {
    note: closest,
    cents,
    inTune: Math.abs(cents) < 5,
  }
}

function getAllChromaticNotes(minFreq: number, maxFreq: number): StringNote[] {
  const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
  const notes: StringNote[] = []
  let freq = 16.35

  for (let octave = 0; octave <= 8; octave++) {
    for (let i = 0; i < 12; i++) {
      if (freq >= minFreq && freq <= maxFreq) {
        notes.push({
          note: `${noteNames[i]}${octave}`,
          frequency: freq,
          instrument: '',
          stringName: noteNames[i],
        })
      }
      freq *= Math.pow(2, 1 / 12)
    }
  }

  return notes
}

export function centsToColor(cents: number): string {
  const abs = Math.abs(cents)
  if (abs < 5) return '#348256'
  if (abs < 15) return '#e3bc25'
  if (abs < 30) return '#d97245'
  return '#c4522a'
}
