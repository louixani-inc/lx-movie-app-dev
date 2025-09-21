'use client';

import React from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Paper,
  Stack,
  Alert,
  AlertTitle,
  Chip,
  Divider,
} from '@mui/material';
import { 
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Refresh,
  Home,
  Search,
  WifiOff,
  CloudOff,
  BrokenImage,
  MovieFilter,
  SignalWifiOff,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const ErrorContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  textAlign: 'center',
  margin: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
}));

const ErrorIconStyled = styled(Box)(({ theme }) => ({
  fontSize: 64,
  marginBottom: theme.spacing(2),
  color: theme.palette.error.main,
}));

const WarningIconStyled = styled(Box)(({ theme }) => ({
  fontSize: 64,
  marginBottom: theme.spacing(2),
  color: theme.palette.warning.main,
}));

const InfoIconStyled = styled(Box)(({ theme }) => ({
  fontSize: 64,
  marginBottom: theme.spacing(2),
  color: theme.palette.info.main,
}));

interface ErrorStateProps {
  title: string;
  message: string;
  type?: 'error' | 'warning' | 'info';
  actions?: Array<{
    label: string;
    onClick: () => void;
    variant?: 'contained' | 'outlined' | 'text';
    startIcon?: React.ReactNode;
  }>;
  showRetry?: boolean;
  onRetry?: () => void;
  details?: string;
  errorCode?: string;
}

export function ErrorState({
  title,
  message,
  type = 'error',
  actions = [],
  showRetry = true,
  onRetry,
  details,
  errorCode,
}: ErrorStateProps) {
  const getIcon = () => {
    switch (type) {
      case 'warning':
        return <WarningIconStyled><WarningIcon fontSize="inherit" /></WarningIconStyled>;
      case 'info':
        return <InfoIconStyled><InfoIcon fontSize="inherit" /></InfoIconStyled>;
      default:
        return <ErrorIconStyled><ErrorIcon fontSize="inherit" /></ErrorIconStyled>;
    }
  };

  const getSeverity = () => {
    switch (type) {
      case 'warning':
        return 'warning';
      case 'info':
        return 'info';
      default:
        return 'error';
    }
  };

  return (
    <ErrorContainer elevation={2}>
      {getIcon()}
      
      <Typography variant="h5" gutterBottom>
        {title}
      </Typography>
      
      <Typography variant="body1" color="text.secondary" paragraph>
        {message}
      </Typography>

      {errorCode && (
        <Chip 
          label={`Error Code: ${errorCode}`} 
          size="small" 
          variant="outlined"
          sx={{ mb: 2 }}
        />
      )}

      <Stack direction="row" spacing={2} justifyContent="center" sx={{ mb: 2 }}>
        {showRetry && onRetry && (
          <Button
            variant="contained"
            startIcon={<Refresh />}
            onClick={onRetry}
          >
            Try Again
          </Button>
        )}
        
        {actions.map((action, index) => (
          <Button
            key={index}
            variant={action.variant || 'outlined'}
            startIcon={action.startIcon}
            onClick={action.onClick}
          >
            {action.label}
          </Button>
        ))}
      </Stack>

      {details && (
        <>
          <Divider sx={{ my: 2 }} />
          <Alert severity={getSeverity()}>
            <AlertTitle>Technical Details</AlertTitle>
            {details}
          </Alert>
        </>
      )}
    </ErrorContainer>
  );
}

// Specific Error Components
export function NetworkError({ onRetry }: { onRetry?: () => void }) {
  return (
    <ErrorState
      title="Connection Problem"
      message="Unable to connect to the server. Please check your internet connection and try again."
      type="warning"
      onRetry={onRetry}
      actions={[
        {
          label: 'Go Home',
          onClick: () => window.location.href = '/',
          startIcon: <Home />,
          variant: 'outlined',
        },
      ]}
    />
  );
}

export function NotFoundError({ 
  resource = 'page',
  onRetry,
  onGoHome,
}: { 
  resource?: string;
  onRetry?: () => void;
  onGoHome?: () => void;
}) {
  return (
    <ErrorState
      title={`${resource.charAt(0).toUpperCase() + resource.slice(1)} Not Found`}
      message={`The ${resource} you're looking for doesn't exist or has been moved.`}
      type="info"
      errorCode="404"
      showRetry={false}
      actions={[
        {
          label: 'Go Home',
          onClick: onGoHome || (() => window.location.href = '/'),
          startIcon: <Home />,
          variant: 'contained',
        },
        ...(onRetry ? [{
          label: 'Try Again',
          onClick: onRetry,
          startIcon: <Refresh />,
          variant: 'outlined' as const,
        }] : []),
      ]}
    />
  );
}

