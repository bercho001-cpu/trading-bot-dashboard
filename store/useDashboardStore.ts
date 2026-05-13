import create from 'zustand';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;
const BYPASS_TOKEN = process.env.NEXT_PUBLIC_VERCEL_BYPASS_TOKEN;

let pollingId: number | null = null;

interface Health {
  status: string;
  version?: string;
}

interface Stats {
  total_trades: number;
  win_rate: number;
  total_pnl: number;
  paper_sessions: number;
  testnet_sessions: number;
  backtest_sessions: number;
}

interface Session {
  id: number;
  mode: string;
  symbol: string;
  duration_secs?: number;
  total_trades: number;
  wins: number;
  losses: number;
  net_pnl: number;
  final_balance?: number;
  profit_factor: number;
  max_drawdown?: number;
  sharpe_ratio?: number;
  expectancy?: number;
  status: string;
  created_at?: string;
}

interface Trade {
  id: number;
  symbol: string;
  side: string;
  entry_price: string;
  exit_price: string;
  profit: string;
  exit_reason: string;
  created_at: string;
}

type DashboardState = {
  health: Health | null;
  stats: Stats | null;
  sessions: Session[];
  trades: Trade[];
  loading: boolean;
  connected: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  start: (intervalMs?: number) => void;
  stop: () => void;
};

async function safeFetch<T>(endpoint: string): Promise<T | null> {
  try {
    let url = `${API_URL}${endpoint}`;
    if (BYPASS_TOKEN) {
      url = `${url}${endpoint.includes('?') ? '&' : '?'}x-vercel-set-bypass-cookie=true&x-vercel-protection-bypass=${BYPASS_TOKEN}`;
    }

    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (API_KEY) headers['Authorization'] = `Bearer ${API_KEY}`;

    const res = await fetch(url, { headers });
    if (!res.ok) {
      console.error('API error', res.status, res.statusText, url);
      return null;
    }
    return await res.json();
  } catch (err) {
    console.error('Fetch failed', err);
    return null;
  }
}

export const useDashboardStore = create<DashboardState>((set, get) => ({
  health: null,
  stats: null,
  sessions: [],
  trades: [],
  loading: true,
  connected: false,
  error: null,

  refetch: async () => {
    set({ loading: true, error: null });
    try {
      const [healthData, statsData, sessionsData, tradesData] = await Promise.all([
        safeFetch<Health>('/api/health'),
        safeFetch<Stats>('/api/stats'),
        safeFetch<Session[]>('/api/sessions?limit=100'),
        safeFetch<Trade[]>('/api/trades?limit=100'),
      ]);

      set({
        health: healthData,
        stats: statsData,
        sessions: sessionsData || [],
        trades: tradesData || [],
        loading: false,
      });
    } catch (err: any) {
      set({ error: String(err), loading: false });
    }
  },

  start: (intervalMs = 5000) => {
    // If SSE is supported, open EventSource for real-time updates
    try {
      if ((window as any).EventSource) {
        const es = new (window as any).EventSource(`${API_URL}/api/stream`);
        es.onopen = () => {
          set({ connected: true });
        };
        es.onmessage = (ev: MessageEvent) => {
          try {
            const payload = JSON.parse(ev.data);
            // payload expected: { type: 'stats'|'sessions'|'trades', data: ... }
            if (payload.type === 'stats') set({ stats: payload.data });
            else if (payload.type === 'sessions') set({ sessions: payload.data });
            else if (payload.type === 'trades') set({ trades: payload.data });
            else if (payload.type === 'health') set({ health: payload.data });
          } catch (err) {
            console.error('Invalid SSE payload', err);
          }
        };
        es.onerror = (err: any) => {
          console.warn('SSE error, falling back to polling', err);
          set({ connected: false });
          try {
            es.close();
          } catch (e) {}
        };

        // keep reference to close later via pollingId
        pollingId = (es as unknown as any);
        // also do an initial fetch to populate any missing data
        get().refetch();
        return;
      }
    } catch (err) {
      console.warn('SSE unavailable', err);
    }

    // fallback to polling
    if (pollingId) return;
    get().refetch();
    pollingId = window.setInterval(() => {
      get().refetch();
    }, intervalMs) as unknown as number;
  },

  stop: () => {
    if (pollingId) {
      try {
        // if pollingId is an EventSource, close it
        if ((pollingId as any).close) {
          (pollingId as any).close();
        } else {
          clearInterval(pollingId as number);
        }
      } catch (e) {
        console.warn('Error stopping polling/SSE', e);
      }
      pollingId = null;
      set({ connected: false });
    }
  },
}));

export default useDashboardStore;
