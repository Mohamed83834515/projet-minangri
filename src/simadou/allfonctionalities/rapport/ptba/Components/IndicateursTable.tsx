import { useMemo } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Loader2, Target } from 'lucide-react'
import type { Ptba } from '@/simadou/allTypes'
import { IndicateurTache } from '@/simadou/allTypes/indicateurTache'
import { cn } from '@/lib/utils'

interface IndicateursTableProps {
  ptbas: Ptba[]
  indicateurs: IndicateurTache[]
  isLoading: boolean
}

function ValeurCell({ value }: { value: any }) {
  if (value === null || value === undefined) return <span className='text-muted-foreground'>—</span>
  return <span className='font-medium tabular-nums'>{value}</span>
}

export function IndicateursTable({ ptbas, indicateurs, isLoading }: IndicateursTableProps) {
  const indicateursByActivite = useMemo(() => {
    const map = new Map<number, IndicateurTache[]>()
    for (const ptba of ptbas) { if (ptba.id_ptba) map.set(ptba.id_ptba, []) }
    for (const ind of indicateurs) {
      const id = ind.id_activite
      if (id && map.has(id)) map.get(id)!.push(ind)
    }
    return map
  }, [ptbas, indicateurs])

  if (isLoading) return (
    <div className='flex items-center justify-center py-16'>
      <Loader2 className='h-6 w-6 animate-spin text-muted-foreground' />
    </div>
  )

  if (ptbas.length === 0) return (
    <div className='flex flex-col items-center justify-center py-16 text-muted-foreground text-sm'>
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
          <CardTitle className='text-sm font-semibold'>Indicateurs par activité</CardTitle>
          <Badge variant='secondary' className='ml-auto text-xs'>{indicateurs.length} indicateur{indicateurs.length > 1 ? 's' : ''}</Badge>
        </div>
      </CardHeader>
      <CardContent className='p-0'>
        <div className='overflow-x-auto'>
          <Table>
            <TableHeader>
              <TableRow className='bg-muted/60 hover:bg-muted/60'>
                <TableHead className='w-32 text-xs font-semibold uppercase tracking-wide text-muted-foreground'>Code</TableHead>
                <TableHead className='min-w-52 text-xs font-semibold uppercase tracking-wide text-muted-foreground'>Activité</TableHead>
                <TableHead className='min-w-48 text-xs font-semibold uppercase tracking-wide text-muted-foreground'>Indicateur</TableHead>
                <TableHead className='w-24 text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground'>Unité</TableHead>
                <TableHead className='w-20 text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground bg-blue-50/50'>T1</TableHead>
                <TableHead className='w-20 text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground bg-blue-50/50'>T2</TableHead>
                <TableHead className='w-20 text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground bg-blue-50/50'>T3</TableHead>
                <TableHead className='w-20 text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground bg-blue-50/50'>T4</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ptbas.map((ptba, ptbaIndex) => {
                const activiteId = ptba.id_ptba
                const activiteIndicateurs = activiteId ? indicateursByActivite.get(activiteId) || [] : []
                const isEven = ptbaIndex % 2 === 0

                if (activiteIndicateurs.length === 0) {
                  return (
                    <TableRow key={ptba.id_ptba} className={cn('border-b', isEven ? 'bg-background' : 'bg-muted/20')}>
                      <TableCell className='py-3 font-mono text-xs text-muted-foreground'>{ptba.code_activite_ptba || '—'}</TableCell>
                      <TableCell className='py-3 text-sm font-medium'>{ptba.intitule_activite_ptba || 'Sans intitulé'}</TableCell>
                      <TableCell colSpan={6} className='py-3 text-center text-xs text-muted-foreground italic'>Aucun indicateur</TableCell>
                    </TableRow>
                  )
                }

                return activiteIndicateurs.map((ind, indIndex) => (
                  <TableRow
                    key={`${ptba.id_ptba}-${ind.id_indicateur_tache || indIndex}`}
                    className={cn(
                      'border-b transition-colors hover:bg-primary/5',
                      isEven ? 'bg-background' : 'bg-muted/20'
                    )}
                  >
                    {indIndex === 0 ? (
                      <>
                        <TableCell rowSpan={activiteIndicateurs.length} className='py-3 align-top font-mono text-xs text-muted-foreground border-r border-border/50'>
                          {ptba.code_activite_ptba || '—'}
                        </TableCell>
                        <TableCell rowSpan={activiteIndicateurs.length} className='py-3 align-top text-sm font-semibold border-r border-border/50'>
                          {ptba.intitule_activite_ptba || 'Sans intitulé'}
                        </TableCell>
                      </>
                    ) : null}
                    <TableCell className='py-2.5 text-sm'>{ind.intitule_indicateur_tache || '—'}</TableCell>
                    <TableCell className='py-2.5 text-center'>
                      {ind.unite_ind_tache
                        ? <span className='inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground'>{ind.unite_ind_tache}</span>
                        : <span className='text-muted-foreground text-sm'>—</span>
                      }
                    </TableCell>
                    <TableCell className='py-2.5 text-center text-sm bg-blue-50/30'><ValeurCell value={ind.trimestre_1} /></TableCell>
                    <TableCell className='py-2.5 text-center text-sm bg-blue-50/30'><ValeurCell value={ind.trimestre_2} /></TableCell>
                    <TableCell className='py-2.5 text-center text-sm bg-blue-50/30'><ValeurCell value={ind.trimestre_3} /></TableCell>
                    <TableCell className='py-2.5 text-center text-sm bg-blue-50/30'><ValeurCell value={ind.trimestre_4} /></TableCell>
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