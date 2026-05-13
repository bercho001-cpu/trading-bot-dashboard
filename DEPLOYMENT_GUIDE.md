# Trading Bot Dashboard - Deployment Guide

## Architecture

```
┌──────────────────────┐
│  Your Local Machine  │
│                      │
│  npm run dev         │
│  localhost:3000      │──┐
│                      │  │
│  (for development)   │  │
└──────────────────────┘  │
                          │
                          ├─ HTTP (port 8080)
                          │
┌──────────────────────┐  │
│  Vercel             │  │
│  (Production)       │  │
│  trading-bot-       │  │
│  dashboard-...      │──┘
│  .vercel.app        │
└──────────────────────┘
         │
         ├─ HTTP (port 8080)
         │
┌──────────────────────┐
│  GCP VM              │
│  35.196.16.129       │
│                      │
│  Trading Bot API     │
│  localhost:8080      │
│  (Exposed on 0.0.0.0)│
│                      │
│  Firewall: Allow     │
│  - 192.168.1.39/32   │
│  - 64.29.17.195/32   │
│  - 216.198.79.195/32 │
└──────────────────────┘
```

## Configuration Files

### .env.local (Local Development)
```
NEXT_PUBLIC_API_URL=http://35.196.16.129:8080
NEXT_PUBLIC_API_KEY=52cce22cf7617171c180afcc2fb672f693f9b7cce51c3cc0b1659a8bab690850
```

### .env.production (Vercel Deployment)
Same as `.env.local` - automatically used by Vercel.

## Development Workflow

### Local Development

1. **Start Dashboard:**
```bash
cd ~/Documents/Dev/trading-bot-dashboard
npm run dev
```

2. **Access:**
```
http://localhost:3000
```

3. **Make Changes:**
- Edit components, add features
- Dashboard hot-reloads
- Test changes

4. **Commit & Push:**
```bash
git add .
git commit -m "Your message"
git push
```

5. **Auto-Deploy to Vercel:**
- Vercel automatically detects the push
- Builds and deploys new version
- Live in ~2 minutes

## Environment Variables

| Variable | Development | Production | Value |
|----------|-------------|-----------|-------|
| API_URL | 35.196.16.129:8080 | 35.196.16.129:8080 | GCP VM IP |
| API_KEY | Same | Same | Shared secret |

## Firewall Rules

GCP firewall allows HTTP to port 8080 from:

1. **Local IP**: `192.168.1.39/32`
   - Your development machine
   
2. **Vercel IPs**: 
   - `64.29.17.195/32`
   - `216.198.79.195/32`
   - Vercel edge locations

**Command to check:**
```bash
gcloud compute firewall-rules describe allow-dashboard-api
```

**Update if your IP changes:**
```bash
gcloud compute firewall-rules update allow-dashboard-api \
  --source-ranges=YOUR_NEW_IP/32,64.29.17.195/32,216.198.79.195/32
```

## CI/CD Flow

```
1. Local development
   ↓
2. npm run dev (test locally)
   ↓
3. git push to GitHub
   ↓
4. Vercel detects push
   ↓
5. Vercel builds project
   ↓
6. Vercel deploys to production
   ↓
7. Live at: https://trading-bot-dashboard-xxx.vercel.app
   ↓
8. Using your .env variables
   ↓
9. Fetches from http://35.196.16.129:8080
```

## Security Notes

✅ API Key required for all bot API requests
✅ Firewall restricts access to allowed IPs only
✅ Bot API doesn't expose sensitive data
✅ GET-only endpoints (read analytics)
✅ CORS enabled for Vercel origin
✅ No authentication on dashboard yet (to be added)

## Deployment Commands

### Build for Production
```bash
npm run build
```

### Deploy to Vercel (Manual)
```bash
vercel deploy --prod
```

### Push to trigger auto-deploy
```bash
git push
```

## Testing

### Local
```bash
npm run dev
# Open http://localhost:3000
# Should show live data from bot
```

### Production
```bash
# After git push, wait 2-3 minutes
# Visit deployed URL
# Should show same data as local
```

## Troubleshooting

### Dashboard shows "Failed to fetch"

1. **Check bot is running:**
```bash
gcloud compute ssh trading-bot --zone=us-east1-c --command='curl http://localhost:8080/api/health'
```

2. **Check firewall rule:**
```bash
gcloud compute firewall-rules list --filter="name:allow-dashboard-api"
```

3. **Check your IP hasn't changed:**
```bash
# Get current IP
hostname -I | awk '{print $1}'

# Update firewall if needed
gcloud compute firewall-rules update allow-dashboard-api \
  --source-ranges=YOUR_CURRENT_IP/32,64.29.17.195/32,216.198.79.195/32
```

4. **Check API key in .env:**
```bash
grep API_KEY .env.local
```

### Production deployment not showing data

1. **Check Vercel logs:**
```bash
vercel logs
```

2. **Verify environment variables in Vercel:**
- Go to https://vercel.com/dashboard/trading-bot-dashboard
- Settings → Environment Variables
- Check API_URL and API_KEY are set

3. **Check firewall allows Vercel IPs:**
```bash
# Get Vercel IP
dig trading-bot-dashboard-xxx.vercel.app

# Add to firewall if needed
```

## What to Know

- **No authentication yet**: Dashboard is public (authentication to be added)
- **API key is shared**: Same key for local and production
- **GCP free tier limits**: Stay within free tier usage
- **Vercel free tier limits**: 100 deployments/month, unlimited requests

## Next Steps

1. ✅ Development workflow set up
2. ✅ Auto-deploy via GitHub push configured
3. ⏳ Add authentication (later)
4. ⏳ Add rate limiting (later)
5. ⏳ Add Telegram notifications (later)

---

**Summary:** 
- Develop locally on `localhost:3000`
- Push to GitHub
- Vercel auto-deploys
- Both use same GCP bot API
- Firewall allows both IPs
