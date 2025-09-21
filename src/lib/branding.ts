import { BrandColors, themeVariants, defaultBrandColors } from './theme';

// Theme variant type
export type ThemeVariant = 'default' | 'dark' | 'blue' | 'purple' | 'green';

// Theme configuration interface
export interface ThemeConfig {
  variant: ThemeVariant;
  darkMode: boolean;
  borderRadius: number;
}

// Feature flags interface
export interface FeatureFlags {
  enableSearch: boolean;
  enableFavorites: boolean;
  enableWatchlist: boolean;
  enableRecommendations: boolean;
  enableComments: boolean;
}

// Player configuration interface
export interface PlayerConfig {
  autoplay: boolean;
  showControls: boolean;
  defaultQuality: 'auto' | '1080p' | '720p' | '480p';
  primarySource: 'vidsrc' | 'superembed' | 'embedsu';
  volume: number;
}

// App configuration interface
export interface AppConfig {
  appName: string;
  appDescription: string;
  defaultLanguage: string;
  version: string;
  features: FeatureFlags;
  player: PlayerConfig;
  theme: ThemeConfig;
}

// Default app configuration
export const defaultAppConfig: AppConfig = {
  appName: process.env.NEXT_PUBLIC_APP_NAME || 'LX Movies',
  appDescription: process.env.NEXT_PUBLIC_APP_DESCRIPTION || 'Stream unlimited movies and TV shows from multiple sources with our advanced streaming platform.',
  defaultLanguage: 'en',
  version: '1.0.0',
  features: {
    enableSearch: true,
    enableFavorites: true,
    enableWatchlist: true,
    enableRecommendations: true,
    enableComments: false,
  },
  player: {
    autoplay: false,
    showControls: true,
    defaultQuality: 'auto',
    primarySource: 'vidsrc',
    volume: 80,
  },
  theme: {
    variant: 'default',
    darkMode: false,
    borderRadius: 8,
  },
};

// Branding storage keys
const STORAGE_KEYS = {
  THEME: 'lx-movies-theme',
  BRANDING_CONFIG: 'lx-movies-branding-config',
};

// Get current theme from localStorage
export function getCurrentTheme(): string {
  if (typeof window === 'undefined') return 'default';
  return localStorage.getItem(STORAGE_KEYS.THEME) || 'default';
}

// Set theme in localStorage
export function setTheme(themeName: keyof typeof themeVariants): boolean {
  if (typeof window === 'undefined') return false;
  
  if (themeVariants[themeName]) {
    localStorage.setItem(STORAGE_KEYS.THEME, themeName);
    window.dispatchEvent(new CustomEvent('themeChange', { detail: themeName }));
    return true;
  }
  return false;
}

// Get current app configuration
export function getBrandingConfig(): AppConfig {
  if (typeof window === 'undefined') return defaultAppConfig;
  
  try {
    const savedConfig = localStorage.getItem(STORAGE_KEYS.BRANDING_CONFIG);
    if (savedConfig) {
      const parsed = JSON.parse(savedConfig);
      return { ...defaultAppConfig, ...parsed };
    }
  } catch (error) {
    console.error('Failed to load branding config:', error);
  }
  
  return defaultAppConfig;
}

// Update app configuration
export async function updateBrandingConfig(config: AppConfig): Promise<void> {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEYS.BRANDING_CONFIG, JSON.stringify(config));
    window.dispatchEvent(new CustomEvent('brandingChange', { detail: config }));
  } catch (error) {
    console.error('Failed to save branding config:', error);
    throw error;
  }
}

// Reset to default configuration
export async function resetBrandingConfig(): Promise<AppConfig> {
  if (typeof window === 'undefined') return defaultAppConfig;
  
  try {
    localStorage.removeItem(STORAGE_KEYS.BRANDING_CONFIG);
    window.dispatchEvent(new CustomEvent('brandingChange', { detail: defaultAppConfig }));
    return defaultAppConfig;
  } catch (error) {
    console.error('Failed to reset branding config:', error);
    throw error;
  }
}

// Export configuration as JSON
export function exportBrandingConfig(): string {
  const config = getBrandingConfig();
  return JSON.stringify(config, null, 2);
}

// Import configuration from JSON
export async function importBrandingConfig(configJson: string): Promise<AppConfig> {
  try {
    const config = JSON.parse(configJson);
    await updateBrandingConfig(config);
    return config;
  } catch (error) {
    console.error('Failed to import branding config:', error);
    throw error;
  }
}

// Legacy interfaces for backward compatibility
export interface BrandingConfig {
  app: {
    name: string;
    tagline: string;
    description: string;
    version: string;
    logo?: string;
    favicon?: string;
  };
  colors: BrandColors;
  features: {
    downloadButton: boolean;
    shareButton: boolean;
    watchlist: boolean;
    ratings: boolean;
    comments: boolean;
    recommendations: boolean;
    similarMovies: boolean;
    trailers: boolean;
  };
  player: {
    accentColor: string;
    controlsTimeout: number;
    showSourceSelector: boolean;
    showQualitySelector: boolean;
    showDownloadButton: boolean;
    showShareButton: boolean;
    defaultVolume: number;
    autoplay: boolean;
  };
}

// Default legacy branding configuration
export const defaultBrandingConfig: BrandingConfig = {
  app: {
    name: process.env.NEXT_PUBLIC_APP_NAME || 'LX Movies',
    tagline: 'Your Ultimate Streaming Experience',
    description: process.env.NEXT_PUBLIC_APP_DESCRIPTION || 'Stream unlimited movies and TV shows from multiple sources with our advanced streaming platform.',
    version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
    logo: '/logo.png',
    favicon: '/favicon.ico',
  },
  colors: defaultBrandColors,
  features: {
    downloadButton: true,
    shareButton: true,
    watchlist: false,
    ratings: true,
    comments: false,
    recommendations: true,
    similarMovies: true,
    trailers: true,
  },
  player: {
    accentColor: '#e50914',
    controlsTimeout: 3000,
    showSourceSelector: true,
    showQualitySelector: true,
    showDownloadButton: true,
    showShareButton: true,
    defaultVolume: 1.0,
    autoplay: false,
  },
};

// Get current legacy branding configuration
export function getCurrentBrandingConfig(): BrandingConfig {
  if (typeof window === 'undefined') return defaultBrandingConfig;
  
  try {
    const savedConfig = localStorage.getItem(STORAGE_KEYS.BRANDING_CONFIG);
    if (savedConfig) {
      const parsed = JSON.parse(savedConfig);
      return { ...defaultBrandingConfig, ...parsed };
    }
  } catch (error) {
    console.error('Failed to load branding config:', error);
  }
  
  return defaultBrandingConfig;
}