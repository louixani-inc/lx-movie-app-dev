import axios from 'axios';

// TMDB API configuration
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';
const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

// Create axios instance for TMDB
const tmdbApi = axios.create({
  baseURL: TMDB_BASE_URL,
  params: {
    api_key: API_KEY,
  },
  timeout: 10000,
});

// Movie interfaces
export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  adult: boolean;
  original_language: string;
  original_title: string;
  popularity: number;
  video: boolean;
}

export interface MovieDetails extends Movie {
  runtime: number;
  genres: Genre[];
  production_companies: ProductionCompany[];
  production_countries: ProductionCountry[];
  spoken_languages: SpokenLanguage[];
  status: string;
  tagline: string;
  budget: number;
  revenue: number;
  imdb_id: string;
  homepage: string;
  belongs_to_collection: Collection | null;
  credits?: Credits;
  videos?: Videos;
  similar?: MovieResponse;
  recommendations?: MovieResponse;
}

export interface Genre {
  id: number;
  name: string;
}

export interface ProductionCompany {
  id: number;
  logo_path: string | null;
  name: string;
  origin_country: string;
}

export interface ProductionCountry {
  iso_3166_1: string;
  name: string;
}

export interface SpokenLanguage {
  english_name: string;
  iso_639_1: string;
  name: string;
}

export interface Collection {
  id: number;
  name: string;
  poster_path: string | null;
  backdrop_path: string | null;
}

export interface Credits {
  cast: CastMember[];
  crew: CrewMember[];
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
}

export interface CrewMember {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
}

export interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
  published_at: string;
}

export interface Videos {
  results: Video[];
}

export interface MovieResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export interface SearchResponse extends MovieResponse {}

// Streaming source interfaces
export interface StreamingSource {
  name: string;
  url: string;
  quality: string;
  type: 'embed' | 'direct' | 'hls' | 'mp4';
  server?: string;
}

export interface StreamingResponse {
  movieId: number;
  sources: StreamingSource[];
  totalSources: number;
}

// API functions
export const movieAPI = {
  // Search movies
  searchMovies: async (query: string, page: number = 1): Promise<SearchResponse> => {
    const response = await tmdbApi.get('/search/movie', {
      params: { query, page, include_adult: false },
    });
    return response.data;
  },

  // Get popular movies
  getPopularMovies: async (page: number = 1): Promise<MovieResponse> => {
    const response = await tmdbApi.get('/movie/popular', {
      params: { page },
    });
    return response.data;
  },

  // Get trending movies
  getTrendingMovies: async (timeWindow: 'day' | 'week' = 'week'): Promise<MovieResponse> => {
    const response = await tmdbApi.get(`/trending/movie/${timeWindow}`);
    return response.data;
  },

  // Get top rated movies
  getTopRatedMovies: async (page: number = 1): Promise<MovieResponse> => {
    const response = await tmdbApi.get('/movie/top_rated', {
      params: { page },
    });
    return response.data;
  },

  // Get now playing movies
  getNowPlayingMovies: async (page: number = 1): Promise<MovieResponse> => {
    const response = await tmdbApi.get('/movie/now_playing', {
      params: { page },
    });
    return response.data;
  },

  // Get upcoming movies
  getUpcomingMovies: async (page: number = 1): Promise<MovieResponse> => {
    const response = await tmdbApi.get('/movie/upcoming', {
      params: { page },
    });
    return response.data;
  },

  // Get top rated movies
  getTopRatedMovies: async (page: number = 1): Promise<MovieResponse> => {
    const response = await tmdbApi.get('/movie/top_rated', {
      params: { page },
    });
    return response.data;
  },

  // Get now playing movies
  getNowPlayingMovies: async (page: number = 1): Promise<MovieResponse> => {
    const response = await tmdbApi.get('/movie/now_playing', {
      params: { page },
    });
    return response.data;
  },

  // Get movie details
  getMovieDetails: async (movieId: number): Promise<MovieDetails> => {
    const response = await tmdbApi.get(`/movie/${movieId}`, {
      params: {
        append_to_response: 'credits,videos,similar,recommendations',
      },
    });
    return response.data;
  },

  // Get movie genres
  getGenres: async (): Promise<{ genres: Genre[] }> => {
    const response = await tmdbApi.get('/genre/movie/list');
    return response.data;
  },

  // Discover movies by genre
  discoverMovies: async (params: {
    page?: number;
    genre?: number;
    year?: number;
    sort_by?: string;
    vote_average_gte?: number;
  }): Promise<MovieResponse> => {
    const response = await tmdbApi.get('/discover/movie', { params });
    return response.data;
  },
};

