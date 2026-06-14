import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Fonts } from '../theme';
import { PosterPlaceholder } from '../components/PosterPlaceholder';
import { Avatar } from '../components/Avatar';

const TO_WATCH = [
  { id: '1', title: 'Frieren', meta: 'Animé · 2023', label: 'FRIEREN', colors: ['#9FB07A', '#5E7048'] as [string, string] },
  { id: '2', title: 'Poor Things', meta: 'Film · 2023', label: 'POOR\nTHINGS', colors: ['#E0B24C', '#B07A1E'] as [string, string] },
  { id: '3', title: 'The Bear', meta: 'Série · 2024', label: 'THE\nBEAR', colors: ['#C85A3C', '#7E2A1C'] as [string, string] },
];

const WATCHED = [
  { id: '1', title: 'Shōgun', meta: 'Série · 2024', label: 'SHŌGUN', colors: ['#3E5C6B', '#1E2E38'] as [string, string], rating: '4,3' },
  { id: '2', title: 'Dune : Deuxième Partie', meta: 'Film · 2024', label: 'DUNE 2', colors: ['#D9925A', '#A24123'] as [string, string], rating: '4,7' },
  { id: '3', title: 'Past Lives', meta: 'Film · 2023', label: 'PAST\nLIVES', colors: ['#8FA0B8', '#4E5E78'] as [string, string], rating: '4,5' },
  { id: '4', title: 'Attack on Titan', meta: 'Animé · 2023', label: 'AOT', colors: ['#6B3E2E', '#3A1A12'] as [string, string], rating: '4,8' },
];

const RECOMMENDED = [
  { id: '1', title: 'Jujutsu Kaisen', meta: 'Animé · 2023', label: 'JJK', colors: ['#6B5B8A', '#2E2740'] as [string, string], byInitial: 'S', by: 'Sofia', byBg: '#C7B79B', byFg: '#5A4A30' },
  { id: '2', title: 'Oppenheimer', meta: 'Film · 2023', label: 'OPPEN', colors: ['#4A3828', '#1E1510'] as [string, string], byInitial: 'T', by: 'Tom', byBg: '#A9C0CE', byFg: '#2E4A57' },
  { id: '3', title: 'The Last of Us', meta: 'Série · 2023', label: 'TLOU', colors: ['#4A6B3A', '#2A3E20'] as [string, string], byInitial: 'L', by: 'Léa', byBg: '#E5B98A', byFg: '#7A3B22' },
];

export function WatchlistScreen() {
  const { colors } = useTheme();

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[styles.pageTitle, { color: colors.ink }]}>Ma liste</Text>

        {/* À voir */}
        <SectionHeader title="À voir" count={TO_WATCH.length} colors={colors} />
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
          {TO_WATCH.map((item, i) => (
            <View key={item.id} style={[styles.row, i < TO_WATCH.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.divider }]}>
              <PosterPlaceholder label={item.label} colors={item.colors} width={46} height={66} borderRadius={9} fontSize={7} />
              <View style={styles.rowInfo}>
                <Text style={[styles.rowTitle, { color: colors.ink }]} numberOfLines={1}>{item.title}</Text>
                <Text style={[styles.rowMeta, { color: colors.muted2 }]}>{item.meta}</Text>
              </View>
              <Text style={{ color: colors.accent, fontSize: 18 }}>🔖</Text>
            </View>
          ))}
        </View>

        {/* Vus & notés */}
        <SectionHeader title="Vus & notés" count={WATCHED.length} colors={colors} />
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
          {WATCHED.map((item, i) => (
            <View key={item.id} style={[styles.row, i < WATCHED.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.divider }]}>
              <PosterPlaceholder label={item.label} colors={item.colors} width={46} height={66} borderRadius={9} fontSize={7} />
              <View style={styles.rowInfo}>
                <Text style={[styles.rowTitle, { color: colors.ink }]} numberOfLines={1}>{item.title}</Text>
                <Text style={[styles.rowMeta, { color: colors.muted2 }]}>{item.meta}</Text>
              </View>
              <Text style={[styles.ratingBadge, { color: colors.starFill }]}>★ {item.rating}</Text>
            </View>
          ))}
        </View>

        {/* Recommandé par cercle */}
        <SectionHeader title="Recommandé par ton cercle" count={RECOMMENDED.length} colors={colors} />
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
          {RECOMMENDED.map((item, i) => (
            <View key={item.id} style={[styles.row, i < RECOMMENDED.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.divider }]}>
              <PosterPlaceholder label={item.label} colors={item.colors} width={46} height={66} borderRadius={9} fontSize={7} />
              <View style={styles.rowInfo}>
                <Text style={[styles.rowTitle, { color: colors.ink }]} numberOfLines={1}>{item.title}</Text>
                <Text style={[styles.rowMeta, { color: colors.muted2 }]}>{item.meta}</Text>
              </View>
              <View style={styles.byRow}>
                <Avatar initial={item.byInitial} bg={item.byBg} fg={item.byFg} size={22} />
                <Text style={[styles.byName, { color: colors.muted2 }]}>{item.by}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
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
