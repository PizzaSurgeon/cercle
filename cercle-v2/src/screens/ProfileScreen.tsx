import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Modal, SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { Fonts } from '../theme';
import { MoonIcon, SunIcon, ChevronIcon } from '../components/Icons';
import { StarRating } from '../components/StarRating';
import { Avatar } from '../components/Avatar';
import { UserProfileModal } from '../components/UserProfileModal';
import Svg, { Path, Rect, Circle } from 'react-native-svg';

type WatchedType = 'movie' | 'tv' | 'anime';

interface WatchedTitle {
  title: string;
  year: string;
  rating: number;
}

interface MemberInfo {
  name: string;
  initial: string;
  avatarBg: string;
  avatarFg: string;
  isAdmin?: boolean;
}

const WATCHED_DATA: Record<WatchedType, { label: string; count: number; titles: WatchedTitle[] }> = {
  movie: {
    label: 'Films',
    count: 47,
    titles: [
      { title: 'Dune : Deuxième Partie', year: '2024', rating: 4.7 },
      { title: 'Past Lives', year: '2023', rating: 4.5 },
      { title: 'Poor Things', year: '2023', rating: 4.2 },
      { title: 'Oppenheimer', year: '2023', rating: 4.6 },
      { title: 'Aftersun', year: '2022', rating: 4.4 },
      { title: 'Everything Everywhere All at Once', year: '2022', rating: 4.8 },
      { title: 'The Banshees of Inisherin', year: '2022', rating: 4.0 },
      { title: 'Tár', year: '2022', rating: 3.8 },
    ],
  },
  tv: {
    label: 'Séries',
    count: 12,
    titles: [
      { title: 'Shōgun', year: '2024', rating: 4.3 },
      { title: 'The Bear', year: '2024', rating: 4.0 },
      { title: 'The Last of Us', year: '2023', rating: 4.4 },
      { title: 'Succession', year: '2023', rating: 5.0 },
      { title: 'Severance', year: '2022', rating: 4.6 },
    ],
  },
  anime: {
    label: 'Animés',
    count: 8,
    titles: [
      { title: 'Attack on Titan', year: '2023', rating: 4.8 },
      { title: 'Frieren', year: '2023', rating: 4.7 },
      { title: 'Jujutsu Kaisen', year: '2023', rating: 4.3 },
      { title: 'Vinland Saga', year: '2022', rating: 4.5 },
    ],
  },
};

const CIRCLE_MEMBERS: MemberInfo[] = [
  { name: 'Alex',    initial: 'A', avatarBg: '',        avatarFg: '',        isAdmin: true },
  { name: 'Camille', initial: 'C', avatarBg: '#D9A8B4', avatarFg: '#6B2E3E' },
  { name: 'Tom',     initial: 'T', avatarBg: '#A9C0CE', avatarFg: '#2E4A57' },
  { name: 'Sofia',   initial: 'S', avatarBg: '#C7B79B', avatarFg: '#5A4A30' },
  { name: 'Léa',     initial: 'L', avatarBg: '#E5B98A', avatarFg: '#7A3B22' },
  { name: 'Maxime',  initial: 'M', avatarBg: '#B8C8A8', avatarFg: '#42562E' },
];

const AVERAGE_RATING = 4.1;

