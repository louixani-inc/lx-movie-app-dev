'use client';

import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { movieAPI, Movie, MovieDetails, MovieResponse, SearchResponse } from '@/lib/api';

// Hook for searching movies
export function useSearchMovies(query: string, enabled: boolean = true) {
  return useInfiniteQuery({
    queryKey: ['movies', 'search', query],
    queryFn: ({ pageParam = 1 }) => movieAPI.searchMovies(query, pageParam),
    getNextPageParam: (lastPage: SearchResponse) => {
      return lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined;
    },
    enabled: enabled && query.length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook for popular movies
export function usePopularMovies() {
  return useInfiniteQuery({
    queryKey: ['movies', 'popular'],
    queryFn: ({ pageParam = 1 }) => movieAPI.getPopularMovies(pageParam),
    getNextPageParam: (lastPage: MovieResponse) => {
      return lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Hook for trending movies
export function useTrendingMovies(timeWindow: 'day' | 'week' = 'week') {
  return useQuery({
    queryKey: ['movies', 'trending', timeWindow],
    queryFn: () => movieAPI.getTrendingMovies(timeWindow),
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
}

// Hook for top rated movies
export function useTopRatedMovies() {
  return useInfiniteQuery({
    queryKey: ['movies', 'top-rated'],
    queryFn: ({ pageParam = 1 }) => movieAPI.getTopRatedMovies(pageParam),
    getNextPageParam: (lastPage: MovieResponse) => {
      return lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined;
    },
    staleTime: 60 * 60 * 1000, // 1 hour
  });
}

// Hook for now playing movies
export function useNowPlayingMovies() {
  return useQuery({
    queryKey: ['movies', 'now-playing'],
    queryFn: () => movieAPI.getNowPlayingMovies(),
    staleTime: 60 * 60 * 1000, // 1 hour
  });
}

// Hook for upcoming movies
export function useUpcomingMovies() {
  return useQuery({
    queryKey: ['movies', 'upcoming'],
    queryFn: () => movieAPI.getUpcomingMovies(),
    staleTime: 60 * 60 * 1000, // 1 hour
  });
}

// Hook for movie details
export function useMovieDetails(movieId: number, enabled: boolean = true) {
  return useQuery({
    queryKey: ['movies', 'details', movieId],
    queryFn: () => movieAPI.getMovieDetails(movieId),
    enabled: enabled && movieId > 0,
    staleTime: 60 * 60 * 1000, // 1 hour
  });
}

// Hook for movie genres
export function useGenres() {
  return useQuery({
    queryKey: ['movies', 'genres'],
    queryFn: () => movieAPI.getGenres(),
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
  });
}

// Hook for discovering movies
export function useDiscoverMovies(params: {
  genre?: number;
  year?: number;
  sort_by?: string;
  vote_average_gte?: number;
}) {
  return useInfiniteQuery({
    queryKey: ['movies', 'discover', params],
    queryFn: ({ pageParam = 1 }) => movieAPI.discoverMovies({ ...params, page: pageParam }),
    getNextPageParam: (lastPage: MovieResponse) => {
      return lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined;
    },
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
}

// Hook for similar movies
export function useSimilarMovies(movieId: number, enabled: boolean = true) {
  return useQuery({
    queryKey: ['movies', 'similar', movieId],
    queryFn: async () => {
      const details = await movieAPI.getMovieDetails(movieId);
      return details.similar?.results || [];
    },
    enabled: enabled && movieId > 0,
    staleTime: 60 * 60 * 1000, // 1 hour
  });
}

// Hook for movie recommendations
export function useMovieRecommendations(movieId: number, enabled: boolean = true) {
  return useQuery({
    queryKey: ['movies', 'recommendations', movieId],
    queryFn: async () => {
      const details = await movieAPI.getMovieDetails(movieId);
      return details.recommendations?.results || [];
    },
    enabled: enabled && movieId > 0,
    staleTime: 60 * 60 * 1000, // 1 hour
  });
}

// Utility hook to get all movies for home page
export function useHomePageMovies() {
  const trending = useTrendingMovies();
  const popular = usePopularMovies();
  const topRated = useTopRatedMovies();
  const nowPlaying = useNowPlayingMovies();
  const upcoming = useUpcomingMovies();

  return {
    trending,
    popular,
    topRated,
    nowPlaying,
    upcoming,
    isLoading: trending.isLoading || popular.isLoading || topRated.isLoading,
    error: trending.error || popular.error || topRated.error,
  };
}