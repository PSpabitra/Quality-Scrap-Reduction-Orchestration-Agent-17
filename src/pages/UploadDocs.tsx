import { useEffect, useState } from "react";
import api, { errMsg } from "../services/api";
import toast from "react-hot-toast";

export default function UploadDocs() {
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [docs, setDocs] = useState<any[]>([]);

  const load = async () => {
    try { const r = await api.get("/documents"); setDocs(r.data); } catch (e) { toast.error(errMsg(e)); }
  };
  useEffect(() => { load(); }, []);

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
      <h1 className="text-2xl font-display text-white">Quality Documents</h1>
      <div className="card p-6 space-y-4">
        <div className="label">Upload SOPs, CAPA reports, audit docs (PDF / DOCX / TXT / CSV)</div>
        <input type="file" accept=".pdf,.docx,.txt,.csv" className="input" onChange={e => setFile(e.target.files?.[0] || null)} />
        <button className="btn" disabled={busy} onClick={upload}>{busy ? "Indexing…" : "Upload & Index"}</button>
      </div>
      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr><th className="th">File</th><th className="th">Type</th><th className="th">Chunks</th><th className="th">Uploaded</th></tr></thead>
          <tbody>
            {docs.map(d => (
              <tr key={d.id} className="hover:bg-edge/30">
                <td className="td text-white">{d.filename}</td><td className="td">{d.file_type}</td>
                <td className="td">{d.chunk_count}</td>
                <td className="td text-slate-400">{new Date(d.created_at).toLocaleString()}</td>
              </tr>
            ))}
            {docs.length === 0 && <tr><td className="td text-slate-500" colSpan={4}>No documents indexed yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
