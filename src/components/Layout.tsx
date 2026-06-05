import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const links = [
  { to: '/app/dashboard', label: 'Dashboard' },
  { to: '/app/drivers', label: 'Scrap Drivers' },
  { to: '/app/records', label: 'Scrap Records' },
  { to: '/app/upload-csv', label: 'Upload CSV', admin: true },
  { to: '/app/upload-docs', label: 'Knowledge Base', admin: true },
  { to: '/app/rca', label: 'AI Root Cause' },
  { to: '/app/actions', label: 'Actions / CAPA' },
  { to: '/app/impact', label: 'Impact' },
  { to: '/app/chat', label: 'Chatbot' },
  { to: '/app/reports', label: 'Reports' },
  { to: '/app/connectors', label: 'Connectors', admin: true },
  { to: '/app/admin', label: 'User Management', admin: true }
]

export default function Layout() {
  const { user, isAdmin, logout } = useAuth()
  const nav = useNavigate()
  return (
    <div className="flex h-screen overflow-hidden bg-ink text-slate-800">
      <aside className="w-64 shrink-0 border-r border-edge bg-panel flex flex-col shadow-sm z-10">
        <div className="px-6 py-6 border-b border-edge">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <span className="font-display font-bold text-white text-lg">Q</span>
            </div>
            <div className="flex flex-col">
              <div className="font-display text-slate-900 text-lg tracking-wide font-bold leading-none">QUALITY</div>
              <div className="text-[10px] uppercase tracking-widest text-cyan-600 font-medium mt-1">Scrap · COPQ</div>
            </div>
          </div>
        </div>
        <nav className="flex-1 py-4 overflow-y-auto space-y-1 px-3">
          {links.filter(l => !l.admin || isAdmin).map(l => (
            <NavLink key={l.to} to={l.to}
              className={({ isActive }) =>
                `block px-3 py-2.5 rounded-md text-sm font-display tracking-wide transition-all ` + (
                  isActive ? 'bg-cyan-50 border border-cyan-200 text-cyan-700 shadow-sm font-medium'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-cyan-600')}>
              {l.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <div className="flex-1 flex flex-col min-w-0 bg-ink">
        <header className="h-14 border-b border-edge flex items-center justify-between px-8 bg-panel shadow-sm z-0">
          <div className="font-mono text-[11px] text-slate-500 tracking-wider">CONTINUOUS IMPROVEMENT EXECUTION ENGINE</div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-slate-700 flex items-center">{user?.name}
              <span className="ml-3 px-2.5 py-0.5 rounded-full bg-cyan-100 text-cyan-800 text-[10px] uppercase tracking-wider font-semibold border border-cyan-200 shadow-sm">
                {user?.role}
              </span>
            </span>
            <div className="h-4 w-px bg-slate-200"></div>
            <button className="text-sm font-display tracking-wide text-slate-500 hover:text-rose-500 transition" onClick={() => { logout(); nav('/') }}>Logout</button>
          </div>
        </header>
        <main className="flex-1 p-6 overflow-y-auto w-full max-w-[100vw]">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
