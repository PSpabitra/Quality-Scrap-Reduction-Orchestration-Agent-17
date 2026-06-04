import { useState } from "react";
import api, { errMsg } from "../services/api";
import toast from "react-hot-toast";

export default function UploadCSV() {
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [analysis, setAnalysis] = useState<any>(null);

  const upload = async () => {
    if (!file) return toast.error("Choose a CSV file first");
    const fd = new FormData(); fd.append("file", file);
    setBusy(true); setResult(null); setAnalysis(null);
    try {
      const r = await api.post("/data/upload-scrap-csv", fd, { headers: { "Content-Type": "multipart/form-data" } });
      setResult(r.data);
      toast.success(`Imported ${r.data.inserted} records`);
      const a = await api.post("/analysis/run");
      setAnalysis(a.data);
      toast.success("Analysis complete — knowledge graph rebuilt");
    } catch (e) { toast.error(errMsg(e)); } finally { setBusy(false); }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-display text-white">Upload Scrap CSV</h1>
      <div className="card p-6 space-y-4">
        <div className="label">Required columns</div>
        <code className="block text-xs text-cyan-300 bg-ink p-3 rounded border border-edge overflow-x-auto">
          plant, line, machine, shift, operator, component_code, component_name, defect_code, defect_description, production_qty, scrap_qty, unit_cost, tooling_age_days, event_time
        </code>
        <input type="file" accept=".csv" className="input" onChange={e => setFile(e.target.files?.[0] || null)} />
        <button className="btn" disabled={busy} onClick={upload}>{busy ? "Processing…" : "Upload & Analyze"}</button>
        {result && (
          <div className="text-sm text-slate-300 space-y-1 border-t border-edge pt-4">
            <div>✓ Inserted: <b className="text-white">{result.inserted}</b> rows</div>
            {result.skipped > 0 && <div className="text-amber-400">⚠ Skipped: {result.skipped} invalid rows</div>}
          </div>
        )}
        {analysis && (
          <div className="text-sm text-slate-300 space-y-1">
            <div>✓ Analysis results: <b className="text-white">{analysis.results_count}</b></div>
            <div>✓ Anomalies flagged: <b className="text-rose-300">{analysis.anomalies}</b></div>
            <div>✓ Knowledge graph: {analysis.kg_built ? <span className="text-emerald-400">rebuilt</span> : <span className="text-amber-400">skipped (ArangoDB unreachable)</span>}</div>
          </div>
        )}
      </div>
    </div>
  );
}
