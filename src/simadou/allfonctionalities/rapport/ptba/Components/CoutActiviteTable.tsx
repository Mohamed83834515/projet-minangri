import { useMemo } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Loader2, Receipt } from 'lucide-react'
import type { CoutUnitairePtba, Ptba } from '@/simadou/allTypes'
import { cn } from '@/lib/utils'

interface CoutActiviteTableProps {
  ptbas: Ptba[]
  couts: CoutUnitairePtba[]
  isLoading: boolean
  currencyCode?: string
}

const fmt = (v: number) => new Intl.NumberFormat('fr-FR').format(v)

export function CoutActiviteTable({ ptbas, couts, isLoading, currencyCode = 'GNF' }: CoutActiviteTableProps) {
  const coutsByActivite = useMemo(() => {
    const map = new Map<number, CoutUnitairePtba[]>()
    for (const ptba of ptbas) { if (ptba.id_ptba) map.set(ptba.id_ptba, []) }
    for (const cout of couts) {
      const id = typeof cout.ptba_activite === 'number' ? cout.ptba_activite : cout.ptba_activite?.id_ptba
      if (id && map.has(id)) map.get(id)!.push(cout)
    }
    return map
  }, [ptbas, couts])

  // Total général
  const totalGeneral = useMemo(
    () => couts.reduce((s, c) => s + (c.quantite_cu * c.prix_unitaire), 0),
    [couts]
  )

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
          <div className='rounded-lg bg-emerald-500/10 p-1.5'>
            <Receipt className='h-4 w-4 text-emerald-600' />
          </div>
          <CardTitle className='text-sm font-semibold'>Coûts par activité</CardTitle>
          <Badge variant='secondary' className='ml-auto text-xs'>{couts.length} ligne{couts.length > 1 ? 's' : ''}</Badge>
        </div>
      </CardHeader>
      <CardContent className='p-0'>
        <div className='overflow-x-auto'>
          <Table>
            <TableHeader>
              <TableRow className='bg-muted/60 hover:bg-muted/60'>
                <TableHead className='w-20 text-xs font-semibold uppercase tracking-wide text-muted-foreground'>Code</TableHead>
                <TableHead className='min-w-48 text-xs font-semibold uppercase tracking-wide text-muted-foreground'>Activité</TableHead>
                <TableHead className='w-10 text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground'>#</TableHead>
                <TableHead className='min-w-44 text-xs font-semibold uppercase tracking-wide text-muted-foreground'>Intitulé tâche</TableHead>
                <TableHead className='w-20 text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground'>Unité</TableHead>
                <TableHead className='w-24 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground'>Quantité</TableHead>
                <TableHead className='w-36 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground'>Prix unitaire</TableHead>
                <TableHead className='w-36 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground bg-emerald-50/50'>Montant</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ptbas.map((ptba, ptbaIndex) => {
                const activiteId = ptba.id_ptba
                const activiteCouts = activiteId ? coutsByActivite.get(activiteId) || [] : []
                const isEven = ptbaIndex % 2 === 0
                const totalActivite = activiteCouts.reduce((s, c) => s + (c.quantite_cu * c.prix_unitaire), 0)

                if (activiteCouts.length === 0) {
                  return (
                    <TableRow key={ptba.id_ptba} className={cn('border-b', isEven ? 'bg-background' : 'bg-muted/20')}>
                      <TableCell className='py-3 font-mono text-xs text-muted-foreground'>{ptba.code_activite_ptba || '—'}</TableCell>
                      <TableCell className='py-3 text-sm font-medium'>{ptba.intitule_activite_ptba || 'Sans intitulé'}</TableCell>
                      <TableCell colSpan={6} className='py-3 text-center text-xs text-muted-foreground italic'>Aucun coût</TableCell>
                    </TableRow>
                  )
                }

                return [
                  // Lignes de détail
                  ...activiteCouts.map((cout, coutIndex) => {
                    const montant = cout.quantite_cu * cout.prix_unitaire
                    return (
                      <TableRow
                        key={`${ptba.id_ptba}-${cout.id_cout_unitaire || coutIndex}`}
                        className={cn(
                          'border-b transition-colors hover:bg-primary/5',
                          isEven ? 'bg-background' : 'bg-muted/20'
                        )}
                      >
                        {coutIndex === 0 ? (
                          <>
                            <TableCell rowSpan={activiteCouts.length + 1} className='py-3 align-top font-mono text-xs text-muted-foreground border-r border-border/50'>
                              {ptba.code_activite_ptba || '—'}
                            </TableCell>
                            <TableCell rowSpan={activiteCouts.length + 1} className='py-3 align-top text-sm font-semibold border-r border-border/50'>
                              {ptba.intitule_activite_ptba || 'Sans intitulé'}
                            </TableCell>
                          </>
                        ) : null}
                        <TableCell className='py-2.5 text-center text-xs text-muted-foreground'>{cout.ordre || coutIndex + 1}</TableCell>
                        <TableCell className='py-2.5 text-sm'>{cout.intitule_tache || '—'}</TableCell>
                        <TableCell className='py-2.5 text-center'>
                          <span className='inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground'>{cout.unite_cu || '—'}</span>
                        </TableCell>
                        <TableCell className='py-2.5 text-right text-sm tabular-nums'>{fmt(cout.quantite_cu)}</TableCell>
                        <TableCell className='py-2.5 text-right text-sm tabular-nums text-emerald-600 font-medium'>{fmt(cout.prix_unitaire)}</TableCell>
                        <TableCell className='py-2.5 text-right text-sm tabular-nums font-bold text-blue-600 bg-emerald-50/30'>{fmt(montant)}</TableCell>
                      </TableRow>
                    )
                  }),
                  // Ligne total par activité
                  <TableRow key={`${ptba.id_ptba}-total`} className={cn('border-b-2 border-border', isEven ? 'bg-muted/10' : 'bg-muted/30')}>
                    <TableCell colSpan={5} className='py-2 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wide'>
                      Sous-total
                    </TableCell>
                    <TableCell className='py-2 text-right text-sm font-bold text-blue-700 bg-emerald-50/30 tabular-nums'>
                      {fmt(totalActivite)} <span className='text-[10px] font-normal text-muted-foreground'>{currencyCode}</span>
                    </TableCell>
                  </TableRow>
                ]
              })}
            </TableBody>

            {/* Total général */}
            <tfoot>
              <tr className='bg-primary/5 border-t-2 border-primary/20'>
                <td colSpan={7} className='py-3 px-4 text-right text-sm font-bold text-foreground uppercase tracking-wide'>
                  Total général
                </td>
                <td className='py-3 px-4 text-right text-sm font-bold text-primary tabular-nums'>
                  {fmt(totalGeneral)} <span className='text-xs font-normal text-muted-foreground'>{currencyCode}</span>
                </td>
              </tr>
            </tfoot>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}