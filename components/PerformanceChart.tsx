'use client';

import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface Session {
  id: number;
  mode: string;
  net_pnl: number;
  total_trades: number;
  win_rate?: number;
  profit_factor: number;
  sharpe_ratio: number;
}

export function PerformanceChart({ sessions }: { sessions: Session[] }) {
  const chartData = sessions
    .slice()
    .reverse()
    .map((s) => ({
      id: `#${s.id}`,
      mode: s.mode.toUpperCase(),
      pnl: parseFloat(s.net_pnl.toFixed(2)),
      trades: s.total_trades,
      pf: parseFloat(s.profit_factor.toFixed(2)),
    }));

  const modeStats = sessions.reduce(
    (acc, s) => {
      const key = s.mode;
      acc[key] = (acc[key] || 0) + s.net_pnl;
      return acc;
    },
    {} as Record<string, number>
  );

  const pieData = Object.entries(modeStats).map(([mode, pnl]) => ({
    name: mode.toUpperCase(),
    value: Math.abs(pnl),
    original: pnl,
  }));

  const COLORS = ['#06b6d4', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

  return (
    <div className="space-y-6">
      {/* PnL Over Time */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700">
        <h2 className="text-lg font-semibold text-cyan-400 mb-4 flex items-center gap-2">
          <div className="w-3 h-3 bg-cyan-400 rounded-full" />
          PnL Over Sessions
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="id" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1e293b',
                border: '1px solid #475569',
                borderRadius: '8px',
              }}
              cursor={{ stroke: '#06b6d4', strokeWidth: 2 }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="pnl"
              stroke="#06b6d4"
              dot={{ fill: '#06b6d4', r: 4 }}
              activeDot={{ r: 6 }}
              strokeWidth={2}
              name="PnL ($)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* Trades per Session */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700">
          <h3 className="text-sm font-semibold text-purple-400 mb-4">Trades per Session</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="id" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #475569',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="trades" fill="#8b5cf6" name="Trades" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Profit Factor */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700">
          <h3 className="text-sm font-semibold text-pink-400 mb-4">Profit Factor</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="id" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #475569',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="pf" fill="#ec4899" name="PF" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* PnL by Mode */}
      {pieData.length > 0 && (
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700">
          <h3 className="text-sm font-semibold text-emerald-400 mb-4">PnL Distribution by Mode</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, original }) => `${name}: $${original.toFixed(2)}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #475569',
                  borderRadius: '8px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
