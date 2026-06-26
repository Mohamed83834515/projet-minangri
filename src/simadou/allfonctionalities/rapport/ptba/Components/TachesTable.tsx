import { useMemo } from 'react'
import type { TacheActivitePtba, Ptba } from '@/simadou/allTypes'
import { resolveIdActivite } from '@/simadou/allTypes/tacheActivitePtba'
import { useRapportExportRegistration } from '@/simadou/allfonctionalities/rapport/useRapportExportRegistration'
import { Loader2, ListTodo } from 'lucide-react'
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

interface TachesTableProps {
  ptbas: Ptba[]

  taches: TacheActivitePtba[]

  isLoading: boolean
}

export function TachesTable({ ptbas, taches, isLoading }: TachesTableProps) {
  const tachesByActivite = useMemo(() => {
    const map = new Map<number, TacheActivitePtba[]>()

    for (const ptba of ptbas) {
      if (ptba.id_ptba) {
        map.set(ptba.id_ptba, [])
      }
    }

    for (const tache of taches) {
      const id = resolveIdActivite(tache)

      if (id && map.has(id)) {
        map.get(id)!.push(tache)
      }
    }

    return map
  }, [ptbas, taches])

  /**
   * EXPORT RAPPORT
   */
  useRapportExportRegistration({
    isLoading,

    buildExportTable: () => {
      const rows: string[][] = []

      for (const ptba of ptbas) {
        const activiteId = ptba.id_ptba

        const activiteTaches = activiteId
          ? (tachesByActivite.get(activiteId) ?? [])
          : []

        if (activiteTaches.length === 0) {
          rows.push([
            ptba.code_activite_ptba ?? '',
            ptba.intitule_activite_ptba ?? '',
            'Aucune tâche',
            '',
            '',
            '',
            '',
          ])

          continue
        }

        for (const tache of activiteTaches) {
          rows.push([
            ptba.code_activite_ptba ?? '',
            ptba.intitule_activite_ptba ?? '',
            tache.intutile_tache_gt ?? '',
            tache.proportion_gt ? String(tache.proportion_gt) : '',
            tache.n_lot_gt ? String(tache.n_lot_gt) : '',
            tache.date_debut_gt
              ? new Date(tache.date_debut_gt).toLocaleDateString('fr-FR')
              : '',
            tache.date_fin_gt
              ? new Date(tache.date_fin_gt).toLocaleDateString('fr-FR')
              : '',
          ])
        }
      }

      return {
        columns: [
          {
            id: 'code_activite',
            header: 'Code',
          },
          {
            id: 'activite',
            header: 'Activité',
          },
          {
            id: 'tache',
            header: 'Intitulé tâche',
          },
          {
            id: 'proportion',
            header: 'Proportion',
          },
          {
            id: 'lot',
            header: 'N° Lot',
          },
          {
            id: 'date_debut',
            header: 'Date début',
          },
          {
            id: 'date_fin',
            header: 'Date fin',
          },
        ],

        rows,

        visibleColumnIds: [
          'code_activite',
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
          <div className='rounded-lg bg-primary/10 p-1.5'>
            <ListTodo className='h-4 w-4 text-primary' />
          </div>

          <CardTitle className='text-sm font-semibold'>
            Tâches par activité
          </CardTitle>

          <Badge variant='secondary' className='ml-auto text-xs'>
            {taches.length} tâche{taches.length > 1 ? 's' : ''}
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
                <TableHead className='px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground whitespace-normal break-words align-middle border-r border-border/30 last:border-r-0 min-w-44 max-w-[250px]'>
                  Intitulé tâche
                </TableHead>
                <TableHead className='px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground whitespace-normal break-words align-middle border-r border-border/30 last:border-r-0 text-center'>
                  Proportion
                </TableHead>
                <TableHead className='px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground whitespace-normal break-words align-middle border-r border-border/30 last:border-r-0 text-center'>
                  N° Lot
                </TableHead>
                <TableHead className='px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground whitespace-normal break-words align-middle border-r border-border/30 last:border-r-0 text-center'>
                  Date début
                </TableHead>
                <TableHead className='px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground whitespace-normal break-words align-middle border-r border-border/30 last:border-r-0 text-center'>
                  Date fin
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {ptbas.map((ptba, index) => {
                const activiteTaches = ptba.id_ptba
                  ? (tachesByActivite.get(ptba.id_ptba) ?? [])
                  : []
                const isEven = index % 2 === 0

                if (activiteTaches.length === 0) {
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
                        colSpan={5}
                        className='px-4 py-2.5 text-sm align-top whitespace-normal break-words border-r border-border/20 last:border-r-0 text-center text-xs text-muted-foreground italic'
                      >
                        Aucune tâche
                      </TableCell>
                    </TableRow>
                  )
                }

                return activiteTaches.map((tache, i) => (
                  <TableRow
                    key={`${ptba.id_ptba}-${i}`}
                    className={cn(
                      'border-b border-border/40 last:border-b-0 transition-colors duration-100 hover:bg-primary/5',
                      isEven ? 'bg-background' : 'bg-muted/20'
                    )}
                  >
                    {i === 0 ? (
                      <>
                        <TableCell
                          rowSpan={activiteTaches.length}
                          className='px-4 py-2.5 text-sm align-top whitespace-normal break-words border-r border-border/20 last:border-r-0 font-mono text-xs text-muted-foreground border-r border-border/50'
                        >
                          {ptba.code_activite_ptba || '—'}
                        </TableCell>
                        <TableCell
                          rowSpan={activiteTaches.length}
                          className='px-4 py-2.5 text-sm align-top whitespace-normal break-words border-r border-border/20 last:border-r-0 font-semibold max-w-[200px] border-r border-border/50'
                        >
                          {ptba.intitule_activite_ptba || 'Sans intitulé'}
                        </TableCell>
                      </>
                    ) : null}
                    <TableCell className='px-4 py-2.5 text-sm align-top whitespace-normal break-words border-r border-border/20 last:border-r-0 max-w-[250px]'>
                      {tache.intutile_tache_gt || '—'}
                    </TableCell>
                    <TableCell className='px-4 py-2.5 text-sm align-top whitespace-normal break-words border-r border-border/20 last:border-r-0 text-center'>
                      <span className='inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium'>
                        {tache.proportion_gt || '—'}
                      </span>
                    </TableCell>
                    <TableCell className='px-4 py-2.5 text-sm align-top whitespace-normal break-words border-r border-border/20 last:border-r-0 text-center font-mono text-sm'>
                      {tache.n_lot_gt || '—'}
                    </TableCell>
                    <TableCell className='px-4 py-2.5 text-sm align-top whitespace-normal break-words border-r border-border/20 last:border-r-0 text-center font-mono text-sm'>
                      {tache.date_debut_gt
                        ? new Date(tache.date_debut_gt).toLocaleDateString('fr-FR')
                        : '—'}
                    </TableCell>
                    <TableCell className='px-4 py-2.5 text-sm align-top whitespace-normal break-words border-r border-border/20 last:border-r-0 text-center font-mono text-sm'>
                      {tache.date_fin_gt
                        ? new Date(tache.date_fin_gt).toLocaleDateString('fr-FR')
                        : '—'}
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
