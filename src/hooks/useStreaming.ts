'use client';

import { useQuery } from '@tanstack/react-query';
import { streamingAPI, StreamingSource } from '@/lib/api';

// Hook for getting streaming sources
export function useStreamingSources(
  movieId: number, 
  title: string, 
  year?: number, 
  enabled: boolean = true
) {
  return useQuery({
    queryKey: ['streaming', 'sources', movieId, title, year],
    queryFn: () => streamingAPI.getStreamingSources(movieId, title, year),
    enabled: enabled && movieId > 0 && title.length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
}

// Hook for proxy requests
export function useProxyRequest(url: string, enabled: boolean = true) {
  return useQuery({
    queryKey: ['streaming', 'proxy', url],
    queryFn: () => streamingAPI.proxyRequest(url),
    enabled: enabled && url.length > 0,
    staleTime: 1 * 60 * 1000, // 1 minute
    retry: 1,
  });
}