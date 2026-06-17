import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ActiviteProjet } from '@/simadou/allTypes'
import { IndicateurPerformanceProjet } from '@/simadou/allTypes'
import { indicateurPerformanceProjetQueryKeys, useGetIndicateurPerformanceByActiviteProjet } from '@/simadou/allHooks/admin/indicateurPerformanceProjetHooks'
import ListeIndicateurPerformance from './ListeIndicateurPerformanceActivite'
import AddIndicateurPerformance from './AddIndicateurPerformanceActivite'

type IndicateurPerformanceManagerProps = {
  activite: ActiviteProjet
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function IndicateurPerformanceActiviteManager({
  activite,
  open,
  onOpenChange,
}: IndicateurPerformanceManagerProps) {
  const queryClient = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<IndicateurPerformanceProjet | undefined>()

  const { data, isLoading } = useGetIndicateurPerformanceByActiviteProjet(
    activite.code_activite_projet
  )

  const indicateurs = data ?? []

  const handleAdd = () => {
    setEditing(undefined)
    setShowForm(true)
  }

  const handleEdit = (row: IndicateurPerformanceProjet) => {
    setEditing(row)
    setShowForm(true)
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setEditing(undefined)
  }

  const handleSuccess = () => {
    setShowForm(false)
    setEditing(undefined)
    queryClient.invalidateQueries({
      queryKey: indicateurPerformanceProjetQueryKeys.byActivite(activite.code_activite_projet),
    })
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setShowForm(false)
      setEditing(undefined)
    }
    onOpenChange(newOpen)
  }

  // ── Mode formulaire ────────────────────────────────────────────────────────
  if (showForm) {
    return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className='flex max-h-[90vh] flex-col overflow-hidden sm:max-w-3xl'>
          <DialogHeader className='flex-shrink-0'>
            <DialogTitle>
              {editing ? 'Modifier un indicateur' : 'Ajouter un indicateur'}
            </DialogTitle>
          </DialogHeader>

          <div className='min-h-0 flex-1 overflow-y-auto pr-1'>
            <AddIndicateurPerformance
              currentRow={editing}
              activite={activite}
              onClose={handleCloseForm}
              onSuccess={handleSuccess}
            />
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  // ── Mode liste ─────────────────────────────────────────────────────────────
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className='flex max-h-[90vh] flex-col overflow-hidden sm:max-w-4xl'>
        <DialogHeader className='flex-shrink-0'>
          <DialogTitle>Indicateurs de performance</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className='flex items-center justify-center py-8'>
            <Loader2 className='h-8 w-8 animate-spin text-muted-foreground' />
          </div>
        ) : (
          <>
            <div className='flex-1 overflow-y-auto min-h-0'>
              <ListeIndicateurPerformance
                indicateurs={indicateurs}
                idActivite={activite.code_activite_projet}
                onEdit={handleEdit}
                onAdd={handleAdd}
              />
            </div>

            <div className='flex-shrink-0 border-t bg-muted/40 px-3 py-2'>
              <p className='text-xs text-muted-foreground'>
                {indicateurs.length} {indicateurs.length === 1 ? 'indicateur' : 'indicateurs'}
              </p>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}