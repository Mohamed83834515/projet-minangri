import { useMemo } from 'react'
import { type ColumnDef } from '@tanstack/react-table'
import { GenericTable } from '@/Global/Generic/Generictable'
import type { CadreLogiqueClcp } from '@/simadou/allTypes/cadreLogiqueClcp'
import type { IndicateurContrat } from '@/simadou/allTypes/indicateurContrat'
import type { NiveauConfigClcp } from '@/simadou/allTypes/niveauConfigClcp'
import {
  getNiveauClcpLabel,
  resolveNiveauClcId,
  sortNiveauxConfigClcp,
} from '@/simadou/lib/cadreLogiqueClcpUtils'
import { resolveClcpId } from '@/simadou/lib/indicateurContratUtils'
import { useRapportExportRegistration } from '@/simadou/allfonctionalities/rapport/useRapportExportRegistration'
import { FileSignature, Loader2 } from 'lucide-react'
import { useEmbeddedTableState } from '@/hooks/use-embedded-table-state'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TableCell, TableRow } from '@/components/ui/table'
import {
  type RapportExportColumn,
  type RapportExportRowMeta,
} from '../export/rapportExportTypes'
import { PREAMBULE_CONTRAT_PERFORMANCE } from './preambuleContratPerformance'

interface Props {
  niveaux: NiveauConfigClcp[]
  cadres: CadreLogiqueClcp[]
  indicateurs: IndicateurContrat[]
  isLoading: boolean
}

type ReportRow = {
  niveauKey: string
  niveauLabel: string
  cadre: CadreLogiqueClcp
  ind?: IndicateurContrat
  groupKey: string
}

function formatCadreLabel(cadre: CadreLogiqueClcp): string {
  return `${cadre.code_clc} : ${cadre.intitule_clc}`
}

/** Nom de fichier lisible à partir de l'URL du moyen de vérification. */
function moyenVerificationLabel(value: unknown): string {
  if (typeof value !== 'string' || !value) return ''
  const last = value.split('/').pop() ?? value
  try {
    return decodeURIComponent(last)
  } catch {
    return last
  }
}

