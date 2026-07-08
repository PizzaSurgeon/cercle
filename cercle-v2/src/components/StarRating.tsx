import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '../context/ThemeContext';

interface StarRatingProps {
  value: number;
  size?: 'sm' | 'md' | 'lg';
}

const SIZES = { sm: 11, md: 13, lg: 15 } as const;
const GAPS = { sm: 1.5, md: 2, lg: 2.5 } as const;

export function StarRating({ value, size = 'md' }: StarRatingProps) {
  const { colors } = useTheme();
  const fontSize = SIZES[size];
  const lineHeight = Math.ceil(fontSize * 1.35);
  const gap = GAPS[size];

  return (
    <View style={{ flexDirection: 'row', gap }}>
      {([1, 2, 3, 4, 5] as const).map(i => {
        const fillRatio = Math.min(Math.max(value - (i - 1), 0), 1);
        const fillPct = `${Math.round(fillRatio * 100)}%` as `${number}%`;
        return (
          <View key={i} style={{ position: 'relative' }}>
            <Text style={{ fontSize, lineHeight, color: colors.starEmpty }}>★</Text>
            {fillRatio > 0 && (
              <View style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: fillPct, overflow: 'hidden' }}>
                <Text style={{ fontSize, lineHeight, color: colors.starFill }}>★</Text>
              </View>
            )}
          </View>
        );
      })}
    </View>
  );
}
