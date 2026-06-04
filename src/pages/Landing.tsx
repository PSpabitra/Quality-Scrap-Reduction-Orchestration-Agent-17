import { Link } from 'react-router-dom'

const cards = [
  { t: 'Scrap Driver Detection', d: 'Pareto 80/20 ranking of components, defects, machines, lines and shifts driving scrap.', icon: '📊' },
  { t: 'COPQ Reduction', d: 'Continuous tracking of Cost of Poor Quality with anomaly detection on every record.', icon: '💸' },
  { t: 'CAPA Orchestration', d: 'Corrective actions with Jira tickets, owners, due dates, approvals and closure tracking.', icon: '🔄' },
  { t: 'AI Root Cause Analysis', d: 'LLM-powered RCA grounded in live SQL data, vector knowledge base and knowledge graph.', icon: '🧠' },
  { t: 'Report Generation', d: 'Weekly and monthly executive Word reports with trends, actions and measured impact.', icon: '📄' },
  { t: 'Chatbot Q&A', d: 'Ask plant-level quality questions and get answers with evidence and sources.', icon: '💬' }
]

export default function Landing() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-ink text-slate-200 selection:bg-cyan-500/30">
      <div className="absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: 'linear-gradient(#22d3ee 1px, transparent 1px), linear-gradient(90deg, #22d3ee 1px, transparent 1px)', backgroundSize: '46px 46px' }} />
      
      {/* Glow Effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-600/20 rounded-full blur-[128px] -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-cyan-900/20 rounded-full blur-[128px] translate-y-1/2 pointer-events-none" />

      <header className="relative flex items-center justify-between px-10 py-6 max-w-7xl mx-auto w-full z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <span className="font-display font-bold text-ink text-xl">Q</span>
          </div>
          <div className="flex flex-col">
            <div className="font-display text-white text-xl tracking-wide font-bold leading-none">QUALITY</div>
            <div className="text-[10px] uppercase tracking-widest text-cyan-400 font-medium mt-1">Scrap · COPQ</div>
          </div>
        </div>
        <Link to="/login" className="px-6 py-2.5 rounded-full font-display text-sm tracking-wide bg-panel border border-edge text-white hover:border-cyan-500/50 hover:bg-cyan-950/30 transition shadow-sm">
          SIGN IN
        </Link>
      </header>
      
      <section className="relative max-w-5xl mx-auto px-10 pt-28 pb-20 z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-950/40 border border-cyan-500/20 text-cyan-400 text-[11px] font-mono mb-8 tracking-wider shadow-sm">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          CONTINUOUS IMPROVEMENT EXECUTION ENGINE
        </div>
        
        <h1 className="font-display text-6xl md:text-7xl leading-[1.1] text-white font-bold tracking-tight">
          From static dashboards to a <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">
            continuous improvement engine.
          </span>
        </h1>
        
        <p className="mt-8 text-slate-400 max-w-2xl text-lg leading-relaxed font-body">
          Agent 17 continuously analyzes scrap, defects, COPQ, machines, lines, shifts and tooling —
          finds root causes, dispatches corrective actions, tracks closure and measures real improvement.
        </p>
        
        <div className="mt-10 flex flex-wrap gap-4 items-center">
          <Link to="/login" className="px-8 py-3.5 rounded-full font-display text-sm tracking-wide bg-cyan-500 text-ink font-bold hover:bg-cyan-400 transition shadow-lg shadow-cyan-500/20 border border-cyan-400">
            LAUNCH CONSOLE
          </Link>
          <a href="#modules" className="px-8 py-3.5 rounded-full font-display text-sm tracking-wide bg-panel border border-edge text-slate-300 hover:text-white hover:border-cyan-500/50 transition">
            EXPLORE MODULES
          </a>
        </div>
      </section>
      
      <section id="modules" className="relative max-w-7xl mx-auto px-10 pb-32 grid md:grid-cols-2 lg:grid-cols-3 gap-6 z-10">
        {cards.map((c, i) => (
          <div key={i} className="group bg-panel/80 border border-edge rounded-2xl p-6 hover:border-cyan-500/50 hover:bg-cyan-950/10 transition-all duration-300 shadow-sm relative overflow-hidden backdrop-blur-sm">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan-500/5 to-transparent rounded-bl-[100px] -z-10 group-hover:from-cyan-500/10 transition-colors" />
            <div className="w-12 h-12 rounded-xl bg-ink border border-edge flex items-center justify-center text-xl mb-5 group-hover:border-cyan-500/30 transition-colors shadow-sm">
              {c.icon}
            </div>
            <div className="font-display text-white text-lg font-bold tracking-wide">{c.t}</div>
            <p className="mt-3 text-sm text-slate-400 leading-relaxed font-body">{c.d}</p>
          </div>
        ))}
      </section>
    </div>
  )
}
