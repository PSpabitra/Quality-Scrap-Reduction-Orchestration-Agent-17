import { useEffect, useState } from "react";
import api, { errMsg } from "../services/api";
import toast from "react-hot-toast";

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [tab, setTab] = useState<"users" | "logs" | "emails">("users");
  const [emails, setEmails] = useState<any[]>([]);
  const [form, setForm] = useState({ email: "", full_name: "", password: "", role: "ENGINEER" });

  const load = async () => {
    try {
      const [u, l, e] = await Promise.all([
        api.get("/admin/users"), api.get("/admin/system-logs", { params: { limit: 100 } }), api.get("/admin/notification-logs"),
      ]);
      setUsers(u.data); setLogs(l.data); setEmails(e.data);
    } catch (e) { toast.error(errMsg(e)); }
  };
  useEffect(() => { load(); }, []);

  const create = async () => {
    if (!form.email || !form.password) return toast.error("Email and password required");
    try {
      await api.post("/admin/users", form);
      toast.success("User created");
      setForm({ email: "", full_name: "", password: "", role: "ENGINEER" }); load();
    } catch (e) { toast.error(errMsg(e)); }
  };

  const toggleActive = async (u: any) => {
    try { await api.put(`/admin/users/${u.id}`, { is_active: !u.is_active }); load(); } catch (e) { toast.error(errMsg(e)); }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-display text-white">Administration</h1>
      <div className="flex gap-2">
        {(["users", "logs", "emails"] as const).map(t => (
          <button key={t} className={`btn-ghost capitalize ${tab === t ? "border-cyan-500 text-cyan-300" : ""}`} onClick={() => setTab(t)}>{t}</button>
        ))}
      </div>

      {tab === "users" && (
        <>
          <div className="card p-5 grid md:grid-cols-5 gap-3">
            <input className="input" placeholder="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            <input className="input" placeholder="full name" value={form.full_name} onChange={e => setForm({ ...form, full_name: e.target.value })} />
            <input className="input" type="password" placeholder="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
            <select className="input" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
              <option>ENGINEER</option><option>ADMIN</option>
            </select>
            <button className="btn" onClick={create}>Add User</button>
          </div>
          <div className="card overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr><th className="th">Email</th><th className="th">Name</th><th className="th">Role</th><th className="th">Status</th><th className="th"></th></tr></thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-edge/30">
                    <td className="td text-white">{u.email}</td><td className="td">{u.full_name}</td>
                    <td className="td"><span className={`text-xs px-2 py-0.5 rounded ${u.role === "ADMIN" ? "bg-amber-500/10 text-amber-300" : "bg-cyan-500/10 text-cyan-300"}`}>{u.role}</span></td>
                    <td className="td">{u.is_active ? <span className="text-emerald-400">active</span> : <span className="text-slate-500">disabled</span>}</td>
                    <td className="td"><button className="btn-ghost text-xs" onClick={() => toggleActive(u)}>{u.is_active ? "Disable" : "Enable"}</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {tab === "logs" && (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr><th className="th">Time</th><th className="th">Level</th><th className="th">Source</th><th className="th">Message</th></tr></thead>
            <tbody>
              {logs.map(l => (
                <tr key={l.id} className="hover:bg-edge/30">
                  <td className="td text-slate-400">{new Date(l.created_at).toLocaleString()}</td>
                  <td className="td"><span className={l.level === "ERROR" ? "text-rose-300" : l.level === "WARNING" ? "text-amber-300" : "text-slate-300"}>{l.level}</span></td>
                  <td className="td">{l.source}</td><td className="td text-slate-300">{l.message}</td>
                </tr>
              ))}
              {logs.length === 0 && <tr><td className="td text-slate-500" colSpan={4}>No logs.</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {tab === "emails" && (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr><th className="th">Time</th><th className="th">To</th><th className="th">Subject</th><th className="th">Status</th></tr></thead>
            <tbody>
              {emails.map(e => (
                <tr key={e.id} className="hover:bg-edge/30">
                  <td className="td text-slate-400">{new Date(e.created_at).toLocaleString()}</td>
                  <td className="td">{e.recipient}</td><td className="td text-white">{e.subject}</td>
                  <td className="td">{e.status === "sent" ? <span className="text-emerald-400">sent</span> : <span className="text-rose-300">{e.status}</span>}</td>
                </tr>
              ))}
              {emails.length === 0 && <tr><td className="td text-slate-500" colSpan={4}>No notifications sent.</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
