'use client';

import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Switch,
  FormControlLabel,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Slider,
  TextField,
  Button,
  Paper,
  Divider,
  Chip,
  Stack,
  Alert,
  Collapse,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  Card,
  CardContent,
  CardActions,
} from '@mui/material';
import { 
  ExpandMore,
  Palette,
  Settings,
  PlayArrow,
  Visibility,
  Save,
  Restore,
  Download,
  Upload,
  Close,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AppConfig, 
  ThemeVariant, 
  PlayerConfig,
  getBrandingConfig,
  updateBrandingConfig,
  resetBrandingConfig,
  exportBrandingConfig,
  importBrandingConfig,
} from '@/lib/branding';

const PanelContainer = styled(Paper)(({ theme }) => ({
  position: 'fixed',
  top: 0,
  right: 0,
  width: 400,
  height: '100vh',
  zIndex: 1300,
  overflowY: 'auto',
  backgroundColor: theme.palette.background.paper,
  borderLeft: `1px solid ${theme.palette.divider}`,
  boxShadow: theme.shadows[16],
}));

const PanelHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderBottom: `1px solid ${theme.palette.divider}`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  position: 'sticky',
  top: 0,
  backgroundColor: theme.palette.background.paper,
  zIndex: 1,
}));

const PanelContent = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
}));

const ColorPreview = styled(Box)<{ color: string }>(({ color, theme }) => ({
  width: 40,
  height: 40,
  borderRadius: theme.shape.borderRadius,
  backgroundColor: color,
  border: `2px solid ${theme.palette.divider}`,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'transform 0.2s ease',
  '&:hover': {
    transform: 'scale(1.1)',
  },
}));

const ThemePreview = styled(Card)<{ selected: boolean }>(({ selected, theme }) => ({
  cursor: 'pointer',
  border: selected ? `2px solid ${theme.palette.primary.main}` : `1px solid ${theme.palette.divider}`,
  transition: 'all 0.2s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[4],
  },
}));

const FeatureToggle = styled(FormControlLabel)(({ theme }) => ({
  margin: 0,
  width: '100%',
  justifyContent: 'space-between',
  '& .MuiFormControlLabel-label': {
    flex: 1,
  },
}));

interface BrandingPanelProps {
  open: boolean;
  onClose: () => void;
  onConfigChange?: (config: AppConfig) => void;
}

const themeVariants: { value: ThemeVariant; label: string; colors: string[] }[] = [
  { value: 'default', label: 'Default', colors: ['#1976d2', '#dc004e', '#9c27b0'] },
  { value: 'dark', label: 'Dark', colors: ['#121212', '#bb86fc', '#03dac6'] },
  { value: 'blue', label: 'Ocean Blue', colors: ['#0d47a1', '#1976d2', '#42a5f5'] },
  { value: 'purple', label: 'Royal Purple', colors: ['#4a148c', '#7b1fa2', '#ba68c8'] },
  { value: 'green', label: 'Forest Green', colors: ['#1b5e20', '#388e3c', '#66bb6a'] },
];

const streamingSources = [
  { value: 'vidsrc', label: 'VidSrc' },
  { value: 'superembed', label: 'SuperEmbed' },
  { value: 'embedsu', label: 'EmbedSu' },
];

