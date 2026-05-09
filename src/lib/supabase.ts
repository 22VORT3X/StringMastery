import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface Book {
  id: string
  title: string
  author: string
  instrument: 'violin' | 'viola' | 'cello' | 'bass'
  book_type: 'scales' | 'etudes' | 'both'
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'all'
  skills: string[]
  description: string
  publisher: string
  volume: string
}
