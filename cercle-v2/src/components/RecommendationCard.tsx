import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Fonts } from '../theme';
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

export function RecommendationCard({
  title,
  posterLabel,
  posterColors,
  recommenderInitial,
  recommenderName,
  recommenderAvatarBg,
  recommenderAvatarFg,
}: RecommendationCardProps) {
  return (
    <LinearGradient
      colors={['#FBEAD9', '#F4D9BF']}
      start={{ x: 0.1, y: 0 }}
      end={{ x: 0.9, y: 1 }}
      style={styles.card}
    >
      <PosterPlaceholder
        label={posterLabel}
        colors={posterColors}
        width={62}
        height={90}
        borderRadius={12}
        fontSize={8}
      />
      <View style={styles.content}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>RECOMMANDÉ POUR TOI</Text>
        </View>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.recommenderRow}>
          <Avatar
            initial={recommenderInitial}
            bg={recommenderAvatarBg}
            fg={recommenderAvatarFg}
            size={20}
          />
          <Text style={styles.recommenderText}>
            <Text style={styles.recommenderName}>{recommenderName}</Text>
            {' pense que ça va te plaire'}
          </Text>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    padding: 16,
    flexDirection: 'row',
    gap: 14,
    alignItems: 'center',
    shadowColor: 'rgba(60,40,20,1)',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 15,
    elevation: 3,
  },
  content: {
    flex: 1,
    minWidth: 0,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: Colors.terracotta,
  },
  badgeText: {
    fontFamily: Fonts.bodyBold,
    fontSize: 10,
    color: '#fff',
    letterSpacing: 0.5,
  },
  title: {
    fontFamily: Fonts.heading,
    fontSize: 16,
    color: Colors.ink,
    marginTop: 8,
  },
  recommenderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginTop: 5,
  },
  recommenderText: {
    fontFamily: Fonts.body,
    fontSize: 12.5,
    color: '#6E5A48',
    flexShrink: 1,
  },
  recommenderName: {
    fontFamily: Fonts.bodyBold,
  },
});
