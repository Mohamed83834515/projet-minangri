import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import versionPPMService from '@/simadou/allSercices/versionPPMService'
import { VersionPPMFormData } from '@/simadou/schemas/ppmShema'

export const versionPPMQueryKeys = {
  all: ['versions-ppm'] as const,
  list: () => [...versionPPMQueryKeys.all, 'list'] as const,
}

export const useGetVersionsPPM = () => {
  return useQuery({
    queryKey: versionPPMQueryKeys.list(),
    queryFn: () => versionPPMService.getAll(),})
}

export const useSaveVersionPPM = (isEdit: boolean, currentRow?: any, onSuccess?: () => void) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: VersionPPMFormData) =>
      isEdit && currentRow?.id_version_ppm

        ? versionPPMService.update(currentRow.id_version_ppm, data)
        : versionPPMService.create(data),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: versionPPMQueryKeys.list(),
      })
      toast.success(isEdit ? 'Version PPM modifiée avec succès' : 'Version PPM créée avec succès')
      onSuccess?.()
    },

    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Une erreur est survenue')
    },
  })
}

export const useDeleteVersionPPM = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => versionPPMService.delete(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: versionPPMQueryKeys.list(),
      })
      toast.success('Version PPM supprimée avec succès')
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Erreur lors de la suppression')
    },
  })
}