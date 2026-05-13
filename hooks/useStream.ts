'use client';

import { useState, useEffect } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

interface Stats {
  total_trades: number;
  win_rate: number;
  total_pnl: number;
}

interface Session {
  ID: number;
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
  CreatedAt: string;
}

interface Trade {
  ID: number;
  symbol: string;
  side: string;
  entry_price: string;
  exit_price: string;
  profit: string;
  exit_reason: string;
  CreatedAt: string;
}

interface StreamData {
  stats: Stats | null;
  sessions: Session[];
  trades: Trade[];
  connected: boolean;
}

export function useStream() {
  const [data, setData] = useState<StreamData>({
    stats: null,
    sessions: [],
    trades: [],
    connected: false,
  });

  useEffect(() => {
    const eventSource = new EventSource(`${API_URL}/api/stream`);

    const handleMessage = (event: MessageEvent) => {
      try {
        const streamEvent = JSON.parse(event.data);

        setData((prev) => {
          const updated = { ...prev, connected: true };

          if (streamEvent.type === 'stats') {
            updated.stats = streamEvent.data;
          } else if (streamEvent.type === 'sessions') {
            updated.sessions = streamEvent.data || [];
          } else if (streamEvent.type === 'trades') {
            updated.trades = streamEvent.data || [];
          }

          return updated;
        });
      } catch (error) {
        console.error('Stream parse error:', error);
      }
    };

    const handleError = () => {
      setData((prev) => ({ ...prev, connected: false }));
      eventSource.close();
    };

    eventSource.addEventListener('message', handleMessage);
    eventSource.addEventListener('error', handleError);

    return () => {
      eventSource.close();
    };
  }, []);

  return data;
}
