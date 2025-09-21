'use client';

import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Container,
  Chip,
  Stack,
  IconButton,
  Fade,
  Skeleton,
} from '@mui/material';
import { 
  PlayArrow, 
  Info, 
  Favorite, 
  FavoriteBorder,
  Add,
  Check,
  VolumeOff,
  VolumeUp,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Movie } from '@/lib/api';
import { imageUtils, utils } from '@/lib/api';

const HeroContainer = styled(Box)({
  position: 'relative',
  height: '80vh',
  minHeight: '600px',
  overflow: 'hidden',
  display: 'flex',
  alignItems: 'center',
});

const BackgroundImage = styled(Box)({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: -2,
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(45deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.8) 100%)',
    zIndex: 1,
  },
});

const ContentContainer = styled(Container)(({ theme }) => ({
  position: 'relative',
  zIndex: 2,
  color: 'white',
  maxWidth: '600px',
  marginLeft: theme.spacing(4),
  [theme.breakpoints.down('md')]: {
    marginLeft: 'auto',
    marginRight: 'auto',
    textAlign: 'center',
  },
}));

const Title = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  marginBottom: theme.spacing(2),
  textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
  [theme.breakpoints.down('md')]: {
    fontSize: '2.5rem',
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '2rem',
  },
}));

const Overview = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
  display: '-webkit-box',
  WebkitLineClamp: 4,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
  [theme.breakpoints.down('sm')]: {
    WebkitLineClamp: 3,
  },
}));

const ActionButtons = styled(Stack)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  [theme.breakpoints.down('sm')]: {
    '& .MuiButton-root': {
      fontSize: '0.875rem',
      padding: theme.spacing(1, 2),
    },
  },
}));

const MetaInfo = styled(Stack)(({ theme }) => ({
  marginBottom: theme.spacing(3),
}));

const PlayButton = styled(Button)(({ theme }) => ({
  backgroundColor: 'white',
  color: 'black',
  fontWeight: 600,
  padding: theme.spacing(1.5, 4),
  fontSize: '1.1rem',
  '&:hover': {
    backgroundColor: 'rgba(255,255,255,0.9)',
    transform: 'scale(1.05)',
  },
}));

const InfoButton = styled(Button)(({ theme }) => ({
  backgroundColor: 'rgba(255,255,255,0.2)',
  color: 'white',
  fontWeight: 600,
  padding: theme.spacing(1.5, 4),
  fontSize: '1.1rem',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255,255,255,0.3)',
  '&:hover': {
    backgroundColor: 'rgba(255,255,255,0.3)',
    transform: 'scale(1.05)',
  },
}));

const QuickActions = styled(Box)({
  position: 'absolute',
  top: '20px',
  right: '20px',
  display: 'flex',
  gap: '8px',
  zIndex: 3,
});

const QuickActionButton = styled(IconButton)({
  backgroundColor: 'rgba(0,0,0,0.7)',
  color: 'white',
  backdropFilter: 'blur(10px)',
  '&:hover': {
    backgroundColor: 'rgba(0,0,0,0.9)',
    transform: 'scale(1.1)',
  },
});

const CarouselDots = styled(Box)({
  position: 'absolute',
  bottom: '20px',
  left: '50%',
  transform: 'translateX(-50%)',
  display: 'flex',
  gap: '8px',
  zIndex: 3,
});

const Dot = styled(Box)<{ active: boolean }>(({ active, theme }) => ({
  width: 12,
  height: 12,
  borderRadius: '50%',
  backgroundColor: active ? 'white' : 'rgba(255,255,255,0.5)',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: 'white',
    transform: 'scale(1.2)',
  },
}));

interface HeroSectionProps {
  movies: Movie[];
  onPlayMovie?: (movie: Movie) => void;
  onMovieInfo?: (movie: Movie) => void;
  onFavorite?: (movie: Movie) => void;
  onWatchlist?: (movie: Movie) => void;
  favoriteMovies?: Set<number>;
  watchlistMovies?: Set<number>;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  loading?: boolean;
}

