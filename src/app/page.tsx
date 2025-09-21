'use client';

import React from 'react';
import { Box, Typography, Container, Button, Stack } from '@mui/material';
import { PlayArrow, Search, Movie } from '@mui/icons-material';
import Layout from '@/components/Layout';
import { usePopularMovies, useTrendingMovies } from '@/hooks/useMovies';
import { TrendingCarousel, PopularCarousel } from '@/components/MovieCarousel';
import HeroSection from '@/components/HeroSection';
import ErrorBoundary from '@/components/ErrorBoundary';
import { PageLoader } from '@/components/LoadingStates';

export default function HomePage() {
  const { data: popularMovies, isLoading: popularLoading, error: popularError } = usePopularMovies();
  const { data: trendingMovies, isLoading: trendingLoading, error: trendingError } = useTrendingMovies();

  const handleMovieClick = (movie: any) => {
    console.log('Movie clicked:', movie);
    // Navigate to movie page
    // router.push(`/movie/${movie.id}`);
  };

  const handlePlayMovie = (movie: any) => {
    console.log('Play movie:', movie);
    // Navigate to player page
    // router.push(`/watch/${movie.id}`);
  };

  const handleMovieInfo = (movie: any) => {
    console.log('Movie info:', movie);
    // Navigate to movie details
    // router.push(`/movie/${movie.id}`);
  };

  if (popularLoading && trendingLoading) {
    return (
      <Layout>
        <PageLoader message="Loading movies..." />
      </Layout>
    );
  }

  return (
    <ErrorBoundary>
      <Layout maxWidth={false} disableGutters>
        {/* Hero Section */}
        {trendingMovies && trendingMovies.length > 0 && (
          <HeroSection
            movies={trendingMovies.slice(0, 5)}
            onPlayMovie={handlePlayMovie}
            onMovieInfo={handleMovieInfo}
            autoPlay={true}
          />
        )}

        {/* Content Sections */}
        <Container maxWidth="xl" sx={{ py: 4 }}>
          {/* Trending Movies */}
          <TrendingCarousel
            movies={trendingMovies || []}
            loading={trendingLoading}
            error={trendingError?.message || null}
            onMovieClick={handleMovieClick}
            variant="default"
          />

          {/* Popular Movies */}
          <PopularCarousel
            movies={popularMovies || []}
            loading={popularLoading}
            error={popularError?.message || null}
            onMovieClick={handleMovieClick}
            variant="default"
          />

          {/* Welcome Section for Empty State */}
          {!popularMovies && !trendingMovies && !popularLoading && !trendingLoading && (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Movie sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
              <Typography variant="h4" gutterBottom>
                Welcome to LX Movie App
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                Discover and stream your favorite movies from multiple sources.
              </Typography>
              <Stack direction="row" spacing={2} justifyContent="center">
                <Button
                  variant="contained"
                  startIcon={<Search />}
                  size="large"
                >
                  Browse Movies
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<PlayArrow />}
                  size="large"
                >
                  Watch Trailer
                </Button>
              </Stack>
            </Box>
          )}
        </Container>
      </Layout>
    </ErrorBoundary>
  );
}
