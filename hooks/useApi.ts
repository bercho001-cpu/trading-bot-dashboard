'use client';

import { useState, useEffect } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;
const BYPASS_TOKEN = process.env.NEXT_PUBLIC_VERCEL_BYPASS_TOKEN;

interface Health {
  status: string;
  version: string;
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
  duration_secs: number;
  total_trades: number;
  wins: number;
  losses: number;
  net_pnl: number;
  final_balance: number;
  profit_factor: number;
  max_drawdown: number;
  sharpe_ratio: number;
  expectancy: number;
  status: string;
  created_at: string;
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

async function fetchFromApi<T>(endpoint: string): Promise<T | null> {
  try {
    let url = `${API_URL}${endpoint}`;

    if (BYPASS_TOKEN) {
      url = `${url}${endpoint.includes('?') ? '&' : '?'}x-vercel-set-bypass-cookie=true&x-vercel-protection-bypass=${BYPASS_TOKEN}`;
    }

    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (API_KEY) headers['Authorization'] = `Bearer ${API_KEY}`;

    const response = await fetch(url, { headers });

    if (!response.ok) {
      console.error(`API error: ${response.status} ${response.statusText} for ${url}`);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error(`Fetch error: ${error}`);
    return null;
  }
}

export function useApi() {
  const [health, setHealth] = useState<Health | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    const [healthData, statsData, sessionsData, tradesData] = await Promise.all([
      fetchFromApi<Health>('/api/health'),
      fetchFromApi<Stats>('/api/stats'),
      fetchFromApi<Session[]>('/api/sessions?limit=100'),
      fetchFromApi<Trade[]>('/api/trades?limit=100'),
    ]);

    setHealth(healthData);
    setStats(statsData);
    setSessions(sessionsData || []);
    setTrades(tradesData || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  return { health, stats, sessions, trades, loading, refetch: fetchData };
}
