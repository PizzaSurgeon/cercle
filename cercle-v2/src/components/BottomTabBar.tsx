import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Fonts } from '../theme';
import { HomeIcon, SearchIcon, BookmarkIcon, ProfileIcon, PlusIcon } from './Icons';

type Tab = 'fil' | 'chercher' | 'aVoir' | 'profil';

interface BottomTabBarProps {
  active?: Tab;
  onTabPress?: (tab: Tab) => void;
  onAddPress?: () => void;
}

export function BottomTabBar({ active = 'fil', onTabPress, onAddPress }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  const color = (tab: Tab) => (active === tab ? Colors.terracotta : Colors.navInactive);

  return (
    <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, 12) }]}>
      <TouchableOpacity style={styles.tab} onPress={() => onTabPress?.('fil')}>
        <HomeIcon color={color('fil')} />
        <Text style={[styles.label, active === 'fil' && styles.labelActive]}>Fil</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.tab} onPress={() => onTabPress?.('chercher')}>
        <SearchIcon color={color('chercher')} />
        <Text style={[styles.label, active === 'chercher' && styles.labelActive]}>Chercher</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.addBtn} onPress={onAddPress} activeOpacity={0.8}>
        <PlusIcon color="#fff" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.tab} onPress={() => onTabPress?.('aVoir')}>
        <BookmarkIcon color={color('aVoir')} />
        <Text style={[styles.label, active === 'aVoir' && styles.labelActive]}>À voir</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.tab} onPress={() => onTabPress?.('profil')}>
        <ProfileIcon color={color('profil')} />
        <Text style={[styles.label, active === 'profil' && styles.labelActive]}>Profil</Text>
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
    backgroundColor: Colors.navBg,
    borderTopWidth: 1,
    borderTopColor: Colors.navBorder,
  },
  tab: {
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
  },
  label: {
    fontFamily: Fonts.bodySemi,
    fontSize: 10,
    color: Colors.navInactive,
  },
  labelActive: {
    fontFamily: Fonts.bodyBold,
    color: Colors.terracotta,
  },
  addBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.terracotta,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -6,
    shadowColor: Colors.terracotta,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.42,
    shadowRadius: 8,
    elevation: 8,
  },
});
