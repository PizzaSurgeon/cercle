import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { Fonts } from '../theme';
import { ConsensusCard } from '../components/ConsensusCard';
import { RecommendationCard } from '../components/RecommendationCard';
import { MoonIcon, SunIcon } from '../components/Icons';
import { FilmDetailModal } from '../components/FilmDetailModal';
import { UserProfileModal } from '../components/UserProfileModal';
import { FriendReview } from '../components/ConsensusCard';
import { getMediaDetails } from '../services/tmdb';
import { MediaItem } from '../types/media';

type FilterType = 'tout' | 'films' | 'séries' | 'animés';

interface FilmData {
  id: string;
  title: string;
  subtitle: string;
  posterLabel: string;
  posterColors: [string, string];
  circleAverage: number;
  type: FilterType;
  reviews: FriendReview[];
}

const CONSENSUS_DATA: FilmData[] = [
  {
    id: 'shogun',
    title: 'Shōgun',
    subtitle: 'Série · 2024 · Drame historique',
    posterLabel: 'SHŌGUN',
    posterColors: ['#3E5C6B', '#1E2E38'],
    circleAverage: 4.3,
    type: 'séries',
    reviews: [
      { initial: 'C', name: 'Camille', avatarBg: '#D9A8B4', avatarFg: '#6B2E3E', rating: 5 },
      { initial: 'T', name: 'Tom', avatarBg: '#A9C0CE', avatarFg: '#2E4A57', rating: 4 },
      { initial: 'S', name: 'Sofia', avatarBg: '#C7B79B', avatarFg: '#5A4A30', rating: 4 },
    ],
  },
  {
    id: 'dune2',
    title: 'Dune : Deuxième Partie',
    subtitle: 'Film · 2024 · Science-fiction',
    posterLabel: 'DUNE\nPARTIE 2',
    posterColors: ['#D9925A', '#A24123'],
    circleAverage: 4.7,
    type: 'films',
    reviews: [
      { initial: 'L', name: 'Léa', avatarBg: '#E5B98A', avatarFg: '#7A3B22', rating: 5 },
      { initial: 'M', name: 'Maxime', avatarBg: '#B8C8A8', avatarFg: '#42562E', rating: 5 },
      { initial: 'T', name: 'Tom', avatarBg: '#A9C0CE', avatarFg: '#2E4A57', rating: 4.5 },
    ],
  },
  {
    id: 'aot',
    title: 'Attack on Titan',
    subtitle: 'Animé · 2023 · Action',
    posterLabel: 'ATTACK\nON TITAN',
    posterColors: ['#6B3E2E', '#3A1A12'],
    circleAverage: 4.8,
    type: 'animés',
    reviews: [
      { initial: 'S', name: 'Sofia', avatarBg: '#C7B79B', avatarFg: '#5A4A30', rating: 5 },
      { initial: 'L', name: 'Léa', avatarBg: '#E5B98A', avatarFg: '#7A3B22', rating: 4.5 },
    ],
  },
];

const RECO_FILM: FilmData = {
  id: 'pastlives',
  title: 'Past Lives',
  subtitle: 'Film · 2023 · Drame romantique',
  posterLabel: 'PAST\nLIVES',
  posterColors: ['#8FA0B8', '#4E5E78'],
  circleAverage: 4.5,
  type: 'films',
  reviews: [
    { initial: 'M', name: 'Maxime', avatarBg: '#B8C8A8', avatarFg: '#42562E', rating: 4.5 },
  ],
};

const FILTERS: { key: FilterType; label: string }[] = [
  { key: 'tout', label: 'Tout' },
  { key: 'films', label: 'Films' },
  { key: 'séries', label: 'Séries' },
  { key: 'animés', label: 'Animés' },
];

interface ReviewerState {
  name: string;
  initial: string;
  avatarBg: string;
  avatarFg: string;
}

