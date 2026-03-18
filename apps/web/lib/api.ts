import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { useAuthStore } from '@/stores/auth.store'
import { showToast } from '@/lib/toast'
import { clearSessionCookie } from '@/lib/session'

export const api = axios.create({
  baseURL: (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001') + '/api/v1',
  withCredentials: true,
})

// Attach Bearer token on every request
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

let isRefreshing = false
let queue: Array<(token: string) => void> = []

type ExtendedConfig = InternalAxiosRequestConfig & { _retry?: boolean }

api.interceptors.response.use(
  (response) => {
    // Unwrap NestJS TransformInterceptor: { success: true, data: X } → X
    if (
      response.data !== null &&
      typeof response.data === 'object' &&
      response.data.success === true &&
      'data' in response.data
    ) {
      response.data = response.data.data
    }
    return response
  },
  async (error: AxiosError) => {
    const status = error.response?.status
    const config = error.config as ExtendedConfig | undefined
    const url = config?.url ?? ''

    // Auth endpoints should never trigger the auto-refresh loop
    const isAuthEndpoint = url.includes('/auth/')

    // 401 — try silent token refresh (skip for auth endpoints to avoid loops)
    if (status === 401 && config && !config._retry && !isAuthEndpoint) {
      config._retry = true

      if (isRefreshing) {
        return new Promise((resolve) => {
          queue.push((token: string) => {
            if (config.headers) config.headers['Authorization'] = `Bearer ${token}`
            resolve(api(config))
          })
        })
      }

      isRefreshing = true

      try {
        // The unwrapper above will give us { accessToken } directly
        const { data } = await api.post<{ accessToken: string }>('/auth/refresh')
        const newToken = data.accessToken

        useAuthStore.getState().setToken(newToken)
        queue.forEach((cb) => cb(newToken))
        queue = []

        if (config.headers) config.headers['Authorization'] = `Bearer ${newToken}`
        return api(config)
      } catch {
        useAuthStore.getState().logout()
        clearSessionCookie()
        if (typeof window !== 'undefined') window.location.href = '/login'
        return Promise.reject(error)
      } finally {
        isRefreshing = false
      }
    }

    // 403 — always show toast (not a form error)
    if (status === 403) {
      showToast('ไม่มีสิทธิ์ดำเนินการนี้', 'error')
    }

    // 500+ — server errors, show toast
    if (status && status >= 500) {
      showToast('เกิดข้อผิดพลาดบนเซิร์ฟเวอร์ กรุณาลองใหม่', 'error')
    }

    // 400/401/404/422 on non-auth endpoints — let each component handle via onError
    return Promise.reject(error)
  },
)
