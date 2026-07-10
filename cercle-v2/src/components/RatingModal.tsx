import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import { Fonts } from '../theme';
import { Avatar } from './Avatar';

interface RatingModalProps {
  visible: boolean;
  title: string;
  onClose: () => void;
  onSubmit: (rating: number, comment: string, platform: string, selectedPeople: string[]) => void;
}

const PLATFORMS = ['Netflix', 'Prime Video', 'Disney+', 'Apple TV+', 'Canal+', 'Crunchyroll', 'Salle', 'Autre'];

const CIRCLE_MEMBERS = [
  { name: 'Camille', initial: 'C', bg: '#D9A8B4', fg: '#6B2E3E' },
  { name: 'Tom',     initial: 'T', bg: '#A9C0CE', fg: '#2E4A57' },
  { name: 'Sofia',   initial: 'S', bg: '#C7B79B', fg: '#5A4A30' },
  { name: 'Léa',     initial: 'L', bg: '#E5B98A', fg: '#7A3B22' },
  { name: 'Maxime',  initial: 'M', bg: '#B8C8A8', fg: '#42562E' },
];

const ALL_NAMES = CIRCLE_MEMBERS.map(m => m.name);

export function RatingModal({ visible, title, onClose, onSubmit }: RatingModalProps) {
  const { colors } = useTheme();

  const [comment, setComment] = useState('');
  const [platform, setPlatform] = useState('');
  const [selectedPeople, setSelectedPeople] = useState<string[]>([]);

  const allSelected = ALL_NAMES.every(n => selectedPeople.includes(n));

  const toggleAll = () => {
    setSelectedPeople(allSelected ? [] : [...ALL_NAMES]);
  };

  const togglePerson = (name: string) => {
    setSelectedPeople(prev =>
      prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]
    );
  };

  const handleSubmit = () => {
    onSubmit(0, comment, platform, selectedPeople);
    reset();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const reset = () => {
    setComment('');
    setPlatform('');
    setSelectedPeople([]);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent statusBarTranslucent>
      <Pressable style={styles.backdrop} onPress={handleClose}>
        <Pressable style={[styles.sheet, { backgroundColor: colors.background, borderColor: colors.cardBorder }]} onPress={() => {}}>

          <View style={[styles.handle, { backgroundColor: colors.muted }]} />

          <View style={[styles.header, { borderBottomColor: colors.divider }]}>
            <Text style={[styles.headerTitle, { color: colors.ink }]} numberOfLines={1}>{title}</Text>
            <TouchableOpacity onPress={handleClose} style={[styles.closeBtn, { backgroundColor: colors.chip, borderColor: colors.cardBorder }]} activeOpacity={0.7}>
              <Text style={[styles.closeBtnText, { color: colors.muted }]}>×</Text>
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

            {/* Avis */}
            <View style={styles.section}>
              <Text style={[styles.sectionLabel, { color: colors.ink }]}>Ton avis</Text>
              <View style={[styles.textInputWrapper, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
                <TextInput
                  value={comment}
                  onChangeText={setComment}
                  placeholder="Ton avis... (140 car. max)"
                  placeholderTextColor={colors.muted}
                  multiline
                  maxLength={140}
                  style={[styles.textInput, { color: colors.ink }]}
                />
                <Text style={[styles.charCount, { color: colors.muted }]}>{comment.length}/140</Text>
              </View>
            </View>

            {/* Plateforme */}
            <View style={styles.section}>
              <Text style={[styles.sectionLabel, { color: colors.ink }]}>Plateforme de visionnage</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsRow}>
                {PLATFORMS.map(p => {
                  const isActive = platform === p;
                  return isActive ? (
                    <TouchableOpacity key={p} onPress={() => setPlatform('')} activeOpacity={0.75}>
                      <LinearGradient colors={[colors.accent, colors.accentEnd]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.chipActive}>
                        <Text style={[styles.chipTextActive, { color: colors.onAccent }]}>{p}</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity key={p} onPress={() => setPlatform(p)} activeOpacity={0.75}
                      style={[styles.chip, { backgroundColor: colors.chip, borderColor: colors.chipBorder }]}>
                      <Text style={[styles.chipText, { color: colors.chipText }]}>{p}</Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>

            {/* Recommander à */}
            <View style={styles.section}>
              <Text style={[styles.sectionLabel, { color: colors.ink }]}>Recommander à</Text>

              {/* Tout le cercle */}
              <TouchableOpacity onPress={toggleAll} activeOpacity={0.75}
                style={[styles.tousBtn, {
                  backgroundColor: allSelected ? colors.accent + '22' : colors.chip,
                  borderColor: allSelected ? colors.accent : colors.chipBorder,
                }]}>
                <Text style={[styles.tousBtnText, { color: allSelected ? colors.accent : colors.ink2 }]}>
                  Tout le cercle
                </Text>
              </TouchableOpacity>

              {/* Grille des membres */}
              <View style={styles.membersGrid}>
                {CIRCLE_MEMBERS.map(member => {
                  const isSelected = selectedPeople.includes(member.name);
                  return (
                    <TouchableOpacity key={member.name} onPress={() => togglePerson(member.name)} activeOpacity={0.75}
                      style={[styles.memberCell, {
                        backgroundColor: isSelected ? colors.accent + '18' : colors.chip,
                        borderColor: isSelected ? colors.accent : colors.chipBorder,
                      }]}>
                      <Avatar initial={member.initial} bg={member.bg} fg={member.fg} size={36} />
                      <Text style={[styles.memberName, { color: isSelected ? colors.accent : colors.ink2 }]} numberOfLines={1}>
                        {member.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <View style={{ height: 20 }} />
          </ScrollView>

          <TouchableOpacity onPress={handleSubmit} activeOpacity={0.85} style={styles.submitTouchable}>
            <LinearGradient colors={[colors.accent, colors.accentEnd]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.submitButton}>
              <Text style={[styles.submitText, { color: colors.onAccent }]}>Publier</Text>
            </LinearGradient>
          </TouchableOpacity>

        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    paddingHorizontal: 18,
    paddingBottom: 32,
    paddingTop: 12,
    maxHeight: '92%',
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
    opacity: 0.4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 14,
    borderBottomWidth: 1,
    marginBottom: 8,
  },
  headerTitle: {
    fontFamily: Fonts.semiBold,
    fontSize: 16,
    flex: 1,
    marginRight: 12,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    fontSize: 22,
    lineHeight: 26,
    fontFamily: Fonts.regular,
  },
  scrollContent: {
    paddingTop: 8,
  },
  section: {
    marginBottom: 22,
  },
  sectionLabel: {
    fontFamily: Fonts.semiBold,
    fontSize: 14,
    marginBottom: 10,
  },
  textInputWrapper: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 12,
    minHeight: 90,
  },
  textInput: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    lineHeight: 20,
    minHeight: 60,
    textAlignVertical: 'top',
  },
  charCount: {
    fontFamily: Fonts.regular,
    fontSize: 11,
    textAlign: 'right',
    marginTop: 4,
  },
  chipsRow: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 2,
  },
  chip: {
    paddingVertical: 9,
    paddingHorizontal: 15,
    borderRadius: 999,
    borderWidth: 1,
  },
  chipActive: {
    paddingVertical: 9,
    paddingHorizontal: 15,
    borderRadius: 999,
  },
  chipText: {
    fontFamily: Fonts.regular,
    fontSize: 13,
  },
  chipTextActive: {
    fontFamily: Fonts.semiBold,
    fontSize: 13,
  },
  tousBtn: {
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 10,
  },
  tousBtnText: {
    fontFamily: Fonts.semiBold,
    fontSize: 14,
  },
  membersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  memberCell: {
    width: '30%',
    flexGrow: 1,
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
    gap: 6,
  },
  memberName: {
    fontFamily: Fonts.medium,
    fontSize: 12,
  },
  submitTouchable: {
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 8,
  },
  submitButton: {
    paddingVertical: 16,
    alignItems: 'center',
    borderRadius: 16,
  },
  submitText: {
    fontFamily: Fonts.semiBold,
    fontSize: 16,
  },
});
