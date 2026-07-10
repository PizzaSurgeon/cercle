import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { Fonts } from '../theme';
import { MoonIcon, SunIcon, ChevronIcon } from '../components/Icons';
import Svg, { Path, Rect, Circle } from 'react-native-svg';

const STAT_TILES = [
  { value: '47', unit: '', label: 'films vus' },
  { value: '4,1', unit: '★', label: 'note moyenne' },
  { value: '12', unit: '', label: 'séries suivies' },
  { value: '8', unit: '', label: 'animés vus' },
];

const DIST_ROWS = [
  { star: 5, pct: 62, count: 29 },
  { star: 4, pct: 47, count: 22 },
  { star: 3, pct: 21, count: 10 },
  { star: 2, pct: 8, count: 4 },
  { star: 1, pct: 4, count: 2 },
];

const FORMAT_TILES = [
  { value: '47', label: 'Films' },
  { value: '12', label: 'Séries' },
  { value: '8', label: 'Animés' },
];

export function ProfileScreen() {
  const { colors, isDark, toggleTheme } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.screen, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[styles.pageTitle, { color: colors.ink }]}>Profil</Text>

        {/* Avatar + name */}
        <View style={styles.profileHeader}>
          <LinearGradient colors={[colors.accent, colors.accentEnd]} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={[styles.avatar, { shadowColor: colors.accentGlow }]}>
            <Text style={[styles.avatarInitial, { color: colors.onAccent }]}>A</Text>
          </LinearGradient>
          <View>
            <Text style={[styles.userName, { color: colors.ink }]}>Alex</Text>
            <Text style={[styles.userMeta, { color: colors.muted2 }]}>Membre depuis 2023 · 4 amis</Text>
          </View>
        </View>

        {/* Stat tiles */}
        <View style={styles.statGrid}>
          {STAT_TILES.map((t, i) => (
            <View key={i} style={[styles.statTile, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
              <Text style={[styles.statValue, { color: colors.starFill }]}>
                {t.value}<Text style={[styles.statUnit, { color: colors.muted2 }]}>{t.unit}</Text>
              </Text>
              <Text style={[styles.statLabel, { color: colors.muted2 }]}>{t.label}</Text>
            </View>
          ))}
        </View>

        {/* Rating distribution */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
          <Text style={[styles.cardTitle, { color: colors.ink }]}>Répartition de mes notes</Text>
          {DIST_ROWS.map(d => (
            <View key={d.star} style={styles.distRow}>
              <Text style={[styles.distStar, { color: colors.muted2 }]}>{d.star}<Text style={{ color: colors.starFill, fontSize: 11 }}>★</Text></Text>
              <View style={[styles.distTrack, { backgroundColor: colors.track }]}>
                <LinearGradient colors={[colors.accent, colors.accentEnd]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={[styles.distFill, { width: `${d.pct}%` as `${number}%` }]} />
              </View>
              <Text style={[styles.distCount, { color: colors.muted2 }]}>{d.count}</Text>
            </View>
          ))}
        </View>

        {/* Format breakdown */}
        <View style={styles.formatGrid}>
          {FORMAT_TILES.map((f, i) => (
            <View key={i} style={[styles.formatTile, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
              <Text style={[styles.formatValue, { color: colors.ink }]}>{f.value}</Text>
              <Text style={[styles.formatLabel, { color: colors.muted2 }]}>{f.label}</Text>
            </View>
          ))}
        </View>

        {/* Settings */}
        <Text style={[styles.settingsTitle, { color: colors.ink }]}>Réglages</Text>
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
          {/* Dark mode toggle */}
          <View style={[styles.settingRow, { borderBottomColor: colors.divider, borderBottomWidth: 1 }]}>
            <View style={[styles.settingIcon, { backgroundColor: colors.chip, borderColor: colors.chipBorder }]}>
              {isDark ? <MoonIcon color={colors.accent} size={17} /> : <SunIcon color={colors.accent} size={17} />}
            </View>
            <Text style={[styles.settingLabel, { color: colors.ink }]}>Mode sombre</Text>
            <TouchableOpacity onPress={toggleTheme} style={[styles.toggle, { backgroundColor: isDark ? colors.accent : colors.track }]} activeOpacity={0.8}>
              <View style={[styles.toggleKnob, { left: isDark ? 22 : 3 }]} />
            </TouchableOpacity>
          </View>

          {[
            { icon: <LockIcon color={colors.accent} />, label: 'Confidentialité des listes' },
            { icon: <BellIcon color={colors.accent} />, label: 'Notifications' },
            { icon: <CircleIcon color={colors.accent} />, label: 'Gérer mon cercle' },
            { icon: <UserIcon color={colors.accent} />, label: 'Compte' },
          ].map((item, i, arr) => (
            <TouchableOpacity key={i} style={[styles.settingRow, i < arr.length - 1 && { borderBottomColor: colors.divider, borderBottomWidth: 1 }]} activeOpacity={0.7}>
              <View style={[styles.settingIcon, { backgroundColor: colors.chip, borderColor: colors.chipBorder }]}>{item.icon}</View>
              <Text style={[styles.settingLabel, { color: colors.ink }]}>{item.label}</Text>
              <ChevronIcon color={colors.muted2} size={18} />
            </TouchableOpacity>
          ))}

          {/* Logout */}
          <TouchableOpacity style={styles.settingRow} activeOpacity={0.7}>
            <View style={[styles.settingIcon, { backgroundColor: colors.deleteRedBg, borderColor: colors.deleteRedBorder }]}>
              <LogoutIcon color={colors.deleteRed} />
            </View>
            <Text style={[styles.settingLabel, { color: colors.deleteRed }]}>Déconnexion</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

function LockIcon({ color }: { color: string }) {
  return <Svg width={17} height={17} viewBox="0 0 24 24" fill="none"><Rect x={5} y={11} width={14} height={9} rx={2} stroke={color} strokeWidth={1.9} strokeLinecap="round" /><Path d="M8 11V8a4 4 0 0 1 8 0v3" stroke={color} strokeWidth={1.9} strokeLinecap="round" /></Svg>;
}
function BellIcon({ color }: { color: string }) {
  return <Svg width={17} height={17} viewBox="0 0 24 24" fill="none"><Path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" stroke={color} strokeWidth={1.9} strokeLinecap="round" /><Path d="M13.7 21a2 2 0 0 1-3.4 0" stroke={color} strokeWidth={1.9} strokeLinecap="round" /></Svg>;
}
function CircleIcon({ color }: { color: string }) {
  return <Svg width={17} height={17} viewBox="0 0 24 24" fill="none"><Circle cx={9} cy={8} r={3.2} stroke={color} strokeWidth={1.9} /><Path d="M3.5 19c0-3 2.5-4.6 5.5-4.6s5.5 1.6 5.5 4.6" stroke={color} strokeWidth={1.9} strokeLinecap="round" /><Circle cx={17} cy={8} r={2.6} stroke={color} strokeWidth={1.9} /><Path d="M16 14.5c2.6.2 4.5 1.8 4.5 4.5" stroke={color} strokeWidth={1.9} strokeLinecap="round" /></Svg>;
}
function UserIcon({ color }: { color: string }) {
  return <Svg width={17} height={17} viewBox="0 0 24 24" fill="none"><Circle cx={12} cy={8} r={4} stroke={color} strokeWidth={1.9} /><Path d="M4 21c0-4 3.6-6.5 8-6.5s8 2.5 8 6.5" stroke={color} strokeWidth={1.9} strokeLinecap="round" /></Svg>;
}
function LogoutIcon({ color }: { color: string }) {
  return <Svg width={17} height={17} viewBox="0 0 24 24" fill="none"><Path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke={color} strokeWidth={1.9} strokeLinecap="round" /><Path d="M16 17l5-5-5-5M21 12H9" stroke={color} strokeWidth={1.9} strokeLinecap="round" /></Svg>;
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { padding: 18, paddingBottom: 32 },
  pageTitle: { fontFamily: Fonts.semiBold, fontSize: 27, letterSpacing: -0.5, marginBottom: 18 },
  profileHeader: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 22 },
  avatar: { width: 60, height: 60, borderRadius: 30, alignItems: 'center', justifyContent: 'center', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.5, shadowRadius: 12, elevation: 8 },
  avatarInitial: { fontFamily: Fonts.semiBold, fontSize: 22 },
  userName: { fontFamily: Fonts.semiBold, fontSize: 19 },
  userMeta: { fontFamily: Fonts.regular, fontSize: 12.5, marginTop: 2 },
  statGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 14 },
  statTile: { flex: 1, minWidth: '45%', borderRadius: 18, borderWidth: 1, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 9 }, shadowOpacity: 0.45, shadowRadius: 20, elevation: 6 },
  statValue: { fontFamily: Fonts.semiBold, fontSize: 30, lineHeight: 34 },
  statUnit: { fontFamily: Fonts.medium, fontSize: 15 },
  statLabel: { fontFamily: Fonts.regular, fontSize: 12, marginTop: 6 },
  card: { borderRadius: 18, borderWidth: 1, padding: 18, marginBottom: 14, shadowColor: '#000', shadowOffset: { width: 0, height: 9 }, shadowOpacity: 0.45, shadowRadius: 20, elevation: 6 },
  cardTitle: { fontFamily: Fonts.semiBold, fontSize: 13, marginBottom: 14 },
  distRow: { flexDirection: 'row', alignItems: 'center', gap: 11, marginBottom: 9 },
  distStar: { width: 26, fontFamily: Fonts.semiBold, fontSize: 12 },
  distTrack: { flex: 1, height: 8, borderRadius: 999, overflow: 'hidden' },
  distFill: { height: '100%', borderRadius: 999 },
  distCount: { width: 22, textAlign: 'right', fontFamily: Fonts.medium, fontSize: 12 },
  formatGrid: { flexDirection: 'row', gap: 12, marginBottom: 22 },
  formatTile: { flex: 1, borderRadius: 16, borderWidth: 1, padding: 14, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 9 }, shadowOpacity: 0.45, shadowRadius: 20, elevation: 6 },
  formatValue: { fontFamily: Fonts.semiBold, fontSize: 22, lineHeight: 26 },
  formatLabel: { fontFamily: Fonts.regular, fontSize: 11, marginTop: 5 },
  settingsTitle: { fontFamily: Fonts.semiBold, fontSize: 13, letterSpacing: 0.4, marginBottom: 8, paddingLeft: 4 },
  settingRow: { flexDirection: 'row', alignItems: 'center', gap: 13, paddingVertical: 13 },
  settingIcon: { width: 34, height: 34, borderRadius: 10, borderWidth: 1, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  settingLabel: { flex: 1, fontFamily: Fonts.medium, fontSize: 15 },
  toggle: { width: 46, height: 27, borderRadius: 999 },
  toggleKnob: { position: 'absolute', top: 3, width: 21, height: 21, borderRadius: 10.5, backgroundColor: '#fff', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.35, shadowRadius: 3, elevation: 3 },
});
