import { NextRequest, NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

const STREAMING_SOURCES = {
  vidsrc: 'https://vidsrc.to/embed/movie/',
  superembed: 'https://multiembed.mov/directstream.php?video_id=',
  embedsu: 'https://embed.su/embed/movie/',
};

export async function GET(
  request: NextRequest,
  { params }: { params: { source: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const movieId = searchParams.get('id');
    const { source } = params;

    if (!movieId) {
      return NextResponse.json(
        { error: 'Movie ID is required' },
        { status: 400 }
      );
    }

    if (!STREAMING_SOURCES[source as keyof typeof STREAMING_SOURCES]) {
      return NextResponse.json(
        { error: 'Invalid streaming source' },
        { status: 400 }
      );
    }

    const baseUrl = STREAMING_SOURCES[source as keyof typeof STREAMING_SOURCES];
    let streamUrl = '';

    switch (source) {
      case 'vidsrc':
        streamUrl = `${baseUrl}${movieId}`;
        break;
      case 'superembed':
        streamUrl = `${baseUrl}${movieId}&tmdb=1`;
        break;
      case 'embedsu':
        streamUrl = `${baseUrl}${movieId}`;
        break;
      default:
        return NextResponse.json(
          { error: 'Unsupported source' },
          { status: 400 }
        );
    }

    // For security and CORS, we'll return the embed URL instead of scraping
    // In a production environment, you might want to implement proper scraping
    // with appropriate rate limiting and error handling

    const response = {
      source,
      movieId,
      embedUrl: streamUrl,
      type: 'embed',
      quality: 'auto',
      available: true,
    };

    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  } catch (error) {
    console.error(`Error fetching ${params.source} stream:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch stream' },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}