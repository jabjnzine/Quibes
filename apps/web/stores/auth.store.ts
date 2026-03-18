import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Staff } from '@quibes/shared'

interface AuthState {
  user: Staff | null
  token: string | null
  isAuthenticated: boolean
  setAuth: (user: Staff, token: string) => void
  setToken: (token: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setAuth: (user, token) => set({ user, token, isAuthenticated: true }),
      setToken: (token) => set({ token }),
      logout: () => set({ user: null, token: null, isAuthenticated: false }),
    }),
    {
      name: 'quibes-auth',
      partialize: (s) => ({ user: s.user, isAuthenticated: s.isAuthenticated }),
      // token ไม่ persist — เก็บใน memory เท่านั้น
    },
  ),
)
