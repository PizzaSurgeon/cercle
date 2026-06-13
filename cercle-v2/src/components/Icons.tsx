import React from 'react';
import Svg, { Path, Circle, Rect } from 'react-native-svg';

interface IconProps {
  color: string;
  size?: number;
}

export function HomeIcon({ color, size = 23 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"
        stroke={color}
        strokeWidth={1.9}
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function SearchIcon({ color, size = 23 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={11} cy={11} r={7} stroke={color} strokeWidth={1.9} strokeLinecap="round" />
      <Path d="m20 20-3.5-3.5" stroke={color} strokeWidth={1.9} strokeLinecap="round" />
    </Svg>
  );
}

export function BookmarkIcon({ color, size = 23 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M6 3h12v18l-6-4.2L6 21z"
        stroke={color}
        strokeWidth={1.9}
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function ProfileIcon({ color, size = 23 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={8} r={4} stroke={color} strokeWidth={1.9} strokeLinecap="round" />
      <Path d="M4 21c0-4 3.6-6.5 8-6.5s8 2.5 8 6.5" stroke={color} strokeWidth={1.9} strokeLinecap="round" />
    </Svg>
  );
}

export function PlusIcon({ color = '#fff', size = 22 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 5v14M5 12h14" stroke={color} strokeWidth={2.2} strokeLinecap="round" />
    </Svg>
  );
}
