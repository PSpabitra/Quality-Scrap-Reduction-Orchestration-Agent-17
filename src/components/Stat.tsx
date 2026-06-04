export default function Stat({ label, value, accent = 'text-amber-300' }:
  { label: string; value: string | number; accent?: string }) {
  return (
    <div className="card">
      <div className="text-[11px] uppercase tracking-widest text-slate-500 font-display">{label}</div>
      <div className={`text-2xl mt-1 font-display ${accent}`}>{value}</div>
    </div>
  )
}
