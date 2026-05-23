import type { LucideIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CHART_COLORS, useColor } from '@/stores/others/color-store'
import { cn } from '@/lib/utils'

type ThemedPrimaryButtonProps = {
  onClick: () => void
  children: React.ReactNode
  icon?: LucideIcon
  className?: string
  disabled?: boolean
}

/** Bouton primaire thématique (même style que PageRouteLayout). */
export function ThemedPrimaryButton({
  onClick,
  children,
  icon: Icon,
  className,
  disabled,
}: ThemedPrimaryButtonProps) {
  const { color } = useColor()
  const { stroke } = CHART_COLORS[color]

  return (
    <Button
      type='button'
      onClick={onClick}
      disabled={disabled}
      style={{ backgroundColor: stroke }}
      className={cn(
        'cursor-pointer text-white hover:opacity-90 active:scale-100',
        className
      )}
    >
      {Icon && <Icon className='h-4 w-4' />}
      {children}
    </Button>
  )
}
