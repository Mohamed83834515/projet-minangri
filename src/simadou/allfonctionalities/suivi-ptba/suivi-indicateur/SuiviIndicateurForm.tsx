import { useMemo } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { DynamicForm } from '@/Global/Forms/DynamicForm'
import { getSuiviIndicateurActiviteFormConfigForSuivi } from '@/simadou/allfieldsConfig/suiviIndicateurActiviteForm'
import {
  suiviIndicateurActiviteSchema,
  type SuiviIndicateurActiviteFormData,
} from '@/simadou/schemas/suiviIndicateurSchemas'
import type {
  IndicateurActivitePtba,
  SuiviIndicateurActivite,
} from '@/simadou/allTypes'
import {
  useCreateSuiviIndicateur,
  useGetLocalites,
  useUpdateSuiviIndicateur,
} from '@/simadou/allHooks/admin/suiviPtbaHooks'

type SuiviIndicateurFormProps = {
  indicateur: IndicateurActivitePtba
  suivi?: SuiviIndicateurActivite | null
  onClose: () => void
  onSuccess: () => void
}

export default function SuiviIndicateurForm({
  indicateur,
  suivi,
  onClose,
  onSuccess,
}: SuiviIndicateurFormProps) {
  const isEditing = !!suivi
  const { data: localites = [] } = useGetLocalites()

  const formConfig = useMemo(
    () => getSuiviIndicateurActiviteFormConfigForSuivi(localites),
    [localites]
  )

  const defaultValues = useMemo((): SuiviIndicateurActiviteFormData => {
    if (suivi) {
      return {
        localite:
          typeof suivi.localite === 'object' && suivi.localite
            ? suivi.localite.code_loca
            : typeof suivi.localite === 'string'
              ? suivi.localite
              : null,
        date_suivi_indicateur: suivi.date_suivi_indicateur
          ? new Date(suivi.date_suivi_indicateur).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0],
        valeur_suivi_indicateur: suivi.valeur_suivi_indicateur || 0,
        indicateur_activite: indicateur.code_indicateur_activite,
      }
    }
    return {
      localite: null,
      date_suivi_indicateur: new Date().toISOString().split('T')[0],
      valeur_suivi_indicateur: 0,
      indicateur_activite: indicateur.code_indicateur_activite,
    }
  }, [suivi, indicateur.code_indicateur_activite])

  const createMutation = useCreateSuiviIndicateur()
  const updateMutation = useUpdateSuiviIndicateur()

  const onSubmit = (data: SuiviIndicateurActiviteFormData) => {
    const payload = {
      ...data,
      indicateur_activite: indicateur.code_indicateur_activite,
    }

    if (isEditing && suivi) {
      updateMutation.mutate(
        { id: suivi.id_suivi_indicateur, data: payload },
        {
          onSuccess: () => {
            toast.success('Suivi modifié')
            onSuccess()
          },
          onError: () => toast.error('Erreur lors de la mise à jour'),
        }
      )
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => {
          toast.success('Suivi enregistré')
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
        schema={suiviIndicateurActiviteSchema}
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
