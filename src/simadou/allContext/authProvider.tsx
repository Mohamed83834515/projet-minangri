// main.tsx or App.tsx — run once at startup
import { useEffect } from 'react'
import { useAuthStore } from '@/stores/auth-store'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const hydrateFromToken = useAuthStore((s) => s.hydrateFromToken)

  useEffect(() => {
    hydrateFromToken()
  }, [])

  return <>{children}</>
}