export function ContratPerformanceReportTable({
  niveaux,
  cadres,
  indicateurs,
  isLoading,
}: Props) {
  const { navigate } = useEmbeddedTableState()

  // En-têtes groupés (rendus sur deux lignes par la GenericTable) : la
  // « Chaine des Résultats » couvre niveau + cadre, la « Valeur Cible »
  // couvre les quatre trimestres — comme dans le rapport Word.
  const columns: ColumnDef<ReportRow>[] = [
    {
      id: 'chaine_resultats',
      header: 'Chaine des Résultats',
      columns: [
        {
          id: 'niveau',
          header: 'Niveau',
          accessorFn: (row) => row.niveauLabel,
        },
        {
          id: 'cadre',
          header: 'Code : Intitulé',
          accessorFn: (row) => formatCadreLabel(row.cadre),
        },
      ],
    },
    {
      id: 'indicateur',
      header: 'Indicateurs',
      accessorFn: (row) => row.ind?.intitule_indicateur ?? '',
    },
    {
      id: 'reference',
      header: 'Valeur de référence',
      accessorFn: (row) =>
        row.ind?.valeur_reference != null
          ? String(row.ind.valeur_reference)
          : '',
    },
    {
      id: 'valeur_cible',
      header: 'Valeur Cible',
      columns: [
        {
          id: 't1',
          header: 'T1',
          accessorFn: (row) => row.ind?.cible_t1 ?? '',
        },
        {
          id: 't2',
          header: 'T2',
          accessorFn: (row) => row.ind?.cible_t2 ?? '',
        },
        {
          id: 't3',
          header: 'T3',
          accessorFn: (row) => row.ind?.cible_t3 ?? '',
        },
        {
          id: 't4',
          header: 'T4',
          accessorFn: (row) => row.ind?.cible_t4 ?? '',
        },
      ],
    },
    {
      id: 'moyen_verification',
      header: 'Moyen de Vérification',
      accessorFn: (row) => moyenVerificationLabel(row.ind?.moyen_verification),
    },
  ]

  // Colonnes à plat pour l'export (les groupes sont portés par headerGroups).
  const exportColumns: RapportExportColumn[] = [
    { id: 'niveau', header: 'Niveau' },
    { id: 'cadre', header: 'Code : Intitulé' },
    { id: 'indicateur', header: 'Indicateurs' },
    { id: 'reference', header: 'Valeur de référence' },
    { id: 't1', header: 'T1' },
    { id: 't2', header: 'T2' },
    { id: 't3', header: 'T3' },
    { id: 't4', header: 'T4' },
    { id: 'moyen_verification', header: 'Moyen de Vérification' },
  ]

  const indicateursByCadre = useMemo(() => {
    const map = new Map<number, IndicateurContrat[]>()

    for (const cadre of cadres) {
      map.set(cadre.id_clc, [])
    }

    for (const ind of indicateurs) {
      const id = resolveClcpId(ind.clcp)
      if (id != null && map.has(id)) {
        map.get(id)!.push(ind)
      }
    }

    return map
  }, [cadres, indicateurs])

  /**
   * Une ligne par indicateur, groupée par cadre logique puis par niveau
   * (Objectifs, Résultats, Activités…). Un cadre sans indicateur produit
   * une ligne aux colonnes indicateur vides, comme dans le rapport Word.
   */
  const rows = useMemo(() => {
    const result: ReportRow[] = []

    sortNiveauxConfigClcp(niveaux).forEach((niveau) => {
      const niveauKey = String(niveau.id_niveau_ncl)
      const niveauLabel = getNiveauClcpLabel(niveau)

      const cadresDuNiveau = cadres
        .filter((c) => resolveNiveauClcId(c.niveau_clc) === niveau.id_niveau_ncl)
        .sort((a, b) =>
          a.code_clc.localeCompare(b.code_clc, 'fr', { numeric: true })
        )

      cadresDuNiveau.forEach((cadre) => {
        const inds = indicateursByCadre.get(cadre.id_clc) ?? []
        const groupKey = String(cadre.id_clc)

        if (inds.length === 0) {
          result.push({ niveauKey, niveauLabel, cadre, groupKey })
        } else {
          inds.forEach((ind) => {
            result.push({ niveauKey, niveauLabel, cadre, ind, groupKey })
          })
        }
      })
    })

    return result
  }, [niveaux, cadres, indicateursByCadre])

  /**
   * =========================
   * SPANS (niveau + cadre)
   * =========================
   */
  const { niveauSpans, niveauFirstIndex, cadreSpans, cadreFirstIndex } =
    useMemo(() => {
      const niveauSpans = new Map<string, number>()
      const niveauFirstIndex = new Map<string, number>()
      const cadreSpans = new Map<string, number>()
      const cadreFirstIndex = new Map<string, number>()

      rows.forEach((r, i) => {
        if (!niveauFirstIndex.has(r.niveauKey)) niveauFirstIndex.set(r.niveauKey, i)
        niveauSpans.set(r.niveauKey, (niveauSpans.get(r.niveauKey) ?? 0) + 1)

        if (!cadreFirstIndex.has(r.groupKey)) cadreFirstIndex.set(r.groupKey, i)
        cadreSpans.set(r.groupKey, (cadreSpans.get(r.groupKey) ?? 0) + 1)
      })

      return { niveauSpans, niveauFirstIndex, cadreSpans, cadreFirstIndex }
    }, [rows])

  useRapportExportRegistration({
    isLoading,

    buildExportTable: () => {
      const exportRows: string[][] = []
      const rowMetas: RapportExportRowMeta[] = []

      rows.forEach((r) => {
        exportRows.push([
          r.niveauLabel,
          formatCadreLabel(r.cadre),
          r.ind?.intitule_indicateur ?? '',
          r.ind?.valeur_reference != null
            ? String(r.ind.valeur_reference)
            : '',
          r.ind?.cible_t1 ?? '',
          r.ind?.cible_t2 ?? '',
          r.ind?.cible_t3 ?? '',
          r.ind?.cible_t4 ?? '',
          moyenVerificationLabel(r.ind?.moyen_verification),
        ])

        // Les colonnes niveau et cadre sont fusionnées verticalement
        // par cadre logique dans les exports.
        rowMetas.push({
          type: 'data',
          groupKey: r.groupKey,
        })
      })

      return {
        columns: exportColumns,
        rowMetas,
        rows: exportRows,
        visibleColumnIds: exportColumns.map((c) => c.id),

        // En-têtes fusionnés au-dessus des colonnes, comme le rapport Word.
        headerGroups: [
          { header: 'Chaine des Résultats', columnIds: ['niveau', 'cadre'] },
          { header: 'Valeur Cible', columnIds: ['t1', 't2', 't3', 't4'] },
        ],

        // Préambule : pages en portrait avant le tableau en paysage.
        preamble: PREAMBULE_CONTRAT_PERFORMANCE,
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
          <FileSignature className='h-4 w-4' />

          <CardTitle>Chaine des résultats du contrat</CardTitle>

          <Badge className='ml-auto'>{indicateurs.length}</Badge>
        </div>
      </CardHeader>

      <CardContent>
        <div className='overflow-x-auto'>
          <GenericTable<ReportRow>
            data={rows}
            columns={columns}
            search={{}}
            navigate={navigate}
            showPagination={false}
            defaultPageSize={rows.length}
            showSearch={false}
            showViewOptions={false}
            emptyMessage='Aucun cadre logique pour ce contrat'
            customRowRenderer={(row, i, { rowClassName, cellClassName }) => {
              const isFirstNiveau = niveauFirstIndex.get(row.niveauKey) === i
              const isFirstCadre = cadreFirstIndex.get(row.groupKey) === i

              const moyen = row.ind?.moyen_verification
              const moyenLabel = moyenVerificationLabel(moyen)

              return (
                <TableRow className={rowClassName} key={i}>
                  {isFirstNiveau && (
                    <TableCell
                      className={`${cellClassName(0)} align-top font-bold`}
                      rowSpan={niveauSpans.get(row.niveauKey)}
                    >
                      {row.niveauLabel}
                    </TableCell>
                  )}

                  {isFirstCadre && (
                    <TableCell
                      className={cellClassName(1)}
                      rowSpan={cadreSpans.get(row.groupKey)}
                    >
                      {formatCadreLabel(row.cadre)}
                    </TableCell>
                  )}

                  <TableCell className={cellClassName(2)}>
                    {row.ind?.intitule_indicateur ?? ''}
                  </TableCell>

                  <TableCell className={cellClassName(3)}>
                    {row.ind?.valeur_reference ?? ''}
                  </TableCell>

                  <TableCell className={cellClassName(4)}>
                    {row.ind?.cible_t1 ?? ''}
                  </TableCell>
                  <TableCell className={cellClassName(5)}>
                    {row.ind?.cible_t2 ?? ''}
                  </TableCell>
                  <TableCell className={cellClassName(6)}>
                    {row.ind?.cible_t3 ?? ''}
                  </TableCell>
                  <TableCell className={cellClassName(7)}>
                    {row.ind?.cible_t4 ?? ''}
                  </TableCell>

                  <TableCell className={cellClassName(8)}>
                    {typeof moyen === 'string' && moyen ? (
                      <a
                        href={moyen}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='text-primary underline-offset-4 hover:underline'
                      >
                        {moyenLabel}
                      </a>
                    ) : (
                      ''
                    )}
                  </TableCell>
                </TableRow>
              )
            }}
          />
        </div>
      </CardContent>
    </Card>
  )
}
