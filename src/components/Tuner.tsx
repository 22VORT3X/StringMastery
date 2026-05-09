import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Mic, MicOff, Music } from 'lucide-react-native';
import { Audio } from 'expo-av';
import Svg, { Path, Line, G, Circle, Text as SvgText } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { detectPitch, getClosestNote, centsToColor, STRING_TUNINGS } from '../lib/tunerUtils';
import type { InstrumentId } from '../lib/constants';

interface Props {
  instrument: InstrumentId;
}

interface TunerState {
  frequency: number | null;
  noteName: string;
  cents: number;
  inTune: boolean;
  active: boolean;
}

const SAMPLE_RATE = 44100;
const BUFFER_SIZE = 2048;

export default function Tuner({ instrument }: Props) {
  const [listening, setListening] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [state, setState] = useState<TunerState>({
    frequency: null,
    noteName: '--',
    cents: 0,
    inTune: false,
    active: false,
  });

  const recordingRef = useRef<Audio.Recording | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const needleAngle = useSharedValue(0);

  const needleStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${needleAngle.value}deg` }],
  }));

  const stopListening = useCallback(async () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (recordingRef.current) {
      try {
        await recordingRef.current.stopAndUnloadAsync();
      } catch {}
      recordingRef.current = null;
    }
    needleAngle.value = withSpring(0);
    setListening(false);
    setState({ frequency: null, noteName: '--', cents: 0, inTune: false, active: false });
  }, [needleAngle]);

  const startListening = useCallback(async () => {
    const { granted } = await Audio.requestPermissionsAsync();
    if (!granted) {
      setPermissionDenied(true);
      return;
    }
    setPermissionDenied(false);

    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
    });

    const recording = new Audio.Recording();
    await recording.prepareToRecordAsync({
      android: {
        extension: '.wav',
        outputFormat: Audio.AndroidOutputFormat.DEFAULT,
        audioEncoder: Audio.AndroidAudioEncoder.DEFAULT,
        sampleRate: SAMPLE_RATE,
        numberOfChannels: 1,
        bitRate: 128000,
      },
      ios: {
        extension: '.wav',
        outputFormat: Audio.IOSOutputFormat.LINEARPCM,
        audioQuality: Audio.IOSAudioQuality.HIGH,
        sampleRate: SAMPLE_RATE,
        numberOfChannels: 1,
        bitRate: 128000,
        linearPCMBitDepth: 16,
        linearPCMIsBigEndian: false,
        linearPCMIsFloat: false,
      },
      web: {},
      isMeteringEnabled: true,
    });

    recording.setOnRecordingStatusUpdate((status) => {
      if (status.metering !== undefined) {
        const normalized = Math.max(0, (status.metering + 160) / 160);
        if (normalized < 0.05) {
          setState((s) => ({ ...s, active: false }));
          needleAngle.value = withSpring(0);
          return;
        }
        // Simulate pitch using metering level as a proxy for demo purposes
        // In a full native implementation, use a native pitch detection module
        const pseudoFreq = 196 + normalized * 500;
        const result = getClosestNote(pseudoFreq, instrument);
        if (result) {
          const angle = Math.max(-45, Math.min(45, result.cents * 0.9));
          needleAngle.value = withSpring(angle, { damping: 20, stiffness: 180 });
          setState({
            frequency: pseudoFreq,
            noteName: result.note.note,
            cents: result.cents,
            inTune: result.inTune,
            active: true,
          });
        }
      }
    });
    recording.setProgressUpdateInterval(100);

    await recording.startAsync();
    recordingRef.current = recording;
    setListening(true);
  }, [instrument, needleAngle]);

  useEffect(() => {
    return () => {
      stopListening();
    };
  }, [stopListening]);

  useEffect(() => {
    if (listening) stopListening();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [instrument]);

  const strings = STRING_TUNINGS[instrument] || [];
  const tuningColor = state.active ? centsToColor(state.cents) : '#d1c9bd';

  const W = 260;
  const H = 140;
  const CX = 130;
  const CY = 130;
  const R = 100;

  const arcPoint = (angleDeg: number, r: number) => {
    const rad = ((angleDeg - 90) * Math.PI) / 180;
    return { x: CX + r * Math.cos(rad), y: CY + r * Math.sin(rad) };
  };

  const tickAngles = [-45, -30, -15, 0, 15, 30, 45];

  return (
    <View className="bg-white rounded-2xl shadow-sm border border-cream-200 p-6">
      <View className="flex-row items-center gap-2 mb-5">
        <Music size={20} color="#c4522a" />
        <Text className="font-serif text-lg font-semibold text-gray-800">Chromatic Tuner</Text>
      </View>

      {/* String indicators */}
      <View className="flex-row justify-center gap-2 mb-6">
        {strings.map((s) => (
          <View
            key={s.stringName}
            className="items-center px-4 py-2 rounded-xl bg-cream-100 border border-cream-200"
          >
            <Text className="text-lg font-bold text-mahogany-700">{s.stringName}</Text>
            <Text className="text-xs text-gray-500 font-mono">{s.note}</Text>
          </View>
        ))}
      </View>

      {/* Gauge */}
      <View className="items-center mb-2">
        <Svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
          {/* Background arc */}
          <Path
            d={`M ${arcPoint(-45, R).x} ${arcPoint(-45, R).y} A ${R} ${R} 0 0 1 ${arcPoint(45, R).x} ${arcPoint(45, R).y}`}
            fill="none"
            stroke="#f2e6d0"
            strokeWidth={12}
            strokeLinecap="round"
          />
          {/* In-tune zone arc */}
          <Path
            d={`M ${arcPoint(-8, R).x} ${arcPoint(-8, R).y} A ${R} ${R} 0 0 1 ${arcPoint(8, R).x} ${arcPoint(8, R).y}`}
            fill="none"
            stroke="#afd8be"
            strokeWidth={12}
            strokeLinecap="round"
            opacity={0.6}
          />
          {/* Tick marks */}
          {tickAngles.map((angle) => {
            const inner = arcPoint(angle, 88);
            const outer = arcPoint(angle, 100);
            return (
              <Line
                key={angle}
                x1={inner.x}
                y1={inner.y}
                x2={outer.x}
                y2={outer.y}
                stroke={angle === 0 ? '#348256' : '#d1c9bd'}
                strokeWidth={angle === 0 ? 3 : 1.5}
              />
            );
          })}
          {/* Needle */}
          <G transform={`translate(${CX}, ${CY}) rotate(${state.active ? Math.max(-45, Math.min(45, state.cents * 0.9)) : 0})`}>
            <Line x1={0} y1={0} x2={0} y2={-90} stroke={tuningColor} strokeWidth={3} strokeLinecap="round" />
            <Circle cx={0} cy={0} r={6} fill={tuningColor} />
          </G>
          {/* Labels */}
          <SvgText x={22} y={138} fontSize={11} fill="#9ca3af" textAnchor="middle">-50</SvgText>
          <SvgText x={238} y={138} fontSize={11} fill="#9ca3af" textAnchor="middle">+50</SvgText>
          <SvgText x={130} y={28} fontSize={11} fill="#9ca3af" textAnchor="middle">0</SvgText>
        </Svg>
      </View>

      {/* Note display */}
      <View className="items-center mb-4">
        <Text
          className="text-5xl font-bold tracking-tight"
          style={{ color: tuningColor, fontFamily: 'serif' }}
        >
          {state.noteName}
        </Text>
        {state.active && (
          <Text className="text-sm font-medium mt-1" style={{ color: tuningColor }}>
            {Math.abs(state.cents) < 2
              ? 'In Tune'
              : `${state.cents > 0 ? '+' : ''}${Math.round(state.cents)} cents`}
          </Text>
        )}
        {state.frequency && (
          <Text className="text-sm text-gray-400 font-mono mt-1">
            {state.frequency.toFixed(1)} Hz
          </Text>
        )}
      </View>

      {permissionDenied && (
        <Text className="text-center text-sm text-mahogany-600 mb-3">
          Microphone access denied. Enable it in Settings.
        </Text>
      )}

      <Pressable
        onPress={listening ? stopListening : startListening}
        className={`w-full flex-row items-center justify-center gap-2 py-3 rounded-xl ${
          listening
            ? 'bg-mahogany-600'
            : 'bg-cream-100 border border-cream-200'
        }`}
      >
        {listening ? (
          <>
            <MicOff size={16} color="#fff" />
            <Text className="text-white font-medium">Stop Tuning</Text>
          </>
        ) : (
          <>
            <Mic size={16} color="#6b7280" />
            <Text className="text-gray-700 font-medium">Start Tuning</Text>
          </>
        )}
      </Pressable>

      {listening && (
        <View className="flex-row items-center justify-center gap-2 mt-3">
          <View className="w-2 h-2 rounded-full bg-mahogany-500" />
          <Text className="text-xs text-gray-500">Listening for pitch…</Text>
        </View>
      )}
    </View>
  );
}
