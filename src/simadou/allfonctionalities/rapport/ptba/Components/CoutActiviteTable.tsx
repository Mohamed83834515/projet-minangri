import { useMemo } from 'react'
import type {
  CoutUnitairePtba,
  Ptba,
  CadreAnalytique,
} from '@/simadou/allTypes'
import { Loader2, Receipt } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
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
import { useRapportExportRegistration } from '../../useRapportExportRegistration'

interface Props {
  cadresAnalytiques: CadreAnalytique[]
  ptbas: Ptba[]
  couts: CoutUnitairePtba[]
  isLoading: boolean
  currencyCode?: string
}

type TreeRow = {
  type: 'cadre' | 'ptba'
  label?: string
  niveau: number
  ptba?: Ptba
  cout?: CoutUnitairePtba
  groupKey?: string
}

const fmt = (v: number) => new Intl.NumberFormat('fr-FR').format(v)

export function CoutActiviteTable({
  cadresAnalytiques,
  ptbas,
  couts,
  isLoading,
  currencyCode = 'GNF',
}: Props) {
  const rows = useMemo(() => {
    const coutsByActivite = new Map<number, CoutUnitairePtba[]>()

    ptbas.forEach((p) => {
      coutsByActivite.set(p.id_ptba, [])
    })

    couts.forEach((c) => {
      const id =
        typeof c.ptba_activite === 'number'
          ? c.ptba_activite
          : c.ptba_activite?.id_ptba

      if (id && coutsByActivite.has(id)) {
        coutsByActivite.get(id)!.push(c)
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
        if (typeof c.parent_ca === 'object' && c.parent_ca)
          return c.parent_ca.id_ca === parentId

        return c.parent_ca === parentId
      })
    }

    function cadreHasPtba(cadre: CadreAnalytique): boolean {
      const activites = ptbasByCadre.get(cadre.id_ca) ?? []

      if (activites.length > 0) return true

      return children(cadre.id_ca).some(cadreHasPtba)
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
        const activiteCouts = coutsByActivite.get(ptba.id_ptba) ?? []

        const groupKey = String(ptba.id_ptba)

        if (activiteCouts.length === 0) {
          result.push({
            type: 'ptba',
            niveau,
            ptba,
            groupKey,
          })
        } else {
          activiteCouts.forEach((cout) => {
            result.push({
              type: 'ptba',
              niveau,
              ptba,
              cout,
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
  }, [cadresAnalytiques, ptbas, couts])

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
          exportRows.push([r.label ?? '', '', '', '', '', '', '', ''])

          rowMetas.push({
            type: 'section',
            niveau: r.niveau,
            label: r.label,
          })
        } else {
          exportRows.push([
            r.ptba?.code_activite_ptba ?? '',
            r.ptba?.intitule_activite_ptba ?? '',
            r.cout ? String(r.cout.ordre ?? '') : '',
            r.cout?.intitule_tache ?? '',
            r.cout?.unite_cu ?? '',
            r.cout ? fmt(r.cout.quantite_cu) : '',
            r.cout ? fmt(r.cout.prix_unitaire) : '',
            r.cout
              ? fmt(r.cout.quantite_cu * r.cout.prix_unitaire)
              : 'Aucun coût',
          ])

          rowMetas.push({
            type: 'data',
            groupKey: r.groupKey,
          })
        }
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
            id: 'ordre',
            header: '#',
          },
          {
            id: 'tache',
            header: 'Intitulé tâche',
          },
          {
            id: 'unite',
            header: 'Unité',
          },
          {
            id: 'quantite',
            header: 'Quantité',
          },
          {
            id: 'prix',
            header:
              `Prix unitaire ${currencyCode ? `(${currencyCode})` : ''}`.trim(),
          },
          {
            id: 'montant',
            header: `Montant ${currencyCode ? `(${currencyCode})` : ''}`.trim(),
          },
        ],
        rowMetas,
        rows: exportRows,
        visibleColumnIds: [
          'code',
          'activite',
          'ordre',
          'tache',
          'unite',
          'quantite',
          'prix',
          'montant',
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
          <Receipt className='h-4 w-4' />

          <CardTitle>Coûts par activité</CardTitle>

          <Badge className='ml-auto'>{couts.length}</Badge>
        </div>
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Activité</TableHead>
              <TableHead>#</TableHead>
              <TableHead>Intitulé tâche</TableHead>
              <TableHead>Unité</TableHead>
              <TableHead>Quantité</TableHead>
              <TableHead>Prix unitaire</TableHead>
              <TableHead>Montant</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {rows.map((row, i) => {
              if (row.type === 'cadre') {
                const total = 8
                const empty = row.niveau

                return (
                  <TableRow key={i}>
                    {Array.from({
                      length: empty,
                    }).map((_, x) => (
                      <TableCell key={x} className='bg-muted/40' />
                    ))}

                    <TableCell
                      colSpan={total - empty}
                      className='bg-muted font-semibold'
                    >
                      {row.label}
                    </TableCell>
                  </TableRow>
                )
              }

              const span = row.groupKey
                ? (groupSpans.get(row.groupKey) ?? 1)
                : 1

              const first =
                rows.findIndex((r) => r.groupKey === row.groupKey) === i

              return (
                <TableRow key={i}>
                  {first && (
                    <TableCell rowSpan={span}>
                      {row.ptba?.code_activite_ptba}
                    </TableCell>
                  )}

                  {first && (
                    <TableCell rowSpan={span}>
                      {row.ptba?.intitule_activite_ptba}
                    </TableCell>
                  )}

                  <TableCell>{row.cout?.ordre}</TableCell>
                  <TableCell>{row.cout?.intitule_tache}</TableCell>
                  <TableCell>{row.cout?.unite_cu}</TableCell>
                  <TableCell>{row.cout && fmt(row.cout.quantite_cu)}</TableCell>
                  <TableCell>
                    {row.cout && fmt(row.cout.prix_unitaire)}
                  </TableCell>

                  <TableCell>
                    {row.cout
                      ? fmt(row.cout.quantite_cu * row.cout.prix_unitaire)
                      : 'Aucun coût'}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
