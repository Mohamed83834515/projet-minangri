import { type ColumnDef } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { DataTableColumnHeader } from '@/components/data-table'
import { cn } from '@/lib/utils'
import type { TacheActivitePtba } from '@/simadou/allTypes'
import {
  getSuiviTableDisplayFields,
  type SuiviTacheActivite,
} from '@/simadou/allTypes/suiviTacheActivite'

export type SuiviTacheTableRow = TacheActivitePtba & {
  suivi?: SuiviTacheActivite
}

export type SuiviTacheColumnHandlers = {
  onSuivre: (tache: TacheActivitePtba, suivi?: SuiviTacheActivite) => void
}

const colWide = 'max-w-[220px] whitespace-normal'

function formatDateRealisation(value: string | undefined | null): string {
  if (!value?.trim()) return '—'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return value
  return d.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export function buildSuiviTacheColumns(
  handlers: SuiviTacheColumnHandlers
): ColumnDef<SuiviTacheTableRow>[] {
  const { onSuivre } = handlers

  const tacheColumn: ColumnDef<SuiviTacheTableRow> = {
    id: 'tache',
    accessorKey: 'intutile_tache_gt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Tâche' />
    ),
    cell: ({ row }) => {
      const tache = row.original
      return (
        <div className={cn('flex items-start gap-2.5', colWide)}>
          <span className='mt-0.5 shrink-0 text-sm font-semibold text-muted-foreground'>
            {row.index + 1}.
          </span>
          <div className='min-w-0 space-y-0.5'>
            <p className='font-medium leading-snug'>{tache.intutile_tache_gt}</p>
            {tache.code_tache_gt && (
              <p className='text-xs text-muted-foreground'>
                {tache.code_tache_gt}
              </p>
            )}
          </div>
        </div>
      )
    },
    meta: { thClassName: 'ps-4', className: 'ps-4' },
    enableSorting: false,
    enableHiding: false,
  }

  const lotColumn: ColumnDef<SuiviTacheTableRow> = {
    id: 'lot',
    accessorKey: 'n_lot_gt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Lot' />
    ),
    cell: ({ row }) => (
      <span className='tabular-nums'>{row.original.n_lot_gt}</span>
    ),
    meta: { thClassName: 'text-center', className: 'text-center' },
    enableSorting: false,
    enableHiding: false,
  }

  const proportionColumn: ColumnDef<SuiviTacheTableRow> = {
    id: 'proportion',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='P%' />
    ),
    cell: ({ row }) => {
      const raw = row.original.proportion_gt?.trim()
      if (!raw) {
        return <span className='text-muted-foreground'>—</span>
      }
      const label = raw.endsWith('%') ? raw : `${raw}%`
      return <span className='font-semibold tabular-nums'>{label}</span>
    },
    meta: { thClassName: 'text-center', className: 'text-center' },
    enableSorting: false,
    enableHiding: false,
  }

  const dateColumn: ColumnDef<SuiviTacheTableRow> = {
    id: 'date_realisation',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Date réalisation' />
    ),
    cell: ({ row }) => {
      const { dateRealisation } = getSuiviTableDisplayFields(row.original.suivi)
      return (
        <span className='whitespace-nowrap text-muted-foreground'>
          {formatDateRealisation(dateRealisation)}
        </span>
      )
    },
    meta: {
      thClassName: 'min-w-[120px] text-center',
      className: 'min-w-[120px] text-center',
    },
    enableSorting: false,
    enableHiding: false,
  }

  const valideColumn: ColumnDef<SuiviTacheTableRow> = {
    id: 'valide',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Validé' />
    ),
    cell: ({ row }) => {
      const { valide } = getSuiviTableDisplayFields(row.original.suivi)
      if (valide === undefined) {
        return <span className='text-muted-foreground'>—</span>
      }
      return (
        <Badge
          variant={valide ? 'default' : 'secondary'}
          className='min-w-[48px] justify-center'
        >
          {valide ? 'Oui' : 'Non'}
        </Badge>
      )
    },
    meta: { thClassName: 'text-center', className: 'text-center' },
    enableSorting: false,
    enableHiding: false,
  }

  const suiviActionColumn: ColumnDef<SuiviTacheTableRow> = {
    id: 'suivi_action',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Suivi' />
    ),
    cell: ({ row }) => {
      const tache = row.original
      const suivi = tache.suivi
      return (
        <Button
          variant='outline'
          size='sm'
          className='h-8 min-w-[84px] px-2.5'
          onClick={() => onSuivre(tache, suivi)}
        >
          {suivi ? 'Modifier' : 'Suivre'}
        </Button>
      )
    },
    meta: { thClassName: 'text-center', className: 'text-center' },
    enableSorting: false,
    enableHiding: false,
  }

  const observationColumn: ColumnDef<SuiviTacheTableRow> = {
    id: 'observation',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Observation' />
    ),
    cell: ({ row }) => {
      const { observation } = getSuiviTableDisplayFields(row.original.suivi)
      return (
        <p
          className={cn(
            colWide,
            'line-clamp-3 text-muted-foreground leading-relaxed'
          )}
          title={observation}
        >
          {observation || '—'}
        </p>
      )
    },
    meta: { thClassName: 'pe-4', className: 'pe-4' },
    enableSorting: false,
    enableHiding: false,
  }

  return [
    tacheColumn,
    lotColumn,
    proportionColumn,
    dateColumn,
    valideColumn,
    suiviActionColumn,
    observationColumn,
  ]
}
