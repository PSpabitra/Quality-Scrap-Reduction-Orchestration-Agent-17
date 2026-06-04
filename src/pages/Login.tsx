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
    <div className="min-h-screen flex items-center justify-center">
      <div className="card w-[380px]">
        <div className="font-display text-amber-300 tracking-[0.3em] text-center">AGENT 17</div>
        <div className="text-center text-[11px] uppercase tracking-widest text-slate-500 mb-6">Persona-based access</div>
        <label className="label">Email</label>
        <input className="input mb-4" value={email} onChange={e => setEmail(e.target.value)} />
        <label className="label">Password</label>
        <input className="input mb-6" type="password" value={password}
          onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && submit()} />
        <button className="btn w-full" disabled={busy} onClick={submit}>
          {busy ? 'AUTHENTICATING…' : 'SIGN IN'}
        </button>
        <div className="mt-5 text-xs text-slate-500 font-mono leading-relaxed">
          admin@agent17.com / Admin@123<br />engineer@agent17.com / Engineer@123
        </div>
      </div>
    </div>
  )
}
