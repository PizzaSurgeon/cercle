import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Fonts } from '../theme';

interface AvatarProps {
  initial: string;
  bg: string;
  fg: string;
  size?: number;
}

export function Avatar({ initial, bg, fg, size = 24 }: AvatarProps) {
  const fontSize = size * 0.42;
  return (
    <View style={[styles.circle, { width: size, height: size, borderRadius: size / 2, backgroundColor: bg }]}>
      <Text style={[styles.initial, { color: fg, fontSize }]}>{initial}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  circle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  initial: {
    fontFamily: Fonts.bodyBold,
    lineHeight: undefined,
  },
});
