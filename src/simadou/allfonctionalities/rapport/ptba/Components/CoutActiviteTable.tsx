import { useMemo } from 'react'
import type { CoutUnitairePtba, Ptba } from '@/simadou/allTypes'
import { Loader2, Receipt } from 'lucide-react'
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
import { useRapportExportRegistration } from '../../useRapportExportRegistration'

interface CoutActiviteTableProps {
  ptbas: Ptba[]
  couts: CoutUnitairePtba[]
  isLoading: boolean
  currencyCode?: string
}

const fmt = (v: number) => new Intl.NumberFormat('fr-FR').format(v)

export function CoutActiviteTable({
  ptbas,
  couts,
  isLoading,
  currencyCode = 'GNF',
}: CoutActiviteTableProps) {
  const coutsByActivite = useMemo(() => {
    const map = new Map<number, CoutUnitairePtba[]>()
    for (const ptba of ptbas) {
      if (ptba.id_ptba) map.set(ptba.id_ptba, [])
    }
    for (const cout of couts) {
      const id =
        typeof cout.ptba_activite === 'number'
          ? cout.ptba_activite
          : cout.ptba_activite?.id_ptba
      if (id && map.has(id)) map.get(id)!.push(cout)
    }
    return map
  }, [ptbas, couts])

  useRapportExportRegistration({
    isLoading,

    buildExportTable: () => {
      const rows: string[][] = []

      for (const ptba of ptbas) {
        const activiteId = ptba.id_ptba

        const activiteCouts = activiteId
          ? (coutsByActivite.get(activiteId) ?? [])
          : []

        if (activiteCouts.length === 0) {
          rows.push([
            ptba.code_activite_ptba ?? '',
            ptba.intitule_activite_ptba ?? '',
            '',
            'Aucun coût',
            '',
            '',
            '',
            '',
          ])

          continue
        }

        for (const [index, cout] of activiteCouts.entries()) {
          const montant = cout.quantite_cu * cout.prix_unitaire

          rows.push([
            ptba.code_activite_ptba ?? '',
            ptba.intitule_activite_ptba ?? '',
            String(cout.ordre ?? index + 1),
            cout.intitule_tache ?? '',
            cout.unite_cu ?? '',
            fmt(cout.quantite_cu),
            fmt(cout.prix_unitaire),
            fmt(montant),
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
            header: 'Prix unitaire',
          },
          {
            id: 'montant',
            header: 'Montant',
          },
        ],

        rows,

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

  // Total général
  const totalGeneral = useMemo(
    () => couts.reduce((s, c) => s + c.quantite_cu * c.prix_unitaire, 0),
    [couts]
  )

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
          <div className='rounded-lg bg-emerald-500/10 p-1.5'>
            <Receipt className='h-4 w-4 text-emerald-600' />
          </div>
          <CardTitle className='text-sm font-semibold'>
            Coûts par activité
          </CardTitle>
          <Badge variant='secondary' className='ml-auto text-xs'>
            {couts.length} ligne{couts.length > 1 ? 's' : ''}
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
                <TableHead className='px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground whitespace-normal break-words align-middle border-r border-border/30 last:border-r-0 text-center'>
                  #
                </TableHead>
                <TableHead className='px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground whitespace-normal break-words align-middle border-r border-border/30 last:border-r-0 min-w-44 max-w-[250px]'>
                  Intitulé tâche
                </TableHead>
                <TableHead className='px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground whitespace-normal break-words align-middle border-r border-border/30 last:border-r-0 text-center'>
                  Unité
                </TableHead>
                <TableHead className='px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground whitespace-normal break-words align-middle border-r border-border/30 last:border-r-0 text-right'>
                  Quantité
                </TableHead>
                <TableHead className='px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground whitespace-normal break-words align-middle border-r border-border/30 last:border-r-0 text-right'>
                  Prix unitaire
                </TableHead>
                <TableHead className='px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground whitespace-normal break-words align-middle border-r border-border/30 last:border-r-0 bg-emerald-50/50 text-right'>
                  Montant
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {ptbas.map((ptba, ptbaIndex) => {
                const activiteId = ptba.id_ptba
                const activiteCouts = activiteId
                  ? coutsByActivite.get(activiteId) || []
                  : []
                const isEven = ptbaIndex % 2 === 0
                const totalActivite = activiteCouts.reduce(
                  (s, c) => s + c.quantite_cu * c.prix_unitaire,
                  0
                )

                if (activiteCouts.length === 0) {
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
                        Aucun coût
                      </TableCell>
                    </TableRow>
                  )
                }

                return [
                  ...activiteCouts.map((cout, coutIndex) => {
                    const montant = cout.quantite_cu * cout.prix_unitaire
                    return (
                      <TableRow
                        key={`${ptba.id_ptba}-${cout.id_cout_unitaire || coutIndex}`}
                        className={cn(
                          'border-b border-border/40 last:border-b-0 transition-colors duration-100 hover:bg-primary/5',
                          isEven ? 'bg-background' : 'bg-muted/20'
                        )}
                      >
                        {coutIndex === 0 ? (
                          <>
                            <TableCell
                              rowSpan={activiteCouts.length + 1}
                              className='px-4 py-2.5 text-sm align-top whitespace-normal break-words border-r border-border/20 last:border-r-0 font-mono text-xs text-muted-foreground border-r border-border/50'
                            >
                              {ptba.code_activite_ptba || '—'}
                            </TableCell>
                            <TableCell
                              rowSpan={activiteCouts.length + 1}
                              className='px-4 py-2.5 text-sm align-top whitespace-normal break-words border-r border-border/20 last:border-r-0 font-semibold max-w-[200px] border-r border-border/50'
                            >
                              {ptba.intitule_activite_ptba || 'Sans intitulé'}
                            </TableCell>
                          </>
                        ) : null}
                        <TableCell className='px-4 py-2.5 text-sm align-top whitespace-normal break-words border-r border-border/20 last:border-r-0 text-center text-xs text-muted-foreground'>
                          {cout.ordre || coutIndex + 1}
                        </TableCell>
                        <TableCell className='px-4 py-2.5 text-sm align-top whitespace-normal break-words border-r border-border/20 last:border-r-0 max-w-[250px]'>
                          {cout.intitule_tache || '—'}
                        </TableCell>
                        <TableCell className='px-4 py-2.5 text-sm align-top whitespace-normal break-words border-r border-border/20 last:border-r-0 text-center'>
                          <span className='inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground'>
                            {cout.unite_cu || '—'}
                          </span>
                        </TableCell>
                        <TableCell className='px-4 py-2.5 text-sm align-top whitespace-normal break-words border-r border-border/20 last:border-r-0 text-right tabular-nums'>
                          {fmt(cout.quantite_cu)}
                        </TableCell>
                        <TableCell className='px-4 py-2.5 text-sm align-top whitespace-normal break-words border-r border-border/20 last:border-r-0 text-right font-medium text-emerald-600 tabular-nums'>
                          {fmt(cout.prix_unitaire)}
                        </TableCell>
                        <TableCell className='px-4 py-2.5 text-sm align-top whitespace-normal break-words border-r border-border/20 last:border-r-0 bg-emerald-50/30 text-right font-bold text-blue-600 tabular-nums'>
                          {fmt(montant)}
                        </TableCell>
                      </TableRow>
                    )
                  }),
                  <TableRow
                    key={`${ptba.id_ptba}-total`}
                    className={cn(
                      'border-b border-border/40 last:border-b-0 transition-colors duration-100',
                      isEven ? 'bg-muted/10' : 'bg-muted/30'
                    )}
                  >
                    <TableCell
                      colSpan={5}
                      className='px-4 py-2.5 text-sm align-top whitespace-normal break-words border-r border-border/20 last:border-r-0 text-right text-xs font-semibold tracking-wide text-muted-foreground uppercase'
                    >
                      Sous-total
                    </TableCell>
                    <TableCell className='px-4 py-2.5 text-sm align-top whitespace-normal break-words border-r border-border/20 last:border-r-0 bg-emerald-50/30 text-right font-bold text-blue-700 tabular-nums'>
                      {fmt(totalActivite)}{' '}
                      <span className='text-[10px] font-normal text-muted-foreground'>
                        {currencyCode}
                      </span>
                    </TableCell>
                  </TableRow>,
                ]
              })}
            </TableBody>

            <tfoot>
              <tr className='border-t-2 border-primary/20 bg-primary/5'>
                <td
                  colSpan={7}
                  className='px-4 py-2.5 text-sm align-top whitespace-normal break-words border-r border-border/20 last:border-r-0 text-right font-bold tracking-wide text-foreground uppercase'
                >
                  Total général
                </td>
                <td className='px-4 py-2.5 text-sm align-top whitespace-normal break-words border-r border-border/20 last:border-r-0 text-right font-bold text-primary tabular-nums'>
                  {fmt(totalGeneral)}{' '}
                  <span className='text-xs font-normal text-muted-foreground'>
                    {currencyCode}
                  </span>
                </td>
              </tr>
            </tfoot>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
