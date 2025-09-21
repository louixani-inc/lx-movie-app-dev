'use client';

import React, { Component, ReactNode } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Paper,
  Stack,
  Alert,
  Collapse,
  IconButton,
} from '@mui/material';
import { 
  Error as ErrorIcon,
  Refresh,
  BugReport,
  ExpandMore,
  ExpandLess,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const ErrorContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  textAlign: 'center',
  margin: theme.spacing(2),
  backgroundColor: theme.palette.error.light,
  color: theme.palette.error.contrastText,
}));

const ErrorIcon_Styled = styled(ErrorIcon)(({ theme }) => ({
  fontSize: 64,
  marginBottom: theme.spacing(2),
  color: theme.palette.error.main,
}));

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
  showDetails: boolean;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  showReload?: boolean;
  showDetails?: boolean;
}

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    // Log error to console
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Log to external service (e.g., Sentry)
    // logErrorToService(error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
    });
  };

  toggleDetails = () => {
    this.setState(prev => ({
      showDetails: !prev.showDetails,
    }));
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <ErrorContainer elevation={3}>
          <ErrorIcon_Styled />
          
          <Typography variant="h4" gutterBottom>
            Oops! Something went wrong
          </Typography>
          
          <Typography variant="body1" paragraph>
            We're sorry, but something unexpected happened. Please try refreshing the page.
          </Typography>

          <Stack direction="row" spacing={2} justifyContent="center" sx={{ mb: 2 }}>
            {this.props.showReload !== false && (
              <Button
                variant="contained"
                startIcon={<Refresh />}
                onClick={this.handleReload}
              >
                Reload Page
              </Button>
            )}
            
            <Button
              variant="outlined"
              onClick={this.handleReset}
            >
              Try Again
            </Button>
          </Stack>

          {this.props.showDetails !== false && this.state.error && (
            <>
              <Button
                startIcon={<BugReport />}
                endIcon={this.state.showDetails ? <ExpandLess /> : <ExpandMore />}
                onClick={this.toggleDetails}
                size="small"
              >
                {this.state.showDetails ? 'Hide' : 'Show'} Error Details
              </Button>

              <Collapse in={this.state.showDetails}>
                <Alert severity="error" sx={{ mt: 2, textAlign: 'left' }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Error Message:
                  </Typography>
                  <Typography variant="body2" component="pre" sx={{ mb: 2 }}>
                    {this.state.error.message}
                  </Typography>
                  
                  {this.state.error.stack && (
                    <>
                      <Typography variant="subtitle2" gutterBottom>
                        Stack Trace:
                      </Typography>
                      <Typography 
                        variant="body2" 
                        component="pre" 
                        sx={{ 
                          fontSize: '0.75rem',
                          overflow: 'auto',
                          maxHeight: 200,
                          backgroundColor: 'rgba(0,0,0,0.1)',
                          padding: 1,
                          borderRadius: 1,
                        }}
                      >
                        {this.state.error.stack}
                      </Typography>
                    </>
                  )}
                </Alert>
              </Collapse>
            </>
          )}
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
}

// Hook for error handling in functional components
export function useErrorHandler() {
  const [error, setError] = React.useState<Error | null>(null);

  const resetError = () => setError(null);

  const handleError = React.useCallback((error: Error) => {
    console.error('Error caught by useErrorHandler:', error);
    setError(error);
  }, []);

  // Reset error when component unmounts
  React.useEffect(() => {
    return () => setError(null);
  }, []);

  return {
    error,
    handleError,
    resetError,
  };
}

// Simple error fallback component
export function ErrorFallback({ 
  error, 
  resetError 
}: { 
  error: Error; 
  resetError: () => void; 
}) {
  return (
    <Box sx={{ p: 4, textAlign: 'center' }}>
      <ErrorIcon sx={{ fontSize: 48, color: 'error.main', mb: 2 }} />
      <Typography variant="h6" gutterBottom>
        Something went wrong
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        {error.message}
      </Typography>
      <Button variant="outlined" onClick={resetError}>
        Try Again
      </Button>
    </Box>
  );
}