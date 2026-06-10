import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Star, Trash2, Copy } from 'lucide-react'
import { useSetDefaultConfiguration, useDeleteConfiguration } from '@/simadou/allHooks/configurations/configurationHooks'
import type { Configuration } from '@/simadou/schemas/configurations.schema'

interface Props {
  config:     Configuration
  isSelected: boolean
  onSelect:   () => void
  onDuplicate: (config: Configuration) => void
}

export function ConfigurationCard({
  config,
  isSelected,
  onSelect,
  onDuplicate,
}: Props) {
  const { mutate: setDefault, isPending: isSettingDefault } =
    useSetDefaultConfiguration()
  const { mutate: deleteConfig, isPending: isDeleting } =
    useDeleteConfiguration()

  return (
    <div
      onClick={onSelect}
      className={cn(
        'group relative flex cursor-pointer flex-col gap-2 rounded-xl border p-3.5 transition-all',
        isSelected
          ? 'border-primary bg-primary/5'
          : 'border-border hover:border-primary/50 hover:bg-muted/30'
      )}
    >
      {/* Identity */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium leading-none">
            {config.structure_name ?? '—'}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {config.structure_sigle ?? '—'}
          </p>
        </div>
        {config.is_default && (
          <Badge
            variant="secondary"
            className="shrink-0 bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400"
          >
            <Star className="size-3" />
            Défaut
          </Badge>
        )}
      </div>

      {/* Actions — visible on hover */}
      <div className={cn(
        'flex items-center gap-1 transition-opacity',
        'opacity-0 group-hover:opacity-100',
      )}>
        {!config.is_default && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-7 gap-1.5 px-2 text-xs text-muted-foreground hover:text-foreground"
            disabled={isSettingDefault}
            onClick={(e) => {
              e.stopPropagation()
              setDefault(config.id)
            }}
          >
            <Star className="size-3" />
            Définir défaut
          </Button>
        )}

        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-7 gap-1.5 px-2 text-xs text-muted-foreground hover:text-foreground"
          onClick={(e) => {
            e.stopPropagation()
            onDuplicate(config)
          }}
        >
          <Copy className="size-3" />
          Dupliquer
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={config.is_default || isDeleting}
          className={cn(
            'h-7 gap-1.5 px-2 text-xs',
            config.is_default
              ? 'cursor-not-allowed opacity-40'
              : 'text-destructive hover:text-destructive'
          )}
          onClick={(e) => {
            e.stopPropagation()
            deleteConfig(config.id)
          }}
        >
          <Trash2 className="size-3" />
          Supprimer
        </Button>
      </div>
    </div>
  )
}