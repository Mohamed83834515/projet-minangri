import { useEffect, useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import type { Programme } from '@/simadou/allTypes/programme'
import type { VersionPtba } from '@/simadou/allTypes'
import versionPtbaService from '@/simadou/allSercices/versionPtbaService'

export const useGetVersions = () => {
  return useQuery({
    queryKey: ['versions-ptba'],
    queryFn: () => versionPtbaService.getAll(),
  })
}

function normalizeProgrammeCode(code: string): string {
  return code.trim()
}

/** Compare codes (ex. "002" et "2" si l'API renvoie des formats différents). */
export function programmeCodesMatch(a: string, b: string): boolean {
  const left = normalizeProgrammeCode(a)
  const right = normalizeProgrammeCode(b)
  if (left === right) return true
  const strip = (s: string) => s.replace(/^0+/, '') || '0'
  return strip(left) === strip(right)
}

/**
 * Indique si une version PTBA appartient au programme actif.
 * L'API peut renvoyer `programme` comme code string ou objet Programme imbriqué.
 */
export function versionBelongsToProgramme(
  version: VersionPtba,
  codeProgramme: string | undefined
): boolean {
  if (!codeProgramme?.trim()) return false

  const raw = version.programme
  if (typeof raw === 'string') {
    return programmeCodesMatch(raw, codeProgramme)
  }
  if (raw && typeof raw === 'object') {
    const nested = raw as Programme
    if (nested.code_programme) {
      return programmeCodesMatch(nested.code_programme, codeProgramme)
    }
  }
  return false
}

/** Version PTBA + filtre programme pour les listes PTBA / suivi PTBA. */
export function usePtbaVersionSelection(codeProgramme: string | undefined) {
  const { data: versions = [] } = useGetVersions()
  const [selectedVersionId, setSelectedVersionId] = useState<string | null>(null)

  const versionsForProgramme = useMemo(
    () =>
      versions.filter((v) => versionBelongsToProgramme(v, codeProgramme)),
    [versions, codeProgramme]
  )

  const versionOptions = useMemo(
    () =>
      versionsForProgramme.map((version: VersionPtba) => ({
        label: `${version.version_ptba || `Version ${version.id_version_ptba}`} - ${version.annee_ptba}`,
        value: version.id_version_ptba.toString(),
      })),
    [versionsForProgramme]
  )

  useEffect(() => {
    if (!codeProgramme) {
      setSelectedVersionId(null)
      return
    }

    if (versionsForProgramme.length === 0) {
      setSelectedVersionId(null)
      return
    }

    const currentYear = new Date().getFullYear()
    const preferred =
      versionsForProgramme.find((v) => v.annee_ptba === currentYear) ??
      versionsForProgramme[0]

    setSelectedVersionId(preferred.id_version_ptba.toString())
  }, [codeProgramme, versionsForProgramme])

  return {
    selectedVersionId,
    setSelectedVersionId,
    versionOptions,
    versionsForProgramme,
  }
}
