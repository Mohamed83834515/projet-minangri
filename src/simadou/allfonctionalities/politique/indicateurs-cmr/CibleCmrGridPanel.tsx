import { useCallback, useEffect, useMemo, useState } from 'react'
import { Loader2, Save, X } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { useActiveProgramme } from '@/hooks/use-active-programme'
import type { CibleCmrProjet, IndicateurCmr } from '@/simadou/allTypes'
import { useGetNiveauxLocalite } from '@/simadou/allHooks/admin/niveauLocaliteHooks'
import { useGetLocalites } from '@/simadou/allHooks/admin/sharedHooks'
import {
  buildCibleCmrGridKey,
  buildCibleCmrGridState,
  buildCiblePayloadFromGridCell,
  filterCiblesForIndicateurCmrId,
  getLocalitesNiveau1,
  getProgrammeYearRange,
  parseGridCellValue,
  type CibleCmrGridCell,
} from '@/simadou/lib/cibleCmrGridUtils'
import { resolveFixedCodeIndicateurCrpFromCmr } from '@/simadou/allfonctionalities/projets/detail/cmrIndicators/cmrIndicateurFormUtils'
import {
  useCreateCibleCmr,
  useDeleteCibleCmr,
  useGetAllCiblesCmr,
  useUpdateCibleCmr,
} from '@/simadou/allHooks/admin/indicateurCmrHooks'

const SCROLL_MODE_THRESHOLD = 8
const YEAR_SCROLL_THRESHOLD = 10
const ZONE_COLUMN_MIN_PX    = 120
const YEAR_COLUMN_MIN_PX    = 64

type Props = {
  indicateur: IndicateurCmr
  onClose?: () => void
}

