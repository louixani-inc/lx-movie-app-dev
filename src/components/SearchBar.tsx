'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  TextField, 
  InputAdornment,
  IconButton,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
  Chip,
  Fade,
  CircularProgress,
  Divider,
} from '@mui/material';
import { 
  Search, 
  Clear, 
  TrendingUp,
  History,
  Movie as MovieIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Movie } from '@/lib/api';
import { imageUtils, utils } from '@/lib/api';
import { useDebounce } from '@/hooks/useDebounce';

const SearchContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  maxWidth: 600,
  margin: '0 auto',
}));

const SearchField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius * 2,
    '&:hover': {
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.palette.primary.main,
      },
    },
    '&.Mui-focused': {
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.palette.primary.main,
        borderWidth: 2,
      },
    },
  },
}));

const SuggestionsContainer = styled(Paper)(({ theme }) => ({
  position: 'absolute',
  top: '100%',
  left: 0,
  right: 0,
  zIndex: 1000,
  marginTop: theme.spacing(1),
  maxHeight: 400,
  overflow: 'auto',
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[8],
}));

const SuggestionItem = styled(ListItem)(({ theme }) => ({
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const TrendingSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
}));

const TrendingChips = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(1),
  marginTop: theme.spacing(1),
}));

const HistorySection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  marginBottom: theme.spacing(1),
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  color: theme.palette.text.secondary,
}));

interface SearchBarProps {
  onSearch: (query: string) => void;
  onMovieSelect?: (movie: Movie) => void;
  searchResults?: Movie[];
  loading?: boolean;
  placeholder?: string;
  showSuggestions?: boolean;
  trendingSearches?: string[];
  searchHistory?: string[];
  onClearHistory?: () => void;
  variant?: 'outlined' | 'filled' | 'standard';
  size?: 'small' | 'medium';
  fullWidth?: boolean;
}

