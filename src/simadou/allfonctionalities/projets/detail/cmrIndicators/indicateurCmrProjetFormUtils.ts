import type { SelectOption } from '@/Global/types/formConfig'
import type { CadreResultat, IndicateurCadreResultat } from '@/simadou/allTypes'
import type { IndicateurCmrProjet } from '@/simadou/allTypes/indicateurCmrProjet'
import type { IndicateurCmrProjetCreateData } from '@/simadou/schemas/indicateurCmrProjetSchemas'
import { filterIndicateursForCadreResultat } from '@/simadou/allfonctionalities/projets/detail/resultsFrameworkIndicators/indicateurCadreResultatFormUtils'
import { resolveNiveauCrId } from '@/simadou/lib/cadreResultatUtils'
import { resolveRelationId } from '@/simadou/lib/resolveApiRelation'
import {
  buildDictionnaireIndicateurSelectOptions,
  resolveReferentielCmrId,
} from '@/simadou/allfonctionalities/politique/indicateurs-cmr/indicateurCmrFormUtils'

export { buildDictionnaireIndicateurSelectOptions, resolveReferentielCmrId }
export { filterIndicateursForCadreResultat }

export function filterCadresResultatByNiveau(
  cadres: CadreResultat[],
  niveauId: number
): CadreResultat[] {
  return cadres.filter(
    (cadre) => resolveNiveauCrId(cadre.niveau_cr) === niveauId
  )
}

export function resolveCadreResultatById(
  cadres: CadreResultat[],
  cadreId?: number | null
): CadreResultat | null {
  if (cadreId == null || !Number.isFinite(cadreId)) return null
  return cadres.find((cadre) => cadre.id_cr === cadreId) ?? null
}

export function resolveResultatCmrProjetId(
  indicateur?: IndicateurCmrProjet | null
): number | null {
  if (!indicateur) return null
  const value = indicateur.resultat_cmr
  if (typeof value === 'number' && Number.isFinite(value)) return value
  return resolveRelationId(value, 'id_cr')
}

export function resolveIndicateurIopId(
  indicateur?: IndicateurCmrProjet | null
): number | null {
  if (!indicateur) return null
  const value = indicateur.indicateur_iop
  if (typeof value === 'number' && Number.isFinite(value)) return value
  return resolveRelationId(value, 'id_indicateur_cr_iop')
}

export function resolveResultatCmrProjetLabel(
  value: IndicateurCmrProjet['resultat_cmr']
): string {
  if (value == null) return ''
  if (typeof value === 'object') {
    const code = value.code_cr
    const intitule = value.intutile_cr
    if (code && intitule) return `${code} — ${intitule}`
    return intitule ?? code ?? ''
  }
  return String(value)
}

export function resolveIndicateurIopLabel(
  value: IndicateurCmrProjet['indicateur_iop']
): string {
  if (value == null) return ''
  if (typeof value === 'object') {
    const code = value.code_indicateur_cr_iop
    const intitule = value.intitule_indicateur_cr_iop
    if (code && intitule) return `${code} — ${intitule}`
    return intitule ?? code ?? ''
  }
  return String(value)
}

export function buildCadreResultatSelectOptions(
  cadres: CadreResultat[],
  currentCadreId?: number | null
): SelectOption[] {
  const options = cadres
    .filter((cadre) => cadre.id_cr != null)
    .map((cadre) => ({
      value: cadre.id_cr,
      label: `${cadre.code_cr} — ${cadre.intutile_cr}`,
    }))

  if (
    currentCadreId != null &&
    !options.some((opt) => Number(opt.value) === currentCadreId)
  ) {
    options.unshift({
      value: currentCadreId,
      label: `Cadre de résultat #${currentCadreId}`,
    })
  }

  return options
}

export function buildIndicateurCadreResultatSelectOptions(
  indicateurs: IndicateurCadreResultat[],
  currentIndicateurId?: number | null
): SelectOption[] {
  const options = indicateurs
    .filter((ind) => ind.id_indicateur_cr_iop != null)
    .map((ind) => ({
      value: ind.id_indicateur_cr_iop,
      label: `${ind.code_indicateur_cr_iop} — ${ind.intitule_indicateur_cr_iop}`,
    }))

  if (
    currentIndicateurId != null &&
    !options.some((opt) => Number(opt.value) === currentIndicateurId)
  ) {
    options.unshift({
      value: currentIndicateurId,
      label: `Indicateur #${currentIndicateurId}`,
    })
  }

  return options
}

