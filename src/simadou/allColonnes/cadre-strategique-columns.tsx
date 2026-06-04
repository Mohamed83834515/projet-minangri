import { type ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '@/components/data-table'
import { LongText } from '@/components/others/long-text'
import { buildEditDeleteActionsColumn } from '@/Global/Tableaux/buildEditDeleteActionsColumn'
import type { Acteur } from '@/simadou/allTypes/acteur'
import type { CadreStrategique } from '@/simadou/allTypes/cadreStrategique'
import {
  resolveParentCsId,
  resolvePartenaireCsId,
} from '@/simadou/lib/cadreStrategiqueUtils'

function resolveParentCadre(
  row: CadreStrategique,
  cadres: CadreStrategique[]
): CadreStrategique | null {
  const parentId = resolveParentCsId(row.parent_cs)
  if (parentId == null) return null
  return cadres.find((c) => c.id_cs === parentId) ?? null
}

export function buildCadreStrategiqueColumns({
  cadres,
  acteurs = [],
  onEdit,
  onDeleteRequest,
}: {
  cadres: CadreStrategique[]
  acteurs?: Pick<Acteur, 'id_acteur' | 'nom_acteur' | 'code_acteur'>[]
  onEdit: (row: CadreStrategique) => void
  onDeleteRequest: (row: CadreStrategique) => void
}): ColumnDef<CadreStrategique>[] {
  const actionsColumn = buildEditDeleteActionsColumn({
    onEdit,
    onDeleteRequest,
  })

  return [
    {
      id: 'code_cs',
      accessorKey: 'code_cs',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Code' />
      ),
      cell: ({ row }) => (
        <span className='font-mono text-sm'>{row.original.code_cs}</span>
      ),
      enableHiding: false,
    },
    {
      id: 'intutile_cs',
      accessorKey: 'intutile_cs',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Libellé' />
      ),
      cell: ({ row }) => (
        <div>
          <div className='font-medium'>{row.original.intutile_cs}</div>
          {row.original.abgrege_cs ? (
            <div className='text-xs text-muted-foreground'>
              {row.original.abgrege_cs}
            </div>
          ) : null}
        </div>
      ),
      enableHiding: false,
    },
    {
      id: 'parent_cs',
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
            <LongText className='max-w-xs font-medium'>{parent.intutile_cs}</LongText>
            <div className='text-xs text-muted-foreground'>{parent.code_cs}</div>
          </div>
        )
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      id: 'partenaire_cs',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Partenaire' />
      ),
      cell: ({ row }) => {
        const id = resolvePartenaireCsId(row.original.partenaire_cs)
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
