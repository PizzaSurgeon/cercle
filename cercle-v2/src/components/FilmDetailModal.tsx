import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import { Fonts } from '../theme';
import { Avatar } from './Avatar';
import { StarRating } from './StarRating';
import { MediaPoster } from './MediaPoster';
import { RatingModal } from './RatingModal';
import { FriendReview } from './ConsensusCard';
import { MediaItem } from '../types/media';

interface FilmDetailModalProps {
  visible: boolean;
  title: string;
  subtitle: string;
  posterLabel: string;
  posterColors: [string, string];
  circleAverage: number;
  reviews: FriendReview[];
  onClose: () => void;
  onReviewerPress: (name: string, initial: string, avatarBg: string, avatarFg: string) => void;
  mediaItem?: MediaItem;
}

interface MockComment {
  [key: string]: string;
}

function getPlatformForTitle(title: string): { name: string; color: string } {
  if (title.toLowerCase().includes('shōgun') || title.toLowerCase().includes('shogun')) {
    return { name: 'Netflix', color: '#E50914' };
  }
  if (title.toLowerCase().includes('dune')) {
    return { name: 'Cinéma', color: '#7B68EE' };
  }
  if (title.toLowerCase().includes('attack') || title.toLowerCase().includes('titan')) {
    return { name: 'Crunchyroll', color: '#F47521' };
  }
  return { name: 'Streaming', color: '#888' };
}

const SHOGUN_COMMENTS: MockComment = {
  Camille: 'Magistral, une série épique.',
  Tom: 'Visuellement splendide, fascinant.',
  Sofia: 'Incroyable travail historique.',
};

const DUNE_COMMENTS: MockComment = {
  Léa: 'Un chef-d\'œuvre visuel absolu.',
  Maxime: 'Villeneuve signe son meilleur film.',
  Tom: 'Épique et mélancolique à la fois.',
};

const AOT_COMMENTS: MockComment = {
  Sofia: 'Une fin à la hauteur de la série.',
  Léa: 'Emotionnellement dévastateur, parfait.',
};

function getCommentForReview(title: string, name: string): string {
  if (title.toLowerCase().includes('shōgun') || title.toLowerCase().includes('shogun')) {
    return SHOGUN_COMMENTS[name] ?? 'Une œuvre remarquable.';
  }
  if (title.toLowerCase().includes('dune')) {
    return DUNE_COMMENTS[name] ?? 'Impressionnant à tous niveaux.';
  }
  if (title.toLowerCase().includes('attack') || title.toLowerCase().includes('titan')) {
    return AOT_COMMENTS[name] ?? 'Un animé inoubliable.';
  }
  return 'Vraiment une belle découverte.';
}

function formatDuration(mediaItem: MediaItem): string | null {
  if (mediaItem.type === 'movie' && mediaItem.duration) {
    const h = Math.floor(mediaItem.duration / 60);
    const m = mediaItem.duration % 60;
    if (h > 0 && m > 0) return `${h}h ${m}min`;
    if (h > 0) return `${h}h`;
    return `${m}min`;
  }
  if (mediaItem.type === 'tv' || mediaItem.type === 'anime') {
    const parts: string[] = [];
    if (mediaItem.episodeCount) parts.push(`${mediaItem.episodeCount} ép.`);
    if (mediaItem.seasonCount) parts.push(`${mediaItem.seasonCount} saison${mediaItem.seasonCount > 1 ? 's' : ''}`);
    return parts.length > 0 ? parts.join(' · ') : null;
  }
  return null;
}

