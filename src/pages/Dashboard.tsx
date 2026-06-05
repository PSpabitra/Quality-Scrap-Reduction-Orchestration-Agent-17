import { useEffect, useState } from 'react'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis,
         Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts'
import { api } from '../services/api'
import Stat from '../components/Stat'
import RiskBadge from '../components/RiskBadge'

const COLORS = ['#fbbf24', '#22d3ee', '#a78bfa', '#34d399', '#f87171', '#fb923c', '#94a3b8']
const tt = { contentStyle: { background: '#ffffff', border: '1px solid #f1f5f9' } }

export default function Dashboard() {
  const [s, setS] = useState<any>(null)
  const [scrapTrend, setScrapTrend] = useState<any[]>([])
  const [copqTrend, setCopqTrend] = useState<any[]>([])

  useEffect(() => {
    api.get('/dashboard/summary').then(r => setS(r.data))
    api.get('/dashboard/scrap-trend').then(r => setScrapTrend(r.data))
    api.get('/dashboard/copq-trend').then(r => setCopqTrend(r.data))
  }, [])

  if (!s) return <div className="text-slate-500 font-mono">Loading dashboard…</div>

  return (
    <div className="space-y-6">
      <h1 className="font-display text-xl text-slate-900">PLANT QUALITY DASHBOARD</h1>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Stat label="Total Scrap Qty" value={s.total_scrap_qty.toLocaleString()} />
        <Stat label="Scrap %" value={`${s.scrap_percent}%`} accent="text-red-600" />
        <Stat label="Total COPQ" value={s.total_copq.toLocaleString()} accent="text-cyan-600" />
        <Stat label="Open Actions" value={s.open_actions} accent="text-orange-600" />
        <Stat label="Closed Actions" value={s.closed_actions} accent="text-emerald-600" />
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <div className="card">
          <div className="label">Scrap Trend</div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={scrapTrend}>
              <CartesianGrid stroke="#f1f5f9" />
              <XAxis dataKey="date" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} />
              <Tooltip {...tt} />
              <Line dataKey="scrap_qty" stroke="#fbbf24" dot={false} name="Scrap qty" />
              <Line dataKey="scrap_percent" stroke="#f87171" dot={false} name="Scrap %" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="card">
          <div className="label">COPQ Trend</div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={copqTrend}>
              <CartesianGrid stroke="#f1f5f9" />
              <XAxis dataKey="date" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} />
              <Tooltip {...tt} />
              <Line dataKey="copq" stroke="#22d3ee" dot={false} name="COPQ" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        {[['Machine-wise Scrap', s.machine_scrap], ['Line-wise Scrap', s.line_scrap],
          ['Shift-wise Scrap', s.shift_scrap]].map(([title, data]: any) => (
          <div className="card" key={title}>
            <div className="label">{title}</div>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={data.slice(0, 8)}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={10} />
                <YAxis stroke="#64748b" fontSize={10} />
                <Tooltip {...tt} />
                <Bar dataKey="copq" fill="#fbbf24" name="COPQ" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <div className="card">
          <div className="label">Defect Code Distribution (COPQ)</div>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={s.defect_distribution.slice(0, 7)} dataKey="copq" nameKey="name"
                outerRadius={80} label={(e: any) => e.name}>
                {s.defect_distribution.slice(0, 7).map((_: any, i: number) =>
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip {...tt} /><Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="card">
          <div className="label">Top 5 Scrap Drivers</div>
          <table className="w-full mt-2">
            <thead><tr>
              <th className="th">#</th><th className="th">Component</th><th className="th">Defect</th>
              <th className="th">Machine</th><th className="th">COPQ</th><th className="th">Risk</th>
            </tr></thead>
            <tbody>
              {s.top_drivers.map((t: any) => (
                <tr key={t.rank}>
                  <td className="td font-mono">{t.rank}</td>
                  <td className="td">{t.component_code}</td>
                  <td className="td">{t.defect_code}</td>
                  <td className="td">{t.machine}</td>
                  <td className="td font-mono text-cyan-600">{Number(t.copq).toLocaleString()}</td>
                  <td className="td"><RiskBadge level={t.risk_level} /></td>
                </tr>
              ))}
              {!s.top_drivers.length && <tr><td className="td text-slate-500" colSpan={6}>
                Run scrap analysis to populate drivers.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
