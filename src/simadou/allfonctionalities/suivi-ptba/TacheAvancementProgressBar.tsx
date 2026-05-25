import { cn } from '@/lib/utils'

interface TacheAvancementProgressBarProps {
  percent: number
  compact?: boolean
}

function clampPercent(percent: number): number {
  if (!Number.isFinite(percent)) return 0
  return Math.min(100, Math.max(0, Math.round(percent)))
}

/** 0–19 % rouge, 20–69 % orange, 70–100 % vert */
export function getTacheAvancementBarColorClass(percent: number): string {
  const value = clampPercent(percent)
  if (value < 20) return 'bg-red-500'
  if (value < 70) return 'bg-orange-500'
  return 'bg-green-500'
}

export default function TacheAvancementProgressBar({
  percent,
  compact = false,
}: TacheAvancementProgressBarProps) {
  const value = clampPercent(percent)
  const fillClass = getTacheAvancementBarColorClass(value)

  return (
    <div className={cn(compact ? 'min-w-[100px]' : 'min-w-[200px] flex-1 max-w-md')}>
      <div
        className={cn(
          'flex items-center justify-between gap-2 text-muted-foreground',
          compact ? 'mb-1 text-xs' : 'mb-1.5 text-sm'
        )}
      >
        {!compact && (
          <span className='font-medium text-foreground'>
            Taux d&apos;avancement global des tâches
          </span>
        )}
        <span
          className={cn(
            'ml-auto font-medium text-foreground',
            !compact && 'text-sm font-semibold'
          )}
        >
          {value}%
        </span>
      </div>
      <div
        className={cn(
          'w-full overflow-hidden rounded-full bg-muted',
          compact ? 'h-2' : 'h-2.5'
        )}
      >
        <div
          className={cn('h-full rounded-full transition-all', fillClass)}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  )
}
