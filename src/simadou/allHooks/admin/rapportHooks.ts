import { useQueries } from '@tanstack/react-query'
import type { SuiviAvancementContrat } from '@/simadou/allTypes'
import suiviAvancementContratService from '@/simadou/allSercices/suiviAvancementContratService'
import { suiviPtbaQueryKeys } from './suiviPtbaHooks'

export function useObservationsByActiviteIds(activiteIds: number[]) {
  const queries = useQueries({
    queries: activiteIds.map((id) => ({
      queryKey: suiviPtbaQueryKeys.suiviAvancement(id),
      queryFn: () => suiviAvancementContratService.getByActivite(id),
      enabled: Number.isFinite(id),
    })),
  })

  const observationsByActivite = new Map<number, SuiviAvancementContrat[]>()
  activiteIds.forEach((id, index) => {
    observationsByActivite.set(id, queries[index]?.data ?? [])
  })

  return {
    observationsByActivite,
    isLoading:
      activiteIds.length > 0 && queries.some((query) => query.isLoading),
  }
}
