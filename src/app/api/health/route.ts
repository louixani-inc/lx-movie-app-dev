import { NextResponse } from 'next/server';

export async function GET() {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    services: {
      tmdb: !!process.env.NEXT_PUBLIC_TMDB_API_KEY,
      streaming: true,
      proxy: true,
    },
    uptime: process.uptime(),
  };

  return NextResponse.json(health, {
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    },
  });
}