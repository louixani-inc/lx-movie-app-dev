'use client';

import React, { useState } from 'react';
import { Box, Container, Typography, Tabs, Tab } from '@mui/material';
import Layout from '@/components/Layout';
import MovieGrid from '@/components/MovieGrid';
import { usePopularMovies, useTrendingMovies, useTopRatedMovies, useUpcomingMovies } from '@/hooks/useMovies';
import ErrorBoundary from '@/components/ErrorBoundary';
import { useRouter } from 'next/navigation';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`movies-tabpanel-${index}`}
      aria-labelledby={`movies-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

export default function MoviesPage() {
  const [tabValue, setTabValue] = useState(0);
  const router = useRouter();

  const { data: popularMovies, isLoading: popularLoading, error: popularError } = usePopularMovies();
  const { data: trendingMovies, isLoading: trendingLoading, error: trendingError } = useTrendingMovies();
  const { data: topRatedMovies, isLoading: topRatedLoading, error: topRatedError } = useTopRatedMovies();
  const { data: upcomingMovies, isLoading: upcomingLoading, error: upcomingError } = useUpcomingMovies();

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleMovieClick = (movie: any) => {
    router.push(`/movie/${movie.id}`);
  };

  return (
    <ErrorBoundary>
      <Layout>
        <Container maxWidth="xl" sx={{ py: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700, mb: 4 }}>
            Movies
          </Typography>

          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
            <Tabs value={tabValue} onChange={handleTabChange} aria-label="movie categories">
              <Tab label="Popular" />
              <Tab label="Trending" />
              <Tab label="Top Rated" />
              <Tab label="Upcoming" />
            </Tabs>
          </Box>

          <TabPanel value={tabValue} index={0}>
            <MovieGrid
              movies={popularMovies || []}
              loading={popularLoading}
              error={popularError?.message || null}
              onMovieClick={handleMovieClick}
              title="Popular Movies"
              subtitle="Most popular movies right now"
            />
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <MovieGrid
              movies={trendingMovies || []}
              loading={trendingLoading}
              error={trendingError?.message || null}
              onMovieClick={handleMovieClick}
              title="Trending Movies"
              subtitle="What's trending this week"
            />
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <MovieGrid
              movies={topRatedMovies || []}
              loading={topRatedLoading}
              error={topRatedError?.message || null}
              onMovieClick={handleMovieClick}
              title="Top Rated Movies"
              subtitle="Highest rated movies of all time"
            />
          </TabPanel>

          <TabPanel value={tabValue} index={3}>
            <MovieGrid
              movies={upcomingMovies || []}
              loading={upcomingLoading}
              error={upcomingError?.message || null}
              onMovieClick={handleMovieClick}
              title="Upcoming Movies"
              subtitle="Coming soon to theaters"
            />
          </TabPanel>
        </Container>
      </Layout>
    </ErrorBoundary>
  );
}