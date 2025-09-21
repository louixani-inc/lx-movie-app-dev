'use client';

import React from 'react';
import { 
  Card, 
  CardMedia, 
  CardContent, 
  Typography, 
  Box, 
  Chip, 
  Rating,
  IconButton,
  Fade,
  Skeleton,
} from '@mui/material';
import { 
  PlayArrow, 
  CalendarToday, 
  Star,
  Favorite,
  FavoriteBorder,
  Add,
  Check,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Movie } from '@/lib/api';
import { imageUtils, utils } from '@/lib/api';

const StyledCard = styled(Card)(({ theme }) => ({
  position: 'relative',
  height: '100%',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: theme.shadows[8],
  },
  '&:hover .play-overlay': {
    opacity: 1,
  },
  '&:hover .movie-info': {
    transform: 'translateY(0)',
  },
}));

const MediaContainer = styled(Box)({
  position: 'relative',
  aspectRatio: '2/3',
  overflow: 'hidden',
});

const PlayOverlay = styled(Box)({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.7)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  opacity: 0,
  transition: 'opacity 0.3s ease',
});

const PlayButton = styled(IconButton)(({ theme }) => ({
  width: 60,
  height: 60,
  backgroundColor: theme.palette.primary.main,
  color: 'white',
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
    transform: 'scale(1.1)',
  },
}));

const InfoOverlay = styled(Box)({
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  background: 'linear-gradient(transparent, rgba(0,0,0,0.9))',
  padding: '20px 16px 16px',
  transform: 'translateY(100%)',
  transition: 'transform 0.3s ease',
});

const ActionButtons = styled(Box)({
  position: 'absolute',
  top: 8,
  right: 8,
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
});

const ActionButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: 'rgba(0,0,0,0.7)',
  color: 'white',
  width: 32,
  height: 32,
  '&:hover': {
    backgroundColor: 'rgba(0,0,0,0.9)',
  },
}));

const RatingContainer = styled(Box)({
  position: 'absolute',
  top: 8,
  left: 8,
  backgroundColor: 'rgba(0,0,0,0.8)',
  borderRadius: '16px',
  padding: '4px 8px',
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
});

const PlaceholderContainer = styled(Box)(({ theme }) => ({
  aspectRatio: '2/3',
  backgroundColor: theme.palette.grey[800],
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.palette.grey[500],
}));

interface MovieCardProps {
  movie: Movie;
  onClick?: (movie: Movie) => void;
  onFavorite?: (movie: Movie) => void;
  onWatchlist?: (movie: Movie) => void;
  isFavorite?: boolean;
  isInWatchlist?: boolean;
  showActions?: boolean;
  variant?: 'default' | 'compact' | 'detailed';
  loading?: boolean;
}