export function SearchError({ 
  query,
  onRetry,
  onClearSearch,
}: { 
  query?: string;
  onRetry?: () => void;
  onClearSearch?: () => void;
}) {
  return (
    <ErrorState
      title="Search Failed"
      message={query 
        ? `No results found for "${query}". Try different keywords or check your spelling.`
        : "Search failed. Please try again with different keywords."
      }
      type="info"
      onRetry={onRetry}
      actions={[
        {
          label: 'Clear Search',
          onClick: onClearSearch || (() => {}),
          startIcon: <Search />,
          variant: 'outlined',
        },
      ]}
    />
  );
}

export function MovieLoadError({ 
  movieTitle,
  onRetry,
  onGoBack,
}: { 
  movieTitle?: string;
  onRetry?: () => void;
  onGoBack?: () => void;
}) {
  return (
    <ErrorState
      title="Movie Unavailable"
      message={movieTitle 
        ? `Unable to load "${movieTitle}". The movie might be temporarily unavailable.`
        : "Unable to load movie details. Please try again later."
      }
      type="warning"
      onRetry={onRetry}
      actions={[
        {
          label: 'Go Back',
          onClick: onGoBack || (() => window.history.back()),
          variant: 'outlined',
        },
      ]}
    />
  );
}

export function StreamingError({ 
  onRetry,
  onTryDifferentSource,
}: { 
  onRetry?: () => void;
  onTryDifferentSource?: () => void;
}) {
  return (
    <ErrorState
      title="Streaming Error"
      message="Unable to load the video stream. This might be due to server issues or content restrictions."
      type="error"
      onRetry={onRetry}
      actions={[
        ...(onTryDifferentSource ? [{
          label: 'Try Different Source',
          onClick: onTryDifferentSource,
          startIcon: <MovieFilter />,
          variant: 'outlined' as const,
        }] : []),
      ]}
    />
  );
}

export function OfflineError({ onRetry }: { onRetry?: () => void }) {
  return (
    <ErrorState
      title="You're Offline"
      message="Please check your internet connection and try again."
      type="warning"
      onRetry={onRetry}
      actions={[
        {
          label: 'Check Connection',
          onClick: () => window.location.reload(),
          startIcon: <SignalWifiOff />,
          variant: 'outlined',
        },
      ]}
    />
  );
}

export function ServerError({ 
  onRetry,
  errorCode = '500',
}: { 
  onRetry?: () => void;
  errorCode?: string;
}) {
  return (
    <ErrorState
      title="Server Error"
      message="Something went wrong on our end. Our team has been notified and is working on a fix."
      type="error"
      errorCode={errorCode}
      onRetry={onRetry}
      details="If the problem persists, please contact support with the error code above."
    />
  );
}

export function RateLimitError({ 
  onRetry,
  retryAfter,
}: { 
  onRetry?: () => void;
  retryAfter?: number;
}) {
  const message = retryAfter 
    ? `Too many requests. Please wait ${retryAfter} seconds before trying again.`
    : "Too many requests. Please wait a moment before trying again.";

  return (
    <ErrorState
      title="Rate Limit Exceeded"
      message={message}
      type="warning"
      errorCode="429"
      onRetry={onRetry}
    />
  );
}

export function MaintenanceError() {
  return (
    <ErrorState
      title="Under Maintenance"
      message="We're currently performing scheduled maintenance. Please check back in a few minutes."
      type="info"
      showRetry={false}
      actions={[
        {
          label: 'Check Status',
          onClick: () => window.open('/status', '_blank'),
          variant: 'outlined',
        },
      ]}
    />
  );
}

// Generic API Error Handler
export function ApiError({ 
  error,
  onRetry,
}: { 
  error: {
    status?: number;
    message?: string;
    code?: string;
  };
  onRetry?: () => void;
}) {
  const getErrorComponent = () => {
    switch (error.status) {
      case 404:
        return <NotFoundError resource="content" onRetry={onRetry} />;
      case 429:
        return <RateLimitError onRetry={onRetry} />;
      case 500:
      case 502:
      case 503:
        return <ServerError onRetry={onRetry} errorCode={error.status?.toString()} />;
      default:
        return (
          <ErrorState
            title="Something went wrong"
            message={error.message || "An unexpected error occurred. Please try again."}
            type="error"
            errorCode={error.code || error.status?.toString()}
            onRetry={onRetry}
          />
        );
    }
  };

  return getErrorComponent();
}

// Error Hook
export function useErrorHandler() {
  const [error, setError] = React.useState<any>(null);

  const handleError = React.useCallback((error: any) => {
    console.error('Error handled:', error);
    setError(error);
  }, []);

  const clearError = React.useCallback(() => {
    setError(null);
  }, []);

  const retry = React.useCallback((retryFn?: () => void) => {
    clearError();
    if (retryFn) {
      retryFn();
    }
  }, [clearError]);

  return {
    error,
    handleError,
    clearError,
    retry,
  };
}