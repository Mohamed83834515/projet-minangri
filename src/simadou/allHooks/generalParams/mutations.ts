// features/params/generalParams.mutations.ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/axios/api'
import { generalParamsKeys } from './queries'
import type { GeneralParams } from '@/simadou/allTypes/generalParams'

export function useUpdateGeneralParams() {
  const queryClient = useQueryClient()

  return useMutation({
  
   mutationFn: (data: Partial<GeneralParams>) =>
  apiClient.request<GeneralParams>('/params', {
    method: 'PATCH',
    data,
  }),

    
    onSuccess: (updatedParams) => {
      
      queryClient.setQueryData<GeneralParams>(
        generalParamsKeys.single(),
        updatedParams
      )
    },

    onError: () => {
     
      queryClient.invalidateQueries({ queryKey: generalParamsKeys.single() })
    },
  })
}