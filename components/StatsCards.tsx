'use client';

import { TrendingUp, TrendingDown, Zap, Target } from 'lucide-react';

interface Stats {
  total_trades: number;
  win_rate: number;
  total_pnl: number;
  paper_sessions: number;
  testnet_sessions: number;
  backtest_sessions: number;
}

export function StatsCards({ stats }: { stats: Stats }) {
  const cards = [
    {
      label: 'Total Trades',
      value: stats.total_trades,
      icon: Zap,
      gradient: 'from-purple-500 to-pink-500',
      textColor: 'text-purple-400',
    },
    {
      label: 'Win Rate',
      value: `${stats.win_rate.toFixed(1)}%`,
      icon: Target,
      gradient: 'from-green-500 to-emerald-500',
      textColor: 'text-green-400',
      isPositive: stats.win_rate >= 50,
    },
    {
      label: 'Total PnL',
      value: `$${stats.total_pnl.toFixed(2)}`,
      icon: stats.total_pnl >= 0 ? TrendingUp : TrendingDown,
      gradient: stats.total_pnl >= 0 ? 'from-green-500 to-teal-500' : 'from-red-500 to-orange-500',
      textColor: stats.total_pnl >= 0 ? 'text-green-400' : 'text-red-400',
      isPositive: stats.total_pnl >= 0,
    },
    {
      label: 'Sessions',
      value: stats.paper_sessions + stats.testnet_sessions + stats.backtest_sessions,
      icon: TrendingUp,
      gradient: 'from-blue-500 to-cyan-500',
      textColor: 'text-blue-400',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          <div
            key={i}
            className="group relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700 hover:border-slate-600 transition-all hover:shadow-xl hover:shadow-cyan-500/10 overflow-hidden"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-5 transition-opacity`} />

            <div className="relative flex items-start justify-between">
              <div className="flex-1">
                <p className="text-xs text-slate-400 mb-2 uppercase tracking-wider">{card.label}</p>
                <p className={`text-2xl font-bold ${card.textColor}`}>
                  {card.value}
                </p>
              </div>
              <div className={`p-3 bg-gradient-to-br ${card.gradient} rounded-lg shadow-lg`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
            </div>

            {card.isPositive !== undefined && (
              <div className="mt-4 flex items-center gap-2">
                <div className={`text-xs px-2 py-1 rounded-full ${
                  card.isPositive
                    ? 'bg-green-900/30 text-green-300'
                    : 'bg-red-900/30 text-red-300'
                }`}>
                  {card.isPositive ? '↑ Positive' : '↓ Negative'}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
