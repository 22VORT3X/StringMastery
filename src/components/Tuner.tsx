import { useState, useEffect, useRef, useCallback } from 'react'
import { Mic, MicOff, Music } from 'lucide-react'
import { detectPitch, getClosestNote, centsToColor, STRING_TUNINGS } from '../lib/tunerUtils'
import type { InstrumentId } from '../lib/constants'

interface TunerProps {
  instrument: InstrumentId
}

interface TunerState {
  frequency: number | null
  noteName: string
  cents: number
  inTune: boolean
  active: boolean
}

export default function Tuner({ instrument }: TunerProps) {
  const [listening, setListening] = useState(false)
  const [state, setState] = useState<TunerState>({
    frequency: null,
    noteName: '--',
    cents: 0,
    inTune: false,
    active: false,
  })
  const [permissionDenied, setPermissionDenied] = useState(false)
  const audioCtxRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const rafRef = useRef<number | null>(null)
  const bufferRef = useRef<Float32Array<ArrayBuffer> | null>(null)

  const stopListening = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop())
    if (audioCtxRef.current) audioCtxRef.current.close()
    audioCtxRef.current = null
    analyserRef.current = null
    streamRef.current = null
    rafRef.current = null
    setListening(false)
    setState(s => ({ ...s, active: false, noteName: '--', frequency: null, cents: 0 }))
  }, [])

  const startListening = useCallback(async () => {
    try {
      setPermissionDenied(false)
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream

      const ctx = new AudioContext()
      audioCtxRef.current = ctx

      const source = ctx.createMediaStreamSource(stream)
      const analyser = ctx.createAnalyser()
      analyser.fftSize = 2048
      analyserRef.current = analyser
      source.connect(analyser)

      bufferRef.current = new Float32Array(analyser.fftSize) as Float32Array<ArrayBuffer>
      setListening(true)

      const tick = () => {
        if (!analyserRef.current || !bufferRef.current) return
        analyserRef.current.getFloatTimeDomainData(bufferRef.current)
        const freq = detectPitch(bufferRef.current, ctx.sampleRate)

        if (freq) {
          const result = getClosestNote(freq, instrument)
          if (result) {
            setState({
              frequency: freq,
              noteName: result.note.note,
              cents: result.cents,
              inTune: result.inTune,
              active: true,
            })
          }
        } else {
          setState(s => ({ ...s, active: false }))
        }

        rafRef.current = requestAnimationFrame(tick)
      }
      rafRef.current = requestAnimationFrame(tick)
    } catch {
      setPermissionDenied(true)
    }
  }, [instrument])

  useEffect(() => {
    return () => stopListening()
  }, [stopListening])

  useEffect(() => {
    if (listening) stopListening()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [instrument])

  const strings = STRING_TUNINGS[instrument] || []
  const needleAngle = Math.max(-45, Math.min(45, state.cents * 0.9))
  const tuningColor = centsToColor(state.cents)

  return (
    <div className="card p-6">
      <div className="flex items-center gap-2 mb-5">
        <Music className="w-5 h-5 text-mahogany-500" />
        <h2 className="font-serif text-lg font-semibold text-gray-800">Chromatic Tuner</h2>
      </div>

      <div className="flex gap-2 justify-center mb-6">
        {strings.map((s) => (
          <div key={s.stringName} className="flex flex-col items-center gap-1 px-4 py-2 rounded-xl bg-cream-100 border border-cream-200">
            <span className="text-lg font-serif font-bold text-mahogany-700">{s.stringName}</span>
            <span className="text-xs text-gray-500 font-mono">{s.note}</span>
          </div>
        ))}
      </div>

      <div className="relative flex flex-col items-center mb-6">
        <svg width="260" height="140" viewBox="0 0 260 140" className="overflow-visible">
          <path d="M 30 130 A 100 100 0 0 1 230 130" fill="none" stroke="#f2e6d0" strokeWidth="12" strokeLinecap="round" />
          <path d="M 105 48 A 100 100 0 0 1 155 48" fill="none" stroke="#afd8be" strokeWidth="12" strokeLinecap="round" opacity="0.6" />
          {[-45, -30, -15, 0, 15, 30, 45].map((angle) => {
            const rad = ((angle - 90) * Math.PI) / 180
            const r1 = 88, r2 = 100
            const x1 = 130 + r1 * Math.cos(rad), y1 = 130 + r1 * Math.sin(rad)
            const x2 = 130 + r2 * Math.cos(rad), y2 = 130 + r2 * Math.sin(rad)
            return <line key={angle} x1={x1} y1={y1} x2={x2} y2={y2} stroke={angle === 0 ? '#348256' : '#d1c9bd'} strokeWidth={angle === 0 ? 3 : 1.5} />
          })}
          <g transform={`translate(130, 130) rotate(${state.active ? needleAngle : 0})`}>
            <line x1="0" y1="0" x2="0" y2="-90" stroke={state.active ? tuningColor : '#d1c9bd'} strokeWidth="3" strokeLinecap="round" className="tuner-needle" />
            <circle cx="0" cy="0" r="6" fill={state.active ? tuningColor : '#d1c9bd'} />
          </g>
          <text x="22" y="138" fontSize="11" fill="#9ca3af" textAnchor="middle">-50</text>
          <text x="238" y="138" fontSize="11" fill="#9ca3af" textAnchor="middle">+50</text>
          <text x="130" y="28" fontSize="11" fill="#9ca3af" textAnchor="middle">0</text>
        </svg>

        <div className="absolute bottom-0 flex flex-col items-center">
          <div className="text-5xl font-serif font-bold tracking-tight transition-colors duration-150" style={{ color: state.active ? tuningColor : '#d1c9bd' }}>
            {state.noteName}
          </div>
          {state.active && (
            <div className="text-sm font-medium mt-1" style={{ color: tuningColor }}>
              {Math.abs(state.cents) < 2 ? 'In Tune' : `${state.cents > 0 ? '+' : ''}${Math.round(state.cents)} cents`}
            </div>
          )}
        </div>
      </div>

      {state.frequency && (
        <div className="text-center text-sm text-gray-400 font-mono mb-4">{state.frequency.toFixed(1)} Hz</div>
      )}

      {permissionDenied && (
        <p className="text-center text-sm text-mahogany-600 mb-3">Microphone access denied. Enable it in your browser settings.</p>
      )}

      <button
        onClick={listening ? stopListening : startListening}
        className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-all duration-200 ${
          listening ? 'bg-mahogany-600 text-white hover:bg-mahogany-700' : 'bg-cream-100 text-gray-700 border border-cream-200 hover:bg-cream-200'
        }`}
      >
        {listening ? <><MicOff className="w-4 h-4" /> Stop Tuning</> : <><Mic className="w-4 h-4" /> Start Tuning</>}
      </button>

      {listening && (
        <div className="flex items-center justify-center gap-2 mt-3">
          <div className="w-2 h-2 rounded-full bg-mahogany-500 animate-pulse" />
          <span className="text-xs text-gray-500">Listening for pitch…</span>
        </div>
      )}
    </div>
  )
}
