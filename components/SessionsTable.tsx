'use client';

import { Trophy, TrendingUp, TrendingDown } from 'lucide-react';

interface Session {
  id: number;
  mode: string;
  symbol: string;
  total_trades: number;
  wins: number;
  losses: number;
  net_pnl: number;
  profit_factor: number;
  sharpe_ratio?: number;
  status: string;
}

export function SessionsTable({ sessions }: { sessions: Session[] }) {
  const getModeColor = (mode: string) => {
    switch (mode) {
      case 'paper':
        return 'bg-blue-900/30 text-blue-300';
      case 'testnet':
        return 'bg-purple-900/30 text-purple-300';
      case 'backtest':
        return 'bg-gray-900/30 text-gray-300';
      default:
        return 'bg-slate-900/30 text-slate-300';
    }
  };

  const getStatusColor = (status: string) => {
    if (status === 'completed') return 'bg-green-900/30 text-green-300';
    if (status === 'SESSION_TIMEOUT') return 'bg-yellow-900/30 text-yellow-300';
    return 'bg-gray-900/30 text-gray-300';
  };

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700">
      <h2 className="text-lg font-semibold text-cyan-400 mb-4 flex items-center gap-2">
        <Trophy className="w-5 h-5" />
        Latest Sessions
      </h2>

      <div className="space-y-3">
        {sessions.map((session) => (
          <div
            key={session.id}
            className="bg-slate-900/50 rounded-lg p-4 border border-slate-700 hover:border-cyan-500/30 transition-all hover:shadow-lg hover:shadow-cyan-500/10"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center">
                  <span className="text-xs font-bold text-cyan-400">#{session.id}</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${getModeColor(session.mode)}`}>
                      {session.mode.toUpperCase()}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(session.status)}`}>
                      {session.status}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className={`text-sm font-bold ${session.net_pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {session.net_pnl >= 0 ? '+' : ''} ${session.net_pnl.toFixed(2)}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="bg-slate-800/50 rounded px-2 py-1">
                <span className="text-slate-400">Trades:</span>
                <span className="ml-1 text-cyan-300 font-semibold">{session.total_trades}</span>
              </div>
              <div className="bg-slate-800/50 rounded px-2 py-1">
                <span className="text-slate-400">W/L:</span>
                <span className="ml-1 text-green-300 font-semibold">{session.wins}</span>
                <span className="text-red-300">/{session.losses}</span>
              </div>
              <div className="bg-slate-800/50 rounded px-2 py-1">
                <span className="text-slate-400">PF:</span>
                <span className="ml-1 text-purple-300 font-semibold">{session.profit_factor.toFixed(2)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
