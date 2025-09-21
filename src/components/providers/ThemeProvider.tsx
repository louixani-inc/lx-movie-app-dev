'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ThemeProvider as MUIThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { createAppTheme } from '@/lib/theme';
import { 
  BrandingConfig, 
  getCurrentBrandingConfig, 
  getCurrentColors,
  generateCSSCustomProperties,
  defaultBrandingConfig 
} from '@/lib/branding';

interface ThemeContextType {
  config: BrandingConfig;
  updateConfig: (updates: Partial<BrandingConfig>) => void;
  resetConfig: () => void;
  exportConfig: () => object | null;
  importConfig: (configData: any) => boolean;
  isLoading: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [config, setConfig] = useState<BrandingConfig>(defaultBrandingConfig);
  const [isLoading, setIsLoading] = useState(true);

  // Load configuration on mount
  useEffect(() => {
    const loadConfig = () => {
      try {
        const savedConfig = getCurrentBrandingConfig();
        setConfig(savedConfig);
      } catch (error) {
        console.error('Failed to load theme config:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadConfig();

    // Listen for branding events
    const handleThemeChange = () => {
      loadConfig();
    };

    const handleBrandingUpdate = (event: CustomEvent) => {
      setConfig(event.detail);
    };

    const handleBrandingReset = () => {
      setConfig(defaultBrandingConfig);
    };

    const handleBrandingImport = () => {
      loadConfig();
    };

    window.addEventListener('themeChange', handleThemeChange);
    window.addEventListener('brandingUpdate', handleBrandingUpdate as EventListener);
    window.addEventListener('brandingReset', handleBrandingReset);
    window.addEventListener('brandingImport', handleBrandingImport);

    return () => {
      window.removeEventListener('themeChange', handleThemeChange);
      window.removeEventListener('brandingUpdate', handleBrandingUpdate as EventListener);
      window.removeEventListener('brandingReset', handleBrandingReset);
      window.removeEventListener('brandingImport', handleBrandingImport);
    };
  }, []);

  // Apply CSS custom properties
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const root = document.documentElement;
    const cssProperties = generateCSSCustomProperties(config.colors);
    
    Object.entries(cssProperties).forEach(([property, value]) => {
      root.style.setProperty(property, value);
    });

    // Update document title and meta tags
    document.title = `${config.app.name} - ${config.app.tagline}`;
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', config.app.description);
    }

    // Update favicon if specified
    if (config.app.favicon) {
      const favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
      if (favicon) {
        favicon.href = config.app.favicon;
      }
    }
  }, [config]);

  const updateConfig = (updates: Partial<BrandingConfig>) => {
    setIsLoading(true);
    try {
      const newConfig = { ...config, ...updates };
      setConfig(newConfig);
      
      // Save to localStorage
      localStorage.setItem('lx-movies-branding-config', JSON.stringify(newConfig));
      
      // Trigger update event
      window.dispatchEvent(new CustomEvent('brandingUpdate', { detail: newConfig }));
    } catch (error) {
      console.error('Failed to update config:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetConfig = () => {
    setIsLoading(true);
    try {
      localStorage.removeItem('lx-movies-theme');
      localStorage.removeItem('lx-movies-branding-config');
      setConfig(defaultBrandingConfig);
      
      window.dispatchEvent(new CustomEvent('brandingReset'));
    } catch (error) {
      console.error('Failed to reset config:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const exportConfig = () => {
    try {
      return {
        config,
        exportDate: new Date().toISOString(),
        version: '1.0.0',
      };
    } catch (error) {
      console.error('Failed to export config:', error);
      return null;
    }
  };

  const importConfig = (configData: any) => {
    setIsLoading(true);
    try {
      if (configData.config) {
        setConfig(configData.config);
        localStorage.setItem('lx-movies-branding-config', JSON.stringify(configData.config));
      }
      
      window.dispatchEvent(new CustomEvent('brandingImport', { detail: configData }));
      return true;
    } catch (error) {
      console.error('Failed to import config:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Create MUI theme based on current configuration
  const muiTheme = createAppTheme(config.colors);

  const contextValue: ThemeContextType = {
    config,
    updateConfig,
    resetConfig,
    exportConfig,
    importConfig,
    isLoading,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      <MUIThemeProvider theme={muiTheme}>
        <CssBaseline />
        {children}
      </MUIThemeProvider>
    </ThemeContext.Provider>
  );
}