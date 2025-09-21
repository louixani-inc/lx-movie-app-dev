'use client';

import React from 'react';
import { 
  Box, 
  CircularProgress, 
  LinearProgress,
  Skeleton,
  Typography,
  Paper,
  Stack,
  Fade,
  Backdrop,
} from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import { Movie as MovieIcon } from '@mui/icons-material';

// Animations
const pulse = keyframes`
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
  }
`;

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

// Styled Components
const LoadingContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(4),
  minHeight: 200,
}));

const SpinningIcon = styled(MovieIcon)(({ theme }) => ({
  fontSize: 48,
  color: theme.palette.primary.main,
  animation: `${spin} 2s linear infinite`,
  marginBottom: theme.spacing(2),
}));

const PulsingText = styled(Typography)(({ theme }) => ({
  animation: `${pulse} 1.5s ease-in-out infinite`,
  color: theme.palette.text.secondary,
}));

const ProgressContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  maxWidth: 400,
  marginTop: theme.spacing(2),
}));

// Loading Components
export function PageLoader({ message = 'Loading...' }: { message?: string }) {
  return (
    <LoadingContainer>
      <SpinningIcon />
      <PulsingText variant="h6">{message}</PulsingText>
      <ProgressContainer>
        <LinearProgress />
      </ProgressContainer>
    </LoadingContainer>
  );
}

export function FullScreenLoader({ 
  open, 
  message = 'Loading...' 
}: { 
  open: boolean; 
  message?: string; 
}) {
  return (
    <Backdrop
      sx={{ 
        color: '#fff', 
        zIndex: (theme) => theme.zIndex.drawer + 1,
        flexDirection: 'column',
        gap: 2,
      }}
      open={open}
    >
      <CircularProgress color="inherit" size={60} />
      <Typography variant="h6">{message}</Typography>
    </Backdrop>
  );
}

export function InlineLoader({ 
  size = 24, 
  message,
  color = 'primary' 
}: { 
  size?: number; 
  message?: string;
  color?: 'primary' | 'secondary' | 'inherit';
}) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1 }}>
      <CircularProgress size={size} color={color} />
      {message && (
        <Typography variant="body2" color="text.secondary">
          {message}
        </Typography>
      )}
    </Box>
  );
}

export function ButtonLoader({ loading, children }: { loading: boolean; children: React.ReactNode }) {
  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      {children}
      {loading && (
        <CircularProgress
          size={24}
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            marginTop: '-12px',
            marginLeft: '-12px',
          }}
        />
      )}
    </Box>
  );
}

// Skeleton Components
export function MovieCardSkeleton() {
  return (
    <Paper sx={{ overflow: 'hidden' }}>
      <Skeleton variant="rectangular" height={300} />
      <Box sx={{ p: 2 }}>
        <Skeleton variant="text" sx={{ fontSize: '1.2rem' }} />
        <Skeleton variant="text" sx={{ fontSize: '0.9rem' }} />
        <Skeleton variant="text" sx={{ fontSize: '0.8rem', width: '60%' }} />
      </Box>
    </Paper>
  );
}

export function MovieGridSkeleton({ count = 20 }: { count?: number }) {
  return (
    <Box sx={{ p: 2 }}>
      <Skeleton variant="text" sx={{ fontSize: '2rem', width: '30%', mb: 3 }} />
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: 2,
      }}>
        {Array.from({ length: count }).map((_, index) => (
          <MovieCardSkeleton key={index} />
        ))}
      </Box>
    </Box>
  );
}

export function HeroSkeleton() {
  return (
    <Box sx={{ position: 'relative', height: '80vh', minHeight: 600 }}>
      <Skeleton 
        variant="rectangular" 
        width="100%" 
        height="100%" 
        sx={{ position: 'absolute', top: 0, left: 0 }}
      />
      <Box sx={{ 
        position: 'absolute', 
        bottom: 100, 
        left: 40, 
        maxWidth: 600,
        zIndex: 1,
      }}>
        <Skeleton variant="text" sx={{ fontSize: '3rem', width: '80%', mb: 2 }} />
        <Skeleton variant="text" sx={{ fontSize: '1.2rem', width: '60%', mb: 1 }} />
        <Skeleton variant="text" sx={{ fontSize: '1.2rem', width: '70%', mb: 3 }} />
        <Stack direction="row" spacing={2}>
          <Skeleton variant="rectangular" width={120} height={48} sx={{ borderRadius: 1 }} />
          <Skeleton variant="rectangular" width={120} height={48} sx={{ borderRadius: 1 }} />
        </Stack>
      </Box>
    </Box>
  );
}

