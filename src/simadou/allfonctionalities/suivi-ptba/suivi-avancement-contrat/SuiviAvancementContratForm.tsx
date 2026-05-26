import { useMemo } from 'react'
import { toast } from 'sonner'
import { DynamicForm } from '@/Global/Forms/DynamicForm'
import { getSuiviAvancementContratFormConfigForSuivi } from '@/simadou/allfieldsConfig/suiviAvancementContratForm'
import {
  STATUT_ACTIVITE_VALUES,
  suiviAvancementContratSchema,
  type SuiviAvancementContratFormData,
} from '@/simadou/schemas/suiviAvancementContratSchemas'
import type { Ptba, SuiviAvancementContrat } from '@/simadou/allTypes'
import { resolvePersonnelId } from '@/simadou/allTypes/suiviAvancementContrat'
import { useAuthStore } from '@/stores/auth-store'
import {
  useCreateSuiviAvancementWithSources,
  useUpdateSuiviAvancementWithSources,
  type SuiviAvancementWithSourcesInput,
} from '@/simadou/allHooks/admin/suiviPtbaHooks'

type SuiviAvancementContratFormProps = {
  suivi?: SuiviAvancementContrat
  activite: Ptba
  onClose: () => void
  onSuccess: () => void
}

function resolveStatutActivite(
  value: string | undefined
): (typeof STATUT_ACTIVITE_VALUES)[number] {
  const normalized = value?.trim().toLowerCase()
  if (normalized === 'realise' || normalized === 'réalisé') return 'réalisé'
  const match = STATUT_ACTIVITE_VALUES.find(
    (v) => v.toLowerCase() === normalized
  )
  return match ?? 'en cours'
}

function buildWithSourcesInput(
  data: SuiviAvancementContratFormData,
  activiteId: number,
  isEditing: boolean,
  modifierPar: string,
  existing?: SuiviAvancementContrat
): SuiviAvancementWithSourcesInput {
  const idPersonnel = resolvePersonnelId(existing?.id_personnel) ?? 1
  const { documents_fichiers: fichiers, ...fields } = data

  return {
    suivi: {
      ...fields,
      etat: isEditing ? 'modification' : 'ajout',
      retard_accuse: existing?.retard_accuse ?? '',
      activite_ptba: activiteId,
      id_personnel: idPersonnel,
      modifier_par: modifierPar,
    },
    fichiers: fichiers ?? [],
  }
}

export default function SuiviAvancementContratForm({
  suivi,
  activite,
  onClose,
  onSuccess,
}: SuiviAvancementContratFormProps) {
  const isEditing = !!suivi
  const idActivite = activite.id_ptba
  const modifierPar =
    useAuthStore((s) => s.auth.user?.email?.trim()) || 'Utilisateur'

  const formConfig = useMemo(
    () => getSuiviAvancementContratFormConfigForSuivi(),
    []
  )

  const defaultValues = useMemo(
    (): SuiviAvancementContratFormData => ({
      date_suivi: suivi?.date_suivi?.slice(0, 10) || '',
      statut_activite: resolveStatutActivite(suivi?.statut_activite),
      etat_avancement: suivi?.etat_avancement || '',
      retard_accuse: suivi?.retard_accuse || '',
      difficultes_rencontrees: suivi?.difficultes_rencontrees || '',
      pistes_solutions: suivi?.pistes_solutions || '',
      observation: suivi?.observation || '',
      etat: isEditing ? 'modification' : 'ajout',
      documents_fichiers: [],
    }),
    [suivi, isEditing]
  )

  const createMutation = useCreateSuiviAvancementWithSources(idActivite)
  const updateMutation = useUpdateSuiviAvancementWithSources(idActivite)

  const onSubmit = (data: SuiviAvancementContratFormData) => {
    const input = buildWithSourcesInput(
      data,
      idActivite,
      isEditing,
      modifierPar,
      suivi
    )

    if (isEditing && suivi) {
      updateMutation.mutate(
        { id: suivi.id_suivi, input },
        {
          onSuccess: () => {
            toast.success('Observation mise à jour')
            onSuccess()
          },
          onError: () => toast.error('Erreur lors de la mise à jour'),
        }
      )
    } else {
      createMutation.mutate(input, {
        onSuccess: () => {
          toast.success('Observation enregistrée')
          onSuccess()
        },
        onError: () => toast.error("Erreur lors de l'enregistrement"),
      })
    }
  }

  const retardAffiche = suivi?.retard_accuse?.trim() || '—'
  const isPending = createMutation.isPending || updateMutation.isPending

  return (
    <div className='space-y-4'>
      <div className='rounded-lg border bg-muted/40 px-4 py-3 text-sm'>
        <span className='mb-1 block font-medium'>Retard accusé</span>
        <p>{retardAffiche}</p>
        <p className='mt-1 text-xs text-muted-foreground'>
          Valeur calculée automatiquement (à venir).
        </p>
      </div>

      <DynamicForm
        key={suivi?.id_suivi ?? 'new'}
        config={formConfig}
        schema={suiviAvancementContratSchema}
        defaultValues={defaultValues}
        onSubmit={onSubmit}
        submitText={isEditing ? 'Mettre à jour' : 'Enregistrer'}
        loadingText='Enregistrement…'
        isLoading={isPending}
        onCancel={onClose}
        cancelText='Retour'
      />
    </div>
  )
}
