import { useMemo } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { DynamicForm } from '@/Global/Forms/DynamicForm'
import { getObservationPtbaFormConfigForActivite } from '@/simadou/allfieldsConfig/observationPtbaForm'
import {
  observationPtbaSchema,
  type ObservationPtbaFormData,
} from '@/simadou/schemas/observationPtbaSchemas'
import type { ObservationPtba, Ptba } from '@/simadou/allTypes'
import {
  useCreateObservationPtba,
  useUpdateObservationPtba,
} from '@/simadou/allHooks/admin/suiviPtbaHooks'

type ObservationPtbaFormProps = {
  activite: Ptba
  observation?: ObservationPtba | null
  onClose: () => void
  onSuccess: () => void
}

export default function ObservationPtbaForm({
  activite,
  observation,
  onClose,
  onSuccess,
}: ObservationPtbaFormProps) {
  const isEditing = !!observation
  const codeActivite = activite.code_activite_ptba

  const formConfig = useMemo(
    () => getObservationPtbaFormConfigForActivite(),
    []
  )

  const defaultValues = useMemo(
    (): ObservationPtbaFormData =>
      observation
        ? {
            observation: observation.observation || '',
            date_observation: observation.date_observation
              ? new Date(observation.date_observation)
                  .toISOString()
                  .split('T')[0]
              : new Date().toISOString().split('T')[0],
            ptba: codeActivite,
          }
        : {
            observation: '',
            date_observation: new Date().toISOString().split('T')[0],
            ptba: codeActivite,
          },
    [observation, codeActivite]
  )

  const createMutation = useCreateObservationPtba(codeActivite)
  const updateMutation = useUpdateObservationPtba(codeActivite)

  const onSubmit = (data: ObservationPtbaFormData) => {
    const payload = { ...data, ptba: codeActivite }

    if (isEditing && observation) {
      updateMutation.mutate(
        { id: observation.id_observation, data: payload },
        {
          onSuccess: () => {
            toast.success('Observation modifiée')
            onSuccess()
          },
          onError: () => toast.error('Erreur lors de la mise à jour'),
        }
      )
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => {
          toast.success('Observation enregistrée')
          onSuccess()
        },
        onError: () => toast.error("Erreur lors de l'enregistrement"),
      })
    }
  }

  return (
    <div className='space-y-4'>
      <DynamicForm
        config={formConfig}
        schema={observationPtbaSchema}
        defaultValues={defaultValues}
        onSubmit={onSubmit}
        submitText={isEditing ? 'Mettre à jour' : 'Enregistrer'}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />
      <div className='flex justify-end'>
        <Button type='button' variant='outline' onClick={onClose}>
          Retour
        </Button>
      </div>
    </div>
  )
}