export default function HeroSection({
  movies,
  onPlayMovie,
  onMovieInfo,
  onFavorite,
  onWatchlist,
  favoriteMovies = new Set(),
  watchlistMovies = new Set(),
  autoPlay = true,
  autoPlayInterval = 5000,
  loading = false,
}: HeroSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const currentMovie = movies[currentIndex];

  useEffect(() => {
    if (!autoPlay || isPaused || movies.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % movies.length);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [autoPlay, isPaused, movies.length, autoPlayInterval]);

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 10000); // Resume after 10 seconds
  };

  const handlePlay = () => {
    if (onPlayMovie && currentMovie) {
      onPlayMovie(currentMovie);
    }
  };

  const handleInfo = () => {
    if (onMovieInfo && currentMovie) {
      onMovieInfo(currentMovie);
    }
  };

  const handleFavorite = () => {
    if (onFavorite && currentMovie) {
      onFavorite(currentMovie);
    }
  };

  const handleWatchlist = () => {
    if (onWatchlist && currentMovie) {
      onWatchlist(currentMovie);
    }
  };

  if (loading || !currentMovie) {
    return (
      <HeroContainer>
        <Skeleton 
          variant="rectangular" 
          width="100%" 
          height="100%" 
          sx={{ position: 'absolute', top: 0, left: 0 }}
        />
        <ContentContainer>
          <Skeleton variant="text" sx={{ fontSize: '3rem', width: '80%', mb: 2 }} />
          <Skeleton variant="text" sx={{ fontSize: '1.2rem', width: '60%', mb: 1 }} />
          <Skeleton variant="text" sx={{ fontSize: '1.2rem', width: '70%', mb: 3 }} />
          <Stack direction="row" spacing={2}>
            <Skeleton variant="rectangular" width={120} height={48} sx={{ borderRadius: 1 }} />
            <Skeleton variant="rectangular" width={120} height={48} sx={{ borderRadius: 1 }} />
          </Stack>
        </ContentContainer>
      </HeroContainer>
    );
  }

  const backdropUrl = imageUtils.getBackdropUrl(currentMovie.backdrop_path, 'original');
  const year = currentMovie.release_date ? utils.getYear(currentMovie.release_date) : null;
  const rating = utils.formatRating(currentMovie.vote_average);
  const isFavorite = favoriteMovies.has(currentMovie.id);
  const isInWatchlist = watchlistMovies.has(currentMovie.id);

  return (
    <HeroContainer>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentMovie.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
        >
          <BackgroundImage>
            {backdropUrl && (
              <Image
                src={backdropUrl}
                alt={currentMovie.title}
                fill
                style={{ objectFit: 'cover' }}
                priority
                sizes="100vw"
              />
            )}
          </BackgroundImage>
        </motion.div>
      </AnimatePresence>

      <QuickActions>
        <QuickActionButton onClick={handleFavorite}>
          {isFavorite ? <Favorite /> : <FavoriteBorder />}
        </QuickActionButton>
        <QuickActionButton onClick={handleWatchlist}>
          {isInWatchlist ? <Check /> : <Add />}
        </QuickActionButton>
        {movies.length > 1 && (
          <QuickActionButton onClick={() => setIsPaused(!isPaused)}>
            {isPaused ? <VolumeUp /> : <VolumeOff />}
          </QuickActionButton>
        )}
      </QuickActions>

      <ContentContainer>
        <motion.div
          key={`content-${currentMovie.id}`}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Title variant="h2" component="h1">
            {currentMovie.title}
          </Title>

          <MetaInfo direction="row" spacing={2} flexWrap="wrap">
            {year && (
              <Chip 
                label={year} 
                variant="outlined" 
                sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.5)' }}
              />
            )}
            {currentMovie.vote_average > 0 && (
              <Chip 
                label={`★ ${rating}`} 
                variant="outlined" 
                sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.5)' }}
              />
            )}
            {currentMovie.genre_ids && currentMovie.genre_ids.length > 0 && (
              <Chip 
                label="Action" // You'd map genre_ids to actual genre names
                variant="outlined" 
                sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.5)' }}
              />
            )}
          </MetaInfo>

          {currentMovie.overview && (
            <Overview variant="h6" component="p">
              {currentMovie.overview}
            </Overview>
          )}

          <ActionButtons direction="row" spacing={2}>
            <PlayButton
              startIcon={<PlayArrow />}
              onClick={handlePlay}
              size="large"
            >
              Play
            </PlayButton>
            <InfoButton
              startIcon={<Info />}
              onClick={handleInfo}
              size="large"
            >
              More Info
            </InfoButton>
          </ActionButtons>
        </motion.div>
      </ContentContainer>

      {movies.length > 1 && (
        <CarouselDots>
          {movies.map((_, index) => (
            <Dot
              key={index}
              active={index === currentIndex}
              onClick={() => handleDotClick(index)}
            />
          ))}
        </CarouselDots>
      )}
    </HeroContainer>
  );
}

// Loading skeleton for hero section
export function HeroSectionSkeleton() {
  return (
    <HeroContainer>
      <Skeleton 
        variant="rectangular" 
        width="100%" 
        height="100%" 
        sx={{ position: 'absolute', top: 0, left: 0 }}
      />
      <ContentContainer>
        <Skeleton variant="text" sx={{ fontSize: '3rem', width: '80%', mb: 2 }} />
        <Skeleton variant="text" sx={{ fontSize: '1.2rem', width: '60%', mb: 1 }} />
        <Skeleton variant="text" sx={{ fontSize: '1.2rem', width: '70%', mb: 3 }} />
        <Stack direction="row" spacing={2}>
          <Skeleton variant="rectangular" width={120} height={48} sx={{ borderRadius: 1 }} />
          <Skeleton variant="rectangular" width={120} height={48} sx={{ borderRadius: 1 }} />
        </Stack>
      </ContentContainer>
    </HeroContainer>
  );
}