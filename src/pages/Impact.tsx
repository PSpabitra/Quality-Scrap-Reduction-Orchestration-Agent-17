import { useEffect, useState } from "react";
import api, { errMsg } from "../services/api";
import toast from "react-hot-toast";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from "recharts";

export default function Impact() {
  const [actions, setActions] = useState<any[]>([]);
  const [sel, setSel] = useState<number | "">("");
  const [days, setDays] = useState(14);
  const [busy, setBusy] = useState(false);
  const [impacts, setImpacts] = useState<any[]>([]);

  const load = async () => {
    try {
      const r = await api.get("/actions");
      setActions(r.data);
      const withImpact = await Promise.all(
        r.data.map((a: any) => api.get(`/actions/${a.id}`).then(x => x.data))
      );
      setImpacts(withImpact.filter(a => a.impact));
    } catch (e) { toast.error(errMsg(e)); }
  };
  useEffect(() => { load(); }, []);

  const measure = async () => {
    if (!sel) return toast.error("Select an action");
    setBusy(true);
    try {
      await api.post(`/actions/${sel}/measure-impact`, { window_days: days });
      toast.success("Impact measured"); load();
    } catch (e) { toast.error(errMsg(e)); } finally { setBusy(false); }
  };

  const scrapData = impacts.map(a => ({ name: a.title.slice(0, 24), Before: a.impact.before_scrap_percent, After: a.impact.after_scrap_percent }));
  const copqData = impacts.map(a => ({ name: a.title.slice(0, 24), Before: a.impact.before_copq, After: a.impact.after_copq }));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-display text-white">Impact Measurement</h1>
      <div className="card p-4 flex flex-wrap gap-3 items-center">
        <select className="input flex-1 min-w-64" value={sel} onChange={e => setSel(e.target.value ? Number(e.target.value) : "")}>
          <option value="">— Select action —</option>
          {actions.map(a => <option key={a.id} value={a.id}>#{a.id} {a.title} [{a.status}]</option>)}
        </select>
        <label className="text-sm text-slate-400">Window (days)</label>
        <input type="number" className="input w-24" value={days} min={1} onChange={e => setDays(Number(e.target.value))} />
        <button className="btn" disabled={busy} onClick={measure}>{busy ? "Measuring…" : "Measure Before/After"}</button>
      </div>

      {impacts.length > 0 && (
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="card p-4">
            <div className="label mb-2">Scrap % — Before vs After</div>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={scrapData}>
                <CartesianGrid stroke="#1e2a44" />
                <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 10 }} />
                <YAxis stroke="#64748b" />
                <Tooltip contentStyle={{ background: "#111a2e", border: "1px solid #1e2a44" }} />
                <Legend />
                <Bar dataKey="Before" fill="#f43f5e" /><Bar dataKey="After" fill="#34d399" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="card p-4">
            <div className="label mb-2">COPQ — Before vs After</div>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={copqData}>
                <CartesianGrid stroke="#1e2a44" />
                <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 10 }} />
                <YAxis stroke="#64748b" />
                <Tooltip contentStyle={{ background: "#111a2e", border: "1px solid #1e2a44" }} />
                <Legend />
                <Bar dataKey="Before" fill="#f59e0b" /><Bar dataKey="After" fill="#22d3ee" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr><th className="th">Action</th><th className="th">Scrap % Before</th><th className="th">Scrap % After</th><th className="th">Δ</th><th className="th">COPQ Before</th><th className="th">COPQ After</th><th className="th">Savings</th></tr></thead>
          <tbody>
            {impacts.map(a => {
              const dS = a.impact.before_scrap_percent - a.impact.after_scrap_percent;
              const dC = a.impact.before_copq - a.impact.after_copq;
              return (
                <tr key={a.id} className="hover:bg-edge/30">
                  <td className="td text-white">{a.title}</td>
                  <td className="td">{a.impact.before_scrap_percent?.toFixed(2)}%</td>
                  <td className="td">{a.impact.after_scrap_percent?.toFixed(2)}%</td>
                  <td className={`td ${dS >= 0 ? "text-emerald-300" : "text-rose-300"}`}>{dS >= 0 ? "▼" : "▲"} {Math.abs(dS).toFixed(2)}pp</td>
                  <td className="td">₹{Math.round(a.impact.before_copq).toLocaleString()}</td>
                  <td className="td">₹{Math.round(a.impact.after_copq).toLocaleString()}</td>
                  <td className={`td font-medium ${dC >= 0 ? "text-emerald-300" : "text-rose-300"}`}>₹{Math.round(dC).toLocaleString()}</td>
                </tr>
              );
            })}
            {impacts.length === 0 && <tr><td className="td text-slate-500" colSpan={7}>No impact measurements yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
