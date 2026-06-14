import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '../context/ThemeContext';

interface StarRatingProps {
  value: number;
  size?: 'sm' | 'md' | 'lg';
}

const SIZES = { sm: 11, md: 13, lg: 15 } as const;
const SPACINGS = { sm: 1.5, md: 2, lg: 2.5 } as const;

export function StarRating({ value, size = 'md' }: StarRatingProps) {
  const { colors } = useTheme();
  const fontSize = SIZES[size];
  const letterSpacing = SPACINGS[size];
  const pct = `${Math.round((value / 5) * 100)}%` as `${number}%`;

  return (
    <View style={{ position: 'relative' }}>
      <Text style={{ fontSize, letterSpacing, color: colors.starEmpty }}>{'★★★★★'}</Text>
      <View style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: pct, overflow: 'hidden' }}>
        <Text style={{ fontSize, letterSpacing, color: colors.starFill }}>{'★★★★★'}</Text>
      </View>
    </View>
  );
}
