import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { Search, X, BookOpen } from 'lucide-react-native';
import { supabase } from '../lib/supabase';
import type { Book } from '../lib/supabase';
import type { InstrumentId } from '../lib/constants';
import InstrumentSelector from './InstrumentSelector';
import SkillSelector from './SkillSelector';
import BookCard from './BookCard';

interface Props {
  defaultInstrument?: InstrumentId | null;
}

export default function SearchPanel({ defaultInstrument }: Props) {
  const [instrument, setInstrument] = useState<InstrumentId | null>(defaultInstrument ?? null);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [difficulty, setDifficulty] = useState('');
  const [bookType, setBookType] = useState('');
  const [searchText, setSearchText] = useState('');
  const [results, setResults] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  const handleSkillToggle = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const handleSearch = async () => {
    if (!instrument && selectedSkills.length === 0 && !searchText) return;
    setLoading(true);
    setHasSearched(true);
    try {
      let query = supabase.from('books').select('*', { count: 'exact' });
      if (instrument) query = query.eq('instrument', instrument);
      if (difficulty) query = query.eq('difficulty', difficulty);
      if (bookType) query = query.eq('book_type', bookType);
      if (searchText.trim()) {
        query = query.or(
          `title.ilike.%${searchText}%,author.ilike.%${searchText}%,description.ilike.%${searchText}%`
        );
      }
      if (selectedSkills.length > 0) query = query.overlaps('skills', selectedSkills);
      query = query.order('difficulty').order('author');

      const { data, error, count } = await query;
      if (error) throw error;
      setResults(data as Book[]);
      setTotalCount(count ?? 0);
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setInstrument(null);
    setSelectedSkills([]);
    setDifficulty('');
    setBookType('');
    setSearchText('');
    setResults([]);
    setHasSearched(false);
  };

  useEffect(() => {
    if (hasSearched) handleSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [instrument, difficulty, bookType, selectedSkills]);

  const hasFilters =
    instrument || selectedSkills.length > 0 || difficulty || bookType || searchText;

  return (
    <View>
      <View className="bg-white rounded-2xl border border-cream-200 shadow-sm p-5 gap-5 mb-5">
        {/* Text search */}
        <View className="relative">
          <View className="absolute left-3.5 top-0 bottom-0 justify-center z-10">
            <Search size={16} color="#9ca3af" />
          </View>
          <TextInput
            value={searchText}
            onChangeText={setSearchText}
            onSubmitEditing={handleSearch}
            placeholder="Search by title, author…"
            placeholderTextColor="#9ca3af"
            returnKeyType="search"
            className="pl-10 pr-4 py-3 rounded-xl border border-cream-200 bg-cream-50 text-gray-800"
          />
          {searchText.length > 0 && (
            <Pressable
              onPress={() => setSearchText('')}
              className="absolute right-3.5 top-0 bottom-0 justify-center"
            >
              <X size={16} color="#9ca3af" />
            </Pressable>
          )}
        </View>

        <InstrumentSelector selected={instrument} onChange={setInstrument} />

        <SkillSelector
          selectedSkills={selectedSkills}
          difficulty={difficulty}
          bookType={bookType}
          onSkillToggle={handleSkillToggle}
          onDifficultyChange={setDifficulty}
          onBookTypeChange={setBookType}
        />

        <View className="flex-row gap-3 pt-1">
          <Pressable
            onPress={handleSearch}
            className="flex-1 flex-row items-center justify-center gap-2 bg-mahogany-600 py-3 rounded-xl"
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Search size={16} color="#fff" />
            )}
            <Text className="text-white font-medium">Search Library</Text>
          </Pressable>
          {hasFilters ? (
            <Pressable
              onPress={handleClear}
              className="flex-row items-center gap-2 bg-white border border-mahogany-200 px-4 py-3 rounded-xl"
            >
              <X size={16} color="#a63e1f" />
              <Text className="text-mahogany-700 font-medium">Clear</Text>
            </Pressable>
          ) : null}
        </View>
      </View>

      {hasSearched && (
        <View>
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center gap-2">
              <BookOpen size={16} color="#c4522a" />
              <Text className="font-semibold text-gray-700">
                {loading ? 'Searching…' : `${totalCount} book${totalCount !== 1 ? 's' : ''} found`}
              </Text>
            </View>
            {selectedSkills.length > 0 && (
              <View className="flex-row flex-wrap gap-1 justify-end flex-1 ml-2">
                {selectedSkills.slice(0, 2).map((s) => (
                  <View key={s} className="px-2 py-0.5 rounded-full bg-mahogany-100">
                    <Text className="text-xs text-mahogany-700">{s}</Text>
                  </View>
                ))}
                {selectedSkills.length > 2 && (
                  <View className="px-2 py-0.5 rounded-full bg-mahogany-100">
                    <Text className="text-xs text-mahogany-700">+{selectedSkills.length - 2}</Text>
                  </View>
                )}
              </View>
            )}
          </View>

          {loading ? (
            <ActivityIndicator size="large" color="#c4522a" className="py-12" />
          ) : results.length === 0 ? (
            <View className="bg-white rounded-2xl border border-cream-200 p-10 items-center">
              <BookOpen size={48} color="#f2e6d0" />
              <Text className="text-gray-500 font-medium mt-3">No books match your search.</Text>
              <Text className="text-sm text-gray-400 mt-1 text-center">
                Try adjusting your filters or selecting different skills.
              </Text>
            </View>
          ) : (
            <FlatList
              data={results}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => <BookCard book={item} />}
              scrollEnabled={false}
            />
          )}
        </View>
      )}
    </View>
  );
}
