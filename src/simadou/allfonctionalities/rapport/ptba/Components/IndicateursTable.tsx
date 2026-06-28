import { useMemo } from 'react'
import { useGetUnitesIndicateur } from '@/simadou/allHooks/admin/uniteIndicateurHooks'
import type { CadreAnalytique, Ptba } from '@/simadou/allTypes'
import { type IndicateurTache } from '@/simadou/allTypes/indicateurTache'
import { useRapportExportRegistration } from '@/simadou/allfonctionalities/rapport/useRapportExportRegistration'
import { Loader2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { type RapportExportRowMeta } from '../../export/rapportExportTypes'

interface IndicateursTableProps {
  cadresAnalytiques: CadreAnalytique[]
  ptbas: Ptba[]
  indicateurs: IndicateurTache[]
  isLoading: boolean
}

type TreeRow = {
  type: 'cadre' | 'ptba'
  label?: string
  niveau: number
  ptba?: Ptba
  ind?: IndicateurTache
  groupKey?: string
}

export function IndicateursTable({
  cadresAnalytiques,
  ptbas,
  indicateurs,
  isLoading,
}: IndicateursTableProps) {
  const { data: unites = [] } = useGetUnitesIndicateur()

  const indicateursByActivite = useMemo(() => {
    const map = new Map<number, IndicateurTache[]>()

    for (const ptba of ptbas) {
      if (ptba.id_ptba) map.set(ptba.id_ptba, [])
    }

    for (const ind of indicateurs) {
      const id = ind.id_activite
      if (id && map.has(id)) {
        map.get(id)!.push(ind)
      }
    }

    return map
  }, [ptbas, indicateurs])

  /**
   * =========================
   * TREE BUILD (comme TachesTable)
   * =========================
   */
  const rows = useMemo(() => {
    const result: TreeRow[] = []

    const ptbasByCadre = new Map<number, Ptba[]>()

    ptbas.forEach((ptba) => {
      if (typeof ptba.cadre_analytique === 'object' && ptba.cadre_analytique) {
        const id = ptba.cadre_analytique.id_ca
        if (!ptbasByCadre.has(id)) ptbasByCadre.set(id, [])
        ptbasByCadre.get(id)!.push(ptba)
      }
    })

    function children(cadres: CadreAnalytique[], parentId: number) {
      return cadres.filter((c) => {
        if (typeof c.parent_ca === 'object' && c.parent_ca) {
          return c.parent_ca.id_ca === parentId
        }
        return c.parent_ca === parentId
      })
    }

    function cadreHasPtba(cadre: CadreAnalytique): boolean {
      const activites = ptbasByCadre.get(cadre.id_ca) ?? []
      if (activites.length > 0) return true

      const enfants = children(cadresAnalytiques, cadre.id_ca)
      return enfants.some(cadreHasPtba)
    }

    function parcourir(cadre: CadreAnalytique, niveau: number) {
      if (!cadreHasPtba(cadre)) return

      result.push({
        type: 'cadre',
        label: cadre.intutile_ca,
        niveau,
      })

      children(cadresAnalytiques, cadre.id_ca).forEach((c) =>
        parcourir(c, niveau + 1)
      )

      const activites = ptbasByCadre.get(cadre.id_ca) ?? []

      activites.forEach((ptba) => {
        const inds = indicateursByActivite.get(ptba.id_ptba) ?? []

        const groupKey = String(ptba.id_ptba)

        if (inds.length === 0) {
          result.push({
            type: 'ptba',
            ptba,
            niveau,
            groupKey,
          })
        } else {
          inds.forEach((ind) => {
            result.push({
              type: 'ptba',
              ptba,
              niveau,
              groupKey,
              ind,
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
  }, [cadresAnalytiques, ptbas, indicateursByActivite])

  /**
   * =========================
   * GROUP SPAN PTBA
   * =========================
   */
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
        /**
         * =========================
         * CADRE ANALYTIQUE
         * =========================
         */
        if (r.type === 'cadre') {
          exportRows.push([r.label ?? '', '', '', '', '', '', '', ''])

          rowMetas.push({
            type: 'section',
            niveau: r.niveau,
            label: r.label,
          })

          return
        }

        /**
         * =========================
         * PTBA + INDICATEUR
         * =========================
         */

        const unite = unites.find((u) => u.id_unite == r.ind?.unite_ind_tache)

        exportRows.push([
          r.ptba?.code_activite_ptba ?? '',
          r.ptba?.intitule_activite_ptba ?? '',
          r.ind?.intitule_indicateur_tache ?? 'Aucun indicateur',
          ...(unite
            ? [`${unite.definition_ui} (${unite.unite_ui})`]
            : [r.ind?.unite_ind_tache ? String(r.ind.unite_ind_tache) : '']),
          r.ind?.trimestre_1 != null ? String(r.ind.trimestre_1) : '',
          r.ind?.trimestre_2 != null ? String(r.ind.trimestre_2) : '',
          r.ind?.trimestre_3 != null ? String(r.ind.trimestre_3) : '',
          r.ind?.trimestre_4 != null ? String(r.ind.trimestre_4) : '',
        ])

        rowMetas.push({
          type: 'data',
          groupKey: r.ptba?.id_ptba ? String(r.ptba.id_ptba) : undefined,
        })
      })

      return {
        columns: [
          {
            id: 'code',
            header: 'Code',
          },
          {
            id: 'activite',
            header: 'Activité',
          },
          {
            id: 'indicateur',
            header: 'Indicateur',
          },
          {
            id: 'unite',
            header: 'Unité',
          },
          {
            id: 't1',
            header: 'T1',
          },
          {
            id: 't2',
            header: 'T2',
          },
          {
            id: 't3',
            header: 'T3',
          },
          {
            id: 't4',
            header: 'T4',
          },
        ],

        rowMetas,

        rows: exportRows,

        visibleColumnIds: [
          'code',
          'activite',
          'indicateur',
          'unite',
          't1',
          't2',
          't3',
          't4',
        ],
      }
    },
  })

  if (isLoading) return <Loader2 className='animate-spin' />

  return (
    <Card>
      <CardHeader>
        <CardTitle>Indicateurs par cadre analytique</CardTitle>
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Activité</TableHead>
              <TableHead>Indicateur</TableHead>
              <TableHead>Unité</TableHead>
              <TableHead>T1</TableHead>
              <TableHead>T2</TableHead>
              <TableHead>T3</TableHead>
              <TableHead>T4</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {rows.map((row, i) => {
              /**
               * =========================
               * CADRE ROW
               * =========================
               */
              if (row.type === 'cadre') {
                const totalColumns = 8
                const empty = row.niveau
                const span = totalColumns - empty

                return (
                  <TableRow key={i}>
                    {Array.from({ length: empty }).map((_, idx) => (
                      <TableCell key={idx} />
                    ))}
                    <TableCell
                      colSpan={span}
                      className='bg-muted font-semibold'
                    >
                      {row.label}
                    </TableCell>
                  </TableRow>
                )
              }

              /**
               * =========================
               * PTBA + INDICATEUR
               * =========================
               */
              const span = row.groupKey
                ? (groupSpans.get(row.groupKey) ?? 1)
                : 1

              const isFirst = row.groupKey
                ? rows.findIndex(
                    (r) => r.groupKey === row.groupKey && r.type === 'ptba'
                  ) === i
                : true

              const unite = unites.find(
                (u) => u.id_unite == row.ind?.unite_ind_tache
              )

              return (
                <TableRow key={i}>
                  {isFirst && (
                    <TableCell rowSpan={span}>
                      {row.ptba?.code_activite_ptba}
                    </TableCell>
                  )}

                  {isFirst && (
                    <TableCell rowSpan={span}>
                      {row.ptba?.intitule_activite_ptba}
                    </TableCell>
                  )}

                  <TableCell>
                    {row.ind?.intitule_indicateur_tache ?? '—'}
                  </TableCell>

                  <TableCell>
                    {unite
                      ? `${unite.definition_ui} (${unite.unite_ui})`
                      : row.ind?.unite_ind_tache}
                  </TableCell>

                  <TableCell>{row.ind?.trimestre_1 ?? ''}</TableCell>
                  <TableCell>{row.ind?.trimestre_2 ?? ''}</TableCell>
                  <TableCell>{row.ind?.trimestre_3 ?? ''}</TableCell>
                  <TableCell>{row.ind?.trimestre_4 ?? ''}</TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
