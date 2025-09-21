'use client';

import React from 'react';
import { 
  Grid, 
  Box, 
  Typography, 
  Container,
  Pagination,
  Stack,
  Skeleton,
  Alert,
  Button,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';
import MovieCard, { MovieCardSkeleton } from './MovieCard';
import { Movie } from '@/lib/api';
import { Refresh } from '@mui/icons-material';

const GridContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(3),
  paddingBottom: theme.spacing(3),
}));

const SectionHeader = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
  gap: theme.spacing(2),
}));

const StyledGrid = styled(Grid)(({ theme }) => ({
  '& .MuiGrid-item': {
    display: 'flex',
  },
}));

const PaginationContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(2),
}));

const EmptyState = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  padding: theme.spacing(8, 2),
  color: theme.palette.text.secondary,
}));

interface MovieGridProps {
  movies: Movie[];
  title?: string;
  subtitle?: string;
  loading?: boolean;
  error?: string | null;
  variant?: 'default' | 'compact' | 'detailed';
  columns?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  onMovieClick?: (movie: Movie) => void;
  onFavorite?: (movie: Movie) => void;
  onWatchlist?: (movie: Movie) => void;
  favoriteMovies?: Set<number>;
  watchlistMovies?: Set<number>;
  showActions?: boolean;
  pagination?: {
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  };
  onRetry?: () => void;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
  spacing?: number;
}

const defaultColumns = {
  xs: 2,
  sm: 3,
  md: 4,
  lg: 5,
  xl: 6,
};

const compactColumns = {
  xs: 3,
  sm: 4,
  md: 6,
  lg: 8,
  xl: 10,
};

export default function MovieGrid({
  movies,
  title,
  subtitle,
  loading = false,
  error = null,
  variant = 'default',
  columns,
  onMovieClick,
  onFavorite,
  onWatchlist,
  favoriteMovies = new Set(),
  watchlistMovies = new Set(),
  showActions = true,
  pagination,
  onRetry,
  maxWidth = 'xl',
  spacing = 3,
}: MovieGridProps) {
  const gridColumns = columns || (variant === 'compact' ? compactColumns : defaultColumns);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  if (error) {
    return (
      <GridContainer maxWidth={maxWidth}>
        {title && (
          <SectionHeader>
            <Box>
              <Typography variant="h4" component="h2" gutterBottom>
                {title}
              </Typography>
              {subtitle && (
                <Typography variant="subtitle1" color="text.secondary">
                  {subtitle}
                </Typography>
              )}
            </Box>
          </SectionHeader>
        )}
        
        <Alert 
          severity="error" 
          action={
            onRetry && (
              <Button 
                color="inherit" 
                size="small" 
                onClick={onRetry}
                startIcon={<Refresh />}
              >
                Retry
              </Button>
            )
          }
        >
          {error}
        </Alert>
      </GridContainer>
    );
  }

  if (loading) {
    return (
      <GridContainer maxWidth={maxWidth}>
        {title && (
          <SectionHeader>
            <Box>
              <Typography variant="h4" component="h2" gutterBottom>
                {title}
              </Typography>
              {subtitle && (
                <Typography variant="subtitle1" color="text.secondary">
                  {subtitle}
                </Typography>
              )}
            </Box>
          </SectionHeader>
        )}
        
        <StyledGrid container spacing={spacing}>
          {Array.from({ length: 20 }).map((_, index) => (
            <Grid 
              item 
              xs={gridColumns.xs} 
              sm={gridColumns.sm} 
              md={gridColumns.md} 
              lg={gridColumns.lg} 
              xl={gridColumns.xl}
              key={index}
            >
              <MovieCardSkeleton variant={variant} />
            </Grid>
          ))}
        </StyledGrid>
      </GridContainer>
    );
  }

  if (!movies.length) {
    return (
      <GridContainer maxWidth={maxWidth}>
        {title && (
          <SectionHeader>
            <Box>
              <Typography variant="h4" component="h2" gutterBottom>
                {title}
              </Typography>
              {subtitle && (
                <Typography variant="subtitle1" color="text.secondary">
                  {subtitle}
                </Typography>
              )}
            </Box>
          </SectionHeader>
        )}
        
        <EmptyState>
          <Typography variant="h6" gutterBottom>
            No movies found
          </Typography>
          <Typography variant="body2">
            Try adjusting your search criteria or check back later.
          </Typography>
        </EmptyState>
      </GridContainer>
    );
  }

  return (
    <GridContainer maxWidth={maxWidth}>
      {title && (
        <SectionHeader>
          <Box>
            <Typography variant="h4" component="h2" gutterBottom>
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="subtitle1" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
        </SectionHeader>
      )}
      
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <StyledGrid container spacing={spacing}>
          <AnimatePresence>
            {movies.map((movie) => (
              <Grid 
                item 
                xs={gridColumns.xs} 
                sm={gridColumns.sm} 
                md={gridColumns.md} 
                lg={gridColumns.lg} 
                xl={gridColumns.xl}
                key={movie.id}
              >
                <motion.div
                  variants={itemVariants}
                  layout
                  style={{ width: '100%' }}
                >
                  <MovieCard
                    movie={movie}
                    variant={variant}
                    onClick={onMovieClick}
                    onFavorite={onFavorite}
                    onWatchlist={onWatchlist}
                    isFavorite={favoriteMovies.has(movie.id)}
                    isInWatchlist={watchlistMovies.has(movie.id)}
                    showActions={showActions}
                  />
                </motion.div>
              </Grid>
            ))}
          </AnimatePresence>
        </StyledGrid>
      </motion.div>

      {pagination && pagination.totalPages > 1 && (
        <PaginationContainer>
          <Stack spacing={2} alignItems="center">
            <Pagination
              count={pagination.totalPages}
              page={pagination.page}
              onChange={(_, page) => pagination.onPageChange(page)}
              color="primary"
              size="large"
              showFirstButton
              showLastButton
            />
            <Typography variant="body2" color="text.secondary">
              Page {pagination.page} of {pagination.totalPages}
            </Typography>
          </Stack>
        </PaginationContainer>
      )}
    </GridContainer>
  );
}

// Specialized grid components for different use cases
export function PopularMoviesGrid(props: Omit<MovieGridProps, 'title'>) {
  return (
    <MovieGrid
      {...props}
      title="Popular Movies"
      subtitle="Trending movies everyone is watching"
    />
  );
}

export function SearchResultsGrid(props: Omit<MovieGridProps, 'title'> & { query?: string }) {
  const { query, ...gridProps } = props;
  return (
    <MovieGrid
      {...gridProps}
      title={query ? `Search Results for "${query}"` : 'Search Results'}
      subtitle={query ? `Found ${props.movies.length} movies` : undefined}
    />
  );
}

export function FavoritesGrid(props: Omit<MovieGridProps, 'title'>) {
  return (
    <MovieGrid
      {...props}
      title="Your Favorites"
      subtitle="Movies you've marked as favorites"
    />
  );
}

export function WatchlistGrid(props: Omit<MovieGridProps, 'title'>) {
  return (
    <MovieGrid
      {...props}
      title="Your Watchlist"
      subtitle="Movies you want to watch later"
    />
  );
}