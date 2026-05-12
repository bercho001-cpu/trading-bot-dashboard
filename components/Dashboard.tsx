'use client';

import { useEffect, useState } from 'react';
import { StatsCards } from './StatsCards';
import { PerformanceChart } from './PerformanceChart';
import { SessionsTable } from './SessionsTable';
import { TradesTable } from './TradesTable';
import { useApi } from '@/hooks/useApi';
import { Activity, TrendingUp } from 'lucide-react';

export function Dashboard() {
  const { stats, sessions, trades, loading, health } = useApi();
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
            {health?.status === 'ok' ? '● Live' : '● Offline'}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && <StatsCards stats={stats} />}

      {/* Charts & Tables Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Performance Chart */}
        <div className="lg:col-span-2">
          {sessions && <PerformanceChart sessions={sessions} />}
        </div>

        {/* Latest Sessions */}
        <div>
          {sessions && <SessionsTable sessions={sessions.slice(0, 5)} />}
        </div>
      </div>

      {/* Trades Table */}
      <div>
        {trades && <TradesTable trades={trades.slice(0, 20)} />}
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
