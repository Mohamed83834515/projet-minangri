// providers/SessionProvider.tsx
import { useEffect, useRef } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useSessionStore } from '@/stores/others/session.store'
import { useDefaultConfiguration } from '../allHooks/configurations/configurationHooks'
import { useAuthStore } from '@/stores/auth-store'
import { setSessionDuration } from '@/lib/session-config'
import { SessionWarningDialog } from '@/components/others/SessionWarningDialog'
import { toast } from 'sonner'

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const navigate  = useNavigate()
  const { data: config }                            = useDefaultConfiguration()
  const { logout }                                  = useAuthStore()
  const { start, stop, remainingSeconds, isWarningVisible } = useSessionStore()
  const durationRef  = useRef<number>(0)
  const hasLoggedOut = useRef(false)

  useEffect(() => {
    if (!config) return

    // snake_case — matches real API shape
    const duration = (config.inactivity_minute ?? 0) * 60  // seconds

    // Sync to module-level cache so axios interceptor can read it
    setSessionDuration(config.inactivity_minute ?? 0)

    if (duration === 0) return   // 0 = infinite, do nothing

    durationRef.current = duration
    start(duration)

    return () => stop()
  }, [config])

  // Watch for expiry
  useEffect(() => {
    if (
      remainingSeconds === 0 &&
      durationRef.current > 0 &&
      !hasLoggedOut.current
    ) {
      hasLoggedOut.current = true
      logout()
      navigate({ to: '/sign-in' })
      toast.info('Session expirée. Veuillez vous reconnecter.')
    }
  }, [remainingSeconds])

  return (
    <>
      {children}
      {isWarningVisible && (
        <SessionWarningDialog
          remainingSeconds={remainingSeconds}
          onExtend={() => useSessionStore.getState().reset(durationRef.current)}
        />
      )}
    </>
  )
}