export function ProfileScreen() {
  const { colors, isDark, toggleTheme } = useTheme();
  const insets = useSafeAreaInsets();
  const [watchedModal, setWatchedModal] = useState<WatchedType | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<MemberInfo | null>(null);
  const [removedMembers, setRemovedMembers] = useState<Set<string>>(new Set());

  const watchedData = watchedModal ? WATCHED_DATA[watchedModal] : null;
  const visibleMembers = CIRCLE_MEMBERS.filter(m => !removedMembers.has(m.name));

  const removeMember = (name: string) => {
    setRemovedMembers(prev => new Set([...prev, name]));
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[styles.pageTitle, { color: colors.ink }]}>Profil</Text>

        {/* Avatar + name */}
        <View style={styles.profileHeader}>
          <LinearGradient
            colors={[colors.accent, colors.accentEnd]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={[styles.avatar, { shadowColor: colors.accentGlow }]}
          >
            <Text style={[styles.avatarInitial, { color: colors.onAccent }]}>A</Text>
          </LinearGradient>
          <View>
            <Text style={[styles.userName, { color: colors.ink }]}>Alex</Text>
            <Text style={[styles.userMeta, { color: colors.muted2 }]}>Membre depuis 2023 · 4 amis</Text>
          </View>
        </View>

        {/* Vus */}
        <Text style={[styles.sectionLabel, { color: colors.muted2 }]}>VUS</Text>
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
          {(['movie', 'tv', 'anime'] as WatchedType[]).map((type, i, arr) => {
            const data = WATCHED_DATA[type];
            return (
              <TouchableOpacity
                key={type}
                onPress={() => setWatchedModal(type)}
                activeOpacity={0.7}
                style={[
                  styles.watchedRow,
                  i < arr.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.divider },
                ]}
              >
                <Text style={[styles.watchedLabel, { color: colors.ink }]}>{data.label}</Text>
                <View style={styles.watchedRight}>
                  <Text style={[styles.watchedCount, { color: colors.muted2 }]}>{data.count} titres</Text>
                  <ChevronIcon color={colors.muted2} size={15} />
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Note moyenne */}
        <Text style={[styles.sectionLabel, { color: colors.muted2 }]}>NOTE MOYENNE</Text>
        <View style={[styles.card, styles.ratingCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
          <Text style={[styles.avgRatingValue, { color: colors.starFill }]}>
            {AVERAGE_RATING.toFixed(1).replace('.', ',')}
          </Text>
          <StarRating value={AVERAGE_RATING} size="md" />
        </View>

        {/* Membres du cercle */}
        <Text style={[styles.sectionLabel, { color: colors.muted2 }]}>
          MEMBRES DU CERCLE · {visibleMembers.length}
        </Text>
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
          {visibleMembers.map((member, i, arr) => (
            <View
              key={member.name}
              style={[
                styles.memberRow,
                i < arr.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.divider },
              ]}
            >
              {/* Tappable zone → profile */}
              <TouchableOpacity
                style={styles.memberInfo}
                onPress={() => !member.isAdmin && setSelectedMember(member)}
                activeOpacity={member.isAdmin ? 1 : 0.7}
              >
                {member.isAdmin ? (
                  <LinearGradient
                    colors={[colors.accent, colors.accentEnd]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    style={styles.memberAvatarGradient}
                  >
                    <Text style={[styles.memberAvatarInitial, { color: colors.onAccent }]}>A</Text>
                  </LinearGradient>
                ) : (
                  <Avatar initial={member.initial} bg={member.avatarBg} fg={member.avatarFg} size={38} />
                )}
                <View style={styles.memberNameBlock}>
                  <Text style={[styles.memberName, { color: colors.ink }]}>{member.name}</Text>
                  {member.isAdmin && (
                    <Text style={[styles.adminBadge, { color: colors.accent }]}>Admin</Text>
                  )}
                </View>
              </TouchableOpacity>

              {/* Remove button (non-admin only) */}
              {!member.isAdmin && (
                <TouchableOpacity
                  onPress={() => removeMember(member.name)}
                  style={[styles.removeBtn, { backgroundColor: colors.deleteRedBg, borderColor: colors.deleteRedBorder }]}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.removeBtnText, { color: colors.deleteRed }]}>−</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}

          {/* Invite row */}
          <TouchableOpacity
            style={[styles.inviteRow, { borderTopWidth: 1, borderTopColor: colors.divider }]}
            activeOpacity={0.7}
          >
            <View style={[styles.inviteIcon, { backgroundColor: colors.chip, borderColor: colors.chipBorder }]}>
              <Text style={[styles.invitePlus, { color: colors.accent }]}>+</Text>
            </View>
            <Text style={[styles.inviteLabel, { color: colors.accent }]}>Inviter quelqu'un</Text>
          </TouchableOpacity>
        </View>

        {/* Gestion du compte */}
        <TouchableOpacity
          onPress={() => setSettingsOpen(v => !v)}
          activeOpacity={0.75}
          style={[styles.accountBtn, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
        >
          <View style={[styles.settingIcon, { backgroundColor: colors.chip, borderColor: colors.chipBorder }]}>
            <GearIcon color={colors.accent} />
          </View>
          <Text style={[styles.accountBtnLabel, { color: colors.ink }]}>Gestion du compte</Text>
          <View style={{ transform: [{ rotate: settingsOpen ? '90deg' : '0deg' }] }}>
            <ChevronIcon color={colors.muted2} size={18} />
          </View>
        </TouchableOpacity>

        {settingsOpen && (
          <View style={[styles.settingsCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
            <View style={[styles.settingRow, { borderBottomColor: colors.divider, borderBottomWidth: 1 }]}>
              <View style={[styles.settingIcon, { backgroundColor: colors.chip, borderColor: colors.chipBorder }]}>
                {isDark ? <MoonIcon color={colors.accent} size={17} /> : <SunIcon color={colors.accent} size={17} />}
              </View>
              <Text style={[styles.settingLabel, { color: colors.ink }]}>Mode sombre</Text>
              <TouchableOpacity
                onPress={toggleTheme}
                style={[styles.toggle, { backgroundColor: isDark ? colors.accent : colors.track }]}
                activeOpacity={0.8}
              >
                <View style={[styles.toggleKnob, { left: isDark ? 22 : 3 }]} />
              </TouchableOpacity>
            </View>

            {([
              { icon: <LockIcon color={colors.accent} />, label: 'Confidentialité des listes' },
              { icon: <BellIcon color={colors.accent} />, label: 'Notifications' },
              { icon: <UserIcon color={colors.accent} />, label: 'Compte' },
            ] as const).map((item, i, arr) => (
              <TouchableOpacity
                key={i}
                style={[styles.settingRow, i < arr.length - 1 && { borderBottomColor: colors.divider, borderBottomWidth: 1 }]}
                activeOpacity={0.7}
              >
                <View style={[styles.settingIcon, { backgroundColor: colors.chip, borderColor: colors.chipBorder }]}>
                  {item.icon}
                </View>
                <Text style={[styles.settingLabel, { color: colors.ink }]}>{item.label}</Text>
                <ChevronIcon color={colors.muted2} size={18} />
              </TouchableOpacity>
            ))}

            <TouchableOpacity style={styles.settingRow} activeOpacity={0.7}>
              <View style={[styles.settingIcon, { backgroundColor: colors.deleteRedBg, borderColor: colors.deleteRedBorder }]}>
                <LogoutIcon color={colors.deleteRed} />
              </View>
              <Text style={[styles.settingLabel, { color: colors.deleteRed }]}>Déconnexion</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={{ height: 32 }} />
      </ScrollView>

      {/* Watched list modal */}
      {watchedData && (
        <Modal visible={!!watchedModal} animationType="slide" statusBarTranslucent>
          <SafeAreaView style={[styles.modalScreen, { backgroundColor: colors.background }]}>
            <View style={[styles.modalNavbar, { borderBottomColor: colors.divider }]}>
              <View style={styles.navSpacer} />
              <Text style={[styles.modalNavTitle, { color: colors.ink }]}>{watchedData.label} vus</Text>
              <TouchableOpacity
                onPress={() => setWatchedModal(null)}
                style={[styles.closeBtn, { backgroundColor: colors.chip, borderColor: colors.cardBorder }]}
                activeOpacity={0.7}
              >
                <Text style={[styles.closeBtnText, { color: colors.muted }]}>×</Text>
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.modalContent}>
              <Text style={[styles.modalCount, { color: colors.muted2 }]}>{watchedData.count} titres notés</Text>
              {watchedData.titles.map((t, i) => (
                <View
                  key={i}
                  style={[
                    styles.titleRow,
                    { borderBottomColor: colors.divider },
                    i < watchedData.titles.length - 1 && { borderBottomWidth: 1 },
                  ]}
                >
                  <View style={styles.titleInfo}>
                    <Text style={[styles.titleName, { color: colors.ink }]}>{t.title}</Text>
                    <Text style={[styles.titleYear, { color: colors.muted2 }]}>{t.year}</Text>
                  </View>
                  <View style={styles.titleRating}>
                    <Text style={[styles.titleRatingNum, { color: colors.starFill }]}>
                      {t.rating.toFixed(1).replace('.', ',')}
                    </Text>
                    <StarRating value={t.rating} size="sm" />
                  </View>
                </View>
              ))}
            </ScrollView>
          </SafeAreaView>
        </Modal>
      )}

      {/* Member profile modal */}
      {selectedMember && (
        <UserProfileModal
          visible={!!selectedMember}
          name={selectedMember.name}
          initial={selectedMember.initial}
          avatarBg={selectedMember.avatarBg}
          avatarFg={selectedMember.avatarFg}
          onClose={() => setSelectedMember(null)}
        />
      )}
    </View>
  );
}

function GearIcon({ color }: { color: string }) {
  return (
    <Svg width={17} height={17} viewBox="0 0 24 24" fill="none">
      <Path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" stroke={color} strokeWidth={1.9} strokeLinecap="round" />
      <Path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" stroke={color} strokeWidth={1.9} strokeLinecap="round" />
    </Svg>
  );
}

function LockIcon({ color }: { color: string }) {
  return (
    <Svg width={17} height={17} viewBox="0 0 24 24" fill="none">
      <Rect x={5} y={11} width={14} height={9} rx={2} stroke={color} strokeWidth={1.9} strokeLinecap="round" />
      <Path d="M8 11V8a4 4 0 0 1 8 0v3" stroke={color} strokeWidth={1.9} strokeLinecap="round" />
    </Svg>
  );
}

function BellIcon({ color }: { color: string }) {
  return (
    <Svg width={17} height={17} viewBox="0 0 24 24" fill="none">
      <Path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" stroke={color} strokeWidth={1.9} strokeLinecap="round" />
      <Path d="M13.7 21a2 2 0 0 1-3.4 0" stroke={color} strokeWidth={1.9} strokeLinecap="round" />
    </Svg>
  );
}

function UserIcon({ color }: { color: string }) {
  return (
    <Svg width={17} height={17} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={8} r={4} stroke={color} strokeWidth={1.9} />
      <Path d="M4 21c0-4 3.6-6.5 8-6.5s8 2.5 8 6.5" stroke={color} strokeWidth={1.9} strokeLinecap="round" />
    </Svg>
  );
}

function LogoutIcon({ color }: { color: string }) {
  return (
    <Svg width={17} height={17} viewBox="0 0 24 24" fill="none">
      <Path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke={color} strokeWidth={1.9} strokeLinecap="round" />
      <Path d="M16 17l5-5-5-5M21 12H9" stroke={color} strokeWidth={1.9} strokeLinecap="round" />
    </Svg>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { padding: 18, paddingBottom: 32 },
  pageTitle: { fontFamily: Fonts.semiBold, fontSize: 27, letterSpacing: -0.5, marginBottom: 18 },
  profileHeader: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 26 },
  avatar: {
    width: 60, height: 60, borderRadius: 30,
    alignItems: 'center', justifyContent: 'center',
    shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.5, shadowRadius: 12, elevation: 8,
  },
  avatarInitial: { fontFamily: Fonts.semiBold, fontSize: 22 },
  userName: { fontFamily: Fonts.semiBold, fontSize: 19 },
  userMeta: { fontFamily: Fonts.regular, fontSize: 12.5, marginTop: 2 },

  sectionLabel: {
    fontFamily: Fonts.semiBold, fontSize: 11, letterSpacing: 0.8,
    marginBottom: 8, paddingLeft: 4,
  },
  card: {
    borderRadius: 18, borderWidth: 1, marginBottom: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: 9 },
    shadowOpacity: 0.45, shadowRadius: 20, elevation: 6,
  },

  watchedRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 15,
  },
  watchedLabel: { fontFamily: Fonts.semiBold, fontSize: 15 },
  watchedRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  watchedCount: { fontFamily: Fonts.regular, fontSize: 13 },

  ratingCard: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    paddingHorizontal: 18, paddingVertical: 18,
  },
  avgRatingValue: { fontFamily: Fonts.semiBold, fontSize: 32, lineHeight: 36 },

  memberRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 12, gap: 10,
  },
  memberInfo: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 12 },
  memberAvatarGradient: {
    width: 38, height: 38, borderRadius: 19,
    alignItems: 'center', justifyContent: 'center',
  },
  memberAvatarInitial: { fontFamily: Fonts.semiBold, fontSize: 15 },
  memberNameBlock: { flex: 1 },
  memberName: { fontFamily: Fonts.semiBold, fontSize: 15 },
  adminBadge: { fontFamily: Fonts.medium, fontSize: 11, marginTop: 1 },
  removeBtn: {
    width: 30, height: 30, borderRadius: 15, borderWidth: 1,
    alignItems: 'center', justifyContent: 'center',
  },
  removeBtnText: { fontSize: 20, lineHeight: 22, fontFamily: Fonts.regular },

  inviteRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 13 },
  inviteIcon: {
    width: 38, height: 38, borderRadius: 19, borderWidth: 1,
    alignItems: 'center', justifyContent: 'center',
  },
  invitePlus: { fontSize: 22, lineHeight: 26, fontFamily: Fonts.regular },
  inviteLabel: { fontFamily: Fonts.semiBold, fontSize: 15 },

  accountBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 13,
    borderRadius: 18, borderWidth: 1,
    paddingHorizontal: 16, paddingVertical: 14,
    shadowColor: '#000', shadowOffset: { width: 0, height: 9 },
    shadowOpacity: 0.45, shadowRadius: 20, elevation: 6,
  },
  accountBtnLabel: { flex: 1, fontFamily: Fonts.medium, fontSize: 15 },

  settingsCard: {
    borderRadius: 18, borderWidth: 1, marginTop: 8,
    shadowColor: '#000', shadowOffset: { width: 0, height: 9 },
    shadowOpacity: 0.45, shadowRadius: 20, elevation: 6,
    paddingHorizontal: 16,
  },
  settingRow: { flexDirection: 'row', alignItems: 'center', gap: 13, paddingVertical: 13 },
  settingIcon: {
    width: 34, height: 34, borderRadius: 10, borderWidth: 1,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  settingLabel: { flex: 1, fontFamily: Fonts.medium, fontSize: 15 },
  toggle: { width: 46, height: 27, borderRadius: 999 },
  toggleKnob: {
    position: 'absolute', top: 3, width: 21, height: 21, borderRadius: 10.5,
    backgroundColor: '#fff',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.35, shadowRadius: 3, elevation: 3,
  },

  // Watched modal
  modalScreen: { flex: 1 },
  modalNavbar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 18, paddingVertical: 14, borderBottomWidth: 1,
  },
  navSpacer: { width: 38 },
  modalNavTitle: { fontFamily: Fonts.semiBold, fontSize: 17 },
  closeBtn: {
    width: 38, height: 38, borderRadius: 19, borderWidth: 1,
    alignItems: 'center', justifyContent: 'center',
  },
  closeBtnText: { fontSize: 22, lineHeight: 26, fontFamily: Fonts.regular },
  modalContent: { padding: 18, paddingBottom: 40 },
  modalCount: { fontFamily: Fonts.regular, fontSize: 13, marginBottom: 16 },
  titleRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: 14, gap: 12,
  },
  titleInfo: { flex: 1, minWidth: 0 },
  titleName: { fontFamily: Fonts.semiBold, fontSize: 15, lineHeight: 19 },
  titleYear: { fontFamily: Fonts.regular, fontSize: 12, marginTop: 2 },
  titleRating: { alignItems: 'flex-end', gap: 4, flexShrink: 0 },
  titleRatingNum: { fontFamily: Fonts.semiBold, fontSize: 15 },
});
