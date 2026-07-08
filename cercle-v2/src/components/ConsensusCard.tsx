import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import { Fonts } from '../theme';
import { MediaPoster } from './MediaPoster';
import { StarRating } from './StarRating';
import { Avatar } from './Avatar';

export interface FriendReview {
  initial: string;
  name: string;
  avatarBg: string;
  avatarFg: string;
  rating: number;
}

export interface ConsensusCardProps {
  title: string;
  subtitle: string;
  posterLabel: string;
  posterColors: [string, string];
  posterPath?: string | null;
  circleAverage: number;
  reviews: FriendReview[];
  progress?: { label: string; pct: number; pctLabel: string };
  onPress?: () => void;
  onReviewerPress?: (name: string, initial: string, avatarBg: string, avatarFg: string) => void;
}

export function ConsensusCard({ title, subtitle, posterLabel, posterColors, posterPath, circleAverage, reviews, progress, onPress, onReviewerPress }: ConsensusCardProps) {
  const { colors } = useTheme();

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85} style={[styles.card, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
      <View style={styles.header}>
        <MediaPoster
          posterPath={posterPath ?? null}
          fallbackLabel={posterLabel}
          fallbackColors={posterColors}
          width={92}
          height={134}
          borderRadius={13}
          fontSize={11}
        />
        <View style={styles.titleBlock}>
          <Text style={[styles.title, { color: colors.ink }]} numberOfLines={2}>{title}</Text>
          <Text style={[styles.subtitle, { color: colors.muted2 }]}>{subtitle}</Text>
          <View style={styles.ratingRow}>
            <Text style={[styles.avgScore, { color: colors.starFill }]}>
              {circleAverage.toFixed(1).replace('.', ',')}
            </Text>
            <StarRating value={circleAverage} size="lg" />
          </View>
        </View>
      </View>

      {progress && (
        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text style={[styles.progressLabel, { color: colors.muted2 }]}>{progress.label}</Text>
            <Text style={[styles.progressPct, { color: colors.accent }]}>{progress.pctLabel}</Text>
          </View>
          <View style={[styles.track, { backgroundColor: colors.track }]}>
            <LinearGradient
              colors={[colors.accent, colors.accentEnd]}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              style={[styles.fill, { width: `${progress.pct}%` as `${number}%` }]}
            />
          </View>
        </View>
      )}

      <View style={[styles.divider, { backgroundColor: colors.divider }]} />

      {reviews.map((r, i) => (
        <View key={i} style={styles.reviewRow}>
          <TouchableOpacity
            onPress={() => onReviewerPress?.(r.name, r.initial, r.avatarBg, r.avatarFg)}
            activeOpacity={0.7}
            style={styles.reviewerTouchable}
          >
            <Avatar initial={r.initial} bg={r.avatarBg} fg={r.avatarFg} size={24} />
            <Text style={[styles.reviewName, { color: colors.ink2 }]}>{r.name}</Text>
          </TouchableOpacity>
          <View style={{ marginLeft: 'auto' }}>
            <StarRating value={r.rating} size="sm" />
          </View>
        </View>
      ))}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 22,
    borderWidth: 1,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 9 },
    shadowOpacity: 0.45,
    shadowRadius: 20,
    elevation: 8,
  },
  header: { flexDirection: 'row', gap: 16 },
  titleBlock: { flex: 1, minWidth: 0, flexDirection: 'column' },
  title: { fontFamily: Fonts.semiBold, fontSize: 19, lineHeight: 23 },
  subtitle: { fontFamily: Fonts.regular, fontSize: 12, marginTop: 4 },
  ratingRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 9, marginTop: 'auto', paddingTop: 8 },
  avgScore: { fontFamily: Fonts.semiBold, fontSize: 34, lineHeight: 40 },
  progressSection: { marginTop: 15 },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 7 },
  progressLabel: { fontFamily: Fonts.medium, fontSize: 11 },
  progressPct: { fontFamily: Fonts.semiBold, fontSize: 11 },
  track: { height: 6, borderRadius: 999, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 999 },
  divider: { height: 1, marginTop: 16, marginBottom: 12 },
  reviewRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 5 },
  reviewerTouchable: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  reviewName: { fontFamily: Fonts.regular, fontSize: 13 },
});
