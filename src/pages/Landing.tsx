import { Link } from 'react-router-dom'

const cards = [
  { t: 'Scrap Driver Detection', d: 'Pareto 80/20 ranking of components, defects, machines, lines and shifts driving scrap.' },
  { t: 'COPQ Reduction', d: 'Continuous tracking of Cost of Poor Quality with anomaly detection on every record.' },
  { t: 'CAPA Orchestration', d: 'Corrective actions with Jira tickets, owners, due dates, approvals and closure tracking.' },
  { t: 'AI Root Cause Analysis', d: 'LLM-powered RCA grounded in live SQL data, vector knowledge base and knowledge graph.' },
  { t: 'Report Generation', d: 'Weekly and monthly executive Word reports with trends, actions and measured impact.' },
  { t: 'Chatbot Q&A', d: 'Ask plant-level quality questions and get answers with evidence and sources.' }
]

export default function Landing() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.07]"
        style={{ backgroundImage: 'linear-gradient(#22d3ee 1px, transparent 1px), linear-gradient(90deg, #22d3ee 1px, transparent 1px)', backgroundSize: '46px 46px' }} />
      <header className="relative flex items-center justify-between px-10 py-6">
        <div className="font-display text-amber-300 tracking-[0.3em]">AGENT 17</div>
        <Link to="/login" className="btn">SIGN IN</Link>
      </header>
      <section className="relative max-w-5xl mx-auto px-10 pt-20 pb-14">
        <div className="font-mono text-cy text-xs mb-4">// QUALITY &amp; SCRAP REDUCTION ORCHESTRATION AGENT</div>
        <h1 className="font-display text-5xl leading-tight text-slate-100">
          From static dashboards to a<br />
          <span className="text-amber-300">continuous improvement execution engine.</span>
        </h1>
        <p className="mt-6 text-slate-400 max-w-2xl">
          Agent 17 continuously analyzes scrap, defects, COPQ, machines, lines, shifts and tooling —
          finds root causes, dispatches corrective actions, tracks closure and measures real improvement.
        </p>
        <div className="mt-8 flex gap-4">
          <Link to="/login" className="btn">LAUNCH CONSOLE</Link>
          <a href="#modules" className="btn-ghost">EXPLORE MODULES</a>
        </div>
      </section>
      <section id="modules" className="relative max-w-6xl mx-auto px-10 pb-24 grid md:grid-cols-3 gap-5">
        {cards.map(c => (
          <div key={c.t} className="card hover:border-cy/50 transition">
            <div className="font-display text-amber-300">{c.t}</div>
            <p className="mt-2 text-sm text-slate-400">{c.d}</p>
          </div>
        ))}
      </section>
    </div>
  )
}
