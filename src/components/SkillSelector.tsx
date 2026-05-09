import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { ChevronDown, ChevronUp } from 'lucide-react-native';

const SKILL_OPTIONS = [
  { label: 'Scales', value: 'scales' },
  { label: 'Arpeggios', value: 'arpeggios' },
  { label: 'Intonation', value: 'intonation' },
  { label: 'Shifting', value: 'shifting' },
  { label: 'Positions', value: 'positions' },
  { label: 'Bow Technique', value: 'bow technique' },
  { label: 'Double Stops', value: 'double stops' },
  { label: 'String Crossings', value: 'string crossings' },
  { label: 'Trills', value: 'trills' },
  { label: 'Thumb Position', value: 'thumb position' },
  { label: 'Tone Production', value: 'tone production' },
  { label: 'Vibrato', value: 'vibrato' },
  { label: 'Musical Expression', value: 'musical expression' },
  { label: 'Virtuoso Technique', value: 'virtuoso technique' },
  { label: 'Basic Technique', value: 'basic technique' },
];

const DIFFICULTY_OPTIONS = [
  { label: 'All Levels', value: '' },
  { label: 'Beginner', value: 'beginner' },
  { label: 'Intermediate', value: 'intermediate' },
  { label: 'Advanced', value: 'advanced' },
];

const TYPE_OPTIONS = [
  { label: 'All Types', value: '' },
  { label: 'Scales', value: 'scales' },
  { label: 'Etudes', value: 'etudes' },
  { label: 'Both', value: 'both' },
];

interface Props {
  selectedSkills: string[];
  difficulty: string;
  bookType: string;
  onSkillToggle: (skill: string) => void;
  onDifficultyChange: (d: string) => void;
  onBookTypeChange: (t: string) => void;
}

export default function SkillSelector({
  selectedSkills,
  difficulty,
  bookType,
  onSkillToggle,
  onDifficultyChange,
  onBookTypeChange,
}: Props) {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? SKILL_OPTIONS : SKILL_OPTIONS.slice(0, 8);

  return (
    <View className="gap-5">
      <View>
        <Text className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">
          Skills to Practice
        </Text>
        <View className="flex-row flex-wrap gap-2">
          {visible.map((s) => {
            const active = selectedSkills.includes(s.value);
            return (
              <Pressable
                key={s.value}
                onPress={() => onSkillToggle(s.value)}
                className={`px-3 py-1.5 rounded-full border ${
                  active
                    ? 'bg-mahogany-600 border-mahogany-600'
                    : 'bg-white border-gray-200'
                }`}
              >
                <Text
                  className={`text-sm font-medium ${
                    active ? 'text-white' : 'text-gray-600'
                  }`}
                >
                  {s.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
        <Pressable
          onPress={() => setShowAll(!showAll)}
          className="flex-row items-center gap-1 mt-2"
        >
          {showAll ? (
            <ChevronUp size={16} color="#a63e1f" />
          ) : (
            <ChevronDown size={16} color="#a63e1f" />
          )}
          <Text className="text-sm text-mahogany-600">
            {showAll ? 'Show less' : 'Show all skills'}
          </Text>
        </Pressable>
      </View>

      <View className="flex-row gap-4">
        <View className="flex-1">
          <Text className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">
            Difficulty
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {DIFFICULTY_OPTIONS.map((d) => {
              const active = difficulty === d.value;
              return (
                <Pressable
                  key={d.value}
                  onPress={() => onDifficultyChange(d.value)}
                  className={`px-3 py-1 rounded-full border ${
                    active ? 'bg-mahogany-600 border-mahogany-600' : 'bg-white border-gray-200'
                  }`}
                >
                  <Text
                    className={`text-xs font-medium ${
                      active ? 'text-white' : 'text-gray-600'
                    }`}
                  >
                    {d.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View className="flex-1">
          <Text className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">
            Book Type
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {TYPE_OPTIONS.map((t) => {
              const active = bookType === t.value;
              return (
                <Pressable
                  key={t.value}
                  onPress={() => onBookTypeChange(t.value)}
                  className={`px-3 py-1 rounded-full border ${
                    active ? 'bg-mahogany-600 border-mahogany-600' : 'bg-white border-gray-200'
                  }`}
                >
                  <Text
                    className={`text-xs font-medium ${
                      active ? 'text-white' : 'text-gray-600'
                    }`}
                  >
                    {t.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      </View>
    </View>
  );
}
