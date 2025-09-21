'use client';

import React, { ReactNode } from 'react';
import { Box, Container, Fab, Zoom, useScrollTrigger } from '@mui/material';
import { KeyboardArrowUp } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import Navigation from './Navigation';
import { getBrandingConfig } from '@/lib/branding';

const LayoutContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  backgroundColor: theme.palette.background.default,
}));

const MainContent = styled(Box)(({ theme }) => ({
  paddingTop: theme.spacing(2),
  paddingBottom: theme.spacing(4),
}));

const ScrollToTopFab = styled(Fab)(({ theme }) => ({
  position: 'fixed',
  bottom: theme.spacing(2),
  right: theme.spacing(2),
  zIndex: 1000,
}));

interface LayoutProps {
  children: ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
  disableGutters?: boolean;
  showScrollToTop?: boolean;
  navigationProps?: {
    onSearch?: (query: string) => void;
    searchResults?: any[];
    searchLoading?: boolean;
    user?: {
      name: string;
      avatar?: string;
      email?: string;
    } | null;
    onLogin?: () => void;
    onLogout?: () => void;
    notificationCount?: number;
  };
}

function ScrollToTop({ children }: { children: React.ReactElement }) {
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 100,
  });

  const handleClick = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <Zoom in={trigger}>
      <Box
        onClick={handleClick}
        role="presentation"
        sx={{ position: 'fixed', bottom: 16, right: 16, zIndex: 1000 }}
      >
        {children}
      </Box>
    </Zoom>
  );
}

export default function Layout({
  children,
  maxWidth = 'xl',
  disableGutters = false,
  showScrollToTop = true,
  navigationProps = {},
}: LayoutProps) {
  const config = getBrandingConfig();

  return (
    <LayoutContainer>
      <Navigation {...navigationProps} />
      
      <MainContent>
        {maxWidth === false ? (
          <Box sx={{ width: '100%' }}>
            {children}
          </Box>
        ) : (
          <Container 
            maxWidth={maxWidth} 
            disableGutters={disableGutters}
            sx={{ px: disableGutters ? 0 : undefined }}
          >
            {children}
          </Container>
        )}
      </MainContent>

      {showScrollToTop && (
        <ScrollToTop>
          <ScrollToTopFab color="primary" size="small" aria-label="scroll back to top">
            <KeyboardArrowUp />
          </ScrollToTopFab>
        </ScrollToTop>
      )}
    </LayoutContainer>
  );
}

// Specialized layout components for different page types
export function HomeLayout({ children, ...props }: Omit<LayoutProps, 'maxWidth'>) {
  return (
    <Layout maxWidth={false} disableGutters {...props}>
      {children}
    </Layout>
  );
}

export function MovieLayout({ children, ...props }: LayoutProps) {
  return (
    <Layout maxWidth="lg" {...props}>
      {children}
    </Layout>
  );
}

export function GridLayout({ children, ...props }: LayoutProps) {
  return (
    <Layout maxWidth="xl" {...props}>
      {children}
    </Layout>
  );
}

export function PlayerLayout({ children, ...props }: Omit<LayoutProps, 'maxWidth' | 'disableGutters'>) {
  return (
    <Layout maxWidth={false} disableGutters showScrollToTop={false} {...props}>
      {children}
    </Layout>
  );
}