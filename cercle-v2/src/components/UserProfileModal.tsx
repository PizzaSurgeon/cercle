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
import { useTheme } from '../context/ThemeContext';
import { Fonts } from '../theme';
import { Avatar } from './Avatar';
import { StarRating } from './StarRating';
import { ChevronIcon } from './Icons';
import { MediaPoster } from './MediaPoster';

interface UserProfileModalProps {
  visible: boolean;
  name: string;
  initial: string;
  avatarBg: string;
  avatarFg: string;
  onClose: () => void;
}

type WatchedType = 'movie' | 'tv' | 'anime';

interface TitleItem {
  title: string;
  year: string;
  rating?: number;
  label: string;
  colors: [string, string];
}

interface UserData {
  watched: Record<WatchedType, { count: number; titles: TitleItem[] }>;
  lists: Array<{ name: string; count: number; titles: TitleItem[] }>;
  avgRating: number;
}

const USER_DATA: Record<string, UserData> = {
  Camille: {
    avgRating: 4.1,
    watched: {
      movie: {
        count: 38,
        titles: [
          { title: 'Dune : Deuxième Partie', year: '2024', rating: 4.5, label: 'DUNE 2',     colors: ['#D9925A', '#A24123'] },
          { title: 'Past Lives',             year: '2023', rating: 4.8, label: 'PAST\nLIVES', colors: ['#8FA0B8', '#4E5E78'] },
          { title: 'Poor Things',            year: '2023', rating: 4.0, label: 'POOR\nTHINGS',colors: ['#E0B24C', '#B07A1E'] },
          { title: 'Oppenheimer',            year: '2023', rating: 3.8, label: 'OPPEN',       colors: ['#4A3828', '#1E1510'] },
        ],
      },
      tv: {
        count: 11,
        titles: [
          { title: 'Shōgun',     year: '2024', rating: 4.5, label: 'SHŌGUN',    colors: ['#3E5C6B', '#1E2E38'] },
          { title: 'The Bear',   year: '2024', rating: 3.8, label: 'THE\nBEAR', colors: ['#C85A3C', '#7E2A1C'] },
          { title: 'Succession', year: '2023', rating: 5.0, label: 'SUCC.',     colors: ['#2A3E28', '#182314'] },
        ],
      },
      anime: {
        count: 2,
        titles: [
          { title: 'Frieren', year: '2023', rating: 4.7, label: 'FRIEREN', colors: ['#9FB07A', '#5E7048'] },
        ],
      },
    },
    lists: [
      {
        name: 'Mes drames préférés', count: 14,
        titles: [
          { title: 'Past Lives',  year: '2023', label: 'PAST\nLIVES', colors: ['#8FA0B8', '#4E5E78'] },
          { title: 'Aftersun',    year: '2022', label: 'AFTER\nSUN',  colors: ['#7BA0C8', '#3E5E78'] },
          { title: 'Poor Things', year: '2023', label: 'POOR\nTHINGS',colors: ['#E0B24C', '#B07A1E'] },
        ],
      },
      {
        name: 'Classiques à voir', count: 22,
        titles: [
          { title: 'Mulholland Drive', year: '2001', label: 'M.D.',   colors: ['#4A3060', '#200A30'] },
          { title: '2001 : L\'Odyssée de l\'espace', year: '1968', label: '2001', colors: ['#1A2840', '#080E18'] },
        ],
      },
      {
        name: 'Coups de cœur 2024', count: 8,
        titles: [
          { title: 'Dune : Deuxième Partie', year: '2024', label: 'DUNE 2', colors: ['#D9925A', '#A24123'] },
          { title: 'Shōgun',                year: '2024', label: 'SHŌGUN', colors: ['#3E5C6B', '#1E2E38'] },
        ],
      },
    ],
  },
  Tom: {
    avgRating: 3.7,
    watched: {
      movie: {
        count: 24,
        titles: [
          { title: 'Oppenheimer',            year: '2023', rating: 4.6, label: 'OPPEN',       colors: ['#4A3828', '#1E1510'] },
          { title: 'Dune : Deuxième Partie', year: '2024', rating: 4.7, label: 'DUNE 2',      colors: ['#D9925A', '#A24123'] },
          { title: 'The Banshees of Inisherin', year: '2022', rating: 3.5, label: 'BANSH.',   colors: ['#5A7060', '#2A3830'] },
        ],
      },
      tv: {
        count: 6,
        titles: [
          { title: 'Shōgun',         year: '2024', rating: 4.0, label: 'SHŌGUN',    colors: ['#3E5C6B', '#1E2E38'] },
          { title: 'Severance',      year: '2022', rating: 4.6, label: 'SEV.',      colors: ['#4A4E6B', '#22253A'] },
          { title: 'The Last of Us', year: '2023', rating: 3.8, label: 'TLOU',      colors: ['#4A6B3A', '#2A3E20'] },
        ],
      },
      anime: {
        count: 4,
        titles: [
          { title: 'Jujutsu Kaisen', year: '2023', rating: 4.3, label: 'JJK',    colors: ['#6B5B8A', '#2E2740'] },
          { title: 'Vinland Saga',   year: '2022', rating: 4.5, label: 'V.SAGA', colors: ['#8A6B4A', '#4A3020'] },
        ],
      },
    },
    lists: [
      {
        name: 'SF incontournables', count: 18,
        titles: [
          { title: 'Dune : Deuxième Partie', year: '2024', label: 'DUNE 2', colors: ['#D9925A', '#A24123'] },
          { title: 'Oppenheimer',            year: '2023', label: 'OPPEN',  colors: ['#4A3828', '#1E1510'] },
          { title: '2001 : L\'Odyssée de l\'espace', year: '1968', label: '2001', colors: ['#1A2840', '#080E18'] },
        ],
      },
      {
        name: 'Films d\'action', count: 11,
        titles: [
          { title: 'Mad Max: Fury Road', year: '2015', label: 'MAD\nMAX',  colors: ['#B04020', '#601810'] },
          { title: 'Mission: Impossible', year: '2023', label: 'M:I',      colors: ['#2A3860', '#101830'] },
        ],
      },
    ],
  },
  Sofia: {
    avgRating: 4.3,
    watched: {
      movie: {
        count: 45,
        titles: [
          { title: 'Poor Things', year: '2023', rating: 4.5, label: 'POOR\nTHINGS', colors: ['#E0B24C', '#B07A1E'] },
          { title: 'Past Lives',  year: '2023', rating: 4.2, label: 'PAST\nLIVES',  colors: ['#8FA0B8', '#4E5E78'] },
          { title: 'Aftersun',    year: '2022', rating: 4.6, label: 'AFTER\nSUN',   colors: ['#7BA0C8', '#3E5E78'] },
          { title: 'Oppenheimer', year: '2023', rating: 4.0, label: 'OPPEN',        colors: ['#4A3828', '#1E1510'] },
        ],
      },
      tv: {
        count: 9,
        titles: [
          { title: 'Shōgun',         year: '2024', rating: 4.3, label: 'SHŌGUN', colors: ['#3E5C6B', '#1E2E38'] },
          { title: 'Severance',      year: '2022', rating: 4.8, label: 'SEV.',   colors: ['#4A4E6B', '#22253A'] },
          { title: 'The Last of Us', year: '2023', rating: 4.4, label: 'TLOU',   colors: ['#4A6B3A', '#2A3E20'] },
        ],
      },
      anime: {
        count: 7,
        titles: [
          { title: 'Attack on Titan', year: '2023', rating: 5.0, label: 'AOT',     colors: ['#6B3E2E', '#3A1A12'] },
          { title: 'Frieren',         year: '2023', rating: 4.7, label: 'FRIEREN', colors: ['#9FB07A', '#5E7048'] },
          { title: 'Jujutsu Kaisen',  year: '2023', rating: 4.2, label: 'JJK',     colors: ['#6B5B8A', '#2E2740'] },
        ],
      },
    },
    lists: [
      {
        name: 'Animés du moment', count: 9,
        titles: [
          { title: 'Attack on Titan', year: '2023', label: 'AOT',     colors: ['#6B3E2E', '#3A1A12'] },
          { title: 'Frieren',         year: '2023', label: 'FRIEREN', colors: ['#9FB07A', '#5E7048'] },
          { title: 'Jujutsu Kaisen',  year: '2023', label: 'JJK',     colors: ['#6B5B8A', '#2E2740'] },
        ],
      },
      {
        name: 'Séries à finir', count: 6,
        titles: [
          { title: 'Severance',  year: '2022', label: 'SEV.',  colors: ['#4A4E6B', '#22253A'] },
          { title: 'The Bear',   year: '2024', label: 'THE\nBEAR', colors: ['#C85A3C', '#7E2A1C'] },
        ],
      },
      {
        name: 'Documentaires', count: 13,
        titles: [
          { title: 'Free Solo',     year: '2018', label: 'FREE\nSOLO',  colors: ['#8A9EA8', '#4A5E68'] },
          { title: 'The Last Dance',year: '2020', label: 'TLD',          colors: ['#1A1A2A', '#080810'] },
        ],
      },
    ],
  },
  Léa: {
    avgRating: 4.0,
    watched: {
      movie: {
        count: 31,
        titles: [
          { title: 'Dune : Deuxième Partie', year: '2024', rating: 4.8, label: 'DUNE 2',      colors: ['#D9925A', '#A24123'] },
          { title: 'Past Lives',             year: '2023', rating: 4.5, label: 'PAST\nLIVES', colors: ['#8FA0B8', '#4E5E78'] },
          { title: 'Poor Things',            year: '2023', rating: 3.8, label: 'POOR\nTHINGS',colors: ['#E0B24C', '#B07A1E'] },
        ],
      },
      tv: {
        count: 8,
        titles: [
          { title: 'The Last of Us', year: '2023', rating: 4.6, label: 'TLOU',      colors: ['#4A6B3A', '#2A3E20'] },
          { title: 'Succession',     year: '2023', rating: 4.8, label: 'SUCC.',     colors: ['#2A3E28', '#182314'] },
          { title: 'The Bear',       year: '2024', rating: 3.5, label: 'THE\nBEAR', colors: ['#C85A3C', '#7E2A1C'] },
        ],
      },
      anime: {
        count: 3,
        titles: [
          { title: 'Attack on Titan', year: '2023', rating: 4.5, label: 'AOT',     colors: ['#6B3E2E', '#3A1A12'] },
          { title: 'Vinland Saga',    year: '2022', rating: 4.3, label: 'V.SAGA',  colors: ['#8A6B4A', '#4A3020'] },
        ],
      },
    },
    lists: [
      {
        name: 'Comédies romantiques', count: 17,
        titles: [
          { title: 'Past Lives',   year: '2023', label: 'PAST\nLIVES', colors: ['#8FA0B8', '#4E5E78'] },
          { title: 'About Time',   year: '2013', label: 'ABOUT\nTIME', colors: ['#A0B888', '#507040'] },
          { title: 'La La Land',   year: '2016', label: 'LA LA\nLAND', colors: ['#E8C880', '#B88820'] },
        ],
      },
      {
        name: 'Films de 2023', count: 20,
        titles: [
          { title: 'Dune : Deuxième Partie', year: '2024', label: 'DUNE 2',       colors: ['#D9925A', '#A24123'] },
          { title: 'Poor Things',            year: '2023', label: 'POOR\nTHINGS', colors: ['#E0B24C', '#B07A1E'] },
          { title: 'Past Lives',             year: '2023', label: 'PAST\nLIVES',  colors: ['#8FA0B8', '#4E5E78'] },
        ],
      },
    ],
  },
  Maxime: {
    avgRating: 4.6,
    watched: {
      movie: {
        count: 52,
        titles: [
          { title: 'Dune : Deuxième Partie', year: '2024', rating: 5.0, label: 'DUNE 2',      colors: ['#D9925A', '#A24123'] },
          { title: 'Oppenheimer',            year: '2023', rating: 4.8, label: 'OPPEN',       colors: ['#4A3828', '#1E1510'] },
          { title: 'Past Lives',             year: '2023', rating: 4.5, label: 'PAST\nLIVES', colors: ['#8FA0B8', '#4E5E78'] },
          { title: 'Poor Things',            year: '2023', rating: 4.3, label: 'POOR\nTHINGS',colors: ['#E0B24C', '#B07A1E'] },
        ],
      },
      tv: {
        count: 14,
        titles: [
          { title: 'Shōgun',         year: '2024', rating: 4.5, label: 'SHŌGUN',   colors: ['#3E5C6B', '#1E2E38'] },
          { title: 'Severance',      year: '2022', rating: 5.0, label: 'SEV.',     colors: ['#4A4E6B', '#22253A'] },
          { title: 'Succession',     year: '2023', rating: 5.0, label: 'SUCC.',    colors: ['#2A3E28', '#182314'] },
          { title: 'The Last of Us', year: '2023', rating: 4.2, label: 'TLOU',     colors: ['#4A6B3A', '#2A3E20'] },
        ],
      },
      anime: {
        count: 5,
        titles: [
          { title: 'Attack on Titan', year: '2023', rating: 4.8, label: 'AOT',     colors: ['#6B3E2E', '#3A1A12'] },
          { title: 'Frieren',         year: '2023', rating: 4.6, label: 'FRIEREN', colors: ['#9FB07A', '#5E7048'] },
          { title: 'Jujutsu Kaisen',  year: '2023', rating: 4.3, label: 'JJK',     colors: ['#6B5B8A', '#2E2740'] },
        ],
      },
    },
    lists: [
      {
        name: 'Ma cinémathèque perso', count: 41,
        titles: [
          { title: 'Dune : Deuxième Partie', year: '2024', label: 'DUNE 2', colors: ['#D9925A', '#A24123'] },
          { title: 'Oppenheimer',            year: '2023', label: 'OPPEN',  colors: ['#4A3828', '#1E1510'] },
          { title: 'Severance',              year: '2022', label: 'SEV.',   colors: ['#4A4E6B', '#22253A'] },
        ],
      },
      {
        name: 'Films à conseiller', count: 15,
        titles: [
          { title: 'Past Lives',  year: '2023', label: 'PAST\nLIVES',  colors: ['#8FA0B8', '#4E5E78'] },
          { title: 'Poor Things', year: '2023', label: 'POOR\nTHINGS', colors: ['#E0B24C', '#B07A1E'] },
          { title: 'Aftersun',    year: '2022', label: 'AFTER\nSUN',   colors: ['#7BA0C8', '#3E5E78'] },
        ],
      },
      {
        name: 'Top Nolan', count: 7,
        titles: [
          { title: 'Oppenheimer',   year: '2023', label: 'OPPEN',  colors: ['#4A3828', '#1E1510'] },
          { title: 'Interstellar',  year: '2014', label: 'INTER.',  colors: ['#1A2440', '#080E18'] },
          { title: 'The Prestige',  year: '2006', label: 'PREST.', colors: ['#303840', '#101418'] },
        ],
      },
    ],
  },
};

