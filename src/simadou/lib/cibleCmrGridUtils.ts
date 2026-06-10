import type { CibleCmrProjet } from '@/simadou/allTypes'
import type { Localite } from '@/simadou/allTypes/localite'
import type { NiveauLocalite } from '@/simadou/allTypes/niveauLocalite'
import type { Programme } from '@/simadou/allTypes/programme'
import {
  formatAnneeCible,
  formatAnneeCibleForApi,
  resolveCodeIndicateurCrpForForm,
} from '@/simadou/schemas/cibleCmrProjetSchema'
import { resolveRelationCode } from '@/simadou/lib/resolveApiRelation'

export type CibleCmrGridCell = {
  cibleId?: number
  value: string
}

export function parseProgrammeYear(
  value: string | null | undefined
): number | null {
  if (!value?.trim()) return null
  const parsed = new Date(value)
  if (Number.isFinite(parsed.getTime())) return parsed.getFullYear()
  const match = value.match(/^(\d{4})/)
  return match ? Number(match[1]) : null
}

export function getProgrammeYearRange(programme?: Programme | null): number[] {
  const startYear = parseProgrammeYear(programme?.annee_debut_programme)
  const endYear = parseProgrammeYear(programme?.annee_fin_programme)
  if (startYear == null || endYear == null) return []

  const from = Math.min(startYear, endYear)
  const to = Math.max(startYear, endYear)
  const years: number[] = []
  for (let year = from; year <= to; year += 1) {
    years.push(year)
  }
  return years
}

export function resolveLocaliteNiveauNombre(
  localite: Localite
): number | null {
  const niveau = localite.niveau_loca
  if (typeof niveau === 'object' && niveau !== null) {
    return Number(niveau.nombre_nlc)
  }
  return null
}

export function getLocalitesNiveau1(
  localites: Localite[],
  niveaux: NiveauLocalite[] = []
): Localite[] {
  const niveauConfig = niveaux.find((n) => Number(n.nombre_nlc) === 1)

  return localites
    .filter((localite) => {
      const niveau = localite.niveau_loca
      if (typeof niveau === 'object' && niveau !== null) {
        if (Number(niveau.nombre_nlc) === 2) return true
        if (niveauConfig?.id_nlc != null && niveau.id_nlc === niveauConfig.id_nlc) {
          return true
        }
        return false
      }
      if (typeof niveau === 'number' && niveauConfig?.id_nlc != null) {
        return niveau === niveauConfig.id_nlc
      }
      return resolveLocaliteNiveauNombre(localite) === 2
    })
    .sort((a, b) => a.intitule_loca.localeCompare(b.intitule_loca, 'fr'))
}

export function buildCibleCmrGridKey(zoneCode: string, year: number): string {
  return `${zoneCode}|${year}`
}

export function resolveCibleZoneCode(cible: CibleCmrProjet): string | null {
  if (typeof cible.code_ug === 'string' && cible.code_ug.trim()) {
    return cible.code_ug
  }
  return resolveRelationCode(cible.code_ug, 'code_loca')
}

export function buildCibleCmrGridState({
  cibles,
  zoneCodes,
  years,
}: {
  cibles: CibleCmrProjet[]
  zoneCodes: string[]
  years: number[]
}): Record<string, CibleCmrGridCell> {
  const state: Record<string, CibleCmrGridCell> = {}

  for (const zoneCode of zoneCodes) {
    for (const year of years) {
      state[buildCibleCmrGridKey(zoneCode, year)] = { value: '' }
    }
  }

  for (const cible of cibles) {
    const zoneCode = resolveCibleZoneCode(cible)
    const year = Number(formatAnneeCible(cible.annee))
    if (!zoneCode || !Number.isFinite(year)) continue

    const key = buildCibleCmrGridKey(zoneCode, year)
    if (!(key in state)) continue

    state[key] = {
      cibleId: cible.id_cible_indicateur_crp,
      value:
        cible.valeur_cible_indcateur_crp == null
          ? ''
          : String(cible.valeur_cible_indcateur_crp),
    }
  }

  return state
}

export function parseGridCellValue(raw: string): number | null {
  const trimmed = raw.trim()
  if (!trimmed) return null
  const parsed = Number(trimmed.replace(/\s/g, '').replace(',', '.'))
  return Number.isFinite(parsed) ? Math.trunc(parsed) : null
}

export function buildCiblePayloadFromGridCell({
  zoneCode,
  year,
  value,
  indicateurCrpId,
}: {
  zoneCode: string
  year: number
  value: number
  indicateurCrpId: number
}) {
  return {
    annee: formatAnneeCibleForApi(String(year)),
    valeur_cible_indcateur_crp: value,
    code_indicateur_crp: indicateurCrpId,
    code_ug: zoneCode,
    code_projet: null,
  }
}

export function filterCiblesForIndicateurCmrId(
  cibles: CibleCmrProjet[],
  indicateurCrpId: number
): CibleCmrProjet[] {
  return cibles.filter(
    (cible) => resolveCodeIndicateurCrpForForm(cible) === indicateurCrpId
  )
}
