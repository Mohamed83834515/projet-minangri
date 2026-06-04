import { TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'

interface NiveauTabTriggerProps {
  value: string
  count?: number
  children: React.ReactNode
}

export function NiveauTabTrigger({ value, count, children }: NiveauTabTriggerProps) {
  return (
    <TabsTrigger value={value} className="relative">
      {children}
      {count !== undefined && count > 0 && (
        <span className="ml-2 text-black rounded-full bg-muted px-1.5 py-0.5 text-xs">
          {count}
        </span>
      )}
    </TabsTrigger>
  )
}

export function NiveauTabsList({ children }: { children: React.ReactNode }) {
  return (
    <TabsList className="flex flex-wrap gap-1">
      {children}
    </TabsList>
  )
}