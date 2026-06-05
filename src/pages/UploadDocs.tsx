import { useEffect, useState } from "react";
import api, { errMsg } from "../services/api";
import toast from "react-hot-toast";

export default function UploadDocs() {
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [busy, setBusy] = useState(false);
  const [docs, setDocs] = useState<any[]>([]);

  const load = async () => {
    try { const r = await api.get("/documents"); setDocs(r.data); } catch (e) { toast.error(errMsg(e)); }
  };
  useEffect(() => { load(); }, []);

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
      const allowed = ['.pdf', '.docx', '.txt', '.csv'];
      const fileExt = '.' + e.dataTransfer.files[0].name.split('.').pop()?.toLowerCase();
      if (allowed.includes(fileExt)) {
        setFile(e.dataTransfer.files[0]);
      } else {
        toast.error("Please drop a valid document (PDF, DOCX, TXT, CSV)");
      }
    }
  };

  const upload = async () => {
    if (!file) return toast.error("Choose a file first");
    const fd = new FormData(); fd.append("file", file);
    setBusy(true);
    try {
      const r = await api.post("/documents/upload", fd, { headers: { "Content-Type": "multipart/form-data" } });
      toast.success(`Indexed ${r.data.chunks_indexed} chunks into vector DB`);
      setFile(null); load();
    } catch (e) { toast.error(errMsg(e)); } finally { setBusy(false); }
  };

  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="text-2xl font-display text-slate-900">Quality Documents</h1>
      <div className="card p-6 space-y-4">
        <div className="label">Upload SOPs, CAPA reports, audit docs (PDF / DOCX / TXT / CSV)</div>

        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors hover:border-cyan-500/50 ${dragActive ? 'border-cyan-400 bg-cyan-950/20' : 'border-slate-200 bg-white/50'}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input type="file" accept=".pdf,.docx,.txt,.csv" className="hidden" id="docs-upload" onChange={e => setFile(e.target.files?.[0] || null)} />
          <label htmlFor="docs-upload" className="cursor-pointer flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center mb-2 shadow-sm">
              <svg className="w-5 h-5 text-cyan-600an-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
            </div>
            <div className="text-slate-900 font-medium">Click to upload or drag and drop</div>
            <div className="text-xs text-slate-600">PDF, DOCX, TXT, or CSV</div>
          </label>
          {file && (
            <div className="mt-4 p-2.5 bg-white rounded border border-slate-200 text-sm text-cyan-600an-300 inline-flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              {file.name}
            </div>
          )}
        </div>

        <button className="btn w-full" disabled={busy} onClick={upload}>{busy ? "Indexing…" : "Upload & Index"}</button>
      </div>
      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr><th className="th">File</th><th className="th">Type</th><th className="th">Chunks</th><th className="th">Uploaded</th></tr></thead>
          <tbody>
            {docs.map(d => (
              <tr key={d.id} className="hover:bg-edge/30">
                <td className="td text-slate-900">{d.filename}</td><td className="td">{d.file_type}</td>
                <td className="td">{d.chunk_count}</td>
                <td className="td text-slate-600">{new Date(d.created_at).toLocaleString()}</td>
              </tr>
            ))}
            {docs.length === 0 && <tr><td className="td text-slate-500" colSpan={4}>No documents indexed yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
