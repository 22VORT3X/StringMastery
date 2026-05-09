import { ExternalLink, BookOpen, Music, Tag } from 'lucide-react'
import type { Book } from '../lib/supabase'

const TYPE_LABELS: Record<string, string> = {
  scales: 'Scales',
  etudes: 'Etudes',
  both: 'Scales & Etudes',
}

const DIFFICULTY_COLORS: Record<string, { bg: string; text: string }> = {
  beginner: { bg: '#d8ede1', text: '#266843' },
  intermediate: { bg: '#faf2c7', text: '#a37e12' },
  advanced: { bg: '#fae3d8', text: '#a63e1f' },
  all: { bg: '#f3f4f6', text: '#6b7280' },
}

const INSTRUMENT_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  violin: { bg: '#fae3d8', text: '#a63e1f', border: '#f4c4a8' },
  viola: { bg: '#faf2c7', text: '#a37e12', border: '#f5e48f' },
  cello: { bg: '#d8ede1', text: '#266843', border: '#afd8be' },
  bass: { bg: '#eff6ff', text: '#1d4ed8', border: '#bfdbfe' },
}

export default function BookCard({ book }: { book: Book }) {
  const diffColor = DIFFICULTY_COLORS[book.difficulty] ?? DIFFICULTY_COLORS.all
  const instColor = INSTRUMENT_COLORS[book.instrument] ?? INSTRUMENT_COLORS.violin

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-cream-200 p-5 mb-3">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1">
          <p className="font-semibold text-gray-900 text-base leading-snug font-serif">
            {book.title}
            {book.volume ? (
              <span className="text-sm font-normal text-gray-400"> {book.volume}</span>
            ) : null}
          </p>
          <p className="text-sm text-gray-500 mt-0.5">{book.author}</p>
        </div>
        <div
          style={{ backgroundColor: diffColor.bg }}
          className="rounded-full px-2.5 py-1 shrink-0"
        >
          <span style={{ color: diffColor.text }} className="text-xs font-semibold uppercase tracking-wide">
            {book.difficulty === 'all' ? 'All Levels' : book.difficulty}
          </span>
        </div>
      </div>

      {/* Description */}
      {book.description ? (
        <p className="text-sm text-gray-600 leading-relaxed mb-4">{book.description}</p>
      ) : null}

      {/* Skills */}
      {book.skills && book.skills.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {book.skills.slice(0, 6).map((skill) => (
            <div
              key={skill}
              className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-cream-100 border border-cream-200"
            >
              <Tag size={10} color="#9ca3af" />
              <span className="text-xs text-gray-600">{skill}</span>
            </div>
          ))}
          {book.skills.length > 6 && (
            <div className="px-2 py-0.5 rounded-full bg-cream-100 border border-cream-200">
              <span className="text-xs text-gray-400">+{book.skills.length - 6} more</span>
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-cream-100">
        <div className="flex items-center gap-2 flex-wrap">
          <div
            style={{ backgroundColor: instColor.bg, borderColor: instColor.border }}
            className="rounded-full px-2.5 py-1 border"
          >
            <span style={{ color: instColor.text }} className="text-xs font-medium">
              {book.instrument.charAt(0).toUpperCase() + book.instrument.slice(1)}
            </span>
          </div>
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-gray-50 border border-gray-100">
            <BookOpen size={12} color="#6b7280" />
            <span className="text-xs font-medium text-gray-600">{TYPE_LABELS[book.book_type]}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {book.publisher ? (
            <div className="flex items-center gap-1">
              <Music size={12} color="#9ca3af" />
              <span className="text-xs text-gray-400">{book.publisher}</span>
            </div>
          ) : null}
          {book.preview_url ? (
            <a
              href={book.preview_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-mahogany-50 border border-mahogany-200 hover:bg-mahogany-100 transition-colors"
            >
              <ExternalLink size={11} color="#a63e1f" />
              <span className="text-xs font-medium text-mahogany-700">Preview</span>
            </a>
          ) : null}
        </div>
      </div>
    </div>
  )
}
