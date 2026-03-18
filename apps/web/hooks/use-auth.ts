import { useMutation } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { useAuthStore } from '@/stores/auth.store'
import { setSessionCookie, clearSessionCookie } from '@/lib/session'
import type { Staff } from '@quibes/shared'

interface LoginDto {
  email: string
  password: string
}

// Shape returned by POST /auth/login (after TransformInterceptor unwrapper)
interface LoginResponse {
  accessToken: string
  user: Staff
}

export function useLogin() {
  const setAuth = useAuthStore((s) => s.setAuth)

  return useMutation({
    mutationFn: (dto: LoginDto) =>
      api.post<LoginResponse>('/auth/login', dto).then((r) => r.data),
    onSuccess: (data) => {
      setAuth(data.user, data.accessToken)
      setSessionCookie()
    },
  })
}

export function useLogout() {
  const logout = useAuthStore((s) => s.logout)

  return useMutation({
    mutationFn: () => api.post('/auth/logout'),
    onSuccess: () => {
      logout()
      clearSessionCookie()
    },
    onError: () => {
      // Force local logout even if API call fails
      logout()
      clearSessionCookie()
    },
  })
}
