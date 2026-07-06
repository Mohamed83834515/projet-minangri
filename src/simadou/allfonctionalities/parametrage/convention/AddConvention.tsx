import { useMemo } from 'react'
import { DynamicForm } from '@/Global/Forms/DynamicForm'
import { DIALOG_SIZES } from '@/Global/Forms/dialog'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useGetActeurs } from '@/simadou/allHooks/admin/acteurHooks'
import { useSaveConvention } from '@/simadou/allHooks/admin/conventionHooks'
import { getConventionFormConfig } from '@/simadou/allfieldsConfig/conventionForm'
import type { Convention } from '@/simadou/allTypes/convention'
import {
  conventionFormSchema,
  type ConventionFormData,
} from '@/simadou/schemas/conventionSchema'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow?: Convention | null
}

function resolvePartenaireId(convention?: Convention | null): number | null {
  const partenaire = convention?.partenaire_conv
  if (!partenaire) return null
  if (typeof partenaire === 'number') return partenaire
  return partenaire.id_acteur ?? null
}

function formatDateForInput(value?: string): string {
  if (!value) return ''
  return value.includes('T') ? value.split('T')[0] : value
}

export default function AddConvention({
  open,
  onOpenChange,
  currentRow,
}: Props) {
  const isEdit = !!currentRow
  const { data: acteurs = [] } = useGetActeurs()

  const formConfig = useMemo(() => {
    const config = getConventionFormConfig()
    return {
      fields: config.fields.map((field) => {
        if (field.name !== 'partenaire_conv') return field
        return {
          ...field,
          options: acteurs.map((acteur) => ({
            value: acteur.id_acteur,
            label: `${acteur.nom_acteur} (${acteur.code_acteur})`,
          })),
        }
      }),
    }
  }, [acteurs])

  const defaultValues = useMemo<ConventionFormData>(() => {
    if (isEdit && currentRow) {
      return {
        code_convention: currentRow.code_convention ?? '',
        intutile_conv: currentRow.intutile_conv ?? '',
        reference_conv: currentRow.reference_conv ?? '',
        montant_conv: Number(currentRow.montant_conv) || 0,
        date_signature_conv: formatDateForInput(currentRow.date_signature_conv),
        etat_conv: currentRow.etat_conv ?? 'active',
        partenaire_conv: resolvePartenaireId(currentRow),
      }
    }

    return {
      code_convention: '',
      intutile_conv: '',
      reference_conv: '',
      montant_conv: 0,
      date_signature_conv: '',
      etat_conv: 'active',
      partenaire_conv: null,
    }
  }, [currentRow, isEdit])

  const mutation = useSaveConvention(isEdit, currentRow, () => {
    onOpenChange(false)
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={DIALOG_SIZES.lg}>
        <DialogHeader>
          <DialogTitle>
            {isEdit ? 'Modifier la convention' : 'Ajouter une convention'}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? `Modification de « ${currentRow?.code_convention} »`
              : 'Renseignez les informations de la nouvelle convention'}
          </DialogDescription>
        </DialogHeader>

        <DynamicForm
          key={isEdit ? currentRow?.id_convention : 'new-convention'}
          config={formConfig}
          schema={conventionFormSchema}
          defaultValues={defaultValues}
          onSubmit={(data: ConventionFormData) => mutation.mutate(data)}
          isLoading={mutation.isPending}
          submitText={isEdit ? 'Mettre à jour' : 'Ajouter'}
          loadingText='Enregistrement…'
        />
      </DialogContent>
    </Dialog>
  )
}
