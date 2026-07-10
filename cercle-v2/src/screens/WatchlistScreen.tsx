import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { Fonts } from '../theme';
import { MediaPoster } from '../components/MediaPoster';
import { Avatar } from '../components/Avatar';
import { FilmDetailModal } from '../components/FilmDetailModal';
import { getMediaDetails } from '../services/tmdb';
import { MediaItem } from '../types/media';

type MediaType = 'movie' | 'tv';

interface ListItem {
  id: string;
  tmdbId: number;
  tmdbType: MediaType;
  title: string;
  meta: string;
  label: string;
  colors: [string, string];
}

interface WatchedItem extends ListItem {
  rating: string;
}

interface RecommendedItem extends ListItem {
  byInitial: string;
  by: string;
  byBg: string;
  byFg: string;
}

const TO_WATCH: ListItem[] = [
  { id: '1', tmdbId: 209867, tmdbType: 'tv',    title: 'Frieren',        meta: 'Animé · 2023',  label: 'FRIEREN',       colors: ['#9FB07A', '#5E7048'] },
  { id: '2', tmdbId: 792307, tmdbType: 'movie', title: 'Poor Things',    meta: 'Film · 2023',   label: 'POOR\nTHINGS',  colors: ['#E0B24C', '#B07A1E'] },
  { id: '3', tmdbId: 136315, tmdbType: 'tv',    title: 'The Bear',       meta: 'Série · 2024',  label: 'THE\nBEAR',     colors: ['#C85A3C', '#7E2A1C'] },
];

const WATCHED: WatchedItem[] = [
  { id: '1', tmdbId: 126308, tmdbType: 'tv',    title: 'Shōgun',                  meta: 'Série · 2024', label: 'SHŌGUN',      colors: ['#3E5C6B', '#1E2E38'], rating: '4,3' },
  { id: '2', tmdbId: 693134, tmdbType: 'movie', title: 'Dune : Deuxième Partie',  meta: 'Film · 2024',  label: 'DUNE 2',      colors: ['#D9925A', '#A24123'], rating: '4,7' },
  { id: '3', tmdbId: 877269, tmdbType: 'movie', title: 'Past Lives',              meta: 'Film · 2023',  label: 'PAST\nLIVES', colors: ['#8FA0B8', '#4E5E78'], rating: '4,5' },
  { id: '4', tmdbId: 1429,   tmdbType: 'tv',    title: 'Attack on Titan',         meta: 'Animé · 2023', label: 'AOT',         colors: ['#6B3E2E', '#3A1A12'], rating: '4,8' },
];

const RECOMMENDED: RecommendedItem[] = [
  { id: '1', tmdbId: 95479,  tmdbType: 'tv',    title: 'Jujutsu Kaisen',  meta: 'Animé · 2023', label: 'JJK',   colors: ['#6B5B8A', '#2E2740'], byInitial: 'S', by: 'Sofia', byBg: '#C7B79B', byFg: '#5A4A30' },
  { id: '2', tmdbId: 872585, tmdbType: 'movie', title: 'Oppenheimer',     meta: 'Film · 2023',  label: 'OPPEN', colors: ['#4A3828', '#1E1510'], byInitial: 'T', by: 'Tom',   byBg: '#A9C0CE', byFg: '#2E4A57' },
  { id: '3', tmdbId: 100088, tmdbType: 'tv',    title: 'The Last of Us',  meta: 'Série · 2023', label: 'TLOU',  colors: ['#4A6B3A', '#2A3E20'], byInitial: 'L', by: 'Léa',  byBg: '#E5B98A', byFg: '#7A3B22' },
];

const ALL_ITEMS: ListItem[] = [...TO_WATCH, ...WATCHED, ...RECOMMENDED];

function itemKey(item: ListItem) {
  return `${item.tmdbType}-${item.tmdbId}`;
}

interface SelectedItem {
  item: ListItem;
  circleAverage: number;
}

