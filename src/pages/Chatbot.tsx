import { useRef, useState } from "react";
import api, { errMsg } from "../services/api";
import toast from "react-hot-toast";

interface Msg { role: "user" | "assistant"; text: string; sources?: string[]; }

export default function Chatbot() {
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: "assistant", text: "Hi! Ask me about scrap trends, COPQ, defects, machines, RCA history, or corrective actions." },
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  const send = async () => {
    const q = input.trim();
    if (!q || busy) return;
    setMsgs(m => [...m, { role: "user", text: q }]);
    setInput(""); setBusy(true);
    try {
      const r = await api.post("/chat", { question: q });
      setMsgs(m => [...m, { role: "assistant", text: r.data.answer, sources: r.data.sources }]);
    } catch (e) {
      toast.error(errMsg(e));
      setMsgs(m => [...m, { role: "assistant", text: "Data is not available." }]);
    } finally {
      setBusy(false);
      setTimeout(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
    }
  };

  return (
    <div className="max-w-3xl mx-auto h-[calc(100vh-8rem)] flex flex-col">
      <h1 className="text-2xl font-display text-white mb-4">Quality Chatbot</h1>
      <div className="card flex-1 overflow-y-auto p-4 space-y-4">
        {msgs.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[80%] rounded-lg px-4 py-3 text-sm leading-relaxed ${
              m.role === "user" ? "bg-cyan-600/20 border border-cyan-500/30 text-cyan-50" : "bg-edge/50 border border-edge text-slate-200"}`}>
              <div className="whitespace-pre-wrap">{m.text}</div>
              {m.sources && m.sources.length > 0 && (
                <div className="mt-2 pt-2 border-t border-edge text-xs text-slate-500">
                  Sources: {m.sources.join(" · ")}
                </div>
              )}
            </div>
          </div>
        ))}
        {busy && <div className="text-slate-500 text-sm animate-pulse">Thinking…</div>}
        <div ref={endRef} />
      </div>
      <div className="flex gap-2 mt-4">
        <input className="input flex-1" placeholder="e.g. What is the top scrap driver this month?" value={input}
          onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()} />
        <button className="btn" disabled={busy} onClick={send}>Send</button>
      </div>
    </div>
  );
}
