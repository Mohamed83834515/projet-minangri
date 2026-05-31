import { create } from 'zustand'
import { tokenManager } from '@/axios/api'
import { jwtDecode } from 'jwt-decode'

interface DecodedToken {
  exp: number
  user_id: number
}

interface AuthState {
  isAuthenticated: boolean

  hydrateFromToken: () => void

  login: () => void

  logout: () => void
}

export const useAuthStore = create<AuthState>()((set) => ({
  isAuthenticated: false,

  hydrateFromToken: () => {
    const token = tokenManager.getAccessToken()
    if (!token) { set({ isAuthenticated: false }); return }
    try {
      const decoded = jwtDecode<DecodedToken>(token)
      if (decoded.exp * 1000 < Date.now()) {
        tokenManager.clearTokens()
        set({ isAuthenticated: false })
        return
      }
      set({ isAuthenticated: true })
    } catch {
      tokenManager.clearTokens()
      set({ isAuthenticated: false })
    }
  },

  login: () => set({ isAuthenticated: true }),

  logout: () => {
    tokenManager.clearTokens()
    set({ isAuthenticated: false })
  },

  // alias used by QueryCache 401 handler in main.tsx
  reset: () => {
    tokenManager.clearTokens()
    set({ isAuthenticated: false })
  },
}))