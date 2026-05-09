import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Music2, Search } from 'lucide-react-native';
import Tuner from '../../src/components/Tuner';
import InstrumentSelector from '../../src/components/InstrumentSelector';
import type { InstrumentId } from '../../src/lib/constants';

const STATS = [
  { label: 'Violin', count: 19 },
  { label: 'Viola', count: 13 },
  { label: 'Cello', count: 13 },
  { label: 'Bass', count: 14 },
];

const HOW_TO = [
  { step: '1', text: 'Select your instrument and use the chromatic tuner to tune up.' },
  { step: '2', text: 'Go to Library and choose the skills you want to practice.' },
  { step: '3', text: 'Filter by difficulty and book type to find the right material.' },
];

export default function HomeScreen() {
  const [instrument, setInstrument] = useState<InstrumentId>('violin');
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-cream-50" edges={['top']}>
      {/* Header */}
      <View className="bg-white border-b border-cream-200 px-4 py-4 flex-row items-center justify-between shadow-sm">
        <View className="flex-row items-center gap-2.5">
          <View className="w-9 h-9 rounded-xl bg-mahogany-600 items-center justify-center">
            <Music2 size={18} color="#fff" />
          </View>
          <View>
            <Text className="font-bold text-gray-900 text-lg leading-none" style={{ fontFamily: 'serif' }}>
              StringLibrary
            </Text>
            <Text className="text-xs text-gray-400 leading-none mt-0.5">Scale &amp; Etude Resource</Text>
          </View>
        </View>
        <View className="bg-cream-100 px-2.5 py-1 rounded-full border border-cream-200">
          <Text className="text-xs text-gray-400 font-medium">59 Books</Text>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16, paddingBottom: 32, gap: 16 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <View className="items-center py-2">
          <Text
            className="text-3xl font-bold text-gray-900 leading-tight text-center"
            style={{ fontFamily: 'serif' }}
          >
            Your String Practice{'
'}
            <Text className="text-mahogany-600">Companion</Text>
          </Text>
          <Text className="text-gray-500 mt-2 text-sm leading-relaxed text-center max-w-xs">
            Find the perfect scale or etude book from our curated library of 59 titles across all
            string instruments.
          </Text>
        </View>

        {/* Tuner */}
        <Tuner instrument={instrument} />

        {/* Instrument selector + CTA */}
        <View className="bg-white rounded-2xl border border-cream-200 shadow-sm p-5 gap-5">
          <InstrumentSelector selected={instrument} onChange={setInstrument} />
          <Pressable
            onPress={() => router.push('/(tabs)/library')}
            className="bg-mahogany-600 flex-row items-center justify-center gap-2 py-3 rounded-xl"
          >
            <Search size={16} color="#fff" />
            <Text className="text-white font-medium">Search the Library</Text>
          </Pressable>
        </View>

        {/* Stats */}
        <View className="flex-row gap-3">
          {STATS.map((s) => (
            <View key={s.label} className="flex-1 bg-white rounded-2xl border border-cream-200 shadow-sm p-3 items-center">
              <Text className="text-2xl font-bold text-mahogany-600" style={{ fontFamily: 'serif' }}>
                {s.count}
              </Text>
              <Text className="text-xs text-gray-500 mt-0.5">{s.label}</Text>
            </View>
          ))}
        </View>

        {/* How to use */}
        <View className="bg-white rounded-2xl border border-cream-200 shadow-sm p-5 gap-3">
          <Text className="font-semibold text-gray-800 text-base" style={{ fontFamily: 'serif' }}>
            How to Use
          </Text>
          {HOW_TO.map(({ step, text }) => (
            <View key={step} className="flex-row items-start gap-3">
              <View className="w-6 h-6 rounded-full bg-mahogany-100 items-center justify-center shrink-0 mt-0.5">
                <Text className="text-xs font-bold text-mahogany-700">{step}</Text>
              </View>
              <Text className="text-sm text-gray-600 leading-relaxed flex-1">{text}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
