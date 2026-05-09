import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export interface Book {
  id: string;
  title: string;
  author: string;
  instrument: 'violin' | 'viola' | 'cello' | 'bass';
  book_type: 'scales' | 'etudes' | 'both';
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'all';
  skills: string[];
  description: string;
  publisher: string;
  volume: string;
}
