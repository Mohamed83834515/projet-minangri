import tacheActivitePtbaService from "@/simadou/allSercices/tacheActivitePtbaService";
import { TacheActivitePtbaFormData } from "@/simadou/schemas/tacheActivitePtbaSchemas";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const suiviPtbaQueryKeys = {
    tachesAll: ['taches-activite-all'] as const,
    tachesActivite: (idActivite: number) =>
        ['taches-activite', idActivite] as const,
}

export const useGetAllTachesActivite = (enabled = true) =>
    useQuery({
        queryKey: suiviPtbaQueryKeys.tachesAll,
        queryFn: () => tacheActivitePtbaService.getAll(),
        enabled,
    })

export const useGetTachesByActivite = (idActivite: number) =>
    useQuery({
        queryKey: suiviPtbaQueryKeys.tachesActivite(idActivite),
        queryFn: () => tacheActivitePtbaService.getByActivite(idActivite),
        enabled: Number.isFinite(idActivite),
    })


export const useCreateTacheActivite = (idActivite: number) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (
      data: TacheActivitePtbaFormData
    ) => tacheActivitePtbaService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: suiviPtbaQueryKeys.tachesActivite(idActivite),
      })
      queryClient.invalidateQueries({ queryKey: suiviPtbaQueryKeys.tachesAll })
    },
  })
}

export const useUpdateTacheActivite = (idActivite: number) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number
      data: TacheActivitePtbaFormData 
    }) => tacheActivitePtbaService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: suiviPtbaQueryKeys.tachesActivite(idActivite),
      })
      queryClient.invalidateQueries({ queryKey: suiviPtbaQueryKeys.tachesAll })
    },
  })
}


export const useDeleteTachePtba = (id_ptba: number) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => tacheActivitePtbaService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: suiviPtbaQueryKeys.tachesActivite(id_ptba),
      })
    },
  })
}