import { useState } from 'react'
import { type Row } from '@tanstack/react-table'
import { Edit, Loader2, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { GenericDeleteDialog } from '@/Global/Tableaux/GenericDeleteDialog'
import { GenericRowActions } from '@/Global/Tableaux/GenericRowActions'
import useDialogState from '@/hooks/use-dialog-state'
import type { ObservationPtba } from '@/simadou/allTypes'
import {
  useDeleteObservationPtba,
  useGetObservationsByActivite,
} from '@/simadou/allHooks/admin/suiviPtbaHooks'

type ObservationPtbaListProps = {
  activiteCode: string
  onEdit: (observation: ObservationPtba) => void
}

function ObservationRowActions({
  observation,
  onEdit,
  onDeleteRequest,
}: {
  observation: ObservationPtba
  onEdit: (o: ObservationPtba) => void
  onDeleteRequest: (o: ObservationPtba) => void
}) {
  const row = { original: observation } as Row<ObservationPtba>

  return (
    <GenericRowActions
      row={row}
      actions={[
        {
          label: 'Modifier',
          icon: <Edit size={16} />,
          onClick: onEdit,
        },
        {
          label: 'Supprimer',
          icon: <Trash2 size={16} />,
          onClick: onDeleteRequest,
          className: 'text-red-500!',
          separator: true,
        },
      ]}
    />
  )
}

export default function ObservationPtbaList({
  activiteCode,
  onEdit,
}: ObservationPtbaListProps) {
  const [open, setOpen] = useDialogState<'delete'>(null)
  const [currentRow, setCurrentRow] = useState<ObservationPtba | null>(null)

  const { data: observations = [], isLoading } =
    useGetObservationsByActivite(activiteCode)
  const deleteMutation = useDeleteObservationPtba(activiteCode)

  const handleDeleteRequest = (observation: ObservationPtba) => {
    setCurrentRow(observation)
    setOpen('delete')
  }

  const handleConfirmDelete = (observation: ObservationPtba) => {
    deleteMutation.mutate(observation.id_observation, {
      onSuccess: () => toast.success('Observation supprimée'),
      onError: () => toast.error('Erreur lors de la suppression'),
    })
  }

  if (isLoading) {
    return (
      <div className='flex justify-center py-8'>
        <Loader2 className='h-8 w-8 animate-spin text-muted-foreground' />
      </div>
    )
  }

  if (observations.length === 0) {
    return (
      <div className='py-8 text-center text-muted-foreground'>
        <p className='font-medium'>Aucune observation enregistrée</p>
        <p className='mt-2 text-sm'>
          Cliquez sur « Ajouter une observation » pour commencer.
        </p>
      </div>
    )
  }

  return (
    <>
      <div className='space-y-3'>
        {observations.map((observation) => (
          <div
            key={observation.id_observation}
            className='flex items-start justify-between gap-4 rounded-lg border p-4'
          >
            <div className='min-w-0 flex-1'>
              <span className='text-xs text-muted-foreground'>
                {new Date(observation.date_observation).toLocaleDateString(
                  'fr-FR',
                  { year: 'numeric', month: 'long', day: 'numeric' }
                )}
              </span>
              <p className='mt-2 whitespace-pre-wrap'>
                {observation.observation}
              </p>
            </div>
            <ObservationRowActions
              observation={observation}
              onEdit={onEdit}
              onDeleteRequest={handleDeleteRequest}
            />
          </div>
        ))}
      </div>

      {currentRow && (
        <GenericDeleteDialog<ObservationPtba>
          open={open === 'delete'}
          onOpenChange={(isOpen) => setOpen(isOpen ? 'delete' : null)}
          currentRow={currentRow}
          entityName='observation'
          getEntityLabel={(row) =>
            row.observation?.slice(0, 40) || String(row.id_observation)
          }
          onDelete={handleConfirmDelete}
        />
      )}
    </>
  )
}
