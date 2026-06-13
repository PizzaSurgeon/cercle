import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Fonts } from '../theme';
import { ConsensusCard } from '../components/ConsensusCard';
import { RecommendationCard } from '../components/RecommendationCard';
import { BottomTabBar } from '../components/BottomTabBar';

type FilterType = 'tout' | 'films' | 'séries' | 'animés';

const CONSENSUS_DATA = [
  {
    id: 'shogun',
    title: 'Shōgun',
    subtitle: 'Série · 2024 · Drame',
    posterLabel: 'SHŌGUN',
    posterColors: ['#3E5C6B', '#1E2E38'] as [string, string],
    circleAverage: 4.3,
    reviewCount: 3,
    type: 'séries' as FilterType,
    reviews: [
      { initial: 'C', name: 'Camille', avatarBg: '#D9A8B4', avatarFg: '#6B2E3E', rating: 5, quote: 'Magistral' },
      { initial: 'T', name: 'Tom', avatarBg: '#A9C0CE', avatarFg: '#2E4A57', rating: 4, quote: 'Un peu long au milieu' },
      { initial: 'S', name: 'Sofia', avatarBg: '#C7B79B', avatarFg: '#5A4A30', rating: 4, quote: 'Les décors !' },
    ],
  },
  {
    id: 'dune2',
    title: 'Dune : Deuxième Partie',
    subtitle: 'Film · 2024 · Science-fiction',
    posterLabel: 'DUNE\nPARTIE 2',
    posterColors: ['#D9925A', '#A24123'] as [string, string],
    circleAverage: 4.7,
    reviewCount: 3,
    type: 'films' as FilterType,
    reviews: [
      { initial: 'L', name: 'Léa', avatarBg: '#E5B98A', avatarFg: '#7A3B22', rating: 5, quote: 'Le film de l\'année' },
      { initial: 'M', name: 'Maxime', avatarBg: '#B8C8A8', avatarFg: '#42562E', rating: 5, quote: 'Claque visuelle' },
      { initial: 'T', name: 'Tom', avatarBg: '#A9C0CE', avatarFg: '#2E4A57', rating: 4.5, quote: 'Vivement le 3' },
    ],
  },
];

const FILTERS: { key: FilterType; label: string }[] = [
  { key: 'tout', label: 'Tout' },
  { key: 'films', label: 'Films' },
  { key: 'séries', label: 'Séries' },
  { key: 'animés', label: 'Animés' },
];

export function FeedScreen() {
  const [filter, setFilter] = useState<FilterType>('tout');
  const [activeTab, setActiveTab] = useState<'fil' | 'chercher' | 'aVoir' | 'profil'>('fil');

  const visibleCards = CONSENSUS_DATA.filter(
    (c) => filter === 'tout' || c.type === filter,
  );

  return (
    <View style={styles.screen}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* App header */}
        <View style={styles.appHeader}>
          <View>
            <Text style={styles.appBrand}>Cercle</Text>
            <Text style={styles.appTitle}>Cette semaine</Text>
            <Text style={styles.appSub}>Ce que ton cercle a regardé</Text>
          </View>
          <LinearGradient
            colors={['#E7B98C', '#CE8A5C']}
            start={{ x: 0.2, y: 0 }}
            end={{ x: 0.8, y: 1 }}
            style={styles.userAvatar}
          >
            <Text style={styles.userInitial}>M</Text>
          </LinearGradient>
        </View>

        {/* Filter chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.chipsScroll}
          contentContainerStyle={styles.chipsContent}
        >
          {FILTERS.map(({ key, label }) => (
            <TouchableOpacity
              key={key}
              onPress={() => setFilter(key)}
              style={[styles.chip, filter === key && styles.chipActive]}
              activeOpacity={0.7}
            >
              <Text style={[styles.chipText, filter === key && styles.chipTextActive]}>
                {label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Consensus cards */}
        {visibleCards.map((card) => (
          <ConsensusCard
            key={card.id}
            title={card.title}
            subtitle={card.subtitle}
            posterLabel={card.posterLabel}
            posterColors={card.posterColors}
            circleAverage={card.circleAverage}
            reviewCount={card.reviewCount}
            reviews={card.reviews}
          />
        ))}

        {/* Recommendation card */}
        {(filter === 'tout' || filter === 'films') && (
          <RecommendationCard
            title="Past Lives"
            posterLabel={'PAST\nLIVES'}
            posterColors={['#8FA0B8', '#4E5E78']}
            recommenderInitial="M"
            recommenderName="Maxime"
            recommenderAvatarBg="#B8C8A8"
            recommenderAvatarFg="#42562E"
          />
        )}
      </ScrollView>

      <BottomTabBar
        active={activeTab}
        onTabPress={setActiveTab}
        onAddPress={() => {}}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 18,
    paddingBottom: 24,
  },
  appHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingVertical: 8,
    marginBottom: 4,
  },
  appBrand: {
    fontFamily: Fonts.heading,
    fontSize: 12,
    letterSpacing: 2.5,
    textTransform: 'uppercase',
    color: Colors.terracotta,
  },
  appTitle: {
    fontFamily: Fonts.headingBold,
    fontSize: 27,
    color: Colors.ink,
    letterSpacing: -0.5,
    marginTop: 3,
    marginBottom: 2,
  },
  appSub: {
    fontFamily: Fonts.body,
    fontSize: 13.5,
    color: Colors.mutedWarm,
  },
  userAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'rgba(150,90,40,1)',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.28,
    shadowRadius: 5,
    elevation: 4,
  },
  userInitial: {
    fontFamily: Fonts.bodyBold,
    fontSize: 15,
    color: '#fff',
  },
  chipsScroll: {
    marginBottom: 18,
    marginHorizontal: -18,
  },
  chipsContent: {
    paddingHorizontal: 18,
    gap: 8,
    flexDirection: 'row',
  },
  chip: {
    paddingVertical: 9,
    paddingHorizontal: 16,
    borderRadius: 999,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.chipBorder,
  },
  chipActive: {
    backgroundColor: Colors.terracotta,
    borderColor: Colors.terracotta,
  },
  chipText: {
    fontFamily: Fonts.bodySemi,
    fontSize: 13,
    color: Colors.chipText,
  },
  chipTextActive: {
    fontFamily: Fonts.bodyBold,
    color: '#fff',
  },
});
