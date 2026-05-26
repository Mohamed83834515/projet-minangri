import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import ptbaService from '@/simadou/allSercices/ptbaService'
import { PROGRAMME_CODE_PTBA } from '@/simadou/constants/programmation'
import { toast } from 'sonner'
export const useGetPtbas = () => {
  return useQuery({
    queryKey: ['ptba-activites-all', PROGRAMME_CODE_PTBA],
    queryFn: () => ptbaService.getAll(PROGRAMME_CODE_PTBA),
  })
}

export const useDeletePtba = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => ptbaService.delete(id),
    onSuccess: () => {
      toast.success("Activité PTBA supprimée avec succès")
      queryClient.invalidateQueries({ queryKey: ['ptba-activites-all', PROGRAMME_CODE_PTBA] })
    },
    onError: () => {
      toast.error("Erreur lors de la suppression de l'activité PTBA")
    },
  })
}