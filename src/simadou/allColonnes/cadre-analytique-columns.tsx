import { type ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '@/components/data-table'
import { LongText } from '@/components/others/long-text'
import { buildEditDeleteActionsColumn } from '@/Global/Tableaux/buildEditDeleteActionsColumn'
import type { Acteur } from '@/simadou/allTypes/acteur'
import type { CadreAnalytique } from '@/simadou/allTypes/cadreAnalytique'
import {
  resolveParentCaId,
  resolvePartenaireCaId,
} from '@/simadou/lib/cadreAnalytiqueUtils'

function formatCoutAxe(value: number | undefined): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    maximumFractionDigits: 0,
  }).format(value ?? 0)
}

function resolveParentCadre(
  row: CadreAnalytique,
  cadres: CadreAnalytique[]
): CadreAnalytique | null {
  const parentId = resolveParentCaId(row.parent_ca)
  if (parentId == null) return null
  return cadres.find((c) => c.id_ca === parentId) ?? null
}

export function buildCadreAnalytiqueColumns({
  cadres,
  acteurs = [],
  onEdit,
  onDeleteRequest,
}: {
  cadres: CadreAnalytique[]
  acteurs?: Pick<Acteur, 'id_acteur' | 'nom_acteur' | 'code_acteur'>[]
  onEdit: (row: CadreAnalytique) => void
  onDeleteRequest: (row: CadreAnalytique) => void
}): ColumnDef<CadreAnalytique>[] {
  const actionsColumn = buildEditDeleteActionsColumn({
    onEdit,
    onDeleteRequest,
  })

  return [
    {
      id: 'code_ca',
      accessorKey: 'code_ca',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Code' />
      ),
      cell: ({ row }) => (
        <span className='font-mono text-sm'>{row.original.code_ca}</span>
      ),
      enableHiding: false,
    },
    {
      id: 'intutile_ca',
      accessorKey: 'intutile_ca',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Libellé' />
      ),
      cell: ({ row }) => (
        <div>
          <div className='font-medium'>{row.original.intutile_ca}</div>
          {row.original.abgrege_ca ? (
            <div className='text-xs text-muted-foreground'>
              {row.original.abgrege_ca}
            </div>
          ) : null}
        </div>
      ),
      enableHiding: false,
    },
    {
      id: 'cout_axe',
      accessorKey: 'cout_axe',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Coût axe' />
      ),
      cell: ({ row }) => (
        <span className='whitespace-nowrap tabular-nums text-sm'>
          {formatCoutAxe(row.original.cout_axe)}
        </span>
      ),
      enableHiding: false,
    },
    {
      id: 'parent_ca',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Parent' />
      ),
      cell: ({ row }) => {
        const parent = resolveParentCadre(row.original, cadres)
        if (!parent) {
          return <span className='text-sm italic text-muted-foreground'>Racine</span>
        }
        return (
          <div>
            <LongText className='max-w-xs font-medium'>{parent.intutile_ca}</LongText>
            <div className='text-xs text-muted-foreground'>{parent.code_ca}</div>
          </div>
        )
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      id: 'partenaire_ca',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Partenaire' />
      ),
      cell: ({ row }) => {
        const id = resolvePartenaireCaId(row.original.partenaire_ca)
        const acteur = id == null ? null : acteurs.find((a) => a.id_acteur === id)

        if (!acteur) {
          return (
            <span className='text-sm text-muted-foreground'>Non défini</span>
          )
        }

        return (
          <div>
            <div className='font-medium'>{acteur.nom_acteur}</div>
            {acteur.code_acteur ? (
              <div className='text-xs text-muted-foreground'>
                {acteur.code_acteur}
              </div>
            ) : null}
          </div>
        )
      },
      enableSorting: false,
      enableHiding: false,
    },
    actionsColumn,
  ]
}