export function WatchlistScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [mediaData, setMediaData] = useState<Record<string, MediaItem | null>>({});
  const [selected, setSelected] = useState<SelectedItem | null>(null);

  useEffect(() => {
    async function fetchAll() {
      const results = await Promise.all(
        ALL_ITEMS.map(item =>
          getMediaDetails(item.tmdbId, item.tmdbType)
            .then(data => ({ key: itemKey(item), data }))
            .catch(() => ({ key: itemKey(item), data: null }))
        )
      );
      const map: Record<string, MediaItem | null> = {};
      results.forEach(r => { map[r.key] = r.data; });
      setMediaData(map);
    }
    fetchAll();
  }, []);

  const posterPath = (item: ListItem) => mediaData[itemKey(item)]?.posterPath ?? null;

  const openItem = (item: ListItem, circleAverage = 0) => {
    setSelected({ item, circleAverage });
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[styles.pageTitle, { color: colors.ink }]}>Ma liste</Text>

        <SectionHeader title="À voir" count={TO_WATCH.length} colors={colors} />
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
          {TO_WATCH.map((item, i) => (
            <TouchableOpacity key={item.id} onPress={() => openItem(item)} activeOpacity={0.75}
              style={[styles.row, i < TO_WATCH.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.divider }]}>
              <MediaPoster posterPath={posterPath(item)} fallbackLabel={item.label} fallbackColors={item.colors} width={46} height={66} borderRadius={9} fontSize={7} />
              <View style={styles.rowInfo}>
                <Text style={[styles.rowTitle, { color: colors.ink }]} numberOfLines={1}>{item.title}</Text>
                <Text style={[styles.rowMeta, { color: colors.muted2 }]}>{item.meta}</Text>
              </View>
              <Text style={{ color: colors.accent, fontSize: 18 }}>🔖</Text>
            </TouchableOpacity>
          ))}
        </View>

        <SectionHeader title="Vus & notés" count={WATCHED.length} colors={colors} />
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
          {WATCHED.map((item, i) => (
            <TouchableOpacity key={item.id} onPress={() => openItem(item, parseFloat(item.rating.replace(',', '.')))} activeOpacity={0.75}
              style={[styles.row, i < WATCHED.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.divider }]}>
              <MediaPoster posterPath={posterPath(item)} fallbackLabel={item.label} fallbackColors={item.colors} width={46} height={66} borderRadius={9} fontSize={7} />
              <View style={styles.rowInfo}>
                <Text style={[styles.rowTitle, { color: colors.ink }]} numberOfLines={1}>{item.title}</Text>
                <Text style={[styles.rowMeta, { color: colors.muted2 }]}>{item.meta}</Text>
              </View>
              <Text style={[styles.ratingBadge, { color: colors.starFill }]}>★ {item.rating}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <SectionHeader title="Recommandé par ton cercle" count={RECOMMENDED.length} colors={colors} />
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
          {RECOMMENDED.map((item, i) => (
            <TouchableOpacity key={item.id} onPress={() => openItem(item)} activeOpacity={0.75}
              style={[styles.row, i < RECOMMENDED.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.divider }]}>
              <MediaPoster posterPath={posterPath(item)} fallbackLabel={item.label} fallbackColors={item.colors} width={46} height={66} borderRadius={9} fontSize={7} />
              <View style={styles.rowInfo}>
                <Text style={[styles.rowTitle, { color: colors.ink }]} numberOfLines={1}>{item.title}</Text>
                <Text style={[styles.rowMeta, { color: colors.muted2 }]}>{item.meta}</Text>
              </View>
              <View style={styles.byRow}>
                <Avatar initial={(item as RecommendedItem).byInitial} bg={(item as RecommendedItem).byBg} fg={(item as RecommendedItem).byFg} size={22} />
                <Text style={[styles.byName, { color: colors.muted2 }]}>{(item as RecommendedItem).by}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {selected && (
        <FilmDetailModal
          visible={!!selected}
          title={selected.item.title}
          subtitle={selected.item.meta}
          posterLabel={selected.item.label}
          posterColors={selected.item.colors}
          circleAverage={selected.circleAverage}
          reviews={[]}
          onClose={() => setSelected(null)}
          mediaItem={mediaData[itemKey(selected.item)] ?? undefined}
        />
      )}
    </View>
  );
}

function SectionHeader({ title, count, colors }: { title: string; count: number; colors: any }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={[styles.sectionTitle, { color: colors.ink }]}>
        {title}{' '}
        <Text style={[styles.sectionCount, { color: colors.muted2 }]}>· {count}</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { padding: 18, paddingBottom: 24 },
  pageTitle: { fontFamily: Fonts.semiBold, fontSize: 27, letterSpacing: -0.5, marginBottom: 22 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 4, marginBottom: 8 },
  sectionTitle: { fontFamily: Fonts.semiBold, fontSize: 13 },
  sectionCount: { fontFamily: Fonts.regular, fontSize: 13 },
  card: { borderRadius: 20, borderWidth: 1, paddingHorizontal: 16, marginBottom: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 9 }, shadowOpacity: 0.45, shadowRadius: 20, elevation: 6 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 13, paddingVertical: 12 },
  rowInfo: { flex: 1, minWidth: 0 },
  rowTitle: { fontFamily: Fonts.semiBold, fontSize: 14.5, lineHeight: 18 },
  rowMeta: { fontFamily: Fonts.regular, fontSize: 11.5, marginTop: 2 },
  ratingBadge: { fontFamily: Fonts.semiBold, fontSize: 13, flexShrink: 0 },
  byRow: { flexDirection: 'row', alignItems: 'center', gap: 6, flexShrink: 0 },
  byName: { fontFamily: Fonts.medium, fontSize: 12 },
});
