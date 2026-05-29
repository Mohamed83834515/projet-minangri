import { useQuery } from '@tanstack/react-query'
import { uniteIndicateurService } from '@/simadou/allSercices/uniteIndicateurService'

export const uniteIndicateurQueryKeys = {
  all: ['unites-indicateur'] as const,
}

export function useGetUnitesIndicateur() {
  return useQuery({
    queryKey: uniteIndicateurQueryKeys.all,
    queryFn: () => uniteIndicateurService.getAll(),
  })
}

