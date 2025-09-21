'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { 
  Box, 
  IconButton, 
  Slider, 
  Typography, 
  Select, 
  MenuItem, 
  FormControl,
  Fade,
  CircularProgress,
  Alert,
  Button,
  Tooltip,
} from '@mui/material';
import {
  PlayArrow,
  Pause,
  VolumeUp,
  VolumeOff,
  Fullscreen,
  FullscreenExit,
  Settings,
  SkipPrevious,
  SkipNext,
  Replay10,
  Forward10,
  ClosedCaption,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import Hls from 'hls.js';
import { StreamingSource } from '@/lib/api';
import { useTheme } from '@/components/providers/ThemeProvider';

const PlayerContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  height: '100%',
  backgroundColor: '#000',
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden',
  cursor: 'none',
  '&:hover': {
    cursor: 'default',
  },
}));

const VideoElement = styled('video')({
  width: '100%',
  height: '100%',
  objectFit: 'contain',
});

const IframeElement = styled('iframe')({
  width: '100%',
  height: '100%',
  border: 'none',
});

const ControlsOverlay = styled(Box)<{ visible: boolean }>(({ visible }) => ({
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
  padding: '20px',
  opacity: visible ? 1 : 0,
  transition: 'opacity 0.3s ease',
  pointerEvents: visible ? 'auto' : 'none',
}));

const ProgressContainer = styled(Box)({
  width: '100%',
  marginBottom: '16px',
});

const ControlsRow = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
});

const TimeDisplay = styled(Typography)({
  minWidth: '100px',
  fontSize: '14px',
  color: 'white',
});

const VolumeContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  minWidth: '120px',
});

const SourceSelector = styled(FormControl)({
  minWidth: '120px',
  '& .MuiSelect-select': {
    color: 'white',
    fontSize: '14px',
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: 'rgba(255,255,255,0.3)',
  },
});

const LoadingOverlay = styled(Box)({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.8)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'white',
  gap: '16px',
});

const ErrorOverlay = styled(Box)({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.9)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '20px',
  textAlign: 'center',
});