const DEFAULT_USER_DATA: UserData = {
  avgRating: 3.8,
  watched: {
    movie: { count: 32, titles: [{ title: 'Dune : Deuxième Partie', year: '2024', rating: 4.0, label: 'DUNE 2', colors: ['#D9925A', '#A24123'] }] },
    tv:    { count: 8,  titles: [{ title: 'Shōgun', year: '2024', rating: 4.0, label: 'SHŌGUN', colors: ['#3E5C6B', '#1E2E38'] }] },
    anime: { count: 5,  titles: [{ title: 'Frieren', year: '2023', rating: 4.0, label: 'FRIEREN', colors: ['#9FB07A', '#5E7048'] }] },
  },
  lists: [{ name: 'Ma liste', count: 12, titles: [] }],
};

const TYPE_LABELS: Record<WatchedType, string> = { movie: 'Films', tv: 'Séries', anime: 'Animés' };
const TYPES: WatchedType[] = ['movie', 'tv', 'anime'];

export function UserProfileModal({ visible, name, initial, avatarBg, avatarFg, onClose }: UserProfileModalProps) {
  const { colors } = useTheme();
  const data = USER_DATA[name] ?? DEFAULT_USER_DATA;

  const [expandedTypes, setExpandedTypes] = useState<Set<WatchedType>>(new Set());
  const [expandedLists, setExpandedLists] = useState<Set<string>>(new Set());

  const toggleType = (type: WatchedType) => {
    setExpandedTypes(prev => {
      const next = new Set(prev);
      if (next.has(type)) next.delete(type); else next.add(type);
      return next;
    });
  };

  const toggleList = (listName: string) => {
    setExpandedLists(prev => {
      const next = new Set(prev);
      if (next.has(listName)) next.delete(listName); else next.add(listName);
      return next;
    });
  };

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
          {/* Header */}
          <View style={styles.profileHeader}>
            <Avatar initial={initial} bg={avatarBg} fg={avatarFg} size={72} />
            <Text style={[styles.userName, { color: colors.ink }]}>{name}</Text>
            <Text style={[styles.userMeta, { color: colors.muted2 }]}>Membre depuis 2023</Text>
          </View>

          {/* Vus */}
          <Text style={[styles.sectionLabel, { color: colors.muted2 }]}>VUS</Text>
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
            {TYPES.map((type, i, arr) => {
              const section = data.watched[type];
              const isExpanded = expandedTypes.has(type);
              const isLast = i === arr.length - 1;
              return (
                <View key={type}>
                  <TouchableOpacity
                    onPress={() => toggleType(type)}
                    activeOpacity={0.7}
                    style={[
                      styles.sectionRow,
                      !isLast && !isExpanded && { borderBottomWidth: 1, borderBottomColor: colors.divider },
                    ]}
                  >
                    <Text style={[styles.sectionRowLabel, { color: colors.ink }]}>{TYPE_LABELS[type]}</Text>
                    <View style={styles.sectionRowRight}>
                      <Text style={[styles.sectionRowCount, { color: colors.muted2 }]}>{section.count} titres</Text>
                      <View style={{ transform: [{ rotate: isExpanded ? '90deg' : '0deg' }] }}>
                        <ChevronIcon color={colors.muted2} size={15} />
                      </View>
                    </View>
                  </TouchableOpacity>

                  {isExpanded && (
                    <View style={[styles.titlesBlock, !isLast && { borderBottomWidth: 1, borderBottomColor: colors.divider }]}>
                      {section.titles.map((t, j) => (
                        <View
                          key={j}
                          style={[
                            styles.titleRow,
                            j < section.titles.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.divider },
                          ]}
                        >
                          <MediaPoster
                            posterPath={null}
                            fallbackLabel={t.label}
                            fallbackColors={t.colors}
                            width={40}
                            height={58}
                            borderRadius={8}
                            fontSize={6}
                          />
                          <View style={styles.titleInfo}>
                            <Text style={[styles.titleName, { color: colors.ink }]} numberOfLines={2}>{t.title}</Text>
                            <Text style={[styles.titleYear, { color: colors.muted2 }]}>{t.year}</Text>
                          </View>
                          {t.rating !== undefined && (
                            <View style={styles.titleRatingBlock}>
                              <Text style={[styles.titleRatingNum, { color: colors.starFill }]}>
                                {t.rating.toFixed(1).replace('.', ',')}
                              </Text>
                              <StarRating value={t.rating} size="sm" />
                            </View>
                          )}
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              );
            })}
          </View>

          {/* Note moyenne */}
          <Text style={[styles.sectionLabel, { color: colors.muted2 }]}>NOTE MOYENNE</Text>
          <View style={[styles.card, styles.ratingCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
            <Text style={[styles.avgRatingValue, { color: colors.starFill }]}>
              {data.avgRating.toFixed(1).replace('.', ',')}
            </Text>
            <StarRating value={data.avgRating} size="md" />
          </View>

          {/* Listes publiques */}
          {data.lists.length > 0 && (
            <>
              <Text style={[styles.sectionLabel, { color: colors.muted2 }]}>LISTES PUBLIQUES</Text>
              <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
                {data.lists.map((list, i, arr) => {
                  const isExpanded = expandedLists.has(list.name);
                  const isLast = i === arr.length - 1;
                  return (
                    <View key={list.name}>
                      <TouchableOpacity
                        onPress={() => toggleList(list.name)}
                        activeOpacity={0.7}
                        style={[
                          styles.sectionRow,
                          !isLast && !isExpanded && { borderBottomWidth: 1, borderBottomColor: colors.divider },
                        ]}
                      >
                        <View style={styles.listRowInfo}>
                          <Text style={[styles.sectionRowLabel, { color: colors.ink }]}>{list.name}</Text>
                          <Text style={[styles.listCount, { color: colors.muted2 }]}>{list.count} entrées</Text>
                        </View>
                        <View style={{ transform: [{ rotate: isExpanded ? '90deg' : '0deg' }] }}>
                          <ChevronIcon color={colors.muted2} size={15} />
                        </View>
                      </TouchableOpacity>

                      {isExpanded && (
                        <View style={[styles.titlesBlock, !isLast && { borderBottomWidth: 1, borderBottomColor: colors.divider }]}>
                          {list.titles.map((t, j) => (
                            <View
                              key={j}
                              style={[
                                styles.titleRow,
                                j < list.titles.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.divider },
                              ]}
                            >
                              <MediaPoster
                                posterPath={null}
                                fallbackLabel={t.label}
                                fallbackColors={t.colors}
                                width={40}
                                height={58}
                                borderRadius={8}
                                fontSize={6}
                              />
                              <View style={styles.titleInfo}>
                                <Text style={[styles.titleName, { color: colors.ink }]} numberOfLines={2}>{t.title}</Text>
                                <Text style={[styles.titleYear, { color: colors.muted2 }]}>{t.year}</Text>
                              </View>
                            </View>
                          ))}
                        </View>
                      )}
                    </View>
                  );
                })}
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

  sectionRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 15,
  },
  sectionRowLabel: { fontFamily: Fonts.semiBold, fontSize: 15 },
  sectionRowRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sectionRowCount: { fontFamily: Fonts.regular, fontSize: 13 },

  titlesBlock: { paddingHorizontal: 16, paddingBottom: 4 },
  titleRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingVertical: 10,
  },
  titleInfo: { flex: 1, minWidth: 0 },
  titleName: { fontFamily: Fonts.semiBold, fontSize: 13.5, lineHeight: 18 },
  titleYear: { fontFamily: Fonts.regular, fontSize: 12, marginTop: 2 },
  titleRatingBlock: { alignItems: 'flex-end', gap: 3, flexShrink: 0 },
  titleRatingNum: { fontFamily: Fonts.semiBold, fontSize: 13 },

  ratingCard: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    paddingHorizontal: 18, paddingVertical: 18,
  },
  avgRatingValue: { fontFamily: Fonts.semiBold, fontSize: 32, lineHeight: 36 },

  listRowInfo: { flex: 1 },
  listCount: { fontFamily: Fonts.regular, fontSize: 12, marginTop: 1 },
});