export function FilmDetailModal({
  visible,
  title,
  subtitle,
  posterLabel,
  posterColors,
  circleAverage,
  reviews,
  onClose,
  onReviewerPress,
  mediaItem,
}: FilmDetailModalProps) {
  const { colors } = useTheme();
  const [showRating, setShowRating] = useState(false);

  const platform = getPlatformForTitle(title);
  const durationLabel = mediaItem ? formatDuration(mediaItem) : null;
  const realPlatform = mediaItem && mediaItem.platforms.length > 0 ? mediaItem.platforms[0] : null;
  const posterPath = mediaItem?.posterPath ?? null;

  return (
    <>
      <Modal visible={visible} animationType="slide" statusBarTranslucent>
        <SafeAreaView style={[styles.screen, { backgroundColor: colors.background }]}>
          {/* Navbar */}
          <View style={[styles.navbar, { borderBottomColor: colors.divider }]}>
            <View style={styles.navSpacer} />
            <Text style={[styles.navTitle, { color: colors.ink }]}>Détails</Text>
            <TouchableOpacity onPress={onClose} style={[styles.closeBtn, { backgroundColor: colors.chip, borderColor: colors.cardBorder }]} activeOpacity={0.7}>
              <Text style={[styles.closeBtnText, { color: colors.muted }]}>×</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
            {/* Poster + info block */}
            <View style={styles.heroSection}>
              <MediaPoster
                posterPath={posterPath}
                fallbackLabel={posterLabel}
                fallbackColors={posterColors}
                width={120}
                height={174}
                borderRadius={16}
                fontSize={12}
              />
              <View style={styles.heroInfo}>
                <Text style={[styles.heroTitle, { color: colors.ink }]} numberOfLines={3}>{title}</Text>
                <Text style={[styles.heroSubtitle, { color: colors.muted2 }]}>{subtitle}</Text>

                <View style={styles.scoreRow}>
                  <Text style={[styles.avgScore, { color: colors.starFill }]}>
                    {circleAverage.toFixed(1).replace('.', ',')}
                  </Text>
                  <StarRating value={circleAverage} size="md" />
                </View>

                {/* Platform badge */}
                <View style={[styles.platformBadge, { backgroundColor: colors.chip, borderColor: colors.chipBorder }]}>
                  <View style={[styles.platformDot, { backgroundColor: realPlatform ? '#1DB954' : platform.color }]} />
                  <Text style={[styles.platformText, { color: colors.ink2 }]}>
                    {realPlatform ? realPlatform.name : platform.name}
                  </Text>
                </View>

                {/* Duration */}
                {durationLabel && (
                  <Text style={[styles.durationText, { color: colors.muted2 }]}>{durationLabel}</Text>
                )}
              </View>
            </View>

            {/* Synopsis */}
            {mediaItem?.synopsis ? (
              <View style={styles.synopsisBlock}>
                <Text style={[styles.synopsisText, { color: colors.ink2 }]}>{mediaItem.synopsis}</Text>
              </View>
            ) : null}

            {/* Divider */}
            <View style={[styles.divider, { backgroundColor: colors.divider }]} />

            {/* Reviews section */}
            {reviews.length > 0 && (
              <Text style={[styles.sectionTitle, { color: colors.ink }]}>Avis du cercle</Text>
            )}

            {reviews.map((r, i) => (
              <View key={i} style={[styles.reviewCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
                <View style={styles.reviewHeader}>
                  <TouchableOpacity
                    onPress={() => onReviewerPress(r.name, r.initial, r.avatarBg, r.avatarFg)}
                    style={styles.reviewerRow}
                    activeOpacity={0.7}
                  >
                    <Avatar initial={r.initial} bg={r.avatarBg} fg={r.avatarFg} size={32} />
                    <Text style={[styles.reviewerName, { color: colors.ink }]}>{r.name}</Text>
                  </TouchableOpacity>
                  <StarRating value={r.rating} size="sm" />
                </View>
                <Text style={[styles.reviewComment, { color: colors.muted2 }]}>
                  {getCommentForReview(title, r.name)}
                </Text>
              </View>
            ))}

            <View style={{ height: 100 }} />
          </ScrollView>

          {/* Rate button */}
          <View style={[styles.rateButtonContainer, { backgroundColor: colors.background, borderTopColor: colors.divider }]}>
            <TouchableOpacity onPress={() => setShowRating(true)} activeOpacity={0.85} style={styles.rateButtonTouchable}>
              <LinearGradient
                colors={[colors.accent, colors.accentEnd]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.rateButton}
              >
                <Text style={[styles.rateButtonText, { color: colors.onAccent }]}>
                  ★  Noter ce titre
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>

      <RatingModal
        visible={showRating}
        title={title}
        onClose={() => setShowRating(false)}
        onSubmit={() => setShowRating(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  navSpacer: {
    width: 38,
  },
  navTitle: {
    fontFamily: Fonts.semiBold,
    fontSize: 17,
  },
  closeBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    fontSize: 22,
    lineHeight: 26,
    fontFamily: Fonts.regular,
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: 18,
  },
  heroSection: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 20,
  },
  heroInfo: {
    flex: 1,
    minWidth: 0,
  },
  heroTitle: {
    fontFamily: Fonts.bold,
    fontSize: 20,
    lineHeight: 25,
    marginBottom: 6,
  },
  heroSubtitle: {
    fontFamily: Fonts.regular,
    fontSize: 13,
    marginBottom: 12,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  avgScore: {
    fontFamily: Fonts.semiBold,
    fontSize: 28,
    lineHeight: 34,
  },
  platformBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
  },
  platformDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  platformText: {
    fontFamily: Fonts.medium,
    fontSize: 12,
  },
  durationText: {
    fontFamily: Fonts.regular,
    fontSize: 12,
    marginTop: 6,
  },
  synopsisBlock: {
    marginBottom: 16,
  },
  synopsisText: {
    fontFamily: Fonts.regular,
    fontSize: 13.5,
    lineHeight: 20,
  },
  divider: {
    height: 1,
    marginBottom: 20,
  },
  sectionTitle: {
    fontFamily: Fonts.semiBold,
    fontSize: 17,
    marginBottom: 14,
  },
  reviewCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    marginBottom: 10,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  reviewerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  reviewerName: {
    fontFamily: Fonts.semiBold,
    fontSize: 14,
  },
  reviewComment: {
    fontFamily: Fonts.regular,
    fontSize: 13,
    lineHeight: 19,
  },
  rateButtonContainer: {
    paddingHorizontal: 18,
    paddingVertical: 16,
    paddingBottom: 28,
    borderTopWidth: 1,
  },
  rateButtonTouchable: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  rateButton: {
    paddingVertical: 16,
    alignItems: 'center',
    borderRadius: 16,
  },
  rateButtonText: {
    fontFamily: Fonts.semiBold,
    fontSize: 16,
  },
});
