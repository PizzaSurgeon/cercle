import React from 'react';
import { View, Text } from 'react-native';
import { Fonts } from '../theme';

interface AvatarProps {
  initial: string;
  bg: string;
  fg: string;
  size?: number;
}

export function Avatar({ initial, bg, fg, size = 24 }: AvatarProps) {
  return (
    <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: bg, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontFamily: Fonts.semiBold, color: fg, fontSize: size * 0.4 }}>{initial}</Text>
    </View>
  );
}