const CenterPlayButton = styled(IconButton)({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  backgroundColor: 'rgba(0,0,0,0.7)',
  color: 'white',
  width: '80px',
  height: '80px',
  '&:hover': {
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
});

interface VideoPlayerProps {
  sources: StreamingSource[];
  title?: string;
  onSourceChange?: (source: StreamingSource) => void;
  autoplay?: boolean;
  poster?: string;
}

export default function VideoPlayer({ 
  sources, 
  title, 
  onSourceChange, 
  autoplay = false,
  poster 
}: VideoPlayerProps) {
  const { config } = useTheme();
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [currentSourceIndex, setCurrentSourceIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(config.player.defaultVolume);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showCenterPlay, setShowCenterPlay] = useState(true);

  // Format time helper
  const formatTime = useCallback((time: number): string => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }, []);

  // Initialize video player
  useEffect(() => {
    if (!sources.length || !videoRef.current) return;

    const video = videoRef.current;
    const source = sources[currentSourceIndex];
    
    setIsLoading(true);
    setError(null);
    setShowCenterPlay(true);

    // Clean up previous HLS instance
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    // Handle different source types
    if (source.type === 'embed') {
      // For embed sources, we'll show an error since we can't control them directly
      setError('This source requires opening in a new window');
      setIsLoading(false);
      return;
    }

    if (source.type === 'hls' || source.url.includes('.m3u8')) {
      // HLS streaming
      if (Hls.isSupported()) {
        const hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90,
        });
        
        hlsRef.current = hls;
        hls.loadSource(source.url);
        hls.attachMedia(video);
        
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          setIsLoading(false);
          if (autoplay) {
            video.play().catch(console.error);
          }
        });
        
        hls.on(Hls.Events.ERROR, (event, data) => {
          console.error('HLS Error:', data);
          if (data.fatal) {
            setError(`Streaming error: ${data.details}`);
            setIsLoading(false);
          }
        });
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        // Native HLS support (Safari)
        video.src = source.url;
        video.load();
      } else {
        setError('HLS not supported in this browser');
        setIsLoading(false);
      }
    } else {
      // Direct video file
      video.src = source.url;
      video.load();
    }

    // Video event listeners
    const handleLoadStart = () => setIsLoading(true);
    const handleCanPlay = () => {
      setIsLoading(false);
      if (autoplay) {
        video.play().catch(console.error);
      }
    };
    const handleError = () => {
      setError('Failed to load video source');
      setIsLoading(false);
    };
    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      setProgress((video.currentTime / video.duration) * 100);
    };
    const handleDurationChange = () => setDuration(video.duration);
    const handleProgress = () => {
      if (video.buffered.length > 0) {
        setBuffered((video.buffered.end(0) / video.duration) * 100);
      }
    };
    const handlePlay = () => {
      setIsPlaying(true);
      setShowCenterPlay(false);
    };
    const handlePause = () => setIsPlaying(false);

    video.addEventListener('loadstart', handleLoadStart);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('error', handleError);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('durationchange', handleDurationChange);
    video.addEventListener('progress', handleProgress);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);

    return () => {
      video.removeEventListener('loadstart', handleLoadStart);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('error', handleError);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('durationchange', handleDurationChange);
      video.removeEventListener('progress', handleProgress);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }
    };
  }, [sources, currentSourceIndex, autoplay]);

  // Auto-hide controls
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (isPlaying && controlsVisible) {
      timeout = setTimeout(() => {
        setControlsVisible(false);
      }, config.player.controlsTimeout);
    }
    return () => clearTimeout(timeout);
  }, [isPlaying, controlsVisible, config.player.controlsTimeout]);

  // Fullscreen change listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const togglePlay = useCallback(() => {
    if (!videoRef.current) return;
    
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play().catch(console.error);
    }
  }, [isPlaying]);

  const handleVolumeChange = useCallback((event: Event, newValue: number | number[]) => {
    const newVolume = Array.isArray(newValue) ? newValue[0] : newValue;
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
    setIsMuted(newVolume === 0);
  }, []);

  const toggleMute = useCallback(() => {
    if (!videoRef.current) return;
    
    if (isMuted) {
      videoRef.current.volume = volume;
      setIsMuted(false);
    } else {
      videoRef.current.volume = 0;
      setIsMuted(true);
    }
  }, [isMuted, volume]);

  const handleProgressChange = useCallback((event: Event, newValue: number | number[]) => {
    if (!videoRef.current) return;
    
    const newProgress = Array.isArray(newValue) ? newValue[0] : newValue;
    const newTime = (newProgress / 100) * duration;
    videoRef.current.currentTime = newTime;
  }, [duration]);

  const changeSource = useCallback((sourceIndex: number) => {
    setCurrentSourceIndex(sourceIndex);
    if (onSourceChange) {
      onSourceChange(sources[sourceIndex]);
    }
  }, [sources, onSourceChange]);

  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return;
    
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(console.error);
    } else {
      document.exitFullscreen().catch(console.error);
    }
  }, []);

  const skip = useCallback((seconds: number) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = Math.max(0, Math.min(duration, videoRef.current.currentTime + seconds));
  }, [duration]);

  const handleMouseMove = useCallback(() => {
    setControlsVisible(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (isPlaying) {
      setControlsVisible(false);
    }
  }, [isPlaying]);

  const handleCenterPlayClick = useCallback(() => {
    setShowCenterPlay(false);
    togglePlay();
  }, [togglePlay]);

  const openInNewWindow = useCallback(() => {
    if (sources[currentSourceIndex]) {
      window.open(sources[currentSourceIndex].url, '_blank');
    }
  }, [sources, currentSourceIndex]);

  if (!sources.length) {
    return (
      <PlayerContainer>
        <ErrorOverlay>
          <Typography variant="h6" gutterBottom>
            No streaming sources available
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Please try searching for another movie
          </Typography>
        </ErrorOverlay>
      </PlayerContainer>
    );
  }

  const currentSource = sources[currentSourceIndex];

  return (
    <PlayerContainer
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {currentSource.type === 'embed' ? (
        <IframeElement
          src={currentSource.url}
          title={title}
          allowFullScreen
          allow="autoplay; encrypted-media"
        />
      ) : (
        <VideoElement
          ref={videoRef}
          poster={poster}
          onClick={togglePlay}
          playsInline
          preload="metadata"
        />
      )}
      
      {isLoading && (
        <LoadingOverlay>
          <CircularProgress size={60} sx={{ color: config.colors.primary }} />
          <Typography variant="body1">Loading video...</Typography>
        </LoadingOverlay>
      )}
      
      {error && (
        <ErrorOverlay>
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
          {currentSource.type === 'embed' ? (
            <Button 
              variant="contained" 
              onClick={openInNewWindow}
              sx={{ mt: 2 }}
            >
              Open in New Window
            </Button>
          ) : (
            <Button 
              variant="contained" 
              onClick={() => changeSource((currentSourceIndex + 1) % sources.length)}
              sx={{ mt: 2 }}
            >
              Try Next Source
            </Button>
          )}
        </ErrorOverlay>
      )}

      {showCenterPlay && !isLoading && !error && currentSource.type !== 'embed' && (
        <CenterPlayButton onClick={handleCenterPlayClick}>
          <PlayArrow sx={{ fontSize: 40 }} />
        </CenterPlayButton>
      )}
      
      {currentSource.type !== 'embed' && (
        <Fade in={controlsVisible}>
          <ControlsOverlay visible={controlsVisible}>
            <ProgressContainer>
              <Slider
                value={progress}
                onChange={handleProgressChange}
                sx={{
                  color: config.colors.primary,
                  '& .MuiSlider-track': {
                    border: 'none',
                  },
                  '& .MuiSlider-thumb': {
                    width: 12,
                    height: 12,
                    backgroundColor: config.colors.primary,
                    '&:before': {
                      boxShadow: '0 4px 8px rgba(0,0,0,0.4)',
                    },
                  },
                  '& .MuiSlider-rail': {
                    backgroundColor: 'rgba(255,255,255,0.3)',
                  },
                }}
              />
            </ProgressContainer>
            
            <ControlsRow>
              <Tooltip title={isPlaying ? 'Pause' : 'Play'}>
                <IconButton onClick={togglePlay} sx={{ color: 'white' }}>
                  {isPlaying ? <Pause /> : <PlayArrow />}
                </IconButton>
              </Tooltip>
              
              <Tooltip title="Replay 10s">
                <IconButton onClick={() => skip(-10)} sx={{ color: 'white' }}>
                  <Replay10 />
                </IconButton>
              </Tooltip>
              
              <Tooltip title="Forward 10s">
                <IconButton onClick={() => skip(10)} sx={{ color: 'white' }}>
                  <Forward10 />
                </IconButton>
              </Tooltip>
              
              <VolumeContainer>
                <Tooltip title={isMuted ? 'Unmute' : 'Mute'}>
                  <IconButton onClick={toggleMute} sx={{ color: 'white' }}>
                    {isMuted ? <VolumeOff /> : <VolumeUp />}
                  </IconButton>
                </Tooltip>
                <Slider
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  min={0}
                  max={1}
                  step={0.1}
                  sx={{
                    width: 80,
                    color: config.colors.primary,
                  }}
                />
              </VolumeContainer>
              
              <TimeDisplay>
                {formatTime(currentTime)} / {formatTime(duration)}
              </TimeDisplay>
              
              <Box sx={{ flexGrow: 1 }} />
              
              {sources.length > 1 && (
                <SourceSelector size="small">
                  <Select
                    value={currentSourceIndex}
                    onChange={(e) => changeSource(Number(e.target.value))}
                    sx={{ color: 'white' }}
                  >
                    {sources.map((source, index) => (
                      <MenuItem key={index} value={index}>
                        {source.name} ({source.quality})
                      </MenuItem>
                    ))}
                  </Select>
                </SourceSelector>
              )}
              
              <Tooltip title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}>
                <IconButton onClick={toggleFullscreen} sx={{ color: 'white' }}>
                  {isFullscreen ? <FullscreenExit /> : <Fullscreen />}
                </IconButton>
              </Tooltip>
            </ControlsRow>
          </ControlsOverlay>
        </Fade>
      )}
    </PlayerContainer>
  );
}