import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Fonts } from '../theme';
import { searchMedia, isAnime } from '../services/tmdb';
import { TMDBSearchResult } from '../types/media';
import { MediaPoster } from './MediaPoster';

interface SearchModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectMedia: (item: TMDBSearchResult) => void;
}

function getMediaTypeBadge(item: TMDBSearchResult): { label: string; bg: string; fg: string } {
  if (isAnime(item)) {
    return { label: 'Animé', bg: 'rgba(244,117,33,0.15)', fg: '#F47521' };
  }
  if (item.media_type === 'tv') {
    return { label: 'Série', bg: 'rgba(100,149,237,0.15)', fg: '#6495ED' };
  }
  return { label: 'Film', bg: 'rgba(80,200,120,0.15)', fg: '#50C878' };
}

function getItemYear(item: TMDBSearchResult): string {
  const date = item.release_date ?? item.first_air_date ?? '';
  return date ? date.split('-')[0] : '';
}

function getItemTitle(item: TMDBSearchResult): string {
  return item.title ?? item.name ?? '';
}

export function SearchModal({ visible, onClose, onSelectMedia }: SearchModalProps) {
  const { colors, isDark } = useTheme();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<TMDBSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearch = useCallback((text: string) => {
    setQuery(text);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!text.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    debounceRef.current = setTimeout(async () => {
      const data = await searchMedia(text.trim());
      // Filter to only movie and tv results (exclude person etc.)
      setResults(data.filter(r => r.media_type === 'movie' || r.media_type === 'tv'));
      setLoading(false);
    }, 400);
  }, []);

  // Reset state when modal closes
  useEffect(() => {
    if (!visible) {
      setQuery('');
      setResults([]);
      setLoading(false);
      if (debounceRef.current) clearTimeout(debounceRef.current);
    }
  }, [visible]);

  const renderItem = ({ item }: { item: TMDBSearchResult }) => {
    const badge = getMediaTypeBadge(item);
    const year = getItemYear(item);
    const title = getItemTitle(item);
    const synopsis = item.overview ? item.overview.slice(0, 80) + (item.overview.length > 80 ? '…' : '') : '';

    return (
      <TouchableOpacity
        style={[styles.resultItem, { borderBottomColor: colors.divider }]}
        onPress={() => onSelectMedia(item)}
        activeOpacity={0.75}
      >
        <MediaPoster
          posterPath={item.poster_path}
          fallbackLabel={title}
          fallbackColors={['#2A2A3A', '#1A1A28']}
          width={46}
          height={66}
          borderRadius={8}
          fontSize={8}
        />
        <View style={styles.resultInfo}>
          <View style={styles.resultTitleRow}>
            <Text style={[styles.resultTitle, { color: colors.ink }]} numberOfLines={1}>
              {title}
            </Text>
          </View>
          <View style={styles.resultMeta}>
            {year ? (
              <Text style={[styles.resultYear, { color: colors.muted2 }]}>{year}</Text>
            ) : null}
            <View style={[styles.badge, { backgroundColor: badge.bg }]}>
              <Text style={[styles.badgeText, { color: badge.fg }]}>{badge.label}</Text>
            </View>
          </View>
          {synopsis ? (
            <Text style={[styles.resultSynopsis, { color: colors.muted2 }]} numberOfLines={2}>
              {synopsis}
            </Text>
          ) : null}
        </View>
      </TouchableOpacity>
    );
  };

  const showEmpty = !loading && query.trim().length > 0 && results.length === 0;
  const showHint = !loading && query.trim().length === 0;

  return (
    <Modal visible={visible} animationType="slide" statusBarTranslucent>
      <SafeAreaView style={[styles.screen, { backgroundColor: colors.background }]}>
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: colors.divider }]}>
          <Text style={[styles.headerTitle, { color: colors.ink }]}>Rechercher</Text>
          <TouchableOpacity
            onPress={onClose}
            style={[styles.closeBtn, { backgroundColor: colors.chip, borderColor: colors.cardBorder }]}
            activeOpacity={0.7}
          >
            <Text style={[styles.closeBtnText, { color: colors.muted }]}>×</Text>
          </TouchableOpacity>
        </View>

        {/* Search input */}
        <View style={[styles.inputContainer, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
          <TextInput
            style={[styles.input, { color: colors.ink, fontFamily: Fonts.regular }]}
            placeholder="Film, série, animé..."
            placeholderTextColor={colors.muted2}
            value={query}
            onChangeText={handleSearch}
            autoFocus={true}
            returnKeyType="search"
            clearButtonMode="while-editing"
            keyboardAppearance={isDark ? 'dark' : 'light'}
          />
          {loading && (
            <ActivityIndicator size="small" color={colors.accent} style={styles.loader} />
          )}
        </View>

        {/* Results */}
        {showHint ? (
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: colors.muted2 }]}>
              Tapez pour rechercher un film ou une série
            </Text>
          </View>
        ) : showEmpty ? (
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: colors.muted2 }]}>Aucun résultat</Text>
          </View>
        ) : (
          <FlatList
            data={results}
            keyExtractor={item => `${item.media_type}-${item.id}`}
            renderItem={renderItem}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontFamily: Fonts.semiBold,
    fontSize: 17,
    flex: 1,
  },
  closeBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    fontSize: 22,
    lineHeight: 26,
    fontFamily: Fonts.regular,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 14,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    padding: 0,
  },
  loader: {
    marginLeft: 8,
  },
  listContent: {
    paddingHorizontal: 14,
    paddingBottom: 24,
  },
  resultItem: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  resultInfo: {
    flex: 1,
    minWidth: 0,
    justifyContent: 'center',
  },
  resultTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  resultTitle: {
    fontFamily: Fonts.semiBold,
    fontSize: 14,
    flex: 1,
  },
  resultMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  resultYear: {
    fontFamily: Fonts.regular,
    fontSize: 12,
  },
  badge: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 999,
  },
  badgeText: {
    fontFamily: Fonts.medium,
    fontSize: 11,
  },
  resultSynopsis: {
    fontFamily: Fonts.regular,
    fontSize: 12,
    lineHeight: 17,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 80,
  },
  emptyText: {
    fontFamily: Fonts.regular,
    fontSize: 14,
  },
});
