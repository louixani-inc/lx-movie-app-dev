'use client';

import React, { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  IconButton,
  Box,
  Button,
  Menu,
  MenuItem,
  Avatar,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  useMediaQuery,
  Badge,
  Tooltip,
} from '@mui/material';
import { 
  Menu as MenuIcon,
  Search,
  Home,
  Movie,
  Favorite,
  Bookmark,
  Settings,
  Person,
  Logout,
  DarkMode,
  LightMode,
  Notifications,
  Close,
} from '@mui/icons-material';
import { styled, useTheme } from '@mui/material/styles';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import SearchBar from './SearchBar';
import BrandingPanel from './BrandingPanel';
import { getBrandingConfig } from '@/lib/branding';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  boxShadow: theme.shadows[1],
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const Logo = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  cursor: 'pointer',
}));

const NavButton = styled(Button)<{ active?: boolean }>(({ theme, active }) => ({
  color: active ? theme.palette.primary.main : theme.palette.text.primary,
  fontWeight: active ? 600 : 400,
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const MobileDrawer = styled(Drawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    width: 280,
    backgroundColor: theme.palette.background.paper,
  },
}));

const SearchContainer = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  maxWidth: 600,
  margin: '0 auto',
  [theme.breakpoints.down('md')]: {
    display: 'none',
  },
}));

const UserSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

interface NavigationProps {
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
}

const navigationItems = [
  { label: 'Home', icon: Home, href: '/' },
  { label: 'Movies', icon: Movie, href: '/movies' },
  { label: 'Favorites', icon: Favorite, href: '/favorites' },
  { label: 'Watchlist', icon: Bookmark, href: '/watchlist' },
];

export default function Navigation({
  onSearch,
  searchResults = [],
  searchLoading = false,
  user = null,
  onLogin,
  onLogout,
  notificationCount = 0,
}: NavigationProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);
  const [brandingPanelOpen, setBrandingPanelOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const router = useRouter();
  const pathname = usePathname();
  
  const config = getBrandingConfig();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const handleThemeToggle = () => {
    setDarkMode(!darkMode);
    // Emit theme change event
    window.dispatchEvent(new CustomEvent('themeChange', { 
      detail: { darkMode: !darkMode } 
    }));
  };

  const handleMovieSelect = (movie: any) => {
    router.push(`/movie/${movie.id}`);
  };

  const isActiveRoute = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  const drawer = (
    <Box>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Logo variant="h6">{config.appName}</Logo>
        <IconButton onClick={handleDrawerToggle}>
          <Close />
        </IconButton>
      </Box>
      
      <Divider />
      
      <List>
        {navigationItems.map((item) => (
          <ListItem
            key={item.label}
            component={Link}
            href={item.href}
            onClick={handleDrawerToggle}
            sx={{
              color: isActiveRoute(item.href) ? 'primary.main' : 'text.primary',
              backgroundColor: isActiveRoute(item.href) ? 'action.selected' : 'transparent',
            }}
          >
            <ListItemIcon sx={{ color: 'inherit' }}>
              <item.icon />
            </ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
      </List>
      
      <Divider />
      
      <List>
        <ListItem onClick={() => setBrandingPanelOpen(true)}>
          <ListItemIcon>
            <Settings />
          </ListItemIcon>
          <ListItemText primary="Settings" />
        </ListItem>
        
        <ListItem onClick={handleThemeToggle}>
          <ListItemIcon>
            {darkMode ? <LightMode /> : <DarkMode />}
          </ListItemIcon>
          <ListItemText primary={darkMode ? 'Light Mode' : 'Dark Mode'} />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      <StyledAppBar position="sticky">
        <Toolbar>
          {/* Mobile Menu Button */}
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}

          {/* Logo */}
          <Logo 
            variant="h6" 
            component={Link} 
            href="/"
            sx={{ mr: 4, textDecoration: 'none' }}
          >
            {config.appName}
          </Logo>

          {/* Desktop Navigation */}
          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 1, mr: 4 }}>
              {navigationItems.map((item) => (
                <NavButton
                  key={item.label}
                  component={Link}
                  href={item.href}
                  active={isActiveRoute(item.href)}
                  startIcon={<item.icon />}
                >
                  {item.label}
                </NavButton>
              ))}
            </Box>
          )}

          {/* Search Bar */}
          {config.features.enableSearch && (
            <SearchContainer>
              <SearchBar
                onSearch={onSearch || (() => {})}
                onMovieSelect={handleMovieSelect}
                searchResults={searchResults}
                loading={searchLoading}
                placeholder="Search movies..."
                size="small"
              />
            </SearchContainer>
          )}

          {/* User Section */}
          <UserSection>
            {/* Notifications */}
            <Tooltip title="Notifications">
              <IconButton color="inherit">
                <Badge badgeContent={notificationCount} color="error">
                  <Notifications />
                </Badge>
              </IconButton>
            </Tooltip>

            {/* Theme Toggle */}
            <Tooltip title={darkMode ? 'Light Mode' : 'Dark Mode'}>
              <IconButton color="inherit" onClick={handleThemeToggle}>
                {darkMode ? <LightMode /> : <DarkMode />}
              </IconButton>
            </Tooltip>

            {/* Settings */}
            <Tooltip title="Settings">
              <IconButton 
                color="inherit" 
                onClick={() => setBrandingPanelOpen(true)}
              >
                <Settings />
              </IconButton>
            </Tooltip>

            {/* User Menu */}
            {user ? (
              <>
                <IconButton
                  onClick={handleUserMenuOpen}
                  sx={{ p: 0, ml: 1 }}
                >
                  <Avatar 
                    src={user.avatar} 
                    alt={user.name}
                    sx={{ width: 32, height: 32 }}
                  >
                    {user.name.charAt(0).toUpperCase()}
                  </Avatar>
                </IconButton>
                
                <Menu
                  anchorEl={userMenuAnchor}
                  open={Boolean(userMenuAnchor)}
                  onClose={handleUserMenuClose}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                  <MenuItem onClick={handleUserMenuClose}>
                    <Person sx={{ mr: 1 }} />
                    Profile
                  </MenuItem>
                  <MenuItem onClick={handleUserMenuClose}>
                    <Settings sx={{ mr: 1 }} />
                    Account Settings
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={() => {
                    handleUserMenuClose();
                    onLogout?.();
                  }}>
                    <Logout sx={{ mr: 1 }} />
                    Logout
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Button
                color="primary"
                variant="contained"
                onClick={onLogin}
                sx={{ ml: 1 }}
              >
                Login
              </Button>
            )}
          </UserSection>
        </Toolbar>
      </StyledAppBar>

      {/* Mobile Drawer */}
      <MobileDrawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
      >
        {drawer}
      </MobileDrawer>

      {/* Branding Panel */}
      <BrandingPanel
        open={brandingPanelOpen}
        onClose={() => setBrandingPanelOpen(false)}
        onConfigChange={(config) => {
          // Emit config change event
          window.dispatchEvent(new CustomEvent('brandingChange', { 
            detail: config 
          }));
        }}
      />
    </>
  );
}

// Hook for using navigation state
export function useNavigation() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setSearchLoading(true);
    try {
      // Implement search logic here
      // const results = await searchMovies(query);
      // setSearchResults(results);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setSearchLoading(false);
    }
  };

  return {
    searchQuery,
    searchResults,
    searchLoading,
    handleSearch,
  };
}