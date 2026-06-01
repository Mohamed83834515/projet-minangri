import { useQuery } from '@tanstack/react-query'
import { acteurService } from '@/simadou/allSercices/acteurService'
import { localiteService } from '@/simadou/allSercices/localiteService'

export const sharedQueryKeys = {
  acteurs: ['acteurs'] as const,
  localites: ['localites'] as const,
}

/** Tous les acteurs (données de référence partagées). */
export const useGetActeurs = () =>
  useQuery({
    queryKey: sharedQueryKeys.acteurs,
    queryFn: () => acteurService.getAll(),
  })

/** Toutes les localités (données de référence partagées). */
export const useGetLocalites = () =>
  useQuery({
    queryKey: sharedQueryKeys.localites,
    queryFn: () => localiteService.getAll(),
  })
