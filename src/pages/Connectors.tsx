import { useEffect, useState } from "react";
import api, { errMsg } from "../services/api";
import toast from "react-hot-toast";

export default function Connectors() {
  const [connectors, setConnectors] = useState<any[]>([]);
  const [edit, setEdit] = useState<any>(null);
  const [busy, setBusy] = useState<string | null>(null);

  const load = async () => {
    try { const r = await api.get("/connectors"); setConnectors(r.data); } catch (e) { toast.error(errMsg(e)); }
  };
  useEffect(() => { load(); }, []);

  const save = async () => {
    setBusy("save");
    try {
      await api.put(`/connectors/${edit.id}`, {
        connector_name: edit.connector_name,
        connector_type: edit.connector_type,
        config_json: edit.config_json,
        enabled: edit.enabled
      });
      toast.success("Connector saved"); setEdit(null); load();
    } catch (e) { toast.error(errMsg(e)); } finally { setBusy(null); }
  };

  const test = async (id: number) => {
    setBusy(`test-${id}`);
    try {
      const r = await api.post(`/connectors/${id}/test`);
      r.data.ok ? toast.success(r.data.message) : toast.error(r.data.message);
    } catch (e) { toast.error(errMsg(e)); } finally { setBusy(null); }
  };

  const sync = async (id: number) => {
    setBusy(`sync-${id}`);
    try {
      const r = await api.post(`/connectors/${id}/sync`);
      toast.success(r.data.message || "Synced");
    } catch (e) { toast.error(errMsg(e)); } finally { setBusy(null); }
  };

  const setCfg = (k: string, v: any) => setEdit({ ...edit, config_json: { ...(edit.config_json || {}), [k]: v } });

  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="text-2xl font-display text-slate-900">Connector Configuration</h1>
      <div className="grid gap-4">
        {connectors.filter(c => c.connector_type?.toLowerCase() !== 'csv').map(c => (
          <div key={c.id} className="card p-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-slate-900 font-medium">{c.connector_name} <span className="text-xs text-slate-500">({c.connector_type})</span></div>
                <div className="text-xs text-slate-500 mt-1">{c.enabled ? <span className="text-emerald-600">● enabled</span> : <span className="text-slate-500">○ disabled</span>}</div>
              </div>
              <div className="flex gap-2">
                <button className="btn-ghost text-xs" onClick={() => setEdit(JSON.parse(JSON.stringify(c)))}>Configure</button>
                <button className="btn-ghost text-xs" disabled={busy === `test-${c.id}`} onClick={() => test(c.id)}>{busy === `test-${c.id}` ? "Testing…" : "Test"}</button>
                <button className="btn-ghost text-xs" disabled={busy === `sync-${c.id}`} onClick={() => sync(c.id)}>{busy === `sync-${c.id}` ? "Syncing…" : "Sync"}</button>
              </div>
            </div>
            {edit?.id === c.id && (
              <div className="mt-4 pt-4 border-t border-slate-200 space-y-3">
                {c.connector_type?.toLowerCase() === "jira" && (
                  <>
                    <div><label className="label">Jira Base URL</label><input className="input" placeholder="https://yourorg.atlassian.net" value={edit.config_json?.base_url || ""} onChange={e => setCfg("base_url", e.target.value)} /></div>
                    <div><label className="label">Email</label><input className="input" value={edit.config_json?.email || ""} onChange={e => setCfg("email", e.target.value)} /></div>
                    <div><label className="label">API Token <span className="text-slate-500">(leave masked value to keep existing)</span></label><input className="input" value={edit.config_json?.api_token || ""} onChange={e => setCfg("api_token", e.target.value)} /></div>
                    <div><label className="label">Project Key</label><input className="input" placeholder="QUAL" value={edit.config_json?.project_key || ""} onChange={e => setCfg("project_key", e.target.value)} /></div>
                  </>
                )}
                <label className="flex items-center gap-2 text-sm text-slate-700">
                  <input type="checkbox" checked={edit.enabled} onChange={e => setEdit({ ...edit, enabled: e.target.checked })} /> Enabled
                </label>
                <div className="flex gap-2">
                  <button className="btn" disabled={busy === "save"} onClick={save}>Save</button>
                  <button className="btn-ghost" onClick={() => setEdit(null)}>Cancel</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      <p className="text-xs text-slate-500">If Jira is not configured or unreachable, the system creates simulated tickets (SIM-XXXX) so the workflow remains testable.</p>
    </div>
  );
}