export function CarouselSkeleton({ itemCount = 6 }: { itemCount?: number }) {
  return (
    <Box sx={{ p: 2 }}>
      <Skeleton variant="text" sx={{ fontSize: '1.5rem', width: '25%', mb: 2 }} />
      <Stack direction="row" spacing={2} sx={{ overflowX: 'hidden' }}>
        {Array.from({ length: itemCount }).map((_, index) => (
          <Box key={index} sx={{ minWidth: 200 }}>
            <MovieCardSkeleton />
          </Box>
        ))}
      </Stack>
    </Box>
  );
}

export function SearchSkeleton() {
  return (
    <Box sx={{ p: 2 }}>
      <Skeleton variant="rectangular" height={56} sx={{ borderRadius: 2, mb: 2 }} />
      <Stack spacing={1}>
        {Array.from({ length: 5 }).map((_, index) => (
          <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Skeleton variant="rectangular" width={60} height={90} sx={{ borderRadius: 1 }} />
            <Box sx={{ flex: 1 }}>
              <Skeleton variant="text" sx={{ fontSize: '1.1rem', width: '70%' }} />
              <Skeleton variant="text" sx={{ fontSize: '0.9rem', width: '50%' }} />
            </Box>
          </Box>
        ))}
      </Stack>
    </Box>
  );
}

export function PlayerSkeleton() {
  return (
    <Box sx={{ position: 'relative', aspectRatio: '16/9', backgroundColor: 'black' }}>
      <Skeleton 
        variant="rectangular" 
        width="100%" 
        height="100%" 
        sx={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
      />
      <Box sx={{ 
        position: 'absolute', 
        top: '50%', 
        left: '50%', 
        transform: 'translate(-50%, -50%)',
        textAlign: 'center',
      }}>
        <CircularProgress size={60} sx={{ color: 'white', mb: 2 }} />
        <Typography variant="h6" sx={{ color: 'white' }}>
          Loading Player...
        </Typography>
      </Box>
    </Box>
  );
}

// Progress Components
export function LoadingProgress({ 
  value, 
  message,
  showPercentage = true 
}: { 
  value: number; 
  message?: string;
  showPercentage?: boolean;
}) {
  return (
    <Box sx={{ width: '100%', p: 2 }}>
      {message && (
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {message}
        </Typography>
      )}
      <LinearProgress 
        variant="determinate" 
        value={value} 
        sx={{ height: 8, borderRadius: 4 }}
      />
      {showPercentage && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {Math.round(value)}%
        </Typography>
      )}
    </Box>
  );
}

// Fade Loading Wrapper
export function FadeLoader({ 
  loading, 
  children, 
  loader 
}: { 
  loading: boolean; 
  children: React.ReactNode;
  loader?: React.ReactNode;
}) {
  return (
    <Box sx={{ position: 'relative' }}>
      <Fade in={!loading} timeout={300}>
        <Box sx={{ opacity: loading ? 0.3 : 1 }}>
          {children}
        </Box>
      </Fade>
      
      {loading && (
        <Fade in={loading} timeout={300}>
          <Box sx={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(255,255,255,0.8)',
            zIndex: 1,
          }}>
            {loader || <CircularProgress />}
          </Box>
        </Fade>
      )}
    </Box>
  );
}

// Loading States Hook
export function useLoadingState(initialState = false) {
  const [loading, setLoading] = React.useState(initialState);
  const [error, setError] = React.useState<string | null>(null);

  const startLoading = () => {
    setLoading(true);
    setError(null);
  };

  const stopLoading = () => {
    setLoading(false);
  };

  const setLoadingError = (error: string) => {
    setLoading(false);
    setError(error);
  };

  const reset = () => {
    setLoading(false);
    setError(null);
  };

  return {
    loading,
    error,
    startLoading,
    stopLoading,
    setLoadingError,
    reset,
  };
}