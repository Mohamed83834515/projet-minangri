import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { conventionService } from '@/simadou/allSercices/conventionService'
import type { ConventionFormData } from '@/simadou/schemas/conventionSchema'

export const conventionQueryKeys = {
  all: ['conventions'] as const,
  list: () => [...conventionQueryKeys.all, 'list'] as const,
}

export const useGetConventions = () =>
  useQuery({
    queryKey: conventionQueryKeys.list(),
    queryFn: () => conventionService.getAll(),
  })

export const useSaveConvention = (
  isEdit: boolean,
  currentRow?: { id_convention?: number } | null,
  onSuccess?: () => void
) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: ConventionFormData) =>
      isEdit && currentRow?.id_convention
        ? conventionService.update(currentRow.id_convention, data)
        : conventionService.create(data),
    meta: { suppressGlobalErrorToast: true },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: conventionQueryKeys.list(),
      })
      toast.success(
        isEdit ? 'Convention modifiée avec succès' : 'Convention créée avec succès'
      )
      onSuccess?.()
    },
    onError: () => {
      toast.error('Erreur lors de la sauvegarde de la convention')
    },
  })
}

export const useDeleteConvention = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => conventionService.delete(id),
    meta: { suppressGlobalErrorToast: true },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: conventionQueryKeys.list(),
      })
      toast.success('Convention supprimée avec succès')
    },
    onError: () => {
      toast.error('Erreur lors de la suppression de la convention')
    },
  })
}
