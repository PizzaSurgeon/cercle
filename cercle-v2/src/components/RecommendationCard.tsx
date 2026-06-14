import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import { Fonts } from '../theme';
import { PosterPlaceholder } from './PosterPlaceholder';
import { Avatar } from './Avatar';

interface RecommendationCardProps {
  title: string;
  posterLabel: string;
  posterColors: [string, string];
  recommenderInitial: string;
  recommenderName: string;
  recommenderAvatarBg: string;
  recommenderAvatarFg: string;
}

export function RecommendationCard({ title, posterLabel, posterColors, recommenderInitial, recommenderName, recommenderAvatarBg, recommenderAvatarFg }: RecommendationCardProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
      <PosterPlaceholder label={posterLabel} colors={posterColors} width={62} height={90} borderRadius={11} fontSize={8} />
      <View style={styles.content}>
        <LinearGradient colors={[colors.accent, colors.accentEnd]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.badge}>
          <Text style={[styles.badgeText, { color: colors.onAccent }]}>RECOMMANDÉ POUR TOI</Text>
        </LinearGradient>
        <Text style={[styles.title, { color: colors.ink }]}>{title}</Text>
        <View style={styles.recommenderRow}>
          <Avatar initial={recommenderInitial} bg={recommenderAvatarBg} fg={recommenderAvatarFg} size={20} />
          <Text style={[styles.recommenderText, { color: colors.chipText }]} numberOfLines={1}>
            <Text style={[styles.recommenderName, { color: colors.chipText }]}>{recommenderName}</Text>
            {' pense que ça va te plaire'}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 22,
    borderWidth: 1,
    padding: 16,
    flexDirection: 'row',
    gap: 14,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 9 },
    shadowOpacity: 0.45,
    shadowRadius: 20,
    elevation: 6,
  },
  content: { flex: 1, minWidth: 0 },
  badge: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  badgeText: { fontFamily: Fonts.semiBold, fontSize: 10, letterSpacing: 0.4 },
  title: { fontFamily: Fonts.semiBold, fontSize: 16, marginTop: 8 },
  recommenderRow: { flexDirection: 'row', alignItems: 'center', gap: 7, marginTop: 5 },
  recommenderText: { fontFamily: Fonts.regular, fontSize: 12.5, flexShrink: 1 },
  recommenderName: { fontFamily: Fonts.semiBold },
});
