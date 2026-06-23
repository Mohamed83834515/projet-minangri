import { useMemo } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Loader2, ListTodo } from 'lucide-react'
import type { TacheActivitePtba, Ptba } from '@/simadou/allTypes'
import { resolveIdActivite } from '@/simadou/allTypes/tacheActivitePtba'
import { cn } from '@/lib/utils'

interface TachesTableProps {
  ptbas: Ptba[]
  taches: TacheActivitePtba[]
  isLoading: boolean
}

export function TachesTable({ ptbas, taches, isLoading }: TachesTableProps) {
  const tachesByActivite = useMemo(() => {
    const map = new Map<number, TacheActivitePtba[]>()
    for (const ptba of ptbas) { if (ptba.id_ptba) map.set(ptba.id_ptba, []) }
    for (const tache of taches) {
      const id = resolveIdActivite(tache)
      if (id && map.has(id)) map.get(id)!.push(tache)
    }
    return map
  }, [ptbas, taches])

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
          <div className='rounded-lg bg-primary/10 p-1.5'>
            <ListTodo className='h-4 w-4 text-primary' />
          </div>
          <CardTitle className='text-sm font-semibold'>Tâches par activité</CardTitle>
          <Badge variant='secondary' className='ml-auto text-xs'>{taches.length} tâche{taches.length > 1 ? 's' : ''}</Badge>
        </div>
      </CardHeader>
      <CardContent className='p-0'>
        <div className='overflow-x-auto'>
          <Table>
            <TableHeader>
              <TableRow className='bg-muted/60 hover:bg-muted/60'>
                <TableHead className='w-32 text-xs font-semibold uppercase tracking-wide text-muted-foreground'>Code</TableHead>
                <TableHead className='min-w-52 text-xs font-semibold uppercase tracking-wide text-muted-foreground'>Activité</TableHead>
                <TableHead className='min-w-48 text-xs font-semibold uppercase tracking-wide text-muted-foreground'>Intitulé tâche</TableHead>
                <TableHead className='w-24 text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground'>Proportion</TableHead>
                <TableHead className='w-24 text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground'>N° Lot</TableHead>
                <TableHead className='w-28 text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground'>Date début</TableHead>
                <TableHead className='w-28 text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground'>Date fin</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ptbas.map((ptba, ptbaIndex) => {
                const activiteId = ptba.id_ptba
                const activiteTaches = activiteId ? tachesByActivite.get(activiteId) || [] : []
                const isEven = ptbaIndex % 2 === 0

                if (activiteTaches.length === 0) {
                  return (
                    <TableRow key={ptba.id_ptba} className={cn('border-b', isEven ? 'bg-background' : 'bg-muted/20')}>
                      <TableCell className='py-3 font-mono text-xs text-muted-foreground'>{ptba.code_activite_ptba || '—'}</TableCell>
                      <TableCell className='py-3 text-sm font-medium'>{ptba.intitule_activite_ptba || 'Sans intitulé'}</TableCell>
                      <TableCell colSpan={5} className='py-3 text-center text-xs text-muted-foreground italic'>Aucune tâche</TableCell>
                    </TableRow>
                  )
                }

                return activiteTaches.map((tache, tacheIndex) => (
                  <TableRow
                    key={`${ptba.id_ptba}-${tache.id_groupe_tache || tacheIndex}`}
                    className={cn(
                      'border-b transition-colors hover:bg-primary/5',
                      isEven ? 'bg-background' : 'bg-muted/20'
                    )}
                  >
                    {/* Code + Activité : affiché seulement sur la première ligne */}
                    {tacheIndex === 0 ? (
                      <>
                        <TableCell
                          rowSpan={activiteTaches.length}
                          className='py-3 align-top font-mono text-xs text-muted-foreground border-r border-border/50'
                        >
                          {ptba.code_activite_ptba || '—'}
                        </TableCell>
                        <TableCell
                          rowSpan={activiteTaches.length}
                          className='py-3 align-top text-sm font-semibold border-r border-border/50'
                        >
                          {ptba.intitule_activite_ptba || 'Sans intitulé'}
                        </TableCell>
                      </>
                    ) : null}
                    <TableCell className='py-2.5 text-sm'>{tache.intutile_tache_gt || '—'}</TableCell>
                    <TableCell className='py-2.5 text-center text-sm'>
                      {tache.proportion_gt
                        ? <span className='inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700 border border-blue-100'>{tache.proportion_gt}</span>
                        : <span className='text-muted-foreground'>—</span>
                      }
                    </TableCell>
                    <TableCell className='py-2.5 text-center text-sm text-muted-foreground'>{tache.n_lot_gt || '—'}</TableCell>
                    <TableCell className='py-2.5 text-center text-sm text-muted-foreground'>
                      {tache.date_debut_gt ? new Date(tache.date_debut_gt).toLocaleDateString('fr-FR') : '—'}
                    </TableCell>
                    <TableCell className='py-2.5 text-center text-sm text-muted-foreground'>
                      {tache.date_fin_gt ? new Date(tache.date_fin_gt).toLocaleDateString('fr-FR') : '—'}
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