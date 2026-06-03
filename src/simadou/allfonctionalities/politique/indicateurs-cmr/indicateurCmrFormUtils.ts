import type { IndicateurCmr } from '@/simadou/allTypes'
import type { IndicateurCmrCreateData } from '@/simadou/schemas/indicateursSchemas'
import { resolveRelationId } from '@/simadou/lib/resolveApiRelation'

export function indicateurCmrToFormValues(
  indicateur?: IndicateurCmr | null
): IndicateurCmrCreateData {
  return {
    code_ref_ind: indicateur?.code_ref_ind ?? '',
    resultat_cmr: indicateur?.resultat_cmr ?? '',
    intitule_ref_ind: indicateur?.intitule_ref_ind ?? '',
    reference_cmr: indicateur?.reference_cmr ?? '',
    annee_reference: indicateur?.annee_reference ?? new Date().getFullYear(),
    responsable_collecte_cmr: indicateur?.responsable_collecte_cmr ?? '',
    cible_cmr: indicateur?.cible_cmr ?? '',
    fonction_agregat_cmr: indicateur?.fonction_agregat_cmr ?? '',
    unite_cmr: resolveRelationId(indicateur?.unite_cmr, 'id_unite'),
  }
}
