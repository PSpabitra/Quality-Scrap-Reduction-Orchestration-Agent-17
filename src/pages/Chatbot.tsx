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
      setMsgs(m => [...m, { role: "assistant", text: "Data is not available at the moment." }]);
    } finally {
      setBusy(false);
      setTimeout(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
    }
  };

  return (
    <div className="w-full h-[calc(100vh-6.5rem)] flex flex-col bg-panel rounded-lg shadow-sm border border-edge overflow-hidden">
      <div className="px-6 py-4 border-b border-edge bg-ink/80 flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-xl font-display text-white font-semibold flex items-center gap-2">
            Quality Chatbot
          </h1>
          <p className="text-xs text-slate-400 mt-1 pb-1">AI-powered insights for Scrap & COPQ analysis</p>
        </div>
        <div className="flex items-center gap-2 bg-emerald-950/30 px-3 py-1.5 rounded-md border border-emerald-900/50 shadow-sm">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="text-xs font-mono font-medium text-emerald-400 tracking-wide">AGENT ONLINE</span>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-ink">
        {msgs.map((m, i) => (
          <div key={i} className={`flex gap-4 ` + (m.role === "user" ? "flex-row-reverse" : "flex-row")}>
            
            {/* Avatar */}
            <div className={`shrink-0 h-10 w-10 rounded-full flex items-center justify-center font-display font-medium shadow-sm ` + (
                m.role === "user" ? "bg-amber-400 text-ink" : "bg-cyan-500 text-ink"
              )}>
              {m.role === "user" ? "U" : "AI"}
            </div>

            {/* Bubble */}
            <div className={`max-w-[75%] rounded-2xl px-5 py-4 text-sm leading-relaxed shadow-sm ` + (
              m.role === "user" 
                ? "bg-amber-400 text-ink rounded-tr-sm" 
                : "bg-panel border border-edge text-slate-200 rounded-tl-sm")}>
              <div className="whitespace-pre-wrap font-body">{m.text}</div>
              {m.sources && m.sources.length > 0 && (
                <div className={`mt-3 pt-3 border-t text-xs flex flex-wrap gap-2 ` + (m.role === "user" ? "border-amber-600/30 text-amber-900" : "border-edge text-slate-400")}>
                  <span className="font-semibold uppercase tracking-wider text-[10px] mt-0.5">Sources</span>
                  {m.sources.map((s, idx) => (
                     <span key={idx} className={`px-2 py-0.5 rounded shadow-sm ` + (m.role === "user" ? "bg-amber-500/20 border border-amber-600/30" : "bg-ink border border-edge text-slate-300")}>{s}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {busy && (
          <div className="flex gap-4 flex-row">
            <div className="shrink-0 h-10 w-10 rounded-full bg-cyan-500 text-ink flex items-center justify-center font-display font-medium shadow-sm">AI</div>
            <div className="bg-panel border border-edge rounded-2xl rounded-tl-sm px-5 py-4 w-20 flex items-center justify-center gap-1.5 shadow-sm">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>
      
      <div className="px-6 py-4 border-t border-edge bg-panel shrink-0">
        <label htmlFor="chat-input" className="sr-only">Type your message</label>
        <div className="flex gap-3 max-w-4xl mx-auto w-full relative group">
          <input id="chat-input" 
            className="w-full py-3.5 pl-5 pr-24 rounded-full text-sm font-body text-slate-200 bg-ink border border-edge transition-all focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500 shadow-sm" 
            placeholder="Ask a question about the data... (e.g. What is the top scrap driver this month?)" 
            value={input}
            onChange={e => setInput(e.target.value)} 
            onKeyDown={e => e.key === "Enter" && send()} 
          />
          <button 
            className="absolute right-1.5 top-1.5 bottom-1.5 bg-cyan-500 text-ink px-5 rounded-full font-display text-sm tracking-wide font-medium hover:bg-cyan-400 transition shadow disabled:opacity-50 disabled:shadow-none flex items-center gap-2" 
            disabled={busy || !input.trim()} 
            onClick={send}
          >
            {busy ? '...' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  );
}
