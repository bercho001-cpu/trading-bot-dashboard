'use client';

import { useEffect, useState } from 'react';
import { StatsCards } from './StatsCards';
import { PerformanceChart } from './PerformanceChart';
import { SessionsTable } from './SessionsTable';
import { TradesTable } from './TradesTable';
import { useStream } from '@/hooks/useStream';
import { Activity, TrendingUp } from 'lucide-react';

export function Dashboard() {
  const stream = useStream();
  const [loading, setLoading] = useState(true);

  const stats = stream.stats ? {
    total_trades: stream.stats.total_trades,
    win_rate: stream.stats.win_rate,
    total_pnl: stream.stats.total_pnl,
    paper_sessions: 0,
    testnet_sessions: 0,
    backtest_sessions: 0,
  } : null;

  const sessions = stream.sessions;
  const trades = stream.trades;
  const health = stream.connected ? { status: 'ok', version: '4.0.0' } : { status: 'disconnected', version: '4.0.0' };

  useEffect(() => {
    if (stream.connected) setLoading(false);
  }, [stream.connected]);
  const [time, setTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      setTime(new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl shadow-lg">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Trading Bot Analytics
            </h1>
            <p className="text-sm text-slate-400 mt-1">Real-time performance tracking</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-mono font-bold text-cyan-400">{time}</div>
          <div className={`text-xs px-3 py-1 rounded-full mt-2 ${
            health?.status === 'ok'
              ? 'bg-green-900/30 text-green-300'
              : 'bg-red-900/30 text-red-300'
          }`}>
            {health?.status === 'ok' ? '● Live' : health?.status ? '● Offline' : '● Unknown'}
          </div>

          {loading && (
            <div className="mt-3 text-xs text-slate-400">Connecting to stream...</div>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      {loading && (
        <div className="py-6 text-slate-400">Fetching latest data from API...</div>
      )}
      {!loading && stats && <StatsCards stats={stats} />}
      {!loading && !stats && (
        <div className="py-6 text-sm text-slate-400">No stats available — check API or click Retry.</div>
      )}

      {/* Charts & Tables Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Performance Chart */}
        <div className="lg:col-span-2">
          {sessions && sessions.length > 0 ? (
            <PerformanceChart sessions={sessions} />
          ) : (
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700 text-slate-400">
              No session data. Ensure the API at /api/sessions is reachable.
            </div>
          )}
        </div>

        {/* Latest Sessions */}
        <div>
          {sessions && sessions.length > 0 ? (
            <SessionsTable sessions={sessions.slice(0, 5)} />
          ) : (
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700 text-slate-400">
              No recent sessions to display.
            </div>
          )}
        </div>
      </div>

      {/* Trades Table */}
      <div>
        {trades && trades.length > 0 ? (
          <TradesTable trades={trades.slice(0, 20)} />
        ) : (
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700 text-slate-400">
            No recent trades to display.
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-slate-700 pt-6 mt-12 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          Connected via proxy.fernandosoria.site
        </div>
        <div className="text-xs text-slate-500">
          v4.0.0 • Last updated: {time}
        </div>
      </div>
    </div>
  );
}
