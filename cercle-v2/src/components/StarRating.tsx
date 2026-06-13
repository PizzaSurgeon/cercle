import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Fonts } from '../theme';

interface StarRatingProps {
  value: number; // 0–5
  size?: 'sm' | 'md' | 'lg';
}

const SIZES = { sm: 11, md: 13, lg: 15 } as const;
const SPACINGS = { sm: 1.5, md: 2, lg: 2.5 } as const;

export function StarRating({ value, size = 'md' }: StarRatingProps) {
  const fontSize = SIZES[size];
  const letterSpacing = SPACINGS[size];
  const pct = `${Math.round((value / 5) * 100)}%` as `${number}%`;

  return (
    <View style={styles.container}>
      <Text style={[styles.stars, { fontSize, letterSpacing, color: Colors.starEmpty }]}>
        {'★★★★★'}
      </Text>
      <View style={[styles.overlay, { width: pct }]}>
        <Text style={[styles.stars, { fontSize, letterSpacing, color: Colors.starFilled }]}>
          {'★★★★★'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  stars: {
    fontFamily: Fonts.body,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    overflow: 'hidden',
  },
});
