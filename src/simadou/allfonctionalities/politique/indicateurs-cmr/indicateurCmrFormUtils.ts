import type { SelectOption } from '@/Global/types/formConfig'
import type { IndicateurCmr } from '@/simadou/allTypes'
import type { IndicateurStrategique } from '@/simadou/allTypes/indicateurStrategique'
import type { IndicateurCmrCreateData } from '@/simadou/schemas/indicateursSchemas'
import { resolveRelationId } from '@/simadou/lib/resolveApiRelation'

export function filterIndicateursStrategiqueByNiveau(
  indicateurs: IndicateurStrategique[],
  niveauCodeNumber: number
): IndicateurStrategique[] {
  return indicateurs.filter(
    (ind) => Number(ind.niveau_istr) === niveauCodeNumber
  )
}

export function buildIndicateurStrategiqueSelectOptions(
  indicateurs: IndicateurStrategique[],
  currentValue?: string | null
): SelectOption[] {
  const options = indicateurs.map((ind) => ({
    value: ind.code_indicateur_istr,
    label: `${ind.code_indicateur_istr} — ${ind.intitule_indicateur_istr}`,
  }))

  const normalized = currentValue?.trim()
  if (
    normalized &&
    !options.some((opt) => String(opt.value) === normalized)
  ) {
    options.unshift({ value: normalized, label: normalized })
  }

  return options
}

export function indicateurCmrToFormValues(
  indicateur?: IndicateurCmr | null
): IndicateurCmrCreateData {
  return {
    code_ref_ind: indicateur?.code_ref_ind ?? '',
    resultat_cmr: indicateur?.resultat_cmr ?? 0,
    intitule_ref_ind: indicateur?.intitule_ref_ind ?? '',
    reference_cmr: indicateur?.reference_cmr ?? '',
    annee_reference: indicateur?.annee_reference ?? new Date().getFullYear(),
    responsable_collecte_cmr: indicateur?.responsable_collecte_cmr ?? '',
    cible_cmr: indicateur?.cible_cmr ?? '',
    fonction_agregat_cmr: indicateur?.fonction_agregat_cmr ?? '',
    unite_cmr: resolveRelationId(indicateur?.unite_cmr, 'id_unite'),
  }
}
