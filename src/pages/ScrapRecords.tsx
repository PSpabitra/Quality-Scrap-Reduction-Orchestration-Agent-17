import { useEffect, useState } from "react";
import api, { errMsg } from "../services/api";
import toast from "react-hot-toast";

interface Rec { id: number; plant: string; line: string; machine: string; shift: string; operator: string;
  component_code: string; component_name: string; defect_code: string; defect_description: string;
  production_qty: number; scrap_qty: number; scrap_percent: number; unit_cost: number; copq: number;
  tooling_age_days: number; event_time: string; }

export default function ScrapRecords() {
  const [rows, setRows] = useState<Rec[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [f, setF] = useState({ plant: "", line: "", machine: "", shift: "", defect_code: "" });
  const size = 10;

  const load = async () => {
    try {
      const params: any = { skip: page * size, limit: size };
      Object.entries(f).forEach(([k, v]) => { if (v) params[k] = v; });
      const r = await api.get("/data/scrap-records", { params });
      setRows(r.data.items); setTotal(r.data.total);
    } catch (e) { toast.error(errMsg(e)); }
  };
  useEffect(() => { load(); }, [page]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-display text-slate-900">Scrap Records</h1>
      <div className="card p-4 grid grid-cols-2 md:grid-cols-6 gap-3">
        {(["plant", "line", "machine", "shift", "defect_code"] as const).map(k => (
          <input key={k} className="input" placeholder={k.replace("_", " ")} value={f[k]}
            onChange={e => setF({ ...f, [k]: e.target.value })} />
        ))}
        <button className="btn" onClick={() => { setPage(0); load(); }}>Filter</button>
      </div>
      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr>{["Plant","Line","Machine","Shift","Component","Defect","Prod Qty","Scrap","Scrap %","COPQ","Tooling Age","Time"].map(h => <th key={h} className="th">{h}</th>)}</tr></thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.id} className="hover:bg-edge/30">
                <td className="td">{r.plant}</td><td className="td">{r.line}</td><td className="td">{r.machine}</td>
                <td className="td">{r.shift}</td>
                <td className="td text-slate-900">{r.component_name} <span className="text-slate-500">({r.component_code})</span></td>
                <td className="td">{r.defect_code} — {r.defect_description}</td>
                <td className="td">{r.production_qty}</td><td className="td text-rose-700">{r.scrap_qty}</td>
                <td className="td">{r.scrap_percent.toFixed(2)}%</td>
                <td className="td text-amber-600">₹{r.copq.toLocaleString()}</td>
                <td className="td">{r.tooling_age_days}d</td>
                <td className="td text-slate-600">{new Date(r.event_time).toLocaleString()}</td>
              </tr>
            ))}
            {rows.length === 0 && <tr><td className="td text-slate-500" colSpan={12}>No records.</td></tr>}
          </tbody>
        </table>
      </div>
      <div className="flex items-center gap-3 text-sm text-slate-600">
        <button className="btn-ghost" disabled={page === 0} onClick={() => setPage(p => p - 1)}>← Prev</button>
        <span>Page {page + 1} of {Math.max(1, Math.ceil(total / size))} ({total} records)</span>
        <button className="btn-ghost" disabled={(page + 1) * size >= total} onClick={() => setPage(p => p + 1)}>Next →</button>
      </div>
    </div>
  );
}
