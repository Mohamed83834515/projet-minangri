import { useMemo } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { DynamicForm } from '@/Global/Forms/DynamicForm'
import { getSuiviTacheActiviteFormConfigForTache } from '@/simadou/allfieldsConfig/suiviTacheActiviteForm'
import {
  suiviTacheActiviteSchema,
  type SuiviTacheActiviteFormData,
} from '@/simadou/schemas/suiviTacheActiviteSchemas'
import type { SuiviTacheActivite, TacheActivitePtba } from '@/simadou/allTypes'
import {
  useCreateSuiviTache,
  useUpdateSuiviTache,
} from '@/simadou/allHooks/admin/suiviPtbaHooks'

type SuiviTacheActiviteFormProps = {
  tache: TacheActivitePtba
  suivi?: SuiviTacheActivite
  idActivite: number
  onClose: () => void
  onSuccess: () => void
}

export default function SuiviTacheActiviteForm({
  tache,
  suivi,
  idActivite,
  onClose,
  onSuccess,
}: SuiviTacheActiviteFormProps) {
  const isEditing = !!suivi
  const formConfig = useMemo(() => getSuiviTacheActiviteFormConfigForTache(), [])

  const defaultValues = useMemo(
    (): SuiviTacheActiviteFormData => ({
      id_groupe_tache: tache.id_groupe_tache,
      date_reele: suivi?.date_reele?.slice(0, 10) || '',
      observation_suivi: suivi?.observation_suivi || '',
      livrable_suivi:
        typeof suivi?.livrable_suivi === 'string' ? suivi.livrable_suivi : '',
      livrable_fichier: [],
      proportion_realisee: suivi?.proportion_realisee ?? 0,
      valide: suivi?.valide ?? false,
    }),
    [suivi, tache.id_groupe_tache]
  )

  const createMutation = useCreateSuiviTache(idActivite)
  const updateMutation = useUpdateSuiviTache(idActivite)

  const onSubmit = (data: SuiviTacheActiviteFormData) => {
    const payload = {
      ...data,
      id_activite_ptba: idActivite,
      id_groupe_tache: tache.id_groupe_tache,
    }

    if (isEditing && suivi) {
      updateMutation.mutate(
        { id: suivi.id_suivi_groupe_tache, data: payload },
        {
          onSuccess: () => {
            toast.success('Suivi mis à jour')
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
        key={`${tache.id_groupe_tache}-${suivi?.id_suivi_groupe_tache ?? 'new'}`}
        config={formConfig}
        schema={suiviTacheActiviteSchema}
        defaultValues={defaultValues}
        onSubmit={onSubmit}
        submitText={isEditing ? 'Mettre à jour' : 'Enregistrer'}
        loadingText='Enregistrement…'
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
