import { useState } from 'react'
import { Music2, BookOpen, Home, Search } from 'lucide-react'
import Tuner from './components/Tuner'
import SearchPanel from './components/SearchPanel'
import InstrumentSelector from './components/InstrumentSelector'
import type { InstrumentId } from './lib/constants'

type Page = 'home' | 'library'

export default function App() {
  const [page, setPage] = useState<Page>('home')
  const [instrument, setInstrument] = useState<InstrumentId | null>(null)

  return (
    <div className="min-h-dvh bg-cream-50 flex flex-col max-w-2xl mx-auto relative">
      <header className="sticky top-0 z-10 bg-white/90 backdrop-blur-sm border-b border-cream-200 shadow-sm">
        <div className="px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-mahogany-600 flex items-center justify-center shadow-sm">
              <Music2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-serif font-bold text-gray-900 text-lg leading-none">StringLibrary</h1>
              <p className="text-xs text-gray-400 leading-none mt-0.5">Scale &amp; Etude Resource</p>
            </div>
          </div>
          <div className="text-xs text-gray-400 font-medium bg-cream-100 px-2.5 py-1 rounded-full border border-cream-200">
            59 Books
          </div>
        </div>
      </header>

      <main className="flex-1 px-4 py-6 space-y-6 pb-28">
        {page === 'home' ? (
          <HomePage instrument={instrument} onInstrumentChange={setInstrument} onGoToLibrary={() => setPage('library')} />
        ) : (
          <LibraryPage instrument={instrument} />
        )}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 max-w-2xl mx-auto bg-white border-t border-cream-200 shadow-lg">
        <div className="flex">
          <NavTab active={page === 'home'} onClick={() => setPage('home')} icon={<Home className="w-5 h-5" />} label="Home" />
          <NavTab active={page === 'library'} onClick={() => setPage('library')} icon={<BookOpen className="w-5 h-5" />} label="Library" />
        </div>
      </nav>
    </div>
  )
}

function NavTab({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 relative flex flex-col items-center justify-center gap-1 py-3 transition-colors ${
        active ? 'text-mahogany-600' : 'text-gray-400 hover:text-gray-600'
      }`}
    >
      {active && <div className="absolute top-0 w-8 h-0.5 bg-mahogany-600 rounded-full" />}
      {icon}
      <span className="text-xs font-medium">{label}</span>
    </button>
  )
}

function HomePage({
  instrument,
  onInstrumentChange,
  onGoToLibrary,
}: {
  instrument: InstrumentId | null
  onInstrumentChange: (id: InstrumentId) => void
  onGoToLibrary: () => void
}) {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center py-2">
        <h2 className="font-serif text-3xl font-bold text-gray-900 leading-tight">
          Your String Practice<br />
          <span className="text-mahogany-600">Companion</span>
        </h2>
        <p className="text-gray-500 mt-2 text-sm leading-relaxed max-w-xs mx-auto">
          Find the perfect scale or etude book from our curated library of 59 titles across all string instruments.
        </p>
      </div>

      <Tuner instrument={instrument ?? 'violin'} />

      <div className="card p-5">
        <InstrumentSelector selected={instrument} onChange={onInstrumentChange} />
        <button onClick={onGoToLibrary} className="btn-primary w-full mt-5 flex items-center justify-center gap-2">
          <Search className="w-4 h-4" />
          Search the Library
        </button>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {[{ label: 'Violin', count: 19 }, { label: 'Viola', count: 13 }, { label: 'Cello', count: 13 }, { label: 'Bass', count: 14 }].map((s) => (
          <div key={s.label} className="card p-3 text-center">
            <div className="text-2xl font-serif font-bold text-mahogany-600">{s.count}</div>
            <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="card p-5 space-y-3">
        <h3 className="font-serif font-semibold text-gray-800 text-base">How to Use</h3>
        <div className="space-y-2.5">
          {[
            { step: '1', text: 'Select your instrument and use the chromatic tuner to tune up.' },
            { step: '2', text: 'Go to Library and choose the skills you want to practice.' },
            { step: '3', text: 'Filter by difficulty and book type to find the right material.' },
          ].map(({ step, text }) => (
            <div key={step} className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-mahogany-100 text-mahogany-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                {step}
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function LibraryPage({ instrument }: { instrument: InstrumentId | null }) {
  return (
    <div className="animate-fade-in">
      <div className="mb-4">
        <h2 className="font-serif text-xl font-bold text-gray-900">Scale &amp; Etude Library</h2>
        <p className="text-sm text-gray-400 mt-0.5">59 books across violin, viola, cello, and bass</p>
      </div>
      <SearchPanel defaultInstrument={instrument} />
    </div>
  )
}
