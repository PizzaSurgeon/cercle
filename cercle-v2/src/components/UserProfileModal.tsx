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
import { ChevronIcon } from './Icons';

interface UserProfileModalProps {
  visible: boolean;
  name: string;
  initial: string;
  avatarBg: string;
  avatarFg: string;
  onClose: () => void;
}

interface UserWatched {
  films: number;
  series: number;
  anime: number;
  avgRating: number;
}

interface PublicList {
  title: string;
  count: number;
}

function getWatchedForName(name: string): UserWatched {
  const map: Record<string, UserWatched> = {
    Camille: { films: 38, series: 11, anime: 2,  avgRating: 4.1 },
    Tom:     { films: 24, series: 6,  anime: 4,  avgRating: 3.7 },
    Sofia:   { films: 45, series: 9,  anime: 7,  avgRating: 4.3 },
    Léa:     { films: 31, series: 8,  anime: 3,  avgRating: 4.0 },
    Maxime:  { films: 52, series: 14, anime: 5,  avgRating: 4.6 },
  };
  return map[name] ?? { films: 32, series: 8, anime: 5, avgRating: 3.8 };
}

function getListsForName(name: string): PublicList[] {
  const map: Record<string, PublicList[]> = {
    Camille: [
      { title: 'Mes drames préférés', count: 14 },
      { title: 'Classiques à voir', count: 22 },
      { title: 'Coups de cœur 2024', count: 8 },
    ],
    Tom: [
      { title: 'SF incontournables', count: 18 },
      { title: 'Films d\'action', count: 11 },
    ],
    Sofia: [
      { title: 'Animés du moment', count: 9 },
      { title: 'Séries à finir', count: 6 },
      { title: 'Documentaires', count: 13 },
    ],
    Léa: [
      { title: 'Comédies romantiques', count: 17 },
      { title: 'Films de 2023', count: 20 },
    ],
    Maxime: [
      { title: 'Ma cinémathèque perso', count: 41 },
      { title: 'Films à conseiller', count: 15 },
      { title: 'Top Nolan', count: 7 },
    ],
  };
  return map[name] ?? [{ title: 'Ma liste', count: 12 }];
}

export function UserProfileModal({ visible, name, initial, avatarBg, avatarFg, onClose }: UserProfileModalProps) {
  const { colors } = useTheme();
  const watched = getWatchedForName(name);
  const lists = getListsForName(name);

  const watchedRows = [
    { label: 'Films',  count: watched.films },
    { label: 'Séries', count: watched.series },
    { label: 'Animés', count: watched.anime },
  ];

  return (
    <Modal visible={visible} animationType="slide" statusBarTranslucent>
      <SafeAreaView style={[styles.screen, { backgroundColor: colors.background }]}>
        {/* Navbar */}
        <View style={[styles.navbar, { borderBottomColor: colors.divider }]}>
          <View style={styles.navSpacer} />
          <Text style={[styles.navTitle, { color: colors.ink }]}>Profil</Text>
          <TouchableOpacity
            onPress={onClose}
            style={[styles.closeBtn, { backgroundColor: colors.chip, borderColor: colors.cardBorder }]}
            activeOpacity={0.7}
          >
            <Text style={[styles.closeBtnText, { color: colors.muted }]}>×</Text>
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
          {/* Avatar + name */}
          <View style={styles.profileHeader}>
            <Avatar initial={initial} bg={avatarBg} fg={avatarFg} size={72} />
            <Text style={[styles.userName, { color: colors.ink }]}>{name}</Text>
            <Text style={[styles.userMeta, { color: colors.muted2 }]}>Membre depuis 2023</Text>
          </View>

          {/* Vus */}
          <Text style={[styles.sectionLabel, { color: colors.muted2 }]}>VUS</Text>
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
            {watchedRows.map((row, i, arr) => (
              <View
                key={row.label}
                style={[
                  styles.watchedRow,
                  i < arr.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.divider },
                ]}
              >
                <Text style={[styles.watchedLabel, { color: colors.ink }]}>{row.label}</Text>
                <Text style={[styles.watchedCount, { color: colors.muted2 }]}>{row.count} titres</Text>
              </View>
            ))}
          </View>

          {/* Note moyenne */}
          <Text style={[styles.sectionLabel, { color: colors.muted2 }]}>NOTE MOYENNE</Text>
          <View style={[styles.card, styles.ratingCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
            <Text style={[styles.avgRatingValue, { color: colors.starFill }]}>
              {watched.avgRating.toFixed(1).replace('.', ',')}
            </Text>
            <StarRating value={watched.avgRating} size="md" />
          </View>

          {/* Listes publiques */}
          {lists.length > 0 && (
            <>
              <Text style={[styles.sectionLabel, { color: colors.muted2 }]}>LISTES PUBLIQUES</Text>
              <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
                {lists.map((list, i, arr) => (
                  <TouchableOpacity
                    key={i}
                    activeOpacity={0.7}
                    style={[
                      styles.listRow,
                      i < arr.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.divider },
                    ]}
                  >
                    <View style={styles.listInfo}>
                      <Text style={[styles.listTitle, { color: colors.ink }]}>{list.title}</Text>
                      <Text style={[styles.listCount, { color: colors.muted2 }]}>{list.count} entrées</Text>
                    </View>
                    <ChevronIcon color={colors.muted2} size={15} />
                  </TouchableOpacity>
                ))}
              </View>
            </>
          )}

          <View style={{ height: 32 }} />
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  navbar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 18, paddingVertical: 14, borderBottomWidth: 1,
  },
  navSpacer: { width: 38 },
  navTitle: { fontFamily: Fonts.semiBold, fontSize: 17 },
  closeBtn: {
    width: 38, height: 38, borderRadius: 19, borderWidth: 1,
    alignItems: 'center', justifyContent: 'center',
  },
  closeBtnText: { fontSize: 22, lineHeight: 26, fontFamily: Fonts.regular },

  content: { padding: 18, paddingBottom: 40 },

  profileHeader: { alignItems: 'center', marginBottom: 28 },
  userName: { fontFamily: Fonts.semiBold, fontSize: 22, marginTop: 14, marginBottom: 4 },
  userMeta: { fontFamily: Fonts.regular, fontSize: 13 },

  sectionLabel: {
    fontFamily: Fonts.semiBold, fontSize: 11, letterSpacing: 0.8,
    marginBottom: 8, paddingLeft: 4,
  },
  card: {
    borderRadius: 18, borderWidth: 1, marginBottom: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: 9 },
    shadowOpacity: 0.45, shadowRadius: 20, elevation: 6,
  },

  watchedRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 15,
  },
  watchedLabel: { fontFamily: Fonts.semiBold, fontSize: 15 },
  watchedCount: { fontFamily: Fonts.regular, fontSize: 13 },

  ratingCard: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    paddingHorizontal: 18, paddingVertical: 18,
  },
  avgRatingValue: { fontFamily: Fonts.semiBold, fontSize: 32, lineHeight: 36 },

  listRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 14, gap: 12,
  },
  listInfo: { flex: 1 },
  listTitle: { fontFamily: Fonts.semiBold, fontSize: 14, lineHeight: 18 },
  listCount: { fontFamily: Fonts.regular, fontSize: 12, marginTop: 2 },
});
