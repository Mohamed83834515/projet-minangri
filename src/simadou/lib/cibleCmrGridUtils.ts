import type { CibleCmrProjet } from '@/simadou/allTypes'
import type { Localite } from '@/simadou/allTypes/localite'
import type { NiveauLocalite } from '@/simadou/allTypes/niveauLocalite'
import type { Programme } from '@/simadou/allTypes/programme'
import {
  formatAnneeCible,
  resolveCodeIndicateurCrpForForm,
} from '@/simadou/schemas/cibleCmrProjetSchema'

export type CibleCmrGridCell = {
  cibleId?: number
  value: string
}

// ── Années ────────────────────────────────────────────────────────────────────

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
  const endYear   = parseProgrammeYear(programme?.annee_fin_programme)
  if (startYear == null || endYear == null) return []
  const from  = Math.min(startYear, endYear)
  const to    = Math.max(startYear, endYear)
  const years: number[] = []
  for (let year = from; year <= to; year += 1) years.push(year)
  return years
}

// ── Localités ─────────────────────────────────────────────────────────────────

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
        if (niveauConfig?.id_nlc != null && niveau.id_nlc === niveauConfig.id_nlc)
          return true
        return false
      }
      if (typeof niveau === 'number' && niveauConfig?.id_nlc != null)
        return niveau === niveauConfig.id_nlc
      return false
    })
    .sort((a, b) => a.intitule_loca.localeCompare(b.intitule_loca, 'fr'))
}

// ── Clé de grille — basée sur id_loca (nombre) ───────────────────────────────
// On utilise l'id numérique de la localité car c'est ce que l'API retourne
// dans la réponse : cible.localite.id_loca

export function buildCibleCmrGridKey(zoneId: number, year: number): string {
  return `${zoneId}|${year}`
}

// ── Résolution de l'id zone depuis une cible retournée par l'API ──────────────
// L'API retourne : { localite: { id_loca: 143, ... } }

export function resolveCibleZoneId(cible: CibleCmrProjet): number | null {
  const loc = cible.localite
  if (!loc) return null

  // Objet complet retourné par l'API : { id_loca, code_loca, ... }
  if (typeof loc === 'object' && 'id_loca' in loc) {
    const id = Number((loc as { id_loca: number }).id_loca)
    return Number.isFinite(id) && id > 0 ? id : null
  }

  // Cas où la relation est juste un id numérique
  if (typeof loc === 'number') {
    return Number.isFinite(loc) && loc > 0 ? loc : null
  }

  return null
}

// ── Construction de l'état initial de la grille ───────────────────────────────

export function buildCibleCmrGridState({
  cibles,
  zoneIds,
  years,
}: {
  cibles:  CibleCmrProjet[]
  zoneIds: number[]           // ← id_loca (pas code_loca)
  years:   number[]
}): Record<string, CibleCmrGridCell> {
  const state: Record<string, CibleCmrGridCell> = {}

  // Initialiser toutes les cellules à vide
  for (const zoneId of zoneIds) {
    for (const year of years) {
      state[buildCibleCmrGridKey(zoneId, year)] = { value: '' }
    }
  }

  // Remplir avec les cibles existantes
  for (const cible of cibles) {
    const zoneId = resolveCibleZoneId(cible)
    const year   = Number(formatAnneeCible(cible.annee))
    if (zoneId == null || !Number.isFinite(year)) continue

    const key = buildCibleCmrGridKey(zoneId, year)
    if (!(key in state)) continue

    state[key] = {
      cibleId: cible.id_cible_indicateur_crp,
      value:
        cible.valeur_cible_indcateur_cmr == null
          ? ''
          : String(cible.valeur_cible_indcateur_cmr),
    }
  }

  return state
}

// ── Parsing valeur cellule ────────────────────────────────────────────────────

export function parseGridCellValue(raw: string): number | null {
  const trimmed = raw.trim()
  if (!trimmed) return null
  const parsed = Number(trimmed.replace(/\s/g, '').replace(',', '.'))
  return Number.isFinite(parsed) ? Math.trunc(parsed) : null
}

// ── Payload vers l'API ────────────────────────────────────────────────────────

export function buildCiblePayloadFromGridCell({
  zoneId,
  year,
  value,
  indicateurCmrId,
}: {
  zoneId:          number
  year:            number
  value:           number
  indicateurCmrId: number
}) {
  return {
    annee:                      year,
    valeur_cible_indcateur_cmr: value,
    code_indicateur_cmr:        indicateurCmrId,
    localite:                   zoneId,
  }
}

// ── Filtre cibles par indicateur ──────────────────────────────────────────────

export function filterCiblesForIndicateurCmrId(
  cibles:          CibleCmrProjet[],
  indicateurCrpId: number
): CibleCmrProjet[] {
  return cibles.filter(
    (cible) => resolveCodeIndicateurCrpForForm(cible) === indicateurCrpId
  )
}