import { TMDB_API_KEY } from '../config';
import { MediaItem, TMDBSearchResult, WatchProvider } from '../types/media';

const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE = 'https://image.tmdb.org/t/p';

// Retourne l'URL complète d'une image TMDB
export function getPosterUrl(
  path: string | null,
  size: 'w185' | 'w342' | 'w500' | 'original' = 'w342'
): string {
  if (!path) return '';
  return `${IMAGE_BASE}/${size}${path}`;
}

// Helper : détecte si un résultat TMDB est un animé
export function isAnime(result: TMDBSearchResult): boolean {
  return (
    result.genre_ids.includes(16) &&
    result.original_language === 'ja'
  );
}

// Recherche multi (films + séries)
export async function searchMedia(
  query: string,
  language = 'fr-FR'
): Promise<TMDBSearchResult[]> {
  try {
    const url = `${BASE_URL}/search/multi?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&language=${language}`;
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    return (data.results ?? []) as TMDBSearchResult[];
  } catch {
    return [];
  }
}

// Détails d'un film
export async function getMovieDetails(tmdbId: number): Promise<MediaItem> {
  const language = 'fr-FR';
  const url = `${BASE_URL}/movie/${tmdbId}?api_key=${TMDB_API_KEY}&language=${language}&append_to_response=watch/providers`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`TMDB movie ${tmdbId} error: ${res.status}`);
  const d = await res.json();

  const releaseDate: string = d.release_date ?? '';
  const year = releaseDate ? parseInt(releaseDate.split('-')[0], 10) : 0;

  const providersRaw = d['watch/providers']?.results?.FR?.flatrate ?? [];
  const platforms: WatchProvider[] = providersRaw.map((p: { provider_id: number; provider_name: string; logo_path: string }) => ({
    id: p.provider_id,
    name: p.provider_name,
    logoPath: p.logo_path,
  }));

  return {
    id: d.id,
    tmdbId: d.id,
    title: d.title ?? d.original_title ?? '',
    originalTitle: d.original_title ?? '',
    type: 'movie',
    posterPath: d.poster_path ?? null,
    backdropPath: d.backdrop_path ?? null,
    synopsis: d.overview ?? '',
    releaseDate,
    year,
    duration: d.runtime ?? null,
    episodeCount: null,
    seasonCount: null,
    genres: (d.genres ?? []).map((g: { name: string }) => g.name),
    voteAverage: d.vote_average ?? 0,
    popularity: d.popularity ?? 0,
    status: d.status ?? '',
    platforms,
    language: d.original_language ?? '',
  };
}

// Détails d'une série
export async function getTVDetails(tmdbId: number): Promise<MediaItem> {
  const language = 'fr-FR';
  const url = `${BASE_URL}/tv/${tmdbId}?api_key=${TMDB_API_KEY}&language=${language}&append_to_response=watch/providers`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`TMDB tv ${tmdbId} error: ${res.status}`);
  const d = await res.json();

  const firstAirDate: string = d.first_air_date ?? '';
  const year = firstAirDate ? parseInt(firstAirDate.split('-')[0], 10) : 0;

  const providersRaw = d['watch/providers']?.results?.FR?.flatrate ?? [];
  const platforms: WatchProvider[] = providersRaw.map((p: { provider_id: number; provider_name: string; logo_path: string }) => ({
    id: p.provider_id,
    name: p.provider_name,
    logoPath: p.logo_path,
  }));

  const genreIds: number[] = (d.genres ?? []).map((g: { id: number }) => g.id);
  const isAnimeTitle =
    genreIds.includes(16) && (d.original_language === 'ja');
  const mediaType = isAnimeTitle ? 'anime' : 'tv';

  return {
    id: d.id,
    tmdbId: d.id,
    title: d.name ?? d.original_name ?? '',
    originalTitle: d.original_name ?? '',
    type: mediaType,
    posterPath: d.poster_path ?? null,
    backdropPath: d.backdrop_path ?? null,
    synopsis: d.overview ?? '',
    releaseDate: firstAirDate,
    year,
    duration: null,
    episodeCount: d.number_of_episodes ?? null,
    seasonCount: d.number_of_seasons ?? null,
    genres: (d.genres ?? []).map((g: { name: string }) => g.name),
    voteAverage: d.vote_average ?? 0,
    popularity: d.popularity ?? 0,
    status: d.status ?? '',
    platforms,
    language: d.original_language ?? '',
  };
}

// Détails auto (détecte le type)
export async function getMediaDetails(
  tmdbId: number,
  type: 'movie' | 'tv'
): Promise<MediaItem> {
  if (type === 'movie') return getMovieDetails(tmdbId);
  return getTVDetails(tmdbId);
}

// Plateformes de streaming disponibles en France
export async function getWatchProviders(
  tmdbId: number,
  type: 'movie' | 'tv'
): Promise<WatchProvider[]> {
  try {
    const url = `${BASE_URL}/${type}/${tmdbId}/watch/providers?api_key=${TMDB_API_KEY}`;
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    const flatrate = data.results?.FR?.flatrate ?? [];
    return flatrate.map((p: { provider_id: number; provider_name: string; logo_path: string }) => ({
      id: p.provider_id,
      name: p.provider_name,
      logoPath: p.logo_path,
    }));
  } catch {
    return [];
  }
}

// Films tendance cette semaine
export async function getTrendingMovies(language = 'fr-FR'): Promise<TMDBSearchResult[]> {
  try {
    const url = `${BASE_URL}/trending/movie/week?api_key=${TMDB_API_KEY}&language=${language}`;
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    return (data.results ?? []) as TMDBSearchResult[];
  } catch {
    return [];
  }
}

// Séries tendance cette semaine
export async function getTrendingTV(language = 'fr-FR'): Promise<TMDBSearchResult[]> {
  try {
    const url = `${BASE_URL}/trending/tv/week?api_key=${TMDB_API_KEY}&language=${language}`;
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    return (data.results ?? []) as TMDBSearchResult[];
  } catch {
    return [];
  }
}

// Films populaires
export async function getPopularMovies(language = 'fr-FR'): Promise<TMDBSearchResult[]> {
  try {
    const url = `${BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&language=${language}`;
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    return (data.results ?? []) as TMDBSearchResult[];
  } catch {
    return [];
  }
}
