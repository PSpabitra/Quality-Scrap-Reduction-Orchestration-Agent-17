import { useEffect, useState } from "react";
import api, { errMsg } from "../services/api";
import toast from "react-hot-toast";

export default function Reports() {
  const [reports, setReports] = useState<any[]>([]);
  const [busy, setBusy] = useState<string | null>(null);

  const load = async () => {
    try { const r = await api.get("/reports"); setReports(r.data); } catch (e) { toast.error(errMsg(e)); }
  };
  useEffect(() => { load(); }, []);

  const generate = async (period: "weekly" | "monthly") => {
    setBusy(period);
    try {
      await api.post("/reports/generate", { period });
      toast.success(`${period} report generated`); load();
    } catch (e) { toast.error(errMsg(e)); } finally { setBusy(null); }
  };

  const download = async (r: any) => {
    try {
      const res = await api.get(`/reports/${r.id}/download`, { responseType: "blob" });
      const url = URL.createObjectURL(res.data);
      const a = document.createElement("a");
      a.href = url; a.download = r.filename; a.click();
      URL.revokeObjectURL(url);
    } catch (e) { toast.error(errMsg(e)); }
  };

  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="text-2xl font-display text-slate-900">Reports</h1>
      <div className="card p-5 flex gap-3">
        <button className="btn" disabled={busy === "weekly"} onClick={() => generate("weekly")}>{busy === "weekly" ? "Generating…" : "Generate Weekly Report"}</button>
        <button className="btn" disabled={busy === "monthly"} onClick={() => generate("monthly")}>{busy === "monthly" ? "Generating…" : "Generate Monthly Report"}</button>
      </div>
      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr><th className="th">Report</th><th className="th">Period</th><th className="th">Created</th><th className="th"></th></tr></thead>
          <tbody>
            {reports.map(r => (
              <tr key={r.id} className="hover:bg-edge/30">
                <td className="td text-slate-900">{r.filename}</td>
                <td className="td capitalize">{r.period}</td>
                <td className="td text-slate-600">{new Date(r.created_at).toLocaleString()}</td>
                <td className="td"><button className="btn-ghost text-xs" onClick={() => download(r)}>Download .docx</button></td>
              </tr>
            ))}
            {reports.length === 0 && <tr><td className="td text-slate-500" colSpan={4}>No reports generated yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
