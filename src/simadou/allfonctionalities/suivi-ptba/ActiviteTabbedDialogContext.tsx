import {
  createContext,
  useContext,
  useEffect,
  type ReactNode,
} from 'react'

type ActiviteTabbedDialogContextValue = {
  setSubViewActive: (active: boolean) => void
}

const ActiviteTabbedDialogContext =
  createContext<ActiviteTabbedDialogContextValue | null>(null)

export function ActiviteTabbedDialogProvider({
  setSubViewActive,
  children,
}: ActiviteTabbedDialogContextValue & { children: ReactNode }) {
  return (
    <ActiviteTabbedDialogContext.Provider value={{ setSubViewActive }}>
      {children}
    </ActiviteTabbedDialogContext.Provider>
  )
}

export function useActiviteTabbedSubView(active: boolean) {
  const ctx = useContext(ActiviteTabbedDialogContext)

  useEffect(() => {
    if (!ctx) return
    ctx.setSubViewActive(active)
    return () => ctx.setSubViewActive(false)
  }, [active, ctx])
}

export function ActiviteTabbedSubViewHeader({
  sectionLabel,
  className,
}: {
  sectionLabel: string
  className?: string
}) {
  return (
    <p
      className={
        className ??
        'border-b px-6 py-3 text-sm font-medium text-muted-foreground'
      }
    >
      {sectionLabel}
    </p>
  )
}
