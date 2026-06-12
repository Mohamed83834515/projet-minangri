import { useEffect, useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { Programme } from '@/simadou/allTypes/programme'
import type { VersionPtba } from '@/simadou/allTypes'
import versionPtbaService from '@/simadou/allSercices/versionPtbaService'
import { useActiveProgrammeCode } from '@/hooks/use-active-programme'
import { toast } from 'sonner'

export const useGetVersions = () => {
  const codeProgramme = useActiveProgrammeCode()

  return useQuery({
    queryKey: ['versions-ptba', codeProgramme],
    queryFn: async () => {
      const allVersions = await versionPtbaService.getAll()
      if (!codeProgramme) return []
      // Filtrer par programme - la version a une propriété 'programme' qui contient l'objet programme
      return allVersions.filter(version =>
        version.programme &&
        typeof version.programme === 'object' &&
        version.programme.code_programme === codeProgramme
      )
    },
    enabled: !!codeProgramme,
  })
}
export const useSaveVersion = (
  isEdit: boolean,
  currentRow?: any,
  onSuccess?: () => void
) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ data, file }: { data: any; file?: File }) =>
      isEdit && currentRow?.id_version  // ✅ Utiliser id_version au lieu de id_type
        ? versionPtbaService.update(currentRow.id_version, data, file)
        : versionPtbaService.create(data, file),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["versions-ptba"],
      })

      toast.success(
        isEdit
          ? "Version PTBA modifiée avec succès"
          : "Version PTBA créée avec succès"
      )

      onSuccess?.()
    },

    onError: (error: any) => {
      console.error("Erreur version PTBA:", error)
      toast.error(
        error?.response?.data?.message ||
        "Une erreur est survenue lors de l'enregistrement"
      )
    },
  })
}

export const useDeleteVersion = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => versionPtbaService.delete(id),
    onSuccess: () => {
      toast.success('Version PTBA supprimée avec succès')
      queryClient.invalidateQueries({
        queryKey: ['versions-ptba'],
      })
    },
    onError: () => {
      toast.error("Erreur lors de la suppression de la version PTBA")
    },
  })
}

export const useValiderVersion = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: versionPtbaService.valider,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["versions-ptba"] });
      toast.success("Version validée avec succès");
    },
    onError: () => {
      toast.error("Erreur lors de la validation");
    },
  });
}

export const useArchiverVersion = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: versionPtbaService.archiver,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["versions-ptba"] });
      toast.success("Version archivée avec succès");
    },
    onError: () => {
      toast.error("Erreur lors de l'archivage");
    },
  });
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

const SELECTED_VERSION_STORAGE_KEY = 'selectedVersionId'

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

    const stored = localStorage.getItem(SELECTED_VERSION_STORAGE_KEY)
    if (
      stored &&
      versionsForProgramme.some(
        (v) => v.id_version_ptba.toString() === stored
      )
    ) {
      setSelectedVersionId(stored)
      return
    }

    const currentYear = new Date().getFullYear()
    const preferred =
      versionsForProgramme.find((v) => v.annee_ptba === currentYear) ??
      versionsForProgramme[0]

    const preferredId = preferred.id_version_ptba.toString()
    setSelectedVersionId(preferredId)
    localStorage.setItem(SELECTED_VERSION_STORAGE_KEY, preferredId)
  }, [codeProgramme, versionsForProgramme])

  const handleChangeVersion = (versionId: string | null) => {
    setSelectedVersionId(versionId)
    if (versionId) {
      localStorage.setItem(SELECTED_VERSION_STORAGE_KEY, versionId)
    } else {
      localStorage.removeItem(SELECTED_VERSION_STORAGE_KEY)
    }
  }

  return {
    selectedVersionId,
    setSelectedVersionId: handleChangeVersion,
    handleChangeVersion,
    versionOptions,
    versionsForProgramme,
  }
}
