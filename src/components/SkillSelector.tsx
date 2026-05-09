import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

const SKILL_OPTIONS = [
  { label: 'Scales', value: 'scales' },
  { label: 'Arpeggios', value: 'arpeggios' },
  { label: 'Intonation', value: 'intonation' },
  { label: 'Shifting', value: 'shifting' },
  { label: 'Positions', value: 'positions' },
  { label: 'Bow Technique', value: 'bow technique' },
  { label: 'Double Stops', value: 'double stops' },
  { label: 'String Crossings', value: 'string crossings' },
  { label: 'Trills', value: 'trills' },
  { label: 'Thumb Position', value: 'thumb position' },
  { label: 'Tone Production', value: 'tone production' },
  { label: 'Vibrato', value: 'vibrato' },
  { label: 'Musical Expression', value: 'musical expression' },
  { label: 'Virtuoso Technique', value: 'virtuoso technique' },
  { label: 'Basic Technique', value: 'basic technique' },
]

const DIFFICULTY_OPTIONS = [
  { label: 'All Levels', value: '' },
  { label: 'Beginner', value: 'beginner' },
  { label: 'Intermediate', value: 'intermediate' },
  { label: 'Advanced', value: 'advanced' },
]

const TYPE_OPTIONS = [
  { label: 'All Types', value: '' },
  { label: 'Scales Books', value: 'scales' },
  { label: 'Etude Books', value: 'etudes' },
  { label: 'Both', value: 'both' },
]

interface Props {
  selectedSkills: string[]
  difficulty: string
  bookType: string
  onSkillToggle: (skill: string) => void
  onDifficultyChange: (d: string) => void
  onBookTypeChange: (t: string) => void
}

export default function SkillSelector({ selectedSkills, difficulty, bookType, onSkillToggle, onDifficultyChange, onBookTypeChange }: Props) {
  const [showAll, setShowAll] = useState(false)
  const visible = showAll ? SKILL_OPTIONS : SKILL_OPTIONS.slice(0, 8)

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Skills to Practice</h3>
        <div className="flex flex-wrap gap-2">
          {visible.map((s) => (
            <button key={s.value} onClick={() => onSkillToggle(s.value)} className={`skill-chip ${selectedSkills.includes(s.value) ? 'active' : 'inactive'}`}>
              {s.label}
            </button>
          ))}
        </div>
        <button onClick={() => setShowAll(!showAll)} className="flex items-center gap-1 mt-2 text-sm text-mahogany-600 hover:text-mahogany-800 transition-colors">
          {showAll ? <><ChevronUp className="w-4 h-4" /> Show less</> : <><ChevronDown className="w-4 h-4" /> Show all skills</>}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-semibold text-gray-500 uppercase tracking-wider block mb-2">Difficulty</label>
          <div className="flex flex-wrap gap-2">
            {DIFFICULTY_OPTIONS.map((d) => (
              <button key={d.value} onClick={() => onDifficultyChange(d.value)} className={`skill-chip text-xs ${difficulty === d.value ? 'active' : 'inactive'}`}>
                {d.label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-500 uppercase tracking-wider block mb-2">Book Type</label>
          <div className="flex flex-wrap gap-2">
            {TYPE_OPTIONS.map((t) => (
              <button key={t.value} onClick={() => onBookTypeChange(t.value)} className={`skill-chip text-xs ${bookType === t.value ? 'active' : 'inactive'}`}>
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
