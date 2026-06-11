import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/axios/api'
import { generalParamsKeys } from './queries'
import type { GeneralParamsInput } from '@/simadou/schemas/generalParams.schema'
import type { GeneralParamsPatch } from '@/simadou/allTypes/generalParams'
import { toast } from 'sonner'

export function useUpdateGeneralParams() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: GeneralParamsPatch) =>
      apiClient.request<GeneralParamsInput>('/configuration/', {
        method: 'PATCH',
        data,
      }),

    onSuccess: () => {
      // Re-fetch to get the fresh transformed version
      queryClient.invalidateQueries({ queryKey: generalParamsKeys.single() })
      toast.success("Mise à jour enregistrée avec succès")
    },

    onError: () => {
      queryClient.invalidateQueries({ queryKey: generalParamsKeys.single() })
    },
  })
}