export default function SearchBar({
  onSearch,
  onMovieSelect,
  searchResults = [],
  loading = false,
  placeholder = "Search for movies...",
  showSuggestions = true,
  trendingSearches = [],
  searchHistory = [],
  onClearHistory,
  variant = 'outlined',
  size = 'medium',
  fullWidth = true,
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (debouncedQuery.trim()) {
      onSearch(debouncedQuery);
    }
  }, [debouncedQuery, onSearch]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setQuery(value);
    setShowDropdown(true);
    setFocusedIndex(-1);
  };

  const handleInputFocus = () => {
    setShowDropdown(true);
  };

  const handleClear = () => {
    setQuery('');
    setShowDropdown(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleMovieClick = (movie: Movie) => {
    setQuery(movie.title);
    setShowDropdown(false);
    if (onMovieSelect) {
      onMovieSelect(movie);
    }
  };

  const handleTrendingClick = (search: string) => {
    setQuery(search);
    setShowDropdown(false);
    onSearch(search);
  };

  const handleHistoryClick = (search: string) => {
    setQuery(search);
    setShowDropdown(false);
    onSearch(search);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (!showDropdown) return;

    const totalItems = searchResults.length + trendingSearches.length + searchHistory.length;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setFocusedIndex((prev) => (prev + 1) % totalItems);
        break;
      case 'ArrowUp':
        event.preventDefault();
        setFocusedIndex((prev) => (prev - 1 + totalItems) % totalItems);
        break;
      case 'Enter':
        event.preventDefault();
        if (focusedIndex >= 0 && focusedIndex < searchResults.length) {
          handleMovieClick(searchResults[focusedIndex]);
        } else if (query.trim()) {
          setShowDropdown(false);
          onSearch(query);
        }
        break;
      case 'Escape':
        setShowDropdown(false);
        break;
    }
  };

  const renderMovieResults = () => {
    if (!searchResults.length) return null;

    return (
      <>
        <SectionTitle variant="subtitle2">
          <MovieIcon fontSize="small" />
          Movies
        </SectionTitle>
        <List dense>
          {searchResults.slice(0, 5).map((movie, index) => {
            const posterUrl = imageUtils.getPosterUrl(movie.poster_path, 'w92');
            const year = movie.release_date ? utils.getYear(movie.release_date) : null;
            const rating = utils.formatRating(movie.vote_average);

            return (
              <motion.div
                key={movie.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <SuggestionItem
                  onClick={() => handleMovieClick(movie)}
                  selected={index === focusedIndex}
                >
                  <ListItemAvatar>
                    <Avatar variant="rounded" sx={{ width: 40, height: 60 }}>
                      {posterUrl ? (
                        <Image
                          src={posterUrl}
                          alt={movie.title}
                          width={40}
                          height={60}
                          style={{ objectFit: 'cover' }}
                        />
                      ) : (
                        <MovieIcon />
                      )}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={movie.title}
                    secondary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {year && <span>{year}</span>}
                        {movie.vote_average > 0 && (
                          <Chip 
                            label={`★ ${rating}`} 
                            size="small" 
                            variant="outlined"
                          />
                        )}
                      </Box>
                    }
                  />
                </SuggestionItem>
              </motion.div>
            );
          })}
        </List>
        {searchResults.length > 5 && (
          <Box sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              +{searchResults.length - 5} more results
            </Typography>
          </Box>
        )}
      </>
    );
  };

  const renderTrendingSearches = () => {
    if (!trendingSearches.length || query.trim()) return null;

    return (
      <TrendingSection>
        <SectionTitle variant="subtitle2">
          <TrendingUp fontSize="small" />
          Trending Searches
        </SectionTitle>
        <TrendingChips>
          {trendingSearches.map((search, index) => (
            <motion.div
              key={search}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              <Chip
                label={search}
                onClick={() => handleTrendingClick(search)}
                variant="outlined"
                size="small"
                clickable
              />
            </motion.div>
          ))}
        </TrendingChips>
      </TrendingSection>
    );
  };

  const renderSearchHistory = () => {
    if (!searchHistory.length || query.trim()) return null;

    return (
      <HistorySection>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <SectionTitle variant="subtitle2">
            <History fontSize="small" />
            Recent Searches
          </SectionTitle>
          {onClearHistory && (
            <IconButton size="small" onClick={onClearHistory}>
              <Clear fontSize="small" />
            </IconButton>
          )}
        </Box>
        <List dense>
          {searchHistory.slice(0, 3).map((search, index) => (
            <motion.div
              key={search}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <SuggestionItem onClick={() => handleHistoryClick(search)}>
                <ListItemText primary={search} />
              </SuggestionItem>
            </motion.div>
          ))}
        </List>
      </HistorySection>
    );
  };

  return (
    <SearchContainer ref={searchRef}>
      <SearchField
        ref={inputRef}
        fullWidth={fullWidth}
        variant={variant}
        size={size}
        placeholder={placeholder}
        value={query}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        onKeyDown={handleKeyDown}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search color="action" />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              {loading && <CircularProgress size={20} />}
              {query && !loading && (
                <IconButton onClick={handleClear} size="small">
                  <Clear />
                </IconButton>
              )}
            </InputAdornment>
          ),
        }}
      />

      <AnimatePresence>
        {showDropdown && showSuggestions && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <Fade in={showDropdown}>
              <SuggestionsContainer>
                {query.trim() ? (
                  <>
                    {renderMovieResults()}
                    {searchResults.length === 0 && !loading && (
                      <Box sx={{ p: 3, textAlign: 'center' }}>
                        <Typography variant="body2" color="text.secondary">
                          No movies found for "{query}"
                        </Typography>
                      </Box>
                    )}
                  </>
                ) : (
                  <>
                    {renderTrendingSearches()}
                    {trendingSearches.length > 0 && searchHistory.length > 0 && <Divider />}
                    {renderSearchHistory()}
                  </>
                )}
              </SuggestionsContainer>
            </Fade>
          </motion.div>
        )}
      </AnimatePresence>
    </SearchContainer>
  );
}