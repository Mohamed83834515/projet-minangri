import { useState } from 'react'
import { Check, ChevronDown, Folders, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { Projet } from '@/simadou/allTypes/projet'
import { useProjetStore } from '@/stores/projet-store'

interface ProjetSwitcherProps {
  onHeader?: boolean
}

function projetLabel(projet: Projet): string {
  return projet.sigle_projet?.trim() || projet.code_projet || 'Projet inconnu'
}

export function ProjetSwitcher({ onHeader = false }: ProjetSwitcherProps) {
  const activeProjet = useProjetStore((s) => s.activeProjet)
  const projets = useProjetStore((s) => s.projets)
  const setActiveProjet = useProjetStore((s) => s.setActiveProjet)
  const [open, setOpen] = useState(false)

  const isLoading = projets.length === 0 && !activeProjet

  const handleSelect = (projet: Projet) => {
    if (projet.id_projet === activeProjet?.id_projet) {
      setOpen(false)
      return
    }
    setActiveProjet(projet)
    setOpen(false)
  }

  const triggerLabel = activeProjet
    ? projetLabel(activeProjet)
    : 'Projet'

  const triggerTitle = activeProjet
    ? `${activeProjet.intitule_projet} (${activeProjet.code_projet})`
    : 'Sélectionner un projet'

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant='outline'
          size='sm'
          className={cn(
            'flex max-w-[220px] items-center gap-2 shadow-sm transition-colors',
            onHeader ? 'hover:brightness-110' : 'hover:brightness-[0.98]'
          )}
          disabled={isLoading}
          title={triggerTitle}
          style={
            onHeader
              ? {
                  color: 'var(--header-text)',
                  borderColor:
                    'color-mix(in srgb, var(--chart-color-3) 55%, transparent)',
                  backgroundColor:
                    'color-mix(in srgb, var(--chart-color-3) 18%, rgba(255,255,255,0.08))',
                  boxShadow:
                    '0 0 0 1px color-mix(in srgb, var(--chart-color-3) 30%, transparent)',
                }
              : {
                  borderColor:
                    'color-mix(in srgb, var(--chart-color-3) 45%, transparent)',
                  backgroundColor:
                    'color-mix(in srgb, var(--chart-color-3) 10%, transparent)',
                  boxShadow:
                    '0 0 0 1px color-mix(in srgb, var(--chart-color-3) 20%, transparent)',
                }
          }
        >
          {isLoading ? (
            <Loader2
              className='h-4 w-4 shrink-0 animate-spin'
              style={
                onHeader ? { color: 'var(--header-text)' } : undefined
              }
            />
          ) : (
            <Folders
              className='h-4 w-4 shrink-0'
              style={{
                color: onHeader
                  ? 'var(--chart-color-3)'
                  : 'var(--chart-color-3)',
              }}
            />
          )}
          <span className='truncate text-xs font-semibold'>{triggerLabel}</span>
          <ChevronDown className='h-3 w-3 shrink-0 opacity-50' />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align='end' className='w-80'>
        <DropdownMenuLabel className='text-xs font-normal text-muted-foreground'>
          Projet actif
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {projets.length === 0 && (
          <div className='px-3 py-4 text-center text-sm text-muted-foreground'>
            Aucun projet disponible
          </div>
        )}

        {projets.map((projet) => {
          const isActive =
            activeProjet?.id_projet === projet.id_projet
          return (
            <DropdownMenuItem
              key={projet.id_projet}
              onClick={() => handleSelect(projet)}
              className={cn(
                'my-0.5 flex cursor-pointer flex-col items-start gap-1 rounded-md p-3',
                isActive && 'bg-primary/10 ring-1 ring-primary/25'
              )}
            >
              <div className='flex w-full items-center justify-between gap-2'>
                <div className='flex min-w-0 items-center gap-2'>
                  {isActive && (
                    <Check className='h-3.5 w-3.5 shrink-0 text-primary' />
                  )}
                  <span className='truncate text-sm font-semibold'>
                    {projet.sigle_projet} | {projet.code_projet}
                  </span>
                </div>
              </div>
              <span
                className={cn(
                  'line-clamp-2 text-xs',
                  isActive ? 'text-foreground' : 'text-muted-foreground'
                )}
              >
                {projet.intitule_projet}
              </span>
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
