import type { Acteur } from '@/simadou/allTypes/acteur'
import type { CadreAnalytique, NiveauCadreAnalytique } from '@/simadou/allTypes/cadreAnalytique'
import type { Programme } from '@/simadou/allTypes/programme'
import { resolveRelationId } from '@/simadou/lib/resolveApiRelation'

export function resolveProgrammeCode(
  value: NiveauCadreAnalytique['programme'] | Programme | undefined
): string | null {
  if (!value) return null
  if (typeof value === 'string') return value
  if (typeof value === 'object') return value.code_programme ?? null
  return null
}

export function resolveProgrammeId(
  value: NiveauCadreAnalytique['programme'] | Programme | undefined
): number | null {
  return resolveRelationId(value, 'id_programme')
}

export function filterNiveauxByProgramme(
  niveaux: NiveauCadreAnalytique[],
  codeProgramme: string | undefined,
  programmeId?: number
): NiveauCadreAnalytique[] {
  if (!codeProgramme?.trim() && !programmeId) return []
  return niveaux.filter((n) => {
    const code = resolveProgrammeCode(n.programme)
    if (codeProgramme && code === codeProgramme) return true
    const id = resolveProgrammeId(n.programme)
    return programmeId != null && id === programmeId
  })
}

export function sortNiveauxCadreAnalytique(
  niveaux: NiveauCadreAnalytique[]
): NiveauCadreAnalytique[] {
  return [...niveaux].sort(
    (a, b) => Number(a.code_number_nca) - Number(b.code_number_nca)
  )
}

export function getNextNiveauCadreAnalytique(
  niveaux: NiveauCadreAnalytique[],
  currentNiveauCodeNumber: number
): NiveauCadreAnalytique | null {
  const sorted = sortNiveauxCadreAnalytique(niveaux)
  const index = sorted.findIndex(
    (n) => Number(n.code_number_nca) === currentNiveauCodeNumber
  )
  if (index < 0 || index >= sorted.length - 1) return null
  return sorted[index + 1] ?? null
}

export function buildChildCountByParentCaId(
  cadres: CadreAnalytique[],
  nextNiveauCodeNumber: number
): Map<number, number> {
  const counts = new Map<number, number>()
  for (const cadre of cadres) {
    if (resolveNiveauCaNumber(cadre.niveau_ca) !== nextNiveauCodeNumber) continue
    const parentId = resolveParentCaId(cadre.parent_ca)
    if (parentId == null) continue
    counts.set(parentId, (counts.get(parentId) ?? 0) + 1)
  }
  return counts
}

export function resolveNiveauCaNumber(
  value: CadreAnalytique['niveau_ca']
): number | null {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : null
}

export function resolveParentCaId(
  value: CadreAnalytique['parent_ca']
): number | null {
  return resolveRelationId(value, 'id_ca')
}

export function resolvePartenaireCaIds(
  value: CadreAnalytique['partenaire_ca']
): number[] {
  if (value == null) return []
  if (Array.isArray(value)) {
    return value
      .map((item) => resolveRelationId(item, 'id_acteur'))
      .filter((id): id is number => id != null)
  }
  const id = resolveRelationId(value, 'id_acteur')
  return id != null ? [id] : []
}

/** Valeurs initiales du multiselect acteurs — uniquement les IDs présents dans la liste. */
export function toPartenaireCaFormValue(
  value: CadreAnalytique['partenaire_ca'] | undefined,
  acteurs: Pick<Acteur, 'id_acteur'>[]
): number[] {
  return resolvePartenaireCaIds(value ?? null).filter((id) =>
    acteurs.some((a) => a.id_acteur === id)
  )
}

export function buildCadreAnalytiqueParentOptions({
  cadres,
  niveauCodeNumber,
  excludeCadreId,
}: {
  cadres: CadreAnalytique[]
  niveauCodeNumber: number
  excludeCadreId?: number
}) {
  return cadres
    .filter((cadre) => {
      const cadreNiveau = resolveNiveauCaNumber(cadre.niveau_ca)
      return (
        cadreNiveau != null &&
        cadreNiveau === niveauCodeNumber - 1 &&
        cadre.id_ca !== excludeCadreId
      ) 
    })
    .map((cadre) => ({
      value: cadre.id_ca,
      label: `${cadre.code_ca} - ${cadre.intutile_ca}`,
    }))
}

export function getFixedCodeLengthForNiveau(
  niveaux: NiveauCadreAnalytique[],
  niveauCodeNumber: number,
  codeProgramme?: string
): number {
  const scoped = codeProgramme?.trim()
    ? filterNiveauxByProgramme(niveaux, codeProgramme)
    : niveaux

  const niveauConfig = scoped.find(
    (n) => Number(n.code_number_nca) === niveauCodeNumber
  )
  return Number(niveauConfig?.nombre_nca) || 2
}

export function getNiveauCadreAnalytiqueLibelle(
  niveaux: NiveauCadreAnalytique[],
  niveauCodeNumber: number,
  codeProgramme?: string
): string {
  const scoped = codeProgramme?.trim()
    ? filterNiveauxByProgramme(niveaux, codeProgramme)
    : niveaux

  const niveauConfig = scoped.find(
    (n) => Number(n.code_number_nca) === niveauCodeNumber
  )
  return niveauConfig?.libelle_nca ?? ''
}
