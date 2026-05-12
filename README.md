# Trading Bot Analytics Dashboard

A beautiful, real-time dashboard for monitoring your Binance trading bot built with Next.js, TypeScript, and Recharts.

## Features

- 📊 Real-time performance charts and graphs
- 📈 Interactive PnL visualization
- 📋 Detailed trades and sessions tables
- 🎨 Modern dark theme with gradient UI
- 🚀 Auto-refreshing data every 5 seconds
- 🔐 API key authentication
- 📱 Fully responsive design
- ⚡ Built with Next.js 15 and Tailwind CSS

## Setup

### 1. Environment Variables

The `.env.local` is already configured with:
- API URL: Your Vercel proxy endpoint
- API Key: Your secure authentication token

### 2. Run Development Server

```bash
npm run dev
```

Visit http://localhost:3000

## Architecture

```
Dashboard (localhost:3000)
    ↓
Vercel Proxy (proxy.fernandosoria.site)
    ↓ (API Key authenticated)
    ↓
GCP VM Bot (localhost:8080, private)
    ↓
Database (Supabase)
```

**Security Model:**
- ✅ Bot only listens on localhost:8080 (not accessible from internet)
- ✅ Proxy requires valid API key (Vercel deployment protection)
- ✅ Dashboard fetches from secure proxy endpoint
- ✅ All communication encrypted over HTTPS
- ✅ Two-layer authentication (Vercel + API Key)

## Components

- **StatsCards**: Overall metrics (Total Trades, Win Rate, PnL, Sessions)
- **PerformanceChart**: PnL trends, trades/session, profit factors, mode distribution
- **SessionsTable**: Latest sessions with performance metrics
- **TradesTable**: Recent trades with entry/exit details

## Color Palette

- **Primary**: Cyan (#06b6d4) - Main highlights
- **Secondary**: Purple (#8b5cf6) - Charts, backgrounds
- **Success**: Green (#10b981) - Profits, winning trades
- **Danger**: Red (#ef4444) - Losses, warnings
- **Background**: Dark blue gradient with smooth animations

## API Endpoints Used

All requests include `Authorization: Bearer ${API_KEY}`

- `GET /api/health` - Bot status check
- `GET /api/stats` - Overall trading statistics
- `GET /api/sessions?limit=100` - Session history
- `GET /api/trades?limit=100` - Trade history
- Data refreshes every 5 seconds

## Deployment

### Local Development

```bash
npm run dev
```

### Production Build

```bash
npm run build
npm start
```

### Deploy to Vercel

```bash
vercel deploy --prod
```

Then set environment variables in Vercel dashboard.

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom animations
- **Charts**: Recharts (Line, Bar, Pie charts)
- **Icons**: Lucide React
- **HTTP**: Native Fetch API
- **Deployment**: Vercel (recommended)

## Features

### Real-time Monitoring
- Auto-refresh every 5 seconds
- Live status indicator
- Real-time PnL tracking

### Performance Analytics
- Win rate visualization
- Profit factor analysis
- Sharpe ratio display
- Max drawdown metrics

### Trade History
- Detailed trade table with entry/exit prices
- Exit reason categorization
- Sortable timestamps
- Color-coded PnL

### Sessions Overview
- Latest sessions from all modes (paper, testnet, backtest)
- Performance metrics per session
- Status indicators
- W/L ratio tracking

## Security Best Practices

- ✅ Never commit `.env.local` to git
- ✅ Keep API keys in environment variables only
- ✅ Rotate API keys every 3-6 months
- ✅ Use HTTPS for all communication
- ✅ Keep bot endpoint private (localhost only)
- ✅ Verify Vercel deployment protection is enabled

## Troubleshooting

### "Failed to fetch data"
- Check API URL is correct
- Verify API key in .env.local
- Ensure Vercel deployment protection is disabled for reading (or correct auth token provided)
- Check bot is running: `gcloud compute ssh trading-bot --zone=us-east1-c --command='curl http://localhost:8080/api/health'`

### Dashboard shows outdated data
- Data refreshes every 5 seconds
- Check browser console for fetch errors
- Verify network connectivity to proxy

### Charts not rendering
- Ensure data is being fetched (check Network tab)
- Try hard refresh (Ctrl+Shift+R)
- Check browser console for errors

## License

MIT
