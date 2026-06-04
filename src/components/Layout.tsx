import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const links = [
  { to: '/app/dashboard', label: 'Dashboard' },
  { to: '/app/drivers', label: 'Scrap Drivers' },
  { to: '/app/records', label: 'Scrap Records' },
  { to: '/app/upload-csv', label: 'Upload CSV', admin: true },
  { to: '/app/upload-docs', label: 'Upload Documents', admin: true },
  { to: '/app/rca', label: 'AI Root Cause' },
  { to: '/app/actions', label: 'Actions / CAPA' },
  { to: '/app/impact', label: 'Impact' },
  { to: '/app/graph', label: 'Knowledge Graph' },
  { to: '/app/chat', label: 'Chatbot' },
  { to: '/app/reports', label: 'Reports' },
  { to: '/app/connectors', label: 'Connectors', admin: true },
  { to: '/app/admin', label: 'User Management', admin: true }
]

export default function Layout() {
  const { user, isAdmin, logout } = useAuth()
  const nav = useNavigate()
  return (
    <div className="flex h-screen overflow-hidden">
      <aside className="w-60 shrink-0 border-r border-edge bg-panel/60 flex flex-col">
        <div className="px-5 py-5 border-b border-edge">
          <div className="font-display text-amber-300 text-lg tracking-widest">Quality Scrap COPQ</div>
          {/* <div className="text-[10px] uppercase tracking-widest text-slate-500">Quality Â· Scrap Â· COPQ</div> */}
        </div>
        <nav className="flex-1 py-3 overflow-y-auto">
          {links.filter(l => !l.admin || isAdmin).map(l => (
            <NavLink key={l.to} to={l.to}
              className={({ isActive }) =>
                `block px-5 py-2 text-sm font-display tracking-wide border-l-2 ${
                  isActive ? 'border-amber-400 text-amber-300 bg-amber-400/5'
                           : 'border-transparent text-slate-400 hover:text-slate-200'}`}>
              {l.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 border-b border-edge flex items-center justify-between px-6 bg-panel/40">
          <div className="font-mono text-xs text-slate-500">CONTINUOUS IMPROVEMENT EXECUTION ENGINE</div>
          <div className="flex items-center gap-4">
            <span className="text-sm">{user?.name}
              <span className="ml-2 px-2 py-0.5 rounded bg-cy/10 text-cy text-[10px] font-display border border-cy/30">
                {user?.role}
              </span>
            </span>
            <button className="btn-ghost !py-1" onClick={() => { logout(); nav('/login') }}>Logout</button>
          </div>
        </header>
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

