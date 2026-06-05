import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { errMsg } from '../services/api'

export default function Login() {
  const { login } = useAuth()
  const nav = useNavigate()
  const [email, setEmail] = useState('admin@agent17.com')
  const [password, setPassword] = useState('Admin@123')
  const [busy, setBusy] = useState(false)

  const submit = async () => {
    setBusy(true)
    try {
      await login(email, password)
      nav('/app/dashboard')
    } catch (e) { toast.error(errMsg(e)) }
    finally { setBusy(false) }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-ink">
      <div className="absolute inset-0 opacity-[0.05]"
        style={{ backgroundImage: 'linear-gradient(#06b6d4 1px, transparent 1px), linear-gradient(90deg, #06b6d4 1px, transparent 1px)', backgroundSize: '46px 46px' }} />
      <div className="absolute top-1/2 left-1/2 w-[500px] h-[500px] bg-cyan-100 rounded-full blur-[128px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

      <div className="card w-[420px] bg-panel/80 backdrop-blur-sm border-edge shadow-2xl relative z-10 p-8 rounded-2xl">
        <div className="flex flex-col items-center justify-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 mb-4">
            <span className="font-display font-bold text-white text-2xl">Q</span>
          </div>
          <div className="font-display text-slate-900 text-2xl tracking-widest font-bold leading-none mb-1">QUALITY</div>
          <div className="text-[11px] uppercase tracking-widest text-cyan-500 font-medium">Scrap · COPQ</div>
        </div>

        <label className="label text-slate-600">Email</label>
        <input className="input mb-5 bg-white text-slate-900 border-edge focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500" value={email} onChange={e => setEmail(e.target.value)} />

        <label className="label text-slate-600">Password</label>
        <input className="input mb-8 bg-white text-slate-900 border-edge focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500" type="password" value={password}
          onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && submit()} />

        <button className="w-full py-3 rounded-md font-display font-bold tracking-wide bg-cyan-500 text-white hover:bg-cyan-600 transition shadow-lg shadow-cyan-500/20 disabled:opacity-50" disabled={busy} onClick={submit}>
          {busy ? 'AUTHENTICATING…' : 'SIGN IN'}
        </button>

        <div className="mt-6 p-4 rounded-lg bg-white border border-edge text-xs text-slate-500 font-mono leading-relaxed text-center">
          admin@agent17.com / Admin@123<br />engineer@agent17.com / Engineer@123
        </div>
      </div>
    </div>
  )
}
