import { useMemo } from 'react'
import { toast } from 'sonner'
import { DynamicForm } from '@/Global/Forms/DynamicForm'
import { getApiErrorMessage } from '@/lib/api-error-message'
import { getIndicateurCmrFormConfigForDialog } from '@/simadou/allfieldsConfig/indicateurCmrForm'
import type { IndicateurCmr } from '@/simadou/allTypes'
import {
  indicateurCmrCreateSchema,
  type IndicateurCmrCreateData,
} from '@/simadou/schemas/indicateursSchemas'
import {
  useCreateIndicateurCmr,
  useUpdateIndicateurCmr,
} from '@/simadou/allHooks/admin/indicateurCmrHooks'
import { useGetUnitesIndicateur } from '@/simadou/allHooks/admin/uniteIndicateurHooks'
import { indicateurCmrToFormValues } from './indicateurCmrFormUtils'

export default function IndicateurCmrFormPanel({
  indicateur,
  onClose,
  onSuccess,
}: {
  indicateur?: IndicateurCmr | null
  onClose: () => void
  onSuccess: () => void
}) {
  const isEditing = !!indicateur
  const createMutation = useCreateIndicateurCmr()
  const updateMutation = useUpdateIndicateurCmr()
  const { data: unites = [], isLoading: isLoadingUnites } = useGetUnitesIndicateur()

  const uniteOptions = useMemo(
    () =>
      unites.map((u) => ({
        value: u.id_unite,
        label: `${u.unite_ui} — ${u.definition_ui}`,
      })),
    [unites]
  )

  const formConfig = useMemo(
    () =>
      getIndicateurCmrFormConfigForDialog({
        uniteOptions,
        isLoadingUnites,
      }),
    [uniteOptions, isLoadingUnites]
  )

  const defaultValues = useMemo(
    () => indicateurCmrToFormValues(indicateur),
    [indicateur]
  )

  const onSubmit = (data: IndicateurCmrCreateData) => {
    const payload = {
      ...data,
      unite_cmr: data.unite_cmr || null,
    }

    const callbacks = {
      onSuccess: () => {
        toast.success(
          isEditing ? 'Indicateur CMR mis à jour' : 'Indicateur CMR créé'
        )
        onSuccess()
      },
      onError: (error: unknown) =>
        toast.error(
          getApiErrorMessage(
            error,
            isEditing ? 'Erreur lors de la mise à jour' : 'Erreur lors de la création'
          )
        ),
    }

    if (isEditing && indicateur) {
      updateMutation.mutate({ id: indicateur.id_ref_ind_cmr, data: payload }, callbacks)
      return
    }

    createMutation.mutate(payload, callbacks)
  }

  return (
    <DynamicForm
      key={indicateur?.id_ref_ind_cmr ?? 'new'}
      config={formConfig}
      schema={indicateurCmrCreateSchema}
      defaultValues={defaultValues}
      onSubmit={onSubmit}
      submitText={isEditing ? 'Mettre à jour' : 'Ajouter'}
      loadingText='Enregistrement…'
      isLoading={createMutation.isPending || updateMutation.isPending}
      onCancel={onClose}
      cancelText='Annuler'
    />
  )
}
