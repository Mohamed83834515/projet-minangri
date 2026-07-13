import { type ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '@/components/data-table'
import { buildEditDeleteActionsColumn } from '@/Global/Tableaux/buildEditDeleteActionsColumn'
import type { CadreLogiqueClcp } from '@/simadou/allTypes/cadreLogiqueClcp'
import type { IndicateurContrat } from '@/simadou/allTypes/indicateurContrat'
import { resolveClcpLabel } from '@/simadou/lib/indicateurContratUtils'

export function buildIndicateurContratColumns({
  cadres,
  onEdit,
  onDeleteRequest,
  hideClcpColumn = false,
}: {
  cadres: CadreLogiqueClcp[]
  onEdit: (row: IndicateurContrat) => void
  onDeleteRequest: (row: IndicateurContrat) => void
  hideClcpColumn?: boolean
}): ColumnDef<IndicateurContrat>[] {
  const actionsColumn = buildEditDeleteActionsColumn({
    onEdit,
    onDeleteRequest,
  })

  return [
    {
      id: 'intitule_indicateur',
      accessorKey: 'intitule_indicateur',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Intitulé' />
      ),
      cell: ({ row }) => (
        <div className='font-medium'>{row.original.intitule_indicateur}</div>
      ),
      enableHiding: false,
    },
    ...(hideClcpColumn
      ? []
      : [
          {
            id: 'clcp',
            accessorKey: 'clcp',
            header: ({ column }) => (
              <DataTableColumnHeader column={column} title='Cadre logique' />
            ),
            cell: ({ row }) => (
              <span className='text-sm'>
                {resolveClcpLabel(row.original.clcp, cadres)}
              </span>
            ),
            enableHiding: false,
          } satisfies ColumnDef<IndicateurContrat>,
        ]),
    {
      id: 'valeur_reference',
      accessorKey: 'valeur_reference',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Valeur réf.' />
      ),
      cell: ({ row }) => (
        <span className='font-mono text-sm'>
          {row.original.valeur_reference}
        </span>
      ),
      enableHiding: false,
    },
    {
      id: 'cibles',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Cibles T1–T4' />
      ),
      cell: ({ row }) => (
        <span className='text-xs text-muted-foreground'>
          {row.original.cible_t1} / {row.original.cible_t2} /{' '}
          {row.original.cible_t3} / {row.original.cible_t4}
        </span>
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      id: 'moyen_verification',
      accessorKey: 'moyen_verification',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Moyen vérif.' />
      ),
      cell: ({ row }) => {
        const url = row.original.moyen_verification
        if (!url || typeof url !== 'string') return '—'
        return (
          <a
            href={url}
            target='_blank'
            rel='noopener noreferrer'
            className='text-sm text-primary underline-offset-4 hover:underline'
          >
            Voir
          </a>
        )
      },
      enableSorting: false,
      enableHiding: false,
    },
    actionsColumn,
  ]
}
