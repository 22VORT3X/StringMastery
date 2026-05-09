import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SearchPanel from '../../src/components/SearchPanel';

export default function LibraryScreen() {
  return (
    <SafeAreaView className="flex-1 bg-cream-50" edges={['top']}>
      {/* Header */}
      <View className="bg-white border-b border-cream-200 px-4 py-4 shadow-sm">
        <Text className="font-bold text-xl text-gray-900" style={{ fontFamily: 'serif' }}>
          Scale &amp; Etude Library
        </Text>
        <Text className="text-sm text-gray-400 mt-0.5">
          59 books across violin, viola, cello, and bass
        </Text>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <SearchPanel />
      </ScrollView>
    </SafeAreaView>
  );
}
