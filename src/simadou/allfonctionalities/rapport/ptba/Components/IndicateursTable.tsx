import { useMemo } from 'react'
import { useGetUnitesIndicateur } from '@/simadou/allHooks/admin/uniteIndicateurHooks'
import type { Ptba } from '@/simadou/allTypes'
import { type IndicateurTache } from '@/simadou/allTypes/indicateurTache'
import { useRapportExportRegistration } from '@/simadou/allfonctionalities/rapport/useRapportExportRegistration'
import { Loader2, Target } from 'lucide-react'
import { cn } from '@/lib/utils'
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

interface IndicateursTableProps {
  ptbas: Ptba[]
  indicateurs: IndicateurTache[]
  isLoading: boolean
}

function ValeurCell({ value }: { value: any }) {
  if (value === null || value === undefined)
    return <span className='text-muted-foreground'>—</span>
  return <span className='font-medium tabular-nums'>{value}</span>
}

export function IndicateursTable({
  ptbas,
  indicateurs,
  isLoading,
}: IndicateursTableProps) {
  const { data: unites = [] } = useGetUnitesIndicateur()
  const indicateursByActivite = useMemo(() => {
    const map = new Map<number, IndicateurTache[]>()

    for (const ptba of ptbas) {
      if (ptba.id_ptba) {
        map.set(ptba.id_ptba, [])
      }
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
   * EXPORT RAPPORT
   */
  useRapportExportRegistration({
    isLoading,

    buildExportTable: () => {
      const rows: string[][] = []

      for (const ptba of ptbas) {
        const activiteId = ptba.id_ptba

        const activiteIndicateurs = activiteId
          ? (indicateursByActivite.get(activiteId) ?? [])
          : []

        if (activiteIndicateurs.length === 0) {
          rows.push([
            ptba.code_activite_ptba ?? '',
            ptba.intitule_activite_ptba ?? '',
            'Aucun indicateur',
            '',
            '',
            '',
            '',
            '',
          ])

          continue
        }

        for (const ind of activiteIndicateurs) {
          const unite = unites.find((u) => u.id_unite == ind.unite_ind_tache)
          rows.push([
            ptba.code_activite_ptba ?? '',
            ptba.intitule_activite_ptba ?? '',
            ind.intitule_indicateur_tache ?? '',
            ...(unite
              ? [`${unite.definition_ui} (${unite.unite_ui})`]
              : [String(ind.unite_ind_tache)]),
            ind.trimestre_1 != null ? String(ind.trimestre_1) : '',
            ind.trimestre_2 != null ? String(ind.trimestre_2) : '',
            ind.trimestre_3 != null ? String(ind.trimestre_3) : '',
            ind.trimestre_4 != null ? String(ind.trimestre_4) : '',
          ])
        }
      }

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

        rows,

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

  if (isLoading)
    return (
      <div className='flex items-center justify-center py-16'>
        <Loader2 className='h-6 w-6 animate-spin text-muted-foreground' />
      </div>
    )

  if (ptbas.length === 0)
    return (
      <div className='flex flex-col items-center justify-center py-16 text-sm text-muted-foreground'>
        Aucune activité trouvée
      </div>
    )

  return (
    <Card className='border-0 shadow-sm'>
      <CardHeader className='border-b pb-3'>
        <div className='flex items-center gap-2'>
          <div className='rounded-lg bg-violet-500/10 p-1.5'>
            <Target className='h-4 w-4 text-violet-600' />
          </div>
          <CardTitle className='text-sm font-semibold'>
            Indicateurs par activité
          </CardTitle>
          <Badge variant='secondary' className='ml-auto text-xs'>
            {indicateurs.length} indicateur{indicateurs.length > 1 ? 's' : ''}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className='p-0'>
        <div className='overflow-x-auto'>
          <Table className='w-full min-w-full table-auto border-collapse' style={{ tableLayout: 'auto' }}>
            <TableHeader>
              <TableRow className='border-b border-border/60 bg-muted/60 hover:bg-muted/60'>
                <TableHead className='px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground whitespace-normal break-words align-middle border-r border-border/30 last:border-r-0'>
                  Code
                </TableHead>
                <TableHead className='px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground whitespace-normal break-words align-middle border-r border-border/30 last:border-r-0 min-w-48 max-w-[200px]'>
                  Activité
                </TableHead>
                <TableHead className='px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground whitespace-normal break-words align-middle border-r border-border/30 last:border-r-0 min-w-48 max-w-[250px]'>
                  Indicateur
                </TableHead>
                <TableHead className='px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground whitespace-normal break-words align-middle border-r border-border/30 last:border-r-0 text-center'>
                  Unité
                </TableHead>
                <TableHead className='px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground whitespace-normal break-words align-middle border-r border-border/30 last:border-r-0 bg-blue-50/50 text-center'>
                  T1
                </TableHead>
                <TableHead className='px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground whitespace-normal break-words align-middle border-r border-border/30 last:border-r-0 bg-blue-50/50 text-center'>
                  T2
                </TableHead>
                <TableHead className='px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground whitespace-normal break-words align-middle border-r border-border/30 last:border-r-0 bg-blue-50/50 text-center'>
                  T3
                </TableHead>
                <TableHead className='px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground whitespace-normal break-words align-middle border-r border-border/30 last:border-r-0 bg-blue-50/50 text-center'>
                  T4
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {ptbas.map((ptba, ptbaIndex) => {
                const activiteId = ptba.id_ptba
                const activiteIndicateurs = activiteId
                  ? indicateursByActivite.get(activiteId) || []
                  : []
                const isEven = ptbaIndex % 2 === 0

                if (activiteIndicateurs.length === 0) {
                  return (
                    <TableRow
                      key={ptba.id_ptba}
                      className={cn(
                        'border-b border-border/40 last:border-b-0 transition-colors duration-100',
                        isEven ? 'bg-background' : 'bg-muted/20'
                      )}
                    >
                      <TableCell className='px-4 py-2.5 text-sm align-top whitespace-normal break-words border-r border-border/20 last:border-r-0 font-mono text-xs text-muted-foreground'>
                        {ptba.code_activite_ptba || '—'}
                      </TableCell>
                      <TableCell className='px-4 py-2.5 text-sm align-top whitespace-normal break-words border-r border-border/20 last:border-r-0 font-medium max-w-[200px]'>
                        {ptba.intitule_activite_ptba || 'Sans intitulé'}
                      </TableCell>
                      <TableCell
                        colSpan={6}
                        className='px-4 py-2.5 text-sm align-top whitespace-normal break-words border-r border-border/20 last:border-r-0 text-center text-xs text-muted-foreground italic'
                      >
                        Aucun indicateur
                      </TableCell>
                    </TableRow>
                  )
                }

                return activiteIndicateurs.map((ind, indIndex) => (
                  <TableRow
                    key={`${ptba.id_ptba}-${ind.id_indicateur_tache || indIndex}`}
                    className={cn(
                      'border-b border-border/40 last:border-b-0 transition-colors duration-100 hover:bg-primary/5',
                      isEven ? 'bg-background' : 'bg-muted/20'
                    )}
                  >
                    {indIndex === 0 ? (
                      <>
                        <TableCell
                          rowSpan={activiteIndicateurs.length}
                          className='px-4 py-2.5 text-sm align-top whitespace-normal break-words border-r border-border/20 last:border-r-0 font-mono text-xs text-muted-foreground border-r border-border/50'
                        >
                          {ptba.code_activite_ptba || '—'}
                        </TableCell>
                        <TableCell
                          rowSpan={activiteIndicateurs.length}
                          className='px-4 py-2.5 text-sm align-top whitespace-normal break-words border-r border-border/20 last:border-r-0 font-semibold max-w-[200px] border-r border-border/50'
                        >
                          {ptba.intitule_activite_ptba || 'Sans intitulé'}
                        </TableCell>
                      </>
                    ) : null}
                    <TableCell className='px-4 py-2.5 text-sm align-top whitespace-normal break-words border-r border-border/20 last:border-r-0 max-w-[250px]'>
                      {ind.intitule_indicateur_tache || '—'}
                    </TableCell>
                    <TableCell className='px-4 py-2.5 text-sm align-top whitespace-normal break-words border-r border-border/20 last:border-r-0 text-center'>
                      {ind.unite_ind_tache ? (
                        <span className='inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground'>
                          {ind.unite_ind_tache}
                        </span>
                      ) : (
                        <span className='text-sm text-muted-foreground'>—</span>
                      )}
                    </TableCell>
                    <TableCell className='px-4 py-2.5 text-sm align-top whitespace-normal break-words border-r border-border/20 last:border-r-0 bg-blue-50/30 text-center'>
                      <ValeurCell value={ind.trimestre_1} />
                    </TableCell>
                    <TableCell className='px-4 py-2.5 text-sm align-top whitespace-normal break-words border-r border-border/20 last:border-r-0 bg-blue-50/30 text-center'>
                      <ValeurCell value={ind.trimestre_2} />
                    </TableCell>
                    <TableCell className='px-4 py-2.5 text-sm align-top whitespace-normal break-words border-r border-border/20 last:border-r-0 bg-blue-50/30 text-center'>
                      <ValeurCell value={ind.trimestre_3} />
                    </TableCell>
                    <TableCell className='px-4 py-2.5 text-sm align-top whitespace-normal break-words border-r border-border/20 last:border-r-0 bg-blue-50/30 text-center'>
                      <ValeurCell value={ind.trimestre_4} />
                    </TableCell>
                  </TableRow>
                ))
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
