import indicateurTacheService from "@/simadou/allSercices/indicateurTacheService";
import { IndicateurTache } from "@/simadou/allTypes/indicateurTache";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const suiviPtbaQueryKeys = {
    indicateurs: (id_ptba: number) =>
        ['indicateurs-tache', id_ptba] as const,
    localites: ['localites'] as const,
}

export const useGetIndicateursByActivite = (id_ptba: number) =>
  useQuery({
    queryKey: suiviPtbaQueryKeys.indicateurs(id_ptba),
    queryFn: () => indicateurTacheService.getByActivite(id_ptba),
    enabled: !!id_ptba,
  })

export const useCreateIndicateurTache = (id_ptba: number) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: IndicateurTache) =>
      indicateurTacheService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: suiviPtbaQueryKeys.indicateurs(id_ptba),
      })
    },
  })
}

export const useUpdateIndicateurTache = (id_ptba: number) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number
      data: IndicateurTache
    }) => indicateurTacheService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: suiviPtbaQueryKeys.indicateurs(id_ptba),
      })
    },
  })
}

export const useDeleteSuiviIndicateur = (id_ptba: number) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => indicateurTacheService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: suiviPtbaQueryKeys.indicateurs(id_ptba),
      })
    },
  })
}
