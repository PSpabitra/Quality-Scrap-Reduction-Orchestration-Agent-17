export default function RiskBadge({ level }: { level?: string }) {
  const map: Record<string, string> = {
    Critical: 'bg-red-500/15 text-red-600 border-red-500/40',
    High: 'bg-orange-500/15 text-orange-600 border-orange-500/40',
    Medium: 'bg-amber-500/15 text-amber-700 border-amber-500/40',
    Low: 'bg-emerald-500/15 text-emerald-600 border-emerald-500/40'
  }
  return (
    <span className={`px-2 py-0.5 rounded text-[11px] font-display border ${map[level || 'Low'] || map.Low}`}>
      {level || 'Low'}
    </span>
  )
}
