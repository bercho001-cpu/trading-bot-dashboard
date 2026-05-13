# Local Dashboard Setup with SSH Tunnel

## Simple Setup (Recommended)

Your dashboard connects directly to the bot API via SSH tunnel. This is secure and simple!

### Prerequisites
- Dashboard running: `npm run dev` on http://localhost:3000
- Bot running on GCP VM: us-east1-c zone
- SSH access to GCP VM configured

### Step 1: Create SSH Tunnel

Open a new terminal and run:

```bash
# This forwards localhost:8080 to your GCP bot API
gcloud compute ssh trading-bot \
  --zone=us-east1-c \
  --tunnel-through-iap \
  -- -N -L 8080:localhost:8080
```

This creates a secure tunnel that maps:
- Your local `localhost:8080` → GCP Bot API `localhost:8080`

**Keep this terminal open** while using the dashboard.

### Step 2: Run Dashboard

In another terminal:

```bash
cd ~/Documents/Dev/trading-bot-dashboard
npm run dev
```

Visit: http://localhost:3000

### Step 3: Dashboard Fetches Data

Dashboard will:
- Make requests to `http://localhost:8080/api/*`
- Which tunnels to GCP bot via SSH
- Returns real-time analytics

## Architecture

```
Browser (localhost:3000)
    ↓
Dashboard (Next.js)
    ↓
Tunnel (SSH)
    ↓
GCP Bot API (localhost:8080)
    ↓
Supabase Database
```

## Environment Variables

Already configured in `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_API_KEY=52cce22cf7617171c180afcc2fb672f693f9b7cce51c3cc0b1659a8bab690850
```

No changes needed!

## Usage

1. **Terminal 1** - SSH tunnel (keep running):
```bash
gcloud compute ssh trading-bot \
  --zone=us-east1-c \
  --tunnel-through-iap \
  -- -N -L 8080:localhost:8080
```

2. **Terminal 2** - Dashboard:
```bash
cd ~/Documents/Dev/trading-bot-dashboard
npm run dev
```

3. **Browser** - Access dashboard:
```
http://localhost:3000
```

## Security

✅ SSH tunneled connection (encrypted)
✅ API key authentication 
✅ Bot never exposed to internet
✅ All data stays on your network

## Troubleshooting

### Dashboard shows "Failed to fetch"
- Check SSH tunnel is running (Terminal 1)
- Check bot is running: `gcloud compute ssh trading-bot --zone=us-east1-c --command='curl http://localhost:8080/api/health'`

### Connection timeout
- Verify SSH tunnel: `netstat -an | grep 8080` (should show LISTEN)
- Check GCP firewall rules allow internal traffic

### API key error
- Verify .env.local has correct key
- Restart `npm run dev`

## Alternative: Without SSH Tunnel

If SSH tunnel doesn't work, you can:

1. **Connect directly from your machine**:
   - Enable firewall rule on GCP VM to allow port 8080
   - Update .env.local to use GCP VM IP: `NEXT_PUBLIC_API_URL=http://35.196.16.129:8080`
   - ⚠️ Less secure (exposes bot API publicly)

2. **Use ngrok**:
   ```bash
   ngrok http 8080  # On GCP VM
   # Use generated URL in dashboard .env.local
   ```

## That's It! 🚀

Your dashboard now connects securely to your trading bot and shows real-time analytics!
