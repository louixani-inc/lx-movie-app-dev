# LX Movie App

A modern, responsive movie streaming application built with Next.js 15, TypeScript, and Material-UI. Features real movie data from TMDB API and streaming capabilities from multiple sources.

## 🚀 Features

- **Modern Tech Stack**: Next.js 15 with App Router, TypeScript, Material-UI v6
- **Movie Discovery**: Browse popular, trending, and search for movies using TMDB API
- **Streaming Integration**: Multiple streaming sources (VidSrc, SuperEmbed, EmbedSu)
- **Advanced Video Player**: HLS support with quality selection and full controls
- **Responsive Design**: Mobile-first approach with beautiful animations
- **Theming System**: Multiple theme variants with real-time customization
- **User Features**: Favorites, watchlist, and personalized recommendations
- **Advanced Branding**: Configurable app settings and theme customization
- **Error Handling**: Comprehensive error states and loading indicators
- **Performance**: Optimized with React Query, image optimization, and lazy loading

## 🛠️ Tech Stack

- **Framework**: Next.js 15.5.3 with App Router
- **Language**: TypeScript
- **Styling**: Material-UI v6 + Tailwind CSS
- **State Management**: Zustand + React Query
- **Video Player**: HLS.js for streaming
- **Animations**: Framer Motion
- **API**: TMDB (The Movie Database)
- **Deployment**: Vercel

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/louixani-inc/lx-movie-app.git
   cd lx-movie-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` and add your TMDB API key:
   ```env
   NEXT_PUBLIC_TMDB_API_KEY=your_tmdb_api_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔑 Getting TMDB API Key

1. Visit [TMDB](https://www.themoviedb.org/)
2. Create an account or sign in
3. Go to Settings > API
4. Request an API key
5. Copy the API key to your `.env.local` file

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Visit [Vercel](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables:
     - `NEXT_PUBLIC_TMDB_API_KEY`: Your TMDB API key
   - Deploy!

3. **Custom Domain (Optional)**
   - Add your custom domain in Vercel dashboard
   - Update `NEXT_PUBLIC_APP_URL` in environment variables

### Manual Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Start production server**
   ```bash
   npm start
   ```

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
├── components/             # Reusable UI components
│   ├── BrandingPanel.tsx   # Theme customization panel
│   ├── ErrorBoundary.tsx   # Error handling
│   ├── HeroSection.tsx     # Homepage hero
│   ├── Layout.tsx          # Page layouts
│   ├── LoadingStates.tsx   # Loading components
│   ├── MovieCard.tsx       # Movie display card
│   ├── MovieCarousel.tsx   # Horizontal movie slider
│   ├── MovieGrid.tsx       # Movie grid layout
│   ├── Navigation.tsx      # App navigation
│   ├── SearchBar.tsx       # Search functionality
│   └── VideoPlayer.tsx     # Video streaming player
├── hooks/                  # Custom React hooks
│   ├── useAsync.ts         # Async operation handling
│   ├── useDebounce.ts      # Input debouncing
│   ├── useMovies.ts        # Movie data fetching
│   └── useStreaming.ts     # Streaming sources
├── lib/                    # Utility libraries
│   ├── api.ts              # TMDB API integration
│   ├── branding.ts         # Theme configuration
│   └── theme.ts            # MUI theme setup
└── providers/              # React context providers
    └── ThemeProvider.tsx   # Theme management
```

## 🎨 Customization

### Themes
The app includes multiple built-in themes:
- Default (Blue)
- Dark Mode
- Ocean Blue
- Royal Purple
- Forest Green

Access the branding panel via the settings icon in the navigation to customize:
- Theme variants and colors
- App name and description
- Feature toggles
- Player settings

### Adding New Themes
1. Edit `src/lib/theme.ts`
2. Add new theme variant to `createAppTheme`
3. Update `src/components/BrandingPanel.tsx` theme options

### Custom Streaming Sources
1. Edit `src/lib/api.ts`
2. Add new source to `streamingApi` object
3. Update `src/hooks/useStreaming.ts`
4. Add source option to branding panel

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_TMDB_API_KEY` | TMDB API key for movie data | Yes |
| `NEXT_PUBLIC_APP_NAME` | Application name | No |
| `NEXT_PUBLIC_APP_URL` | Application URL | No |
| `NEXT_PUBLIC_ENABLE_*` | Feature flags | No |

### Feature Flags
Control app features via environment variables:
- `NEXT_PUBLIC_ENABLE_SEARCH`: Search functionality
- `NEXT_PUBLIC_ENABLE_FAVORITES`: Favorites system
- `NEXT_PUBLIC_ENABLE_WATCHLIST`: Watchlist feature
- `NEXT_PUBLIC_ENABLE_RECOMMENDATIONS`: Recommendations
- `NEXT_PUBLIC_ENABLE_COMMENTS`: Comments/reviews

## 🎬 Streaming Sources

The app supports multiple streaming sources:

1. **VidSrc**: Primary streaming source
2. **SuperEmbed**: Alternative source
3. **EmbedSu**: Backup source

Sources are automatically tried in order if one fails.

## 📱 Mobile Support

- Fully responsive design
- Touch-friendly interface
- Mobile-optimized video player
- Progressive Web App (PWA) ready

## 🔒 Security

- Content Security Policy headers
- XSS protection
- CORS configuration
- Environment variable validation
- Error boundary protection

## 🚀 Performance

- Image optimization with Next.js
- Lazy loading for components
- React Query for efficient data fetching
- Code splitting and tree shaking
- Optimized bundle size

## 🐛 Troubleshooting

### Common Issues

1. **TMDB API errors**
   - Verify API key is correct
   - Check API key permissions
   - Ensure rate limits aren't exceeded

2. **Streaming not working**
   - Check network connectivity
   - Try different streaming sources
   - Verify CORS settings

3. **Build errors**
   - Clear `.next` folder: `rm -rf .next`
   - Reinstall dependencies: `rm -rf node_modules && npm install`
   - Check TypeScript errors: `npm run type-check`

### Debug Mode
Enable debug logging by setting:
```env
NODE_ENV=development
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [TMDB](https://www.themoviedb.org/) for movie data
- [Material-UI](https://mui.com/) for UI components
- [Next.js](https://nextjs.org/) for the framework
- [Vercel](https://vercel.com/) for hosting

## 📞 Support

For support, email support@louixani.com or create an issue on GitHub.

---

**Built with ❤️ by Louixani Inc**
