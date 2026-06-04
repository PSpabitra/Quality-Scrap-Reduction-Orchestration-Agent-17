import axios from 'axios'

export const api = axios.create({ baseURL: '/api' })

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('agent17_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err.response?.status === 401 && window.location.pathname !== '/login') {
      localStorage.removeItem('agent17_token')
      localStorage.removeItem('agent17_user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export const errMsg = (e: any) =>
  e?.response?.data?.detail
    ? typeof e.response.data.detail === 'string'
      ? e.response.data.detail
      : JSON.stringify(e.response.data.detail)
    : e?.message || 'Request failed'

export default api
