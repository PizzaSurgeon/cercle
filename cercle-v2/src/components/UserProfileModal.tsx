import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import { Fonts } from '../theme';
import { Avatar } from './Avatar';

interface UserProfileModalProps {
  visible: boolean;
  name: string;
  initial: string;
  avatarBg: string;
  avatarFg: string;
  onClose: () => void;
}

interface UserStats {
  films: number;
  avgRating: number;
  series: number;
  anime: number;
}

interface PublicList {
  title: string;
  count: number;
}

function getStatsForName(name: string): UserStats {
  const map: Record<string, UserStats> = {
    Camille: { films: 38, avgRating: 4.1, series: 11, anime: 2 },
    Tom:     { films: 24, avgRating: 3.7, series: 6,  anime: 4 },
    Sofia:   { films: 45, avgRating: 4.3, series: 9,  anime: 7 },
    Léa:     { films: 31, avgRating: 4.0, series: 8,  anime: 3 },
    Maxime:  { films: 52, avgRating: 4.6, series: 14, anime: 5 },
  };
  return map[name] ?? { films: 32, avgRating: 3.8, series: 8, anime: 5 };
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
  return map[name] ?? [
    { title: 'Ma liste', count: 12 },
    { title: 'Favoris', count: 7 },
  ];
}

export function UserProfileModal({ visible, name, initial, avatarBg, avatarFg, onClose }: UserProfileModalProps) {
  const { colors } = useTheme();
  const stats = getStatsForName(name);
  const lists = getListsForName(name);

  return (
    <Modal visible={visible} animationType="slide" transparent presentationStyle="overFullScreen" statusBarTranslucent>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable
          style={[styles.sheet, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
          onPress={() => {}}
        >
          {/* Drag handle */}
          <View style={[styles.handle, { backgroundColor: colors.muted }]} />

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View style={styles.headerSection}>
              <LinearGradient
                colors={[colors.accent, colors.accentEnd]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.avatarGradient}
              >
                <Text style={[styles.avatarLetter, { color: colors.onAccent }]}>{initial}</Text>
              </LinearGradient>
              <Text style={[styles.userName, { color: colors.ink }]}>{name}</Text>
              <Text style={[styles.memberSince, { color: colors.muted }]}>Membre depuis 2023</Text>
            </View>

            {/* Stats grid */}
            <View style={[styles.statsGrid, { borderColor: colors.cardBorder }]}>
              <View style={[styles.statCell, { borderRightWidth: 1, borderBottomWidth: 1, borderColor: colors.cardBorder }]}>
                <Text style={[styles.statValue, { color: colors.ink }]}>{stats.films}</Text>
                <Text style={[styles.statLabel, { color: colors.muted }]}>films</Text>
              </View>
              <View style={[styles.statCell, { borderBottomWidth: 1, borderColor: colors.cardBorder }]}>
                <Text style={[styles.statValue, { color: colors.starFill }]}>{stats.avgRating.toFixed(1).replace('.', ',')}★</Text>
                <Text style={[styles.statLabel, { color: colors.muted }]}>note moy.</Text>
              </View>
              <View style={[styles.statCell, { borderRightWidth: 1, borderColor: colors.cardBorder }]}>
                <Text style={[styles.statValue, { color: colors.ink }]}>{stats.series}</Text>
                <Text style={[styles.statLabel, { color: colors.muted }]}>séries</Text>
              </View>
              <View style={styles.statCell}>
                <Text style={[styles.statValue, { color: colors.ink }]}>{stats.anime}</Text>
                <Text style={[styles.statLabel, { color: colors.muted }]}>animés</Text>
              </View>
            </View>

            {/* Public lists */}
            <View style={styles.listsSection}>
              <Text style={[styles.sectionTitle, { color: colors.ink }]}>Listes publiques</Text>
              {lists.map((list, i) => (
                <View key={i} style={[styles.listItem, { borderColor: colors.divider }]}>
                  <Text style={[styles.listTitle, { color: colors.ink2 }]}>{list.title}</Text>
                  <Text style={[styles.listCount, { color: colors.muted }]}>{list.count} entrées</Text>
                </View>
              ))}
            </View>
          </ScrollView>

          {/* Close button */}
          <TouchableOpacity
            onPress={onClose}
            style={[styles.closeButton, { borderColor: colors.cardBorder, backgroundColor: colors.chip }]}
            activeOpacity={0.75}
          >
            <Text style={[styles.closeButtonText, { color: colors.ink2 }]}>Fermer</Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    paddingHorizontal: 20,
    paddingBottom: 32,
    paddingTop: 12,
    maxHeight: '85%',
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
    opacity: 0.4,
  },
  headerSection: {
    alignItems: 'center',
    paddingBottom: 24,
  },
  avatarGradient: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  avatarLetter: {
    fontFamily: Fonts.bold,
    fontSize: 28,
  },
  userName: {
    fontFamily: Fonts.semiBold,
    fontSize: 22,
    marginBottom: 4,
  },
  memberSince: {
    fontFamily: Fonts.regular,
    fontSize: 13,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderWidth: 1,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 24,
  },
  statCell: {
    width: '50%',
    paddingVertical: 18,
    alignItems: 'center',
  },
  statValue: {
    fontFamily: Fonts.semiBold,
    fontSize: 24,
    marginBottom: 4,
  },
  statLabel: {
    fontFamily: Fonts.regular,
    fontSize: 12,
  },
  listsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: Fonts.semiBold,
    fontSize: 16,
    marginBottom: 12,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 13,
    borderBottomWidth: 1,
  },
  listTitle: {
    fontFamily: Fonts.medium,
    fontSize: 14,
  },
  listCount: {
    fontFamily: Fonts.regular,
    fontSize: 12,
  },
  closeButton: {
    borderWidth: 1,
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 4,
  },
  closeButtonText: {
    fontFamily: Fonts.semiBold,
    fontSize: 15,
  },
});
