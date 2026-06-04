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

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card overflow-x-auto h-fit">
          <table className="w-full text-sm">
            <thead><tr><th className="th">Title</th><th className="th">Type</th><th className="th">Priority</th><th className="th">Status</th><th className="th">Jira</th><th className="th">Due</th></tr></thead>
            <tbody>
              {actions.map(a => (
                <tr key={a.id} className={`hover:bg-edge/30 cursor-pointer ${sel?.id === a.id ? "bg-edge/40" : ""}`} onClick={() => open(a.id)}>
                  <td className="td text-white">{a.title}{a.approval_required && !a.approved_at && <span className="ml-2 text-xs text-amber-400">⏳ approval</span>}</td>
                  <td className="td">{a.action_type}</td>
                  <td className="td">{a.priority}</td>
                  <td className="td"><span className={`text-xs px-2 py-0.5 rounded ${statusColor[a.status] || ""}`}>{a.status}</span></td>
                  <td className="td text-cyan-300">{a.jira_key || "—"}</td>
                  <td className="td text-slate-400">{a.due_date ? new Date(a.due_date).toLocaleDateString() : "—"}</td>
                </tr>
              ))}
              {actions.length === 0 && <tr><td className="td text-slate-500" colSpan={6}>No actions. Create from RCA recommendations.</td></tr>}
            </tbody>
          </table>
        </div>

        {sel && (
          <div className="card p-5 space-y-4 h-fit">
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
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {sel.comments?.map((c: any) => (
                  <div key={c.id} className="text-sm border-l-2 border-edge pl-3">
                    <span className="text-slate-300">{c.comment}</span>
                    <div className="text-xs text-slate-500">{c.author || `user #${c.user_id}`} · {new Date(c.created_at).toLocaleString()}</div>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 mt-3">
                <input className="input flex-1" placeholder="Add comment…" value={comment} onChange={e => setComment(e.target.value)} onKeyDown={e => e.key === "Enter" && addComment()} />
                <button className="btn" onClick={addComment}>Post</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
