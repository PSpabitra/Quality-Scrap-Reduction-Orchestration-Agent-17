import { useEffect, useState } from "react";
import api, { errMsg } from "../services/api";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function KnowledgeGraph() {
  const { isAdmin } = useAuth();
  const [html, setHtml] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [q, setQ] = useState({ component_code: "", defect_code: "", machine: "" });
  const [results, setResults] = useState<any[]>([]);

  const loadHtml = async () => {
    try {
      const r = await api.get("/admin/knowledge-graph/html", { responseType: "text" });
      setHtml(r.data);
    } catch { setHtml(null); }
  };
  useEffect(() => { loadHtml(); }, []);

  const rebuild = async () => {
    setBusy(true);
    try {
      const r = await api.post("/admin/knowledge-graph/build");
      toast.success(r.data.message || "Graph rebuilt"); loadHtml();
    } catch (e) { toast.error(errMsg(e)); } finally { setBusy(false); }
  };

  const search = async () => {
    const params: any = {};
    Object.entries(q).forEach(([k, v]) => { if (v.trim()) params[k] = v.trim(); });
    if (Object.keys(params).length === 0) return toast.error("Enter at least one filter");
    try {
      const r = await api.get("/admin/knowledge-graph/search", { params });
      setResults(r.data);
    } catch (e) { toast.error(errMsg(e)); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-display text-slate-900">Knowledge Graph</h1>
        {isAdmin && <button className="btn" disabled={busy} onClick={rebuild}>{busy ? "Building…" : "Rebuild Graph"}</button>}
      </div>

      <div className="card p-4 flex flex-wrap gap-2">
        <input className="input flex-1 min-w-40" placeholder="component_code (e.g. CMP-1001)" value={q.component_code}
          onChange={e => setQ({ ...q, component_code: e.target.value })} />
        <input className="input flex-1 min-w-40" placeholder="defect_code (e.g. D001)" value={q.defect_code}
          onChange={e => setQ({ ...q, defect_code: e.target.value })} />
        <input className="input flex-1 min-w-40" placeholder="machine (e.g. Machine-3)" value={q.machine}
          onChange={e => setQ({ ...q, machine: e.target.value })} onKeyDown={e => e.key === "Enter" && search()} />
        <button className="btn" onClick={search}>Find Similar Issues</button>
      </div>

      {results.length > 0 && (
        <div className="card p-4 space-y-2">
          <div className="label">Similar Past Issues</div>
          {results.map((r, i) => (
            <div key={i} className="text-sm border-l-2 border-cyan-500/40 pl-3 text-slate-700">
              <span className="text-slate-900">{r.defect || r.name || r.label}</span>
              {r.component && <span> · {r.component}</span>}
              {r.machine && <span> · {r.machine}</span>}
              {r.copq != null && <span className="text-amber-600"> · COPQ ₹{Math.round(r.copq).toLocaleString()}</span>}
              {r.rca_summary && <div className="text-xs text-slate-500 mt-1">{r.rca_summary}</div>}
            </div>
          ))}
        </div>
      )}

      <div className="card p-1" style={{ height: "70vh" }}>
        {html ? (
          <iframe title="kg" srcDoc={html} className="w-full h-full rounded bg-[#ffffff]" sandbox="allow-scripts" />
        ) : (
          <div className="flex items-center justify-center h-full text-slate-500 text-sm">
            Graph not built yet, or ArangoDB unreachable. Upload CSV + run analysis, or click Rebuild Graph.
          </div>
        )}
      </div>
    </div>
  );
}
