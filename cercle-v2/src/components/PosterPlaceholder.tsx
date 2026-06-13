import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Fonts } from '../theme';

interface PosterPlaceholderProps {
  label: string;
  colors: [string, string];
  width: number;
  height: number;
  borderRadius?: number;
  fontSize?: number;
}

export function PosterPlaceholder({
  label,
  colors,
  width,
  height,
  borderRadius = 14,
  fontSize = 11,
}: PosterPlaceholderProps) {
  return (
    <LinearGradient
      colors={colors}
      start={{ x: 0.15, y: 0 }}
      end={{ x: 0.85, y: 1 }}
      style={[styles.poster, { width, height, borderRadius }]}
    >
      <Text style={[styles.label, { fontSize }]}>{label}</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  poster: {
    justifyContent: 'flex-end',
    padding: 10,
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.14)',
  },
  label: {
    fontFamily: Fonts.heading,
    color: 'rgba(255,255,255,0.94)',
    letterSpacing: 0.3,
    lineHeight: 14,
  },
});
