import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import { Fonts } from '../theme';

interface RatingModalProps {
  visible: boolean;
  title: string;
  onClose: () => void;
  onSubmit: (rating: number, comment: string, platform: string, recommend: 'cercle' | 'amis' | 'none') => void;
}

const PLATFORMS = [
  'Netflix',
  'Prime Video',
  'Disney+',
  'Apple TV+',
  'Canal+',
  'Crunchyroll',
  'Salle',
  'Autre',
];

const RECOMMEND_OPTIONS: { key: 'cercle' | 'amis' | 'none'; label: string; emoji: string }[] = [
  { key: 'cercle', label: 'Mon cercle', emoji: '○' },
  { key: 'amis', label: 'Amis proches', emoji: '♡' },
  { key: 'none', label: 'Ne pas recommander', emoji: '—' },
];

function StarSelector({ rating, onRate }: { rating: number; onRate: (r: number) => void }) {
  const { colors } = useTheme();

  return (
    <View style={starStyles.row}>
      {[1, 2, 3, 4, 5].map((star) => {
        const full = rating >= star;
        const half = !full && rating >= star - 0.5;

        return (
          <View key={star} style={starStyles.starWrapper}>
            {/* Half left */}
            <TouchableOpacity
              style={starStyles.halfLeft}
              onPress={() => onRate(star - 0.5)}
              activeOpacity={0.6}
            >
              <Text style={[starStyles.starBase, { color: colors.starEmpty }]}>★</Text>
              {(full || half) && (
                <View style={[starStyles.halfOverlay, { width: '50%' }]}>
                  <Text style={[starStyles.starBase, { color: colors.starFill }]}>★</Text>
                </View>
              )}
            </TouchableOpacity>
            {/* Half right */}
            <TouchableOpacity
              style={starStyles.halfRight}
              onPress={() => onRate(star)}
              activeOpacity={0.6}
            >
              {full && (
                <View style={[starStyles.halfOverlay, { width: '100%', left: 0 }]}>
                  <Text style={[starStyles.starBase, { color: colors.starFill }]}>★</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        );
      })}
    </View>
  );
}

const starStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
  },
  starWrapper: {
    width: 48,
    height: 48,
    position: 'relative',
  },
  starBase: {
    fontSize: 42,
    lineHeight: 48,
  },
  halfLeft: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '50%',
    height: '100%',
    overflow: 'hidden',
  },
  halfRight: {
    position: 'absolute',
    right: 0,
    top: 0,
    width: '50%',
    height: '100%',
    overflow: 'hidden',
  },
  halfOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    overflow: 'hidden',
  },
});

