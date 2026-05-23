import { type ColumnDef } from '@tanstack/react-table'
import { ClipboardList } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DataTableColumnHeader } from '@/components/data-table'
import { buildColumns } from '@/Global/Tableaux/column-builder'
import type { Ptba, TacheActivitePtba } from '@/simadou/allTypes'
import TacheAvancementProgressBar from '@/simadou/allfonctionalities/suivi-ptba/TacheAvancementProgressBar'

export type SuiviPtbaColumnHandlers = {
  onOpenSuivi: (activite: Ptba) => void
  onOpenObservations: (activite: Ptba) => void
  tachesByActivite: Map<number, TacheActivitePtba[]>
  avancementByActivite: Map<number, number>
  progressLoading: boolean
}

export function buildSuiviPtbaColumns(
  handlers: SuiviPtbaColumnHandlers
): ColumnDef<Ptba>[] {
  const {
    onOpenSuivi,
    onOpenObservations,
    tachesByActivite,
    avancementByActivite,
    progressLoading,
  } = handlers

  const baseColumns = buildColumns<Ptba>([
    {
      type: 'text',
      key: 'code_activite_ptba',
      title: 'Code',
      sticky: true,
    },
    {
      type: 'text',
      key: 'intitule_activite_ptba',
      title: 'Activité',
      maxWidth: 'max-w-md',
    },
    { type: 'plain', key: 'version_ptba', title: 'Version PTBA' },
  ])

  const suiviColumn: ColumnDef<Ptba> = {
    id: 'suivi',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title='Suivi'
        className='w-full text-center'
      />
    ),
    cell: ({ row }) => {
      const activite = row.original
      return (
        <Button
          type='button'
          variant='ghost'
          size='icon'
          className='mx-auto flex h-8 w-8 shrink-0 text-primary'
          onClick={() => onOpenSuivi(activite)}
          aria-label='Ouvrir le suivi des tâches et indicateurs'
          title='Suivi des tâches et indicateurs'
        >
          <ClipboardList className='h-5 w-5' />
        </Button>
      )
    },
    meta: {
      thClassName: 'text-center w-[72px]',
      className: 'text-center align-middle',
    },
    size: 72,
    enableSorting: false,
    enableHiding: false,
  }

  const avancementColumn: ColumnDef<Ptba> = {
    id: 'avancement_taches',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Avancement des tâches' />
    ),
    cell: ({ row }) => {
      const id = row.original.id_ptba
      if (progressLoading) {
        return (
          <div className='h-2 max-w-[120px] animate-pulse rounded-full bg-muted' />
        )
      }
      if ((tachesByActivite.get(id) ?? []).length === 0) {
        return <span className='text-xs text-muted-foreground'>—</span>
      }
      return (
        <TacheAvancementProgressBar
          percent={avancementByActivite.get(id) ?? 0}
          compact
        />
      )
    },
    enableSorting: false,
    enableHiding: false,
  }

  const observationsColumn: ColumnDef<Ptba> = {
    id: 'observations',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Observations' />
    ),
    cell: ({ row }) => (
      <Button
        type='button'
        variant='link'
        className='h-auto p-0 text-xs'
        onClick={() => onOpenObservations(row.original)}
      >
        Observations
      </Button>
    ),
    enableSorting: false,
    enableHiding: false,
  }

  return [...baseColumns, suiviColumn, avancementColumn, observationsColumn]
}
