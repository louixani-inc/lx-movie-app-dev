'use client';

import React from 'react';
import { Box, Container, Typography, Button, Stack, Chip, Grid, Paper } from '@mui/material';
import { PlayArrow, Favorite, Add, Share, Download } from '@mui/icons-material';
import { useParams } from 'next/navigation';
import Layout from '@/components/Layout';
import VideoPlayer from '@/components/VideoPlayer';
import { useMovieDetails } from '@/hooks/useMovies';
import { PageLoader } from '@/components/LoadingStates';
import { MovieLoadError } from '@/components/ErrorStates';
import ErrorBoundary from '@/components/ErrorBoundary';
import Image from 'next/image';
import { imageUtils, utils } from '@/lib/api';

export default function MoviePage() {
  const params = useParams();
  const movieId = params.id as string;
  
  const { data: movie, isLoading, error } = useMovieDetails(movieId);
  const [isPlaying, setIsPlaying] = React.useState(false);

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handleClosePlayer = () => {
    setIsPlaying(false);
  };

  if (isLoading) {
    return (
      <Layout>
        <PageLoader message="Loading movie details..." />
      </Layout>
    );
  }

  if (error || !movie) {
    return (
      <Layout>
        <MovieLoadError 
          movieTitle={movie?.title}
          onRetry={() => window.location.reload()}
          onGoBack={() => window.history.back()}
        />
      </Layout>
    );
  }

  const backdropUrl = imageUtils.getBackdropUrl(movie.backdrop_path, 'original');
  const posterUrl = imageUtils.getPosterUrl(movie.poster_path, 'w500');
  const year = movie.release_date ? utils.getYear(movie.release_date) : null;
  const rating = utils.formatRating(movie.vote_average);
  const runtime = movie.runtime ? utils.formatRuntime(movie.runtime) : null;

  return (
    <ErrorBoundary>
      <Layout maxWidth={false} disableGutters>
        {/* Video Player Modal */}
        {isPlaying && (
          <Box
            sx={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'black',
              zIndex: 9999,
            }}
          >
            <VideoPlayer
              movieId={movieId}
              title={movie.title}
              onClose={handleClosePlayer}
              autoplay={true}
            />
          </Box>
        )}

        {/* Hero Section */}
        <Box
          sx={{
            position: 'relative',
            height: '80vh',
            minHeight: '600px',
            backgroundImage: backdropUrl ? `url(${backdropUrl})` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: 'flex',
            alignItems: 'center',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(45deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.8) 100%)',
            },
          }}
        >
          <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 2 }}>
            <Grid container spacing={4} alignItems="center">
              {/* Poster */}
              <Grid item xs={12} md={4} lg={3}>
                <Paper
                  elevation={8}
                  sx={{
                    aspectRatio: '2/3',
                    position: 'relative',
                    overflow: 'hidden',
                    borderRadius: 2,
                    maxWidth: 300,
                    mx: 'auto',
                  }}
                >
                  {posterUrl ? (
                    <Image
                      src={posterUrl}
                      alt={movie.title}
                      fill
                      style={{ objectFit: 'cover' }}
                      priority
                    />
                  ) : (
                    <Box
                      sx={{
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'grey.800',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        No Image
                      </Typography>
                    </Box>
                  )}
                </Paper>
              </Grid>

              {/* Movie Info */}
              <Grid item xs={12} md={8} lg={9}>
                <Box sx={{ color: 'white' }}>
                  <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
                    {movie.title}
                  </Typography>

                  {movie.tagline && (
                    <Typography variant="h6" sx={{ fontStyle: 'italic', mb: 2, opacity: 0.9 }}>
                      "{movie.tagline}"
                    </Typography>
                  )}

                  <Stack direction="row" spacing={2} flexWrap="wrap" sx={{ mb: 3 }}>
                    {year && (
                      <Chip label={year} variant="outlined" sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.5)' }} />
                    )}
                    {runtime && (
                      <Chip label={runtime} variant="outlined" sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.5)' }} />
                    )}
                    {movie.vote_average > 0 && (
                      <Chip label={`★ ${rating}`} variant="outlined" sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.5)' }} />
                    )}
                    {movie.genres?.map((genre) => (
                      <Chip
                        key={genre.id}
                        label={genre.name}
                        variant="outlined"
                        sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.5)' }}
                      />
                    ))}
                  </Stack>

                  {movie.overview && (
                    <Typography variant="body1" sx={{ mb: 4, maxWidth: 800, lineHeight: 1.6 }}>
                      {movie.overview}
                    </Typography>
                  )}

                  <Stack direction="row" spacing={2} flexWrap="wrap">
                    <Button
                      variant="contained"
                      size="large"
                      startIcon={<PlayArrow />}
                      onClick={handlePlay}
                      sx={{
                        backgroundColor: 'white',
                        color: 'black',
                        fontWeight: 600,
                        px: 4,
                        py: 1.5,
                        '&:hover': {
                          backgroundColor: 'rgba(255,255,255,0.9)',
                        },
                      }}
                    >
                      Play Movie
                    </Button>

                    <Button
                      variant="outlined"
                      size="large"
                      startIcon={<Favorite />}
                      sx={{
                        color: 'white',
                        borderColor: 'rgba(255,255,255,0.5)',
                        '&:hover': {
                          borderColor: 'white',
                          backgroundColor: 'rgba(255,255,255,0.1)',
                        },
                      }}
                    >
                      Add to Favorites
                    </Button>

                    <Button
                      variant="outlined"
                      size="large"
                      startIcon={<Add />}
                      sx={{
                        color: 'white',
                        borderColor: 'rgba(255,255,255,0.5)',
                        '&:hover': {
                          borderColor: 'white',
                          backgroundColor: 'rgba(255,255,255,0.1)',
                        },
                      }}
                    >
                      Watchlist
                    </Button>

                    <Button
                      variant="outlined"
                      size="large"
                      startIcon={<Share />}
                      sx={{
                        color: 'white',
                        borderColor: 'rgba(255,255,255,0.5)',
                        '&:hover': {
                          borderColor: 'white',
                          backgroundColor: 'rgba(255,255,255,0.1)',
                        },
                      }}
                    >
                      Share
                    </Button>
                  </Stack>
                </Box>
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* Additional Details */}
        <Container maxWidth="xl" sx={{ py: 6 }}>
          <Grid container spacing={4}>
            {/* Cast & Crew */}
            {movie.credits?.cast && movie.credits.cast.length > 0 && (
              <Grid item xs={12} md={8}>
                <Typography variant="h4" gutterBottom>
                  Cast
                </Typography>
                <Grid container spacing={2}>
                  {movie.credits.cast.slice(0, 12).map((person) => (
                    <Grid item xs={6} sm={4} md={3} key={person.id}>
                      <Paper sx={{ p: 2, textAlign: 'center' }}>
                        {person.profile_path && (
                          <Box
                            sx={{
                              width: 80,
                              height: 80,
                              borderRadius: '50%',
                              overflow: 'hidden',
                              mx: 'auto',
                              mb: 1,
                            }}
                          >
                            <Image
                              src={imageUtils.getProfileUrl(person.profile_path, 'w185')}
                              alt={person.name}
                              width={80}
                              height={80}
                              style={{ objectFit: 'cover' }}
                            />
                          </Box>
                        )}
                        <Typography variant="subtitle2" fontWeight={600}>
                          {person.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {person.character}
                        </Typography>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            )}

            {/* Movie Details */}
            <Grid item xs={12} md={4}>
              <Typography variant="h4" gutterBottom>
                Details
              </Typography>
              <Paper sx={{ p: 3 }}>
                <Stack spacing={2}>
                  {movie.release_date && (
                    <Box>
                      <Typography variant="subtitle2" fontWeight={600}>
                        Release Date
                      </Typography>
                      <Typography variant="body2">
                        {new Date(movie.release_date).toLocaleDateString()}
                      </Typography>
                    </Box>
                  )}

                  {movie.budget > 0 && (
                    <Box>
                      <Typography variant="subtitle2" fontWeight={600}>
                        Budget
                      </Typography>
                      <Typography variant="body2">
                        ${movie.budget.toLocaleString()}
                      </Typography>
                    </Box>
                  )}

                  {movie.revenue > 0 && (
                    <Box>
                      <Typography variant="subtitle2" fontWeight={600}>
                        Revenue
                      </Typography>
                      <Typography variant="body2">
                        ${movie.revenue.toLocaleString()}
                      </Typography>
                    </Box>
                  )}

                  {movie.production_companies && movie.production_companies.length > 0 && (
                    <Box>
                      <Typography variant="subtitle2" fontWeight={600}>
                        Production Companies
                      </Typography>
                      {movie.production_companies.map((company) => (
                        <Typography key={company.id} variant="body2">
                          {company.name}
                        </Typography>
                      ))}
                    </Box>
                  )}
                </Stack>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Layout>
    </ErrorBoundary>
  );
}