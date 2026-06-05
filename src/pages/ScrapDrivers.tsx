import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api, { errMsg } from "../services/api";
import RiskBadge from "../components/RiskBadge";
import toast from "react-hot-toast";
import { Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Line, ComposedChart, CartesianGrid } from "recharts";

interface Driver {
  id: number; rank: number; plant: string; line: string; machine: string;
  component_code: string; defect_code: string; scrap_qty: number; scrap_percent: number;
  copq: number; pareto_percentage: number; risk_level: string;
  recommended_action: string; reason: string;
}

export default function ScrapDrivers() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [n, setN] = useState(10);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const r = await api.get("/dashboard/top-drivers", { params: { n } });
      setDrivers(r.data);
    } catch (e) { toast.error(errMsg(e)); } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, [n]);

  const chartData = drivers.map(d => ({
    name: `${d.component_code}/${d.defect_code}`, copq: d.copq, cum: d.pareto_percentage,
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-display text-slate-900">Scrap Driver Dashboard</h1>
        <select className="input w-40" value={n} onChange={e => setN(Number(e.target.value))}>
          <option value={5}>Top 5</option><option value={10}>Top 10</option>
          <option value={15}>Top 15</option><option value={25}>Top 25</option>
        </select>
      </div>

      <div className="card p-4">
        <div className="label mb-2">Pareto — COPQ with cumulative % (80/20 rule)</div>
        <ResponsiveContainer width="100%" height={320}>
          <ComposedChart data={chartData}>
            <CartesianGrid stroke="#f1f5f9" />
            <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 11 }} />
            <YAxis yAxisId="l" stroke="#64748b" />
            <YAxis yAxisId="r" orientation="right" domain={[0, 100]} stroke="#64748b" />
            <Tooltip contentStyle={{ background: "#ffffff", border: "1px solid #f1f5f9" }} />
            <Bar yAxisId="l" dataKey="copq" fill="#f59e0b" name="COPQ" />
            <Line yAxisId="r" dataKey="cum" stroke="#22d3ee" name="Cumulative %" dot={false} strokeWidth={2} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr>
            <th className="th">#</th><th className="th">Plant / Line / Machine</th><th className="th">Component</th>
            <th className="th">Defect</th><th className="th">Scrap Qty</th><th className="th">Scrap %</th>
            <th className="th">COPQ</th><th className="th">Cum %</th><th className="th">Risk</th>
            <th className="th">Reason</th><th className="th">Recommended Action</th><th className="th"></th>
          </tr></thead>
          <tbody>
            {drivers.map(d => (
              <tr key={d.id} className="hover:bg-edge/30">
                <td className="td">{d.rank}</td>
                <td className="td text-slate-700">{d.plant} / {d.line} / {d.machine}</td>
                <td className="td font-medium text-slate-900">{d.component_code}</td>
                <td className="td">{d.defect_code}</td>
                <td className="td">{d.scrap_qty?.toLocaleString()}</td>
                <td className="td">{d.scrap_percent?.toFixed(2)}%</td>
                <td className="td text-amber-600">₹{Math.round(d.copq).toLocaleString()}</td>
                <td className="td">{d.pareto_percentage?.toFixed(1)}%</td>
                <td className="td"><RiskBadge level={d.risk_level} /></td>
                <td className="td max-w-xs text-slate-600">{d.reason}</td>
                <td className="td max-w-xs text-cyan-600an-300">{d.recommended_action}</td>
                <td className="td"><Link className="btn-ghost text-xs" to={`/app/rca?result=${d.id}`}>RCA →</Link></td>
              </tr>
            ))}
            {!loading && drivers.length === 0 && <tr><td className="td text-slate-500" colSpan={12}>No analysis results. Upload CSV and run analysis first.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
