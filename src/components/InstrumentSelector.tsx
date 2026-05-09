import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { INSTRUMENTS } from '../lib/constants';
import type { InstrumentId } from '../lib/constants';
import InstrumentSVG from './InstrumentSVG';

interface Props {
  selected: InstrumentId | null;
  onChange: (id: InstrumentId) => void;
}

export default function InstrumentSelector({ selected, onChange }: Props) {
  return (
    <View>
      <Text className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">
        Select Your Instrument
      </Text>
      <View className="flex-row flex-wrap gap-3">
        {INSTRUMENTS.map((inst) => {
          const isActive = selected === inst.id;
          return (
            <Pressable
              key={inst.id}
              onPress={() => onChange(inst.id as InstrumentId)}
              className={`flex-1 min-w-[44%] items-center justify-center gap-1 py-4 rounded-2xl border-2 ${
                isActive
                  ? 'border-mahogany-500 bg-mahogany-50'
                  : 'border-cream-200 bg-white'
              }`}
            >
              <InstrumentSVG id={inst.id} active={isActive} />
              <Text
                className={`font-semibold text-sm mt-1 ${
                  isActive ? 'text-mahogany-700' : 'text-gray-500'
                }`}
              >
                {inst.label}
              </Text>
              <Text
                className={`text-xs ${
                  isActive ? 'text-mahogany-400' : 'text-gray-400'
                }`}
              >
                {inst.range}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