export default function BrandingPanel({ open, onClose, onConfigChange }: BrandingPanelProps) {
  const [config, setConfig] = useState<AppConfig>(getBrandingConfig());
  const [hasChanges, setHasChanges] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  useEffect(() => {
    if (open) {
      setConfig(getBrandingConfig());
      setHasChanges(false);
    }
  }, [open]);

  const handleConfigUpdate = (updates: Partial<AppConfig>) => {
    const newConfig = { ...config, ...updates };
    setConfig(newConfig);
    setHasChanges(true);
    
    if (onConfigChange) {
      onConfigChange(newConfig);
    }
  };

  const handleSave = async () => {
    setSaveStatus('saving');
    try {
      await updateBrandingConfig(config);
      setHasChanges(false);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  const handleReset = async () => {
    try {
      const defaultConfig = await resetBrandingConfig();
      setConfig(defaultConfig);
      setHasChanges(true);
      if (onConfigChange) {
        onConfigChange(defaultConfig);
      }
    } catch (error) {
      console.error('Failed to reset config:', error);
    }
  };

  const handleExport = () => {
    const configJson = exportBrandingConfig();
    const blob = new Blob([configJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'branding-config.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const configJson = e.target?.result as string;
        const importedConfig = await importBrandingConfig(configJson);
        setConfig(importedConfig);
        setHasChanges(true);
        if (onConfigChange) {
          onConfigChange(importedConfig);
        }
      } catch (error) {
        console.error('Failed to import config:', error);
      }
    };
    reader.readAsText(file);
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: 400 }}
        animate={{ x: 0 }}
        exit={{ x: 400 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      >
        <PanelContainer>
          <PanelHeader>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Settings color="primary" />
              <Typography variant="h6">Branding Settings</Typography>
            </Box>
            <IconButton onClick={onClose} size="small">
              <Close />
            </IconButton>
          </PanelHeader>

          <PanelContent>
            {/* Save Status */}
            <Collapse in={saveStatus !== 'idle'}>
              <Alert 
                severity={saveStatus === 'saved' ? 'success' : saveStatus === 'error' ? 'error' : 'info'}
                sx={{ mb: 2 }}
              >
                {saveStatus === 'saving' && 'Saving configuration...'}
                {saveStatus === 'saved' && 'Configuration saved successfully!'}
                {saveStatus === 'error' && 'Failed to save configuration'}
              </Alert>
            </Collapse>

            {/* App Settings */}
            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography variant="h6">App Configuration</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Stack spacing={3}>
                  <TextField
                    label="App Name"
                    value={config.appName}
                    onChange={(e) => handleConfigUpdate({ appName: e.target.value })}
                    fullWidth
                  />
                  
                  <TextField
                    label="App Description"
                    value={config.appDescription}
                    onChange={(e) => handleConfigUpdate({ appDescription: e.target.value })}
                    multiline
                    rows={2}
                    fullWidth
                  />

                  <FormControl fullWidth>
                    <InputLabel>Default Language</InputLabel>
                    <Select
                      value={config.defaultLanguage}
                      onChange={(e) => handleConfigUpdate({ defaultLanguage: e.target.value })}
                    >
                      <MenuItem value="en">English</MenuItem>
                      <MenuItem value="es">Spanish</MenuItem>
                      <MenuItem value="fr">French</MenuItem>
                      <MenuItem value="de">German</MenuItem>
                      <MenuItem value="it">Italian</MenuItem>
                    </Select>
                  </FormControl>
                </Stack>
              </AccordionDetails>
            </Accordion>

            {/* Theme Settings */}
            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography variant="h6">Theme & Appearance</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Stack spacing={3}>
                  <Box>
                    <Typography variant="subtitle2" gutterBottom>
                      Theme Variant
                    </Typography>
                    <Grid container spacing={1}>
                      {themeVariants.map((theme) => (
                        <Grid item xs={6} key={theme.value}>
                          <ThemePreview
                            selected={config.theme.variant === theme.value}
                            onClick={() => handleConfigUpdate({ 
                              theme: { ...config.theme, variant: theme.value } 
                            })}
                          >
                            <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                              <Typography variant="body2" align="center" gutterBottom>
                                {theme.label}
                              </Typography>
                              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
                                {theme.colors.map((color, index) => (
                                  <Box
                                    key={index}
                                    sx={{
                                      width: 16,
                                      height: 16,
                                      borderRadius: '50%',
                                      backgroundColor: color,
                                    }}
                                  />
                                ))}
                              </Box>
                            </CardContent>
                          </ThemePreview>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>

                  <FeatureToggle
                    control={
                      <Switch
                        checked={config.theme.darkMode}
                        onChange={(e) => handleConfigUpdate({ 
                          theme: { ...config.theme, darkMode: e.target.checked } 
                        })}
                      />
                    }
                    label="Dark Mode"
                  />

                  <Box>
                    <Typography variant="subtitle2" gutterBottom>
                      Border Radius: {config.theme.borderRadius}px
                    </Typography>
                    <Slider
                      value={config.theme.borderRadius}
                      onChange={(_, value) => handleConfigUpdate({ 
                        theme: { ...config.theme, borderRadius: value as number } 
                      })}
                      min={0}
                      max={20}
                      step={1}
                      marks
                    />
                  </Box>
                </Stack>
              </AccordionDetails>
            </Accordion>

            {/* Feature Flags */}
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography variant="h6">Features</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Stack spacing={2}>
                  <FeatureToggle
                    control={
                      <Switch
                        checked={config.features.enableSearch}
                        onChange={(e) => handleConfigUpdate({ 
                          features: { ...config.features, enableSearch: e.target.checked } 
                        })}
                      />
                    }
                    label="Search Functionality"
                  />

                  <FeatureToggle
                    control={
                      <Switch
                        checked={config.features.enableFavorites}
                        onChange={(e) => handleConfigUpdate({ 
                          features: { ...config.features, enableFavorites: e.target.checked } 
                        })}
                      />
                    }
                    label="Favorites System"
                  />

                  <FeatureToggle
                    control={
                      <Switch
                        checked={config.features.enableWatchlist}
                        onChange={(e) => handleConfigUpdate({ 
                          features: { ...config.features, enableWatchlist: e.target.checked } 
                        })}
                      />
                    }
                    label="Watchlist"
                  />

                  <FeatureToggle
                    control={
                      <Switch
                        checked={config.features.enableRecommendations}
                        onChange={(e) => handleConfigUpdate({ 
                          features: { ...config.features, enableRecommendations: e.target.checked } 
                        })}
                      />
                    }
                    label="Recommendations"
                  />

                  <FeatureToggle
                    control={
                      <Switch
                        checked={config.features.enableComments}
                        onChange={(e) => handleConfigUpdate({ 
                          features: { ...config.features, enableComments: e.target.checked } 
                        })}
                      />
                    }
                    label="Comments & Reviews"
                  />
                </Stack>
              </AccordionDetails>
            </Accordion>

            {/* Player Settings */}
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography variant="h6">Video Player</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Stack spacing={3}>
                  <FeatureToggle
                    control={
                      <Switch
                        checked={config.player.autoplay}
                        onChange={(e) => handleConfigUpdate({ 
                          player: { ...config.player, autoplay: e.target.checked } 
                        })}
                      />
                    }
                    label="Autoplay Videos"
                  />

                  <FeatureToggle
                    control={
                      <Switch
                        checked={config.player.showControls}
                        onChange={(e) => handleConfigUpdate({ 
                          player: { ...config.player, showControls: e.target.checked } 
                        })}
                      />
                    }
                    label="Show Player Controls"
                  />

                  <FormControl fullWidth>
                    <InputLabel>Default Quality</InputLabel>
                    <Select
                      value={config.player.defaultQuality}
                      onChange={(e) => handleConfigUpdate({ 
                        player: { ...config.player, defaultQuality: e.target.value as any } 
                      })}
                    >
                      <MenuItem value="auto">Auto</MenuItem>
                      <MenuItem value="1080p">1080p</MenuItem>
                      <MenuItem value="720p">720p</MenuItem>
                      <MenuItem value="480p">480p</MenuItem>
                    </Select>
                  </FormControl>

                  <FormControl fullWidth>
                    <InputLabel>Primary Streaming Source</InputLabel>
                    <Select
                      value={config.player.primarySource}
                      onChange={(e) => handleConfigUpdate({ 
                        player: { ...config.player, primarySource: e.target.value as any } 
                      })}
                    >
                      {streamingSources.map((source) => (
                        <MenuItem key={source.value} value={source.value}>
                          {source.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <Box>
                    <Typography variant="subtitle2" gutterBottom>
                      Volume: {config.player.volume}%
                    </Typography>
                    <Slider
                      value={config.player.volume}
                      onChange={(_, value) => handleConfigUpdate({ 
                        player: { ...config.player, volume: value as number } 
                      })}
                      min={0}
                      max={100}
                      step={5}
                    />
                  </Box>
                </Stack>
              </AccordionDetails>
            </Accordion>

            <Divider sx={{ my: 3 }} />

            {/* Action Buttons */}
            <Stack spacing={2}>
              <Button
                variant="contained"
                onClick={handleSave}
                disabled={!hasChanges || saveStatus === 'saving'}
                startIcon={<Save />}
                fullWidth
              >
                {saveStatus === 'saving' ? 'Saving...' : 'Save Changes'}
              </Button>

              <Stack direction="row" spacing={1}>
                <Button
                  variant="outlined"
                  onClick={handleReset}
                  startIcon={<Restore />}
                  fullWidth
                >
                  Reset
                </Button>
                
                <Button
                  variant="outlined"
                  onClick={handleExport}
                  startIcon={<Download />}
                  fullWidth
                >
                  Export
                </Button>
                
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<Upload />}
                  fullWidth
                >
                  Import
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImport}
                    style={{ display: 'none' }}
                  />
                </Button>
              </Stack>
            </Stack>
          </PanelContent>
        </PanelContainer>
      </motion.div>
    </AnimatePresence>
  );
}