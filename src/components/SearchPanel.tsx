import { useState, useEffect } from 'react'
import { Search, X, BookOpen, Loader2 } from 'lucide-react'
import { supabase } from '../lib/supabase'
import type { Book } from '../lib/supabase'
import type { InstrumentId } from '../lib/constants'
import InstrumentSelector from './InstrumentSelector'
import SkillSelector from './SkillSelector'
import BookCard from './BookCard'

interface Props {
  defaultInstrument?: InstrumentId | null
}

export default function SearchPanel({ defaultInstrument }: Props) {
  const [instrument, setInstrument] = useState<InstrumentId | null>(defaultInstrument ?? null)
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [difficulty, setDifficulty] = useState('')
  const [bookType, setBookType] = useState('')
  const [searchText, setSearchText] = useState('')
  const [results, setResults] = useState<Book[]>([])
  const [loading, setLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [totalCount, setTotalCount] = useState(0)

  const handleSkillToggle = (skill: string) => {
    setSelectedSkills((prev) => prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill])
  }

  const handleSearch = async () => {
    if (!instrument && selectedSkills.length === 0 && !searchText) return
    setLoading(true)
    setHasSearched(true)

    try {
      let query = supabase.from('books').select('*', { count: 'exact' })

      if (instrument) query = query.eq('instrument', instrument)
      if (difficulty) query = query.eq('difficulty', difficulty)
      if (bookType) query = query.eq('book_type', bookType)
      if (searchText.trim()) {
        query = query.or(`title.ilike.%${searchText}%,author.ilike.%${searchText}%,description.ilike.%${searchText}%`)
      }
      if (selectedSkills.length > 0) query = query.overlaps('skills', selectedSkills)

      query = query.order('difficulty', { ascending: true }).order('author', { ascending: true })

      const { data, error, count } = await query
      if (error) throw error
      setResults(data as Book[])
      setTotalCount(count ?? 0)
    } catch (err) {
      console.error('Search error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleClear = () => {
    setInstrument(null)
    setSelectedSkills([])
    setDifficulty('')
    setBookType('')
    setSearchText('')
    setResults([])
    setHasSearched(false)
  }

  useEffect(() => {
    if (hasSearched) handleSearch()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [instrument, selectedSkills, difficulty, bookType])

  const hasFilters = instrument || selectedSkills.length > 0 || difficulty || bookType || searchText

  return (
    <div className="space-y-6">
      <div className="card p-6 space-y-6">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Search by title, author, or description…"
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-cream-200 bg-cream-50 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-mahogany-300 focus:border-mahogany-300 transition-all"
          />
          {searchText && (
            <button onClick={() => setSearchText('')} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <InstrumentSelector selected={instrument} onChange={setInstrument} />

        <SkillSelector
          selectedSkills={selectedSkills}
          difficulty={difficulty}
          bookType={bookType}
          onSkillToggle={handleSkillToggle}
          onDifficultyChange={setDifficulty}
          onBookTypeChange={setBookType}
        />

        <div className="flex gap-3 pt-1">
          <button onClick={handleSearch} className="btn-primary flex-1 flex items-center justify-center gap-2">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            Search Library
          </button>
          {hasFilters && (
            <button onClick={handleClear} className="btn-secondary flex items-center gap-2">
              <X className="w-4 h-4" /> Clear
            </button>
          )}
        </div>
      </div>

      {hasSearched && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-mahogany-500" />
              <span className="font-semibold text-gray-700">
                {loading ? 'Searching…' : `${totalCount} book${totalCount !== 1 ? 's' : ''} found`}
              </span>
            </div>
            {selectedSkills.length > 0 && (
              <div className="flex items-center gap-1 flex-wrap justify-end">
                {selectedSkills.map((s) => (
                  <span key={s} className="text-xs px-2 py-0.5 rounded-full bg-mahogany-100 text-mahogany-700">{s}</span>
                ))}
              </div>
            )}
          </div>

          {loading ? (
            <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 text-mahogany-400 animate-spin" /></div>
          ) : results.length === 0 ? (
            <div className="card p-10 text-center">
              <BookOpen className="w-12 h-12 text-cream-200 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">No books match your search.</p>
              <p className="text-sm text-gray-400 mt-1">Try adjusting your filters or selecting different skills.</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {results.map((book) => <BookCard key={book.id} book={book} />)}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
