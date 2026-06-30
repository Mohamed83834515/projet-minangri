import { useActiveProgrammeCode } from "@/hooks/use-active-programme"
import { dashboardService } from "@/simadou/allSercices/dashbordService"
import versionPtbaService from "@/simadou/allSercices/versionPtbaService"
import { useQuery } from "@tanstack/react-query"

import { useMemo, useState } from 'react'
import type { VersionPtba } from '@/simadou/allTypes'
import {
  buildLatestVersionByAnneeMap,
  getAnneesDisponiblesFromVersions,
} from '@/simadou/lib/versionPtbaUtils'

export const ptbasProjetsVersionQueryKeys = {
  byVersion: (idVersion: number) =>
    ['versions-ptbas', idVersion, 'ptbas-projets'] as const,
}

export function useGetPtbasProjetsByVersion(versionId?: number) {
  return useQuery({
    queryKey: ptbasProjetsVersionQueryKeys.byVersion(versionId ?? 0),
    queryFn: () => versionPtbaService.getPtbasProjets(versionId!),
    enabled: versionId != null && versionId > 0,
  })
}

export function useDashboardAnneeSelection(versions: VersionPtba[]) {
  const anneesDisponibles = useMemo(
    () => getAnneesDisponiblesFromVersions(versions),
    [versions]
  )

  const versionsParAnnee = useMemo(
    () => buildLatestVersionByAnneeMap(versions),
    [versions]
  )

  const [anneeSelectionnee, setAnneeSelectionnee] = useState<number | null>(
    null
  )

  const selectedAnnee =
    anneeSelectionnee ??
    anneesDisponibles[0] ??
    new Date().getFullYear()

  const selectedVersion = versionsParAnnee.get(selectedAnnee) ?? null

  return {
    anneesDisponibles,
    selectedAnnee,
    setSelectedAnnee: setAnneeSelectionnee,
    selectedVersion,
  }
}

export const useGetAvancementDirections = () => {
  const codeProgramme = useActiveProgrammeCode()

  return useQuery({
    queryKey: ['avancement-direction-all', codeProgramme],
    queryFn: () => dashboardService.avancementParDirections(codeProgramme!),
    enabled: !!codeProgramme,
  })
}