export default function MovieCard({ 
  movie, 
  onClick, 
  onFavorite, 
  onWatchlist,
  isFavorite = false,
  isInWatchlist = false,
  showActions = true,
  variant = 'default',
  loading = false,
}: MovieCardProps) {
  const posterUrl = imageUtils.getPosterUrl(movie.poster_path);
  const year = movie.release_date ? utils.getYear(movie.release_date) : null;
  const rating = utils.formatRating(movie.vote_average);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onClick) {
      onClick(movie);
    }
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onFavorite) {
      onFavorite(movie);
    }
  };

  const handleWatchlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onWatchlist) {
      onWatchlist(movie);
    }
  };

  if (loading) {
    return (
      <Card sx={{ height: '100%' }}>
        <Skeleton variant="rectangular" sx={{ aspectRatio: '2/3' }} />
        <CardContent>
          <Skeleton variant="text" sx={{ fontSize: '1.2rem' }} />
          <Skeleton variant="text" sx={{ fontSize: '0.9rem' }} />
          <Skeleton variant="text" sx={{ fontSize: '0.8rem', width: '60%' }} />
        </CardContent>
      </Card>
    );
  }

  if (variant === 'compact') {
    return (
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.2 }}
      >
        <StyledCard onClick={handleClick}>
          <MediaContainer>
            {posterUrl ? (
              <Image
                src={posterUrl}
                alt={movie.title}
                fill
                style={{ objectFit: 'cover' }}
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              />
            ) : (
              <PlaceholderContainer>
                <Typography variant="body2">No Image</Typography>
              </PlaceholderContainer>
            )}
            
            <PlayOverlay className="play-overlay">
              <PlayButton>
                <PlayArrow sx={{ fontSize: 30 }} />
              </PlayButton>
            </PlayOverlay>

            {movie.vote_average > 0 && (
              <RatingContainer>
                <Star sx={{ fontSize: 14, color: '#ffd700' }} />
                <Typography variant="caption" sx={{ color: 'white', fontWeight: 600 }}>
                  {rating}
                </Typography>
              </RatingContainer>
            )}
          </MediaContainer>
        </StyledCard>
      </motion.div>
    );
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      <StyledCard onClick={handleClick}>
        <MediaContainer>
          {posterUrl ? (
            <Image
              src={posterUrl}
              alt={movie.title}
              fill
              style={{ objectFit: 'cover' }}
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            />
          ) : (
            <PlaceholderContainer>
              <Typography variant="body2">No Image Available</Typography>
            </PlaceholderContainer>
          )}
          
          <PlayOverlay className="play-overlay">
            <PlayButton>
              <PlayArrow sx={{ fontSize: 30 }} />
            </PlayButton>
          </PlayOverlay>

          {movie.vote_average > 0 && (
            <RatingContainer>
              <Star sx={{ fontSize: 16, color: '#ffd700' }} />
              <Typography variant="body2" sx={{ color: 'white', fontWeight: 600 }}>
                {rating}
              </Typography>
            </RatingContainer>
          )}

          {showActions && (
            <ActionButtons>
              <Fade in>
                <ActionButton onClick={handleFavorite} size="small">
                  {isFavorite ? <Favorite sx={{ fontSize: 18 }} /> : <FavoriteBorder sx={{ fontSize: 18 }} />}
                </ActionButton>
              </Fade>
              <Fade in>
                <ActionButton onClick={handleWatchlist} size="small">
                  {isInWatchlist ? <Check sx={{ fontSize: 18 }} /> : <Add sx={{ fontSize: 18 }} />}
                </ActionButton>
              </Fade>
            </ActionButtons>
          )}

          {variant === 'detailed' && (
            <InfoOverlay className="movie-info">
              <Typography variant="h6" sx={{ color: 'white', fontWeight: 600, mb: 1 }}>
                {movie.title}
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                {year && (
                  <Chip
                    icon={<CalendarToday sx={{ fontSize: 14 }} />}
                    label={year}
                    size="small"
                    variant="outlined"
                    sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)' }}
                  />
                )}
              </Box>
              
              {movie.overview && (
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: 'rgba(255,255,255,0.8)', 
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {movie.overview}
                </Typography>
              )}
            </InfoOverlay>
          )}
        </MediaContainer>
        
        {variant === 'default' && (
          <CardContent sx={{ pb: 2 }}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 600, 
                mb: 1,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {movie.title}
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
              {movie.vote_average > 0 && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Rating 
                    value={movie.vote_average / 2} 
                    precision={0.1} 
                    size="small" 
                    readOnly 
                    sx={{ color: '#ffd700' }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    ({rating})
                  </Typography>
                </Box>
              )}
              
              {year && (
                <Typography variant="body2" color="text.secondary">
                  {year}
                </Typography>
              )}
            </Box>
            
            {movie.overview && (
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ 
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {movie.overview}
              </Typography>
            )}
          </CardContent>
        )}
      </StyledCard>
    </motion.div>
  );
}

// Loading skeleton component
export function MovieCardSkeleton({ variant = 'default' }: { variant?: 'default' | 'compact' | 'detailed' }) {
  return (
    <Card sx={{ height: '100%' }}>
      <Skeleton variant="rectangular" sx={{ aspectRatio: '2/3' }} />
      {variant !== 'compact' && (
        <CardContent>
          <Skeleton variant="text" sx={{ fontSize: '1.2rem' }} />
          <Skeleton variant="text" sx={{ fontSize: '0.9rem' }} />
          {variant === 'default' && (
            <Skeleton variant="text" sx={{ fontSize: '0.8rem', width: '60%' }} />
          )}
        </CardContent>
      )}
    </Card>
  );
}