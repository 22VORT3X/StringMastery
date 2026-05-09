import { BookOpen, Music, Tag } from 'lucide-react'
import type { Book } from '../lib/supabase'

const TYPE_LABELS: Record<string, string> = {
  scales: 'Scales',
  etudes: 'Etudes',
  both: 'Scales & Etudes',
}

const INSTRUMENT_COLORS: Record<string, string> = {
  violin: 'bg-mahogany-100 text-mahogany-700 border-mahogany-200',
  viola: 'bg-gold-100 text-gold-700 border-gold-200',
  cello: 'bg-forest-100 text-forest-700 border-forest-200',
  bass: 'bg-blue-50 text-blue-700 border-blue-200',
}

export default function BookCard({ book }: { book: Book }) {
  return (
    <div className="card p-5 hover:shadow-md transition-all duration-200 animate-slide-up group">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-serif font-semibold text-gray-900 leading-snug group-hover:text-mahogany-700 transition-colors">
            {book.title}
            {book.volume && <span className="ml-2 text-sm font-sans font-normal text-gray-400">{book.volume}</span>}
          </h3>
          <p className="text-sm text-gray-500 mt-0.5">{book.author}</p>
        </div>
        <span className={`difficulty-badge ${book.difficulty} shrink-0`}>
          {book.difficulty === 'all' ? 'All Levels' : book.difficulty}
        </span>
      </div>

      {book.description && <p className="text-sm text-gray-600 leading-relaxed mb-4">{book.description}</p>}

      {book.skills && book.skills.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {book.skills.slice(0, 6).map((skill) => (
            <span key={skill} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-cream-100 text-gray-600 text-xs border border-cream-200">
              <Tag className="w-2.5 h-2.5" />
              {skill}
            </span>
          ))}
          {book.skills.length > 6 && (
            <span className="px-2 py-0.5 rounded-full bg-cream-100 text-gray-400 text-xs border border-cream-200">+{book.skills.length - 6} more</span>
          )}
        </div>
      )}

      <div className="flex items-center justify-between pt-3 border-t border-cream-100">
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${INSTRUMENT_COLORS[book.instrument]}`}>
            {book.instrument.charAt(0).toUpperCase() + book.instrument.slice(1)}
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-50 text-gray-600 border border-gray-100">
            <BookOpen className="w-3 h-3" />
            {TYPE_LABELS[book.book_type]}
          </span>
        </div>
        {book.publisher && (
          <span className="text-xs text-gray-400 flex items-center gap-1">
            <Music className="w-3 h-3" />
            {book.publisher}
          </span>
        )}
      </div>
    </div>
  )
}
