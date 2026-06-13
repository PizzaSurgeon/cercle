import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Fonts } from '../theme';
import { PosterPlaceholder } from './PosterPlaceholder';
import { StarRating } from './StarRating';
import { Avatar } from './Avatar';

export interface FriendReview {
  initial: string;
  name: string;
  avatarBg: string;
  avatarFg: string;
  rating: number;
  quote: string;
}

export interface ConsensusCardProps {
  title: string;
  subtitle: string;
  posterLabel: string;
  posterColors: [string, string];
  circleAverage: number;
  reviewCount: number;
  reviews: FriendReview[];
}

export function ConsensusCard({
  title,
  subtitle,
  posterLabel,
  posterColors,
  circleAverage,
  reviewCount,
  reviews,
}: ConsensusCardProps) {
  return (
    <View style={styles.card}>
      {/* Header row: poster + title block */}
      <View style={styles.header}>
        <PosterPlaceholder
          label={posterLabel}
          colors={posterColors}
          width={92}
          height={134}
          borderRadius={14}
          fontSize={11}
        />
        <View style={styles.titleBlock}>
          <Text style={styles.title} numberOfLines={2}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
          <View style={styles.ratingRow}>
            <Text style={styles.avgScore}>{circleAverage.toFixed(1).replace('.', ',')}</Text>
            <StarRating value={circleAverage} size="lg" />
          </View>
          <Text style={styles.avgLabel}>
            Moyenne du cercle · {reviewCount} avis
          </Text>
        </View>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Friend reviews */}
      <Text style={styles.sectionLabel}>Les avis du cercle</Text>
      {reviews.map((r, i) => (
        <View key={i} style={styles.reviewRow}>
          <Avatar initial={r.initial} bg={r.avatarBg} fg={r.avatarFg} size={24} />
          <Text style={styles.reviewName}>{r.name}</Text>
          <StarRating value={r.rating} size="sm" />
          <Text style={styles.reviewQuote} numberOfLines={1}>
            « {r.quote} »
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: 24,
    padding: 18,
    marginBottom: 16,
    shadowColor: Colors.shadowColor,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 15,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    gap: 16,
  },
  titleBlock: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  title: {
    fontFamily: Fonts.heading,
    fontSize: 19,
    color: Colors.ink,
    lineHeight: 22,
  },
  subtitle: {
    fontFamily: Fonts.bodyMedium,
    fontSize: 12,
    color: Colors.subtleMuted,
    marginTop: 3,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 9,
    marginTop: 'auto',
    paddingTop: 8,
  },
  avgScore: {
    fontFamily: Fonts.headingBold,
    fontSize: 34,
    color: Colors.ink,
    lineHeight: 32,
  },
  avgLabel: {
    fontFamily: Fonts.bodyBold,
    fontSize: 10,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: Colors.labelMuted,
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.divider,
    marginVertical: 16,
    marginBottom: 12,
  },
  sectionLabel: {
    fontFamily: Fonts.bodyBold,
    fontSize: 11,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: Colors.labelMuted,
    marginBottom: 8,
  },
  reviewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 5,
  },
  reviewName: {
    fontFamily: Fonts.bodySemi,
    fontSize: 13,
    color: Colors.ink,
    width: 62,
    flexShrink: 0,
  },
  reviewQuote: {
    marginLeft: 'auto',
    fontFamily: Fonts.body,
    fontSize: 12,
    color: Colors.reviewText,
    fontStyle: 'italic',
    maxWidth: 120,
    flexShrink: 1,
  },
});
