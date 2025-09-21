'use client';

import React, { useRef, useState } from 'react';
import { 
  Box, 
  Typography, 
  IconButton,
  Stack,
  Skeleton,
  Alert,
  Button,
} from '@mui/material';
import { 
  ChevronLeft, 
  ChevronRight,
  Refresh,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';
import MovieCard, { MovieCardSkeleton } from './MovieCard';
import { Movie } from '@/lib/api';

const CarouselContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  marginBottom: theme.spacing(4),
}));

const CarouselHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: theme.spacing(2),
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
}));

const CarouselContent = styled(Box)({
  position: 'relative',
  overflow: 'hidden',
});

const CarouselTrack = styled(Box)({
  display: 'flex',
  transition: 'transform 0.3s ease',
  gap: '16px',
  paddingLeft: '16px',
  paddingRight: '16px',
});

const CarouselItem = styled(Box)<{ itemWidth: number }>(({ itemWidth }) => ({
  flex: `0 0 ${itemWidth}px`,
  maxWidth: `${itemWidth}px`,
}));

const NavigationButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  backgroundColor: 'rgba(0,0,0,0.7)',
  color: 'white',
  zIndex: 2,
  width: 48,
  height: 48,
  backdropFilter: 'blur(10px)',
  '&:hover': {
    backgroundColor: 'rgba(0,0,0,0.9)',
  },
  '&:disabled': {
    opacity: 0.3,
  },
}));

const PrevButton = styled(NavigationButton)({
  left: 8,
});

const NextButton = styled(NavigationButton)({
  right: 8,
});

const EmptyState = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  padding: theme.spacing(4, 2),
  color: theme.palette.text.secondary,
}));