export function indicateurCmrProjetToFormValues(
  indicateur?: IndicateurCmrProjet | null
): IndicateurCmrProjetCreateData {
  return {
    code_ref_ind: indicateur?.code_ref_ind ?? '',
    resultat_cmr: resolveResultatCmrProjetId(indicateur) ?? 0,
    indicateur_iop: resolveIndicateurIopId(indicateur) ?? 0,
    intitule_ref_ind: indicateur?.intitule_ref_ind ?? '',
    reference_cmr: indicateur?.reference_cmr ?? '',
    annee_reference: indicateur?.annee_reference ?? new Date().getFullYear(),
    responsable_collecte_cmr: indicateur?.responsable_collecte_cmr ?? '',
    cible_cmr: indicateur?.cible_cmr ?? '',
    fonction_agregat_cmr: indicateur?.fonction_agregat_cmr ?? '',
    referentiel_cmr: resolveReferentielCmrId(indicateur),
  }
}

export function resolveIndicateurCmrProjetNiveauId(
  indicateur: IndicateurCmrProjet,
  cadresResultat: CadreResultat[] = [],
  indicateursCadreResultat: IndicateurCadreResultat[] = []
): number | null {
  const indicateurIop = indicateur.indicateur_iop
  if (indicateurIop != null && typeof indicateurIop === 'object') {
    const niveau = indicateurIop.niveau_iop
    if (typeof niveau === 'number' && Number.isFinite(niveau)) return niveau
  }

  const resultat = indicateur.resultat_cmr
  if (resultat != null && typeof resultat === 'object') {
    const niveauId = resolveNiveauCrId(resultat.niveau_cr)
    if (niveauId != null) return niveauId

    const niveauIopFromResultat = (resultat as Record<string, unknown>).niveau_iop
    if (
      typeof niveauIopFromResultat === 'number' &&
      Number.isFinite(niveauIopFromResultat)
    ) {
      return niveauIopFromResultat
    }
  }

  const cadreId = resolveResultatCmrProjetId(indicateur)
  if (cadreId != null) {
    const cadre =
      cadresResultat.find((item) => item.id_cr === cadreId) ??
      (typeof resultat === 'object' ? resultat : null)
    const niveauId = cadre ? resolveNiveauCrId(cadre.niveau_cr) : null
    if (niveauId != null) return niveauId
  }

  const indicateurId = resolveIndicateurIopId(indicateur)
  if (indicateurId != null) {
    const linkedIndicateur = indicateursCadreResultat.find(
      (item) => item.id_indicateur_cr_iop === indicateurId
    )
    if (
      linkedIndicateur?.niveau_iop != null &&
      Number.isFinite(Number(linkedIndicateur.niveau_iop))
    ) {
      return Number(linkedIndicateur.niveau_iop)
    }
  }

  return null
}

export function filterIndicateursCmrProjetByNiveau(
  indicateurs: IndicateurCmrProjet[],
  niveauId: number,
  cadresResultat: CadreResultat[] = [],
  indicateursCadreResultat: IndicateurCadreResultat[] = []
): IndicateurCmrProjet[] {
  return indicateurs.filter(
    (indicateur) =>
      resolveIndicateurCmrProjetNiveauId(
        indicateur,
        cadresResultat,
        indicateursCadreResultat
      ) === niveauId
  )
}

export function countIndicateursCmrProjetByNiveau(
  indicateurs: IndicateurCmrProjet[],
  cadresResultat: CadreResultat[] = [],
  indicateursCadreResultat: IndicateurCadreResultat[] = []
): Record<number, number> {
  const counts: Record<number, number> = {}

  for (const indicateur of indicateurs) {
    const niveauId = resolveIndicateurCmrProjetNiveauId(
      indicateur,
      cadresResultat,
      indicateursCadreResultat
    )
    if (niveauId == null) continue
    counts[niveauId] = (counts[niveauId] ?? 0) + 1
  }

  return counts
}
