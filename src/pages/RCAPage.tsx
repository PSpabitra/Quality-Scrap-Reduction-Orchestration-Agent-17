import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api, { errMsg } from "../services/api";
import RiskBadge from "../components/RiskBadge";
import toast from "react-hot-toast";

export default function RCAPage() {
  const [params] = useSearchParams();
  const [results, setResults] = useState<any[]>([]);
  const [sel, setSel] = useState<number | null>(params.get("result") ? Number(params.get("result")) : null);
  const [rca, setRca] = useState<any>(null);
  const [busy, setBusy] = useState(false);
  const [actBusy, setActBusy] = useState<number | null>(null);

  useEffect(() => {
    api.get("/analysis/results", { params: { limit: 50 } }).then(r => setResults(r.data)).catch(e => toast.error(errMsg(e)));
  }, []);

  useEffect(() => {
    if (sel == null) { setRca(null); return; }
    api.get(`/analysis/results/${sel}/rca`).then(r => setRca(r.data)).catch(() => setRca(null));
  }, [sel]);

  const generate = async (regen = false) => {
    if (sel == null) return;
    setBusy(true);
    try {
      const r = await api.post(`/analysis/${sel}/${regen ? "regenerate-rca" : "generate-rca"}`);
      setRca(r.data); toast.success(regen ? "RCA regenerated" : "RCA generated");
    } catch (e) { toast.error(errMsg(e)); } finally { setBusy(false); }
  };

  const selResult = results.find(r => r.id === sel);

  const createAction = async (rec: any, idx: number) => {
    setActBusy(idx);
    try {
      const due = new Date(); due.setDate(due.getDate() + (rec.due_days || 7));
      const r = await api.post("/actions", {
        title: rec.title, description: rec.description, action_type: rec.action_type,
        assigned_team: rec.assigned_team, priority: rec.priority,
        due_date: due.toISOString().slice(0, 10),
        copq_impact: selResult?.copq || 0, related_rca_id: rca.id,
      });
      toast.success(r.data.approval_required
        ? `Action created — awaiting admin approval (COPQ ≥ threshold)`
        : `Action created${r.data.jira_key ? ` · Jira ${r.data.jira_key}` : ""}`);
    } catch (e) { toast.error(errMsg(e)); } finally { setActBusy(null); }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-display text-slate-900">AI Root Cause Analysis</h1>
      <div className="card p-4 flex flex-wrap gap-3 items-center bg-white shadow-sm">
        <select className="input flex-1 min-w-64" value={sel ?? ""} onChange={e => setSel(e.target.value ? Number(e.target.value) : null)}>
          <option value="">— Select a scrap driver —</option>
          {results.map(r => (
            <option key={r.id} value={r.id}>
              #{r.rank} [{r.risk_level}] {r.component_code} · {r.defect_code} · {r.machine} — COPQ ₹{Math.round(r.copq).toLocaleString()}
            </option>
          ))}
        </select>
        <button className="btn" disabled={sel == null || busy || !!rca} onClick={() => generate(false)}>
          {busy ? "Analyzing…" : "Generate RCA"}
        </button>
        <button className="btn-ghost" disabled={sel == null || busy || !rca} onClick={() => generate(true)}>Regenerate</button>
      </div>

      {selResult && (
        <div className="card p-4 flex flex-wrap gap-6 text-sm bg-white shadow-sm">
          <div><span className="label">Driver</span><div className="text-slate-900">{selResult.component_code} · {selResult.defect_code} · {selResult.machine}</div></div>
          <div><span className="label">Scrap %</span><div className="text-slate-700">{selResult.scrap_percent?.toFixed(2)}%</div></div>
          <div><span className="label">COPQ</span><div className="text-emerald-600 font-medium">₹{Math.round(selResult.copq).toLocaleString()}</div></div>
          <div><span className="label">Risk</span><div><RiskBadge level={selResult.risk_level} /></div></div>
        </div>
      )}

      {rca && (
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div className="card p-5 bg-white shadow-sm">
              <div className="label mb-1">AI Summary</div>
              <p className="text-slate-700 text-sm leading-relaxed">{rca.ai_summary}</p>
              <div className="mt-3 text-xs text-slate-500">Confidence: <span className="text-cyan-600">{(rca.confidence_score * 100).toFixed(0)}%</span>{rca.confidence_score <= 0.2 && <span className="ml-2 text-amber-500">(low confidence / fallback)</span>}</div>
            </div>
            <div className="card p-5 bg-white shadow-sm">
              <div className="label mb-1">Root Cause</div>
              <p className="text-slate-700 text-sm leading-relaxed">{rca.ai_root_cause}</p>
            </div>
            <div className="card p-5 bg-white shadow-sm">
              <div className="label mb-1">Recommended Solution</div>
              <p className="text-slate-700 text-sm leading-relaxed">{rca.ai_solution}</p>
            </div>
            <div className="card p-5 bg-white shadow-sm">
              <div className="label mb-2">Evidence</div>
              <ul className="space-y-2">
                {rca.evidence?.map((e: string, i: number) => (
                  <li key={i} className="text-sm text-slate-600 pl-3 border-l-2 border-cyan-500/40">{e}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="card p-5 h-fit bg-white shadow-sm">
            <div className="label mb-3">Recommended Actions</div>
            <div className="space-y-3">
              {rca.recommended_actions?.map((a: any, i: number) => (
                <div key={i} className="border border-edge rounded-lg p-4 space-y-2 bg-slate-50">
                  <div className="flex items-start justify-between gap-3">
                    <div className="text-slate-900 font-medium text-sm">{a.title}</div>
                    <span className="text-xs px-2 py-0.5 rounded bg-cyan-100 text-cyan-700">{a.priority}</span>
                  </div>
                  <p className="text-xs text-slate-600">{a.description}</p>
                  <div className="text-xs text-slate-500">{a.action_type} · {a.assigned_team} · due in {a.due_days}d</div>
                  <button className="btn text-xs" disabled={actBusy === i} onClick={() => createAction(a, i)}>
                    {actBusy === i ? "Creating…" : "Create Action / Jira Ticket"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {!rca && sel != null && <div className="card p-6 text-slate-500 text-sm bg-white shadow-sm">No RCA yet for this driver — click Generate RCA.</div>}
    </div>
  );
}
