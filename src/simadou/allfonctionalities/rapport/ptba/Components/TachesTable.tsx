import { useMemo } from 'react'
import { type ColumnDef } from '@tanstack/react-table'
import { GenericTable } from '@/Global/Generic/Generictable'
import type {
  TacheActivitePtba,
  Ptba,
  CadreAnalytique,
} from '@/simadou/allTypes'
import { resolveIdActivite } from '@/simadou/allTypes/tacheActivitePtba'
import { useRapportExportRegistration } from '@/simadou/allfonctionalities/rapport/useRapportExportRegistration'
import { Loader2, ListTodo } from 'lucide-react'
import { useEmbeddedTableState } from '@/hooks/use-embedded-table-state'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TableCell, TableRow } from '@/components/ui/table'
import { type RapportExportRowMeta } from '../../export/rapportExportTypes'

interface Props {
  cadresAnalytiques: CadreAnalytique[]
  ptbas: Ptba[]
  taches: TacheActivitePtba[]
  isLoading: boolean
}

type TreeRow = {
  type: 'cadre' | 'ptba'
  label?: string
  niveau: number
  ptba?: Ptba
  tache?: TacheActivitePtba
  groupKey?: string
}

export function TachesTable({
  cadresAnalytiques,
  ptbas,
  taches,
  isLoading,
}: Props) {
  const { navigate } = useEmbeddedTableState()

  const columns: ColumnDef<TreeRow>[] = [
    {
      accessorKey: 'code',
      id: 'code',
      header: 'Code',
    },
    {
      accessorKey: 'activite',
      id: 'activite',
      header: 'Activité',
    },
    {
      accessorKey: 'tache',
      id: 'tache',
      header: 'Intitulé tâche',
    },
    {
      accessorKey: 'proportion',
      id: 'proportion',
      header: 'Proportion',
    },
    {
      accessorKey: 'lot',
      id: 'lot',
      header: 'N° Lot',
    },
    {
      accessorKey: 'date_debut',
      id: 'date_debut',
      header: 'Date début',
    },
    {
      accessorKey: 'date_fin',
      id: 'date_fin',
      header: 'Date fin',
    },
  ]

  const rows = useMemo(() => {
    const tachesByActivite = new Map<number, TacheActivitePtba[]>()

    ptbas.forEach((p) => tachesByActivite.set(p.id_ptba, []))

    taches.forEach((t) => {
      const id = resolveIdActivite(t)
      if (id && tachesByActivite.has(id)) {
        tachesByActivite.get(id)!.push(t)
      }
    })

    const ptbasByCadre = new Map<number, Ptba[]>()

    ptbas.forEach((ptba) => {
      if (typeof ptba.cadre_analytique === 'object' && ptba.cadre_analytique) {
        const id = ptba.cadre_analytique.id_ca
        if (!ptbasByCadre.has(id)) ptbasByCadre.set(id, [])
        ptbasByCadre.get(id)!.push(ptba)
      }
    })

    const result: TreeRow[] = []

    function children(parentId: number) {
      return cadresAnalytiques.filter((c) => {
        if (typeof c.parent_ca === 'object' && c.parent_ca) {
          return c.parent_ca.id_ca === parentId
        }
        return c.parent_ca === parentId
      })
    }

    function cadreHasPtba(cadre: CadreAnalytique): boolean {
      const activites = ptbasByCadre.get(cadre.id_ca) ?? []
      if (activites.length > 0) return true

      const enfants = children(cadre.id_ca)
      return enfants.some(cadreHasPtba)
    }

    function parcourir(cadre: CadreAnalytique, niveau: number) {
      if (!cadreHasPtba(cadre)) return

      result.push({
        type: 'cadre',
        label: cadre.intutile_ca,
        niveau,
      })

      children(cadre.id_ca).forEach((c) => parcourir(c, niveau + 1))

      const activites = ptbasByCadre.get(cadre.id_ca) ?? []

      activites.forEach((ptba) => {
        const activiteTaches = tachesByActivite.get(ptba.id_ptba) ?? []

        // GROUP KEY
        const groupKey = String(ptba.id_ptba)

        if (activiteTaches.length === 0) {
          result.push({
            type: 'ptba',
            niveau,
            ptba,
            groupKey,
          })
        } else {
          activiteTaches.forEach((tache) => {
            result.push({
              type: 'ptba',
              niveau,
              ptba,
              tache,
              groupKey,
            })
          })
        }
      })
    }

    cadresAnalytiques
      .filter((c) => c.parent_ca === null)
      .filter(cadreHasPtba)
      .forEach((c) => parcourir(c, 0))

    return result
  }, [cadresAnalytiques, ptbas, taches])

  const groupSpans = useMemo(() => {
    const map = new Map<string, number>()

    rows.forEach((r) => {
      if (r.type !== 'ptba') return
      if (!r.groupKey) return

      map.set(r.groupKey, (map.get(r.groupKey) ?? 0) + 1)
    })

    return map
  }, [rows])

  useRapportExportRegistration({
    isLoading,

    buildExportTable: () => {
      const exportRows: string[][] = []
      const rowMetas: RapportExportRowMeta[] = []

      rows.forEach((r) => {
        if (r.type === 'cadre') {
          exportRows.push([r.label ?? '', '', '', '', '', '', ''])

          rowMetas.push({
            type: 'section',
            niveau: r.niveau,
            label: r.label,
          })
        } else {
          exportRows.push([
            r.ptba?.code_activite_ptba ?? '',
            r.ptba?.intitule_activite_ptba ?? '',
            r.tache?.intutile_tache_gt ?? '',
            r.tache?.proportion_gt ? String(r.tache.proportion_gt) : '',
            r.tache?.n_lot_gt ? String(r.tache.n_lot_gt) : '',
            r.tache?.date_debut_gt
              ? new Date(r.tache.date_debut_gt).toLocaleDateString('fr-FR')
              : '',
            r.tache?.date_fin_gt
              ? new Date(r.tache.date_fin_gt).toLocaleDateString('fr-FR')
              : '',
          ])
          rowMetas.push({
            type: 'data',
            groupKey: r.ptba?.id_ptba ? String(r.ptba?.id_ptba) : undefined,
          })
        }
      })

      return {
        columns: columns.map((c) => ({
          id: c.id as string,
          header: c.header as string,
        })),

        rowMetas,
        rows: exportRows,

        visibleColumnIds: [
          'code',
          'activite',
          'tache',
          'proportion',
          'lot',
          'date_debut',
          'date_fin',
        ],
      }
    },
  })

  if (isLoading)
    return (
      <div className='flex justify-center py-16'>
        <Loader2 className='animate-spin' />
      </div>
    )

  return (
    <Card>
      <CardHeader>
        <div className='flex items-center gap-2'>
          <ListTodo className='h-4 w-4' />

          <CardTitle>Tâches par cadre analytique</CardTitle>

          <Badge className='ml-auto'>{taches.length}</Badge>
        </div>
      </CardHeader>

      <CardContent>
        <div className='overflow-x-auto'>
          <GenericTable<TreeRow>
            data={rows}
            columns={columns}
            search={{}}
            navigate={navigate}
            showPagination={false}
            defaultPageSize={rows.length}
            showSearch={false}
            showViewOptions={false}
            customRowRenderer={(row, i, { rowClassName, cellClassName }) => {
              if (row.type === 'cadre') {
                const emptyColumns = row.niveau
                const spanColumns = columns.length - emptyColumns

                return (
                  <TableRow className={`${rowClassName} font-bold`} key={i}>
                    {Array.from({ length: emptyColumns }).map((_, index) => (
                      <TableCell key={index} className={cellClassName} />
                    ))}
                    <TableCell colSpan={spanColumns} className={cellClassName}>
                      {row.label}
                    </TableCell>
                  </TableRow>
                )
              }

              if (row.type === 'ptba') {
                const span = row.groupKey
                  ? (groupSpans.get(row.groupKey) ?? 1)
                  : 1

                const isFirst = row.groupKey
                  ? rows.findIndex(
                      (r) => r.groupKey === row.groupKey && r.type === 'ptba'
                    ) === i
                  : true

                return (
                  <TableRow className={rowClassName} key={i}>
                    {isFirst && (
                      <TableCell className={cellClassName} rowSpan={span}>
                        {row.ptba?.code_activite_ptba}
                      </TableCell>
                    )}

                    {isFirst && (
                      <TableCell className={cellClassName} rowSpan={span}>
                        {row.ptba?.intitule_activite_ptba}
                      </TableCell>
                    )}

                    <TableCell className={cellClassName}>
                      {row.tache?.intutile_tache_gt}
                    </TableCell>
                    <TableCell className={cellClassName}>
                      {row.tache?.proportion_gt}
                    </TableCell>
                    <TableCell className={cellClassName}>
                      {row.tache?.n_lot_gt}
                    </TableCell>

                    <TableCell className={cellClassName}>
                      {row.tache?.date_debut_gt
                        ? new Date(row.tache.date_debut_gt).toLocaleDateString(
                            'fr-FR'
                          )
                        : ''}
                    </TableCell>

                    <TableCell className={cellClassName}>
                      {row.tache?.date_fin_gt
                        ? new Date(row.tache.date_fin_gt).toLocaleDateString(
                            'fr-FR'
                          )
                        : ''}
                    </TableCell>
                  </TableRow>
                )
              }

              return null
            }}
          />
        </div>
      </CardContent>
    </Card>
  )
}
