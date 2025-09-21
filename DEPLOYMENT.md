# Deployment Guide

## Deploy to Vercel

### Prerequisites
1. Get a TMDB API key from [TMDB](https://www.themoviedb.org/settings/api)
2. Have a GitHub account
3. Have a Vercel account

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### Step 2: Deploy to Vercel

1. **Import Project**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository

2. **Configure Environment Variables**
   In the Vercel project settings, add these environment variables:
   
   **Required:**
   - `NEXT_PUBLIC_TMDB_API_KEY` = Your TMDB API key
   
   **Optional:**
   - `NEXT_PUBLIC_APP_NAME` = Your app name (default: "LX Movie App")
   - `NEXT_PUBLIC_APP_URL` = Your app URL (will be auto-set by Vercel)

3. **Deploy**
   - Click "Deploy"
   - Wait for the build to complete

### Step 3: Verify Deployment

1. **Check Build Logs**
   - Ensure no errors in the build process
   - Verify environment variables are loaded

2. **Test Functionality**
   - Visit your deployed app
   - Test movie search
   - Test video playback
   - Check responsive design

### Common Issues

#### Environment Variable Error
**Error:** `Environment Variable "NEXT_PUBLIC_TMDB_API_KEY" references Secret "tmdb_api_key", which does not exist.`

**Solution:** 
- Don't use the `@` prefix in Vercel environment variables
- Add `NEXT_PUBLIC_TMDB_API_KEY` directly as an environment variable, not a secret
- The value should be your actual TMDB API key

#### TMDB API Errors
**Error:** `TMDB API key not configured`

**Solution:**
- Verify your API key is correct
- Ensure the environment variable name is exactly `NEXT_PUBLIC_TMDB_API_KEY`
- Check that the API key has the correct permissions

#### CORS Errors
**Error:** Streaming sources not loading

**Solution:**
- The app uses proxy routes to handle CORS
- Ensure the API routes are deployed correctly
- Check browser console for specific errors

### Performance Optimization

1. **Enable Analytics** (Optional)
   - Add `NEXT_PUBLIC_GA_TRACKING_ID` for Google Analytics
   - Add `NEXT_PUBLIC_HOTJAR_ID` for Hotjar

2. **Error Tracking** (Optional)
   - Add `NEXT_PUBLIC_SENTRY_DSN` for error tracking

3. **Custom Domain**
   - Add your custom domain in Vercel settings
   - Update `NEXT_PUBLIC_APP_URL` to match your domain

### Build Configuration

The project is configured with:
- **Framework**: Next.js (auto-detected)
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Node.js Version**: 18.x

### Environment Variables Reference

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `NEXT_PUBLIC_TMDB_API_KEY` | TMDB API key | Yes | `abc123...` |
| `NEXT_PUBLIC_APP_NAME` | App display name | No | `My Movie App` |
| `NEXT_PUBLIC_APP_URL` | App URL | No | `https://my-app.vercel.app` |
| `NEXT_PUBLIC_ENABLE_SEARCH` | Enable search | No | `true` |
| `NEXT_PUBLIC_ENABLE_FAVORITES` | Enable favorites | No | `true` |
| `NEXT_PUBLIC_ENABLE_WATCHLIST` | Enable watchlist | No | `true` |

### Support

If you encounter issues:
1. Check the [Vercel documentation](https://vercel.com/docs)
2. Review the build logs in Vercel dashboard
3. Test locally with `npm run build && npm start`
4. Check the browser console for client-side errors