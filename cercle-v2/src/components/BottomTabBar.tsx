import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { Fonts } from '../theme';
import { AmisIcon, CercleIcon, ListIcon, ProfileIcon, PlusIcon } from './Icons';

export type Tab = 'amis' | 'cercle' | 'liste' | 'profil';

interface BottomTabBarProps {
  active?: Tab;
  onTabPress?: (tab: Tab) => void;
  onAddPress?: () => void;
}

export function BottomTabBar({ active = 'cercle', onTabPress, onAddPress }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();

  const iconColor = (tab: Tab) => (active === tab ? colors.accent : colors.muted);

  return (
    <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, 12), backgroundColor: colors.nav, borderTopColor: colors.navBorder }]}>
      <View style={styles.tab}>
        <AmisIcon color={colors.muted} />
        <Text style={[styles.label, { color: colors.muted }]}>Amis</Text>
      </View>

      <TouchableOpacity style={styles.tab} onPress={() => onTabPress?.('cercle')}>
        <CercleIcon color={iconColor('cercle')} />
        <Text style={[styles.label, { color: active === 'cercle' ? colors.accent : colors.muted }]}>Cercle</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={onAddPress} activeOpacity={0.8}>
        <LinearGradient colors={[colors.accent, colors.accentEnd]} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={styles.addBtn}>
          <PlusIcon color={colors.onAccent} />
        </LinearGradient>
      </TouchableOpacity>

      <TouchableOpacity style={styles.tab} onPress={() => onTabPress?.('liste')}>
        <ListIcon color={iconColor('liste')} />
        <Text style={[styles.label, { color: active === 'liste' ? colors.accent : colors.muted }]}>Liste</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.tab} onPress={() => onTabPress?.('profil')}>
        <ProfileIcon color={iconColor('profil')} />
        <Text style={[styles.label, { color: active === 'profil' ? colors.accent : colors.muted }]}>Profil</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: 12,
    borderTopWidth: 1,
  },
  tab: { alignItems: 'center', gap: 4, paddingHorizontal: 12 },
  label: { fontFamily: Fonts.medium, fontSize: 10 },
  addBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -6,
    shadowColor: '#F2B441',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
  },
});
