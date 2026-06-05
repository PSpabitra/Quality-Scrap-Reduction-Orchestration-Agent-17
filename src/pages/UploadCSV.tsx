import { useState } from "react";
import api, { errMsg } from "../services/api";
import toast from "react-hot-toast";

export default function UploadCSV() {
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [analysis, setAnalysis] = useState<any>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      // Basic check for csv
      if (e.dataTransfer.files[0].name.toLowerCase().endsWith('.csv')) {
        setFile(e.dataTransfer.files[0]);
      } else {
        toast.error("Please drop a CSV file");
      }
    }
  };

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
      <h1 className="text-2xl font-display text-slate-900">Upload Scrap CSV</h1>
      <div className="card p-6 space-y-4">
        <div className="label">Required columns</div>
        <code className="block text-xs text-cyan-600an-300 bg-white p-3 rounded border border-slate-200 overflow-x-auto">
          plant, line, machine, shift, operator, component_code, component_name, defect_code, defect_description, production_qty, scrap_qty, unit_cost, tooling_age_days, event_time
        </code>

        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors hover:border-cyan-500/50 ${dragActive ? 'border-cyan-400 bg-cyan-950/20' : 'border-slate-200 bg-white/50'}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input type="file" accept=".csv" className="hidden" id="csv-upload" onChange={e => setFile(e.target.files?.[0] || null)} />
          <label htmlFor="csv-upload" className="cursor-pointer flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center mb-2 shadow-sm">
              <svg className="w-5 h-5 text-cyan-600an-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
            </div>
            <div className="text-slate-900 font-medium">Click to upload or drag and drop</div>
            <div className="text-xs text-slate-600">CSV files only</div>
          </label>
          {file && (
            <div className="mt-4 p-2.5 bg-white rounded border border-slate-200 text-sm text-cyan-600an-300 inline-flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              {file.name}
            </div>
          )}
        </div>

        <button className="btn w-full" disabled={busy} onClick={upload}>{busy ? "Processing…" : "Upload & Analyze"}</button>
        {result && (
          <div className="text-sm text-slate-700 space-y-1 border-t border-slate-200 pt-4">
            <div>✓ Inserted: <b className="text-slate-900">{result.inserted}</b> rows</div>
            {result.skipped > 0 && <div className="text-amber-600">⚠ Skipped: {result.skipped} invalid rows</div>}
          </div>
        )}
        {analysis && (
          <div className="text-sm text-slate-700 space-y-1">
            <div>✓ Analysis results: <b className="text-slate-900">{analysis.results_count}</b></div>
            <div>✓ Anomalies flagged: <b className="text-rose-700">{analysis.anomalies}</b></div>
            <div>✓ Knowledge graph: {analysis.kg_built ? <span className="text-emerald-600">rebuilt</span> : <span className="text-amber-600">skipped (ArangoDB unreachable)</span>}</div>
          </div>
        )}
      </div>
    </div>
  );
}
