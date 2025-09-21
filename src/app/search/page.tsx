'use client';

import React, { useState, useEffect } from 'react';
import { Box, Container, Typography } from '@mui/material';
import { useSearchParams, useRouter } from 'next/navigation';
import Layout from '@/components/Layout';
import SearchBar from '@/components/SearchBar';
import { SearchResultsGrid } from '@/components/MovieGrid';
import { useSearchMovies } from '@/hooks/useMovies';
import ErrorBoundary from '@/components/ErrorBoundary';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [query, setQuery] = useState(searchParams.get('q') || '');

  const { data: searchResults, isLoading, error } = useSearchMovies(query);

  useEffect(() => {
    const q = searchParams.get('q');
    if (q) {
      setQuery(q);
    }
  }, [searchParams]);

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    } else {
      router.push('/search');
    }
  };

  const handleMovieClick = (movie: any) => {
    router.push(`/movie/${movie.id}`);
  };

  const handleMovieSelect = (movie: any) => {
    router.push(`/movie/${movie.id}`);
  };

  return (
    <ErrorBoundary>
      <Layout>
        <Container maxWidth="xl" sx={{ py: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700, mb: 4 }}>
            Search Movies
          </Typography>

          <Box sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}>
            <SearchBar
              onSearch={handleSearch}
              onMovieSelect={handleMovieSelect}
              searchResults={searchResults || []}
              loading={isLoading}
              placeholder="Search for movies..."
              showSuggestions={true}
            />
          </Box>

          {query && (
            <SearchResultsGrid
              movies={searchResults || []}
              loading={isLoading}
              error={error?.message || null}
              onMovieClick={handleMovieClick}
              query={query}
            />
          )}

          {!query && (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h5" gutterBottom>
                Discover Movies
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Search for your favorite movies, actors, or directors
              </Typography>
            </Box>
          )}
        </Container>
      </Layout>
    </ErrorBoundary>
  );
}