export function RatingModal({ visible, title, onClose, onSubmit }: RatingModalProps) {
  const { colors } = useTheme();

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [platform, setPlatform] = useState('');
  const [recommend, setRecommend] = useState<'cercle' | 'amis' | 'none'>('cercle');

  const canSubmit = rating > 0;

  const handleSubmit = () => {
    if (!canSubmit) return;
    onSubmit(rating, comment, platform, recommend);
    // Reset state
    setRating(0);
    setComment('');
    setPlatform('');
    setRecommend('cercle');
  };

  const handleClose = () => {
    setRating(0);
    setComment('');
    setPlatform('');
    setRecommend('cercle');
    onClose();
  };

  const ratingLabel = rating === 0
    ? 'Sélectionne une note'
    : rating % 1 !== 0
    ? `${rating.toFixed(1).replace('.', ',')} étoiles`
    : `${rating} étoile${rating > 1 ? 's' : ''}`;

  return (
    <Modal visible={visible} animationType="slide" transparent statusBarTranslucent>
      <Pressable style={styles.backdrop} onPress={handleClose}>
        <Pressable
          style={[styles.sheet, { backgroundColor: colors.background, borderColor: colors.cardBorder }]}
          onPress={() => {}}
        >
          {/* Handle */}
          <View style={[styles.handle, { backgroundColor: colors.muted }]} />

          {/* Header */}
          <View style={[styles.header, { borderBottomColor: colors.divider }]}>
            <Text style={[styles.headerTitle, { color: colors.ink }]} numberOfLines={1}>{title}</Text>
            <TouchableOpacity
              onPress={handleClose}
              style={[styles.closeBtn, { backgroundColor: colors.chip, borderColor: colors.cardBorder }]}
              activeOpacity={0.7}
            >
              <Text style={[styles.closeBtnText, { color: colors.muted }]}>×</Text>
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

            {/* Stars */}
            <View style={styles.section}>
              <Text style={[styles.sectionLabel, { color: colors.ink }]}>Ta note</Text>
              <StarSelector rating={rating} onRate={setRating} />
              <Text style={[styles.ratingLabel, { color: rating > 0 ? colors.starFill : colors.muted }]}>
                {ratingLabel}
              </Text>
            </View>

            {/* Comment */}
            <View style={styles.section}>
              <Text style={[styles.sectionLabel, { color: colors.ink }]}>Ton avis</Text>
              <View style={[styles.textInputWrapper, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
                <TextInput
                  value={comment}
                  onChangeText={setComment}
                  placeholder="Ton avis... (140 car. max)"
                  placeholderTextColor={colors.muted}
                  multiline
                  maxLength={140}
                  style={[styles.textInput, { color: colors.ink }]}
                />
                <Text style={[styles.charCount, { color: colors.muted }]}>{comment.length}/140</Text>
              </View>
            </View>

            {/* Platform */}
            <View style={styles.section}>
              <Text style={[styles.sectionLabel, { color: colors.ink }]}>Plateforme de visionnage</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsRow}>
                {PLATFORMS.map((p) => {
                  const isActive = platform === p;
                  return isActive ? (
                    <TouchableOpacity key={p} onPress={() => setPlatform('')} activeOpacity={0.75}>
                      <LinearGradient
                        colors={[colors.accent, colors.accentEnd]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.chipActive}
                      >
                        <Text style={[styles.chipTextActive, { color: colors.onAccent }]}>{p}</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      key={p}
                      onPress={() => setPlatform(p)}
                      activeOpacity={0.75}
                      style={[styles.chip, { backgroundColor: colors.chip, borderColor: colors.chipBorder }]}
                    >
                      <Text style={[styles.chipText, { color: colors.chipText }]}>{p}</Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>

            {/* Recommend */}
            <View style={styles.section}>
              <Text style={[styles.sectionLabel, { color: colors.ink }]}>Recommander à</Text>
              <View style={styles.recommendRow}>
                {RECOMMEND_OPTIONS.map((opt) => {
                  const isActive = recommend === opt.key;
                  return (
                    <TouchableOpacity
                      key={opt.key}
                      onPress={() => setRecommend(opt.key)}
                      activeOpacity={0.75}
                      style={[
                        styles.recommendChip,
                        {
                          backgroundColor: isActive ? colors.accent + '22' : colors.chip,
                          borderColor: isActive ? colors.accent : colors.chipBorder,
                        },
                      ]}
                    >
                      <Text style={[styles.recommendEmoji, { color: isActive ? colors.accent : colors.muted }]}>
                        {opt.emoji}
                      </Text>
                      <Text style={[styles.recommendLabel, { color: isActive ? colors.accent : colors.ink2 }]}>
                        {opt.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <View style={{ height: 20 }} />
          </ScrollView>

          {/* Submit */}
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={!canSubmit}
            activeOpacity={canSubmit ? 0.85 : 1}
            style={styles.submitTouchable}
          >
            <LinearGradient
              colors={canSubmit ? [colors.accent, colors.accentEnd] : [colors.track, colors.track]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.submitButton}
            >
              <Text style={[styles.submitText, { color: canSubmit ? colors.onAccent : colors.muted }]}>
                Publier
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    paddingHorizontal: 18,
    paddingBottom: 32,
    paddingTop: 12,
    maxHeight: '92%',
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
    opacity: 0.4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 14,
    borderBottomWidth: 1,
    marginBottom: 8,
  },
  headerTitle: {
    fontFamily: Fonts.semiBold,
    fontSize: 16,
    flex: 1,
    marginRight: 12,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    fontSize: 22,
    lineHeight: 26,
    fontFamily: Fonts.regular,
  },
  scrollContent: {
    paddingTop: 8,
  },
  section: {
    marginBottom: 22,
  },
  sectionLabel: {
    fontFamily: Fonts.semiBold,
    fontSize: 14,
    marginBottom: 10,
  },
  ratingLabel: {
    fontFamily: Fonts.medium,
    fontSize: 13,
    textAlign: 'center',
    marginTop: 4,
  },
  textInputWrapper: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 12,
    minHeight: 90,
  },
  textInput: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    lineHeight: 20,
    minHeight: 60,
    textAlignVertical: 'top',
  },
  charCount: {
    fontFamily: Fonts.regular,
    fontSize: 11,
    textAlign: 'right',
    marginTop: 4,
  },
  chipsRow: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 2,
  },
  chip: {
    paddingVertical: 9,
    paddingHorizontal: 15,
    borderRadius: 999,
    borderWidth: 1,
  },
  chipActive: {
    paddingVertical: 9,
    paddingHorizontal: 15,
    borderRadius: 999,
  },
  chipText: {
    fontFamily: Fonts.regular,
    fontSize: 13,
  },
  chipTextActive: {
    fontFamily: Fonts.semiBold,
    fontSize: 13,
  },
  recommendRow: {
    flexDirection: 'row',
    gap: 8,
  },
  recommendChip: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
    gap: 4,
  },
  recommendEmoji: {
    fontSize: 18,
  },
  recommendLabel: {
    fontFamily: Fonts.medium,
    fontSize: 11,
    textAlign: 'center',
  },
  submitTouchable: {
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 8,
  },
  submitButton: {
    paddingVertical: 16,
    alignItems: 'center',
    borderRadius: 16,
  },
  submitText: {
    fontFamily: Fonts.semiBold,
    fontSize: 16,
  },
});
