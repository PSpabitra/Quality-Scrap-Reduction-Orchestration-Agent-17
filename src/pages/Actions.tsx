import { useEffect, useState } from "react";
import api, { errMsg } from "../services/api";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const STATUSES = ["Pending", "In Progress", "Closed", "Rejected", "Delayed"];
const statusColor: Record<string, string> = {
  Pending: "text-amber-300 bg-amber-500/10", "In Progress": "text-cyan-300 bg-cyan-500/10",
  Closed: "text-emerald-300 bg-emerald-500/10", Rejected: "text-rose-300 bg-rose-500/10",
  Delayed: "text-orange-300 bg-orange-500/10",
};

export default function Actions() {
  const { isAdmin } = useAuth();
  const [actions, setActions] = useState<any[]>([]);
  const [filter, setFilter] = useState("");
  const [sel, setSel] = useState<any>(null);
  const [comment, setComment] = useState("");

  const load = async () => {
    try {
      const r = await api.get("/actions", { params: filter ? { status: filter } : {} });
      setActions(r.data);
    } catch (e) { toast.error(errMsg(e)); }
  };
  useEffect(() => { load(); }, [filter]);

  const open = async (id: number) => {
    try { const r = await api.get(`/actions/${id}`); setSel(r.data); } catch (e) { toast.error(errMsg(e)); }
  };

  const setStatus = async (status: string) => {
    try {
      await api.put(`/actions/${sel.id}`, { status });
      toast.success(`Status → ${status}`); open(sel.id); load();
    } catch (e) { toast.error(errMsg(e)); }
  };

  const approve = async () => {
    try {
      const r = await api.post(`/actions/${sel.id}/approve`);
      toast.success(`Approved${r.data.jira_key ? ` · Jira ${r.data.jira_key}` : ""}`);
      open(sel.id); load();
    } catch (e) { toast.error(errMsg(e)); }
  };

  const addComment = async () => {
    if (!comment.trim()) return;
    try {
      await api.post(`/actions/${sel.id}/comments`, { comment });
      setComment(""); open(sel.id);
    } catch (e) { toast.error(errMsg(e)); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-display text-white">Action Orchestration</h1>
        <select className="input w-44" value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="">All statuses</option>
          {STATUSES.map(s => <option key={s}>{s}</option>)}
        </select>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr><th className="th">Title</th><th className="th">Type</th><th className="th">Priority</th><th className="th">Assigned To</th><th className="th">Status</th><th className="th">Jira</th><th className="th">Created At</th><th className="th">Due Date</th></tr></thead>
          <tbody>
            {actions.map(a => (
              <tr key={a.id} className={`hover:bg-edge/30 cursor-pointer ${sel?.id === a.id ? "bg-edge/40" : ""}`} onClick={() => open(a.id)}>
                <td className="td text-white">{a.title}{a.approval_required && !a.approved_at && <span className="ml-2 text-xs text-amber-400">⏳ approval</span>}</td>
                <td className="td">{a.action_type}</td>
                <td className="td">{a.priority}</td>
                <td className="td text-slate-300">{a.assigned_to || "—"}</td>
                <td className="td"><span className={`text-xs px-2 py-0.5 rounded ${statusColor[a.status] || ""}`}>{a.status}</span></td>
                <td className="td text-cyan-300">{a.jira_key || "—"}</td>
                <td className="td text-slate-400">{a.created_at ? new Date(a.created_at).toLocaleDateString() : "—"}</td>
                <td className="td text-slate-400">{a.due_date ? new Date(a.due_date).toLocaleDateString() : "—"}</td>

              </tr>
            ))}
            {actions.length === 0 && <tr><td className="td text-slate-500" colSpan={8}>No actions. Create from RCA recommendations.</td></tr>}
          </tbody>
        </table>
      </div>

      {sel && (
        <>
          <div className="fixed inset-0 bg-ink/50 backdrop-blur-sm z-40 transition-opacity" onClick={() => setSel(null)} />
          <div className="fixed inset-y-0 right-0 w-full max-w-md bg-panel border-l border-edge shadow-2xl z-50 flex flex-col transform transition-transform duration-300">
            <div className="flex items-center justify-between p-5 border-b border-edge">
              <h2 className="text-lg font-display text-white">Action Details</h2>
              <button className="text-slate-400 hover:text-white transition" onClick={() => setSel(null)}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="p-5 flex-1 overflow-y-auto space-y-6">
              <div>
                <div className="text-white font-medium">{sel.title}</div>
                <p className="text-sm text-slate-400 mt-1">{sel.description}</p>
                <div className="text-xs text-slate-500 mt-2">
                  {sel.action_type} · {sel.assigned_team} · {sel.priority}
                  {sel.assigned_to ? ` · assigned to ${sel.assigned_to}` : " · unassigned"}
                  {sel.jira_key && <span className="text-cyan-300"> · Jira {sel.jira_key}</span>}
                </div>
              </div>
              {sel.approval_required && !sel.approved_at && (
                <div className="border border-amber-500/30 bg-amber-500/5 rounded p-3 text-sm text-amber-300">
                  High COPQ — requires admin approval before Jira ticket is created.
                  {isAdmin && <button className="btn ml-3 text-xs" onClick={approve}>Approve Now</button>}
                </div>
              )}
              <div className="flex flex-wrap gap-2">
                {STATUSES.map(s => (
                  <button key={s} className={`btn-ghost text-xs ${sel.status === s ? "border-cyan-500 text-cyan-300" : ""}`} onClick={() => setStatus(s)}>{s}</button>
                ))}
              </div>
              {sel.impact && (
                <div className="border border-edge rounded p-3 text-sm">
                  <div className="label mb-1">Measured Impact</div>
                  <div className="grid grid-cols-2 gap-2 text-slate-300">
                    <div>Scrap %: {sel.impact.before_scrap_percent?.toFixed(2)} → <b className="text-emerald-300">{sel.impact.after_scrap_percent?.toFixed(2)}</b></div>
                    <div>COPQ: ₹{Math.round(sel.impact.before_copq).toLocaleString()} → <b className="text-emerald-300">₹{Math.round(sel.impact.after_copq).toLocaleString()}</b></div>
                  </div>
                </div>
              )}
              <div>
                <div className="label mb-2">Comments</div>
                <div className="space-y-3 mb-4">
                  {sel.comments?.map((c: any) => (
                    <div key={c.id} className="text-sm border-l-2 border-cyan-500 bg-cyan-950/10 p-2 pl-3 rounded-r">
                      <span className="text-slate-200">{c.comment}</span>
                      <div className="text-[10px] text-slate-500 mt-1 uppercase tracking-wider">{c.author || `user #${c.user_id}`} · {new Date(c.created_at).toLocaleString()}</div>
                    </div>
                  ))}
                  {(!sel.comments || sel.comments.length === 0) && <div className="text-xs text-slate-500">No comments yet.</div>}
                </div>
                <div className="flex gap-2">
                  <input className="input flex-1" placeholder="Add comment…" value={comment} onChange={e => setComment(e.target.value)} onKeyDown={e => e.key === "Enter" && addComment()} />
                  <button className="btn" onClick={addComment}>Post</button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
