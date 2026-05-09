import React from 'react';
import { View, Text } from 'react-native';
import { BookOpen, Music, Tag } from 'lucide-react-native';
import type { Book } from '../lib/supabase';

const TYPE_LABELS: Record<string, string> = {
  scales: 'Scales',
  etudes: 'Etudes',
  both: 'Scales & Etudes',
};

const DIFFICULTY_COLORS: Record<string, { bg: string; text: string }> = {
  beginner: { bg: '#d8ede1', text: '#266843' },
  intermediate: { bg: '#faf2c7', text: '#a37e12' },
  advanced: { bg: '#fae3d8', text: '#a63e1f' },
  all: { bg: '#f3f4f6', text: '#6b7280' },
};

const INSTRUMENT_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  violin: { bg: '#fae3d8', text: '#a63e1f', border: '#f4c4a8' },
  viola: { bg: '#faf2c7', text: '#a37e12', border: '#f5e48f' },
  cello: { bg: '#d8ede1', text: '#266843', border: '#afd8be' },
  bass: { bg: '#eff6ff', text: '#1d4ed8', border: '#bfdbfe' },
};

export default function BookCard({ book }: { book: Book }) {
  const diffColor = DIFFICULTY_COLORS[book.difficulty] ?? DIFFICULTY_COLORS.all;
  const instColor = INSTRUMENT_COLORS[book.instrument] ?? INSTRUMENT_COLORS.violin;

  return (
    <View className="bg-white rounded-2xl shadow-sm border border-cream-200 p-5 mb-3">
      {/* Header */}
      <View className="flex-row items-start justify-between gap-3 mb-3">
        <View className="flex-1">
          <Text className="font-semibold text-gray-900 text-base leading-snug" style={{ fontFamily: 'serif' }}>
            {book.title}
            {book.volume ? (
              <Text className="text-sm font-normal text-gray-400"> {book.volume}</Text>
            ) : null}
          </Text>
          <Text className="text-sm text-gray-500 mt-0.5">{book.author}</Text>
        </View>
        <View
          style={{ backgroundColor: diffColor.bg }}
          className="rounded-full px-2.5 py-1 shrink-0"
        >
          <Text style={{ color: diffColor.text }} className="text-xs font-semibold uppercase tracking-wide">
            {book.difficulty === 'all' ? 'All Levels' : book.difficulty}
          </Text>
        </View>
      </View>

      {/* Description */}
      {book.description ? (
        <Text className="text-sm text-gray-600 leading-relaxed mb-4">{book.description}</Text>
      ) : null}

      {/* Skills */}
      {book.skills && book.skills.length > 0 && (
        <View className="flex-row flex-wrap gap-1.5 mb-4">
          {book.skills.slice(0, 6).map((skill) => (
            <View
              key={skill}
              className="flex-row items-center gap-1 px-2 py-0.5 rounded-full bg-cream-100 border border-cream-200"
            >
              <Tag size={10} color="#9ca3af" />
              <Text className="text-xs text-gray-600">{skill}</Text>
            </View>
          ))}
          {book.skills.length > 6 && (
            <View className="px-2 py-0.5 rounded-full bg-cream-100 border border-cream-200">
              <Text className="text-xs text-gray-400">+{book.skills.length - 6} more</Text>
            </View>
          )}
        </View>
      )}

      {/* Footer */}
      <View className="flex-row items-center justify-between pt-3 border-t border-cream-100">
        <View className="flex-row items-center gap-2">
          <View
            style={{ backgroundColor: instColor.bg, borderColor: instColor.border }}
            className="rounded-full px-2.5 py-1 border"
          >
            <Text style={{ color: instColor.text }} className="text-xs font-medium">
              {book.instrument.charAt(0).toUpperCase() + book.instrument.slice(1)}
            </Text>
          </View>
          <View className="flex-row items-center gap-1 px-2.5 py-1 rounded-full bg-gray-50 border border-gray-100">
            <BookOpen size={12} color="#6b7280" />
            <Text className="text-xs font-medium text-gray-600">{TYPE_LABELS[book.book_type]}</Text>
          </View>
        </View>
        {book.publisher ? (
          <View className="flex-row items-center gap-1">
            <Music size={12} color="#9ca3af" />
            <Text className="text-xs text-gray-400">{book.publisher}</Text>
          </View>
        ) : null}
      </View>
    </View>
  );
}