interface MovieCarouselProps {
  movies: Movie[];
  title?: string;
  subtitle?: string;
  loading?: boolean;
  error?: string | null;
  variant?: 'default' | 'compact' | 'detailed';
  itemWidth?: number;
  visibleItems?: {
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
  onRetry?: () => void;
  autoScroll?: boolean;
  autoScrollInterval?: number;
}

const defaultVisibleItems = {
  xs: 2,
  sm: 3,
  md: 4,
  lg: 5,
  xl: 6,
};

const compactVisibleItems = {
  xs: 3,
  sm: 4,
  md: 6,
  lg: 8,
  xl: 10,
};

export default function MovieCarousel({
  movies,
  title,
  subtitle,
  loading = false,
  error = null,
  variant = 'default',
  itemWidth = 200,
  visibleItems,
  onMovieClick,
  onFavorite,
  onWatchlist,
  favoriteMovies = new Set(),
  watchlistMovies = new Set(),
  showActions = true,
  onRetry,
  autoScroll = false,
  autoScrollInterval = 5000,
}: MovieCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  const items = visibleItems || (variant === 'compact' ? compactVisibleItems : defaultVisibleItems);
  
  // Calculate how many items to show based on screen size
  // For simplicity, using lg breakpoint value
  const itemsToShow = items.lg || 5;
  const maxIndex = Math.max(0, movies.length - itemsToShow);

  const canScrollPrev = currentIndex > 0;
  const canScrollNext = currentIndex < maxIndex;

  const scrollPrev = () => {
    if (canScrollPrev) {
      setCurrentIndex(Math.max(0, currentIndex - itemsToShow));
    }
  };

  const scrollNext = () => {
    if (canScrollNext) {
      setCurrentIndex(Math.min(maxIndex, currentIndex + itemsToShow));
    }
  };

  // Auto scroll functionality
  React.useEffect(() => {
    if (!autoScroll || isHovered || movies.length <= itemsToShow) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const next = prev + 1;
        return next > maxIndex ? 0 : next;
      });
    }, autoScrollInterval);

    return () => clearInterval(interval);
  }, [autoScroll, isHovered, movies.length, itemsToShow, maxIndex, autoScrollInterval]);

  if (error) {
    return (
      <CarouselContainer>
        {title && (
          <CarouselHeader>
            <Box>
              <Typography variant="h5" component="h2" gutterBottom>
                {title}
              </Typography>
              {subtitle && (
                <Typography variant="subtitle2" color="text.secondary">
                  {subtitle}
                </Typography>
              )}
            </Box>
          </CarouselHeader>
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
      </CarouselContainer>
    );
  }

  if (loading) {
    return (
      <CarouselContainer>
        {title && (
          <CarouselHeader>
            <Box>
              <Typography variant="h5" component="h2" gutterBottom>
                {title}
              </Typography>
              {subtitle && (
                <Typography variant="subtitle2" color="text.secondary">
                  {subtitle}
                </Typography>
              )}
            </Box>
          </CarouselHeader>
        )}
        
        <CarouselContent>
          <CarouselTrack>
            {Array.from({ length: itemsToShow }).map((_, index) => (
              <CarouselItem key={index} itemWidth={itemWidth}>
                <MovieCardSkeleton variant={variant} />
              </CarouselItem>
            ))}
          </CarouselTrack>
        </CarouselContent>
      </CarouselContainer>
    );
  }

  if (!movies.length) {
    return (
      <CarouselContainer>
        {title && (
          <CarouselHeader>
            <Box>
              <Typography variant="h5" component="h2" gutterBottom>
                {title}
              </Typography>
              {subtitle && (
                <Typography variant="subtitle2" color="text.secondary">
                  {subtitle}
                </Typography>
              )}
            </Box>
          </CarouselHeader>
        )}
        
        <EmptyState>
          <Typography variant="h6" gutterBottom>
            No movies available
          </Typography>
          <Typography variant="body2">
            Check back later for new content.
          </Typography>
        </EmptyState>
      </CarouselContainer>
    );
  }

  return (
    <CarouselContainer
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {title && (
        <CarouselHeader>
          <Box>
            <Typography variant="h5" component="h2" gutterBottom>
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="subtitle2" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
        </CarouselHeader>
      )}
      
      <CarouselContent>
        {movies.length > itemsToShow && (
          <>
            <PrevButton 
              onClick={scrollPrev} 
              disabled={!canScrollPrev}
              sx={{ opacity: canScrollPrev ? 1 : 0 }}
            >
              <ChevronLeft />
            </PrevButton>
            <NextButton 
              onClick={scrollNext} 
              disabled={!canScrollNext}
              sx={{ opacity: canScrollNext ? 1 : 0 }}
            >
              <ChevronRight />
            </NextButton>
          </>
        )}
        
        <CarouselTrack
          ref={trackRef}
          sx={{
            transform: `translateX(-${currentIndex * (itemWidth + 16)}px)`,
          }}
        >
          <AnimatePresence>
            {movies.map((movie, index) => (
              <CarouselItem key={movie.id} itemWidth={itemWidth}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  whileHover={{ scale: 1.05 }}
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
              </CarouselItem>
            ))}
          </AnimatePresence>
        </CarouselTrack>
      </CarouselContent>
    </CarouselContainer>
  );
}

// Specialized carousel components for different use cases
export function TrendingCarousel(props: Omit<MovieCarouselProps, 'title'>) {
  return (
    <MovieCarousel
      {...props}
      title="Trending Now"
      subtitle="What's popular this week"
      autoScroll={true}
    />
  );
}

export function PopularCarousel(props: Omit<MovieCarouselProps, 'title'>) {
  return (
    <MovieCarousel
      {...props}
      title="Popular Movies"
      subtitle="Most watched movies"
    />
  );
}

export function RecommendedCarousel(props: Omit<MovieCarouselProps, 'title'>) {
  return (
    <MovieCarousel
      {...props}
      title="Recommended for You"
      subtitle="Based on your viewing history"
    />
  );
}

export function NewReleasesCarousel(props: Omit<MovieCarouselProps, 'title'>) {
  return (
    <MovieCarousel
      {...props}
      title="New Releases"
      subtitle="Latest movies added"
    />
  );
}