export function FeedScreen() {
  const { colors, isDark, toggleTheme } = useTheme();
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState<FilterType>('tout');
  const [tmdbData, setTmdbData] = useState<Record<string, MediaItem | null>>({});

  const [selectedFilm, setSelectedFilm] = useState<FilmData | null>(null);
  const [selectedReviewer, setSelectedReviewer] = useState<ReviewerState | null>(null);

  useEffect(() => {
    async function fetchTmdbData() {
      const [shogun, dune2, aot, pastlives] = await Promise.all([
        getMediaDetails(126308, 'tv').catch(() => null),
        getMediaDetails(693134, 'movie').catch(() => null),
        getMediaDetails(1429, 'tv').catch(() => null),
        getMediaDetails(877269, 'movie').catch(() => null),
      ]);
      setTmdbData({ shogun, dune2, aot, pastlives });
    }
    fetchTmdbData();
  }, []);

  const visibleCards = CONSENSUS_DATA.filter(c => filter === 'tout' || c.type === filter);
  const showReco = filter === 'tout' || filter === 'films';

  const handleFilmPress = (film: FilmData) => setSelectedFilm(film);
  const handleReviewerPress = (name: string, initial: string, avatarBg: string, avatarFg: string) => {
    setSelectedReviewer({ name, initial, avatarBg, avatarFg });
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Brand header */}
        <View style={styles.brandRow}>
          <View style={styles.brandCenter}>
            <Text style={[styles.brandText, { color: colors.ink }]}>CERCLE</Text>
            <View style={[styles.brandDot, { backgroundColor: colors.accent, shadowColor: colors.accent }]} />
          </View>
          <TouchableOpacity onPress={toggleTheme} style={[styles.themeBtn, { backgroundColor: colors.chip, borderColor: colors.chipBorder }]}>
            {isDark ? <SunIcon color={colors.accent} size={17} /> : <MoonIcon color={colors.accent} size={17} />}
          </TouchableOpacity>
        </View>

        {/* Title */}
        <Text style={[styles.title, { color: colors.ink }]}>Cette semaine</Text>

        {/* Filter chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsScroll} contentContainerStyle={styles.chipsContent}>
          {FILTERS.map(({ key, label }) => (
            <TouchableOpacity key={key} onPress={() => setFilter(key)} activeOpacity={0.75}>
              {filter === key ? (
                <LinearGradient colors={[colors.accent, colors.accentEnd]} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={styles.chipActive}>
                  <Text style={[styles.chipTextActive, { color: colors.onAccent }]}>{label}</Text>
                </LinearGradient>
              ) : (
                <View style={[styles.chip, { backgroundColor: colors.chip, borderColor: colors.chipBorder }]}>
                  <Text style={[styles.chipText, { color: colors.chipText }]}>{label}</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Cards */}
        {visibleCards.map(card => (
          <ConsensusCard
            key={card.id}
            title={card.title}
            subtitle={card.subtitle}
            posterLabel={card.posterLabel}
            posterColors={card.posterColors}
            posterPath={tmdbData[card.id]?.posterPath ?? null}
            circleAverage={card.circleAverage}
            reviews={card.reviews}
            onPress={() => handleFilmPress(card)}
            onReviewerPress={handleReviewerPress}
          />
        ))}

        {/* Recommendation */}
        {showReco && (
          <RecommendationCard
            title={RECO_FILM.title}
            posterLabel={RECO_FILM.posterLabel}
            posterColors={RECO_FILM.posterColors}
            posterPath={tmdbData['pastlives']?.posterPath ?? null}
            recommenderInitial="M"
            recommenderName="Maxime"
            recommenderAvatarBg="#B8C8A8"
            recommenderAvatarFg="#42562E"
            onPress={() => handleFilmPress(RECO_FILM)}
            onReviewerPress={() => handleReviewerPress('Maxime', 'M', '#B8C8A8', '#42562E')}
          />
        )}
      </ScrollView>

      {/* Film Detail Modal */}
      {selectedFilm && (
        <FilmDetailModal
          visible={!!selectedFilm}
          title={selectedFilm.title}
          subtitle={selectedFilm.subtitle}
          posterLabel={selectedFilm.posterLabel}
          posterColors={selectedFilm.posterColors}
          circleAverage={selectedFilm.circleAverage}
          reviews={selectedFilm.reviews}
          onClose={() => setSelectedFilm(null)}
          mediaItem={tmdbData[selectedFilm.id] ?? undefined}
        />
      )}

      {/* User Profile Modal */}
      {selectedReviewer && (
        <UserProfileModal
          visible={!!selectedReviewer}
          name={selectedReviewer.name}
          initial={selectedReviewer.initial}
          avatarBg={selectedReviewer.avatarBg}
          avatarFg={selectedReviewer.avatarFg}
          onClose={() => setSelectedReviewer(null)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  scroll: { flex: 1 },
  content: { padding: 18, paddingBottom: 24 },
  brandRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14, marginBottom: 4 },
  brandCenter: { flexDirection: 'row', alignItems: 'flex-start' },
  brandText: { fontFamily: Fonts.semiBold, fontSize: 18, letterSpacing: 6 },
  brandDot: { width: 6, height: 6, borderRadius: 3, marginLeft: 3, marginTop: 5, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.8, shadowRadius: 8 },
  themeBtn: { position: 'absolute', right: 0, width: 42, height: 42, borderRadius: 21, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  title: { fontFamily: Fonts.semiBold, fontSize: 27, letterSpacing: -0.5, marginBottom: 16 },
  chipsScroll: { marginBottom: 18, marginHorizontal: -18 },
  chipsContent: { paddingHorizontal: 18, gap: 8, flexDirection: 'row' },
  chip: { paddingVertical: 9, paddingHorizontal: 16, borderRadius: 999, borderWidth: 1 },
  chipActive: { paddingVertical: 9, paddingHorizontal: 16, borderRadius: 999 },
  chipText: { fontFamily: Fonts.regular, fontSize: 13 },
  chipTextActive: { fontFamily: Fonts.semiBold, fontSize: 13 },
});