// Streaming API functions (client-side scraping)
export const streamingAPI = {
  // Get streaming sources for a movie
  getStreamingSources: async (movieId: number, title: string, year?: number): Promise<StreamingSource[]> => {
    const sources: StreamingSource[] = [];

    try {
      // VidSrc source
      sources.push({
        name: 'VidSrc',
        url: `${process.env.NEXT_PUBLIC_VIDSRC_URL}/embed/movie/${movieId}`,
        quality: 'HD',
        type: 'embed',
        server: 'VidSrc',
      });

      // SuperEmbed source
      sources.push({
        name: 'SuperEmbed',
        url: `${process.env.NEXT_PUBLIC_SUPEREMBED_URL}/?video_id=${movieId}&tmdb=1`,
        quality: 'HD',
        type: 'embed',
        server: 'SuperEmbed',
      });

      // EmbedSu source
      sources.push({
        name: 'EmbedSu',
        url: `${process.env.NEXT_PUBLIC_EMBEDSU_URL}/embed/movie/${movieId}`,
        quality: 'HD',
        type: 'embed',
        server: 'EmbedSu',
      });

      // Additional sources can be added here
      // Note: In a real implementation, you might want to scrape these sources
      // to get direct video URLs, but that would require server-side processing

    } catch (error) {
      console.error('Error getting streaming sources:', error);
    }

    return sources;
  },

  // Proxy function for CORS issues (would need server-side implementation)
  proxyRequest: async (url: string): Promise<string> => {
    try {
      // This would typically be handled by a server-side proxy
      // For now, we'll return the original URL
      return url;
    } catch (error) {
      console.error('Proxy request failed:', error);
      throw error;
    }
  },
};

// Image utility functions
export const imageUtils = {
  // Get full image URL
  getImageUrl: (path: string | null, size: string = 'w500'): string | null => {
    if (!path) return null;
    return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
  },

  // Get poster URL
  getPosterUrl: (path: string | null, size: 'w92' | 'w154' | 'w185' | 'w342' | 'w500' | 'w780' | 'original' = 'w500'): string | null => {
    return imageUtils.getImageUrl(path, size);
  },

  // Get backdrop URL
  getBackdropUrl: (path: string | null, size: 'w300' | 'w780' | 'w1280' | 'original' = 'w1280'): string | null => {
    return imageUtils.getImageUrl(path, size);
  },

  // Get profile URL
  getProfileUrl: (path: string | null, size: 'w45' | 'w185' | 'h632' | 'original' = 'w185'): string | null => {
    return imageUtils.getImageUrl(path, size);
  },
};

// Utility functions
export const utils = {
  // Format runtime
  formatRuntime: (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  },

  // Format release date
  formatReleaseDate: (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  },

  // Get year from release date
  getYear: (dateString: string): number => {
    return new Date(dateString).getFullYear();
  },

  // Format vote average
  formatRating: (rating: number): string => {
    return rating.toFixed(1);
  },

  // Get director from crew
  getDirector: (crew: CrewMember[]): CrewMember | null => {
    return crew.find(member => member.job === 'Director') || null;
  },

  // Get trailer from videos
  getTrailer: (videos: Video[]): Video | null => {
    return videos.find(video => 
      video.type === 'Trailer' && 
      video.site === 'YouTube' && 
      video.official
    ) || videos.find(video => video.type === 'Trailer' && video.site === 'YouTube') || null;
  },
};

export default tmdbApi;