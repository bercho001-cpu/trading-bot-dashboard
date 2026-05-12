'use client';

import { ArrowUpRight, ArrowDownLeft } from 'lucide-react';

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

export function TradesTable({ trades }: { trades: Trade[] }) {
  const formatPrice = (price: string) => {
    const num = parseFloat(price);
    return num.toFixed(4);
  };

  const formatProfit = (profit: string) => {
    const num = parseFloat(profit);
    return num.toFixed(4);
  };

  const isProfit = (profit: string) => parseFloat(profit) >= 0;

  const getExitColor = (reason: string) => {
    switch (reason) {
      case 'TAKE_PROFIT':
        return 'text-green-400';
      case 'STOP_LOSS':
        return 'text-red-400';
      case 'BREAK_EVEN':
        return 'text-yellow-400';
      case 'TRAILING_STOP':
        return 'text-orange-400';
      default:
        return 'text-slate-400';
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700 overflow-hidden">
      <h2 className="text-lg font-semibold text-cyan-400 mb-4">Recent Trades</h2>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="text-left py-3 px-4 text-slate-400 font-medium">ID</th>
              <th className="text-left py-3 px-4 text-slate-400 font-medium">Symbol</th>
              <th className="text-left py-3 px-4 text-slate-400 font-medium">Side</th>
              <th className="text-right py-3 px-4 text-slate-400 font-medium">Entry</th>
              <th className="text-right py-3 px-4 text-slate-400 font-medium">Exit</th>
              <th className="text-right py-3 px-4 text-slate-400 font-medium">PnL</th>
              <th className="text-left py-3 px-4 text-slate-400 font-medium">Exit Reason</th>
              <th className="text-left py-3 px-4 text-slate-400 font-medium">Time</th>
            </tr>
          </thead>
          <tbody>
            {trades.map((trade) => (
              <tr
                key={trade.id}
                className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors"
              >
                <td className="py-3 px-4">
                  <span className="text-cyan-400 font-semibold">#{trade.id}</span>
                </td>
                <td className="py-3 px-4">
                  <span className="text-slate-300 font-medium">{trade.symbol}</span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    {trade.side === 'BUY' ? (
                      <>
                        <ArrowUpRight className="w-4 h-4 text-green-400" />
                        <span className="text-green-400 font-semibold">BUY</span>
                      </>
                    ) : (
                      <>
                        <ArrowDownLeft className="w-4 h-4 text-red-400" />
                        <span className="text-red-400 font-semibold">SELL</span>
                      </>
                    )}
                  </div>
                </td>
                <td className="py-3 px-4 text-right text-slate-300">${formatPrice(trade.entry_price)}</td>
                <td className="py-3 px-4 text-right text-slate-300">${formatPrice(trade.exit_price)}</td>
                <td className={`py-3 px-4 text-right font-bold ${isProfit(trade.profit) ? 'text-green-400' : 'text-red-400'}`}>
                  {isProfit(trade.profit) ? '+' : ''} ${formatProfit(trade.profit)}
                </td>
                <td className={`py-3 px-4 font-medium text-xs ${getExitColor(trade.exit_reason)}`}>
                  {trade.exit_reason}
                </td>
                <td className="py-3 px-4 text-slate-400 text-xs">
                  {new Date(trade.created_at).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {trades.length === 0 && (
        <div className="py-12 text-center text-slate-400">
          No trades yet
        </div>
      )}
    </div>
  );
}
