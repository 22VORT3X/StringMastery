import { INSTRUMENTS } from '../lib/constants'
import type { InstrumentId } from '../lib/constants'

interface Props {
  selected: InstrumentId | null
  onChange: (id: InstrumentId) => void
}

export default function InstrumentSelector({ selected, onChange }: Props) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Select Your Instrument</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {INSTRUMENTS.map((inst) => (
          <button
            key={inst.id}
            onClick={() => onChange(inst.id as InstrumentId)}
            className={`instrument-btn ${selected === inst.id ? 'active' : 'inactive'}`}
          >
            <InstrumentSVG id={inst.id} active={selected === inst.id} />
            <span className="font-semibold text-sm">{inst.label}</span>
            <span className="text-xs opacity-60">{inst.range}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

function InstrumentSVG({ id, active }: { id: string; active: boolean }) {
  const color = active ? '#a63e1f' : '#9ca3af'

  if (id === 'violin' || id === 'viola') {
    return (
      <svg width="40" height="48" viewBox="0 0 40 48" fill="none">
        <ellipse cx="20" cy="34" rx="9" ry="11" fill={color} opacity="0.9" />
        <ellipse cx="20" cy="22" rx="7" ry="9" fill={color} opacity="0.9" />
        <rect x="14" y="27" width="12" height="7" fill={color} opacity="0.9" />
        <ellipse cx="14" cy="30.5" rx="3" ry="4" fill="#fff" opacity="0.3" />
        <ellipse cx="26" cy="30.5" rx="3" ry="4" fill="#fff" opacity="0.3" />
        <rect x="18" y="8" width="4" height="14" rx="2" fill={color} opacity="0.7" />
        <ellipse cx="20" cy="7" rx="3" ry="3" fill={color} opacity="0.8" />
        <path d="M16 30 Q15 33 16 36" stroke="#fff" strokeWidth="1.5" opacity="0.5" strokeLinecap="round" />
        <path d="M24 30 Q25 33 24 36" stroke="#fff" strokeWidth="1.5" opacity="0.5" strokeLinecap="round" />
        {[18.5, 19.5, 20.5, 21.5].map((x, i) => (
          <line key={i} x1={x} y1="10" x2={x} y2="44" stroke="#fff" strokeWidth="0.5" opacity="0.4" />
        ))}
      </svg>
    )
  }

  if (id === 'cello') {
    return (
      <svg width="40" height="48" viewBox="0 0 40 48" fill="none">
        <ellipse cx="20" cy="36" rx="10" ry="10" fill={color} opacity="0.9" />
        <ellipse cx="20" cy="20" rx="8" ry="9" fill={color} opacity="0.9" />
        <rect x="13" y="25" width="14" height="8" fill={color} opacity="0.9" />
        <ellipse cx="13" cy="29" rx="3.5" ry="4.5" fill="#fff" opacity="0.3" />
        <ellipse cx="27" cy="29" rx="3.5" ry="4.5" fill="#fff" opacity="0.3" />
        <rect x="18" y="6" width="4" height="13" rx="2" fill={color} opacity="0.7" />
        <ellipse cx="20" cy="6" rx="4" ry="3" fill={color} opacity="0.8" />
        <path d="M15 31 Q14 34 15 37" stroke="#fff" strokeWidth="1.5" opacity="0.5" strokeLinecap="round" />
        <path d="M25 31 Q26 34 25 37" stroke="#fff" strokeWidth="1.5" opacity="0.5" strokeLinecap="round" />
        {[18.5, 19.5, 20.5, 21.5].map((x, i) => (
          <line key={i} x1={x} y1="9" x2={x} y2="46" stroke="#fff" strokeWidth="0.5" opacity="0.4" />
        ))}
      </svg>
    )
  }

  return (
    <svg width="40" height="48" viewBox="0 0 40 48" fill="none">
      <ellipse cx="20" cy="37" rx="11" ry="9" fill={color} opacity="0.9" />
      <ellipse cx="20" cy="20" rx="9" ry="10" fill={color} opacity="0.9" />
      <rect x="12" y="26" width="16" height="9" fill={color} opacity="0.9" />
      <ellipse cx="12" cy="30" rx="4" ry="5" fill="#fff" opacity="0.3" />
      <ellipse cx="28" cy="30" rx="4" ry="5" fill="#fff" opacity="0.3" />
      <rect x="18" y="4" width="4" height="15" rx="2" fill={color} opacity="0.7" />
      <ellipse cx="20" cy="4" rx="4" ry="3.5" fill={color} opacity="0.8" />
      <path d="M15 32 Q14 35 15 38" stroke="#fff" strokeWidth="1.5" opacity="0.5" strokeLinecap="round" />
      <path d="M25 32 Q26 35 25 38" stroke="#fff" strokeWidth="1.5" opacity="0.5" strokeLinecap="round" />
      {[18, 19.3, 20.6, 22].map((x, i) => (
        <line key={i} x1={x} y1="7" x2={x} y2="46" stroke="#fff" strokeWidth="0.6" opacity="0.4" />
      ))}
    </svg>
  )
}
