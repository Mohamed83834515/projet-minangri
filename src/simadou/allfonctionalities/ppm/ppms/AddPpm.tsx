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
import { useGetModesPassation } from '@/simadou/allHooks/admin/modePassationHooks'
import { useGetNaturesMarche } from '@/simadou/allHooks/admin/natureMarcheHooks'
import { useSavePpm } from '@/simadou/allHooks/admin/ppmHooks'
import { useGetTypeFinancementPPM } from '@/simadou/allHooks/admin/typeFinancementPPM'
import { useGetVersionsPPM } from '@/simadou/allHooks/admin/versionPPMHooks'
import { getPpmFormConfig } from '@/simadou/allfieldsConfig/ppmForm'
import type { Ppm } from '@/simadou/allTypes/ppm'
import { resolveRelationId } from '@/simadou/lib/resolveApiRelation'
import { ppmSchema, type PpmFormData } from '@/simadou/schemas/ppmSchema'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow?: Ppm | null
}

function resolveFkValue(value: unknown, idKey: string): number | null {
  return resolveRelationId(value, idKey)
}

export default function AddPpm({ open, onOpenChange, currentRow }: Props) {
  const isEdit = !!currentRow

  const { data: versions = [] } = useGetVersionsPPM()
  const { data: modes = [] } = useGetModesPassation()
  const { data: typesFinancement = [] } = useGetTypeFinancementPPM()
  const { data: natures = [] } = useGetNaturesMarche()

  const formConfig = useMemo(() => {
    const config = getPpmFormConfig()
    const selectOptions: Record<string, { value: number; label: string }[]> =
      {
        version_ppm: versions
          .filter((version) => version.id_version_ppm != null)
          .map((version) => ({
            value: version.id_version_ppm!,
            label:
              version.numero_version_ppm?.trim() ||
              String(version.id_version_ppm),
          })),
        methode_passation: modes.map((mode) => ({
          value: mode.id_mode_passation,
          label: `${mode.code_mode_passation} - ${mode.intitule_mode_passation}`,
        })),
        type_financement: typesFinancement.map((type) => ({
          value: type.id_type_financement_ppm,
          label: `${type.code_type_financement_ppm} - ${type.intitule_type_financement_ppm}`,
        })),
        nature_marche: natures.map((nature) => ({
          value: nature.id_nature_marche,
          label: `${nature.code_nature_marche} - ${nature.intitule_nature_marche}`,
        })),
      }

    return {
      fields: config.fields.map((field) => {
        const options = selectOptions[field.name]
        if (!options) return field
        return { ...field, options }
      }),
    }
  }, [versions, modes, typesFinancement, natures])

  const defaultValues = useMemo<PpmFormData>(() => {
    if (isEdit && currentRow) {
      return {
        intitule_ppm: currentRow.intitule_ppm ?? '',
        code_budget: Number(currentRow.code_budget) || 0,
        montant_budget: Number(currentRow.montant_budget) || 0,
        numero_appel_offre: Number(currentRow.numero_appel_offre) || 0,
        methode_passation:
          resolveFkValue(currentRow.methode_passation, 'id_mode_passation') ?? 0,
        type_financement:
          resolveFkValue(
            currentRow.type_financement,
            'id_type_financement_ppm'
          ) ?? 0,
        version_ppm:
          resolveFkValue(currentRow.version_ppm, 'id_version_ppm') ?? 0,
        nature_marche:
          resolveFkValue(currentRow.nature_marche, 'id_nature_marche') ?? 0,
      }
    }

    return {
      intitule_ppm: '',
      code_budget: 0,
      montant_budget: 0,
      numero_appel_offre: 0,
      methode_passation: 0,
      type_financement: 0,
      version_ppm: 0,
      nature_marche: 0,
    }
  }, [currentRow, isEdit])

  const mutation = useSavePpm(isEdit, currentRow, () => {
    onOpenChange(false)
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={DIALOG_SIZES.lg}>
        <DialogHeader>
          <DialogTitle>
            {isEdit ? 'Modifier le PPM' : 'Ajouter un PPM'}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? `Modification de « ${currentRow?.intitule_ppm} »`
              : 'Renseignez les informations du plan de passation des marchés'}
          </DialogDescription>
        </DialogHeader>

        <DynamicForm
          key={isEdit ? currentRow?.id_ppm : 'new-ppm'}
          config={formConfig}
          schema={ppmSchema}
          defaultValues={defaultValues}
          onSubmit={(data: PpmFormData) => mutation.mutate(data)}
          isLoading={mutation.isPending}
          submitText={isEdit ? 'Mettre à jour' : 'Ajouter'}
          loadingText='Enregistrement…'
        />
      </DialogContent>
    </Dialog>
  )
}
