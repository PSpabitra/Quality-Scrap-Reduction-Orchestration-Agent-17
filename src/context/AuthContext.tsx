import { createContext, useContext, useState, ReactNode } from 'react'
import { api } from '../services/api'

type User = { id: number; name: string; email: string; role: 'ADMIN' | 'ENGINEER' }
type Ctx = {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  isAdmin: boolean
}

const AuthCtx = createContext<Ctx>(null as any)
export const useAuth = () => useContext(AuthCtx)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const raw = localStorage.getItem('agent17_user')
    return raw ? JSON.parse(raw) : null
  })

  const login = async (email: string, password: string) => {
    const { data } = await api.post('/auth/login', { email, password })
    localStorage.setItem('agent17_token', data.access_token)
    localStorage.setItem('agent17_user', JSON.stringify(data.user))
    setUser(data.user)
  }

  const logout = () => {
    localStorage.removeItem('agent17_token')
    localStorage.removeItem('agent17_user')
    setUser(null)
  }

  return (
    <AuthCtx.Provider value={{ user, login, logout, isAdmin: user?.role === 'ADMIN' }}>
      {children}
    </AuthCtx.Provider>
  )
}
