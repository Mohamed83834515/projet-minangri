import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import ptbaService from '@/simadou/allSercices/ptbaService'
import { useActiveProgrammeCode } from '@/hooks/use-active-project'
import { toast } from 'sonner'

const codeProgramme = useActiveProgrammeCode()

const queryClient = useQueryClient()
export const useGetPtbas = () => {

  return useQuery({
    queryKey: ['ptba-activites-all', codeProgramme],
    queryFn: () => ptbaService.getAll(codeProgramme!),
    enabled: !!codeProgramme,
  })
}
export const useDeletePtba = () => {

  return useMutation({
    mutationFn: (id: number) => ptbaService.delete(id),
    onSuccess: () => {
      toast.success("Activité PTBA supprimée avec succès")
      queryClient.invalidateQueries({ queryKey: ['ptba-activites-all', codeProgramme] })
    },
    onError: () => {
      toast.error("Erreur lors de la suppression de l'activité PTBA")
    },
  })
}