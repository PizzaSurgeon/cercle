export type MediaType = 'movie' | 'tv' | 'anime';

export interface MediaItem {
  id: number;
  tmdbId: number;
  title: string;
  originalTitle: string;
  type: MediaType;
  posterPath: string | null;     // chemin relatif TMDB ex: "/abc.jpg"
  backdropPath: string | null;
  synopsis: string;
  releaseDate: string;           // "2024-01-15"
  year: number;
  duration: number | null;       // minutes (films) ou null (séries)
  episodeCount: number | null;   // null pour films
  seasonCount: number | null;    // null pour films
  genres: string[];
  voteAverage: number;           // note TMDB 0-10
  popularity: number;
  status: string;                // "Released", "Ended", "Returning Series"
  platforms: WatchProvider[];
  language: string;              // "fr", "en", "ja"
}

export interface WatchProvider {
  id: number;
  name: string;
  logoPath: string;
}

export interface TMDBSearchResult {
  id: number;
  title?: string;          // films
  name?: string;           // séries/animés
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date?: string;   // films
  first_air_date?: string; // séries
  vote_average: number;
  popularity: number;
  media_type?: MediaType;
  genre_ids: number[];
  original_language: string;
}

export interface UserRating {
  mediaId: number;
  rating: number;          // 0.5 à 5
  comment: string;
  platform: string;
  createdAt: string;
  recommend: 'cercle' | 'amis' | 'none';
}