export default function CibleCmrGridPanel({ indicateur, onClose }: Props) {
  const programme = useActiveProgramme()
  const { data: localites = [], isLoading: isLoadingLocalites } = useGetLocalites()
  const { data: niveaux   = [], isLoading: isLoadingNiveaux   } = useGetNiveauxLocalite()
  const { data: allCibles = [], isLoading: isLoadingCibles    } = useGetAllCiblesCmr()

  const createMutation = useCreateCibleCmr(undefined)
  const updateMutation = useUpdateCibleCmr(undefined)
  const deleteMutation = useDeleteCibleCmr(undefined)

  const indicateurCrpId = useMemo(
    () => resolveFixedCodeIndicateurCrpFromCmr(indicateur),
    [indicateur]
  )

  const zones  = useMemo(() => getLocalitesNiveau1(localites, niveaux), [localites, niveaux])
  const years  = useMemo(() => getProgrammeYearRange(programme),        [programme])

  const filteredCibles = useMemo(
    () => filterCiblesForIndicateurCmrId(allCibles, indicateurCrpId),
    [allCibles, indicateurCrpId]
  )

  // ← IDs numériques (pas les codes)
  const zoneIds = useMemo(() => zones.map((z) => z.id_loca as number), [zones])

  const initialGrid = useMemo(
    () => buildCibleCmrGridState({ cibles: filteredCibles, zoneIds, years }),
    [filteredCibles, zoneIds, years]
  )

  const [grid,       setGrid      ] = useState<Record<string, CibleCmrGridCell>>(initialGrid)
  const [isSavingAll, setIsSavingAll] = useState(false)
  const [dirtyKeys,  setDirtyKeys ] = useState<Set<string>>(new Set())

  const filledCount = useMemo(
    () => Object.values(grid).filter((c) => c?.value !== '' && c?.value != null).length,
    [grid]
  )

  useEffect(() => { setGrid(initialGrid) }, [initialGrid])

  const useScrollMode        = zones.length > SCROLL_MODE_THRESHOLD
  const needsHorizontalScroll = years.length > YEAR_SCROLL_THRESHOLD

  // ── Changement cellule ────────────────────────────────────────────────────────
  const handleCellChange = useCallback((zoneId: number, year: number, value: string) => {
    const key = buildCibleCmrGridKey(zoneId, year)
    setGrid((prev) => ({ ...prev, [key]: { ...prev[key], value } }))
    setDirtyKeys((prev) => new Set(prev).add(key))
  }, [])

  // ── Enregistrement ────────────────────────────────────────────────────────────
  const handleSave = async () => {
    setIsSavingAll(true)
    const operations: Promise<CibleCmrProjet | void>[] = []
    let toProcess = 0

    for (const zone of zones) {
      const zoneId = zone.id_loca as number
      for (const year of years) {
        const key        = buildCibleCmrGridKey(zoneId, year)
        const cell       = grid[key]
        const parsed     = parseGridCellValue(cell?.value ?? '')
        const existingId = cell?.cibleId

        if (parsed == null) {
          if (existingId != null) {
            toProcess++
            operations.push(deleteMutation.mutateAsync(existingId))
          }
          continue
        }

        toProcess++
        const payload = buildCiblePayloadFromGridCell({
          zoneId,
          year,
          value:           parsed,
          indicateurCmrId: indicateurCrpId,
        })

        if (existingId != null) {
          operations.push(updateMutation.mutateAsync({ id: existingId, data: payload as any }))
        } else {
          operations.push(createMutation.mutateAsync(payload as any))
        }
      }
    }

    if (toProcess === 0) {
      toast.info('Aucune modification à enregistrer')
      setIsSavingAll(false)
      return
    }

    try {
      await Promise.all(operations)
      toast.success(`${toProcess} cible${toProcess > 1 ? 's' : ''} enregistrée${toProcess > 1 ? 's' : ''}`)
      setDirtyKeys(new Set())
      onClose?.()
    } catch {
      toast.error("Erreur lors de l'enregistrement des cibles")
    } finally {
      setIsSavingAll(false)
    }
  }

  const isLoading  = isLoadingLocalites || isLoadingNiveaux || isLoadingCibles
  const isMutating = isSavingAll || createMutation.isPending || updateMutation.isPending || deleteMutation.isPending

  if (isLoading) return (
    <div className='flex items-center justify-center gap-2 py-16 text-sm text-muted-foreground'>
      <Loader2 className='h-4 w-4 animate-spin' /> Chargement des zones et cibles…
    </div>
  )
  if (!programme) return (
    <p className='py-10 text-center text-sm text-muted-foreground'>
      Sélectionnez un programme pour afficher la période des cibles.
    </p>
  )
  if (years.length === 0) return (
    <p className='py-10 text-center text-sm text-muted-foreground'>
      Les dates de début et de fin du programme actif sont requises.
    </p>
  )
  if (zones.length === 0) return (
    <p className='py-10 text-center text-sm text-muted-foreground'>
      Aucune localité de niveau 2 n'est configurée.
    </p>
  )

  // ── ActionBar sticky ──────────────────────────────────────────────────────────
  const ActionBar = ({ position }: { position: 'top' | 'bottom' }) => (
    <div className={cn(
      'flex items-center justify-between gap-3 rounded-lg border bg-background/95 px-4 py-2.5 backdrop-blur',
      position === 'top'
        ? 'sticky top-0 z-30 shadow-sm border-b'
        : 'sticky bottom-0 z-30 shadow-[0_-2px_8px_rgba(0,0,0,.08)] border-t'
    )}>
      <div className='flex items-center gap-2 text-sm text-muted-foreground'>
        <span className='font-medium text-foreground'>{zones.length} zones</span>
        <span>·</span>
        <span>{years.length} années</span>
        {filledCount > 0 && (
          <><span>·</span>
          <Badge variant='secondary' className='text-xs'>
            {filledCount} valeur{filledCount > 1 ? 's' : ''}
          </Badge></>
        )}
        {dirtyKeys.size > 0 && (
          <Badge variant='outline' className='text-xs text-amber-600 border-amber-300 bg-amber-50'>
            {dirtyKeys.size} non sauvegardée{dirtyKeys.size > 1 ? 's' : ''}
          </Badge>
        )}
      </div>
      <div className='flex items-center gap-2'>
        {onClose && (
          <Button type='button' variant='outline' size='sm' onClick={onClose} disabled={isMutating}>
            <X className='h-3.5 w-3.5' /> Annuler
          </Button>
        )}
        <Button type='button' size='sm' onClick={handleSave} disabled={isMutating} className='gap-1.5'>
          {isMutating
            ? <><Loader2 className='h-3.5 w-3.5 animate-spin' />Enregistrement…</>
            : <><Save className='h-3.5 w-3.5' />Enregistrer</>
          }
        </Button>
      </div>
    </div>
  )

  return (
    <div className='flex flex-col gap-0'>
      <ActionBar position='top' />

      <div className={cn(
        'rounded-none border-x',
        useScrollMode ? 'max-h-[min(55vh,520px)] overflow-y-auto' : 'overflow-y-visible',
        needsHorizontalScroll ? 'overflow-x-auto' : 'overflow-x-hidden'
      )}>
        <table
          className={cn('w-full border-collapse text-xs', needsHorizontalScroll ? 'min-w-max' : 'table-fixed')}
          style={needsHorizontalScroll ? { minWidth: ZONE_COLUMN_MIN_PX + years.length * YEAR_COLUMN_MIN_PX } : undefined}
        >
          <colgroup>
            <col style={{ width: needsHorizontalScroll ? ZONE_COLUMN_MIN_PX : '24%' }} />
            {years.map((y) => <col key={y} />)}
          </colgroup>
          <thead className='sticky top-0 z-20 bg-muted/95 backdrop-blur'>
            <tr>
              <th className='sticky left-0 z-30 border-b border-r bg-muted/95 px-3 py-2 text-left text-xs font-semibold'
                style={needsHorizontalScroll ? { minWidth: ZONE_COLUMN_MIN_PX } : undefined}>
                Zones
              </th>
              {years.map((y) => (
                <th key={y} className='border-b px-1 py-2 text-center text-xs font-semibold tabular-nums'
                  style={needsHorizontalScroll ? { minWidth: YEAR_COLUMN_MIN_PX } : undefined}>
                  {y}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {zones.map((zone, zIdx) => {
              const zoneId = zone.id_loca as number
              return (
                <tr key={zoneId} className={cn(
                  'border-b last:border-b-0 transition-colors',
                  zIdx % 2 === 0 ? 'bg-background' : 'bg-muted/20'
                )}>
                  <td className='sticky left-0 z-10 border-r bg-inherit px-3 py-1.5 align-middle font-medium'
                    style={needsHorizontalScroll ? { minWidth: ZONE_COLUMN_MIN_PX, maxWidth: ZONE_COLUMN_MIN_PX } : undefined}>
                    <span className='block truncate text-xs' title={zone.intitule_loca}>
                      {zone.intitule_loca}
                    </span>
                  </td>
                  {years.map((year) => {
                    const key    = buildCibleCmrGridKey(zoneId, year)
                    const cell   = grid[key]
                    const isDirty = dirtyKeys.has(key)
                    return (
                      <td key={year} className='px-1 py-1 align-middle'
                        style={needsHorizontalScroll ? { minWidth: YEAR_COLUMN_MIN_PX } : undefined}>
                        <Input
                          type='text'
                          inputMode='decimal'
                          value={cell?.value ?? ''}
                          onChange={(e) => handleCellChange(zoneId, year, e.target.value)}
                          className={cn(
                            'h-7 w-full min-w-0 px-1 text-center text-xs tabular-nums transition-colors',
                            isDirty && 'border-amber-400 bg-amber-50/50 focus:border-amber-500'
                          )}
                          aria-label={`Cible ${zone.intitule_loca} ${year}`}
                        />
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <ActionBar position='bottom' />
    </div>
  )
}